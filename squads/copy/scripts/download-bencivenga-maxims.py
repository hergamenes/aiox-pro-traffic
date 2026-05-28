#!/usr/bin/env python3
"""CopywriterOS — Gary Bencivenga Marketing Maxims Scraper.

Downloads all Marketing Maxims from marketingmaxims.com.
No authentication required — content is publicly accessible via direct URLs.

Usage:
    python3 squads/copywriter-os/scripts/download-bencivenga-maxims.py
"""

import re
import sys
import time
import html
from pathlib import Path
from urllib.parse import urljoin

import requests

DELAY = 2
SQUAD_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = SQUAD_DIR / "data" / "books" / "gary-bencivenga" / "marketing-maxims"
BASE_URL = "https://marketingmaxims.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
}

MAXIMS = [
    ("one", "01", "The Six-Word Sentence That Can Change Your Life"),
    ("two", "02", "The Intimidating 10-Minute Talk That Changed My Career"),
    ("three", "03", "In One Sentence, What Is Effective Advertising"),
    ("four", "04", "How to Get Everything You Want in Life"),
    ("five", "05", "Harry Browne's Master Secret for Selling Anything"),
    ("six", "06", "How to Know What a Mass Market Really Wants to Buy"),
    ("seven", "07", "The Most Overlooked Step When Aiming for a Breakthrough"),
    ("eight", "08", "How to Build a Rock-Solid Foundation for Your Winning Ad"),
    ("nine", "09", "The Golden Rule I Learned from the Greatest Advertising Copywriters"),
    ("ten", "10", "Prioritize Your Proof"),
    ("eleven", "11", "Know your market or you'll have no market"),
    ("twelve", "12", "The Bencivenga Persuasion Equation"),
    ("thirteen", "13", "A gifted product is mightier than a gifted pen"),
    ("fourteen", "14", "Use the Pareto Principle in Everything You Do"),
    ("fifteen", "15", "How to Multiply Your Sales With the Secret of the Monkey's Fist"),
    ("sixteen", "16", "How to Make Your Ads Irresistible"),
    ("holiday", "holiday", "Holiday Message 2025"),
]


def html_to_text(raw_html: str) -> str:
    text = re.sub(r'<(script|style|nav|header|footer)[^>]*>.*?</\1>', '', raw_html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<(br|BR)\s*/?\s*>', '\n', text)
    text = re.sub(r'</(p|div|tr|li|h[1-6]|blockquote|td)>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<(p|div|tr|li|h[1-6]|blockquote)[^>]*>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    result = '\n\n'.join(lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip()


def main():
    session = requests.Session()
    session.headers.update(HEADERS)

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    total = len(MAXIMS)
    ok = 0
    skip = 0
    fail = 0

    print("=" * 60)
    print("  CopywriterOS — Bencivenga Marketing Maxims Scraper")
    print(f"  Target: {DATA_DIR}")
    print(f"  Maxims: {total}")
    print("=" * 60)
    print()

    for slug, num, title in MAXIMS:
        filename = f"maxim-{num}.txt"
        dest = DATA_DIR / filename
        url = f"{BASE_URL}/maxims/{slug}"

        if dest.exists() and dest.stat().st_size > 200:
            print(f"  SKIP: {filename}")
            skip += 1
            continue

        print(f"  [{num}] {title}")

        try:
            r = session.get(url, timeout=30)
            r.raise_for_status()

            text = html_to_text(r.text)

            # Remove navigation/footer cruft
            # Find the main content between the header and footer
            if 'Marketing Maxim' in text or 'Maxim #' in text:
                # Try to isolate the maxim content
                pass

            with open(dest, 'w', encoding='utf-8') as f:
                f.write(f"SOURCE: {url}\n")
                f.write(f"MAXIM: #{num}\n")
                f.write(f"TITLE: {title}\n")
                f.write(f"AUTHOR: Gary Bencivenga\n")
                f.write(f"SCRAPED: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 60 + "\n\n")
                f.write(text)

            size = dest.stat().st_size
            print(f"    OK: {size:,} bytes")
            ok += 1

        except Exception as e:
            print(f"    FAIL: {e}")
            fail += 1

        time.sleep(DELAY)

    print()
    print("=" * 60)
    print(f"  Concluido! Total={total} OK={ok} Skip={skip} Fail={fail}")
    print(f"  Arquivos em: {DATA_DIR}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
