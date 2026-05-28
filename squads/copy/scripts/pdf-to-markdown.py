#!/usr/bin/env python3
"""
CopywriterOS — PDF to Markdown Converter

Converte livros PDF dos agentes em Markdown via Docling (IBM).
Cada PDF processado em subprocess isolado (memory leak prevention).

Uso:
  python pdf-to-markdown.py --all                    # Todos os PDFs
  python pdf-to-markdown.py --agent joe-sugarman     # PDFs de um agent
  python pdf-to-markdown.py --list                   # Listar PDFs disponíveis
  python pdf-to-markdown.py --all --force            # Reconverter tudo

Requer: docling (via content-hub .venv)
"""

import os
import sys
import json
import argparse
import subprocess
import time
from pathlib import Path
from datetime import datetime


# ============================================================
# Config
# ============================================================

SCRIPT_DIR = Path(__file__).parent
SQUAD_DIR = SCRIPT_DIR.parent
BOOKS_DIR = SQUAD_DIR / "data" / "books"

# Use content-hub venv (docling installed there)
PROJECT_ROOT = SQUAD_DIR.parent.parent
VENV_PYTHON = PROJECT_ROOT / "tools" / "content-hub" / ".venv" / "bin" / "python"

# Timeouts by file size
TIMEOUT_SMALL = 600       # 10 min (< 10MB)
TIMEOUT_MEDIUM = 1800     # 30 min (10-30MB)
TIMEOUT_LARGE = 7200      # 2h (> 30MB)


# ============================================================
# Helpers
# ============================================================

def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")


def get_timeout(file_path: Path) -> int:
    size_mb = file_path.stat().st_size / (1024 * 1024)
    if size_mb < 10:
        return TIMEOUT_SMALL
    elif size_mb < 30:
        return TIMEOUT_MEDIUM
    return TIMEOUT_LARGE


def find_pdfs(agent: str = None) -> list[dict]:
    """Find all PDFs in books directory."""
    pdfs = []
    if not BOOKS_DIR.exists():
        return pdfs

    for agent_dir in sorted(BOOKS_DIR.iterdir()):
        if not agent_dir.is_dir():
            continue
        if agent and agent_dir.name != agent:
            continue

        # Find PDFs in agent dir and subdirs
        for pdf_path in sorted(agent_dir.rglob("*.pdf")):
            stem = pdf_path.stem
            md_path = pdf_path.with_suffix(".md")
            size_mb = pdf_path.stat().st_size / (1024 * 1024)

            pdfs.append({
                "agent": agent_dir.name,
                "name": stem,
                "pdf_path": pdf_path,
                "md_path": md_path,
                "size_mb": round(size_mb, 1),
                "converted": md_path.exists(),
            })

    return pdfs


def convert_pdf(pdf_info: dict, force: bool = False) -> dict:
    """Convert a single PDF in isolated subprocess."""
    name = pdf_info["name"]
    agent = pdf_info["agent"]
    pdf_path = pdf_info["pdf_path"]
    md_path = pdf_info["md_path"]

    if pdf_info["converted"] and not force:
        log(f"  SKIP {agent}/{name} (already converted)")
        return {"agent": agent, "name": name, "status": "skipped"}

    log(f"  CONVERTING {agent}/{name} ({pdf_info['size_mb']}MB)")

    code = f'''
import sys
import json
import time
from pathlib import Path

pdf_path = Path("{pdf_path}")
md_path = Path("{md_path}")

try:
    start = time.time()

    from docling.document_converter import DocumentConverter
    from docling.datamodel.pipeline_options import PdfPipelineOptions
    from docling.datamodel.base_models import InputFormat
    from docling.document_converter import PdfFormatOption

    pipeline_options = PdfPipelineOptions()
    pipeline_options.do_ocr = False

    converter = DocumentConverter(
        format_options={{
            InputFormat.PDF: PdfFormatOption(
                pipeline_options=pipeline_options
            )
        }}
    )

    result = converter.convert(str(pdf_path))
    md_content = result.document.export_to_markdown()
    md_path.write_text(md_content, encoding="utf-8")

    elapsed = time.time() - start
    pages = len(result.document.pages) if hasattr(result.document, 'pages') else 0

    print(json.dumps({{
        "status": "ok",
        "md_path": str(md_path),
        "md_size": md_path.stat().st_size,
        "pages": pages,
        "elapsed_seconds": round(elapsed, 1)
    }}))

except Exception as e:
    print(json.dumps({{
        "status": "error",
        "error": str(e),
        "type": type(e).__name__
    }}))
    sys.exit(1)
'''

    timeout = get_timeout(pdf_path)
    python_bin = str(VENV_PYTHON) if VENV_PYTHON.exists() else sys.executable

    try:
        result = subprocess.run(
            [python_bin, "-c", code],
            capture_output=True,
            text=True,
            timeout=timeout,
        )

        if result.returncode == 0:
            try:
                data = json.loads(result.stdout.strip().split("\n")[-1])
                elapsed = data.get("elapsed_seconds", "?")
                pages = data.get("pages", "?")
                md_kb = round(data.get("md_size", 0) / 1024, 1)
                log(f"  OK {agent}/{name} — {pages} pages, {md_kb}KB md, {elapsed}s")
                return {"agent": agent, "name": name, "status": "ok", **data}
            except json.JSONDecodeError:
                log(f"  WARN {agent}/{name} — unparseable output: {result.stdout[-200:]}")
                return {"agent": agent, "name": name, "status": "error", "error": "JSON parse failed"}
        else:
            error_msg = result.stderr[-500:] if result.stderr else result.stdout[-500:]
            log(f"  ERROR {agent}/{name} — {error_msg[:200]}")
            return {"agent": agent, "name": name, "status": "error", "error": error_msg}

    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT {agent}/{name} (>{timeout}s)")
        return {"agent": agent, "name": name, "status": "timeout"}


# ============================================================
# Main
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="CopywriterOS — PDF to Markdown (Docling)")
    parser.add_argument("--all", action="store_true", help="Convert all PDFs")
    parser.add_argument("--agent", type=str, help="Convert PDFs for specific agent")
    parser.add_argument("--list", action="store_true", help="List available PDFs")
    parser.add_argument("--force", action="store_true", help="Reconvert even if .md exists")
    args = parser.parse_args()

    pdfs = find_pdfs(agent=args.agent)

    if args.list or (not args.all and not args.agent):
        print(f"\n{'Agent':<22} {'PDF':<40} {'Size':<8} {'Converted'}")
        print("-" * 80)
        for p in pdfs:
            status = "YES" if p["converted"] else "NO"
            print(f"{p['agent']:<22} {p['name']:<40} {p['size_mb']:<8} {status}")
        print(f"\nTotal: {len(pdfs)} PDFs")
        pending = sum(1 for p in pdfs if not p["converted"])
        if pending:
            print(f"Pending: {pending}")
        return

    log(f"Starting conversion of {len(pdfs)} PDF(s)")
    log(f"Python: {VENV_PYTHON if VENV_PYTHON.exists() else sys.executable}")

    results = []
    total_start = time.time()

    for i, pdf in enumerate(pdfs, 1):
        log(f"[{i}/{len(pdfs)}] {pdf['agent']}/{pdf['name']}")
        result = convert_pdf(pdf, force=args.force)
        results.append(result)

    total_elapsed = round(time.time() - total_start, 1)

    ok = sum(1 for r in results if r["status"] == "ok")
    skipped = sum(1 for r in results if r["status"] == "skipped")
    errors = sum(1 for r in results if r["status"] in ("error", "timeout"))

    log(f"\nSummary: {ok} ok, {skipped} skipped, {errors} errors — {total_elapsed}s total")

    if errors:
        log("Failed PDFs:")
        for r in results:
            if r["status"] in ("error", "timeout"):
                log(f"  - {r['agent']}/{r['name']}: {r.get('error', 'timeout')[:100]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
