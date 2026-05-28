#!/bin/bash
# Copy Framework v2.0 - Swarm Runner (wrapper)
# Usage: ./run-swarm.sh [workers]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NUM_WORKERS=${1:-8}
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
RALPH_SWARM_SCRIPT="${RALPH_SWARM_SCRIPT:-$REPO_ROOT/squads/ralph/scripts/ralph-tmux-swarm.sh}"

# Use canonical Ralph tmux swarm script
if [ ! -x "$RALPH_SWARM_SCRIPT" ]; then
  echo "ERROR: Ralph swarm script not found or not executable: $RALPH_SWARM_SCRIPT" >&2
  exit 1
fi

exec "$RALPH_SWARM_SCRIPT" "$SCRIPT_DIR" "$NUM_WORKERS"
