#!/usr/bin/env python3
"""CopywriterOS — Transcribe seminar audio files via AssemblyAI.

Usage:
    python3 squads/copywriter-os/scripts/transcribe-seminars.py

Requires ASSEMBLYAI_API_KEY in .env
"""

import os
import sys
import time
from pathlib import Path

# Load .env
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key == "ASSEMBLYAI_API_KEY":
                os.environ[key] = value

import requests

SEMINARS_DIR = Path(__file__).resolve().parent.parent / "data" / "books" / "gary-halbert" / "seminars"

def main():
    api_key = os.getenv("ASSEMBLYAI_API_KEY", "")
    if not api_key:
        print("ERROR: ASSEMBLYAI_API_KEY not found in .env")
        sys.exit(1)

    # Find all mp3 files without a corresponding transcript
    mp3_files = sorted(SEMINARS_DIR.glob("*.mp3"))

    if not mp3_files:
        print("No MP3 files found in", SEMINARS_DIR)
        return

    print("=" * 60)
    print("  CopywriterOS — Seminar Transcription (AssemblyAI)")
    print(f"  Directory: {SEMINARS_DIR}")
    print(f"  Files: {len(mp3_files)}")
    print("=" * 60)
    print()

    for mp3 in mp3_files:
        transcript_path = mp3.with_suffix(".transcript.txt")

        # Skip if transcript already exists
        if transcript_path.exists() and transcript_path.stat().st_size > 500:
            print(f"  SKIP: {mp3.name} (transcript exists)")
            continue

        print(f"  TRANSCRIBING: {mp3.name}")
        print(f"    Size: {mp3.stat().st_size / 1024 / 1024:.1f} MB")

        start = time.time()

        try:
            # Step 1: Upload file
            print("    Uploading...")
            headers = {"authorization": api_key}
            with open(mp3, "rb") as f:
                upload_resp = requests.post(
                    "https://api.assemblyai.com/v2/upload",
                    headers=headers,
                    data=f,
                    timeout=300,
                )
            upload_resp.raise_for_status()
            upload_url = upload_resp.json()["upload_url"]
            print(f"    Uploaded: {upload_url[:60]}...")

            # Step 2: Create transcription
            print("    Transcribing...")
            transcript_resp = requests.post(
                "https://api.assemblyai.com/v2/transcript",
                headers={**headers, "content-type": "application/json"},
                json={
                    "audio_url": upload_url,
                    "speaker_labels": True,
                    "language_code": "en",
                    "speech_models": ["universal-2"],
                },
                timeout=30,
            )
            transcript_resp.raise_for_status()
            transcript_id = transcript_resp.json()["id"]
            print(f"    Transcript ID: {transcript_id}")

            # Step 3: Poll for completion
            while True:
                poll_resp = requests.get(
                    f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                    headers=headers,
                    timeout=30,
                )
                poll_resp.raise_for_status()
                result = poll_resp.json()
                status = result["status"]

                if status == "completed":
                    break
                elif status == "error":
                    print(f"    FAIL: {result.get('error', 'unknown error')}")
                    break
                else:
                    print(f"    Status: {status}...")
                    time.sleep(10)

            if status != "completed":
                continue

            elapsed = time.time() - start
            duration_min = result.get("audio_duration", 0) / 60
            print(f"    Done in {elapsed:.0f}s ({duration_min:.1f} min audio)")

            # Build output
            lines = []
            lines.append(f"SOURCE: YouTube (downloaded via yt-dlp)")
            lines.append(f"AUDIO: {mp3.name}")
            lines.append(f"TRANSCRIBED: {time.strftime('%Y-%m-%d %H:%M:%S')}")
            lines.append(f"ENGINE: AssemblyAI v2 API (speaker diarization)")
            lines.append(f"DURATION: {duration_min:.1f} minutes")
            lines.append("=" * 60)
            lines.append("")

            # Speaker-labeled output
            utterances = result.get("utterances", [])
            if utterances:
                for utt in utterances:
                    speaker = utt.get("speaker", "?")
                    text = utt.get("text", "")
                    lines.append(f"[Speaker {speaker}]: {text}")
                    lines.append("")
            else:
                lines.append(result.get("text", ""))

            with open(transcript_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines))

            size = transcript_path.stat().st_size
            print(f"    OK: {transcript_path.name} ({size:,} bytes)")

        except Exception as e:
            print(f"    FAIL: {e}")

    print()
    print("=" * 60)
    print("  Transcription complete!")
    print(f"  Output: {SEMINARS_DIR}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
