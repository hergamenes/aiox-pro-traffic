#!/usr/bin/env python3
"""CopywriterOS — Kortex Community (Circle.so) Content Extractor.

Extracts posts from Kortex Community spaces via Circle.so internal API.
Converts TipTap JSON body to clean Markdown.

Usage:
    # Extract Strategy Library (default)
    python3 squads/copywriter-os/scripts/extract-kortex.py

    # Extract specific space
    python3 squads/copywriter-os/scripts/extract-kortex.py --space-id 1440528

    # Custom output directory
    python3 squads/copywriter-os/scripts/extract-kortex.py --output-dir /path/to/output

    # Override community URL
    python3 squads/copywriter-os/scripts/extract-kortex.py --community-url https://other.circle.so

Requires CIRCLE_EMAIL and CIRCLE_PASSWORD in .env file.
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

import requests

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════

DEFAULT_COMMUNITY_URL = "https://community.kortex.co"
DEFAULT_SPACE_ID = 1440528  # Strategy Library
DEFAULT_OUTPUT_DIR = (
    "squads/squad-creator/minds/dan_koe/sources/courses/"
    "kortex-community/strategy-library"
)

SCRIPT_DIR = Path(__file__).resolve().parent
SQUAD_DIR = SCRIPT_DIR.parent
PROJECT_ROOT = SQUAD_DIR.parent.parent

# Known spaces for convenience
KNOWN_SPACES = {
    "strategy-library": 1440528,
    "event-recordings": 1484596,
    "creator-quick-start": 1405560,
}


# ═══════════════════════════════════════════════════════════════════════════
# ENV LOADER
# ═══════════════════════════════════════════════════════════════════════════


def load_env(community_url: str) -> tuple[str, str]:
    """Load CIRCLE_EMAIL and CIRCLE_PASSWORD from .env for the given community.

    The .env file has multiple Circle communities using the same var names.
    We find the block that matches the community_url and use those values.
    If no match, we use the last CIRCLE_EMAIL/CIRCLE_PASSWORD found.
    """
    env_path = PROJECT_ROOT / ".env"
    if not env_path.exists():
        print(f"ERROR: .env not found at {env_path}", file=sys.stderr)
        sys.exit(1)

    # Parse all CIRCLE credential blocks with their context (comments above)
    email = None
    password = None
    best_email = None
    best_password = None
    context_lines: list[str] = []

    with open(env_path) as f:
        for line in f:
            stripped = line.strip()

            # Track context (comments) to match community URL
            if stripped.startswith("#"):
                context_lines.append(stripped)
                continue

            if stripped.startswith("CIRCLE_EMAIL="):
                _, _, val = stripped.partition("=")
                email = val.strip().strip("'").strip('"')

                # Check if recent context mentions our community
                context_block = "\n".join(context_lines[-5:])
                # Extract domain from community_url for flexible matching
                domain = community_url.replace("https://", "").replace("http://", "").split("/")[0]
                if domain in context_block:
                    best_email = email

            elif stripped.startswith("CIRCLE_PASSWORD="):
                _, _, val = stripped.partition("=")
                password = val.strip().strip("'").strip('"')

                context_block = "\n".join(context_lines[-5:])
                domain = community_url.replace("https://", "").replace("http://", "").split("/")[0]
                if domain in context_block:
                    best_password = password

            # Reset context on blank lines
            if not stripped:
                context_lines.clear()

    # Prefer matched block, fallback to last found
    final_email = best_email or email
    final_password = best_password or password

    if not final_email or not final_password:
        print("ERROR: CIRCLE_EMAIL or CIRCLE_PASSWORD not found in .env", file=sys.stderr)
        sys.exit(1)

    return final_email, final_password


# ═══════════════════════════════════════════════════════════════════════════
# CIRCLE.SO CLIENT
# ═══════════════════════════════════════════════════════════════════════════


class CircleClient:
    """Circle.so internal API client using session-based auth."""

    def __init__(self, community_url: str, email: str, password: str):
        self.base_url = community_url.rstrip("/")
        self.email = email
        self.password = password
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/131.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json",
        })
        self._logged_in = False

    def login(self):
        """Authenticate via Circle.so sign_in endpoint."""
        if self._logged_in:
            return

        print(f"Logging in to {self.base_url}...")

        # Step 1: GET the sign_in page to obtain CSRF token
        login_page = self.session.get(
            f"{self.base_url}/users/sign_in",
            headers={"Accept": "text/html,application/xhtml+xml,*/*"},
            timeout=15,
        )
        login_page.raise_for_status()

        # Extract CSRF token from the page
        csrf_token = None
        # Try meta tag
        match = re.search(
            r'<meta\s+name="csrf-token"\s+content="([^"]+)"',
            login_page.text,
        )
        if match:
            csrf_token = match.group(1)
        else:
            # Try hidden input
            match = re.search(
                r'name="authenticity_token"\s+value="([^"]+)"',
                login_page.text,
            )
            if match:
                csrf_token = match.group(1)

        if not csrf_token:
            print("WARNING: Could not extract CSRF token. Login may fail.", file=sys.stderr)

        # Step 2: POST login
        post_headers = {
            "Accept": "text/html,application/xhtml+xml,*/*",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        if csrf_token:
            post_headers["X-CSRF-Token"] = csrf_token

        r = self.session.post(
            f"{self.base_url}/users/sign_in",
            data={
                "user[email]": self.email,
                "user[password]": self.password,
                "authenticity_token": csrf_token or "",
            },
            headers=post_headers,
            timeout=15,
            allow_redirects=True,
        )

        # Check if login succeeded (session cookie should be set)
        if r.status_code >= 400:
            print(f"ERROR: Login failed with status {r.status_code}", file=sys.stderr)
            sys.exit(1)

        # Verify by checking if we can access the community
        check = self.session.get(
            f"{self.base_url}/internal_api/community/",
            timeout=15,
        )
        if check.status_code == 401:
            print("ERROR: Login failed — session not authenticated.", file=sys.stderr)
            sys.exit(1)

        self._logged_in = True
        print("Login successful.")

    def get_posts(self, space_id: int, per_page: int = 50) -> list[dict]:
        """Fetch all posts from a space, handling pagination."""
        self.login()

        all_posts = []
        page = 1

        while True:
            url = (
                f"{self.base_url}/internal_api/spaces/{space_id}/posts"
                f"?per_page={per_page}&page={page}"
            )
            print(f"  Fetching page {page}...")
            r = self.session.get(url, timeout=30)

            if r.status_code == 404:
                print(f"ERROR: Space {space_id} not found.", file=sys.stderr)
                sys.exit(1)
            r.raise_for_status()

            data = r.json()

            # Circle returns {"records": [...], "has_next_page": bool}
            # or just a list depending on API version
            if isinstance(data, dict):
                records = data.get("records", data.get("posts", []))
                has_next = data.get("has_next_page", False)
            elif isinstance(data, list):
                records = data
                has_next = len(records) == per_page
            else:
                break

            if not records:
                break

            all_posts.extend(records)
            print(f"  Got {len(records)} posts (total: {len(all_posts)})")

            if not has_next:
                break
            page += 1

        return all_posts

    def get_post(self, post_id: int) -> dict:
        """Fetch a single post by ID."""
        self.login()

        url = f"{self.base_url}/internal_api/posts/{post_id}"
        r = self.session.get(url, timeout=30)
        r.raise_for_status()
        return r.json()


# ═══════════════════════════════════════════════════════════════════════════
# TIPTAP → MARKDOWN CONVERTER
# ═══════════════════════════════════════════════════════════════════════════


def tiptap_to_markdown(doc: dict | list | None) -> str:
    """Convert TipTap JSON document to Markdown text.

    Handles: paragraphs, headings, lists (ordered/unordered), blockquotes,
    code blocks, horizontal rules, images, and inline marks (bold, italic,
    code, links, strikethrough, underline).
    """
    if doc is None:
        return ""

    # Handle both full doc and content array
    if isinstance(doc, dict):
        content = doc.get("content", [])
    elif isinstance(doc, list):
        content = doc
    else:
        return str(doc)

    lines: list[str] = []
    for node in content:
        line = _convert_node(node, depth=0)
        if line is not None:
            lines.append(line)

    return "\n\n".join(lines).strip()


def _convert_node(node: dict, depth: int = 0) -> str | None:
    """Convert a single TipTap node to Markdown."""
    node_type = node.get("type", "")

    if node_type == "paragraph":
        return _convert_inline(node.get("content", []))

    elif node_type == "heading":
        level = node.get("attrs", {}).get("level", 1)
        text = _convert_inline(node.get("content", []))
        return f"{'#' * level} {text}"

    elif node_type == "bulletList":
        items = []
        for item in node.get("content", []):
            item_text = _convert_list_item(item, depth)
            items.append(f"{'  ' * depth}- {item_text}")
        return "\n".join(items)

    elif node_type == "orderedList":
        items = []
        start = node.get("attrs", {}).get("start", 1)
        for i, item in enumerate(node.get("content", []), start=start):
            item_text = _convert_list_item(item, depth)
            items.append(f"{'  ' * depth}{i}. {item_text}")
        return "\n".join(items)

    elif node_type == "listItem":
        return _convert_list_item(node, depth)

    elif node_type == "blockquote":
        inner = []
        for child in node.get("content", []):
            converted = _convert_node(child, depth)
            if converted:
                inner.append(converted)
        text = "\n".join(inner)
        return "\n".join(f"> {line}" for line in text.split("\n"))

    elif node_type == "codeBlock":
        lang = node.get("attrs", {}).get("language", "")
        text = _convert_inline(node.get("content", []))
        return f"```{lang}\n{text}\n```"

    elif node_type == "horizontalRule":
        return "---"

    elif node_type == "image":
        attrs = node.get("attrs", {})
        src = attrs.get("src", "")
        alt = attrs.get("alt", "")
        title = attrs.get("title", "")
        if title:
            return f'![{alt}]({src} "{title}")'
        return f"![{alt}]({src})"

    elif node_type == "hardBreak":
        return "  \n"

    elif node_type == "text":
        return _apply_marks(node.get("text", ""), node.get("marks", []))

    elif node_type in ("embed", "attachment", "video"):
        attrs = node.get("attrs", {})
        src = attrs.get("src", attrs.get("url", ""))
        if src:
            return f"[Embedded: {src}]({src})"
        return None

    elif node_type == "table":
        return _convert_table(node)

    else:
        # Unknown node — try to extract text content
        if "content" in node:
            parts = []
            for child in node["content"]:
                converted = _convert_node(child, depth)
                if converted:
                    parts.append(converted)
            return "\n\n".join(parts) if parts else None
        return None


def _convert_list_item(node: dict, depth: int) -> str:
    """Convert a listItem node, handling nested lists."""
    parts = []
    for child in node.get("content", []):
        child_type = child.get("type", "")
        if child_type in ("bulletList", "orderedList"):
            nested = _convert_node(child, depth + 1)
            if nested:
                parts.append("\n" + nested)
        else:
            converted = _convert_node(child, depth)
            if converted:
                parts.append(converted)
    return " ".join(parts) if parts else ""


def _convert_inline(content: list[dict]) -> str:
    """Convert inline content (text nodes with marks) to Markdown."""
    if not content:
        return ""

    parts = []
    for node in content:
        node_type = node.get("type", "")
        if node_type == "text":
            text = node.get("text", "")
            marks = node.get("marks", [])
            parts.append(_apply_marks(text, marks))
        elif node_type == "hardBreak":
            parts.append("  \n")
        elif node_type == "image":
            converted = _convert_node(node)
            if converted:
                parts.append(converted)
        elif node_type == "mention":
            attrs = node.get("attrs", {})
            parts.append(f"@{attrs.get('label', attrs.get('id', ''))}")
        else:
            # Recurse for unknown inline nodes
            converted = _convert_node(node)
            if converted:
                parts.append(converted)

    return "".join(parts)


def _apply_marks(text: str, marks: list[dict]) -> str:
    """Apply TipTap marks (bold, italic, code, link, etc.) to text."""
    if not marks:
        return text

    for mark in marks:
        mark_type = mark.get("type", "")
        if mark_type == "bold":
            text = f"**{text}**"
        elif mark_type == "italic":
            text = f"*{text}*"
        elif mark_type == "code":
            text = f"`{text}`"
        elif mark_type == "strike":
            text = f"~~{text}~~"
        elif mark_type == "underline":
            # Markdown has no native underline; use HTML
            text = f"<u>{text}</u>"
        elif mark_type == "link":
            href = mark.get("attrs", {}).get("href", "")
            if href:
                text = f"[{text}]({href})"
        elif mark_type == "highlight":
            text = f"=={text}=="
        elif mark_type == "superscript":
            text = f"<sup>{text}</sup>"
        elif mark_type == "subscript":
            text = f"<sub>{text}</sub>"

    return text


def _convert_table(node: dict) -> str:
    """Convert a TipTap table to Markdown table."""
    rows = node.get("content", [])
    if not rows:
        return ""

    md_rows: list[list[str]] = []
    for row in rows:
        cells = []
        for cell in row.get("content", []):
            cell_text = _convert_inline(cell.get("content", [{}])[0].get("content", []))
            cells.append(cell_text.strip())
        md_rows.append(cells)

    if not md_rows:
        return ""

    # Build markdown table
    lines = []
    # Header
    lines.append("| " + " | ".join(md_rows[0]) + " |")
    lines.append("| " + " | ".join("---" for _ in md_rows[0]) + " |")
    # Body
    for row in md_rows[1:]:
        # Pad row if needed
        while len(row) < len(md_rows[0]):
            row.append("")
        lines.append("| " + " | ".join(row) + " |")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:80]


def format_date(date_str: str | None) -> str:
    """Format an ISO date string to YYYY-MM-DD."""
    if not date_str:
        return datetime.now().strftime("%Y-%m-%d")
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except (ValueError, AttributeError):
        return date_str[:10] if date_str and len(date_str) >= 10 else "unknown"


def build_metadata_header(post: dict, community_url: str) -> str:
    """Build a YAML-style metadata header for the markdown file."""
    title = post.get("name", post.get("title", "Untitled"))
    post_id = post.get("id", "unknown")
    author_name = "unknown"

    # Extract author info
    user = post.get("user", post.get("author", {}))
    if isinstance(user, dict):
        author_name = user.get("name", user.get("username", "unknown"))

    created = format_date(post.get("created_at", post.get("published_at")))
    space_name = post.get("space", {}).get("name", "") if isinstance(post.get("space"), dict) else ""

    # Build post URL
    slug = post.get("slug", "")
    space_slug = ""
    if isinstance(post.get("space"), dict):
        space_slug = post["space"].get("slug", "")
    post_url = f"{community_url}/c/{space_slug}/{slug}" if slug and space_slug else ""

    lines = [
        "---",
        f'title: "{title}"',
        f"post_id: {post_id}",
        f"author: {author_name}",
        f"date: {created}",
    ]
    if space_name:
        lines.append(f"space: {space_name}")
    if post_url:
        lines.append(f"url: {post_url}")
    lines.append(f"extracted: {datetime.now().strftime('%Y-%m-%d')}")
    lines.append("---")
    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# MAIN EXTRACTION
# ═══════════════════════════════════════════════════════════════════════════


def extract_posts(
    client: CircleClient,
    space_id: int,
    output_dir: Path,
    community_url: str,
):
    """Extract all posts from a space and save as markdown files."""
    print(f"\nFetching posts from space {space_id}...")
    posts = client.get_posts(space_id)

    if not posts:
        print("No posts found.")
        return

    print(f"\nFound {len(posts)} posts. Extracting...\n")

    output_dir.mkdir(parents=True, exist_ok=True)
    extracted = 0

    for i, post in enumerate(posts, 1):
        title = post.get("name", post.get("title", "Untitled"))
        post_id = post.get("id", "unknown")
        slug = slugify(title)
        filename = f"{post_id}_{slug}.md"

        print(f"  [{i}/{len(posts)}] {title[:60]}...")

        # Extract body content
        body_md = ""

        # Try tiptap_body first (primary format)
        tiptap = post.get("tiptap_body")
        if isinstance(tiptap, dict):
            body_data = tiptap.get("body", tiptap)
            body_md = tiptap_to_markdown(body_data)
        elif isinstance(tiptap, str):
            try:
                parsed = json.loads(tiptap)
                body_data = parsed.get("body", parsed) if isinstance(parsed, dict) else parsed
                body_md = tiptap_to_markdown(body_data)
            except json.JSONDecodeError:
                body_md = tiptap

        # Fallback: try body_html or plain body
        if not body_md:
            body_html = post.get("body_html", post.get("body", ""))
            if body_html:
                # Basic HTML-to-text fallback (strip tags)
                body_md = re.sub(r"<[^>]+>", "", body_html)
                body_md = body_md.strip()

        # Fallback: serialized_rich_text_body (used in course lessons)
        if not body_md:
            srt = post.get("serialized_rich_text_body")
            if isinstance(srt, dict):
                body_data = srt.get("body", srt)
                body_md = tiptap_to_markdown(body_data)

        if not body_md:
            print(f"    WARNING: No body content found for post {post_id}")
            body_md = "(No content extracted)"

        # Build file content
        header = build_metadata_header(post, community_url)
        content = f"{header}\n\n# {title}\n\n{body_md}\n"

        # Write file
        filepath = output_dir / filename
        filepath.write_text(content, encoding="utf-8")
        extracted += 1

    print(f"\nDone. Extracted {extracted}/{len(posts)} posts to {output_dir}")

    # Also save raw JSON for debugging/re-processing
    raw_path = output_dir / "_raw_posts.json"
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2, default=str)
    print(f"Raw JSON saved to {raw_path}")


# ═══════════════════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════════════════


def main():
    parser = argparse.ArgumentParser(
        description="Extract posts from Kortex Community (Circle.so) spaces.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Known spaces:
  strategy-library   1440528   Strategy Library (19 articles)
  event-recordings   1484596   Event Recordings
  creator-quick-start 1405560  Creator Quick Start Course

Examples:
  %(prog)s                                    # Strategy Library (default)
  %(prog)s --space-id 1484596                 # Event Recordings
  %(prog)s --space-id strategy-library        # By name
  %(prog)s --output-dir ./my-output           # Custom output
        """,
    )

    parser.add_argument(
        "--space-id",
        default=str(DEFAULT_SPACE_ID),
        help=(
            f"Space ID (numeric) or known name ({', '.join(KNOWN_SPACES.keys())}). "
            f"Default: {DEFAULT_SPACE_ID}"
        ),
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help=f"Output directory. Default: {DEFAULT_OUTPUT_DIR}",
    )
    parser.add_argument(
        "--community-url",
        default=DEFAULT_COMMUNITY_URL,
        help=f"Circle.so community URL. Default: {DEFAULT_COMMUNITY_URL}",
    )

    args = parser.parse_args()

    # Resolve space ID
    space_id_input = args.space_id
    if space_id_input in KNOWN_SPACES:
        space_id = KNOWN_SPACES[space_id_input]
        space_name = space_id_input
    else:
        try:
            space_id = int(space_id_input)
            # Reverse lookup
            space_name = next(
                (name for name, sid in KNOWN_SPACES.items() if sid == space_id),
                f"space-{space_id}",
            )
        except ValueError:
            print(
                f"ERROR: '{space_id_input}' is not a valid space ID or known name.",
                file=sys.stderr,
            )
            print(f"Known spaces: {', '.join(KNOWN_SPACES.keys())}", file=sys.stderr)
            sys.exit(1)

    # Resolve output directory
    if args.output_dir:
        output_dir = Path(args.output_dir).resolve()
    else:
        # Use default path based on space name
        base = (
            PROJECT_ROOT
            / "squads"
            / "squad-creator"
            / "minds"
            / "dan_koe"
            / "sources"
            / "courses"
            / "kortex-community"
        )
        output_dir = base / space_name

    community_url = args.community_url.rstrip("/")

    # Load credentials
    email, password = load_env(community_url)

    print(f"Community:  {community_url}")
    print(f"Space:      {space_name} ({space_id})")
    print(f"Output:     {output_dir}")
    print()

    # Create client and extract
    client = CircleClient(community_url, email, password)
    extract_posts(client, space_id, output_dir, community_url)


if __name__ == "__main__":
    main()
