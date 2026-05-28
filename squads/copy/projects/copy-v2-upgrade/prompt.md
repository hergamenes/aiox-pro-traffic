# Copy Framework v2.0 Upgrade - Swarm Execution Context

## Project Overview

**52 stories** to upgrade the Copy squad to Framework v2.0:
- 14 agent stories (create/update agents)
- 35 task upgrade stories (research + rewrite with 600+ lines)
- 3 config/documentation stories

## Critical Corrections (WILL CAUSE FAILURE IF WRONG)

| ❌ WRONG | ✅ CORRECT | Agent |
|----------|------------|-------|
| 4Ms | **3Ms** (Message-Market-Media) | Dan Kennedy |
| 31 triggers | **30 triggers** | Joe Sugarman |
| "student of Halbert" | **"partner of Halbert for 20 years"** | John Carlton |
| Clone | **Tool** | Joe Sugarman |

## Research-First Methodology

**EVERY task upgrade story (US-015 to US-049) must:**

1. **RESEARCH PHASE** (follow `squads/squad-creator/workflows/research-then-create-agent.md`):
   - Check local knowledge first (`outputs/minds/`, `docs/research/`)
   - Generate research prompt using 7-component framework
   - Execute WebSearch + WebFetch for gaps
   - Produce `docs/research/{topic}-methodology-research.md` (500+ lines)
   - Validate research quality (3+ primary sources, 4/6 scope coverage)

2. **REWRITE PHASE**:
   - Extract framework from research (principles, process, structure, criteria)
   - Rewrite task file (600+ lines minimum)
   - Include: Tier 0 diagnosis first, real examples, quality checklist

## Tier Structure

```
TIER 0 - FUNDAÇÃO (Always first)
├── Claude Hopkins     → Audit, scientific testing
├── Robert Collier     → "Enter the conversation"
└── Eugene Schwartz    → 5 Levels of Awareness

TIER 1 - DOCUMENTED MASTERS ($500M+)
├── Gary Bencivenga, Gary Halbert, Clayton Makepeace
├── Jim Rutz, Parris Lampropoulos, David Deutsch

TIER 2 - MODERN SYSTEMATIZERS
├── Dan Kennedy (3Ms), Todd Brown, Stefan Georgi, John Carlton

TIER 3 - FORMAT SPECIALISTS
├── Jon Benson, Ben Settle, Andre Chaperon, David Ogilvy

TOOL (not clone)
└── Joe Sugarman → 30 Triggers checklist
```

## Agent Golden Standard

Use `squads/copy/agents/dan-kennedy.md` (~1565 lines). Required sections:

```yaml
agent: name, id, title, icon, tier, era, whenToUse, customization
persona: role, style, identity, focus, background
core_principles: [5-10]
commands: [10-20]
operational_frameworks: [3-10 detailed]
communication_dna: vocabulary_mandatory, vocabulary_forbidden, rhetorical_devices
signature_phrases: tier_1_core_mantras, tier_2_tactical_terminology, tier_3_executable_formulas
authority_proof_arsenal: crucible_story, authority_statistics
objection_algorithms: [2-5]
dependencies: [related files]
knowledge_areas: [10-15]
```

## Minimum Line Requirements

| Type | Minimum |
|------|---------|
| Research doc | 500 lines |
| Task file | 600 lines |
| Tier 0 agent | 800 lines |
| Tier 1-3 agent | 1000 lines |

## Execution Phases

### PHASE 1: PARALLEL (49 stories)
US-001 to US-049 - all touch different files, max parallelism.

### PHASE 2: SERIAL (3 stories)
US-050 → US-051 → US-052 - depend on Phase 1 completion.

## Validation Checklist

Before marking any story complete:
- [ ] Research doc >= 500 lines (task upgrades)
- [ ] Task file >= 600 lines (task upgrades)
- [ ] Agent file >= minimum lines for tier
- [ ] YAML syntax valid
- [ ] All required sections present
- [ ] Primary sources >= 3 (research)
- [ ] Critical corrections verified (3Ms, 30 triggers, partner)

## PRD Location
`squads/copy/projects/copy-v2-upgrade/prd.json`

## Progress Location
`squads/copy/projects/copy-v2-upgrade/progress.txt`

## Key Reference Files

| File | Purpose |
|------|---------|
| `agents/dan-kennedy.md` | Golden standard agent template |
| `squads/squad-creator/workflows/research-then-create-agent.md` | Research workflow |
| `squads/squad-creator/tasks/deep-research-pre-agent.md` | Research task details |
| `squads/squad-creator/checklists/deep-research-quality.md` | Research validation |
| `docs/framework/*.md` | v2.0 framework specifications |
| `projects/copy-v2-upgrade/local-sources-map.yaml` | **LOCAL SOURCES - CHECK FIRST** |

---

## LOCAL SOURCES - MANDATORY CHECK FIRST

**CRITICAL:** Before any web research, workers MUST check local sources.

### Copywriters WITH Local Sources

| Copywriter | Path | Key Files |
|------------|------|-----------|
| **Alex Hormozi** ⭐ | `outputs/minds/alex_hormozi/sources/` | **4 livros + 24 playbooks + programs** (GOLD for offers/funnels/ads) |
| **Dan Kennedy** | `outputs/minds/dan_kennedy/sources/books/` | 14 livros (Ultimate Marketing Plan, No B.S. series) |
| **Eugene Schwartz** | `outputs/minds/eugene_schwartz/sources/books/` | Breakthrough Advertising (PRIMARY) |
| **Gary Halbert** | `outputs/minds/gary_halbert/sources/` | Boron Letters + 90+ swipe files |
| **Claude Hopkins** | `outputs/minds/claude_hopkins/sources/obsidian/` | 7 módulos de análise |
| **Jon Benson** | `outputs/minds/jon_benson/sources/` | VSL methodology |
| **David Deutsch** | `outputs/minds/david_deutsch/sources/obsidian/` | Analysis files |

### Alex Hormozi Sources (MASSIVE LIBRARY)

**Books:** `outputs/minds/alex_hormozi/sources/01 Livros/`
- Livro 100M Ofertas → US-023 (create-offer)
- Livro 100M Leads → US-019 (lead-magnet)
- Livro 100m Modelos → upsells, downsells, funnels

**Playbooks:** `outputs/minds/alex_hormozi/sources/02 Playbooks/`
- Ads/$100M Goated Ads Playbook.pdf → US-033 (ad-copy)
- Hooks/$100M Hooks Playbook.pdf → US-026 (video-hook)
- Pricing/$100M Pricing Playbook.pdf → US-023 (create-offer)
- Fechamento/$100M Closing Playbook.pdf → US-037 (close-script)
- Lead Nurture/$100M Lead Nurture Playbook.pdf → US-016 (email-sequence)
- Retention/$100M Retention Playbook.pdf → US-031 (abandoned-cart)
- Prova/$100M Proof Checklist Playbook.pdf → US-043 (authority-arsenal)

**Programs:** `outputs/minds/alex_hormozi/sources/03 Programas/`
- 100M Models/ → 30 lessons on offer models
- (Blueprint) $100M Money Models/ → Scripts, VSLs, landing pages

### Research Priority Order

```
1. LOCAL FIRST: outputs/minds/{slug}/sources/
2. EXISTING RESEARCH: docs/research/{slug}-*.md
3. ANALYSIS: outputs/minds/{slug}/analysis/
4. WEB RESEARCH: Only for gaps not covered locally
```

### Task-Specific Source Mapping

**US-015 (create-sales-page):**
- PRIMARY: `outputs/minds/gary_halbert/sources/books/The Boron Letters.pdf`
- PRIMARY: `outputs/minds/eugene_schwartz/sources/books/Breakthrough Advertising.pdf`
- SWIPE: `outputs/minds/gary_halbert/sources/swipe/PDF/` (all 90+ letters)

**US-017 (create-headlines):**
- PRIMARY: `outputs/minds/eugene_schwartz/sources/books/Breakthrough Advertising.pdf`
- EXAMPLES: `outputs/minds/gary_halbert/sources/swipe/PDF/`

**US-022 (vsl-script):**
- PRIMARY: `outputs/minds/jon_benson/sources/`

**US-023 (create-offer):**
- PRIMARY: `outputs/minds/dan_kennedy/sources/books/No B.S. Price Strategy.pdf`

See `local-sources-map.yaml` for complete mapping.
