#!/usr/bin/env python3
"""CopywriterOS — Batch Book Downloader via Z-Library Web API.

Usage:
    python3 squads/copywriter-os/scripts/download-books.py [--tier all|0|1|2|3|tool]

Requires ZLIB_EMAIL and ZLIB_PASSWORD in .env (loaded via direnv or manually).
"""

import os
import re
import sys
import time
import json
from pathlib import Path
from urllib.parse import quote

import requests

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════

BASE_URL = "https://pt.z-lib.fm"
DELAY = 4  # seconds between downloads (respect rate limits)
SQUAD_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = SQUAD_DIR.parent.parent
BOOKS_DIR = SQUAD_DIR / "data" / "books"


def load_env():
    """Load .env file directly (bypasses shell interpolation of $)."""
    env_path = PROJECT_ROOT / ".env"
    if not env_path.exists():
        return
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key.startswith("ZLIB_"):
                os.environ[key] = value

# Book catalog: (agent_slug, search_query, preferred_filename)
BOOKS = {
    "tier_0": [
        ("claude-hopkins", "Scientific Advertising Claude Hopkins", "Scientific_Advertising.pdf"),
        ("claude-hopkins", "My Life in Advertising Claude Hopkins", "My_Life_in_Advertising.pdf"),
        ("eugene-schwartz", "Breakthrough Advertising Eugene Schwartz", "Breakthrough_Advertising.pdf"),
        ("eugene-schwartz", "Brilliance Breakthrough Eugene Schwartz", "Brilliance_Breakthrough.pdf"),
        ("robert-collier", "Robert Collier Letter Book", "Robert_Collier_Letter_Book.pdf"),
    ],
    "tier_1": [
        ("gary-halbert", "The Boron Letters Gary Halbert", "Boron_Letters.pdf"),
        ("david-ogilvy", "Ogilvy on Advertising", "Ogilvy_on_Advertising.pdf"),
        ("david-ogilvy", "Confessions of an Advertising Man Ogilvy", "Confessions_Advertising_Man.pdf"),
        ("john-carlton", "Kick-Ass Copywriting Secrets Marketing Rebel", "Kickass_Copywriting.pdf"),
    ],
    "tier_2": [
        ("dan-kennedy", "Ultimate Sales Letter Dan Kennedy", "Ultimate_Sales_Letter.pdf"),
        ("dan-kennedy", "No BS Direct Marketing Dan Kennedy", "No_BS_Direct_Marketing.pdf"),
        ("dan-kennedy", "Magnetic Marketing Dan Kennedy", "Magnetic_Marketing.pdf"),
        ("jeff-walker", "Launch Jeff Walker", "Launch.pdf"),
        ("russell-brunson", "DotCom Secrets Russell Brunson", "DotCom_Secrets.pdf"),
        ("russell-brunson", "Expert Secrets Russell Brunson", "Expert_Secrets.pdf"),
        ("russell-brunson", "Traffic Secrets Russell Brunson", "Traffic_Secrets.pdf"),
    ],
    "tier_3": [
        ("ben-settle", "Persuasion Secrets Charismatic Influential Villains", "Persuasion_Secrets_Villains.pdf"),
        ("dan-koe", "Art of Focus Dan Koe", "Art_of_Focus.pdf"),
    ],
    "tool": [
        ("joe-sugarman", "Triggers Joe Sugarman", "Triggers.pdf"),
        ("joe-sugarman", "Adweek Copywriting Handbook Sugarman", "Adweek_Copywriting_Handbook.pdf"),
        ("joe-sugarman", "Advertising Secrets Written Word Sugarman", "Advertising_Secrets_Written_Word.pdf"),
    ],
}


# ═══════════════════════════════════════════════════════════════════════════
# Z-LIBRARY CLIENT
# ═══════════════════════════════════════════════════════════════════════════

class ZLibClient:
    def __init__(self, email: str, password: str):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        })
        self.email = email
        self.password = password
        self._logged_in = False

    def login(self):
        if self._logged_in:
            return
        r = self.session.post(f"{BASE_URL}/rpc.php", data={
            "email": self.email,
            "password": self.password,
            "action": "login",
            "gg_json_mode": "1",
        }, timeout=15)
        data = r.json()
        if data.get("errors"):
            raise RuntimeError(f"Login failed: {data['errors']}")
        self._logged_in = True
        print("  Login OK")

    def search(self, query: str, pdf_only: bool = True) -> list:
        self.login()
        url = f"{BASE_URL}/s/{quote(query)}"
        if pdf_only:
            url += "?extensions%5B%5D=pdf"
        r = self.session.get(url, timeout=15)
        links = re.findall(r'href="(/book/[^"]+\.html)"', r.text)
        return links

    def get_download_link(self, book_path: str) -> str | None:
        r = self.session.get(f"{BASE_URL}{book_path}", timeout=15)
        dl = re.findall(r'href="(/dl/[^"]+)"', r.text)
        return dl[0] if dl else None

    def download_file(self, dl_path: str, dest: Path) -> Path | None:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = self.session.get(f"{BASE_URL}{dl_path}", timeout=60, stream=True)
        ct = r.headers.get("content-type", "")
        if "pdf" not in ct and "epub" not in ct and "octet" not in ct:
            return None
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        # Validate: reject EPUBs disguised as PDF
        import subprocess
        file_type = subprocess.run(["file", "-b", str(dest)], capture_output=True, text=True).stdout.strip()
        if "EPUB" in file_type and dest.suffix == ".pdf":
            print(f"    WARN: Downloaded EPUB instead of PDF — removing {dest.name}")
            dest.unlink()
            return None
        return dest


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════

def main():
    tier_filter = sys.argv[1] if len(sys.argv) > 1 else "all"

    # Load .env directly (bypasses shell $ interpolation)
    load_env()

    email = os.getenv("ZLIB_EMAIL", "")
    password = os.getenv("ZLIB_PASSWORD", "")
    if not email or not password:
        print("ERROR: ZLIB_EMAIL e ZLIB_PASSWORD nao configurados no .env")
        sys.exit(1)

    client = ZLibClient(email, password)

    tiers_to_run = list(BOOKS.keys()) if tier_filter == "all" else [f"tier_{tier_filter}" if tier_filter.isdigit() else tier_filter]

    total = 0
    ok = 0
    skip = 0
    fail = 0

    print("=" * 60)
    print("  CopywriterOS — Book Downloader")
    print(f"  Target: {BOOKS_DIR}")
    print(f"  Tier: {tier_filter}")
    print(f"  Delay: {DELAY}s")
    print("=" * 60)
    print()

    for tier_name in tiers_to_run:
        books = BOOKS.get(tier_name, [])
        if not books:
            continue
        print(f"--- {tier_name.upper()} ({len(books)} books) ---")

        for agent, query, filename in books:
            total += 1
            dest = BOOKS_DIR / agent / filename

            # Skip if already exists
            if dest.exists() and dest.stat().st_size > 1000:
                print(f"  SKIP: {agent}/{filename} (ja existe)")
                skip += 1
                continue

            print(f"  [{tier_name}] {agent}: \"{query}\"")

            try:
                results = client.search(query)
                if not results:
                    print(f"    FAIL: nenhum resultado")
                    fail += 1
                    time.sleep(DELAY)
                    continue

                dl_link = client.get_download_link(results[0])
                if not dl_link:
                    print(f"    FAIL: download link nao encontrado")
                    fail += 1
                    time.sleep(DELAY)
                    continue

                saved = client.download_file(dl_link, dest)
                if saved:
                    size = saved.stat().st_size
                    print(f"    OK: {saved.name} ({size:,} bytes)")
                    ok += 1
                else:
                    print(f"    FAIL: resposta nao era um arquivo")
                    fail += 1

            except Exception as e:
                print(f"    FAIL: {e}")
                fail += 1

            time.sleep(DELAY)

        print()

    print("=" * 60)
    print(f"  Concluido! Total={total} OK={ok} Skip={skip} Fail={fail}")
    print(f"  Livros em: {BOOKS_DIR}/")
    print("=" * 60)

    # Save summary
    summary = {
        "total": total, "ok": ok, "skip": skip, "fail": fail,
        "books_dir": str(BOOKS_DIR),
    }
    summary_path = BOOKS_DIR / "download-summary.json"
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)


if __name__ == "__main__":
    main()
