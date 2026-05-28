#!/usr/bin/env python3
"""
CopywriterOS — YouTube ETL (Wave 2)

Discovery → Caption Download → Fallback Transcription → Clean → Output

Inspired by clone-factory ETL squad patterns:
- youtube-discovery.js smart rules (< 50 vids = 100%, >= 50 = last 3 years)
- speaker-filter.js heuristics
- download-rules.yaml (audio-only, mp3 192k, rate limits)
- clean-transcript.js (remove [MUSIC], [APPLAUSE])

Usage:
  python youtube-etl.py --all                    # All Wave 2 agents
  python youtube-etl.py --agent todd-brown       # Single agent
  python youtube-etl.py --list                   # Show agent/channel map
  python youtube-etl.py --agent todd-brown --discover-only  # Just list videos
  python youtube-etl.py --agent todd-brown --max-videos 10  # Limit videos
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

# ============================================================
# Config
# ============================================================

SCRIPT_DIR = Path(__file__).parent
SQUAD_DIR = SCRIPT_DIR.parent
BOOKS_DIR = SQUAD_DIR / "data" / "books"
PROJECT_ROOT = SQUAD_DIR.parent.parent

# Load .env for API keys
ENV_PATH = PROJECT_ROOT / ".env"
if ENV_PATH.exists():
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key in ("ASSEMBLYAI_API_KEY",):
                os.environ[key] = value

# Agent → YouTube sources mapping
AGENT_CHANNELS = {
    "todd-brown": {
        "channels": ["https://www.youtube.com/@ToddBrownMarketing"],
        "search_terms": ["Todd Brown E5 Method", "Todd Brown unique mechanism", "Todd Brown marketing funnel"],
        "max_videos": 25,
        "priority_keywords": ["e5", "unique mechanism", "big marketing idea", "funnel", "campaign"],
        "language": "en",
    },
    "stefan-georgi": {
        "channels": ["https://www.youtube.com/@StefanGeorgi"],
        "search_terms": ["Stefan Georgi RMBC method", "Stefan Georgi VSL", "Stefan Georgi copywriting"],
        "max_videos": 25,
        "priority_keywords": ["rmbc", "vsl", "copy accelerator", "health copy", "research", "mechanism"],
        "language": "en",
    },
    "frank-kern": {
        "channels": ["https://www.youtube.com/@FrankKern"],
        "search_terms": ["Frank Kern intent based branding", "Frank Kern mass control"],
        "max_videos": 30,
        "priority_keywords": ["intent based", "results in advance", "mass control", "4 day cash machine", "webinar"],
        "language": "en",
    },
    "jon-benson": {
        "channels": ["https://www.youtube.com/@JonBensonDotCom"],
        "search_terms": ["Jon Benson VSL method", "Jon Benson 3X VSL", "Jon Benson Sellerator"],
        "max_videos": 15,
        "priority_keywords": ["vsl", "3x", "sellerator", "conversational", "email copy"],
        "language": "en",
    },
    "ry-schwartz": {
        "channels": [],
        "search_terms": [
            "Ry Schwartz copywriting",
            "Ry Schwartz cohort launch",
            "Ry Schwartz Copy Accelerator",
            "Ry Schwartz copywriter club",
        ],
        "max_videos": 10,
        "priority_keywords": ["cohort", "launch", "copy", "course", "300 million"],
        "language": "en",
    },
    "ben-settle": {
        "channels": ["https://www.youtube.com/@BenSettle"],
        "search_terms": ["Ben Settle email marketing", "Ben Settle infotainment"],
        "max_videos": 30,
        "priority_keywords": ["email", "daily email", "infotainment", "anti-guru", "personality", "villain"],
        "language": "en",
    },
}

# Rate limits (from clone-factory download-rules.yaml)
YT_DELAY_SECONDS = 2  # delay between yt-dlp calls
ASSEMBLYAI_MAX_CONCURRENT = 5


# ============================================================
# Helpers
# ============================================================

def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")


def run_ytdlp(args: list, timeout: int = 120) -> subprocess.CompletedProcess:
    """Run yt-dlp with given args."""
    cmd = ["yt-dlp"] + args
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


# ============================================================
# Phase 1: Discovery
# ============================================================

def discover_channel_videos(channel_url: str, max_videos: int = 50) -> list:
    """Discover videos from a YouTube channel using yt-dlp.
    Smart rules (from clone-factory youtube-discovery.js):
    - Channel < 50 videos → capture 100%
    - Channel >= 50 videos → capture last 3 years
    """
    log(f"  Discovering videos from {channel_url}")

    try:
        result = run_ytdlp([
            "--dump-json", "--flat-playlist",
            "--playlist-end", str(max(max_videos * 2, 200)),
            f"{channel_url}/videos"
        ], timeout=180)

        if result.returncode != 0:
            log(f"    WARN: yt-dlp error: {result.stderr[:200]}")
            return []

        videos = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                video = {
                    "id": data.get("id", ""),
                    "title": data.get("title", "Unknown"),
                    "url": data.get("url") or data.get("webpage_url") or f"https://www.youtube.com/watch?v={data.get('id', '')}",
                    "duration": data.get("duration") or 0,
                    "view_count": data.get("view_count") or 0,
                    "upload_date": data.get("upload_date", ""),
                    "channel": data.get("channel") or data.get("uploader", "Unknown"),
                }
                videos.append(video)
            except json.JSONDecodeError:
                continue

        log(f"    Found {len(videos)} total videos")

        # Apply smart rules
        if len(videos) >= 50:
            cutoff = datetime.now() - timedelta(days=3 * 365)
            cutoff_str = cutoff.strftime("%Y%m%d")
            filtered = [v for v in videos if (v["upload_date"] or "99999999") >= cutoff_str]
            log(f"    Smart rule: >= 50 vids, filtered to last 3 years: {len(filtered)} videos")
            videos = filtered

        # Sort by view_count descending, take top max_videos
        videos.sort(key=lambda v: v.get("view_count", 0), reverse=True)
        videos = videos[:max_videos]

        return videos

    except subprocess.TimeoutExpired:
        log(f"    TIMEOUT discovering {channel_url}")
        return []
    except Exception as e:
        log(f"    ERROR: {e}")
        return []


def discover_search_videos(search_term: str, max_results: int = 5) -> list:
    """Search YouTube for videos matching a term."""
    log(f"  Searching: '{search_term}'")

    try:
        result = run_ytdlp([
            "--dump-json", "--flat-playlist",
            "--playlist-end", str(max_results),
            f"ytsearch{max_results}:{search_term}"
        ], timeout=60)

        if result.returncode != 0:
            log(f"    WARN: search error: {result.stderr[:200]}")
            return []

        videos = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                videos.append({
                    "id": data.get("id", ""),
                    "title": data.get("title", "Unknown"),
                    "url": data.get("url") or data.get("webpage_url") or f"https://www.youtube.com/watch?v={data.get('id', '')}",
                    "duration": data.get("duration") or 0,
                    "view_count": data.get("view_count") or 0,
                    "upload_date": data.get("upload_date", ""),
                    "channel": data.get("channel") or data.get("uploader", "Unknown"),
                })
            except json.JSONDecodeError:
                continue

        return videos

    except subprocess.TimeoutExpired:
        log(f"    TIMEOUT searching '{search_term}'")
        return []


def discover_all_videos(agent_id: str) -> list:
    """Discover all videos for an agent from channels + search terms."""
    config = AGENT_CHANNELS.get(agent_id)
    if not config:
        return []

    all_videos = []
    seen_ids = set()

    # From channels
    for channel_url in config.get("channels", []):
        videos = discover_channel_videos(channel_url, config.get("max_videos", 25))
        for v in videos:
            if v["id"] and v["id"] not in seen_ids:
                seen_ids.add(v["id"])
                all_videos.append(v)
        time.sleep(YT_DELAY_SECONDS)

    # From search terms
    for term in config.get("search_terms", []):
        videos = discover_search_videos(term, max_results=5)
        for v in videos:
            if v["id"] and v["id"] not in seen_ids:
                seen_ids.add(v["id"])
                all_videos.append(v)
        time.sleep(YT_DELAY_SECONDS)

    # Score by priority keywords
    keywords = config.get("priority_keywords", [])
    if keywords:
        for v in all_videos:
            title_lower = (v.get("title") or "").lower()
            v["keyword_score"] = sum(1 for kw in keywords if kw.lower() in title_lower)

        # Sort: keyword matches first, then by views
        all_videos.sort(key=lambda v: (v.get("keyword_score", 0), v.get("view_count", 0)), reverse=True)

    # Limit to max_videos
    max_vids = config.get("max_videos", 25)
    all_videos = all_videos[:max_vids]

    log(f"  Total unique videos for {agent_id}: {len(all_videos)}")
    return all_videos


# ============================================================
# Phase 2: Caption/Subtitle Download
# ============================================================

def download_captions(video_id: str, video_url: str, output_dir: Path, lang: str = "en") -> str | None:
    """Download YouTube auto-generated or manual captions.
    Returns path to caption file, or None if unavailable.
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    # Try auto-subs first, then manual subs
    result = run_ytdlp([
        "--write-auto-sub", "--write-sub",
        "--sub-lang", lang,
        "--sub-format", "vtt",
        "--skip-download",
        "--no-playlist",
        "-o", str(output_dir / f"{video_id}.%(ext)s"),
        video_url
    ], timeout=30)

    # Find the downloaded subtitle file
    for ext in ["vtt", "srt"]:
        for pattern in [f"{video_id}.{lang}.{ext}", f"{video_id}.{ext}"]:
            caption_path = output_dir / pattern
            if caption_path.exists() and caption_path.stat().st_size > 100:
                return str(caption_path)

    return None


def parse_vtt_to_text(vtt_path: str) -> str:
    """Parse VTT subtitle file to clean text (inspired by clean-transcript.js)."""
    content = Path(vtt_path).read_text(encoding="utf-8", errors="replace")

    lines = []
    seen = set()

    for line in content.split("\n"):
        line = line.strip()

        # Skip VTT headers and timestamps
        if not line or line.startswith("WEBVTT") or line.startswith("Kind:") or line.startswith("Language:"):
            continue
        if re.match(r"^\d{2}:\d{2}", line):
            continue
        if re.match(r"^[\d\s:.\->]+$", line):
            continue
        if line.startswith("NOTE"):
            continue

        # Remove HTML tags
        line = re.sub(r"<[^>]+>", "", line)

        # Remove duplicate lines (YouTube VTT repeats lines)
        if line in seen:
            continue
        seen.add(line)

        # Clean noise (from clone-factory clean-transcript.js)
        line = re.sub(r"\[Music\]", "", line, flags=re.IGNORECASE)
        line = re.sub(r"\[Applause\]", "", line, flags=re.IGNORECASE)
        line = re.sub(r"\[Laughter\]", "", line, flags=re.IGNORECASE)
        line = re.sub(r"\[Inaudible\]", "", line, flags=re.IGNORECASE)

        line = line.strip()
        if line:
            lines.append(line)

    # Join into paragraphs (group every ~10 lines)
    text = " ".join(lines)
    # Clean multiple spaces
    text = re.sub(r"\s{2,}", " ", text).strip()
    return text


# ============================================================
# Phase 3: AssemblyAI Fallback Transcription
# ============================================================

def download_audio(video_url: str, output_dir: Path, video_id: str) -> str | None:
    """Download audio-only mp3 from YouTube video."""
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{video_id}.mp3"

    if output_path.exists() and output_path.stat().st_size > 1000:
        return str(output_path)

    result = run_ytdlp([
        "-x", "--audio-format", "mp3",
        "--audio-quality", "192K",
        "--no-playlist",
        "-o", str(output_path),
        video_url
    ], timeout=300)

    if output_path.exists() and output_path.stat().st_size > 1000:
        return str(output_path)

    # yt-dlp sometimes adds extension
    for p in output_dir.glob(f"{video_id}.*mp3*"):
        if p.stat().st_size > 1000:
            return str(p)

    return None


def transcribe_assemblyai(audio_path: str) -> str | None:
    """Transcribe audio via AssemblyAI (from existing transcribe-seminars.py pattern)."""
    try:
        import requests
    except ImportError:
        log("    WARN: requests not available, skipping AssemblyAI")
        return None

    api_key = os.getenv("ASSEMBLYAI_API_KEY", "")
    if not api_key:
        log("    WARN: No ASSEMBLYAI_API_KEY, skipping transcription")
        return None

    try:
        headers = {"authorization": api_key}

        # Upload
        with open(audio_path, "rb") as f:
            upload_resp = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                data=f,
                timeout=300,
            )
        upload_resp.raise_for_status()
        upload_url = upload_resp.json()["upload_url"]

        # Transcribe
        transcript_resp = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            headers={**headers, "content-type": "application/json"},
            json={
                "audio_url": upload_url,
                "speaker_labels": True,
                "language_code": "en",
            },
            timeout=30,
        )
        transcript_resp.raise_for_status()
        transcript_id = transcript_resp.json()["id"]

        # Poll
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
                return result.get("text", "")
            elif status == "error":
                log(f"    AssemblyAI error: {result.get('error', 'unknown')}")
                return None
            time.sleep(10)

    except Exception as e:
        log(f"    AssemblyAI failed: {e}")
        return None


# ============================================================
# Phase 4: Process Agent
# ============================================================

def process_agent(agent_id: str, max_videos: int | None = None, discover_only: bool = False) -> dict:
    """Full pipeline for one agent: discover → captions → fallback → merge."""
    config = AGENT_CHANNELS.get(agent_id)
    if not config:
        return {"agent": agent_id, "status": "error", "error": "Unknown agent"}

    agent_dir = BOOKS_DIR / agent_id
    youtube_dir = agent_dir / "youtube"
    captions_dir = youtube_dir / "captions"
    audio_dir = youtube_dir / "audio"

    # Override max_videos if specified
    if max_videos:
        config = {**config, "max_videos": max_videos}
        AGENT_CHANNELS[agent_id] = config

    # Phase 1: Discover
    log(f"\n{'='*60}")
    log(f"AGENT: {agent_id}")
    log(f"{'='*60}")
    log(f"Phase 1: Discovery")

    videos = discover_all_videos(agent_id)

    if not videos:
        return {"agent": agent_id, "status": "error", "error": "No videos found"}

    # Save discovery manifest
    youtube_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = youtube_dir / "discovery-manifest.json"
    with open(manifest_path, "w") as f:
        json.dump({"agent": agent_id, "discovered": datetime.now().isoformat(), "videos": videos}, f, indent=2, default=str)

    if discover_only:
        log(f"  Discovery only — {len(videos)} videos saved to {manifest_path}")
        for i, v in enumerate(videos[:20], 1):
            views = f"{v.get('view_count', 0):,}"
            dur = v.get("duration", 0)
            dur_str = f"{int(dur) // 60}:{int(dur) % 60:02d}" if dur else "?"
            kw = v.get("keyword_score", 0)
            log(f"    {i:2d}. [{dur_str}] ({views} views) [kw={kw}] {v['title'][:70]}")
        return {"agent": agent_id, "status": "discovered", "videos": len(videos)}

    # Phase 2: Download captions
    log(f"\nPhase 2: Caption download ({len(videos)} videos)")
    transcripts = []
    caption_ok = 0
    caption_fail = 0

    for i, video in enumerate(videos, 1):
        vid = video["id"]
        url = video["url"]
        if not url.startswith("http"):
            url = f"https://www.youtube.com/watch?v={vid}"

        log(f"  [{i}/{len(videos)}] {video['title'][:60]}")

        # Check if already processed
        transcript_file = youtube_dir / f"{vid}.txt"
        if transcript_file.exists() and transcript_file.stat().st_size > 200:
            log(f"    SKIP (already exists)")
            text = transcript_file.read_text(encoding="utf-8")
            transcripts.append({"video": video, "text": text, "method": "cached"})
            caption_ok += 1
            continue

        # Try captions first
        caption_path = download_captions(vid, url, captions_dir, config.get("language", "en"))
        time.sleep(YT_DELAY_SECONDS)

        if caption_path:
            text = parse_vtt_to_text(caption_path)
            if len(text) > 200:
                # Save individual transcript
                transcript_file.write_text(text, encoding="utf-8")
                transcripts.append({"video": video, "text": text, "method": "captions"})
                caption_ok += 1
                log(f"    OK (captions: {len(text):,} chars)")
                continue

        # Phase 3: Fallback to AssemblyAI
        log(f"    No captions, trying audio download + AssemblyAI...")
        audio_path = download_audio(url, audio_dir, vid)
        time.sleep(YT_DELAY_SECONDS)

        if audio_path:
            text = transcribe_assemblyai(audio_path)
            if text and len(text) > 200:
                transcript_file.write_text(text, encoding="utf-8")
                transcripts.append({"video": video, "text": text, "method": "assemblyai"})
                caption_ok += 1
                log(f"    OK (AssemblyAI: {len(text):,} chars)")

                # Delete audio to save space (from download-rules.yaml)
                try:
                    Path(audio_path).unlink()
                except OSError:
                    pass
                continue

        caption_fail += 1
        log(f"    FAIL (no captions, no audio)")

    # Phase 4: Merge into single transcript file
    log(f"\nPhase 4: Merge transcripts")
    if transcripts:
        merged_lines = []
        merged_lines.append(f"# {agent_id} — YouTube Transcripts (Wave 2 ETL)")
        merged_lines.append(f"")
        merged_lines.append(f"Collected: {datetime.now().strftime('%Y-%m-%d')}")
        merged_lines.append(f"Videos: {len(transcripts)}")
        merged_lines.append(f"Total chars: {sum(len(t['text']) for t in transcripts):,}")
        merged_lines.append(f"")

        for t in transcripts:
            v = t["video"]
            merged_lines.append(f"---")
            merged_lines.append(f"")
            merged_lines.append(f"## {v['title']}")
            merged_lines.append(f"")
            merged_lines.append(f"- URL: https://www.youtube.com/watch?v={v['id']}")
            merged_lines.append(f"- Views: {v.get('view_count', 0):,}")
            merged_lines.append(f"- Duration: {int(v.get('duration', 0)) // 60}m")
            merged_lines.append(f"- Method: {t['method']}")
            merged_lines.append(f"")
            merged_lines.append(t["text"])
            merged_lines.append(f"")

        merged_path = agent_dir / f"{agent_id}-youtube-transcripts.md"
        merged_path.write_text("\n".join(merged_lines), encoding="utf-8")
        merged_size = merged_path.stat().st_size
        log(f"  Merged: {merged_path.name} ({merged_size / 1024:.1f} KB)")

    summary = {
        "agent": agent_id,
        "status": "ok",
        "videos_discovered": len(videos),
        "transcripts_ok": caption_ok,
        "transcripts_fail": caption_fail,
        "total_chars": sum(len(t["text"]) for t in transcripts),
        "methods": {
            "captions": sum(1 for t in transcripts if t["method"] == "captions"),
            "assemblyai": sum(1 for t in transcripts if t["method"] == "assemblyai"),
            "cached": sum(1 for t in transcripts if t["method"] == "cached"),
        },
    }

    log(f"\n  Summary: {caption_ok} OK, {caption_fail} FAIL, {summary['total_chars']:,} chars")
    return summary


# ============================================================
# Main
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="CopywriterOS — YouTube ETL (Wave 2)")
    parser.add_argument("--all", action="store_true", help="Process all Wave 2 agents")
    parser.add_argument("--agent", type=str, help="Process specific agent")
    parser.add_argument("--list", action="store_true", help="List agent/channel mapping")
    parser.add_argument("--discover-only", action="store_true", help="Only discover videos, don't download")
    parser.add_argument("--max-videos", type=int, help="Override max videos per agent")
    args = parser.parse_args()

    agents = sorted(AGENT_CHANNELS.keys())

    if args.list or (not args.all and not args.agent):
        print(f"\n{'Agent':<20} {'Channels':<35} {'Search Terms':<5} {'Max Vids'}")
        print("-" * 75)
        for a in agents:
            c = AGENT_CHANNELS[a]
            ch = ", ".join(c.get("channels", [])) or "(search only)"
            if len(ch) > 33:
                ch = ch[:30] + "..."
            st = len(c.get("search_terms", []))
            mv = c.get("max_videos", 25)
            print(f"{a:<20} {ch:<35} {st:<5} {mv}")
        return

    if args.agent:
        agents = [args.agent]
        if args.agent not in AGENT_CHANNELS:
            print(f"ERROR: Unknown agent '{args.agent}'. Use --list to see available agents.")
            sys.exit(1)

    log(f"Starting YouTube ETL for {len(agents)} agent(s)")
    total_start = time.time()
    results = []

    for agent_id in agents:
        result = process_agent(
            agent_id,
            max_videos=args.max_videos,
            discover_only=args.discover_only,
        )
        results.append(result)

    elapsed = round(time.time() - total_start, 1)

    # Summary
    print(f"\n{'='*60}")
    print(f"  YouTube ETL Complete — {elapsed}s")
    print(f"{'='*60}")
    print(f"\n{'Agent':<20} {'Status':<10} {'Videos':<8} {'OK':<5} {'Fail':<5} {'Chars'}")
    print("-" * 65)
    for r in results:
        a = r.get("agent", "?")
        s = r.get("status", "?")
        v = r.get("videos_discovered", 0)
        ok = r.get("transcripts_ok", 0)
        fail = r.get("transcripts_fail", 0)
        chars = r.get("total_chars", 0)
        print(f"{a:<20} {s:<10} {v:<8} {ok:<5} {fail:<5} {chars:,}")

    ok_total = sum(r.get("transcripts_ok", 0) for r in results)
    fail_total = sum(r.get("transcripts_fail", 0) for r in results)
    chars_total = sum(r.get("total_chars", 0) for r in results)
    log(f"\nTotal: {ok_total} transcripts OK, {fail_total} failed, {chars_total:,} chars")


if __name__ == "__main__":
    main()
