# Copy Discovery Phase Execution Prompt

## Environment Variables (injected by script)
```
PROJECT_SLUG={{PROJECT_SLUG}}
PROJECT_DIR={{PROJECT_DIR}}
STATE_FILE={{STATE_FILE}}
PROGRESS_FILE={{PROGRESS_FILE}}
HANDOFF_FILE={{HANDOFF_FILE}}
COPY_DIR={{COPY_DIR}}
TASKS_DIR={{TASKS_DIR}}
PHASE_KEY={{PHASE_KEY}}
PHASE_NAME={{PHASE_NAME}}
TASKS_TO_EXECUTE={{TASKS_TO_EXECUTE}}
```

## Your Mission

You are executing the **Copy Discovery Pipeline** for project `{{PROJECT_SLUG}}`.

### Current Phase: {{PHASE_NAME}}

### Tasks to Complete
For each task listed in `TASKS_TO_EXECUTE`, you must:
1. Read the complete task file from `{{TASKS_DIR}}/[task-name].md`
2. Execute the workflow defined in that task
3. Create all required artifacts in the appropriate directory
4. Mark the task complete in the state file

### TIER System (Mandatory)

From `docs/frameworks/01-ARQUITETURA-GERAL.md`:

**TIER 0 - FOUNDATION (Read BEFORE anything else)**
- Claude Hopkins - Father of Direct Response
- Robert Collier - "Enter the conversation"
- Eugene Schwartz - 5 Levels of Awareness

**TIER 1 - DOCUMENTED MASTERS ($500M+ in sales)**
- Gary Bencivenga - Never lost a split-test
- Gary Halbert - Storytelling, 600M mailed
- Clayton Makepeace - $1.5B, visceral copy

**TIER 2 - MODERN SYSTEMATISTS (Teachable frameworks)**
- Dan Kennedy - 3Ms Triangle, high-ticket
- Todd Brown - Unique Mechanism, E5
- Stefan Georgi - RMBC Method

**TIER 3 - FORMAT SPECIALISTS**
- Jon Benson - VSL inventor
- Ben Settle - Daily email
- Andre Chaperon - Soap Opera Sequences

## Completion Protocol

### During Execution
- Log progress to `{{PROGRESS_FILE}}`
- Create artifacts in `{{PROJECT_DIR}}`
- Update `{{STATE_FILE}}` after each task

### Phase Complete Signal
When ALL tasks in this phase are complete, emit:

```
<promise>PHASE_COMPLETE</promise>
```

**CRITICAL:** Do NOT emit this signal until ALL tasks are fully completed with artifacts created.

## Quality Standards

Each task completion requires:
1. **Physical artifact** - File must exist at specified path
2. **Complete workflow** - All phases of task executed
3. **TIER compliance** - Appropriate copywriters used for task type
4. **State update** - Task marked complete in state file

## Artifact Locations

```
{{PROJECT_DIR}}/
├── diagnosis/     # Awareness, sophistication, mental conversation
├── research/      # Avatar research
├── foundation/    # RMBC brief, mechanism
├── copy/          # Headlines, bullets, VSL, visceral
├── offer/         # Offer stack
├── email/         # SOS, abandoned cart
└── testing/       # Hopkins audit
```

## Begin Execution

Read the first task file and begin executing. Report progress as you go.
