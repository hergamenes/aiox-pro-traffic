#!/usr/bin/env python3
"""CopywriterOS — Legends Content Scraper.

Downloads freely available content (interviews, articles, tributes) for
4 legendary copywriters: Clayton Makepeace, Parris Lampropoulos,
David Deutsch, and Jim Rutz.

Usage:
    python3 squads/copywriter-os/scripts/download-legends-content.py
"""

import re
import sys
import time
import html
from pathlib import Path

import requests

DELAY = 2
SQUAD_DIR = Path(__file__).resolve().parent.parent
BOOKS_DIR = SQUAD_DIR / "data" / "books"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
}

# ---------------------------------------------------------------------------
# URL definitions per author
# ---------------------------------------------------------------------------

AUTHORS = {
    "Clayton Makepeace": {
        "dir": "clayton-makepeace",
        "urls": [
            (
                "https://archive.org/stream/500-page-swipe-clayton-makepeace/"
                "QuickStart%20Copywriting%20System%20HD_djvu.txt",
                "quickstart-copywriting-system.txt",
                True,   # plain text (no HTML conversion)
            ),
            (
                "https://thegaryhalbertletter.com/makepeace",
                "quickstart-course-pt1.txt",
                False,
            ),
            (
                "https://thegaryhalbertletter.com/"
                "Clayton-Makepeace-Quick-Start-Copywriting-Course-1",
                "quickstart-course-pt1b.txt",
                False,
            ),
            (
                "https://thegaryhalbertletter.com/"
                "Clayton-Makepeace-Quick-Start-Copywriting-Course-2",
                "quickstart-course-pt2.txt",
                False,
            ),
            (
                "https://www.breakthroughmarketingsecrets.com/blog/"
                "clayton-makepeace-copywriting-outline-checklists-one-big-idea/",
                "makepeace-outline-checklists.txt",
                False,
            ),
            (
                "https://www.scottmartincopywriter.com/blog/tag/clayton+makepeace",
                "scottmartin-makepeace-posts.txt",
                False,
            ),
        ],
    },
    "Parris Lampropoulos": {
        "dir": "parris-lampropoulos",
        "urls": [
            (
                "https://copychief.com/ep-101-parris-lampropoulos/",
                "copychief-ep101-persuasive-copy-pt1.txt",
                False,
            ),
            (
                "https://copychief.com/ep-102-parris-lampropoulos/",
                "copychief-ep102-persuasive-copy-pt2.txt",
                False,
            ),
            (
                "https://thecopywriterclub.com/mentorship-parris-lampropoulos/",
                "tcc-201-mentors.txt",
                False,
            ),
            (
                "https://www.conversioncopywriting.co.uk/reviews/"
                "parris-lampropoulos-interview/",
                "conversion-copywriting-interview.txt",
                False,
            ),
            (
                "https://thechrishaddadshow.com/"
                "how-copywriting-changes-your-brain-parris-lampropoulos/",
                "chris-haddad-ep26-brain.txt",
                False,
            ),
            (
                "https://ilovemarketing.com/"
                "the-single-greatest-marketing-secret-with-parris-lampropoulos"
                "-at-joe-polishs-genius-network/",
                "genius-network-marketing-secret.txt",
                False,
            ),
        ],
    },
    "David Deutsch": {
        "dir": "david-deutsch",
        "urls": [
            (
                "https://thecopywriterclub.com/copythinking-david-deutsch/",
                "tcc-415-copythinking.txt",
                False,
            ),
            (
                "https://copychief.com/ep-57-david-deutsch/",
                "copychief-ep57-problem-solution.txt",
                False,
            ),
            (
                "https://www.breakthroughmarketingsecrets.com/blog/"
                "billion-dollar-copywriter-david-l-deutsch-interview/",
                "breakthrough-interview.txt",
                False,
            ),
            (
                "https://www.breakthroughmarketingsecrets.com/blog/"
                "billion-dollar-copywriter-david-l-deutsch-best-of-interviews/",
                "breakthrough-best-of-interviews.txt",
                False,
            ),
            (
                "https://www.verygoodcopy.com/microinterviews-3-1/"
                "david-l-deutsch",
                "verygoodcopy-microinterview.txt",
                False,
            ),
            (
                "https://davidldeutsch.com/"
                "the-worlds-most-interesting-copywriter/",
                "deutsch-on-jim-rutz.txt",
                False,
            ),
            (
                "https://bensettle.com/blog/"
                "free-interview-with-a-list-copywriter-david-deutsch/",
                "ben-settle-interview.txt",
                False,
            ),
        ],
    },
    "Jim Rutz": {
        "dir": "jim-rutz",
        "urls": [
            (
                "https://www.briankurtz.net/jimrutz/",
                "briankurtz-tribute.txt",
                False,
            ),
            (
                "https://www.briankurtz.net/jim-rutz/",
                "briankurtz-jim-rutz.txt",
                False,
            ),
            (
                "https://davidldeutsch.com/"
                "the-worlds-most-interesting-copywriter/",
                "deutsch-most-interesting-copywriter.txt",
                False,
            ),
            (
                "https://bejakovic.com/tag/jim-rutz/",
                "bejakovic-jim-rutz-posts.txt",
                False,
            ),
            (
                "https://ramblings777.wordpress.com/2025/03/12/"
                "the-copywriting-tricks-jim-rutz-used-to-sell-millions/",
                "copywriting-tricks-jim-rutz.txt",
                False,
            ),
            (
                "https://www.briankurtz.net/gods-copywriter-almost-live/",
                "briankurtz-gods-copywriter.txt",
                False,
            ),
        ],
    },
}


# ---------------------------------------------------------------------------
# HTML-to-text conversion (same pattern as download-bencivenga-maxims.py)
# ---------------------------------------------------------------------------

def html_to_text(raw_html: str) -> str:
    text = re.sub(
        r'<(script|style|nav|header|footer)[^>]*>.*?</\1>',
        '', raw_html, flags=re.DOTALL | re.IGNORECASE,
    )
    text = re.sub(r'<(br|BR)\s*/?\s*>', '\n', text)
    text = re.sub(
        r'</(p|div|tr|li|h[1-6]|blockquote|td)>',
        '\n\n', text, flags=re.IGNORECASE,
    )
    text = re.sub(
        r'<(p|div|tr|li|h[1-6]|blockquote)[^>]*>',
        '', text, flags=re.IGNORECASE,
    )
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    result = '\n\n'.join(lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    session = requests.Session()
    session.headers.update(HEADERS)

    grand_total = sum(len(a["urls"]) for a in AUTHORS.values())
    grand_ok = 0
    grand_skip = 0
    grand_fail = 0

    print("=" * 64)
    print("  CopywriterOS — Legends Content Scraper")
    print(f"  Authors: {len(AUTHORS)}")
    print(f"  Total URLs: {grand_total}")
    print("=" * 64)

    for author_name, cfg in AUTHORS.items():
        data_dir = BOOKS_DIR / cfg["dir"]
        data_dir.mkdir(parents=True, exist_ok=True)

        urls = cfg["urls"]
        ok = skip = fail = 0

        print()
        print(f"--- {author_name} ({len(urls)} files) ---")
        print(f"    Dir: {data_dir}")
        print()

        for url, filename, is_plain_text in urls:
            dest = data_dir / filename

            if dest.exists() and dest.stat().st_size > 200:
                print(f"  SKIP: {filename}")
                skip += 1
                continue

            print(f"  GET:  {filename}")
            print(f"        {url[:80]}{'...' if len(url) > 80 else ''}")

            try:
                r = session.get(url, timeout=30, allow_redirects=True)
                r.raise_for_status()

                if is_plain_text:
                    content = r.text
                else:
                    content = html_to_text(r.text)

                with open(dest, 'w', encoding='utf-8') as f:
                    f.write(f"SOURCE: {url}\n")
                    f.write(f"AUTHOR: {author_name}\n")
                    f.write(f"SCRAPED: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                    f.write("=" * 64 + "\n\n")
                    f.write(content)

                size = dest.stat().st_size
                print(f"    OK: {size:,} bytes")
                ok += 1

            except requests.exceptions.SSLError as e:
                print(f"    FAIL (SSL): {e}")
                fail += 1

            except requests.exceptions.HTTPError as e:
                print(f"    FAIL ({r.status_code}): {e}")
                fail += 1

            except Exception as e:
                print(f"    FAIL: {e}")
                fail += 1

            time.sleep(DELAY)

        print(f"\n  {author_name}: OK={ok}  Skip={skip}  Fail={fail}")
        grand_ok += ok
        grand_skip += skip
        grand_fail += fail

    print()
    print("=" * 64)
    print(f"  DONE!  Total={grand_total}  OK={grand_ok}  "
          f"Skip={grand_skip}  Fail={grand_fail}")
    print("=" * 64)


if __name__ == "__main__":
    main()
