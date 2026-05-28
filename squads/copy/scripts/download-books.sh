#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CopywriterOS — Batch Book Downloader via Z-Library API
# ═══════════════════════════════════════════════════════════════════════════
# Usage: ./squads/copywriter-os/scripts/download-books.sh [--tier 0|1|2|3|all]
# Requires: ZLIB_EMAIL and ZLIB_PASSWORD in .env
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SQUAD_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(cd "$SQUAD_DIR/../.." && pwd)"
DOWNLOADER="$PROJECT_ROOT/docs/clone-factory-sources/04-cognitive-clone-system/squads/etl/scripts/python/zlibrary_downloader.py"
BOOKS_DIR="$SQUAD_DIR/data/books"
DELAY=3
TIER_FILTER="${1:---tier}"
TIER_VALUE="${2:-all}"

# Load .env
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -E '^ZLIB_(EMAIL|PASSWORD)=' "$PROJECT_ROOT/.env" | xargs)
fi

if [ -z "${ZLIB_EMAIL:-}" ] || [ -z "${ZLIB_PASSWORD:-}" ]; then
    echo "ERROR: ZLIB_EMAIL e ZLIB_PASSWORD nao configurados no .env"
    echo "Edite: $PROJECT_ROOT/.env"
    exit 1
fi

# Check python + requests
if ! python3 -c "import requests" 2>/dev/null; then
    echo "Installing requests..."
    pip3 install requests --quiet
fi

echo "═══════════════════════════════════════════════════════════"
echo "  CopywriterOS — Book Downloader"
echo "  Target: $BOOKS_DIR"
echo "  Delay: ${DELAY}s between downloads"
echo "  Tier: $TIER_VALUE"
echo "═══════════════════════════════════════════════════════════"
echo ""

download_book() {
    local agent="$1"
    local query="$2"
    local tier="$3"
    local output_dir="$BOOKS_DIR/$agent"

    # Skip if already downloaded
    if [ -d "$output_dir" ] && ls "$output_dir"/*.pdf "$output_dir"/*.epub 2>/dev/null | head -1 > /dev/null 2>&1; then
        echo "  SKIP: $agent — ja baixado"
        return 0
    fi

    echo "  [$tier] $agent: \"$query\""
    mkdir -p "$output_dir"

    local result
    result=$(python3 "$DOWNLOADER" download \
        --query "$query" \
        --output "$output_dir" \
        --max-results 1 \
        --delay 0 \
        --timeout 60 \
        --source-id "$agent" \
        --log-level WARNING 2>&1) || true

    if echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
        local file
        file=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['downloaded_files'][0] if d['downloaded_files'] else 'none')" 2>/dev/null)
        echo "    OK: $(basename "$file")"
    else
        local msg
        msg=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message','unknown error'))" 2>/dev/null || echo "parse error")
        echo "    FAIL: $msg"
    fi

    sleep "$DELAY"
}

TOTAL=0
SUCCESS=0
FAIL=0

# ═══════════════════════════════════════════════════════════════════════════
# TIER 0 — DIAGNOSTIC (3 agents, 5 books)
# ═══════════════════════════════════════════════════════════════════════════
if [ "$TIER_VALUE" = "all" ] || [ "$TIER_VALUE" = "0" ]; then
    echo "--- TIER 0: Diagnostic ---"
    download_book "claude-hopkins"   "Scientific Advertising Claude Hopkins"         "T0"
    download_book "claude-hopkins"   "My Life in Advertising Claude Hopkins"         "T0"
    download_book "eugene-schwartz"  "Breakthrough Advertising Eugene Schwartz"      "T0"
    download_book "eugene-schwartz"  "The Brilliance Breakthrough Eugene Schwartz"   "T0"
    download_book "robert-collier"   "The Robert Collier Letter Book"                "T0"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════════════════
# TIER 1 — MASTERS (8 agents, 8 books)
# ═══════════════════════════════════════════════════════════════════════════
if [ "$TIER_VALUE" = "all" ] || [ "$TIER_VALUE" = "1" ]; then
    echo "--- TIER 1: Masters ---"
    download_book "gary-halbert"          "The Boron Letters Gary Halbert"                              "T1"
    download_book "david-ogilvy"          "Ogilvy on Advertising David Ogilvy"                          "T1"
    download_book "david-ogilvy"          "Confessions of an Advertising Man David Ogilvy"              "T1"
    download_book "john-carlton"          "Kick-Ass Copywriting Secrets Marketing Rebel John Carlton"   "T1"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════════════════
# TIER 2 — SYSTEMATIZERS (6 agents, 7 books)
# ═══════════════════════════════════════════════════════════════════════════
if [ "$TIER_VALUE" = "all" ] || [ "$TIER_VALUE" = "2" ]; then
    echo "--- TIER 2: Systematizers ---"
    download_book "dan-kennedy"      "The Ultimate Sales Letter Dan Kennedy"          "T2"
    download_book "dan-kennedy"      "No BS Direct Marketing Dan Kennedy"             "T2"
    download_book "dan-kennedy"      "Magnetic Marketing Dan Kennedy"                 "T2"
    download_book "jeff-walker"      "Launch Jeff Walker Product Launch Formula"       "T2"
    download_book "russell-brunson"  "DotCom Secrets Russell Brunson"                 "T2"
    download_book "russell-brunson"  "Expert Secrets Russell Brunson"                 "T2"
    download_book "russell-brunson"  "Traffic Secrets Russell Brunson"                "T2"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════════════════
# TIER 3 — SPECIALISTS (5 agents, 2 books)
# ═══════════════════════════════════════════════════════════════════════════
if [ "$TIER_VALUE" = "all" ] || [ "$TIER_VALUE" = "3" ]; then
    echo "--- TIER 3: Specialists ---"
    download_book "ben-settle"  "Persuasion Secrets Charismatic Influential Villains Ben Settle"  "T3"
    download_book "dan-koe"     "The Art of Focus Dan Koe"                                        "T3"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════════════════
# TOOL — JOE SUGARMAN (3 books)
# ═══════════════════════════════════════════════════════════════════════════
if [ "$TIER_VALUE" = "all" ] || [ "$TIER_VALUE" = "tool" ]; then
    echo "--- TOOL: Sugarman ---"
    download_book "joe-sugarman"  "Triggers Joe Sugarman psychological"                       "Tool"
    download_book "joe-sugarman"  "The Adweek Copywriting Handbook Joe Sugarman"              "Tool"
    download_book "joe-sugarman"  "Advertising Secrets of the Written Word Joe Sugarman"      "Tool"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo "  Download completo!"
echo "  Livros salvos em: $BOOKS_DIR/"
echo "  Proximo passo: rodar ETL de extracao de frameworks"
echo "═══════════════════════════════════════════════════════════"
