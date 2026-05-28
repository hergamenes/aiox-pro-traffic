#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SQUAD_DIR}/../.." && pwd)"
WORKSPACE_ROOT="${WORKSPACE_ROOT:-${REPO_ROOT}/workspace}"

python3 - "${SQUAD_DIR}" "${REPO_ROOT}" "${WORKSPACE_ROOT}" <<'PY'
import sys
from pathlib import Path

import yaml

squad_dir = Path(sys.argv[1])
repo_root = Path(sys.argv[2])
workspace_root = Path(sys.argv[3])
manifest_files = ("squad.yaml", "config.yaml")


def resolve_manifest_path() -> Path | None:
    for name in manifest_files:
        candidate = squad_dir / name
        if candidate.exists():
            return candidate
    return None

errors = []
warnings = []
manifest_path = resolve_manifest_path()

if manifest_path is None:
    errors.append(
        "missing manifest: expected squads/copy/squad.yaml or squads/copy/config.yaml"
    )
else:
    with manifest_path.open("r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f) or {}
    manifest_name = manifest_path.name

    ws = cfg.get("workspace_integration")
    if not isinstance(ws, dict):
        errors.append(f"{manifest_name} missing workspace_integration block")
    else:
        level = ws.get("level")
        allowed = {"none", "read_only", "read_write", "workspace_first"}
        if level not in allowed:
            errors.append(f"invalid workspace_integration.level: {level}")

        read_paths = ws.get("read_paths") or []
        write_paths = ws.get("write_paths") or []
        if not isinstance(read_paths, list) or len(read_paths) == 0:
            errors.append("workspace_integration.read_paths must be a non-empty list")
        if not isinstance(write_paths, list):
            errors.append("workspace_integration.write_paths must be a list")

        for rel in read_paths + write_paths:
            p = repo_root / rel
            if not p.exists():
                errors.append(f"declared workspace path not found: {rel}")

        if level == "workspace_first":
            required_scripts = [
                squad_dir / "scripts" / "bootstrap-copy-workspace.sh",
                squad_dir / "scripts" / "validate-copy-essentials.sh",
            ]
            for script_path in required_scripts:
                if not script_path.exists():
                    errors.append(f"workspace_first requires script: {script_path.relative_to(repo_root)}")

required_files = [
    workspace_root / "_templates/business-template/L1-strategy/offerbook.yaml",
    workspace_root / "_templates/business-template/L2-tactical/brand/brand-platform.yaml",
    workspace_root / "_templates/business-template/L2-tactical/movement/movement-manifest.yaml",
]

for file_path in required_files:
    if not file_path.exists():
        errors.append(f"missing workspace essential: {file_path.relative_to(repo_root)}")

business_offerbooks = list(workspace_root.glob("businesses/*/L1-strategy/offerbook.yaml"))
product_offerbooks = list(workspace_root.glob("businesses/*/L3-product/*/offerbook.yaml"))
brand_assets = list(workspace_root.glob("businesses/*/L2-tactical/brand/*.yaml"))
movement_assets = list(workspace_root.glob("businesses/*/L2-tactical/movement/*.yaml"))
sales_processes = list(workspace_root.glob("businesses/*/L3-product/*/sales-process.yaml"))

if not business_offerbooks and not product_offerbooks:
    errors.append(
        "missing workspace essential: no business offerbook found under "
        "workspace/businesses/*/(L1-strategy|L3-product/*)"
    )

if not brand_assets:
    errors.append(
        "missing workspace essential: no brand assets found under "
        "workspace/businesses/*/L2-tactical/brand/"
    )

if not movement_assets:
    warnings.append(
        "no movement assets found under workspace/businesses/*/L2-tactical/movement/ "
        "(copy can continue, but narrative depth may be reduced)"
    )

if not sales_processes:
    warnings.append(
        "no sales-process.yaml found under workspace/businesses/*/L3-product/*/ "
        "(workflow-linked copy tasks may need manual input)"
    )

copy_task = squad_dir / "tasks" / "load-workspace-context.md"
if not copy_task.exists():
    errors.append("missing task: squads/copy/tasks/load-workspace-context.md")

if errors:
    print("validate-copy-essentials: FAIL")
    for item in errors:
        print(f"  - {item}")
    sys.exit(1)

print("validate-copy-essentials: PASS")
for item in warnings:
    print(f"  - warning: {item}")
PY
