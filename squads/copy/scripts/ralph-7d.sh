#!/usr/bin/env bash
# =============================================================================
# RALPH-7D v1.0 — CopywriterOS 7D Mind Extraction Pipeline
# =============================================================================
# Adapted from RALPH-ETL v2.0 (squads/branding/scripts/ralph-etl-v2.sh)
# Purpose: Extract deep knowledge (7 dimensions) from books already acquired,
#          then synthesize into voice_dna.yaml + thinking_dna.yaml per agent.
#
# Pipeline (4 active phases, 3 skipped):
#
#   Phase 0: INIT         (bash)  — Read queue, create state, validate sources
#   Phase 1: SKIP         —       — Sources already acquired
#   Phase 2: SKIP         —       — Books already downloaded
#   Phase 3: SKIP         —       — Books already in text
#   Phase 4: EXTRACT      (haiku) — Clean PDFs, extract pure text
#   Phase 5: SKIP         —       — No social media needed
#   Phase 6: 7D-EXTRACT   (opus)  — 7D prompt with tier modifiers
#   Phase 7: DNA-SYNTH    (opus)  — Synthesize voice_dna + thinking_dna
#
# Model strategy:
#   Haiku  = mechanical (PDF cleanup, text extraction)
#   Opus   = synthesis (7D extraction, DNA generation, curadoria)
#
# Usage:
#   ./ralph-7d.sh --mind andre-chaperon                    # Full pipeline
#   ./ralph-7d.sh --mind andre-chaperon --phase 6          # Start from phase 6
#   ./ralph-7d.sh --mind andre-chaperon --resume           # Resume from state
#   ./ralph-7d.sh --mind andre-chaperon --dry-run          # Preview only
#   ./ralph-7d.sh --batch pilot                            # Run pilot batch (3 agents)
#   ./ralph-7d.sh --batch all                              # Run all agents
#
# Prerequisites:
#   - claude CLI (Max plan OAuth)
#   - python3, jq
#   - Books already in data/books/{slug}/ (PDFs or markdown)
#
# Methodology: docs/frameworks/extraction-methodology-7d.md
# Plan: squads/copywriter-os/docs/etl-7d-extraction-plan.md v1.2
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================
MAX_ITERATIONS=20
MAX_DURATION_SECONDS=7200  # 2 hours per agent
DRY_RUN=false
RESUME=false
MIND=""
BATCH=""
START_PHASE=""
CONSECUTIVE_FAILS=0
MAX_CONSECUTIVE_FAILS=2  # Early-exit: 2 consecutive failures → STOP batch

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQUAD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$SQUAD_DIR/../.." && pwd)"

# Load .env if exists (disable pipefail temporarily — .env may have unset vars)
if [[ -f "$PROJECT_ROOT/.env" ]]; then
    set +u
    set -a
    # shellcheck disable=SC1091
    source "$PROJECT_ROOT/.env" 2>/dev/null || true
    set +a
    set -u
fi

# 7D extraction prompt
PROMPT_7D="$PROJECT_ROOT/docs/frameworks/Extração de Frameworks e Checklist.md"
METHODOLOGY="$PROJECT_ROOT/docs/frameworks/extraction-methodology-7d.md"

# Squad paths
BOOKS_DIR="$SQUAD_DIR/data/books"
MINDS_DIR="$SQUAD_DIR/data/minds"
AGENTS_DIR="$SQUAD_DIR/agents"
QUEUE_FILE="$SQUAD_DIR/data/etl-queue.yaml"
TIER_DEFS="$SQUAD_DIR/data/tier-definitions.yaml"

# Per-mind paths (set after --mind parsed)
MIND_BOOKS=""
MIND_OUTPUT=""
STATE_FILE=""
PROGRESS_FILE=""
LOG_FILE=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# Circuit breaker
CB_NO_PROGRESS_COUNT=0
CB_NO_PROGRESS_THRESHOLD=3
PIPELINE_START_TIME=0
TOTAL_ITERATIONS_RUN=0

# =============================================================================
# TIER → PROMPT MODIFIER MAPPING (bash 3.2 compatible — no associative arrays)
# =============================================================================
get_tier_modifier() {
    case "$1" in
        T0) echo "Priorize frameworks de DIAGNOSTICO e DECISAO. Como esse expert AVALIA antes de agir? Ampliar: D1 (frameworks), D5 (numeros), D3 (contra-intuitivos). Reduzir: D7, D4." ;;
        T1) echo "Priorize frameworks COMPLETOS com cases de resultado. Como esse expert EXECUTA copy de alto impacto? Ampliar: D1, D4, D5. Reduzir: D6." ;;
        T2) echo "Priorize SISTEMAS replicaveis e formulas. Como esse expert SISTEMATIZA o processo? Ampliar: D1, D6, D5. Reduzir: D4, D7." ;;
        T3) echo "Priorize VOZ e ESTILO especifico do formato. Como esse expert SONA diferente dos outros? Ampliar: D7, D1, D6. Reduzir: D4, D5." ;;
        T4) echo "Priorize CHECKLISTS e TRIGGERS aplicaveis. O que o executor verifica mecanicamente? Ampliar: D6, D5. Reduzir: D4, D7, D3." ;;
        *)  echo "Priorize SISTEMAS replicaveis e formulas. Como esse expert SISTEMATIZA o processo? Ampliar: D1, D6, D5. Reduzir: D4, D7." ;;
    esac
}

# Token budgets per tier
get_tier_token_budget() {
    case "$1" in
        T0) echo 5000 ;;
        T1) echo 5000 ;;
        T2) echo 3000 ;;
        T3) echo 2500 ;;
        T4) echo 1500 ;;
        *)  echo 3000 ;;
    esac
}

get_tier_max_lines() {
    case "$1" in
        T0) echo 800 ;;
        T1) echo 800 ;;
        T2) echo 500 ;;
        T3) echo 400 ;;
        T4) echo 250 ;;
        *)  echo 500 ;;
    esac
}

# =============================================================================
# ARGUMENT PARSING
# =============================================================================
while [[ $# -gt 0 ]]; do
    case $1 in
        --mind)             MIND="$2"; shift 2 ;;
        --batch)            BATCH="$2"; shift 2 ;;
        --phase)            START_PHASE="$2"; shift 2 ;;
        --max-iterations)   MAX_ITERATIONS="$2"; shift 2 ;;
        --max-duration)
            dur="$2"
            if [[ "$dur" =~ ^([0-9]+)h$ ]]; then
                MAX_DURATION_SECONDS=$(( ${BASH_REMATCH[1]} * 3600 ))
            elif [[ "$dur" =~ ^([0-9]+)m$ ]]; then
                MAX_DURATION_SECONDS=$(( ${BASH_REMATCH[1]} * 60 ))
            else
                MAX_DURATION_SECONDS="$dur"
            fi
            shift 2 ;;
        --resume)           RESUME=true; shift ;;
        --dry-run)          DRY_RUN=true; shift ;;
        -h|--help)
            echo "Usage: ./ralph-7d.sh --mind <agent-slug> [options]"
            echo "       ./ralph-7d.sh --batch <pilot|t0|t1|t2|t3|all> [options]"
            echo ""
            echo "Options:"
            echo "  --mind <slug>           Agent to extract (REQUIRED unless --batch)"
            echo "  --batch <pilot|t0|t1|t2|t3|all>  Run batch by tier"
            echo "  --phase <0|4|6|7>       Start from specific phase"
            echo "  --max-iterations <N>    Max Claude iterations (default: 20)"
            echo "  --max-duration <Xh|Xm>  Max total duration per agent (default: 2h)"
            echo "  --resume                Resume from saved state"
            echo "  --dry-run               Preview without executing"
            echo ""
            echo "Available agents (books in data/books/):"
            ls -1 "$BOOKS_DIR" 2>/dev/null | grep -v '^\.' | grep -v 'download'
            exit 0 ;;
        *) echo "Unknown flag: $1. Use --help."; exit 1 ;;
    esac
done

# =============================================================================
# LOGGING
# =============================================================================
ensure_log_dir() {
    if [[ -n "$LOG_FILE" ]]; then
        mkdir -p "$(dirname "$LOG_FILE")"
    fi
}
log()         { ensure_log_dir; echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "${LOG_FILE:-/dev/null}"; }
log_success() { ensure_log_dir; echo -e "${GREEN}[$(date '+%H:%M:%S')] ✓ $1${NC}" | tee -a "${LOG_FILE:-/dev/null}"; }
log_warn()    { ensure_log_dir; echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠ $1${NC}" | tee -a "${LOG_FILE:-/dev/null}"; }
log_error()   { ensure_log_dir; echo -e "${RED}[$(date '+%H:%M:%S')] ✗ $1${NC}" | tee -a "${LOG_FILE:-/dev/null}"; }
log_phase()   { ensure_log_dir; echo -e "\n${MAGENTA}${BOLD}━━━ $1 ━━━${NC}\n" | tee -a "${LOG_FILE:-/dev/null}"; }

# =============================================================================
# TIME UTILS
# =============================================================================
format_duration() {
    local seconds=$1
    local h=$((seconds / 3600))
    local m=$(( (seconds % 3600) / 60 ))
    local s=$((seconds % 60))
    if [[ $h -gt 0 ]]; then printf "%dh%02dm%02ds" $h $m $s
    elif [[ $m -gt 0 ]]; then printf "%dm%02ds" $m $s
    else printf "%ds" $s; fi
}
elapsed_time() { echo $(( $(date +%s) - PIPELINE_START_TIME )); }
time_remaining() {
    local r=$(( MAX_DURATION_SECONDS - $(elapsed_time) ))
    echo $(( r < 0 ? 0 : r ))
}
check_time() {
    [[ $(time_remaining) -le 0 ]] && { log_warn "Max duration reached"; return 1; }
    return 0
}

# =============================================================================
# STATE MANAGEMENT
# =============================================================================
update_phase_status() {
    local phase="$1"
    local status="$2"
    python3 -c "
import json
state = json.load(open('$STATE_FILE'))
state['phases']['$phase']['status'] = '$status'
with open('$STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)
" 2>/dev/null
}

# =============================================================================
# SETUP PER-MIND PATHS
# =============================================================================
setup_mind_paths() {
    local slug="$1"
    MIND="$slug"
    MIND_BOOKS="$BOOKS_DIR/$slug"
    MIND_OUTPUT="$MINDS_DIR/$slug"
    STATE_FILE="$MIND_OUTPUT/state/etl-7d-state.json"
    PROGRESS_FILE="$MIND_OUTPUT/state/progress.txt"
    LOG_FILE="$MIND_OUTPUT/state/ralph-7d.log"
}

# =============================================================================
# RESOLVE AGENT TIER
# =============================================================================
get_agent_tier() {
    local slug="$1"
    # Try to find tier from tier-definitions.yaml or agent file
    local tier=""

    # Method 1: grep tier-definitions.yaml
    if [[ -f "$TIER_DEFS" ]]; then
        tier=$(python3 -c "
import re
with open('$TIER_DEFS') as f:
    content = f.read()
# Look for slug in tier blocks
for match in re.finditer(r'(T\d)[^:]*:.*?agents:.*?$slug', content, re.DOTALL | re.MULTILINE):
    print(match.group(1))
    break
" 2>/dev/null || echo "")
    fi

    # Method 2: grep agent file for tier
    if [[ -z "$tier" ]]; then
        local agent_file="$AGENTS_DIR/${slug}.md"
        if [[ -f "$agent_file" ]]; then
            tier=$(grep -m1 'tier:' "$agent_file" 2>/dev/null | grep -oE 'T[0-4]' || echo "")
            # Also try numeric tier
            if [[ -z "$tier" ]]; then
                local tier_num
                tier_num=$(grep -m1 'tier:' "$agent_file" 2>/dev/null | grep -oE '[0-4]' | head -1 || echo "")
                if [[ -n "$tier_num" ]]; then
                    tier="T${tier_num}"
                fi
            fi
        fi
    fi

    # Default
    if [[ -z "$tier" ]]; then
        tier="T2"  # Default to T2 (Systematizer)
        log_warn "Could not determine tier for $slug — defaulting to T2"
    fi

    echo "$tier"
}

# =============================================================================
# PHASE 0: INIT + SOURCE VALIDATION
# =============================================================================
phase_0_init() {
    log_phase "PHASE 0: INIT — Validate sources, create state"

    # Create directories
    mkdir -p "$MIND_OUTPUT/state" "$MIND_OUTPUT/source-text"

    # Safety: backup existing state
    if [[ -f "$STATE_FILE" ]]; then
        cp "$STATE_FILE" "${STATE_FILE}.bak"
        log "State backup saved"
    fi

    # Skip re-init if resuming from specific phase
    if [[ -n "$START_PHASE" ]] && [[ -f "$STATE_FILE" ]]; then
        log "Skipping state re-init (--phase $START_PHASE, state exists)"
        return
    fi

    # Resolve tier
    local tier
    tier=$(get_agent_tier "$MIND")
    local modifier
    modifier=$(get_tier_modifier "$tier")
    local token_budget
    token_budget=$(get_tier_token_budget "$tier")
    local max_lines
    max_lines=$(get_tier_max_lines "$tier")

    # Validate sources exist
    local source_count=0
    local source_files=""
    local source_score=0

    if [[ -d "$MIND_BOOKS" ]]; then
        source_files=$(find "$MIND_BOOKS" -type f \( -name "*.pdf" -o -name "*.md" -o -name "*.txt" -o -name "*.yaml" \) 2>/dev/null | grep -v frameworks_inventory || true)
        source_count=$(echo "$source_files" | grep -c . 2>/dev/null || echo "0")
    fi

    # Check frameworks_inventory
    local has_frameworks=false
    local frameworks_path="$MIND_BOOKS/frameworks_inventory.yaml"
    if [[ -f "$frameworks_path" ]]; then
        has_frameworks=true
        source_score=$((source_score + 1))
    fi

    # Check agent file
    local has_agent=false
    local agent_file="$AGENTS_DIR/${MIND}.md"
    if [[ -f "$agent_file" ]]; then
        has_agent=true
        source_score=$((source_score + 1))
    fi

    # Source content check
    if [[ $source_count -gt 0 ]]; then
        source_score=$((source_score + 1))
    fi

    # Total word count of sources
    local total_words=0
    if [[ -n "$source_files" ]] && [[ "$source_files" != "" ]]; then
        total_words=$(echo "$source_files" | xargs wc -w 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
        if [[ $total_words -gt 5000 ]]; then
            source_score=$((source_score + 1))
        fi
    fi

    # VETO: source score < 3/4
    if [[ $source_score -lt 3 ]]; then
        log_error "VETO: Source score $source_score/4 < 3 minimum"
        log_error "  Sources: $source_count files"
        log_error "  Frameworks inventory: $has_frameworks"
        log_error "  Agent file: $has_agent"
        log_error "  Word count: $total_words"
        echo -e "${RED}SOURCE VALIDATION FAILED — Cannot proceed${NC}"
        return 1
    fi

    # Create state
    python3 << PYEOF
import json
from datetime import datetime

state = {
    "pipeline_id": "7d-$MIND",
    "mind": "$MIND",
    "tier": "$tier",
    "token_budget": $token_budget,
    "max_lines": $max_lines,
    "created_at": datetime.now().isoformat(),
    "source_validation": {
        "score": $source_score,
        "source_count": $source_count,
        "has_frameworks_inventory": $([[ "$has_frameworks" == true ]] && echo "True" || echo "False"),
        "has_agent_file": $([[ "$has_agent" == true ]] && echo "True" || echo "False"),
        "total_words": $total_words
    },
    "phases": {
        "0": {"name": "Init + Validate", "status": "complete"},
        "4": {"name": "Text Extraction (Haiku)", "status": "pending"},
        "6": {"name": "7D Extraction (Opus)", "status": "pending"},
        "7": {"name": "DNA Synthesis (Opus)", "status": "pending"}
    },
    "outputs": {
        "source_text": "",
        "7d_raw": "",
        "voice_dna": "",
        "thinking_dna": "",
        "quality_gate": "",
        "cases": ""
    },
    "evidence_score": 0.0,
    "curadoria_score": 0.0
}

with open("$STATE_FILE", "w") as f:
    json.dump(state, f, indent=2)

print(f"State created: {$source_count} sources, tier=$tier, budget={$token_budget} tokens")
PYEOF

    # Create progress file
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        cat > "$PROGRESS_FILE" << PROGRESS_EOF
# Ralph-7D Progress — $MIND (Tier: $tier)
Started: $(date '+%Y-%m-%d %H:%M:%S')
Token budget: $token_budget | Max lines: $max_lines

---

## Patterns Discovered

> Claude reads this FIRST each iteration. Add learnings here.

- (will be populated as pipeline runs)

---

## Phase Log

---
PROGRESS_EOF
    fi

    log_success "Phase 0 complete — sources validated ($source_score/4), tier=$tier"
}

# =============================================================================
# PHASE 4: TEXT EXTRACTION (Haiku — Machine Speed)
# =============================================================================
phase_4_extract() {
    log_phase "PHASE 4: EXTRACT — Clean text from PDFs and books"

    update_phase_status "4" "in_progress"

    local output_dir="$MIND_OUTPUT/source-text"
    mkdir -p "$output_dir"

    # Check if source text already exists
    local existing_text
    existing_text=$(find "$output_dir" -name "*.md" -o -name "*.txt" 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$existing_text" -gt 0 ]]; then
        local existing_words
        existing_words=$(find "$output_dir" -name "*.md" -o -name "*.txt" -exec wc -w {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
        if [[ "$existing_words" -gt 5000 ]]; then
            log "Source text already extracted ($existing_text files, ~${existing_words} words) — skipping"
            update_phase_status "4" "complete"
            return
        fi
    fi

    # Find all source files
    local book_files
    book_files=$(find "$MIND_BOOKS" -type f \( -name "*.pdf" -o -name "*.md" -o -name "*.txt" \) 2>/dev/null | grep -v frameworks_inventory | grep -v download || true)

    if [[ -z "$book_files" ]]; then
        log_warn "No book files found in $MIND_BOOKS"
        update_phase_status "4" "complete"
        return
    fi

    # For markdown/text files: just copy
    while IFS= read -r file; do
        local basename
        basename=$(basename "$file")
        local ext="${basename##*.}"

        if [[ "$ext" == "md" || "$ext" == "txt" ]]; then
            cp "$file" "$output_dir/$basename"
            log_success "Copied: $basename"
        elif [[ "$ext" == "pdf" ]]; then
            # Check if file is actually an EPUB disguised as PDF
            local file_type
            file_type=$(file -b "$file" 2>/dev/null || echo "unknown")
            if [[ "$file_type" == *"EPUB"* ]]; then
                local epub_out="$output_dir/${basename%.pdf}.md"
                if [[ -f "$epub_out" ]] && [[ -s "$epub_out" ]]; then
                    log "Already extracted (EPUB): $basename"
                    continue
                fi
                log "Detected EPUB disguised as PDF: $basename — extracting via Python zipfile..."
                python3 -c "
import zipfile, html.parser, sys
class H(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.t=[]; self.s=False
    def handle_starttag(self,tag,a):
        if tag in ('script','style'): self.s=True
        if tag in ('p','div','br','h1','h2','h3','h4','h5','h6','li'): self.t.append('\n')
        if tag in ('h1','h2','h3'): self.t.append('# ' if tag=='h1' else '## ' if tag=='h2' else '### ')
    def handle_endtag(self,tag):
        if tag in ('script','style'): self.s=False
        if tag=='p': self.t.append('\n')
    def handle_data(self,d):
        if not self.s: self.t.append(d)
with zipfile.ZipFile(sys.argv[1]) as z:
    files=sorted(f for f in z.namelist() if f.endswith(('.xhtml','.html','.htm')))
    parts=[]
    for f in files:
        p=H(); p.feed(z.read(f).decode('utf-8',errors='ignore')); t=''.join(p.t).strip()
        if len(t)>50: parts.append(t)
    with open(sys.argv[2],'w') as o: o.write('\n\n'.join(parts))
" "$file" "$epub_out" 2>>"$LOG_FILE" && \
                    log_success "Extracted EPUB: $basename ($(wc -w < "$epub_out") words)" || \
                    log_error "Failed to extract EPUB: $basename"
                continue
            fi

            # Standard PDF extraction
            local out_file="$output_dir/${basename%.pdf}.md"
            if [[ -f "$out_file" ]] && [[ -s "$out_file" ]]; then
                log "Already extracted: $basename"
                continue
            fi

            log "Extracting PDF: $basename..."

            # Try pdf-to-markdown.py with --agent flag (Docling-based)
            if [[ -f "$SCRIPT_DIR/pdf-to-markdown.py" ]]; then
                python3 "$SCRIPT_DIR/pdf-to-markdown.py" --agent "$MIND" 2>>"$LOG_FILE" && \
                    log_success "Extracted via Docling: $basename" || \
                    log_warn "Docling extraction failed for $basename — trying pdftotext fallback"
            fi

            # Fallback 1: pdftotext (poppler) — fast, reliable, no copyright issues
            if [[ ! -f "$out_file" ]] || [[ ! -s "$out_file" ]]; then
                if command -v pdftotext &>/dev/null; then
                    log "Using pdftotext fallback..."
                    pdftotext -layout "$file" "$out_file" 2>>"$LOG_FILE" && \
                        log_success "Extracted via pdftotext: $basename" || \
                        log_warn "pdftotext failed for $basename"
                fi
            fi

            # Fallback 2: mutool (mupdf) — handles scanned PDFs better
            if [[ ! -f "$out_file" ]] || [[ ! -s "$out_file" ]]; then
                if command -v mutool &>/dev/null; then
                    log "Using mutool fallback..."
                    mutool convert -o "$out_file" "$file" 2>>"$LOG_FILE" && \
                        log_success "Extracted via mutool: $basename" || \
                        log_error "Failed to extract: $basename"
                else
                    log_error "Failed to extract: $basename (no pdftotext or mutool available)"
                fi
            fi
        fi
    done <<< "$book_files"

    # Validate output: minimum 5K words
    local total_words
    total_words=$(find "$output_dir" -type f \( -name "*.md" -o -name "*.txt" \) -exec wc -w {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")

    if [[ "$total_words" -lt 5000 ]]; then
        log_warn "VETO: Extracted text < 5K words ($total_words). Material may be insufficient."
    else
        log_success "Extracted $total_words words total"
    fi

    update_phase_status "4" "complete"
    log_success "Phase 4 complete"
}

# =============================================================================
# PHASE 6: 7D EXTRACTION (Opus)
# =============================================================================
phase_6_7d_extract() {
    log_phase "PHASE 6: 7D EXTRACTION — Deep framework extraction with tier modifier"

    update_phase_status "6" "in_progress"

    local output_file="$MIND_OUTPUT/7d-extraction-raw.md"

    # Skip if already done
    if [[ -f "$output_file" ]] && [[ -s "$output_file" ]]; then
        local existing_words
        existing_words=$(wc -w < "$output_file" | tr -d ' ')
        if [[ "$existing_words" -gt 2000 ]]; then
            log "7D extraction already exists ($existing_words words) — skipping"
            update_phase_status "6" "complete"
            return
        fi
    fi

    # Resolve tier and modifier
    local tier
    tier=$(python3 -c "import json; print(json.load(open('$STATE_FILE')).get('tier','T2'))" 2>/dev/null || echo "T2")
    local modifier
    modifier=$(get_tier_modifier "$tier")

    # Read 7D prompt template
    if [[ ! -f "$PROMPT_7D" ]]; then
        log_error "7D prompt not found: $PROMPT_7D"
        return 1
    fi

    # Build source text list
    local source_text_dir="$MIND_OUTPUT/source-text"
    local source_files
    source_files=$(find "$source_text_dir" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null || true)

    if [[ -z "$source_files" ]]; then
        # Fallback: use books directly
        source_files=$(find "$MIND_BOOKS" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | grep -v frameworks_inventory || true)
    fi

    if [[ -z "$source_files" ]]; then
        log_error "No source text found for $MIND"
        return 1
    fi

    local source_list
    source_list=$(echo "$source_files" | sed "s|$PROJECT_ROOT/||g" | tr '\n' ', ')

    # Build the prompt with tier modifier injected BEFORE the 7D prompt
    local prompt="## PHASE 6: 7D Deep Extraction — $MIND (Tier: $tier)

### TIER MODIFIER (FIX AN-1 — apply BEFORE extraction):
$modifier

### INSTRUCTIONS:
1. Read the 7D extraction prompt:
\`\`\`bash
cat \"$PROMPT_7D\"
\`\`\`

2. Read ALL source texts for this agent:
$(echo "$source_files" | while IFS= read -r f; do echo "\`\`\`bash"; echo "cat \"$(echo "$f" | sed "s|$PROJECT_ROOT/||g")\""; echo "\`\`\`"; done)

3. Apply the 7D extraction prompt to the source texts WITH the tier modifier above.
   - Amplify the dimensions specified in the modifier
   - Reduce (but don't eliminate) the dimensions marked for reduction
   - Every framework/insight MUST have [SOURCE: book, page/chapter] citation

4. EVIDENCE QUALITY RULES (FIX AN-4):
   - Tier 1 (gold): [SOURCE: Book, p.47] — citacao direta com pagina = weight 1.0
   - Tier 2 (silver): [SOURCE: Book, cap.3] — parafrase com capitulo = weight 0.8
   - Tier 3 (bronze): [SOURCE: Book] — conceito sem localizacao = weight 0.6
   - Tier 4 (inferred): [INFERRED: pattern across cap.2-4] = weight 0.3
   - Tier 5 (unmarked): SEM marcacao = weight 0.0 → DESCARTAR

5. Save the complete 7D extraction to:
   squads/copywriter-os/data/minds/$MIND/7d-extraction-raw.md

6. At the end of the file, add a metadata block:
   \`\`\`yaml
   ---
   extraction_metadata:
     agent: \"$MIND\"
     tier: \"$tier\"
     modifier_applied: true
     evidence_counts:
       gold: <count>
       silver: <count>
       bronze: <count>
       inferred: <count>
       unmarked: 0  # must be 0
     evidence_score: <calculated>
     total_frameworks: <count>
     total_words: <count>
   ---
   \`\`\`

When done, output: 7D_EXTRACT_COMPLETE"

    # Run Claude (Opus) — max 3 iterations
    for i in 1 2 3; do
        check_time || break
        TOTAL_ITERATIONS_RUN=$((TOTAL_ITERATIONS_RUN + 1))

        log "7D extraction iteration $i/3 [model=opus, tier=$tier]"

        local exit_code=0
        OUTPUT=$(cd "$PROJECT_ROOT" && echo "$prompt" \
            | claude --model opus --dangerously-skip-permissions -p 2>&1 \
            | tee -a "$LOG_FILE") || exit_code=$?

        # Check completion
        if echo "$OUTPUT" | grep -q "7D_EXTRACT_COMPLETE"; then
            log_success "7D extraction complete"
            break
        fi

        # Rate limit
        if echo "$OUTPUT" | grep -qi "rate_limit\|429\|overloaded\|hit your limit"; then
            log_warn "Rate limited — waiting 120s"
            sleep 120
            continue
        fi

        # Fatal errors
        if echo "$OUTPUT" | grep -qi "Credit balance is too low\|Invalid API key"; then
            log_error "FATAL API error — stopping"
            return 1
        fi

        sleep 10
    done

    # Validate output
    if [[ -f "$output_file" ]] && [[ -s "$output_file" ]]; then
        local word_count
        word_count=$(wc -w < "$output_file" | tr -d ' ')
        if [[ "$word_count" -lt 2000 ]]; then
            log_warn "VETO: 7D output only $word_count words (minimum 2000)"
        else
            log_success "7D extraction: $word_count words"
        fi
    else
        log_error "7D extraction produced no output"
        return 1
    fi

    update_phase_status "6" "complete"
    log_success "Phase 6 complete"
}

# =============================================================================
# PHASE 7: DNA SYNTHESIS (Opus — Merge + Curadoria)
# =============================================================================
phase_7_dna_synthesis() {
    log_phase "PHASE 7: DNA SYNTHESIS — voice_dna.yaml + thinking_dna.yaml"

    update_phase_status "7" "in_progress"

    local voice_file="$MIND_OUTPUT/voice_dna.yaml"
    local thinking_file="$MIND_OUTPUT/thinking_dna.yaml"

    # Skip if both already exist
    if [[ -f "$voice_file" ]] && [[ -s "$voice_file" ]] && \
       [[ -f "$thinking_file" ]] && [[ -s "$thinking_file" ]]; then
        log "DNA files already exist — skipping"
        update_phase_status "7" "complete"
        return
    fi

    # Resolve tier and constraints
    local tier max_lines
    tier=$(python3 -c "import json; print(json.load(open('$STATE_FILE')).get('tier','T2'))" 2>/dev/null || echo "T2")
    max_lines=$(get_tier_max_lines "$tier")

    # Build paths for sequential loading (FIX VETO 3)
    local agent_file="$AGENTS_DIR/${MIND}.md"
    local frameworks_file="$MIND_BOOKS/frameworks_inventory.yaml"
    local raw_7d="$MIND_OUTPUT/7d-extraction-raw.md"

    local agent_rel="squads/copywriter-os/agents/${MIND}.md"
    local frameworks_rel="squads/copywriter-os/data/books/${MIND}/frameworks_inventory.yaml"
    local raw_7d_rel="squads/copywriter-os/data/minds/${MIND}/7d-extraction-raw.md"

    # Build synthesis prompt
    local prompt="## PHASE 7: DNA SYNTHESIS — $MIND (Tier: $tier)

### SEQUENTIAL LOADING (FIX VETO 3 — load in order, not all at once):

**STEP 1:** Read agent file and extract ONLY core_principles, thinking_dna inline, voice_dna inline sections:
\`\`\`bash
cat \"$agent_rel\"
\`\`\`
Save a mental summary (~200 lines max) of the agent's existing knowledge.

**STEP 2:** Read frameworks_inventory and extract ONLY the list of framework names + count:
\`\`\`bash
cat \"$frameworks_rel\"
\`\`\`
Save as \"existing_frameworks\" reference (~50 lines max).

**STEP 3:** Read the full 7D extraction:
\`\`\`bash
cat \"$raw_7d_rel\"
\`\`\`

### CURADORIA FILTER (FIX AN-2 — Pareto ao Cubo):
For EACH framework/heuristic in the 7D raw, apply 3 tests:

TEST 1 — Singularidade: \"Outro expert de copywriting diria isso com essas EXATAS palavras?\"
  SIM = generico → candidato a DESCARTE
  NAO = proprietario → MANTER

TEST 2 — Operacionalidade: \"Um copywriter consegue APLICAR isso em 5 minutos?\"
  SIM = pratico → MANTER
  NAO = teorico → CONDENSAR ou DESCARTAR

TEST 3 — Fonte verificavel: \"Tem [SOURCE:]?\"
  SIM = rastreavel → MANTER
  NAO = MARCAR [INFERRED] ou DESCARTAR

Results: 3/3=genialidade(first), 2/3=excelencia(include), 1/3=impacto(if space), 0/3=merda(discard)

### MERGE PROTOCOL (FIX AN-3 — Step 0 + Steps 1-4):

**Step 0 — Autenticidade:** Is this framework PROPRIETARY to this expert?
  Proprietary signals: expert created the NAME, is primary reference, has specific terminology
  Generic signals: any expert says similar, no proper name, industry best practice
  → GENERIC = DISCARD immediately

Steps 1-4: match exact name → enrich; similar concept → FLAG; new+sourced → add; generic → discard.

### OUTPUT:

1. Create \`squads/copywriter-os/data/minds/$MIND/voice_dna.yaml\`:
   - Use the golden standard (alex-hormozi) as structural reference
   - identity_statement, vocabulary, tokens, templates, tone, validation
   - Max 250 lines for voice_dna
   - Include [SOURCE:] for signature phrases

2. Create \`squads/copywriter-os/data/minds/$MIND/thinking_dna.yaml\`:
   - mental_operating_system, primary_framework, secondary_frameworks, heuristics, veto_conditions
   - Max 300 lines for thinking_dna
   - ALL frameworks must be PROPRIETARY (passed Step 0)
   - ALL must have [SOURCE:] citations

3. Total combined lines MUST be under $max_lines (tier $tier budget).

4. Reference files for structure:
\`\`\`bash
cat squads/copywriter-os/data/minds/alex-hormozi/voice_dna.yaml
cat squads/copywriter-os/data/minds/alex-hormozi/thinking_dna.yaml
\`\`\`

When done, output: DNA_SYNTHESIS_COMPLETE"

    # Run Claude (Opus) — max 3 iterations
    for i in 1 2 3; do
        check_time || break
        TOTAL_ITERATIONS_RUN=$((TOTAL_ITERATIONS_RUN + 1))

        log "DNA synthesis iteration $i/3 [model=opus, tier=$tier]"

        local exit_code=0
        OUTPUT=$(cd "$PROJECT_ROOT" && echo "$prompt" \
            | claude --model opus --dangerously-skip-permissions -p 2>&1 \
            | tee -a "$LOG_FILE") || exit_code=$?

        # Check completion
        if echo "$OUTPUT" | grep -q "DNA_SYNTHESIS_COMPLETE"; then
            log_success "DNA synthesis complete"
            break
        fi

        # Rate limit
        if echo "$OUTPUT" | grep -qi "rate_limit\|429\|overloaded\|hit your limit"; then
            log_warn "Rate limited — waiting 120s"
            sleep 120
            continue
        fi

        # Fatal
        if echo "$OUTPUT" | grep -qi "Credit balance is too low\|Invalid API key"; then
            log_error "FATAL API error — stopping"
            return 1
        fi

        # No progress circuit breaker
        if [[ ! -f "$voice_file" ]] && [[ ! -f "$thinking_file" ]]; then
            CB_NO_PROGRESS_COUNT=$((CB_NO_PROGRESS_COUNT + 1))
            if [[ $CB_NO_PROGRESS_COUNT -ge $CB_NO_PROGRESS_THRESHOLD ]]; then
                log_error "Circuit breaker: $CB_NO_PROGRESS_THRESHOLD iterations without progress — STOP"
                return 1
            fi
        fi

        sleep 10
    done

    # Validate outputs
    local valid=true

    if [[ -f "$voice_file" ]] && [[ -s "$voice_file" ]]; then
        local vlines
        vlines=$(wc -l < "$voice_file" | tr -d ' ')
        log_success "voice_dna.yaml: $vlines lines"
        if [[ "$vlines" -gt 250 ]]; then
            log_warn "voice_dna exceeds 250 lines ($vlines) — needs curation"
        fi
    else
        log_error "voice_dna.yaml not created"
        valid=false
    fi

    if [[ -f "$thinking_file" ]] && [[ -s "$thinking_file" ]]; then
        local tlines
        tlines=$(wc -l < "$thinking_file" | tr -d ' ')
        log_success "thinking_dna.yaml: $tlines lines"
        if [[ "$tlines" -gt 300 ]]; then
            log_warn "thinking_dna exceeds 300 lines ($tlines) — needs curation"
        fi
    else
        log_error "thinking_dna.yaml not created"
        valid=false
    fi

    if [[ "$valid" == true ]]; then
        update_phase_status "7" "complete"
        log_success "Phase 7 complete — DNA synthesized"
    else
        log_error "Phase 7 FAILED — missing outputs"
        return 1
    fi
}

# =============================================================================
# STATUS DISPLAY
# =============================================================================
show_status() {
    python3 << PYEOF
import json, sys

try:
    state = json.load(open('$STATE_FILE'))
except:
    print('  (state not readable)')
    sys.exit(0)

elapsed = $(elapsed_time)
remaining = $(time_remaining)

def fmt(s):
    h, s = divmod(s, 3600)
    m, s = divmod(s, 60)
    return f'{int(h)}h{int(m):02d}m' if h else f'{int(m)}m{int(s):02d}s'

print()
print('═' * 60)
print(f'  RALPH-7D v1.0 | Agent: {state["mind"]} | Tier: {state.get("tier","?")}')
print('═' * 60)
print(f'  Elapsed: {fmt(elapsed)} | Remaining: {fmt(remaining)}')
print()

for pid in sorted(state.get('phases', {}).keys()):
    phase = state['phases'][pid]
    s = phase.get('status', 'pending')
    icon = '✅' if s == 'complete' else '🔄' if s == 'in_progress' else '⏭️' if s == 'skipped' else '⏳'
    print(f'  {icon} Phase {pid}: {phase["name"]} [{s}]')

print()

# Source info
sv = state.get('source_validation', {})
print(f'  Sources: {sv.get("source_count",0)} files | {sv.get("total_words",0)} words')
print(f'  Frameworks inv: {"✅" if sv.get("has_frameworks_inventory") else "❌"}')
print(f'  Agent file: {"✅" if sv.get("has_agent_file") else "❌"}')

# Outputs
outputs = state.get('outputs', {})
for k, v in outputs.items():
    if v:
        print(f'  📄 {k}: {v}')

print('═' * 60)
PYEOF
}

# =============================================================================
# PREFLIGHT
# =============================================================================
preflight() {
    echo ""
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  RALPH-7D v1.0 — CopywriterOS 7D Extraction Pipeline${NC}"
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Agent:          ${BOLD}$MIND${NC}"
    echo -e "  Max duration:   $(format_duration $MAX_DURATION_SECONDS)"
    echo -e "  Max iterations: $MAX_ITERATIONS"
    echo -e "  Resume:         $RESUME"
    echo -e "  Start phase:    ${START_PHASE:-'0 (all)'}"
    echo ""

    # Check tools
    echo -e "  ${BOLD}Tool Check:${NC}"
    for tool in claude python3 jq; do
        if command -v "$tool" &>/dev/null; then
            echo -e "    ${GREEN}✓${NC} $tool"
        else
            echo -e "    ${RED}✗${NC} $tool — NOT FOUND"
            if [[ "$tool" == "claude" || "$tool" == "python3" ]]; then
                echo -e "\n  ${RED}Missing critical tools. Aborting.${NC}"
                exit 1
            fi
        fi
    done

    # Check directories
    echo ""
    if [[ ! -d "$MIND_BOOKS" ]]; then
        echo -e "  ${RED}✗${NC} Books directory not found: $MIND_BOOKS"
        echo -e "  Available agents:"
        ls -1 "$BOOKS_DIR" 2>/dev/null | grep -v '^\.' | grep -v 'download' | sed 's/^/    /'
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} Books: $MIND_BOOKS"

    # Unset Anthropic API key for Max plan
    if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
        echo -e "  ${YELLOW}⚠ ANTHROPIC_API_KEY detected — UNSETTING to use Max plan${NC}"
        unset ANTHROPIC_API_KEY
    fi
    echo -e "  ${GREEN}✓${NC} Claude: Max plan OAuth"
    echo ""
}

# =============================================================================
# RUN SINGLE AGENT
# =============================================================================
run_single_agent() {
    local slug="$1"
    setup_mind_paths "$slug"
    preflight

    PIPELINE_START_TIME=$(date +%s)
    CB_NO_PROGRESS_COUNT=0

    if [[ "$DRY_RUN" == true ]]; then
        local tier
        tier=$(get_agent_tier "$slug")
        echo -e "${YELLOW}DRY RUN — would execute phases for $slug (Tier: $tier)${NC}"
        echo ""
        echo "Phase 0: Init + Validate    [bash]   — Validate sources, create state"
        echo "Phase 4: Text Extraction    [haiku]  — Clean PDFs, extract text"
        echo "Phase 6: 7D Extraction      [opus]   — Deep extraction with tier modifier"
        echo "Phase 7: DNA Synthesis      [opus]   — voice_dna + thinking_dna"
        echo ""
        echo "Tier modifier: $(get_tier_modifier "$tier")"
        echo "Token budget: $(get_tier_token_budget "$tier")"
        echo "Max lines: $(get_tier_max_lines "$tier")"
        return 0
    fi

    local start=${START_PHASE:-0}

    # Phase 0
    if [[ $start -le 0 ]]; then
        phase_0_init || return 1
    fi

    # Phase 4
    if [[ $start -le 4 ]]; then
        phase_4_extract || return 1
    fi

    # Phase 6
    if [[ $start -le 6 ]]; then
        phase_6_7d_extract || return 1
    fi

    # Phase 7
    if [[ $start -le 7 ]]; then
        phase_7_dna_synthesis || return 1
    fi

    # Final status
    echo ""
    log_success "RALPH-7D COMPLETE for agent: $MIND"
    log_success "Duration: $(format_duration $(elapsed_time))"
    log_success "Claude iterations: $TOTAL_ITERATIONS_RUN"
    show_status

    return 0
}

# =============================================================================
# BATCH MODE
# =============================================================================
run_batch() {
    local batch_type="$1"
    local agents=()

    case "$batch_type" in
        pilot)
            agents=("andre-chaperon" "david-deutsch" "jim-rutz")
            ;;
        t0)
            agents=("claude-hopkins" "eugene-schwartz" "robert-collier")
            ;;
        t1)
            agents=("gary-halbert" "gary-bencivenga" "david-ogilvy" "clayton-makepeace" "john-carlton" "parris-lampropoulos")
            ;;
        t2)
            agents=("dan-kennedy" "todd-brown" "jeff-walker" "stefan-georgi" "russell-brunson" "frank-kern")
            ;;
        t3)
            agents=("jon-benson" "ry-schwartz" "dan-koe" "ben-settle" "joe-sugarman")
            ;;
        all)
            agents=("andre-chaperon" "david-deutsch" "jim-rutz" \
                    "claude-hopkins" "eugene-schwartz" "robert-collier" \
                    "gary-halbert" "gary-bencivenga" "david-ogilvy" "clayton-makepeace" "john-carlton" "parris-lampropoulos" \
                    "dan-kennedy" "todd-brown" "jeff-walker" "stefan-georgi" "russell-brunson" "frank-kern" \
                    "jon-benson" "ry-schwartz" "dan-koe" "ben-settle" "joe-sugarman")
            ;;
        *)
            echo -e "${RED}Unknown batch type: $batch_type${NC}"
            echo "Available: pilot, t0, t1, t2, t3, all"
            exit 1
            ;;
    esac

    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  RALPH-7D BATCH — ${#agents[@]} agents ($batch_type)${NC}"
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo ""

    local success=0
    local failed=0
    CONSECUTIVE_FAILS=0

    for slug in "${agents[@]}"; do
        # Early-exit check
        if [[ $CONSECUTIVE_FAILS -ge $MAX_CONSECUTIVE_FAILS ]]; then
            echo -e "${RED}EARLY EXIT: $CONSECUTIVE_FAILS consecutive failures — stopping batch${NC}"
            log_error "Batch stopped: $CONSECUTIVE_FAILS consecutive failures"
            break
        fi

        # Check if books directory exists
        if [[ ! -d "$BOOKS_DIR/$slug" ]]; then
            echo -e "  ${YELLOW}⏭${NC} Skipping $slug (no books directory)"
            continue
        fi

        echo -e "\n${MAGENTA}${BOLD}━━━ Agent: $slug ($(( success + failed + 1 ))/${#agents[@]}) ━━━${NC}\n"

        if run_single_agent "$slug"; then
            success=$((success + 1))
            CONSECUTIVE_FAILS=0
            echo -e "${GREEN}✓ $slug DONE${NC}"
        else
            failed=$((failed + 1))
            CONSECUTIVE_FAILS=$((CONSECUTIVE_FAILS + 1))
            echo -e "${RED}✗ $slug FAILED${NC}"
        fi

        # Pause between agents (rate limit respect)
        sleep 30
    done

    echo ""
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo -e "  BATCH COMPLETE: $success success, $failed failed (${#agents[@]} total)"
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
}

# =============================================================================
# MAIN
# =============================================================================
main() {
    if [[ -n "$BATCH" ]]; then
        run_batch "$BATCH"
    elif [[ -n "$MIND" ]]; then
        run_single_agent "$MIND"
    else
        echo -e "${RED}ERROR: --mind <slug> or --batch <type> required${NC}"
        echo "Usage: ./ralph-7d.sh --mind <slug> [options]"
        echo "       ./ralph-7d.sh --batch <pilot|t0|t1|t2|t3|all> [options]"
        exit 1
    fi
}

# Graceful shutdown
trap 'echo ""; log_warn "Interrupted. Resume: ./ralph-7d.sh --mind $MIND --resume --phase <N>"; exit 130' INT

main
