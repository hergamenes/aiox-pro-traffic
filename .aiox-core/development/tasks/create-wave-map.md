---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Autonomous (0-1 prompts)
- Auto-detects dependencies from story files
- Generates wave-map without confirmation
- **Best for:** Well-structured epics with clear dependencies

### 2. Interactive Mode - Balanced (2-4 prompts) **[DEFAULT]**
- Confirms discovered dependencies
- Reviews wave groupings before generating
- **Best for:** First wave-map generation, complex dependency graphs

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOX Task Format V1.0)

```yaml
task: createWaveMap()
responsavel: Morgan (PM)
responsavel_type: Agente
atomic_layer: Planning

**Entrada:**
- campo: epic_path
  tipo: string
  origem: User Input
  obrigatório: true
  validação: Must be a valid path to an epic directory containing 2+ story files (*.story.md)

- campo: output
  tipo: string
  origem: User Input
  obrigatório: false
  validação: Output path for wave-map.yaml. Default: {epic_path}/wave-map.yaml

- campo: mode
  tipo: string
  origem: User Input
  obrigatório: false
  validação: Must be "yolo" or "interactive". Default: "interactive"

**Saída:**
- campo: wave_map
  tipo: file
  destino: File system ({epic_path}/wave-map.yaml)
  persistido: true

- campo: wave_summary
  tipo: string
  destino: Output
  persistido: false
```

---

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] epic_path must resolve to an existing directory
    tipo: pre-condition
    blocker: true
    validação: |
      Directory must exist and be accessible
    error_message: "Pre-condition failed: Epic directory not found at '{epic_path}'"

  - [ ] epic_path must contain 2+ story files (*.story.md)
    tipo: pre-condition
    blocker: true
    validação: |
      Glob {epic_path}/*.story.md must return 2 or more files
    error_message: "Pre-condition failed: Found fewer than 2 story files in '{epic_path}'. Need at least 2 stories to create a wave map."
```

---

## Post-Conditions

```yaml
post-conditions:
  - [ ] wave-map.yaml generated at output path
    tipo: post-condition
    blocker: true
    validação: |
      File exists at {output} and is valid YAML
    error_message: "Post-condition failed: wave-map.yaml not generated"

  - [ ] No dependency cycles exist in wave-map
    tipo: post-condition
    blocker: true
    validação: |
      Topological sort completed without detecting cycles
    error_message: "Post-condition failed: Circular dependency detected in wave-map"

  - [ ] Each story appears in exactly 1 wave
    tipo: post-condition
    blocker: true
    validação: |
      No story ID appears in more than one wave; all discovered stories are assigned
    error_message: "Post-condition failed: Story assigned to multiple waves or missing from wave-map"
```

---

## Acceptance Criteria

```yaml
acceptance-criteria:
  - [ ] Stories without mutual dependencies are grouped in the same wave
    tipo: acceptance-criterion
    blocker: true
    validação: |
      Stories in the same wave have no dependency edges between them.
      A story's dependencies must all be in earlier waves.
    error_message: "Acceptance criterion not met: Co-wave stories have unresolved dependencies"

  - [ ] Terminal prompts use /AIOX:agents:dev format
    tipo: acceptance-criterion
    blocker: true
    validação: |
      All terminal_prompts in wave-map.yaml use the format:
      /AIOX:agents:dev {story_path} [--mode=yolo]
    error_message: "Acceptance criterion not met: Terminal prompts not in /AIOX:agents:dev format"

  - [ ] Wave-map YAML is valid and parseable
    tipo: acceptance-criterion
    blocker: true
    validação: |
      Output file passes YAML syntax validation
    error_message: "Acceptance criterion not met: wave-map.yaml has invalid YAML syntax"
```

---

## Tools

- **Tool:** Glob (Claude Code built-in)
  - **Purpose:** Discover story files in epic directory
  - **Source:** Claude Code runtime

- **Tool:** Read (Claude Code built-in)
  - **Purpose:** Read story files to extract dependencies
  - **Source:** Claude Code runtime

- **Tool:** Write (Claude Code built-in)
  - **Purpose:** Generate wave-map.yaml output file
  - **Source:** Claude Code runtime

- **Tool:** AskUserQuestion (Claude Code built-in)
  - **Purpose:** Confirm dependencies and wave groupings (Interactive mode)
  - **Source:** Claude Code runtime

---

## Error Handling

**Strategy:** fail-fast-with-guidance

**Common Errors:**

1. **Error:** No story files found
   - **Cause:** Wrong epic_path or stories not yet created
   - **Resolution:** Verify path and ensure stories exist
   - **Recovery:** Suggest `@sm *draft` to create stories first

2. **Error:** Circular dependency detected
   - **Cause:** Story A depends on B, B depends on A (or longer cycle)
   - **Resolution:** Display the cycle chain for user review
   - **Recovery:** Ask user to fix dependency declarations in story files, then re-run

3. **Error:** Dependency references non-existent story
   - **Cause:** Typo in dependency ID or story not yet created
   - **Resolution:** List unresolved dependencies with suggestions
   - **Recovery:** Show closest matching story IDs

4. **Error:** Story has no ID or title
   - **Cause:** Malformed story file missing frontmatter
   - **Resolution:** Show which file is malformed
   - **Recovery:** Suggest fixing story file structure

---

## Performance

```yaml
duration: 1-5 min (depends on story count)
token_usage: ~2,000-5,000 tokens
cost: minimal (read-only analysis + file write)
```

---

## Metadata

```yaml
story: EPIC-WAVE (wave planning infrastructure)
version: 1.0.0
dependencies:
  - epic-orchestration.yaml (template reference)
  - execute-epic-plan.md (consumer of wave-map output)
tags:
  - epic
  - wave-map
  - dependency-analysis
  - parallel-planning
  - topological-sort
updated_at: 2026-03-14
```

---

# Create Wave Map Task

## Purpose

Analyze story dependencies within an epic directory, perform topological sorting to detect
parallelization opportunities, and generate a `wave-map.yaml` file that defines execution
waves for parallel development. Each wave groups independent stories that can run simultaneously.

## Prerequisites

- Epic directory exists with 2+ story files (`*.story.md`)
- Story files contain identifiable `id`, `title`, and `dependencies` fields
- No circular dependencies between stories

---

## Command

```
@pm *wave-map {epic-path} [--output=path]
```

### Examples

```bash
# Generate wave-map for an epic
@pm *wave-map docs/stories/epics/epic-activation-pipeline/

# Generate with custom output path
@pm *wave-map docs/stories/epics/epic-auth/ --output=docs/wave-maps/auth-waves.yaml

# YOLO mode (no confirmations)
@pm *wave-map docs/stories/epics/epic-activation-pipeline/ --mode=yolo
```

---

## Task Execution

### Step 1: Discover Stories

Scan the epic directory for all story files.

```
Glob {epic_path}/*.story.md

FOR EACH story_file:
  Read story_file
  Extract:
    - id: story identifier (e.g., "ACT-1", "AUTH-3")
    - title: story title
    - dependencies: list of story IDs this story depends on (default: [])
    - complexity: story complexity rating (if available)
    - file: relative file path

  Store in stories_map[id] = { id, title, dependencies, complexity, file }

Display:
  "📋 Discovered {count} stories in {epic_path}:"
  FOR EACH story: "  - {id}: {title} (deps: {dependencies || 'none'})"

IF count < 2:
  ERROR: "Need at least 2 stories to create a wave map."
  STOP
```

### Step 2: Validate Dependencies

Verify all dependency references and detect cycles.

```
# 2a. Check that all referenced dependencies exist
FOR EACH story IN stories_map:
  FOR EACH dep IN story.dependencies:
    IF dep NOT IN stories_map:
      ERROR: "Story {story.id} depends on '{dep}' which does not exist."
      SUGGEST: closest matching IDs from stories_map
      STOP

# 2b. Detect cycles using topological sort (Kahn's algorithm)
in_degree = {}
adjacency = {}

FOR EACH story IN stories_map:
  in_degree[story.id] = len(story.dependencies)
  FOR EACH dep IN story.dependencies:
    adjacency[dep].add(story.id)

queue = [id FOR id IN stories_map IF in_degree[id] == 0]
sorted_order = []

WHILE queue is not empty:
  node = queue.pop()
  sorted_order.append(node)
  FOR EACH neighbor IN adjacency[node]:
    in_degree[neighbor] -= 1
    IF in_degree[neighbor] == 0:
      queue.append(neighbor)

IF len(sorted_order) != len(stories_map):
  # Cycle detected — find and report it
  remaining = [id FOR id IN stories_map IF id NOT IN sorted_order]
  ERROR: "Circular dependency detected involving: {remaining}"
  Display cycle chain
  STOP

Display: "✅ No circular dependencies detected."

IF mode == "interactive":
  Display discovered dependencies graph
  ASK user: "Are these dependencies correct? [Yes / Edit / Cancel]"
  ON Edit: Allow user to modify dependencies, then re-validate
  ON Cancel: STOP
```

### Step 3: Group into Waves

Apply topological layering to group stories into parallel waves.

```
# Topological layering: assign each story to the earliest possible wave
wave_assignment = {}
max_wave = 0

FOR EACH story_id IN sorted_order:
  story = stories_map[story_id]

  IF story.dependencies is empty:
    wave_assignment[story_id] = 1
  ELSE:
    # Wave = max wave of dependencies + 1
    dep_waves = [wave_assignment[dep] FOR dep IN story.dependencies]
    wave_assignment[story_id] = max(dep_waves) + 1

  max_wave = max(max_wave, wave_assignment[story_id])

# Build wave groups
waves = {}
FOR wave_num IN 1..max_wave:
  waves[wave_num] = {
    stories: [id FOR id IN wave_assignment IF wave_assignment[id] == wave_num]
  }

Display:
  "🌊 Wave Structure ({max_wave} waves):"
  FOR EACH wave_num, wave IN waves:
    "  Wave {wave_num}: {wave.stories}"

IF mode == "interactive":
  ASK user: "Approve wave groupings? [Yes / Adjust / Cancel]"
  ON Adjust: Allow user to move stories between waves (respecting deps)
  ON Cancel: STOP
```

### Step 4: Assign Terminals

Assign terminal letters (A, B, C...) to stories within each wave.

```
terminal_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

FOR EACH wave_num, wave IN waves:
  FOR idx, story_id IN enumerate(wave.stories):
    wave.stories[idx] = {
      id: story_id,
      title: stories_map[story_id].title,
      file: stories_map[story_id].file,
      terminal: terminal_letters[idx],
      dependencies: stories_map[story_id].dependencies,
      complexity: stories_map[story_id].complexity
    }
```

### Step 5: Generate wave-map.yaml

Write the final wave-map YAML file.

```yaml
# wave-map.yaml — Generated by @pm *wave-map
# Epic: {epic_path}
# Generated: {ISO timestamp}

epic_path: {epic_path}
total_stories: {count}
total_waves: {max_wave}

waves:
  - number: 1
    name: "Wave 1"
    parallel: true
    stories:
      - id: "{story_id}"
        title: "{title}"
        file: "{file}"
        terminal: "A"
        dependencies: []
      - id: "{story_id}"
        title: "{title}"
        file: "{file}"
        terminal: "B"
        dependencies: []
    gate:
      agent: architect
      focus: "Cross-story integration review for Wave 1"
    terminal_prompts:
      A: "/AIOX:agents:dev {epic_path}/{file} --mode=yolo"
      B: "/AIOX:agents:dev {epic_path}/{file} --mode=yolo"

  - number: 2
    name: "Wave 2"
    parallel: true
    depends_on: [1]
    stories:
      - id: "{story_id}"
        title: "{title}"
        file: "{file}"
        terminal: "A"
        dependencies: ["{dep_id}"]
    gate:
      agent: architect
      focus: "Cross-story integration review for Wave 2"
    terminal_prompts:
      A: "/AIOX:agents:dev {epic_path}/{file} --mode=yolo"
```

```
Write wave_map_yaml to {output}

Display: "✅ wave-map.yaml generated at {output}"
```

### Step 6: Display Summary

Show the visual wave map and execution instructions.

```
Display:
  "========================================"
  "  📋 WAVE MAP — {epic_path}"
  "========================================"
  ""
  FOR EACH wave IN waves:
    "  🌊 Wave {wave.number} ({len(wave.stories)} stories, parallel)"
    "  ┌─────────────────────────────────────┐"
    FOR EACH story IN wave.stories:
      "  │ Terminal {story.terminal}: {story.id} — {story.title}"
    "  └─────────────────────────────────────┘"
    "  Gate: @architect reviews integration"
    ""
  "========================================"
  "  EXECUTION INSTRUCTIONS"
  "========================================"
  ""
  "  1. Open {terminals_per_wave} terminals per wave"
  "  2. In each terminal, run the corresponding prompt:"
  ""
  FOR EACH wave IN waves:
    "  Wave {wave.number}:"
    FOR EACH story IN wave.stories:
      "    Terminal {story.terminal}: /AIOX:agents:dev {story.file} --mode=yolo"
    ""
  "  3. Wait for all terminals in a wave to finish"
  "  4. Run wave gate review before proceeding to next wave"
  ""
  "  To execute via epic plan:"
  "    @pm *execute-epic {epic_path}/EPIC-EXECUTION.yaml --mode=interactive"
  ""
  "========================================"
```

---

## Output Format

The task produces:
- **wave-map.yaml** — Structured YAML file with waves, stories, gates, and terminal prompts
- **Visual summary** — ASCII wave map with execution instructions
- **Terminal prompts** — Ready-to-use `/AIOX:agents:dev` commands per terminal

---

## Related Commands

- `*execute-epic` - Execute the epic using the generated wave-map
- `*create-epic` - Create a new epic (prerequisite)
- `@sm *draft` - Create stories for the epic (prerequisite)
- `*waves` - Analyze wave structure of a workflow

---

## Agent Integration

This task is owned by:
- `@pm` (Morgan) - Primary wave map generator

This task is consumed by:
- `@pm` (Morgan) - Via `*execute-epic` for wave-based execution
- `@dev` (Dex) - Via terminal prompts for parallel development
- `@architect` (Aria) - Via wave gates for integration review

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-14 | Initial implementation — topological wave grouping with terminal assignment |
