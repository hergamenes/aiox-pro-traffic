#!/bin/bash
# Copy Discovery Deep Mode Pipeline v2.0
# External bash loop - each phase runs in fresh Claude session
# Based on mmos.sh architecture - forces depth through structure
#
# ENHANCED with insights from Enhanced Workflows v2.0:
# - Master Decision Matrix (5 questions before starting)
# - 7 different workflow types
# - Clone combination rules
# - Day-by-day structure
#
# Usage: ./copy-discovery.sh <project-slug> [workflow] [max-iterations] [auto-mode]

set -e

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COPY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES_DIR="$COPY_DIR/templates/pipeline"
TASKS_DIR="$COPY_DIR/tasks"
OUTPUTS_DIR="$(cd "$SCRIPT_DIR/../../../outputs/copy" && pwd 2>/dev/null || echo "$SCRIPT_DIR/../../../outputs/copy")"

# ═══════════════════════════════════════════════════════════════
# WORKFLOW DEFINITIONS (from Enhanced Workflows v2.0)
# ═══════════════════════════════════════════════════════════════

# Function to get workflow info (portable - works with bash 3.x on macOS)
get_workflow_info() {
  case "$1" in
    full-launch)   echo "Full Product Launch|5-7 days|Course, membership, product release" ;;
    paid-traffic)  echo "Paid Traffic Campaign|2-3 days|Facebook, Google, YouTube ads" ;;
    high-ticket)   echo "High-Ticket Sales|7-10 days|Coaching, consulting, \$5k+ programs" ;;
    organic)       echo "Organic Content|Ongoing|Personal brand, authority building" ;;
    email-system)  echo "Email Marketing|Setup+|List monetization, automation" ;;
    optimization)  echo "Funnel Optimization|3-5 days|CRO, improving existing funnels" ;;
    direct-mail)   echo "Direct Mail|2-3 weeks|B2B, premium, physical products" ;;
    *)             echo "Unknown|Unknown|Unknown" ;;
  esac
}

# Clone combinations that work (from Enhanced Workflows)
CLONE_COMBOS_GOOD="
Schwartz + Anyone (always diagnose first)
Todd Brown + Georgi (mechanism + production)
Halbert + Makepeace (story + emotion)
Chaperon + Settle (hybrid email)
Bencivenga + Lampropoulos (bullet power)
Kennedy + Todd Brown (avatar + differentiation)
Hopkins + Sugarman (testing + triggers)"

CLONE_COMBOS_CAUTION="
Halbert + Carlton same piece (style conflict)
Ogilvy + Makepeace (sophisticated vs visceral - pick one)
All 30 Sugarman triggers (overkill = distrust)
Settle + Chaperon same list (confuses expectations)"

# ═══════════════════════════════════════════════════════════════
# ARGUMENT PARSING
# ═══════════════════════════════════════════════════════════════

show_help() {
  echo "📝 Copy Discovery Deep Mode Pipeline v2.0"
  echo ""
  echo "Usage: $0 <project-slug> [workflow] [max-iterations] [auto-mode]"
  echo ""
  echo "Arguments:"
  echo "  project-slug     Project identifier (e.g., makers-campaign, saas-launch)"
  echo "  workflow         Workflow type (default: full-launch)"
  echo "  max-iterations   Maximum iterations per phase (default: 10)"
  echo "  auto-mode        Auto-advance past checkpoints: true | false (default: true)"
  echo ""
  echo "Available Workflows:"
  echo "  ┌────────────────┬────────────┬─────────────────────────────────────┐"
  echo "  │ Workflow       │ Duration   │ Best For                            │"
  echo "  ├────────────────┼────────────┼─────────────────────────────────────┤"
  echo "  │ full-launch    │ 5-7 days   │ Course, membership, product release │"
  echo "  │ paid-traffic   │ 2-3 days   │ Facebook, Google, YouTube ads       │"
  echo "  │ high-ticket    │ 7-10 days  │ Coaching, consulting, \$5k+ programs │"
  echo "  │ organic        │ Ongoing    │ Personal brand, authority building  │"
  echo "  │ email-system   │ Setup+     │ List monetization, automation       │"
  echo "  │ optimization   │ 3-5 days   │ CRO, improving existing funnels     │"
  echo "  │ direct-mail    │ 2-3 weeks  │ B2B, premium, physical products     │"
  echo "  └────────────────┴────────────┴─────────────────────────────────────┘"
  echo ""
  echo "Examples:"
  echo "  $0 makers-campaign                        # Full launch workflow"
  echo "  $0 facebook-ads paid-traffic              # Paid traffic workflow"
  echo "  $0 coaching-offer high-ticket 15          # High-ticket with 15 iterations"
  echo "  $0 my-product full-launch 10 false        # Stop at checkpoints"
  echo ""
  echo "Master Decision Matrix (answer before starting):"
  echo "  Q1: Awareness Level (Unaware→Most Aware)"
  echo "  Q2: Market Sophistication (Stage 1→5)"
  echo "  Q3: Price Point (Low/Mid/High/Premium)"
  echo "  Q4: Traffic Temperature (Cold/Warm/Hot)"
  echo "  Q5: Primary Output (VSL/Letter/Email/Ad/etc.)"
  echo ""
  echo "Existing projects:"
  if [[ -d "$OUTPUTS_DIR" ]]; then
    for proj_dir in "$OUTPUTS_DIR"/*/; do
      if [[ -d "$proj_dir" ]]; then
        slug=$(basename "$proj_dir")
        state_file="$proj_dir/copy-state.json"
        if [[ -f "$state_file" ]]; then
          phase=$(cat "$state_file" | jq -r '.current_phase // 0' 2>/dev/null)
          status=$(cat "$state_file" | jq -r '.status // "unknown"' 2>/dev/null)
          workflow=$(cat "$state_file" | jq -r '.workflow // "full-launch"' 2>/dev/null)
          echo "  📝 $slug ($workflow - Phase $phase - $status)"
        else
          echo "  📁 $slug (no state)"
        fi
      fi
    done
  else
    echo "  (no projects found)"
  fi
  exit 0
}

# Handle --help, -h flags, and no arguments
if [[ "$1" == "--help" || "$1" == "-h" || -z "$1" ]]; then
  show_help
fi

PROJECT_SLUG="$1"
WORKFLOW="${2:-full-launch}"
MAX_ITERATIONS="${3:-10}"
AUTO_MODE="${4:-true}"

# Validate workflow
VALID_WORKFLOWS="full-launch paid-traffic high-ticket organic email-system optimization direct-mail"
if [[ ! " $VALID_WORKFLOWS " =~ " $WORKFLOW " ]]; then
  echo "❌ Invalid workflow: $WORKFLOW"
  echo "   Valid workflows: $VALID_WORKFLOWS"
  exit 1
fi

# Parse workflow info (needed for state file creation)
WORKFLOW_INFO=$(get_workflow_info "$WORKFLOW")
WORKFLOW_NAME=$(echo "$WORKFLOW_INFO" | cut -d'|' -f1)
WORKFLOW_DURATION=$(echo "$WORKFLOW_INFO" | cut -d'|' -f2)
WORKFLOW_USECASE=$(echo "$WORKFLOW_INFO" | cut -d'|' -f3)

# ═══════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════

# Create outputs directory if not exists
mkdir -p "$OUTPUTS_DIR"

# Create project directory
PROJECT_DIR="$OUTPUTS_DIR/$PROJECT_SLUG"
if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "📁 Creating project directory: $PROJECT_DIR"
  mkdir -p "$PROJECT_DIR"/{diagnosis,research,foundation,copy,email,testing,offer,logs}
fi

# ═══════════════════════════════════════════════════════════════
# SETUP FILES
# ═══════════════════════════════════════════════════════════════

STATE_FILE="$PROJECT_DIR/copy-state.json"
PROGRESS_FILE="$PROJECT_DIR/progress.log"
HANDOFF_FILE="$PROJECT_DIR/handoff.md"
LOG_FILE="$PROJECT_DIR/logs/pipeline-$(date +%Y%m%d).log"
PROMPT_FILE="$TEMPLATES_DIR/prompt.md"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Create state file if missing
if [[ ! -f "$STATE_FILE" ]]; then
  cat > "$STATE_FILE" << 'STATEEOF'
{
  "project_slug": "PROJECT_SLUG_PLACEHOLDER",
  "workflow": "WORKFLOW_PLACEHOLDER",
  "workflow_name": "WORKFLOW_NAME_PLACEHOLDER",
  "status": "initialized",
  "started_at": "STARTED_AT_PLACEHOLDER",
  "current_phase": 1,
  "phases": {
    "1_tier0_foundation": {
      "status": "pending",
      "tasks": [
        {"task": "diagnose-awareness-level.md", "status": "pending", "artifact": "diagnosis/awareness.yaml"},
        {"task": "diagnose-market-sophistication.md", "status": "pending", "artifact": "diagnosis/sophistication.yaml"},
        {"task": "analyze-mental-conversation.md", "status": "pending", "artifact": "diagnosis/mental-conversation.md"}
      ]
    },
    "2_tier2_strategy": {
      "status": "pending",
      "tasks": [
        {"task": "avatar-research.md", "status": "pending", "artifact": "research/avatar.md"},
        {"task": "rmbc-method.md", "status": "pending", "artifact": "foundation/rmbc-brief.md"}
      ]
    },
    "3a_headlines": {
      "status": "pending",
      "parallel": true,
      "tasks": [
        {"task": "create-headlines.md", "status": "pending", "artifact": "copy/headlines.md"}
      ]
    },
    "3b_bullets": {
      "status": "pending",
      "parallel": true,
      "tasks": [
        {"task": "create-bullets.md", "status": "pending", "artifact": "copy/bullets.md"}
      ]
    },
    "4_offer": {
      "status": "pending",
      "tasks": [
        {"task": "create-offer.md", "status": "pending", "artifact": "offer/offer-stack.md"}
      ]
    },
    "5_copy_execution": {
      "status": "pending",
      "tasks": [
        {"task": "vsl-script.md", "status": "pending", "artifact": "copy/vsl-script.md"},
        {"task": "write-visceral-copy.md", "status": "pending", "artifact": "copy/visceral-sections.md"}
      ]
    },
    "6_email_sequences": {
      "status": "pending",
      "tasks": [
        {"task": "create-soap-opera-sequence.md", "status": "pending", "artifact": "email/soap-opera.md"},
        {"task": "create-abandoned-cart.md", "status": "pending", "artifact": "email/abandoned-cart.md"}
      ]
    },
    "7_optimization": {
      "status": "pending",
      "tasks": [
        {"task": "audit-copy-hopkins.md", "status": "pending", "artifact": "testing/hopkins-audit.md"}
      ]
    }
  },
  "completed_tasks": [],
  "artifacts": []
}
STATEEOF

  # Replace placeholders
  sed -i.bak "s/PROJECT_SLUG_PLACEHOLDER/$PROJECT_SLUG/g" "$STATE_FILE"
  sed -i.bak "s/WORKFLOW_PLACEHOLDER/$WORKFLOW/g" "$STATE_FILE"
  sed -i.bak "s/WORKFLOW_NAME_PLACEHOLDER/$WORKFLOW_NAME/g" "$STATE_FILE"
  sed -i.bak "s/STARTED_AT_PLACEHOLDER/$(date -Iseconds)/g" "$STATE_FILE"
  rm -f "$STATE_FILE.bak"

  echo "📝 Created copy-state.json (workflow: $WORKFLOW)"
fi

# Create progress file if missing
if [[ ! -f "$PROGRESS_FILE" ]]; then
  cat > "$PROGRESS_FILE" << EOF
# Copy Discovery Pipeline Progress: $PROJECT_SLUG
**Started:** $(date +%Y-%m-%d)
**Workflow:** $WORKFLOW ($WORKFLOW_NAME)
**Duration Estimate:** $WORKFLOW_DURATION
**Best For:** $WORKFLOW_USECASE

---

## Pipeline Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | TIER 0 Foundation | Pending |
| 2 | TIER 2 Strategy | Pending |
| 3a | Headlines (parallel) | Pending |
| 3b | Bullets (parallel) | Pending |
| 4 | Offer Stack | Pending |
| 5 | Copy Execution | Pending |
| 6 | Email Sequences | Pending |
| 7 | Optimization | Pending |

---

## Execution Log

EOF
  echo "📝 Created progress.log"
fi

# ═══════════════════════════════════════════════════════════════
# DISPLAY HEADER
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║            📝 COPY DISCOVERY DEEP MODE PIPELINE v2.0         ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Project:        $PROJECT_SLUG"
echo "║  Workflow:       $WORKFLOW ($WORKFLOW_NAME)"
echo "║  Duration:       $WORKFLOW_DURATION"
echo "║  Best For:       $WORKFLOW_USECASE"
echo "║  Max Iterations: $MAX_ITERATIONS"
echo "║  Auto Mode:      $AUTO_MODE"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Clone Combos que funcionam:                                 ║"
echo "║    • Schwartz + Anyone (diagnose first)                      ║"
echo "║    • Todd Brown + Georgi (mechanism + production)            ║"
echo "║    • Halbert + Makepeace (story + emotion)                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════
# PROGRESS DASHBOARD FUNCTION
# ═══════════════════════════════════════════════════════════════

show_progress_dashboard() {
  local state_file="$1"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║                    📊 PIPELINE PROGRESS                      ║"
  echo "╠══════════════════════════════════════════════════════════════╣"

  local current_phase=$(cat "$state_file" | jq -r '.current_phase // 1')
  local completed_count=$(cat "$state_file" | jq -r '.completed_tasks | length // 0')

  declare -a PHASE_KEYS=("1_tier0_foundation" "2_tier2_strategy" "3a_headlines" "3b_bullets" "4_offer" "5_copy_execution" "6_email_sequences" "7_optimization")
  declare -a PHASE_NAMES=("TIER 0 Foundation" "TIER 2 Strategy" "Headlines" "Bullets" "Offer Stack" "Copy Execution" "Email Sequences" "Optimization")

  echo "║                                                              ║"
  echo "║  🎯 Current Phase: $current_phase"
  echo "║                                                              ║"
  echo "╠══════════════════════════════════════════════════════════════╣"

  for i in {0..7}; do
    local phase_key="${PHASE_KEYS[$i]}"
    local phase_name="${PHASE_NAMES[$i]}"
    local status=$(cat "$state_file" | jq -r ".phases.\"$phase_key\".status // \"pending\"")
    local task_count=$(cat "$state_file" | jq -r ".phases.\"$phase_key\".tasks | length // 0")

    local icon="⬜"
    if [[ "$status" == "complete" ]]; then
      icon="✅"
    elif [[ "$status" == "in_progress" ]]; then
      icon="🔄"
    fi

    printf "║  %s %-20s %s\n" "$icon" "$phase_name" "[$task_count tasks]"
  done

  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  Total Tasks Completed: $completed_count                     ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
}

# ═══════════════════════════════════════════════════════════════
# PHASE EXECUTION FUNCTION
# ═══════════════════════════════════════════════════════════════

# Run a single phase until complete
# Args: $1 = phase_key, $2 = phase_name, $3 = log_prefix
run_phase() {
  local phase_key="$1"
  local phase_name="$2"
  local log_prefix="${3:-}"
  local phase_log="$PROJECT_DIR/logs/${phase_key}-$(date +%Y%m%d).log"

  for iter in $(seq 1 $MAX_ITERATIONS); do
    # Check if phase already complete
    local phase_status=$(cat "$STATE_FILE" | jq -r ".phases.\"$phase_key\".status // \"pending\"")
    if [[ "$phase_status" == "complete" ]]; then
      echo "${log_prefix}✅ Phase $phase_name already complete"
      return 0
    fi

    echo ""
    echo "${log_prefix}═══════════════════════════════════════"
    echo "${log_prefix}═══ $phase_name | Iteration $iter ═══"
    echo "${log_prefix}═══════════════════════════════════════"
    echo "${log_prefix}🚀 Starting at $(date +%H:%M:%S)"

    # Get tasks for this phase
    local tasks=$(cat "$STATE_FILE" | jq -r ".phases.\"$phase_key\".tasks[].task" 2>/dev/null | tr '\n' ',' | sed 's/,$//')

    # Build prompt for phase
    local PHASE_PROMPT="PROJECT_SLUG=$PROJECT_SLUG
PROJECT_DIR=$PROJECT_DIR
STATE_FILE=$STATE_FILE
PROGRESS_FILE=$PROGRESS_FILE
HANDOFF_FILE=$HANDOFF_FILE
COPY_DIR=$COPY_DIR
TASKS_DIR=$TASKS_DIR
PHASE_KEY=$phase_key
PHASE_NAME=$phase_name
TASKS_TO_EXECUTE=$tasks

You are executing the Copy Discovery Pipeline for project '$PROJECT_SLUG'.

CURRENT PHASE: $phase_name ($phase_key)
TASKS TO COMPLETE: $tasks

INSTRUCTIONS:
1. Read the task files from $TASKS_DIR for each task listed
2. Execute each task completely, creating all required artifacts
3. Save artifacts to the appropriate directories in $PROJECT_DIR
4. When ALL tasks in this phase are complete, emit: <promise>PHASE_COMPLETE</promise>

CRITICAL:
- Do NOT emit <promise>PHASE_COMPLETE</promise> until ALL tasks are done
- Each task file has detailed workflows - follow them completely
- Create physical artifacts (files) for each task
- Update $STATE_FILE with progress after each task

TIER SYSTEM (from 01-ARQUITETURA-GERAL.md):
- TIER 0: Hopkins, Collier, Schwartz (Foundation - always first)
- TIER 1: Bencivenga, Halbert, Makepeace (Masters)
- TIER 2: Kennedy, Todd Brown, Georgi, Carlton (Systematists)
- TIER 3: Benson, Settle, Chaperon, Ogilvy (Specialists)

Begin execution now."

    # Run Claude
    local OUTPUT=$(claude -p --dangerously-skip-permissions "$PHASE_PROMPT" 2>&1 | tee -a "$phase_log") || true

    echo "${log_prefix}⏱️  Iteration $iter completed at $(date +%H:%M:%S)"

    # Log to progress file
    echo "[$(date +%H:%M:%S)] Phase $phase_name - Iteration $iter" >> "$PROGRESS_FILE"

    # Check for phase completion
    if echo "$OUTPUT" | grep -q "<promise>PHASE_COMPLETE</promise>"; then
      echo "${log_prefix}✅ Phase $phase_name COMPLETE!"

      # Update state file
      cat "$STATE_FILE" | jq ".phases.\"$phase_key\".status = \"complete\"" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"

      return 0
    fi

    sleep 2
  done

  echo "${log_prefix}⚠️  Phase $phase_name reached max iterations"
  return 1
}

# Run phases 3a and 3b in parallel
run_parallel_copy_phases() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        🚀 PARALLEL EXECUTION: Headlines + Bullets            ║"
  echo "║                                                              ║"
  echo "║   📝 Phase 3a: Headlines  ─┐                                 ║"
  echo "║   🎯 Phase 3b: Bullets    ─┴─► Running simultaneously        ║"
  echo "║                                                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  # Run Headlines (Phase 3a)
  (
    echo "[Headlines] 📝 Starting..."
    run_phase "3a_headlines" "Headlines" "[3a] "
    echo "[Headlines] ✅ DONE"
  ) &
  local HEADLINES_PID=$!

  # Run Bullets (Phase 3b)
  (
    echo "[Bullets] 🎯 Starting..."
    run_phase "3b_bullets" "Bullets" "[3b] "
    echo "[Bullets] ✅ DONE"
  ) &
  local BULLETS_PID=$!

  # Wait for both
  echo "⏳ Waiting for parallel phases to complete..."
  echo "   PIDs: Headlines=$HEADLINES_PID, Bullets=$BULLETS_PID"
  echo ""

  wait $HEADLINES_PID
  local HEADLINES_EXIT=$?
  wait $BULLETS_PID
  local BULLETS_EXIT=$?

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║              ✅ PARALLEL PHASES COMPLETE                     ║"
  echo "║                                                              ║"
  printf "║   Headlines: %s                                            ║\n" "$( [[ $HEADLINES_EXIT -eq 0 ]] && echo '✅' || echo '⚠️')"
  printf "║   Bullets:   %s                                            ║\n" "$( [[ $BULLETS_EXIT -eq 0 ]] && echo '✅' || echo '⚠️')"
  echo "║                                                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
}

# ═══════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════

# Show initial progress
show_progress_dashboard "$STATE_FILE"

# Phase 1: TIER 0 Foundation (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 1: TIER 0 FOUNDATION (Schwartz/Collier)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "1_tier0_foundation" "TIER 0 Foundation"

# Update current phase in state
cat "$STATE_FILE" | jq '.current_phase = 2' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phase 2: TIER 2 Strategy (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 2: TIER 2 STRATEGY (Kennedy/Todd Brown/RMBC)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "2_tier2_strategy" "TIER 2 Strategy"

# Update current phase
cat "$STATE_FILE" | jq '.current_phase = 3' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phases 3a + 3b: Headlines + Bullets (Parallel)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASES 3a + 3b: HEADLINES + BULLETS (Parallel)"
echo "═══════════════════════════════════════════════════════════════"
run_parallel_copy_phases

# Update current phase
cat "$STATE_FILE" | jq '.current_phase = 4' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phase 4: Offer Stack (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 4: OFFER STACK (Kennedy/Hormozi)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "4_offer" "Offer Stack"

# Update current phase
cat "$STATE_FILE" | jq '.current_phase = 5' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phase 5: Copy Execution (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 5: COPY EXECUTION (VSL + Visceral)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "5_copy_execution" "Copy Execution"

# Update current phase
cat "$STATE_FILE" | jq '.current_phase = 6' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phase 6: Email Sequences (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 6: EMAIL SEQUENCES (SOS + Abandoned Cart)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "6_email_sequences" "Email Sequences"

# Update current phase
cat "$STATE_FILE" | jq '.current_phase = 7' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
show_progress_dashboard "$STATE_FILE"

# Phase 7: Optimization (Sequential)
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "           PHASE 7: OPTIMIZATION (Hopkins Audit)"
echo "═══════════════════════════════════════════════════════════════"
run_phase "7_optimization" "Optimization"

# ═══════════════════════════════════════════════════════════════
# COMPLETION
# ═══════════════════════════════════════════════════════════════

# Mark pipeline complete
cat "$STATE_FILE" | jq '.status = "complete" | .completed_at = "'"$(date -Iseconds)"'"' > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🎉 COPY DISCOVERY PIPELINE COMPLETE! 🎉             ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Project: $PROJECT_SLUG"
echo "║  Output:  $PROJECT_DIR"
echo "║                                                              ║"
echo "║  Artifacts created:                                          ║"
echo "║    📁 diagnosis/    - Awareness & Sophistication analysis    ║"
echo "║    📁 research/     - Avatar deep dive                       ║"
echo "║    📁 foundation/   - RMBC brief                             ║"
echo "║    📁 copy/         - Headlines, bullets, VSL, visceral      ║"
echo "║    📁 offer/        - Offer stack                            ║"
echo "║    📁 email/        - SOS + abandoned cart sequences         ║"
echo "║    📁 testing/      - Hopkins audit                          ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Final progress
show_progress_dashboard "$STATE_FILE"
