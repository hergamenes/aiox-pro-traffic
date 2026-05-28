# Copy Workflows YOLO - Agent Instructions

> **AIOX Integration:** You follow Story-Driven Development principles.
> Complete context is in the PRD. Quality Gates must pass before marking [x].

## Project Context (Injected by copy.sh)

The following environment variables contain your project paths:
- **PROJECT_DIR**: The project directory path
- **PRD_FILE**: Path to prd.json
- **PROGRESS_FILE**: Path to progress.txt
- **HANDOFF_FILE**: Path to handoff.md (context from previous story)

Read handoff.md FIRST (if exists), then prd.json to understand the current state.

---

## Copy Squad Context

This project implements **YOLO Mode** (100% autonomous) workflows for the Copy squad.

### Key References
- **Base Script:** `squads/ralph/scripts/ralph.sh` (351 lines)
- **Workflows Doc:** `squads/copy/docs/frameworks/07-WORKFLOWS-ENHANCED.md`
- **Agents:** `squads/copy/agents/` (19 agents)
- **Tasks:** `squads/copy/tasks/` (48 tasks)
- **Checklists:** `squads/copy/checklists/` (15 checklists)
- **Templates:** `squads/copy/templates/` (19 templates)

### Output Structure
```
squads/copy/
├── scripts/
│   └── copy.sh              # Main bash loop
├── workflows/
│   ├── wf-1-full-launch.yaml
│   ├── wf-2-quick-traffic.yaml
│   ├── wf-3-high-ticket.yaml
│   ├── wf-4-email-content.yaml
│   └── wf-5-funnel-optimization.yaml
├── templates/
│   ├── copy-state.json      # State template
│   ├── prompt-copy.md       # Prompt template
│   └── progress-copy.txt    # Progress template
└── projects/
    └── {project-name}/
        ├── copy-state.json  # Runtime state
        ├── progress.txt     # Session log
        ├── handoff.md       # Context between phases
        └── outputs/         # Generated artifacts
```

---

## Your Authorized Sections

> **AIOX Principle:** You can ONLY edit these sections:

### In prd.json:
- `passes` field (false → true)
- `notes` field (add implementation notes)

### In progress.txt:
- **Session Log** section (APPEND only, never replace)
- **File List** table (add your entries)
- **Codebase Patterns** section (add discovered patterns)
- **Quality Gates Status** (check boxes when validated)

### In handoff.md:
- **OVERWRITE entirely** after each story (not append)
- Must be updated BEFORE starting next story

### You CANNOT edit:
- PRD requirements or acceptance criteria
- User stories or goals
- Success metrics

---

## Your Task (Execute in Order)

### 0. Load Handoff Context (FIRST)
```
IF handoff.md exists:
  1. Read handoff.md COMPLETELY
  2. Load "Context Mínimo" → critical learnings from last story
  3. Note "Erros a Evitar" → constraints for this session
  4. Check "Próxima Story" → your starting point

IF handoff.md does NOT exist:
  → First run, skip to Step 1
```

### 1. Read Current State
```
1. Read prd.json → See all stories and status
2. Read progress.txt → Check Codebase Patterns (if needed)
3. Note dependencies between stories
```

### 2. Select Next Story
```
1. Find next story where passes: false
2. Check if dependencies are satisfied (all deps must have passes: true)
3. If ALL stories pass → Output completion signal
4. Focus on ONE story only
```

### 3. Read Reference Files
```
For each story, read the reference files mentioned:
- reference: squads/copy/agents/todd-brown.md
- reference: squads/copy/checklists/sugarman-30-triggers.md
- reference: squads/ralph/scripts/ralph.sh
- etc.

These contain the patterns and frameworks to follow.
```

### 4. Implement Story
```
1. Review acceptance criteria
2. Follow existing patterns from Codebase Patterns
3. Implement ONLY what criteria specify
4. No scope creep - stick to the story
```

### 5. Validate
```
For script files (copy.sh):
- [ ] Syntax check: bash -n script.sh
- [ ] Permissions: chmod +x

For YAML files:
- [ ] Valid YAML syntax
- [ ] All required fields present
- [ ] References to existing tasks/agents valid

For Markdown files:
- [ ] Proper formatting
- [ ] All sections complete
- [ ] Cross-references valid

For JSON files:
- [ ] Valid JSON syntax
- [ ] Schema matches expected format
```

### 6. Update File List
```
In progress.txt, add to File List table:

| File | Action | Story | Description |
|------|--------|-------|-------------|
| `path/file.yaml` | Created | US-003 | [Purpose] |
| `path/file.md` | Modified | US-008 | [What changed] |
```

### 7. Update Status
```
In prd.json:
- Set passes: true
- Add notes if relevant
```

### 8. Log to Progress
```
APPEND to Session Log in progress.txt:

---
## [Date] - [Story ID]: [Title]

**Status:** ✅ Complete
**Thread:** [URL to this conversation for future reference]

### What was implemented
- [Description]

### Files Changed
| File | Action | Description |
|------|--------|-------------|

### Learnings
- **Pattern:** [If discovered]
- **Gotcha:** [If encountered]

### Validation
- [x] YAML valid
- [x] References valid
- [x] Scripts executable
---
```

### 9. Update Handoff
```
OVERWRITE handoff.md with:

# Handoff: Copy Workflows YOLO

## Estado Atual
- Story: [US-XXX] [Title]
- Status: Completed

## Context Mínimo
- [Top learning 1]
- [Top learning 2]
- [Top learning 3]

## Erros a Evitar
- [Mistake made]

## Arquivos Tocados
- [File 1]
- [File 2]

## Próxima Story
- [US-XXX] [Title]
- Dependencies: [list]
```

---

## Stop Condition

When ALL stories have `passes: true`:

```
<promise>COMPLETE</promise>
```

---

## Workflow YAML Structure

When creating workflow YAMLs, follow this structure:

```yaml
workflow:
  id: wf-X-name
  name: "Workflow Name"
  duration: "X-Y days"
  description: "Brief description"

phases:
  - id: PHASE-1
    name: "Phase Name"
    day: 1-2
    tier: 0
    tasks:
      - task_file: task-name.md
        agent: agent-slug
        required: true
      - task_file: other-task.md
        agent: other-agent
        required: false
    checkpoint:
      criteria: ["criterion_1 SET", "criterion_2 COMPLETE"]
      human_review: false
      message: ""

  - id: PHASE-2
    name: "Another Phase"
    day: 3
    tier: 1
    parallel: true  # Tasks can run in parallel
    tasks:
      - task_file: parallel-task-1.md
        agent: agent-1
      - task_file: parallel-task-2.md
        agent: agent-2
    checkpoint:
      human_review: true
      message: "Review before proceeding"

completion_signal: "<promise>COMPLETE</promise>"
checkpoint_signal: "<promise>CHECKPOINT:PHASE-X</promise>"
blocked_signal: "<promise>BLOCKED:T-X.Y</promise>"
```

---

## Task File Structure

When creating task files (*.md), follow this structure:

```markdown
# Task Name

ACTIVATION-NOTICE: This task file contains complete instructions.

## Purpose
[What this task accomplishes]

## Input Required
- [Input 1]: [Description]
- [Input 2]: [Description]

## Output
- [Output file/artifact]: [Description]

## Process

### Step 1: [Name]
[Instructions]

### Step 2: [Name]
[Instructions]

## Framework Reference
[Link to relevant agent or checklist]

## Validation
- [ ] Criterion 1
- [ ] Criterion 2

## Integration
- **Workflows:** [WF-1, WF-3]
- **Dependencies:** [task-x.md]
- **Used by:** [agent-name]
```

---

## Quality Gate Checklist

> Story is NOT complete until ALL pass:

### Files
- [ ] All files created in correct location
- [ ] File names follow conventions
- [ ] File contents complete

### Syntax
- [ ] YAML valid (workflows)
- [ ] JSON valid (templates)
- [ ] Bash syntax valid (scripts)

### References
- [ ] All task references exist
- [ ] All agent references exist
- [ ] All checklist references exist

### Documentation
- [ ] File List updated in progress.txt
- [ ] Learnings documented
- [ ] handoff.md updated (REQUIRED)

---

## If Stuck

1. **Document blocker** in story notes field
2. **Check reference files** for patterns
3. **Try alternative** approach
4. **If truly blocked**, move to next story (if no dependencies)
5. **NEVER** output false completion promise

---

Now begin. Read the current state and proceed with the next story.
