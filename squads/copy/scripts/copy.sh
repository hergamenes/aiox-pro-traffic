#!/bin/bash
# Copy Workflow Loop Script (runtime-agnostic: Claude, Codex, Gemini)
# Executes Copy workflows by PHASES (not stories) with checkpoints
# Usage: ./copy.sh [flags] <project-dir> [max-iterations]

set -e

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COPY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES_DIR="$COPY_DIR/templates"
WORKFLOWS_DIR="$COPY_DIR/workflows"
PROMPT_BUILDER="$SCRIPT_DIR/build-runtime-prompt.py"
PROMPT_MAX_RECENT_TASKS="${COPY_PROMPT_MAX_RECENT_TASKS:-3}"
PROMPT_MAX_RECENT_ARTIFACTS="${COPY_PROMPT_MAX_RECENT_ARTIFACTS:-3}"
PROMPT_MAX_AGENTS_USED="${COPY_PROMPT_MAX_AGENTS_USED:-5}"
PROMPT_MAX_HANDOFF_LINES="${COPY_PROMPT_MAX_HANDOFF_LINES:-12}"
PROMPT_MAX_HANDOFF_CHARS="${COPY_PROMPT_MAX_HANDOFF_CHARS:-1200}"

# Detect unbuffered output command (platform-agnostic)
if command -v stdbuf &> /dev/null; then
  UNBUFFER_CMD="stdbuf -oL"
elif command -v unbuffer &> /dev/null; then
  UNBUFFER_CMD="unbuffer"
else
  UNBUFFER_CMD=""
fi

REPO_ROOT="$(cd "$COPY_DIR/../.." && pwd)"
RUNNER_LIB_DIR="$REPO_ROOT/infrastructure/scripts/runner-lib"

# ── Bootstrap runner-lib v2 ──
source "$RUNNER_LIB_DIR/pipeline-bootstrap.sh"
if declare -f preflight_check >/dev/null 2>&1; then
  preflight_check "jq,python3" "" || exit 1
fi

REQUESTED_RUNTIME="${COPY_LLM_RUNTIME:-auto}"
SELECTED_RUNTIME=""
LLM_TIMEOUT_SECONDS="${COPY_LLM_TIMEOUT:-}"
RETRY_MAX_ATTEMPTS="${COPY_RETRY_MAX_ATTEMPTS:-}"
RETRY_BASE_DELAY_SECONDS="${COPY_RETRY_BASE_DELAY:-3}"
COPY_EXPLICIT_MODEL="${COPY_MODEL:-}"
MODEL_DEFAULT=""

# Replan-on-failure: enable for pipeline runners (Story 101.10 AC3)
PHASE_REPLAN="${PHASE_REPLAN:-true}"

# Evaluator: runner-lib 3-tier evaluator config (Story 101.11 AC9)
# Copy assets can be short — Tier 1 min_bytes is 100. Focus on Tier 2 rubrics.
EVAL_PHASES="${EVAL_PHASES:-all}"
EVALUATOR_RUBRICS_DIR="$COPY_DIR/rubrics"
EVAL_MIN_BYTES="${EVAL_MIN_BYTES:-100}"
export EVAL_PHASES EVALUATOR_RUBRICS_DIR EVAL_MIN_BYTES
REPLAN_MAX_ATTEMPTS="${REPLAN_MAX_ATTEMPTS:-2}"
export PHASE_REPLAN REPLAN_MAX_ATTEMPTS

# copy_run_llm() removed — dead code, never called (Story 101.12 AC10)

copy_handle_cost_cap_exit() {
  local phase="${1:-$CURRENT_PHASE}"
  local ts
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  if [[ -f "$STATE_FILE" ]]; then
    state_update \
      --arg phase "$phase" \
      --arg ts "$ts" \
      '.status = "cost_cap_exceeded" | .last_cost_cap_at = $ts | .current_phase = $phase' \
      "$STATE_FILE"
  fi

  echo "💾 State saved before exit..."
  echo "   Increase or remove --max-cost, then re-run the command to resume from $phase."
  exit 75
}

# ═══════════════════════════════════════════════════════════════
# ARGUMENT PARSING
# ═══════════════════════════════════════════════════════════════

show_help() {
  echo "📝 Copy Workflow Runner"
  echo ""
  echo "Usage: $0 [flags] <project-dir> [mode] [max-iterations]"
  echo ""
  echo "Flags:"
  echo "  --claude        Force Claude runtime"
  echo "  --codex         Force Codex runtime"
  echo "  --gemini        Force Gemini runtime"
  echo "  --model <name>  Override runtime model"
  echo "  --timeout <s>   Override LLM timeout in seconds"
  echo ""
  echo "Examples:"
  echo "  $0 squads/copy/projects/launch-2024/     # Full launch"
  echo "  $0 squads/copy/projects/ads-campaign/    # Paid traffic"
  echo "  $0 squads/copy/projects/my-project/ brownfield 30   # Custom, 30 iters"
  echo ""
  echo "Project directory must contain:"
  echo "  - copy-state.json  (or will use template)"
  echo "  - progress.txt     (created if missing)"
  echo "  - prompt.md        (uses default if missing)"
  echo ""
  echo "Available Workflows:"
  if [[ -d "$WORKFLOWS_DIR" ]]; then
    shopt -s nullglob
    for wf in "$WORKFLOWS_DIR"/*.yaml; do
      wf_name=$(basename "$wf" .yaml)
      wf_desc=$(grep -m1 "^  name:" "$wf" 2>/dev/null | sed 's/.*name: *"\?\([^"]*\)"\?.*/\1/' || echo "")
      echo "  📋 $wf_name - $wf_desc"
    done
    shopt -u nullglob
  else
    echo "  (No workflows found in $WORKFLOWS_DIR)"
  fi
  echo ""
  echo "Active projects:"
  find "$COPY_DIR/projects" -name "copy-state.json" 2>/dev/null | while read f; do
    dir=$(dirname "$f")
    project=$(cat "$f" | jq -r '.project // "Unknown"' 2>/dev/null)
    workflow=$(cat "$f" | jq -r '.workflow_id // "none"' 2>/dev/null)
    phase=$(cat "$f" | jq -r '.current_phase // "PHASE-0"' 2>/dev/null)
    echo "  📁 $dir"
    echo "      Project: $project | Workflow: $workflow | Phase: $phase"
  done
  exit 0
}

if [[ -z "${1:-}" ]]; then
  show_help
fi

POSITIONAL_ARGS=()
handle_extra_args() {
  POSITIONAL_ARGS=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --max-turns)
        MAX_TURNS_FLAG="$2"
        shift 2
        ;;
      --no-eval)       EVAL_DISABLED="true"; shift ;;
      --eval-tier1-only) EVAL_TIER1_ONLY="true"; shift ;;
      -*)
        echo "❌ Unknown flag: $1"
        echo "   Use --help for usage."
        exit 1
        ;;
      *)
        POSITIONAL_ARGS+=("$1")
        shift
        ;;
    esac
  done
}

parse_common_args "$@"
if [[ -n "${RUNNER_MODEL:-}" ]]; then
  COPY_EXPLICIT_MODEL="$RUNNER_MODEL"
fi
parse_extra_flags "${POSITIONAL_ARGS[@]}"

PROJECT_DIR="${POSITIONAL_ARGS[0]:-}"
MODE="${POSITIONAL_ARGS[1]:-greenfield}"
if [[ "$MODE" =~ ^[0-9]+$ ]]; then
  MAX_ITERATIONS="${MAX_TURNS_FLAG:-$MODE}"
  MODE="greenfield"
else
  MAX_ITERATIONS="${MAX_TURNS_FLAG:-${POSITIONAL_ARGS[2]:-30}}"
fi

if [[ -z "$PROJECT_DIR" ]]; then
  echo "❌ Missing project-dir"
  echo "   Use --help for usage."
  exit 1
fi

# ═══════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════

# Resolve to absolute path
if [[ ! "$PROJECT_DIR" = /* ]]; then
  PROJECT_DIR="$(pwd)/$PROJECT_DIR"
fi

# Remove trailing slash
PROJECT_DIR="${PROJECT_DIR%/}"
PROJECT_SLUG="$(basename "$PROJECT_DIR")"

# Check project directory exists
if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "❌ Project directory not found: $PROJECT_DIR"
  echo "   Create it first with copy-state.json or run decision matrix."
  exit 1
fi

SELECTED_RUNTIME="$(detect_runtime "$REQUESTED_RUNTIME")"
if [[ "$SELECTED_RUNTIME" == "invalid" ]]; then
  echo "❌ Invalid COPY_LLM_RUNTIME: $REQUESTED_RUNTIME"
  echo "   Valid values: auto, claude, codex, gemini"
  exit 1
fi
if [[ "$SELECTED_RUNTIME" == "none" ]]; then
  echo "❌ No supported runtime found in PATH (claude, codex, or gemini)."
  exit 1
fi
validate_runtime "$SELECTED_RUNTIME"

case "$SELECTED_RUNTIME" in
  claude)
    MODEL_DEFAULT="${COPY_EXPLICIT_MODEL:-$(get_balanced_model "$SELECTED_RUNTIME")}"
    RETRY_MAX_ATTEMPTS="${RETRY_MAX_ATTEMPTS:-2}"
    LLM_TIMEOUT_SECONDS="${LLM_TIMEOUT_SECONDS:-3600}"
    ;;
  codex)
    MODEL_DEFAULT="${COPY_EXPLICIT_MODEL:-$(get_balanced_model "$SELECTED_RUNTIME")}"
    RETRY_MAX_ATTEMPTS="${RETRY_MAX_ATTEMPTS:-3}"
    LLM_TIMEOUT_SECONDS="${LLM_TIMEOUT_SECONDS:-5400}"
    ;;
  gemini)
    MODEL_DEFAULT="${COPY_EXPLICIT_MODEL:-$(get_balanced_model "$SELECTED_RUNTIME")}"
    RETRY_MAX_ATTEMPTS="${RETRY_MAX_ATTEMPTS:-2}"
    LLM_TIMEOUT_SECONDS="${LLM_TIMEOUT_SECONDS:-3600}"
    ;;
esac
export SELECTED_RUNTIME LLM_TIMEOUT_SECONDS RETRY_MAX_ATTEMPTS RETRY_BASE_DELAY_SECONDS

# ═══════════════════════════════════════════════════════════════
# SETUP FILES
# ═══════════════════════════════════════════════════════════════

STATE_FILE="$PROJECT_DIR/copy-state.json"
PROGRESS_FILE="$PROJECT_DIR/progress.txt"
HANDOFF_FILE="$PROJECT_DIR/handoff.md"
OUTPUTS_ROOT_DIR="$REPO_ROOT/outputs/copy"
OUTPUTS_DIR="$OUTPUTS_ROOT_DIR/$PROJECT_SLUG"
LOGS_DIR="$OUTPUTS_DIR/logs"
LLM_LOG_FILE="$LOGS_DIR/llm-$(date +%Y%m%d).log"
METRICS_FILE="$LOGS_DIR/job-metrics.jsonl"
MAX_COST="${COPY_MAX_COST:-5.00}"
COPY_SESSION_ID=""
export METRICS_FILE MAX_COST

# Create outputs directory if missing
mkdir -p "$OUTPUTS_ROOT_DIR" "$OUTPUTS_DIR" "$LOGS_DIR"

cleanup() {
  local exit_code=$?
  if declare -f session_end >/dev/null 2>&1 && [[ -n "$COPY_SESSION_ID" ]]; then
    session_end "$COPY_SESSION_ID" "$exit_code" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if declare -f session_start >/dev/null 2>&1; then
  COPY_SESSION_ID="$(session_start "copy" "pipeline" "copy-runner" "${MODEL_DEFAULT:-unknown}" "${SELECTED_RUNTIME:-auto}" "$LLM_LOG_FILE" "{\"project\":\"$PROJECT_SLUG\"}" 2>/dev/null || true)"
fi

# Create copy-state.json if missing
if [[ ! -f "$STATE_FILE" ]]; then
  if [[ -f "$TEMPLATES_DIR/copy-state.json" ]]; then
    cp "$TEMPLATES_DIR/copy-state.json" "$STATE_FILE"
    echo "📝 Created copy-state.json from template"
    state_init "$STATE_FILE" "$PROJECT_SLUG" "copy-project"
    echo "📝 Created minimal copy-state.json"
  fi
fi

state_update \
  --arg target "$PROJECT_SLUG" \
  --arg ts "$(date -Iseconds)" \
  --arg phase "PHASE-0" \
  '.target = (if .target == "" or .target == null then $target else .target end)
    | .type = (if .type == "" or .type == null then "copy-project" else .type end)
    | .status = (if .status == "" or .status == null then "initialized" else .status end)
    | .started_at = (if .started_at == "" or .started_at == null then $ts else .started_at end)
    | .current_phase = (if .current_phase == "" or .current_phase == null then $phase else .current_phase end)
    | .tasks_completed //= []
    | .artifacts //= []
    | .checkpoints //= []
    | .agents_used //= []
    | .history //= []' \
  "$STATE_FILE"

if ! state_validate "$STATE_FILE"; then
  echo "❌ Invalid state file: $STATE_FILE"
  exit 1
fi

# Create progress.txt if missing
if [[ ! -f "$PROGRESS_FILE" ]]; then
  if [[ -f "$TEMPLATES_DIR/progress-copy.txt" ]]; then
    cp "$TEMPLATES_DIR/progress-copy.txt" "$PROGRESS_FILE"
    sed -i '' "s/YYYY-MM-DD/$(date +%Y-%m-%d)/g" "$PROGRESS_FILE" 2>/dev/null || true
    echo "📝 Created progress.txt from template"
  else
    cat > "$PROGRESS_FILE" << EOF
# Copy Project Progress
Started: $(date +%Y-%m-%d)

## Phase Progress
- [ ] PHASE-1: Foundation
- [ ] PHASE-2: Strategy
- [ ] PHASE-3: Execution
- [ ] PHASE-4: Optimization

## Artifacts Generated
(none yet)

## Session Log
EOF
    echo "📝 Created minimal progress.txt"
  fi
fi

progress_init "$PROGRESS_FILE" "Copy Workflow" "$PROJECT_SLUG"

# Use project prompt.md or default
PROJECT_PROMPT_FILE=""
if [[ -f "$PROJECT_DIR/prompt.md" ]]; then
  PROJECT_PROMPT_FILE="$PROJECT_DIR/prompt.md"
  PROMPT_FILE="$PROJECT_PROMPT_FILE"
elif [[ -f "$TEMPLATES_DIR/prompt-copy.md" ]]; then
  PROMPT_FILE="$TEMPLATES_DIR/prompt-copy.md"
else
  echo "⚠️  No prompt.md found, using inline prompt"
  PROMPT_FILE=""
fi

# Get project info from state
PROJECT_NAME=$(cat "$STATE_FILE" | jq -r '.project // "Unknown Project"' 2>/dev/null)
WORKFLOW_ID=$(cat "$STATE_FILE" | jq -r '.workflow_id // "none"' 2>/dev/null)
CURRENT_PHASE=$(cat "$STATE_FILE" | jq -r '.current_phase // "PHASE-0"' 2>/dev/null)

# ═══════════════════════════════════════════════════════════════
# SHOW STATUS
# ═══════════════════════════════════════════════════════════════

display_pipeline_banner "📝 Copy Workflow Runner" \
  "Project:$PROJECT_NAME" \
  "Project Dir:$PROJECT_DIR" \
  "Output Dir:$OUTPUTS_DIR" \
  "Workflow:$WORKFLOW_ID" \
  "Phase:$CURRENT_PHASE" \
  "State:$STATE_FILE" \
  "Progress:$PROGRESS_FILE" \
  "Handoff:$HANDOFF_FILE" \
  "Runtime:$SELECTED_RUNTIME" \
  "Model:$MODEL_DEFAULT" \
  "Max iters:$MAX_ITERATIONS"
if [[ -n "$UNBUFFER_CMD" ]]; then
  echo "   Streaming:  ✅ Real-time ($UNBUFFER_CMD)"
else
  echo "   Streaming:  ⚠️  Buffered (install 'expect' for real-time)"
fi
echo ""

# Show tasks completed
TASKS_DONE=$(cat "$STATE_FILE" | jq -r '.tasks_completed | length' 2>/dev/null)
echo "📋 Progress: $TASKS_DONE tasks completed"
cat "$STATE_FILE" | jq -r '.tasks_completed[]? // empty' 2>/dev/null | while read task; do
  echo "   ✅ $task"
done
echo ""

# Show artifacts generated
ARTIFACTS=$(cat "$STATE_FILE" | jq -r '.artifacts | length' 2>/dev/null)
if [[ "$ARTIFACTS" -gt 0 ]]; then
  echo "📄 Artifacts: $ARTIFACTS generated"
  cat "$STATE_FILE" | jq -r '.artifacts[]?.name // empty' 2>/dev/null | while read art; do
    echo "   📄 $art"
  done
  echo ""
fi

# ═══════════════════════════════════════════════════════════════
# MAIN LOOP
# ═══════════════════════════════════════════════════════════════

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "═══════════════════════════════════════"
  echo "═══ Iteration $i of $MAX_ITERATIONS ═══"
  echo "═══════════════════════════════════════"

  # Read current state
  CURRENT_PHASE=$(cat "$STATE_FILE" | jq -r '.current_phase // "PHASE-0"' 2>/dev/null)
  WORKFLOW_ID=$(cat "$STATE_FILE" | jq -r '.workflow_id // "none"' 2>/dev/null)

  echo "🎯 Current Phase: $CURRENT_PHASE"
  echo "📋 Workflow: $WORKFLOW_ID"

  # Cost cap check (opt-in via --max-cost)
  if declare -f check_cost_cap >/dev/null 2>&1; then
    check_cost_cap "${MAX_COST:-}" || copy_handle_cost_cap_exit "$CURRENT_PHASE"
  fi

  # Timestamp start
  ITER_START=$(date +%s)
  echo "⏱️  Started: $(date +%H:%M:%S)"
  echo ""

  # Export environment variables for tracking
  export COPY_ITERATION=$i
  export COPY_PHASE="$CURRENT_PHASE"
  export COPY_WORKFLOW="$WORKFLOW_ID"
  export COPY_PROJECT_DIR="$PROJECT_DIR"
  PROMPT_MODE="compact"
  FULL_PROMPT=""

  # Build the prompt with project context
  if [[ -f "$PROMPT_BUILDER" ]]; then
    BUILDER_ARGS=(
      "$PROMPT_BUILDER"
      --project-dir "$PROJECT_DIR"
      --state-file "$STATE_FILE"
      --progress-file "$PROGRESS_FILE"
      --handoff-file "$HANDOFF_FILE"
      --outputs-dir "$OUTPUTS_DIR"
      --workflows-dir "$WORKFLOWS_DIR"
      --workflow-id "$WORKFLOW_ID"
      --current-phase "$CURRENT_PHASE"
      --iteration "$i"
      --max-recent-tasks "$PROMPT_MAX_RECENT_TASKS"
      --max-recent-artifacts "$PROMPT_MAX_RECENT_ARTIFACTS"
      --max-agents-used "$PROMPT_MAX_AGENTS_USED"
      --max-handoff-lines "$PROMPT_MAX_HANDOFF_LINES"
      --max-handoff-chars "$PROMPT_MAX_HANDOFF_CHARS"
    )
    if [[ -n "$PROJECT_PROMPT_FILE" ]]; then
      BUILDER_ARGS+=(--project-prompt-file "$PROJECT_PROMPT_FILE")
    fi

    if ! FULL_PROMPT=$(python3 "${BUILDER_ARGS[@]}"); then
      echo "⚠️  Compact prompt builder failed, falling back to legacy prompt assembly"
      PROMPT_MODE="legacy-fallback"
    fi
  fi

  if [[ -n "$FULL_PROMPT" ]]; then
    :
  elif [[ -n "$PROMPT_FILE" && -f "$PROMPT_FILE" ]]; then
    if [[ "$PROMPT_MODE" == "compact" ]]; then
      PROMPT_MODE="legacy-prompt-file"
    fi
    FULL_PROMPT="PROJECT_DIR=$PROJECT_DIR
STATE_FILE=$STATE_FILE
PROGRESS_FILE=$PROGRESS_FILE
HANDOFF_FILE=$HANDOFF_FILE
OUTPUTS_DIR=$OUTPUTS_DIR
WORKFLOWS_DIR=$WORKFLOWS_DIR
CURRENT_PHASE=$CURRENT_PHASE
WORKFLOW_ID=$WORKFLOW_ID
ITERATION=$i

$(cat "$PROMPT_FILE")"
  else
    # Inline prompt if no file
    if [[ -z "$PROMPT_MODE" || "$PROMPT_MODE" == "compact" ]]; then
      PROMPT_MODE="inline-fallback"
    fi
    FULL_PROMPT="PROJECT_DIR=$PROJECT_DIR
STATE_FILE=$STATE_FILE
PROGRESS_FILE=$PROGRESS_FILE
HANDOFF_FILE=$HANDOFF_FILE
OUTPUTS_DIR=$OUTPUTS_DIR
WORKFLOWS_DIR=$WORKFLOWS_DIR
CURRENT_PHASE=$CURRENT_PHASE
WORKFLOW_ID=$WORKFLOW_ID
ITERATION=$i

Execute the Copy workflow phase. Read copy-state.json first, then:
1. If workflow_id is null, run decision matrix to select workflow
2. Execute current phase tasks using appropriate agents
3. Update copy-state.json with progress
4. When phase complete, emit <promise>CHECKPOINT:PHASE-X</promise>
5. When all phases complete, emit <promise>COMPLETE</promise>

If blocked, emit <promise>BLOCKED:reason</promise>"
  fi

  PROMPT_CACHE_FILE="$PROJECT_DIR/.last-copy-prompt.md"
  if declare -f truncate_prior_context >/dev/null 2>&1; then
    FULL_PROMPT="$(truncate_prior_context "$FULL_PROMPT" 14000)"
  fi
  printf "%s" "$FULL_PROMPT" > "$PROMPT_CACHE_FILE"
  PROMPT_LINES=$(printf "%s" "$FULL_PROMPT" | wc -l | tr -d ' ')
  PROMPT_BYTES=$(printf "%s" "$FULL_PROMPT" | wc -c | tr -d ' ')
  echo "🧠 Prompt: $PROMPT_LINES lines | $PROMPT_BYTES bytes | mode=$PROMPT_MODE"

  # Run selected runtime with the prompt
  echo "─────────────────────────────────────"
  PHASE_LABEL=$(printf '%s' "$CURRENT_PHASE" | tr '[:upper:]' '[:lower:]')
  RAW_OUTPUT=$(run_llm_prompt_with_replan "$MODEL_DEFAULT" "$FULL_PROMPT" "$LLM_LOG_FILE" "$PHASE_LABEL") || true
  
  OUTPUT=$(filter_llm_output "$RAW_OUTPUT")
  echo "─────────────────────────────────────"

  # Calculate iteration duration
  ITER_END=$(date +%s)
  ITER_DURATION=$((ITER_END - ITER_START))
  ITER_MINS=$((ITER_DURATION / 60))
  ITER_SECS=$((ITER_DURATION % 60))

  echo ""
  echo "⏱️  Completed: $(date +%H:%M:%S) (${ITER_MINS}m ${ITER_SECS}s)"

  # Update iteration count in state
  state_update \
    --argjson iter "$i" \
    '.iteration = $iter' \
    "$STATE_FILE"

  # Check for checkpoint signal
  if echo "$OUTPUT" | grep -qE "<promise>CHECKPOINT:PHASE-[0-9]+</promise>"; then
    CHECKPOINT_PHASE=$(echo "$OUTPUT" | grep -oE "CHECKPOINT:PHASE-[0-9]+" | head -1 | sed 's/CHECKPOINT://')
    echo ""
    echo "═══════════════════════════════════════"
    echo "🔄 Checkpoint: $CHECKPOINT_PHASE"
    echo "═══════════════════════════════════════"

    # ── Evaluator: validate output quality at checkpoint (Story 101.11 AC9) ──
    if declare -f run_phase_evaluator >/dev/null 2>&1; then
      local eval_output_file="$PROJECT_DIR/.last-copy-output.md"
      if [[ -n "$OUTPUT" ]]; then
        echo "$OUTPUT" > "$eval_output_file"
        local eval_exit=0
        local eval_verdict
        eval_verdict=$(run_phase_evaluator "$eval_output_file" "$PHASE_LABEL" "$LLM_LOG_FILE") || eval_exit=$?
        rm -f "$eval_output_file" 2>/dev/null
        case "$eval_verdict" in
          RETRY)
            echo "  🔄 Evaluator: RETRY — re-executing phase"
            continue
            ;;
          REMEDIATE)
            echo "  ⚠️  Evaluator: REMEDIATE — continuing with degraded quality"
            PHASES_DEGRADED="${PHASES_DEGRADED:+$PHASES_DEGRADED,}$PHASE_LABEL"
            ;;
          HALT)
            echo "  🛑 Evaluator: HALT — critical quality failure"
            exit 1
            ;;
        esac
      fi
    fi

    # Add checkpoint to state
    state_update \
      --arg cp "$CHECKPOINT_PHASE" \
      --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      '.checkpoints += [{"phase": $cp, "timestamp": $ts}]' \
      "$STATE_FILE"

    # Log checkpoint
    echo "" >> "$PROGRESS_FILE"
    echo "### Checkpoint: $CHECKPOINT_PHASE - $(date +%Y-%m-%d\ %H:%M:%S)" >> "$PROGRESS_FILE"

    echo "   ✅ Checkpoint recorded"
  fi

  # Check for blocked signal
  if echo "$OUTPUT" | grep -qE "<promise>BLOCKED:"; then
    BLOCKED_REASON=$(echo "$OUTPUT" | grep -oE "BLOCKED:[^<]+" | head -1 | sed 's/BLOCKED://')
    echo ""
    echo "═══════════════════════════════════════"
    echo "⛔ BLOCKED: $BLOCKED_REASON"
    echo "═══════════════════════════════════════"

    # Log block
    echo "" >> "$PROGRESS_FILE"
    echo "### BLOCKED: $BLOCKED_REASON - $(date +%Y-%m-%d\ %H:%M:%S)" >> "$PROGRESS_FILE"

    echo "   Review and resolve blocker manually."
    exit 2
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    ARTIFACTS_COUNT=$(cat "$STATE_FILE" | jq -r '.artifacts | length' 2>/dev/null || echo 0)
    state_complete "$STATE_FILE" 0
    progress_pipeline_complete "0" "$ARTIFACTS_COUNT"
    display_completion "WORKFLOW COMPLETE!" \
      "Project:$PROJECT_NAME" \
      "Workflow:$WORKFLOW_ID" \
      "Iterations:$i" \
      "Finished:$(date +%H:%M:%S)"

    # Mark completion in progress file
    echo "" >> "$PROGRESS_FILE"
    echo "## COMPLETED: $(date +%Y-%m-%d)" >> "$PROGRESS_FILE"

    # Show artifacts
    echo ""
    echo "📄 Generated Artifacts:"
    cat "$STATE_FILE" | jq -r '.artifacts[]? | "   📄 \(.name): \(.path)"' 2>/dev/null || echo "   (none recorded)"

    exit 0
  fi

  # Show updated status
  echo ""
  TASKS_DONE=$(cat "$STATE_FILE" | jq -r '.tasks_completed | length' 2>/dev/null)
  CHECKPOINTS=$(cat "$STATE_FILE" | jq -r '.checkpoints | length' 2>/dev/null)
  echo "📊 Status: $TASKS_DONE tasks | $CHECKPOINTS checkpoints"

  # Brief pause between iterations
  echo ""
  echo "⏳ Waiting 2 seconds before next iteration..."
  sleep 2
done

echo ""
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "   Project: $PROJECT_NAME"
echo "   Workflow may be incomplete."
echo ""
echo "   Check status:"
echo "   cat $STATE_FILE | jq '.'"
exit 1
