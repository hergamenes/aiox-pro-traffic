#!/usr/bin/env python3
"""Build a compact, phase-aware runtime prompt for copy.sh."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Iterable

import yaml


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"{path} did not parse to an object")
    return data


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"{path} did not parse to a mapping")
    return data


def phase_candidates(value: Any) -> list[str]:
    if value is None:
        return []
    raw = str(value).strip()
    if not raw:
        return []

    candidates = [raw, raw.upper()]
    if raw.isdigit():
        candidates.extend([f"PHASE-{int(raw)}", f"PHASE-{raw}"])
    elif raw.upper().startswith("PHASE-"):
        suffix = raw.split("-", 1)[1]
        candidates.append(suffix)
    return list(dict.fromkeys(candidates))


def find_phase(phases: Iterable[dict[str, Any]], current_phase: Any) -> tuple[dict[str, Any] | None, int | None]:
    phases = list(phases)
    candidates = set(phase_candidates(current_phase))

    for index, phase in enumerate(phases, start=1):
        phase_id = str(phase.get("id", "")).strip()
        phase_name = str(phase.get("name", "")).strip()
        if phase_id in candidates or phase_name in candidates:
            return phase, index

    if isinstance(current_phase, int) or (isinstance(current_phase, str) and current_phase.isdigit()):
        numeric = int(current_phase)
        if 1 <= numeric <= len(phases):
            return phases[numeric - 1], numeric

    return None, None


def tail_items(items: list[Any], limit: int) -> list[Any]:
    if limit <= 0:
        return []
    return items[-limit:]


def summarize_artifacts(artifacts: list[Any], limit: int) -> list[str]:
    recent_artifacts: list[str] = []
    for item in tail_items(artifacts, limit):
        if isinstance(item, dict):
            name = item.get("name") or item.get("path") or item.get("id")
            if name:
                recent_artifacts.append(str(name))
        elif isinstance(item, str):
            recent_artifacts.append(item)
    return recent_artifacts


def summarize_state(
    state: dict[str, Any],
    *,
    max_recent_tasks: int,
    max_recent_artifacts: int,
    max_agents_used: int,
) -> dict[str, Any]:
    artifacts = state.get("artifacts") or []
    checkpoints = state.get("checkpoints") or []
    tasks_completed = state.get("tasks_completed") or []
    agents_used = state.get("agents_used") or []

    return {
        "project": state.get("project"),
        "workflow_id": state.get("workflow_id"),
        "current_phase": state.get("current_phase"),
        "iteration": state.get("iteration", 0),
        "tasks_completed_count": len(tasks_completed),
        "recent_tasks_completed": tail_items(tasks_completed, max_recent_tasks),
        "artifacts_count": len(artifacts),
        "recent_artifacts": summarize_artifacts(artifacts, max_recent_artifacts),
        "checkpoints_count": len(checkpoints),
        "latest_checkpoint": checkpoints[-1] if checkpoints else None,
        "agents_used": tail_items(agents_used, max_agents_used),
        "decision_matrix_answers": state.get("decision_matrix_answers") or state.get("decision_matrix") or {},
    }


def task_is_completed(task: dict[str, Any], completed: set[str]) -> bool:
    keys = [
        task.get("task_file"),
        task.get("id"),
        task.get("name"),
    ]
    return any(str(key) in completed for key in keys if key)


def compact_task_summary(phase: dict[str, Any], completed_items: list[Any]) -> list[dict[str, Any]]:
    completed = {str(item) for item in completed_items}
    rows: list[dict[str, Any]] = []
    for task in phase.get("tasks", []) or []:
        if not isinstance(task, dict):
            continue
        rows.append(
            {
                "id": task.get("id"),
                "name": task.get("name"),
                "status": "completed" if task_is_completed(task, completed) else "pending",
                "task_file": task.get("task_file"),
                "alternate_task": task.get("alternate_task"),
                "agent": task.get("agent"),
                "alternate_agent": task.get("alternate_agent"),
                "secondary_agents": task.get("secondary_agents", []),
                "depends_on": task.get("depends_on", []),
                "outputs": task.get("outputs", []),
            }
        )
    return rows


def yaml_block(data: Any) -> str:
    return yaml.safe_dump(
        data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    ).strip()


def clean_line(line: str) -> str:
    return re.sub(r"\s+", " ", line.strip())


def clip_line(line: str, max_chars: int) -> str:
    if len(line) <= max_chars:
        return line
    if max_chars <= 1:
        return line[:max_chars]
    return line[: max_chars - 1].rstrip() + "…"


def parse_sections(lines: list[str]) -> list[tuple[str, list[str]]]:
    sections: list[tuple[str, list[str]]] = []
    current_heading = "Preamble"
    current_lines: list[str] = []

    for raw_line in lines:
        if raw_line.startswith("#"):
            if current_lines or current_heading != "Preamble":
                sections.append((current_heading, current_lines))
            current_heading = clean_line(raw_line.lstrip("#").strip() or "Untitled")
            current_lines = []
            continue
        current_lines.append(raw_line)

    if current_lines or current_heading != "Preamble":
        sections.append((current_heading, current_lines))

    return sections


def score_section(heading: str, section_lines: list[str]) -> int:
    score = 0
    heading_lower = heading.lower()
    joined = " ".join(section_lines).lower()
    priority_terms = {
        "next": 6,
        "próxim": 6,
        "action": 5,
        "ação": 5,
        "todo": 5,
        "pending": 5,
        "block": 7,
        "risk": 4,
        "decision": 4,
        "checkpoint": 3,
        "artifact": 3,
        "handoff": 2,
    }
    for term, weight in priority_terms.items():
        if term in heading_lower:
            score += weight
        if term in joined:
            score += max(1, weight - 2)
    if any(line.lstrip().startswith(("-", "*", "1.", "2.", "3.")) for line in section_lines):
        score += 2
    return score


def summarize_handoff(path: Path, *, max_lines: int, max_chars: int) -> dict[str, Any] | None:
    if max_lines <= 0 or max_chars <= 0 or not path.exists():
        return None

    raw_text = path.read_text(encoding="utf-8").strip()
    if not raw_text:
        return {
            "status": "empty",
            "source": str(path),
            "selected_lines": [],
        }

    cleaned_lines = [clean_line(line) for line in raw_text.splitlines() if clean_line(line)]
    if not cleaned_lines:
        return {
            "status": "empty",
            "source": str(path),
            "selected_lines": [],
        }

    sections = parse_sections(cleaned_lines)
    ranked_sections = sorted(
        sections,
        key=lambda item: (score_section(item[0], item[1]), len(item[1])),
        reverse=True,
    )

    selected: list[str] = []
    selected_keys: set[str] = set()
    omitted_lines = len(cleaned_lines)
    remaining_chars = max_chars

    for heading, section_lines in ranked_sections:
        candidates = [f"## {heading}"]
        candidates.extend(section_lines)
        truncated = False

        for line in candidates:
            if len(selected) >= max_lines or remaining_chars <= 0:
                break

            clipped = clip_line(line, min(remaining_chars, max_chars))
            if not clipped:
                continue
            key = clipped.casefold()
            if key in selected_keys:
                continue

            line_cost = len(clipped) + 1
            if line_cost > remaining_chars and selected:
                break

            selected.append(clipped)
            selected_keys.add(key)
            remaining_chars -= line_cost
            omitted_lines -= 1
            if clipped != line:
                truncated = True
                break

        if len(selected) >= max_lines or remaining_chars <= 0:
            break
        if truncated:
            break

    if not selected:
        fallback = clip_line(cleaned_lines[-1], max_chars)
        selected = [fallback]
        omitted_lines = max(0, len(cleaned_lines) - 1)

    status = "truncated" if omitted_lines > 0 else "full"
    return {
        "status": status,
        "source": str(path),
        "selected_lines": selected,
        "total_nonempty_lines": len(cleaned_lines),
        "omitted_lines": max(0, omitted_lines),
    }


def build_prompt(args: argparse.Namespace) -> str:
    state = load_json(args.state_file)
    state_summary = summarize_state(
        state,
        max_recent_tasks=args.max_recent_tasks,
        max_recent_artifacts=args.max_recent_artifacts,
        max_agents_used=args.max_agents_used,
    )
    handoff_summary = summarize_handoff(
        args.handoff_file,
        max_lines=args.max_handoff_lines,
        max_chars=args.max_handoff_chars,
    )

    lines: list[str] = [
        "# Copy Workflow Runner - Compact Prompt",
        "",
        "Use filesystem reads instead of relying on this prompt for full context.",
        "The goal is to keep this iteration focused on the active workflow slice only.",
        "",
        "## Runtime Context",
        f"- PROJECT_DIR: {args.project_dir}",
        f"- STATE_FILE: {args.state_file}",
        f"- PROGRESS_FILE: {args.progress_file}",
        f"- HANDOFF_FILE: {args.handoff_file}",
        f"- OUTPUTS_DIR: {args.outputs_dir}",
        f"- WORKFLOWS_DIR: {args.workflows_dir}",
        f"- CURRENT_PHASE: {args.current_phase}",
        f"- WORKFLOW_ID: {args.workflow_id}",
        f"- ITERATION: {args.iteration}",
        "",
        "## Mandatory Signals",
        "- `<promise>COMPLETE</promise>` when every phase is done",
        "- `<promise>CHECKPOINT:PHASE-X</promise>` when the active phase is complete",
        "- `<promise>BLOCKED:reason</promise>` when you cannot proceed safely",
        "",
        "## Loading Policy",
        "- Read `STATE_FILE` first.",
        "- If `HANDOFF_FILE` exists, read it before acting.",
        "- Do not read unrelated workflow phases.",
        "- Do not preload all agents, frameworks, or reference packs.",
        "- Read only the task files and agent files required by the pending tasks in the active phase.",
        "- For atomized agents, read only the packs referenced by the command you actually invoke.",
    ]

    if args.project_prompt_file:
        lines.extend([
            f"- Read project-specific instructions from `{args.project_prompt_file}`.",
        ])

    lines.extend([
        "",
        "## Current State Summary",
        "```yaml",
        yaml_block(state_summary),
        "```",
    ])

    if handoff_summary is not None:
        lines.extend([
            "",
            "## Handoff Summary",
            "```yaml",
            yaml_block(handoff_summary),
            "```",
            "If this summary is insufficient, read `HANDOFF_FILE` directly after `STATE_FILE`.",
        ])

    if not args.workflow_id or str(args.workflow_id).lower() in {"none", "null"}:
        lines.extend([
            "",
            "## Decision Matrix Required",
            "Workflow is not selected yet. Read `STATE_FILE`, then answer and persist these fields:",
            "- awareness_level: Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware",
            "- market_sophistication: 1 | 2 | 3 | 4 | 5",
            "- price_point: Low | Mid | High | Premium",
            "- traffic_temperature: Cold | Warm | Hot",
            "- primary_output: VSL | Sales Letter | Email Sequence | Ad Creative | Webinar | Direct Mail | Landing Page | Content",
            "",
            "After selecting the workflow, update `workflow_id`, set the next phase, and continue.",
            "",
            "## Minimal Working Contract",
            "1. Read `STATE_FILE`.",
            "2. Update the decision matrix answers.",
            "3. Pick the workflow.",
            "4. Persist state changes.",
            "5. Emit `<promise>CHECKPOINT:PHASE-1</promise>` when ready for execution or `<promise>BLOCKED:reason</promise>` if missing core inputs.",
        ])
        return "\n".join(lines).strip() + "\n"

    workflow_file = args.workflows_dir / f"{args.workflow_id}.yaml"
    if not workflow_file.exists():
        lines.extend([
            "",
            "## Workflow File Missing",
            f"- Expected workflow file: `{workflow_file}`",
            "- Read `STATE_FILE`, document the blocker, and emit `<promise>BLOCKED:workflow file missing</promise>`.",
        ])
        return "\n".join(lines).strip() + "\n"

    workflow_doc = load_yaml(workflow_file)
    workflow_meta = workflow_doc.get("workflow") or {}
    phases = workflow_doc.get("phases") or []
    current_phase, phase_index = find_phase(phases, args.current_phase)

    compact_workflow_meta = {
        "id": workflow_meta.get("id"),
        "name": workflow_meta.get("name"),
        "type": workflow_meta.get("type"),
        "version": workflow_meta.get("version"),
        "description": workflow_meta.get("description"),
        "decision_matrix_defaults": workflow_meta.get("decision_matrix_defaults"),
        "sequence": workflow_meta.get("sequence"),
        "handoff_prompts": workflow_meta.get("handoff_prompts"),
    }

    lines.extend([
        "",
        "## Workflow Slice",
        f"- Workflow file: `{workflow_file}`",
        f"- Total phases: {len(phases)}",
        "```yaml",
        yaml_block(compact_workflow_meta),
        "```",
    ])

    if current_phase is None:
        lines.extend([
            "",
            "## Active Phase Not Resolved",
            f"- `current_phase` from state: `{args.current_phase}`",
            "- Read the workflow file directly, resolve the phase manually, update the state if needed, and continue carefully.",
        ])
        return "\n".join(lines).strip() + "\n"

    compact_phase = {
        "phase_index": phase_index,
        "id": current_phase.get("id"),
        "name": current_phase.get("name"),
        "day": current_phase.get("day"),
        "tier": current_phase.get("tier"),
        "description": current_phase.get("description"),
        "depends_on": current_phase.get("depends_on", []),
        "checkpoint": current_phase.get("checkpoint", {}),
        "tasks": compact_task_summary(current_phase, state.get("tasks_completed") or []),
    }

    pending_reads: list[str] = []
    for task in compact_phase["tasks"]:
        if task["status"] != "pending":
            continue
        if task.get("task_file"):
            pending_reads.append(f"tasks/{task['task_file']}")
        if task.get("agent"):
            pending_reads.append(f"agents/{task['agent']}.md")
        for agent_name in task.get("secondary_agents") or []:
            pending_reads.append(f"agents/{agent_name}.md")
        if task.get("alternate_agent"):
            pending_reads.append(f"agents/{task['alternate_agent']}.md")
        if task.get("alternate_task"):
            pending_reads.append(f"tasks/{task['alternate_task']}")

    deduped_reads = list(dict.fromkeys(pending_reads))

    lines.extend([
        "",
        "## Active Phase",
        "```yaml",
        yaml_block(compact_phase),
        "```",
        "",
        "## Priority Reads For This Iteration",
    ])

    if deduped_reads:
        lines.extend([f"- `{path}`" for path in deduped_reads])
    else:
        lines.append("- No pending tasks detected in the current phase. Verify checkpoint/completion conditions.")

    lines.extend([
        "",
        "## Execution Contract",
        "1. Read `STATE_FILE` and reconcile it with the workflow slice above.",
        "2. Read only the pending task files listed above.",
        "3. For each pending task, read the referenced agent core and only the necessary packs/frameworks.",
        "4. Generate or update the required artifacts under `OUTPUTS_DIR`.",
        "5. Persist progress to `STATE_FILE`, `PROGRESS_FILE`, and `HANDOFF_FILE`.",
        "6. If all tasks in the active phase are done, satisfy the checkpoint and emit the checkpoint signal.",
        "7. If all phases are done, emit `<promise>COMPLETE</promise>`.",
        "",
        "## Quality Gates",
        "- Do not mark a phase complete before all required tasks are completed.",
        "- Do not invent missing context; record assumptions and blockers explicitly.",
        "- Do not emit false COMPLETE or false CHECKPOINT signals.",
    ])

    return "\n".join(lines).strip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build compact runtime prompt for Copy Squad")
    parser.add_argument("--project-dir", type=Path, required=True)
    parser.add_argument("--state-file", type=Path, required=True)
    parser.add_argument("--progress-file", type=Path, required=True)
    parser.add_argument("--handoff-file", type=Path, required=True)
    parser.add_argument("--outputs-dir", type=Path, required=True)
    parser.add_argument("--workflows-dir", type=Path, required=True)
    parser.add_argument("--workflow-id", required=True)
    parser.add_argument("--current-phase", required=True)
    parser.add_argument("--iteration", required=True)
    parser.add_argument("--project-prompt-file", type=Path)
    parser.add_argument("--max-recent-tasks", type=int, default=3)
    parser.add_argument("--max-recent-artifacts", type=int, default=3)
    parser.add_argument("--max-agents-used", type=int, default=5)
    parser.add_argument("--max-handoff-lines", type=int, default=12)
    parser.add_argument("--max-handoff-chars", type=int, default=1200)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    print(build_prompt(args), end="")


if __name__ == "__main__":
    main()
