#!/usr/bin/env python3
"""Audit atomization status for the copy squad."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THRESHOLDS = {
    'agents': 500,
    'tasks': 500,
    'workflows': 250,
    'checklists': 400,
    'templates': 400,
}


def count_lines(path: Path) -> int:
    return sum(1 for _ in path.open('r', encoding='utf-8', errors='ignore'))


def main() -> None:
    report = {}
    for folder, threshold in THRESHOLDS.items():
        base = ROOT / folder
        files = [p for p in base.rglob('*') if p.is_file()]
        rows = []
        for path in files:
            rows.append({
                'path': path.relative_to(ROOT).as_posix(),
                'lines': count_lines(path),
            })
        rows.sort(key=lambda item: item['lines'], reverse=True)
        report[folder] = {
            'threshold': threshold,
            'total_files': len(rows),
            'over_threshold': sum(1 for row in rows if row['lines'] > threshold),
            'max_lines': rows[0]['lines'] if rows else 0,
            'top_files': rows[:10],
        }

    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
