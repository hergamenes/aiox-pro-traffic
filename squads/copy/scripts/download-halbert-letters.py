#!/usr/bin/env python3
"""CopywriterOS — Gary Halbert Newsletter Scraper.

Downloads all publicly available Gary Halbert Letters and Boron Letters
from thegaryhalbertletter.com, extracts clean text, and saves as .txt files.

Usage:
    python3 squads/copywriter-os/scripts/download-halbert-letters.py [--dry-run]

No authentication required — all content is publicly accessible.
"""

import os
import re
import sys
import json
import time
import html
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════

DELAY = 1.5  # seconds between requests (be respectful)
SQUAD_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = SQUAD_DIR / "data" / "books" / "gary-halbert"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}

# ═══════════════════════════════════════════════════════════════════════════
# COMPLETE URL LIST (scraped from newsletters/ + newsletter-archives.htm)
# ═══════════════════════════════════════════════════════════════════════════

URLS = [
    # === BORON LETTERS (25 chapters) ===
    "https://www.thegaryhalbertletter.com/Boron/TChapter1.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter2.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter3.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter4.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter5.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter6.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter7.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter8.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter9.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter10.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter11.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter12.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter13.htm",
    "https://www.thegaryhalbertletter.com/Boron/TChapter14.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter15.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter16.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter17.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter18.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter19.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter20.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter21.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter22.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter23.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter24.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/Boron/TChapter25.htm",

    # === NEWSLETTERS (classic, undated) ===
    "https://thegaryhalbertletter.com/newsletters/oneadvantage.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfkj_hands_on_experience.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjkj_by_the_numbers.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhzz-07_big_idea.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdld_do_the_twist.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdkl_human_deadwood.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zakj_lesser_brethren.htm",
    "https://www.thegaryhalbertletter.com/newsletters/askh_fighter_pilot_attitude.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aslk_start_every_day.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zgkl_best_copywriter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfkk_best_shot.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zlkh_direct_mail_nerd.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aslz_winners_losers.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zgkk_contests_and_sweepstakes.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkza_nuggets.htm",
    "https://www.thegaryhalbertletter.com/newsletters/a_yellow_pages.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zgza_guru_garys_guide.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aakh_improve_response.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aakj_veritable_orgy.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aakk_you_cant_know.htm",
    "https://www.thegaryhalbertletter.com/newsletters/aazz_about_nothing.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_an_apology.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_easyway.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_interesting_facts.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_money.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_plasticsurgery.htm",
    "https://www.thegaryhalbertletter.com/newsletters/ac_tape_pitch.htm",
    "https://www.thegaryhalbertletter.com/newsletters/an_insane_idea.htm",
    "https://www.thegaryhalbertletter.com/newsletters/askj_product_to_sell.htm",
    "https://www.thegaryhalbertletter.com/newsletters/askk_vanity_radio.htm",
    "https://www.thegaryhalbertletter.com/newsletters/asza_another_issue.htm",
    "https://www.thegaryhalbertletter.com/newsletters/azkj_catalog_mailer.htm",
    "https://www.thegaryhalbertletter.com/newsletters/azkk_two_secrets.htm",
    "https://www.thegaryhalbertletter.com/newsletters/azlk_make_god_laugh.htm",
    "https://www.thegaryhalbertletter.com/newsletters/castration.htm",
    "https://www.thegaryhalbertletter.com/newsletters/chapter12.htm",
    "https://www.thegaryhalbertletter.com/newsletters/direct_response.htm",
    "https://www.thegaryhalbertletter.com/newsletters/does_size_matter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/freeteleseminar.htm",
    "https://www.thegaryhalbertletter.com/newsletters/gloomy_sunday.htm",
    "https://www.thegaryhalbertletter.com/newsletters/hurricane.htm",
    "https://www.thegaryhalbertletter.com/newsletters/jasonjcox.htm",
    "https://www.thegaryhalbertletter.com/newsletters/littlebill.htm",
    "https://www.thegaryhalbertletter.com/newsletters/mentoring.htm",
    "https://www.thegaryhalbertletter.com/newsletters/message_from_julie.htm",
    "https://www.thegaryhalbertletter.com/newsletters/moneymakingsecrets.htm",
    "https://www.thegaryhalbertletter.com/newsletters/motherlode.htm",
    "https://www.thegaryhalbertletter.com/newsletters/paradigms.htm",
    "https://www.thegaryhalbertletter.com/newsletters/population.htm",
    "https://www.thegaryhalbertletter.com/newsletters/reallyrather.htm",
    "https://www.thegaryhalbertletter.com/newsletters/shake_your_tail_feathers.htm",
    "https://www.thegaryhalbertletter.com/newsletters/shortest_and_most.htm",
    "https://www.thegaryhalbertletter.com/newsletters/urgentmessage.htm",
    "https://www.thegaryhalbertletter.com/newsletters/yougottabethere.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zakk_grabbers.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zakl_talent_for_management.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zall_more_stock_secrets.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zaza_interesting_facts.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zazs_automatic_telephone_calls.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdkj_protecting_customer_list.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdla_multi_level_marketing.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdlk_financial_sodomy.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdll_world_is_urinal.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdls_halbert_index.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdzd_piss_somebody_off.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdzs_warning_not_newsletter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zdzz_the_suck.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfkl_first_step.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfla_where_money_is.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zflk_blitzkrieg_paradigm.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfll_remember_y2k.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfza_more_money_website.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfzs_pearls_of_wisdom.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zfzz_grout_sponge.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zglk_post_office.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zgll_scared_shitless.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zgzd_promoting_website.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhkj_976_numbers.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhkk_image_suicide.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhkl_get_it_going.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhlj_real_asshole.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhlk_promote_website.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zhll_marketing_secrets_revealed.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjkk_cheap_little_classifieds.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjkl_whats_good.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjlk_personal_computer.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjll_most_valuable_skill.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjlz_sweeten_profits.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zjzd_self_pity.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkkj_advertising_more_profitable.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkld_out_of_closet.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkll_better_be_running.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkzd_disaster_insurance.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkzs_sex_and_money.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zkzz_pound_for_pound.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zlkk_movie_and_tv_stars.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zllj_thoughtless_writing.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zlll_profitable_website.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zlzz_ski_masks.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zskj_10_stupid_things.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zskl_price_is_relative.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zslh_neurological.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zslj_bill_gates.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zsll_live_to_be_110.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zsza_nightmare_clients_alec.htm",
    "https://www.thegaryhalbertletter.com/newsletters/zszd_didn%27t_masturbate.htm",
    "https://thegaryhalbertletter.com/newsletters/azll_positive_difference.htm",
    "https://thegaryhalbertletter.com/newsletters/dark-side.htm",
    "https://thegaryhalbertletter.com/newsletters/zhlg_meditation.htm",
    "https://thegaryhalbertletter.com/Newletter-archives-protected/newsletters/zszs_aida.htm",

    # === NEWSLETTERS (dated 2004-2013) ===
    "https://www.thegaryhalbertletter.com/newsletters/Feb04.htm",
    "https://www.thegaryhalbertletter.com/newsletters/Dec%2704.htm",
    "https://www.thegaryhalbertletter.com/newsletters/11_30_04Teleseminar.htm",
    "https://www.thegaryhalbertletter.com/newsletters/Feb05Seminar.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/07-13-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/07-26-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/07-27-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/07-29-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/08-15-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/09-01-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/09-03-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/09-15-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/11-09-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/11-21-05reveal1.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/12-12-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/12-14-05.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2005/Enlightening-TimeSensitive.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2006/go_ask_alice.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2006/modesty_personified.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2006/rolls_royce_letter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2006/spiritual_newsletter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2007/october%202007%20newsletter/october%202007%20newsletter.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2007/october_2007_Good_News/october_2007_Good_News.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2008/Mindset/Mindset.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2008/scott/howtowritebettercopyfaster.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2009/BigAnnouncement/BigAnnouncement.html",
    "https://www.thegaryhalbertletter.com/newsletters/2009/Gary_Halbert_Personal_Ad/Gary_Halbert_Personal_Ad.html",
    "https://www.thegaryhalbertletter.com/newsletters/2009/WhiteMail/WhiteMail.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2009/WhiteMail/WhiteMail2.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2011/ASpecialTreat.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2011/GaryHalbertsBirthday2011.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2011/hiringcopywriters.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2013/Halbert_Seal_of_Approval.htm",
    "https://www.thegaryhalbertletter.com/newsletters/2013/nancy-jones.htm",

    # === ARCHIVES-PROTECTED NEWSLETTERS ===
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/09-02-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/09-12-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/09-27-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/09-28-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/10-25-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/10-27-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2005/11-23-05.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2006/jam_packed.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2006/marketing_from_space.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2006/the_700_million_dollar_man.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2006/the_answer_to_the_rolls_royce_letter.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2009/John%20Carlton%2003_31_09/Channeling_The_Head_Shitweasel.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/2009/Perry%20Marshall/Perry%20Marshall.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/aslk_start_every_day.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/monsterwebsiteprofits.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/seminar.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/zgkj_blue_books.htm",
    "https://www.thegaryhalbertletter.com/Newletter-archives-protected/newsletters/zkkk_killer_headlines.htm",

    # === SPECIAL PAGES ===
    "https://thegaryhalbertletter.com/Goodbye%2004-05-05.htm",
    "https://www.thegaryhalbertletter.com/Goodbye%2004-06-05.htm",
    "https://www.thegaryhalbertletter.com/TheresaFarewell.htm",
    "https://www.thegaryhalbertletter.com/iraqisecret.htm",
    "https://www.thegaryhalbertletter.com/12-MonthMillionaireOcalaOnly.htm",
    "https://www.thegaryhalbertletter.com/goldbox/sleazypitch.htm",
    "https://www.thegaryhalbertletter.com/EnvelopeTitles/Gary%20Girlfriend%20In%20Motion.htm",
    "https://www.thegaryhalbertletter.com/newsletters/azdedislei_specialreport.html",
    "https://www.thegaryhalbertletter.com/newsletters/azdx_internetsecrets.html",

    # === PDF ===
    "https://www.thegaryhalbertletter.com/FairMaidenWriting.pdf",
    "https://www.thegaryhalbertletter.com/newsletters/2007/october%202007%2020clicks/20ClicksUpdate9-07.pdf",
]


# ═══════════════════════════════════════════════════════════════════════════
# HTML TO TEXT EXTRACTOR
# ═══════════════════════════════════════════════════════════════════════════

def html_to_text(raw_html: str) -> str:
    """Extract clean text from HTML, preserving paragraph structure."""
    # Remove script, style, nav elements
    text = re.sub(r'<(script|style|nav|header|footer)[^>]*>.*?</\1>', '', raw_html, flags=re.DOTALL | re.IGNORECASE)

    # Convert common block elements to double newlines
    text = re.sub(r'<(br|BR)\s*/?\s*>', '\n', text)
    text = re.sub(r'</(p|div|tr|li|h[1-6]|blockquote|td)>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<(p|div|tr|li|h[1-6]|blockquote)[^>]*>', '', text, flags=re.IGNORECASE)

    # Remove all remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Decode HTML entities
    text = html.unescape(text)

    # Clean up whitespace
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if line:
            lines.append(line)

    # Join with single newlines, collapse multiple blank lines
    result = '\n\n'.join(lines)
    result = re.sub(r'\n{3,}', '\n\n', result)

    return result.strip()


def url_to_filename(url: str) -> str:
    """Convert URL to a clean filename."""
    parsed = urlparse(url)
    path = unquote(parsed.path)

    # Get the filename part
    name = Path(path).stem

    # Classify into subdirectory
    if '/Boron/' in path:
        # Extract chapter number
        match = re.search(r'Chapter(\d+)', name)
        chapter = match.group(1).zfill(2) if match else name
        return f"boron-letters/chapter-{chapter}.txt"

    if path.endswith('.pdf'):
        return f"pdfs/{name}.pdf"

    # Clean filename
    name = re.sub(r'[^\w\-]', '_', name)
    name = re.sub(r'_+', '_', name).strip('_').lower()

    if '/2005/' in path or '/2006/' in path or '/2007/' in path or \
       '/2008/' in path or '/2009/' in path or '/2011/' in path or \
       '/2013/' in path:
        year = re.search(r'/(\d{4})/', path)
        yr = year.group(1) if year else "undated"
        return f"newsletters-dated/{yr}_{name}.txt"

    if 'Newletter-archives-protected' in path:
        return f"newsletters-archived/{name}.txt"

    if any(x in path.lower() for x in ['goodbye', 'farewell', 'iraqisecret',
                                         '12-month', 'sleazypitch', 'envelope',
                                         'specialreport', 'internetsecrets']):
        return f"special/{name}.txt"

    return f"newsletters/{name}.txt"


def categorize_url(url: str) -> str:
    """Get category label for display."""
    if '/Boron/' in url:
        return "BORON"
    if url.endswith('.pdf'):
        return "PDF"
    if any(f'/{y}/' in url for y in ['2005','2006','2007','2008','2009','2011','2013']):
        return "DATED"
    if 'archives-protected' in url:
        return "ARCHIVED"
    return "NEWSLETTER"


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════

def main():
    dry_run = "--dry-run" in sys.argv

    session = requests.Session()
    session.headers.update(HEADERS)

    total = len(URLS)
    ok = 0
    skip = 0
    fail = 0

    print("=" * 60)
    print("  CopywriterOS — Gary Halbert Letter Scraper")
    print(f"  Target: {DATA_DIR}")
    print(f"  URLs: {total}")
    print(f"  Delay: {DELAY}s")
    if dry_run:
        print("  MODE: DRY RUN (no downloads)")
    print("=" * 60)
    print()

    for i, url in enumerate(URLS, 1):
        filename = url_to_filename(url)
        dest = DATA_DIR / filename
        cat = categorize_url(url)

        # Skip if already exists
        if dest.exists() and dest.stat().st_size > 100:
            skip += 1
            continue

        print(f"  [{i}/{total}] [{cat}] {filename}")

        if dry_run:
            ok += 1
            continue

        try:
            dest.parent.mkdir(parents=True, exist_ok=True)

            # PDFs: download binary
            if url.endswith('.pdf'):
                r = session.get(url, timeout=30)
                r.raise_for_status()
                with open(dest, 'wb') as f:
                    f.write(r.content)
                size = dest.stat().st_size
                print(f"    OK: {size:,} bytes (PDF)")
                ok += 1
                time.sleep(DELAY)
                continue

            # HTML: fetch and extract text
            r = session.get(url, timeout=30)
            r.raise_for_status()

            # Detect encoding
            if r.encoding and r.encoding.lower() not in ('utf-8', 'ascii'):
                r.encoding = r.apparent_encoding or 'utf-8'

            text = html_to_text(r.text)

            if len(text) < 100:
                print(f"    WARN: very short content ({len(text)} chars)")

            # Change extension from .txt if needed
            with open(dest, 'w', encoding='utf-8') as f:
                f.write(f"SOURCE: {url}\n")
                f.write(f"SCRAPED: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 60 + "\n\n")
                f.write(text)

            size = dest.stat().st_size
            print(f"    OK: {size:,} bytes ({len(text):,} chars)")
            ok += 1

        except requests.exceptions.HTTPError as e:
            status = e.response.status_code if e.response is not None else "?"
            print(f"    FAIL: HTTP {status}")
            fail += 1

        except Exception as e:
            print(f"    FAIL: {e}")
            fail += 1

        time.sleep(DELAY)

    print()
    print("=" * 60)
    print(f"  Concluido! Total={total} OK={ok} Skip={skip} Fail={fail}")
    print(f"  Arquivos em: {DATA_DIR}/")
    print("=" * 60)

    # Save summary
    summary = {
        "total": total,
        "ok": ok,
        "skip": skip,
        "fail": fail,
        "data_dir": str(DATA_DIR),
        "categories": {
            "boron-letters": 25,
            "newsletters": "~110",
            "newsletters-dated": "~34",
            "newsletters-archived": "~18",
            "special": "~9",
            "pdfs": 2,
        }
    }
    summary_path = DATA_DIR / "download-summary.json"
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)


if __name__ == "__main__":
    main()
