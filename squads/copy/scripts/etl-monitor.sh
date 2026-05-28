#!/usr/bin/env bash
# =============================================================================
# ETL-MONITOR v2 — Minimal dashboard for RALPH-7D extractions
# =============================================================================
# Usage:
#   ./etl-monitor.sh                    # Snapshot
#   ./etl-monitor.sh --watch            # Live (5s refresh)
#   ./etl-monitor.sh --watch -i 3       # Live (3s refresh)
#   ./etl-monitor.sh -a andre-chaperon  # Single agent
#   ./etl-monitor.sh --logs             # Include log tail
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MINDS_DIR="$SQUAD_DIR/data/minds"
QUEUE_FILE="$SQUAD_DIR/data/etl-queue.yaml"
GOLDEN_REF="$MINDS_DIR/alex-hormozi"

WATCH=false
INTERVAL=5
AGENT_FILTER=""
SHOW_LOGS=false
LOG_LINES=6

while [[ $# -gt 0 ]]; do
    case $1 in
        --watch|-w) WATCH=true; shift ;;
        --interval|-i) INTERVAL="$2"; shift 2 ;;
        --agent|-a) AGENT_FILTER="$2"; shift 2 ;;
        --logs|-l) SHOW_LOGS=true; shift ;;
        --help|-h) echo "Usage: ./etl-monitor.sh [--watch] [--interval N] [--agent SLUG] [--logs]"; exit 0 ;;
        *) echo "Unknown: $1"; exit 1 ;;
    esac
done

render_dashboard() {
    local log_flag=""
    $SHOW_LOGS && log_flag="--logs --log-lines $LOG_LINES"

    python3 "$SCRIPT_DIR/etl-monitor-render.py" \
        --minds-dir "$MINDS_DIR" \
        --queue-file "$QUEUE_FILE" \
        --golden-ref "$GOLDEN_REF" \
        ${AGENT_FILTER:+--agent "$AGENT_FILTER"} \
        $log_flag
}

if $WATCH; then
    while true; do
        clear
        render_dashboard
        sleep "$INTERVAL"
    done
else
    render_dashboard
fi
