# Copy Workflow Agent Instructions

> **AIOX Integration:** Execute workflows by PHASES using copywriting agents.
> State is tracked in `copy-state.json`. Signals control loop flow.

## Project Context (Injected by copy.sh)

Environment variables:
- **PROJECT_DIR**: Project directory path
- **STATE_FILE**: Path to copy-state.json
- **PROGRESS_FILE**: Path to progress.txt
- **HANDOFF_FILE**: Path to handoff.md
- **OUTPUTS_DIR**: Path for generated artifacts
- **WORKFLOWS_DIR**: Path to workflow YAMLs
- **CURRENT_PHASE**: Current phase number
- **WORKFLOW_ID**: Selected workflow ID
- **ITERATION**: Current iteration number

---

## Completion Signals

**CRITICAL:** Emit these signals to control the copy.sh loop:

| Signal | When | Effect |
|--------|------|--------|
| `<promise>COMPLETE</promise>` | ALL phases done | Exits loop successfully |
| `<promise>CHECKPOINT:PHASE-X</promise>` | Phase X complete | Records checkpoint, continues |
| `<promise>BLOCKED:reason</promise>` | Cannot proceed | Exits loop with error |

---

## Your Task (Execute in Order)

### Phase 0: Decision Matrix (If workflow_id is null)

If `workflow_id` is null in copy-state.json, run decision matrix FIRST:

```
ASK THESE 5 QUESTIONS:

Q1: AWARENESS LEVEL
   1 = Unaware (doesn't know they have a problem)
   2 = Problem Aware (knows problem, not solutions)
   3 = Solution Aware (knows solutions exist, not yours)
   4 = Product Aware (knows your product, not convinced)
   5 = Most Aware (knows and wants your product)

Q2: MARKET SOPHISTICATION (Schwartz Scale)
   1 = First to market (direct claims work)
   2 = Second wave (enlarge claims)
   3 = Crowded market (add mechanism)
   4 = Skeptical market (elaborate mechanism)
   5 = Exhausted market (identify with prospect)

Q3: PRICE POINT
   - Low (< $100)
   - Mid ($100 - $1,000)
   - High ($1,000 - $5,000)
   - Premium ($5,000+)

Q4: TRAFFIC TEMPERATURE
   - Cold (never heard of you)
   - Warm (knows you, not ready to buy)
   - Hot (ready to buy)

Q5: PRIMARY OUTPUT
   - VSL (Video Sales Letter)
   - Sales Letter (Long-form)
   - Email Sequence
   - Ad Creative
   - Webinar
   - Direct Mail
   - Landing Page
   - Content
```

**Workflow Recommendation Matrix:**

| Primary Output | Cold Traffic | Warm Traffic | Hot Traffic |
|---------------|--------------|--------------|-------------|
| VSL/Sales Letter | wf-1-full-launch | wf-1-full-launch | wf-6-funnel-optimization |
| Ad Creative | wf-2-paid-traffic | wf-2-paid-traffic | wf-2-paid-traffic |
| Email Sequence | wf-5-email-marketing | wf-5-email-marketing | wf-5-email-marketing |
| Content | wf-4-organic-content | wf-4-organic-content | wf-4-organic-content |
| High-Ticket ($5k+) | wf-3-high-ticket | wf-3-high-ticket | wf-3-high-ticket |
| Direct Mail | wf-7-direct-mail | wf-7-direct-mail | wf-7-direct-mail |
| Optimization | - | wf-6-funnel-optimization | wf-6-funnel-optimization |

After collecting answers:
1. Update `decision_matrix_answers` in copy-state.json
2. Set `workflow_id` based on matrix
3. Proceed to Phase 1

---

### Phase Execution Loop

For each phase in the workflow:

#### Step 1: Read State
```
1. Read copy-state.json
2. Identify current_phase
3. Load phase tasks from phases.{phase_key}
4. Note which tasks are pending
```

#### Step 2: Load Workflow YAML
```
1. Read workflows/{workflow_id}.yaml
2. Understand phase structure
3. Note checkpoint requirements
```

#### Step 3: Execute Tasks

For each pending task in current phase:

```
1. Load the task file from tasks/{task_file}
2. Use the specified agent from agents/{agent}.md
3. Generate the artifact
4. Save to outputs/{artifact_path}
5. Update task status to "completed" in copy-state.json
6. Add artifact to artifacts array
7. Add agent to agents_used array
```

**Task Execution Pattern:**
```markdown
## Executing: {task_file}
**Agent:** @{agent}
**Output:** {artifact_path}

[Execute task following agent's methodology]

**Artifact Generated:** outputs/{artifact_path}
```

#### Step 4: Phase Checkpoint

When ALL tasks in current phase are completed:

1. Verify checkpoint criteria from workflow YAML
2. If `human_review: true`, note review needed
3. Update phase status to "completed"
4. Increment current_phase
5. Emit checkpoint signal:

```
<promise>CHECKPOINT:PHASE-{N}</promise>
```

#### Step 5: Workflow Completion

When ALL phases are completed:
1. Update status to "completed"
2. Update completed_at timestamp
3. Emit:

```
<promise>COMPLETE</promise>
```

---

## State Management

### copy-state.json Updates

**After each task:**
```json
{
  "tasks_completed": ["task-1.md", "task-2.md"],
  "artifacts": [
    {"name": "Avatar Research", "path": "outputs/research/avatar.md"}
  ],
  "agents_used": ["dan-kennedy", "todd-brown"],
  "metrics": {
    "headlines_generated": 25,
    "bullets_generated": 50
  }
}
```

**After each phase:**
```json
{
  "current_phase": 2,
  "checkpoints": [
    {"phase": "PHASE-1", "timestamp": "2026-01-23T10:30:00Z"}
  ],
  "phases": {
    "1_tier0_foundation": {
      "status": "completed"
    }
  }
}
```

### iteration_history

Add entry for each significant action:
```json
{
  "iteration": 1,
  "timestamp": "2026-01-23T10:30:00Z",
  "phase": "PHASE-1",
  "action": "task_completed",
  "agent": "eugene-schwartz",
  "task": "diagnose-awareness-level.md",
  "artifacts_created": ["diagnosis/awareness.yaml"],
  "notes": ""
}
```

---

## Clone Combinations

**Proven Combinations (use these):**
- Schwartz + Anyone (always diagnose awareness first)
- Todd Brown + Georgi (mechanism + production)
- Halbert + Makepeace (story + emotion)
- Chaperon + Settle (hybrid email)
- Bencivenga + Lampropoulos (bullet power)
- Kennedy + Todd Brown (avatar + differentiation)
- Hopkins + Sugarman (testing + triggers)

**Caution (avoid these):**
- Halbert + Carlton same piece (style conflict)
- Ogilvy + Makepeace (tone conflict)
- All 30 Sugarman triggers (overkill - use 15-20)
- Settle + Chaperon same list (confusing)

When using combinations, record in `clone_combinations_used`:
```json
["schwartz+todd-brown", "halbert+makepeace"]
```

---

## Validation Checklist by Phase

### TIER 0 Foundation
- [ ] Awareness level diagnosed (1-5)
- [ ] Market sophistication identified (Stage 1-5)
- [ ] Mental conversation mapped
- [ ] All artifacts saved to outputs/diagnosis/

### TIER 2 Strategy
- [ ] Avatar research complete with 3Ms
- [ ] Problem mechanism defined
- [ ] Solution mechanism defined
- [ ] RMBC brief created
- [ ] All artifacts saved to outputs/foundation/

### Headlines & Bullets
- [ ] 25+ headlines generated
- [ ] Multiple formulas used
- [ ] 50+ fascinations/bullets
- [ ] Saved to outputs/copy/

### Offer Stack
- [ ] Core offer defined
- [ ] Bonuses added (3-5)
- [ ] Guarantee crafted
- [ ] Price anchoring done
- [ ] Saved to outputs/offer/

### Copy Execution
- [ ] VSL/Sales Letter drafted
- [ ] Emotional visceral copy injected
- [ ] Opens strong (first 100 words)
- [ ] Closes with clear CTA
- [ ] Saved to outputs/copy/

### Email Sequences
- [ ] Soap Opera Sequence (5-7 emails)
- [ ] Cart abandonment sequence
- [ ] Post-purchase sequence
- [ ] Saved to outputs/email/

### Optimization
- [ ] Hopkins scientific audit complete
- [ ] Sugarman triggers applied (15-20)
- [ ] A/B test variants created
- [ ] Final QC checklist passed

---

## Agent Reference

### TIER 0 - Foundation
| Agent | Specialty | Key Task |
|-------|-----------|----------|
| eugene-schwartz | Awareness/Sophistication | diagnose-awareness-level.md |
| robert-collier | Mental Conversation | analyze-mental-conversation.md |
| claude-hopkins | Scientific Method | audit-copy-hopkins.md |

### TIER 1 - Masters
| Agent | Specialty | Key Task |
|-------|-----------|----------|
| gary-halbert | Storytelling | create-headlines.md |
| john-carlton | Direct Benefit | write-direct-headlines.md |
| gary-bencivenga | Fascinations | create-bullets.md |
| clayton-makepeace | Emotion | write-visceral-copy.md |
| david-ogilvy | Research | deep-research.md |

### TIER 2 - Systematizers
| Agent | Specialty | Key Task |
|-------|-----------|----------|
| dan-kennedy | 3Ms (Message/Market/Media) | avatar-research.md |
| todd-brown | E5 Method/Mechanism | create-unique-mechanism.md |
| stefan-georgi | RMBC | rmbc-method.md |

### TIER 3 - Specialists
| Agent | Specialty | Key Task |
|-------|-----------|----------|
| jon-benson | VSL | vsl-script.md |
| andre-chaperon | Email SOS | create-soap-opera-sequence.md |
| ben-settle | Daily Email | daily-email-template.md |
| parris-lampropoulos | Bullets | power-bullets.md |
| joe-sugarman | 30 Triggers | apply-sugarman-triggers.md |

---

## File Structure

```
{PROJECT_DIR}/
├── copy-state.json      # State tracking
├── progress.txt         # Session log
├── handoff.md           # Context between sessions
└── outputs/
    ├── diagnosis/       # TIER 0 outputs
    │   ├── awareness.yaml
    │   ├── sophistication.yaml
    │   └── mental-conversation.md
    ├── research/        # Research phase
    │   └── avatar.md
    ├── foundation/      # Strategy outputs
    │   ├── mechanism.md
    │   └── rmbc-brief.md
    ├── copy/            # Main copy assets
    │   ├── headlines.md
    │   ├── bullets.md
    │   ├── vsl-script.md
    │   └── visceral-sections.md
    ├── offer/           # Offer stack
    │   └── offer-stack.md
    ├── email/           # Email sequences
    │   ├── soap-opera.md
    │   └── abandoned-cart.md
    └── testing/         # Optimization
        ├── hopkins-audit.md
        └── sugarman-triggers-report.md
```

---

## Error Handling

### If task fails:
1. Log error to `errors` array in copy-state.json
2. Add note to iteration_history
3. Try alternative approach
4. If still blocked:

```
<promise>BLOCKED:task-name - reason</promise>
```

### If missing dependency:
1. Check if dependency task is completed
2. If not, execute dependency first
3. If dependency blocked:

```
<promise>BLOCKED:dependency-name required</promise>
```

### If missing agent file:
1. Use generic copywriting approach
2. Note in iteration_history
3. Continue workflow

---

## Progress Logging

After each phase, append to progress.txt:

```markdown
---
## Phase {N}: {Phase Name}
**Completed:** {timestamp}
**Duration:** {time}

### Tasks Completed
- [x] {task_file} → {artifact}

### Agents Used
- @{agent-1}
- @{agent-2}

### Clone Combinations
- {combo-1}

### Metrics
- Headlines: {n}
- Bullets: {n}

### Notes
{observations}
---
```

---

## Handoff Updates

After each session, update handoff.md:

```markdown
# Handoff: {Project Name}

## Estado Atual
- Workflow: {workflow_id}
- Phase: {current_phase} of {total_phases}
- Status: {phase_name}

## Context Mínimo
- Awareness: Level {n} - {name}
- Sophistication: Stage {n}
- Key Mechanism: {brief description}

## Artifacts Gerados
- {artifact_1}
- {artifact_2}

## Próxima Fase
- Phase {n+1}: {name}
- Tasks: {list}

## Erros a Evitar
- {mistake_1}

## Clone Combinations Used
- {combo_1}
```

---

## Quality Gates

**Phase NOT complete until:**

- [ ] All phase tasks have status "completed"
- [ ] All artifacts exist in outputs/
- [ ] copy-state.json updated correctly
- [ ] progress.txt logged
- [ ] Checkpoint criteria met (from workflow YAML)

**Workflow NOT complete until:**

- [ ] All phases completed
- [ ] Final optimization done
- [ ] Hopkins audit passed
- [ ] Sugarman triggers applied
- [ ] handoff.md updated

---

## If Stuck

1. **Check workflow YAML** for task dependencies
2. **Read agent file** for methodology
3. **Review previous artifacts** for context
4. **Use alternative approach** if possible
5. **Document blocker** if truly stuck
6. **NEVER emit false COMPLETE** signal

---

Now begin. Read copy-state.json and proceed with current phase.
