#!/bin/bash
# Monitor Ralph Swarm Progress

PRD_FILE="$(dirname "$0")/prd.json"
PROGRESS_FILE="$(dirname "$0")/progress.txt"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Ralph Swarm Monitor - Copy v2 Upgrade                 ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get counts
TOTAL=$(jq '[.userStories[]] | length' "$PRD_FILE")
PASSED=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE")
PENDING=$((TOTAL - PASSED))
PERCENT=$((PASSED * 100 / TOTAL))

# Progress bar
BAR_WIDTH=40
FILLED=$((PERCENT * BAR_WIDTH / 100))
EMPTY=$((BAR_WIDTH - FILLED))
BAR=$(printf "%${FILLED}s" | tr ' ' '█')$(printf "%${EMPTY}s" | tr ' ' '░')

echo -e "${YELLOW}Progress:${NC} [$BAR] $PERCENT%"
echo ""
echo -e "  ${GREEN}✓ Passed:${NC}  $PASSED"
echo -e "  ${YELLOW}⏳ Pending:${NC} $PENDING"
echo -e "  ${CYAN}Total:${NC}    $TOTAL"
echo ""

# Recently completed
echo -e "${GREEN}═══ Recently Completed ═══${NC}"
jq -r '.userStories[] | select(.passes == true) | "  ✓ \(.id): \(.title)"' "$PRD_FILE" | tail -5
echo ""

# Currently pending (first 10)
echo -e "${YELLOW}═══ Next in Queue ═══${NC}"
jq -r '.userStories[] | select(.passes == false) | "  ⏳ \(.id): \(.title)"' "$PRD_FILE" | head -10
echo ""

# Check if session log has updates
SESSION_LOG_LINES=$(grep -c "^### " "$PROGRESS_FILE" 2>/dev/null || echo "0")
echo -e "${CYAN}Session Log Entries:${NC} $SESSION_LOG_LINES"
echo ""

# File changes check
echo -e "${CYAN}═══ Recent File Changes ═══${NC}"
find "$(dirname "$0")/../" -name "*.md" -mmin -5 -type f 2>/dev/null | head -5 | while read f; do
    echo "  📝 $(basename "$f") ($(stat -f%Sm -t"%H:%M" "$f"))"
done
echo ""

echo -e "${CYAN}Last check:${NC} $(date '+%H:%M:%S')"
echo -e "${CYAN}Refresh:${NC} ./monitor.sh | watch -n 10 ./monitor.sh"
