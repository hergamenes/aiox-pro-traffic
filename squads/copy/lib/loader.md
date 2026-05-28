# Copy Squad - Atomic Component Loader

## Architecture Overview

The Copy Squad uses an **atomic architecture** where agent files are kept small (~300 lines) and components are loaded on-demand from external files.

## Directory Structure

```
squads/copy/
├── agents/           # Agent core files (~300 lines each)
├── frameworks/       # Framework definitions by agent
│   ├── kennedy/      # Dan Kennedy frameworks
│   ├── schwartz/     # Eugene Schwartz frameworks
│   ├── halbert/      # Gary Halbert frameworks
│   ├── bencivenga/   # Gary Bencivenga frameworks
│   ├── sugarman/     # Joe Sugarman frameworks
│   ├── makepeace/    # Clayton Makepeace frameworks
│   └── _shared/      # Shared frameworks (AIDA, PAS, etc.)
├── voice/            # Voice DNA files (*.yaml)
├── phrases/          # Signature phrases (*.yaml)
├── authority/        # Authority proof arsenals (*.yaml)
├── examples/         # Output examples by agent
├── tasks/            # Task workflows (existing)
├── templates/        # Templates (existing)
├── checklists/       # Checklists (existing)
└── data/             # Knowledge base (existing)
```

## Loading Protocol

### 1. Agent Activation

When activating an agent (e.g., `@dan-kennedy`):

```
1. Read the agent core file (agents/dan-kennedy.md)
2. Parse activation-instructions
3. Adopt persona from persona: block
4. DO NOT load frameworks yet - wait for commands
```

### 2. Command Execution

When user executes a command (e.g., `*sales-letter`):

```
1. Check the command in the agent's commands: block
2. Find the corresponding load: directive
3. Read the framework file (e.g., frameworks/kennedy/ultimate-sales-letter.yaml)
4. Apply the framework to the user's request
```

### 3. Voice Enrichment (Optional)

For deeper persona emulation:

```
1. Read voice/{agent}.yaml for communication patterns
2. Read phrases/{agent}.yaml for signature expressions
3. Read authority/{agent}.yaml for credibility elements
```

## File Formats

### Agent Core (Markdown with YAML)
```yaml
activation-instructions: [...]
agent: { name, id, title, icon, tier, era }
persona: { role, style, identity, focus, background }
core_principles: [...]
commands: [...]
dependencies:
  frameworks: [{ path, command, description }]
  voice: path/to/voice.yaml
  phrases: path/to/phrases.yaml
  authority: path/to/authority.yaml
```

### Framework (YAML)
```yaml
name: "Framework Name"
category: "strategic|copywriting|sales|etc"
origin: "Source attribution"
command: "*command-name"
philosophy: |
  Core philosophy description
# ... framework-specific content
```

### Voice DNA (YAML)
```yaml
sentence_starters: { context: [...] }
metaphors: { name: { phrase, usage, examples, power } }
vocabulary: { signature_words, power_phrases, never_use }
sentence_structure: { pattern_name: { pattern, function } }
behavioral_states: { state_name: { trigger, behavior, tone } }
```

### Signature Phrases (YAML)
```yaml
tier_1_core_mantras:
  - { phrase, context, usage }
tier_2_tactical_terminology:
  - { phrase, context, usage }
# ...
```

### Authority Proof (YAML)
```yaml
crucible_story: { context, crisis, turning_point, validation }
authority_statistics: { tier_1_results: [...], tier_2_influence: [...] }
proof_stack_templates: [...]
historical_context: { ... }
```

## Benefits of Atomic Architecture

1. **Faster Loading**: Agent core is ~300 lines vs 2,000+
2. **Reusability**: Frameworks can be shared across agents
3. **Maintainability**: Update framework once, all agents benefit
4. **Context Efficiency**: Only load what's needed for the task
5. **Testability**: Each component can be validated independently

## Migration Status

| Agent | Status | Original Lines | Current Lines | Reduction |
|-------|--------|----------------|---------------|-----------|
| dan-kennedy.md | COMPLETE | 2,796 | 314 | 89% |
| joe-sugarman.md | IN_PROGRESS | 2,326 | - | - |
| gary-halbert.md | IN_PROGRESS | 2,303 | - | - |
| gary-bencivenga.md | IN_PROGRESS | 2,278 | - | - |
| eugene-schwartz.md | IN_PROGRESS | 2,134 | - | - |
| clayton-makepeace.md | IN_PROGRESS | 2,064 | - | - |

## Usage Examples

### Activating Dan Kennedy
```
User: @dan-kennedy
Agent: [Reads agents/dan-kennedy.md, adopts persona, greets user]
```

### Using a Framework
```
User: *sales-letter
Agent: [Loads frameworks/kennedy/ultimate-sales-letter.yaml]
Agent: [Applies 29-step system to user's product/service]
```

### Deep Persona Mode
```
User: I want you to write exactly like Kennedy
Agent: [Loads voice/kennedy.yaml + phrases/kennedy.yaml]
Agent: [Applies signature vocabulary, sentence patterns, metaphors]
```

---

*Version: 1.0*
*Created: 2026-01-26*
*Architecture: Atomic Design for Copy Squad*
