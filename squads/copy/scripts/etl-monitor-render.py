#!/usr/bin/env python3
"""
ETL Monitor Renderer v2 — Minimal aesthetic dashboard
"""

import json
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path

# ANSI
R = '\033[0m'
B = '\033[1m'
D = '\033[2m'
GREEN = '\033[38;5;78m'
CYAN = '\033[38;5;80m'
YELLOW = '\033[38;5;222m'
RED = '\033[38;5;203m'
MAGENTA = '\033[38;5;170m'
BLUE = '\033[38;5;111m'
GRAY = '\033[38;5;242m'
WHITE = '\033[38;5;255m'
BG_BAR = '\033[48;5;236m'
BG_DONE = '\033[48;5;34m'
BG_RUN = '\033[48;5;37m'
BG_PEND = '\033[48;5;236m'

TIER_CLR = {'T0': MAGENTA, 'T1': RED, 'T2': YELLOW, 'T3': BLUE, 'T4': GRAY}


def fmt_time(s):
    if not s or s <= 0:
        return '--'
    h, rem = divmod(int(s), 3600)
    m, sec = divmod(rem, 60)
    return f'{h}h{m:02d}m' if h else f'{m}m{sec:02d}s'


def count_lines(fp):
    try:
        with open(fp) as f:
            return sum(1 for _ in f)
    except Exception:
        return 0


def load_state(fp):
    try:
        with open(fp) as f:
            return json.load(f)
    except Exception:
        return None


def progress_bar(done, total, width=20):
    if total == 0:
        return f'{BG_BAR}{" " * width}{R}'
    filled = int(width * done / total)
    running = 1 if done < total else 0
    pending = width - filled - running
    return (f'{BG_DONE}{" " * filled}{R}'
            f'{BG_RUN}{" " * running}{R}'
            f'{BG_BAR}{" " * pending}{R}')


def get_queued_agents(queue_file):
    try:
        import yaml
        with open(queue_file) as f:
            data = yaml.safe_load(f)
        slugs = []
        for group in ['pilot', 't0_diagnostic', 't1_masters', 't2_systematizers', 't3_remaining']:
            for agent in data.get(group, []):
                slugs.append(agent['slug'])
        return slugs
    except Exception:
        return []


def discover_agents(minds_dir, queue_file, agent_filter=None):
    if agent_filter:
        return [agent_filter]
    agents = set()
    if os.path.isdir(minds_dir):
        for e in os.scandir(minds_dir):
            if e.is_dir() and e.name != 'alex-hormozi':
                agents.add(e.name)
    for s in get_queued_agents(queue_file):
        agents.add(s)
    return sorted(agents)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--minds-dir', required=True)
    p.add_argument('--queue-file', required=True)
    p.add_argument('--golden-ref', required=True)
    p.add_argument('--agent', default='')
    p.add_argument('--logs', action='store_true')
    p.add_argument('--log-lines', type=int, default=10)
    args = p.parse_args()

    now = datetime.now().strftime('%H:%M:%S')
    agents = discover_agents(args.minds_dir, args.queue_file, args.agent or None)

    # Collect agent data
    rows = []
    done_n = run_n = pend_n = 0
    for slug in agents:
        mind_dir = os.path.join(args.minds_dir, slug)
        sf = os.path.join(mind_dir, 'state', 'etl-7d-state.json')
        state = load_state(sf) if os.path.isfile(sf) else None

        if not state:
            pend_n += 1
            rows.append({'slug': slug, 'status': 'queued'})
            continue

        phases = state.get('phases', {})
        comp = sum(1 for p in phases.values() if p.get('status') == 'complete')
        total = len(phases)
        cur = next((pid for pid, p in phases.items() if p.get('status') == 'in_progress'), None)

        if comp == total and total > 0:
            status = 'done'
            done_n += 1
        elif cur:
            status = 'running'
            run_n += 1
        else:
            status = 'pending'
            pend_n += 1

        # Elapsed
        elapsed = 0
        created = state.get('created_at', '')
        if created:
            try:
                elapsed = (datetime.now() - datetime.fromisoformat(created)).total_seconds()
            except Exception:
                pass

        # Outputs
        v_lines = count_lines(os.path.join(mind_dir, 'voice_dna.yaml'))
        t_lines = count_lines(os.path.join(mind_dir, 'thinking_dna.yaml'))

        rows.append({
            'slug': slug,
            'status': status,
            'tier': state.get('tier', '?'),
            'comp': comp,
            'total': total,
            'cur_phase': cur,
            'elapsed': elapsed,
            'v_lines': v_lines,
            't_lines': t_lines,
            'words': state.get('source_validation', {}).get('total_words', 0),
        })

    total_agents = len(agents)

    # ═══ RENDER ═══

    # Header bar
    print()
    print(f'  {MAGENTA}{"━" * 58}{R}')
    print(f'  {B}{WHITE}RALPH-7D{R}  {D}ETL Monitor  ·  {now}{R}')
    print(f'  {MAGENTA}{"━" * 58}{R}')
    print()

    # Summary
    pct = int(100 * done_n / total_agents) if total_agents else 0
    summary_bar = progress_bar(done_n, total_agents, 30)
    print(f'  {summary_bar}  {B}{pct}%{R}  {GREEN}{done_n}{R}/{total_agents} done', end='')
    if run_n:
        print(f'  {CYAN}◉ {run_n} running{R}', end='')
    if pend_n:
        print(f'  {GRAY}○ {pend_n} queued{R}', end='')
    print()
    print()

    # Agent rows
    for r in rows:
        slug = r['slug']

        if r['status'] == 'queued':
            print(f'  {GRAY}{"·":>2}  {slug:<20} {D}queued{R}')
            continue

        tier = r['tier']
        tc = TIER_CLR.get(tier, GRAY)
        comp, total = r['comp'], r['total']
        bar = progress_bar(comp, total, 16)

        if r['status'] == 'done':
            icon = f'{GREEN}✓{R}'
            label = f'{GREEN}done{R}'
        elif r['status'] == 'running':
            icon = f'{CYAN}◉{R}'
            label = f'{CYAN}phase {r["cur_phase"]}{R}'
        else:
            icon = f'{GRAY}○{R}'
            label = f'{GRAY}pending{R}'

        elapsed_s = fmt_time(r['elapsed'])

        # Main line
        print(f'  {icon}  {B}{slug:<20}{R} {tc}{tier:<3}{R} {bar} {label:<14} {D}{elapsed_s}{R}')

        # Output line (only if has data)
        if r['status'] == 'done':
            v = r['v_lines']
            t = r['t_lines']
            print(f'     {" " * 20}      {GREEN}voice:{v}L  thinking:{t}L{R}')
        elif r['status'] == 'running':
            w = r['words']
            if w:
                print(f'     {" " * 20}      {D}{w:,}w source{R}')

    print()

    # Process indicator
    import subprocess
    try:
        result = subprocess.run(['pgrep', '-f', 'ralph-7d.sh'], capture_output=True, text=True, timeout=3)
        pids = result.stdout.strip().replace('\n', ', ')
        running = bool(pids)
    except Exception:
        running = False
        pids = ''

    if running:
        print(f'  {GREEN}●{R} {D}pipeline active  pid:{pids}{R}')
    else:
        print(f'  {GRAY}○{R} {D}pipeline idle{R}')

    # Logs — only running agent, last N lines, stripped of ANSI noise
    if args.logs:
        running_agents = [r for r in rows if r['status'] == 'running']
        if running_agents:
            print()
            for r in running_agents:
                log = os.path.join(args.minds_dir, r['slug'], 'state', 'ralph-7d.log')
                if os.path.isfile(log):
                    print(f'  {D}── {r["slug"]} log ──{R}')
                    try:
                        with open(log) as f:
                            lines = f.readlines()
                        for line in lines[-args.log_lines:]:
                            clean = line.rstrip()
                            if clean:
                                print(f'  {D}  {clean}{R}')
                    except Exception:
                        pass

    print()


if __name__ == '__main__':
    main()
