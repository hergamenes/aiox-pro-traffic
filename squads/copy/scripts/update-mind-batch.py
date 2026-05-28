#!/usr/bin/env python3
"""
CopywriterOS — Batch Update Mind

Inserts LEVEL 5.5: KNOWLEDGE BASE section into each agent file,
referencing their frameworks_inventory.yaml from Wave 1 extraction.

Follows the Tay Dantas pattern (squads/branding/agents/tay-dantas.md).

Usage:
  python update-mind-batch.py --all          # Update all 16 agents
  python update-mind-batch.py --agent joe-sugarman  # Update one agent
  python update-mind-batch.py --list         # Show status
  python update-mind-batch.py --all --dry-run  # Preview without writing
"""

import argparse
import re
from pathlib import Path
from datetime import datetime


SCRIPT_DIR = Path(__file__).parent
SQUAD_DIR = SCRIPT_DIR.parent
AGENTS_DIR = SQUAD_DIR / "agents"
BOOKS_DIR = SQUAD_DIR / "data" / "books"

# Agent metadata for knowledge_base descriptions
AGENT_META = {
    "joe-sugarman": {
        "desc": "30 Psychological Triggers + Axioms of Copywriting + Slippery Slide from Triggers (1999), Adweek Handbook (2007), Advertising Secrets (1998)",
        "use_for": "QA Gate evaluation — score copy against all 30 triggers, check Slippery Slide, validate axioms",
    },
    "claude-hopkins": {
        "desc": "Scientific advertising method, reason-why advertising, coupon-based measurement, sampling strategy from Scientific Advertising (1923) and My Life in Advertising (1927)",
        "use_for": "Diagnostic protocol — claim audit, specificity check, reason-why analysis, test planning",
    },
    "eugene-schwartz": {
        "desc": "5 Levels of Awareness, Market Sophistication Scale, Mass Desire channeling, 38 Verbalization Techniques from Breakthrough Advertising (1966) and Brilliance Breakthrough (1994)",
        "use_for": "Diagnostic — awareness level assessment, sophistication staging, headline strategy by awareness level",
    },
    "robert-collier": {
        "desc": "Enter the Conversation, 6 Essentials of Every Letter, Six Prime Motives, desire-based sequencing from The Robert Collier Letter Book (1931)",
        "use_for": "Diagnostic — conversation entry analysis, letter structure, desire-based sequencing",
    },
    "gary-halbert": {
        "desc": "A-Pile/B-Pile mail, AIDA for direct mail, Starving Crowd, proof elements, emotional hooks from The Boron Letters (2013) and Gary Halbert Letter newsletters",
        "use_for": "Sales letters, direct mail, emotional hooks, proof stacking, fascination bullets",
    },
    "gary-bencivenga": {
        "desc": "Persuasion Equation (UP+UP+UP+UP), Big Idea methodology, Yeah Sure Framework, testing philosophy from Bencivenga Bullets (100 issues) and interview transcripts",
        "use_for": "Sophisticated persuasion, Big Idea development, A/B testing strategy, control-beating",
    },
    "david-ogilvy": {
        "desc": "Brand Image Theory, Research-First methodology, Headline Rules, Long Copy philosophy from Ogilvy on Advertising (1983) and Confessions (1963)",
        "use_for": "Brand advertising, headline writing, research-driven campaigns, print ad structure",
    },
    "clayton-makepeace": {
        "desc": "Dominant Resident Emotion (DRE), Emotional Selling Proposition, proof stacking, 18-step promotion creation from Quickstart Copywriting System and Total Package newsletter",
        "use_for": "Health/supplement copy, financial copy, long-form promotions, emotional selling",
    },
    "parris-lampropoulos": {
        "desc": "Control-Beating Method, WOW Framework (Novelty+Surprise), Research Process, Lizard & Gatekeeper from interview transcripts and case studies",
        "use_for": "Control-beating strategy, deep research methodology, supplement and financial copy",
    },
    "john-carlton": {
        "desc": "Simple Writing System (SWS), Sales Detective approach, One-Legged Golfer methodology, Star/Story/Solution from Kick-Ass Copywriting Secrets (2003)",
        "use_for": "Direct response copy, product investigation, persuasive storytelling, street-level copy",
    },
    "jim-rutz": {
        "desc": "Magalog construction, Unpredictability Principle, Greased Slide, story-driven selling from analysis materials and third-party reviews",
        "use_for": "Magalogs, subscription copy, long-form direct mail, reader engagement",
    },
    "david-deutsch": {
        "desc": "Copythinking Process, IDEA POWER toolkit, Problem Awareness Spectrum, demonstration-based selling from TCC podcast and interview transcripts",
        "use_for": "Infomercials, DRTV copy, product demonstrations, idea-first copywriting",
    },
    "dan-kennedy": {
        "desc": "28-Step Sales Letter System, Marketing Triangle, No BS Rules, urgency/deadline frameworks from Ultimate Sales Letter (2011), No BS Direct Marketing (2013), and Magnetic Marketing (2018)",
        "use_for": "Sales letter systems, direct marketing strategy, urgency creation, lead generation",
    },
    "russell-brunson": {
        "desc": "Value Ladder, Attractive Character, Perfect Webinar, Epiphany Bridge, Hook-Story-Offer, Dream 100 from DotCom Secrets, Expert Secrets, Traffic Secrets trilogy",
        "use_for": "Funnel copy, webinar scripts, launch sequences, email sequences, traffic strategy",
    },
    "jeff-walker": {
        "desc": "Product Launch Formula (PLF), Sideways Sales Letter, Seed/Internal/JV Launch variants, 9 Mental Triggers from Launch (2014)",
        "use_for": "Product launches, pre-launch sequences, launch email campaigns, JV partnerships",
    },
    "ben-settle": {
        "desc": "10 Villain Charisma Pillars, Mission-First Charisma, Anti-Hero Positioning + Daily Email Methodology, Infotainment, Dead List Revival from Villains book + YouTube",
        "use_for": "Daily email copy, personality-driven marketing, anti-guru positioning, infotainment, list building",
    },
    "todd-brown": {
        "desc": "E5 Method Campaign Construction, Unique Mechanism Discovery, Big Marketing Idea Framework, CPA-to-AOV Golden Ratio, Island-to-Island Bridge Model from YouTube channel @ToddBrownMarketing",
        "use_for": "Marketing campaigns, funnel strategy, unique mechanism positioning, E5 campaign architecture",
    },
    "stefan-georgi": {
        "desc": "RMBC Method (Research-Mechanism-Brief-Copy), RMBC II AI-Enhanced, VSL frameworks, 11 Fascination Bullet Types, Named Oddity Technique from YouTube channel @StefanGeorgi",
        "use_for": "VSL creation, health/supplement copy, research-driven copywriting, fascination bullets, RMBC methodology",
    },
    "frank-kern": {
        "desc": "Intent-Based Branding (3 pillars), Mass Control, Results in Advance, 4-Day Cash Machine, Magic Equation, Content Compounding from YouTube channel @FrankKern",
        "use_for": "Intent-based branding, content marketing, launch strategy, relationship marketing, ad campaigns",
    },
    "jon-benson": {
        "desc": "5-Step VSL Formula (Snap-Vital-Problem-Solution-Offer), 9-Step Million Dollar VSL SOP, 90-Second Pattern Interrupt, Alpha-Omega Optimization from YouTube channel @JonBensonDotCom",
        "use_for": "VSL creation, conversational copy, video sales letters, headline formulas, hook discovery",
    },
    "ry-schwartz": {
        "desc": "Catalyzing a Conversation framework, PAISA Formula, 531 Research Method, Moment of Highest Tension Exercise, So What Sweep from YouTube interviews and presentations",
        "use_for": "Cohort launch copy, conversion copywriting, ecommerce product descriptions, sales video scripting",
    },
    "dan-koe": {
        "desc": "One-Person Business Model, Art of Focus, Digital Economics, Creator Quick Start, Kortex methodologies, Content Compounding, Value Creation from 2 books + 50+ course modules + 239 newsletters",
        "use_for": "Content creation systems, one-person business strategy, newsletter/thread writing, social media copy frameworks",
    },
    "andre-chaperon": {
        "desc": "Autoresponder Madness (ARM), Sphere of Influence, Tiny Little Businesses, story-based email marketing, soap opera sequences, Digital Sanctuaries from blog + interviews",
        "use_for": "Email sequences, autoresponder design, story-driven email marketing, audience building, trust-based marketing",
    },
}


def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")


def count_frameworks(yaml_path: Path) -> int:
    """Count framework entries in YAML file."""
    if not yaml_path.exists():
        return 0
    content = yaml_path.read_text()
    return len(re.findall(r'^\s*- name:', content, re.MULTILINE))


def has_knowledge_base(agent_content: str) -> bool:
    """Check if agent already has LEVEL 5.5 KNOWLEDGE BASE."""
    return "LEVEL 5.5" in agent_content or "KNOWLEDGE BASE" in agent_content


def build_kb_section(agent_id: str, framework_count: int, yaml_lines: int) -> str:
    """Build the LEVEL 5.5 KNOWLEDGE BASE section."""
    meta = AGENT_META.get(agent_id, {
        "desc": f"Frameworks extracted from {agent_id} source materials",
        "use_for": "Framework reference for copy production and evaluation",
    })

    return f"""
# ===============================================================================
# LEVEL 5.5: KNOWLEDGE BASE (ETL Wave 1 — Framework Extraction)
# ===============================================================================

knowledge_base:
  frameworks_inventory:
    file: "squads/copywriter-os/data/books/{agent_id}/frameworks_inventory.yaml"
    lines: {yaml_lines}
    frameworks: {framework_count}
    content: "{meta['desc']}"
    use_for: "{meta['use_for']}"
    version: "1.0"
    extraction_date: "2026-03-09"
    method: "PDF/TXT → Docling MD → Claude Opus 4.6 extraction"

"""


def find_level6_line(content: str) -> int:
    """Find the line number where LEVEL 6 starts."""
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'LEVEL 6' in line:
            # Go back to find the separator line before LEVEL 6
            for j in range(i - 1, max(i - 5, 0), -1):
                if lines[j].strip().startswith(('# ===', '<!-- ===')):
                    return j
            return i
    return -1


def update_agent(agent_id: str, dry_run: bool = False) -> dict:
    """Update a single agent with knowledge_base section."""
    agent_file = AGENTS_DIR / f"{agent_id}.md"
    yaml_file = BOOKS_DIR / agent_id / "frameworks_inventory.yaml"

    if not agent_file.exists():
        return {"agent": agent_id, "status": "error", "error": "Agent file not found"}

    if not yaml_file.exists():
        return {"agent": agent_id, "status": "skip", "reason": "No frameworks_inventory.yaml"}

    content = agent_file.read_text()

    if has_knowledge_base(content):
        return {"agent": agent_id, "status": "skip", "reason": "Already has knowledge_base"}

    framework_count = count_frameworks(yaml_file)
    yaml_lines = len(yaml_file.read_text().split('\n'))

    kb_section = build_kb_section(agent_id, framework_count, yaml_lines)

    # Find insertion point (before LEVEL 6)
    lines = content.split('\n')
    insert_idx = -1
    for i, line in enumerate(lines):
        if 'LEVEL 6' in line:
            # Go back to find separator before LEVEL 6
            for j in range(i - 1, max(i - 5, 0), -1):
                stripped = lines[j].strip()
                if stripped.startswith(('# ===', '<!-- ===')):
                    insert_idx = j
                    break
            if insert_idx == -1:
                insert_idx = i
            break

    if insert_idx == -1:
        return {"agent": agent_id, "status": "error", "error": "Could not find LEVEL 6 marker"}

    # Insert knowledge_base section
    new_lines = lines[:insert_idx] + kb_section.split('\n') + lines[insert_idx:]
    new_content = '\n'.join(new_lines)

    if dry_run:
        log(f"  DRY RUN {agent_id}: Would insert {framework_count} frameworks ref at line {insert_idx}")
    else:
        agent_file.write_text(new_content)
        log(f"  OK {agent_id}: Inserted knowledge_base ({framework_count} frameworks) at line {insert_idx}")

    return {
        "agent": agent_id,
        "status": "ok",
        "frameworks": framework_count,
        "insert_line": insert_idx,
    }


def main():
    parser = argparse.ArgumentParser(description="CopywriterOS — Batch Update Mind")
    parser.add_argument("--all", action="store_true", help="Update all agents")
    parser.add_argument("--agent", type=str, help="Update specific agent")
    parser.add_argument("--list", action="store_true", help="Show status")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    args = parser.parse_args()

    agents = sorted(AGENT_META.keys())

    if args.list or (not args.all and not args.agent):
        print(f"\n{'Agent':<25} {'Frameworks':<12} {'YAML Lines':<12} {'KB in Agent?'}")
        print("-" * 65)
        for agent_id in agents:
            yaml_file = BOOKS_DIR / agent_id / "frameworks_inventory.yaml"
            agent_file = AGENTS_DIR / f"{agent_id}.md"
            fw_count = count_frameworks(yaml_file) if yaml_file.exists() else 0
            yaml_lines = len(yaml_file.read_text().split('\n')) if yaml_file.exists() else 0
            has_kb = has_knowledge_base(agent_file.read_text()) if agent_file.exists() else False
            status = "YES" if has_kb else "NO"
            print(f"{agent_id:<25} {fw_count:<12} {yaml_lines:<12} {status}")
        return

    if args.agent:
        agents = [args.agent]

    log(f"Updating {len(agents)} agents {'(DRY RUN)' if args.dry_run else ''}")

    results = []
    for agent_id in agents:
        result = update_agent(agent_id, dry_run=args.dry_run)
        results.append(result)

    ok = sum(1 for r in results if r["status"] == "ok")
    skip = sum(1 for r in results if r["status"] == "skip")
    errors = sum(1 for r in results if r["status"] == "error")
    log(f"\nSummary: {ok} updated, {skip} skipped, {errors} errors")

    if errors:
        for r in results:
            if r["status"] == "error":
                log(f"  ERROR {r['agent']}: {r.get('error', 'unknown')}")


if __name__ == "__main__":
    main()
