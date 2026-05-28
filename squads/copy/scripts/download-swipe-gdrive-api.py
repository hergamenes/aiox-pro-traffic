#!/usr/bin/env python3
"""CopywriterOS — Google Drive Swipe File Downloader (API Key, no OAuth).

Downloads all files from a public Google Drive folder recursively using the
Google Drive API v3. Handles Google Workspace files (Docs, Sheets, Slides)
via export. Uses API key auth — no OAuth required for public folders.

Usage:
    python3 squads/copywriter-os/scripts/download-swipe-gdrive-api.py \\
        --api-key AIza... \\
        --folder-id 125ukhHDuUCja1TZiZXjHfstxoyKT-bLc \\
        --dest squads/copywriter-os/data/swipe-files/copy-resources-and-swipes

    # Only download into locally-present but empty folders:
    python3 ... --only-empty

Requires:
    pip install google-api-python-client requests
"""

import argparse
import os
import sys
import time
import re
from pathlib import Path

import requests
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ═══════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

DRIVE_DOWNLOAD_URL = "https://www.googleapis.com/drive/v3/files/{file_id}"
DRIVE_EXPORT_URL   = "https://www.googleapis.com/drive/v3/files/{file_id}/export"

# Delay between individual file downloads (rate-limit safety)
DOWNLOAD_DELAY = 2  # seconds

# Exponential backoff delays for 403/429 responses (seconds)
BACKOFF_DELAYS = [30, 60, 120]

# Max file size to stream (safety guard: 500 MB)
MAX_FILE_SIZE = 500 * 1024 * 1024

# MIME type mapping: Google Workspace → export format + extension
WORKSPACE_EXPORT_MAP = {
    "application/vnd.google-apps.document":     ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    "application/vnd.google-apps.spreadsheet":  ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
    "application/vnd.google-apps.presentation": ("application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"),
    "application/vnd.google-apps.drawing":      ("image/png", ".png"),
    "application/vnd.google-apps.script":       ("application/vnd.google-apps.script+json", ".json"),
    "application/vnd.google-apps.form":         ("application/zip", ".zip"),
}

# MIME types that cannot be downloaded (skip silently)
SKIP_MIME_TYPES = {
    "application/vnd.google-apps.shortcut",
    "application/vnd.google-apps.folder",
    "application/vnd.google-apps.site",
    "application/vnd.google-apps.jam",
}


# ═══════════════════════════════════════════════════════════════════════════
# DRIVE API HELPERS
# ═══════════════════════════════════════════════════════════════════════════

def build_service(api_key: str):
    """Build and return a Drive API v3 service (API-key auth, no OAuth)."""
    return build("drive", "v3", developerKey=api_key, cache_discovery=False)


def list_children(service, folder_id: str, page_size: int = 200) -> list[dict]:
    """List all items (files + subfolders) in a Drive folder. Handles pagination."""
    results = []
    page_token = None
    query = f"'{folder_id}' in parents and trashed = false"

    while True:
        params = {
            "q": query,
            "pageSize": page_size,
            "fields": "nextPageToken, files(id, name, mimeType, size)",
        }
        if page_token:
            params["pageToken"] = page_token

        try:
            response = service.files().list(**params).execute()
        except HttpError as e:
            raise RuntimeError(f"Drive API error listing folder {folder_id}: {e}") from e

        results.extend(response.get("files", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return results


def is_workspace_type(mime_type: str) -> bool:
    return mime_type.startswith("application/vnd.google-apps.")


def get_export_info(mime_type: str) -> tuple[str, str] | None:
    """Return (export_mime, extension) for a Google Workspace type, or None if unsupported."""
    return WORKSPACE_EXPORT_MAP.get(mime_type)


# ═══════════════════════════════════════════════════════════════════════════
# DOWNLOAD WITH RETRY
# ═══════════════════════════════════════════════════════════════════════════

def sanitize_filename(name: str) -> str:
    """Remove characters that are problematic on most filesystems."""
    # Replace path separators and control characters
    name = re.sub(r'[/\\:*?"<>|]', "_", name)
    # Collapse multiple spaces/underscores
    name = re.sub(r'[ _]{2,}', " ", name).strip()
    return name


def download_with_retry(url: str, dest: Path, params: dict) -> bool:
    """
    Stream a file to disk with exponential backoff on 403/429.
    Returns True on success, False on failure.
    """
    for attempt, backoff in enumerate([0] + BACKOFF_DELAYS):
        if backoff:
            print(f"      [backoff] waiting {backoff}s before retry {attempt}/{len(BACKOFF_DELAYS)}...")
            time.sleep(backoff)

        try:
            resp = requests.get(url, params=params, stream=True, timeout=120)

            if resp.status_code in (403, 429):
                print(f"      [rate-limit] HTTP {resp.status_code} on attempt {attempt + 1}")
                continue  # Will sleep on next iteration

            if resp.status_code == 404:
                print(f"      [skip] 404 Not Found")
                return False

            resp.raise_for_status()

            # Stream to disk
            dest.parent.mkdir(parents=True, exist_ok=True)
            bytes_written = 0
            with open(dest, "wb") as fh:
                for chunk in resp.iter_content(chunk_size=65536):
                    fh.write(chunk)
                    bytes_written += len(chunk)
                    if bytes_written > MAX_FILE_SIZE:
                        print(f"      [warn] file exceeds {MAX_FILE_SIZE // 1024 // 1024} MB limit, aborting")
                        fh.close()
                        dest.unlink(missing_ok=True)
                        return False

            return True

        except requests.exceptions.RequestException as e:
            print(f"      [error] network error: {e}")
            if attempt == len(BACKOFF_DELAYS):
                return False
            continue

    print(f"      [fail] exhausted retries for {dest.name}")
    return False


# ═══════════════════════════════════════════════════════════════════════════
# CORE DOWNLOAD LOGIC
# ═══════════════════════════════════════════════════════════════════════════

def download_file(file_meta: dict, dest_dir: Path, api_key: str) -> str:
    """
    Download a single Drive file into dest_dir.
    Returns one of: 'ok', 'skip', 'fail', 'unsupported'.
    """
    file_id   = file_meta["id"]
    file_name = sanitize_filename(file_meta["name"])
    mime_type = file_meta.get("mimeType", "")

    # Skip types we cannot handle
    if mime_type in SKIP_MIME_TYPES:
        return "unsupported"

    # Google Workspace file — needs export
    if is_workspace_type(mime_type):
        export_info = get_export_info(mime_type)
        if not export_info:
            print(f"      [skip] unsupported Workspace type: {mime_type}")
            return "unsupported"

        export_mime, ext = export_info
        # Ensure the filename has the correct extension
        if not file_name.lower().endswith(ext):
            file_name = file_name + ext

        dest_path = dest_dir / file_name
        if dest_path.exists():
            return "skip"

        url    = DRIVE_EXPORT_URL.format(file_id=file_id)
        params = {"mimeType": export_mime, "key": api_key}

    else:
        # Regular binary file — direct download via alt=media
        dest_path = dest_dir / file_name
        if dest_path.exists():
            return "skip"

        url    = DRIVE_DOWNLOAD_URL.format(file_id=file_id)
        params = {"alt": "media", "key": api_key}

    success = download_with_retry(url, dest_path, params)

    if success:
        size_kb = dest_path.stat().st_size // 1024
        print(f"      [ok] {file_name} ({size_kb:,} KB)")
        return "ok"
    else:
        # Clean up empty file if write started but failed
        dest_path.unlink(missing_ok=True)
        return "fail"


def process_folder(
    service,
    folder_id: str,
    folder_name: str,
    dest_dir: Path,
    api_key: str,
    only_empty: bool,
    stats: dict,
    depth: int = 0,
) -> None:
    """
    Recursively process a Drive folder: list contents, download files,
    descend into subfolders.
    """
    indent = "  " * depth
    print(f"\n{indent}[folder] {folder_name}")

    # --only-empty: skip if local dir exists and is non-empty
    if only_empty and dest_dir.exists():
        existing_files = [f for f in dest_dir.iterdir() if f.is_file()]
        if existing_files:
            print(f"{indent}  [skip] local folder not empty ({len(existing_files)} files)")
            stats["folders_skipped"] += 1
            return

    try:
        children = list_children(service, folder_id)
    except RuntimeError as e:
        print(f"{indent}  [error] {e}")
        stats["folders_failed"] += 1
        return

    files   = [c for c in children if c["mimeType"] != "application/vnd.google-apps.folder"]
    folders = [c for c in children if c["mimeType"] == "application/vnd.google-apps.folder"]

    print(f"{indent}  {len(files)} files, {len(folders)} subfolders")

    dest_dir.mkdir(parents=True, exist_ok=True)

    # Download files in this folder
    for i, file_meta in enumerate(files, 1):
        print(f"{indent}  [{i}/{len(files)}] {file_meta['name']}")
        result = download_file(file_meta, dest_dir, api_key)
        stats[result] = stats.get(result, 0) + 1
        if result == "ok":
            time.sleep(DOWNLOAD_DELAY)

    stats["folders_processed"] += 1

    # Recurse into subfolders
    for subfolder in folders:
        sub_name = sanitize_filename(subfolder["name"])
        sub_dest = dest_dir / sub_name
        process_folder(
            service=service,
            folder_id=subfolder["id"],
            folder_name=subfolder["name"],
            dest_dir=sub_dest,
            api_key=api_key,
            only_empty=only_empty,
            stats=stats,
            depth=depth + 1,
        )


# ═══════════════════════════════════════════════════════════════════════════
# CLI ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Download Google Drive public folder via Drive API v3 (API key auth)."
    )
    p.add_argument(
        "--api-key",
        default=os.environ.get("GOOGLE_API_KEY", ""),
        help="Google API key (or set GOOGLE_API_KEY env var)",
    )
    p.add_argument(
        "--folder-id",
        default="125ukhHDuUCja1TZiZXjHfstxoyKT-bLc",
        help="Root Google Drive folder ID",
    )
    p.add_argument(
        "--dest",
        default="squads/copywriter-os/data/swipe-files/copy-resources-and-swipes",
        help="Local destination directory (relative to cwd or absolute)",
    )
    p.add_argument(
        "--only-empty",
        action="store_true",
        help="Only process local folders that exist but are empty (skip folders with files)",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    if not args.api_key:
        print("ERROR: --api-key is required (or set GOOGLE_API_KEY env var)")
        sys.exit(1)

    dest = Path(args.dest)
    if not dest.is_absolute():
        dest = Path.cwd() / dest

    print("=" * 62)
    print("  CopywriterOS — Google Drive Swipe Downloader")
    print(f"  Folder ID : {args.folder_id}")
    print(f"  Dest      : {dest}")
    print(f"  Only-empty: {args.only_empty}")
    print(f"  Delay     : {DOWNLOAD_DELAY}s between files")
    print("=" * 62)

    # Build Drive service
    try:
        service = build_service(args.api_key)
    except Exception as e:
        print(f"ERROR: Failed to build Drive service: {e}")
        sys.exit(1)

    # Verify root folder is accessible
    try:
        root_meta = service.files().get(
            fileId=args.folder_id,
            fields="id, name, mimeType",
        ).execute()
    except HttpError as e:
        print(f"ERROR: Cannot access folder {args.folder_id}: {e}")
        print("  Check that the folder is public and the API key is valid.")
        sys.exit(1)

    root_name = root_meta.get("name", args.folder_id)
    print(f"  Root name : {root_name}")
    print()

    # Stats accumulator
    stats: dict = {
        "ok": 0,
        "skip": 0,
        "fail": 0,
        "unsupported": 0,
        "folders_processed": 0,
        "folders_skipped": 0,
        "folders_failed": 0,
    }

    start = time.time()

    process_folder(
        service=service,
        folder_id=args.folder_id,
        folder_name=root_name,
        dest_dir=dest,
        api_key=args.api_key,
        only_empty=args.only_empty,
        stats=stats,
        depth=0,
    )

    elapsed = time.time() - start

    # Final report
    print()
    print("=" * 62)
    print("  SUMMARY")
    print(f"  Downloaded   : {stats['ok']}")
    print(f"  Skipped      : {stats['skip']} (already existed)")
    print(f"  Unsupported  : {stats['unsupported']} (Workspace types with no export)")
    print(f"  Failed       : {stats['fail']}")
    print(f"  Folders done : {stats['folders_processed']}")
    print(f"  Folders skip : {stats['folders_skipped']} (--only-empty)")
    print(f"  Folders err  : {stats['folders_failed']}")
    print(f"  Elapsed      : {elapsed:.0f}s")
    print(f"  Dest         : {dest}")
    print("=" * 62)

    if stats["fail"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
