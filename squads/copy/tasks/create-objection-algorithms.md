---
task: Create Objection Algorithms - Copywriter Response Patterns
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Strategy
Entrada: |
  - briefing e objetivo comercial
  - contexto de oferta, avatar, canal e provas disponíveis
  - restrições, assets e referências existentes
Saída: |
  - entregável definido por esta task, alinhado ao framework descrito no corpo
  - premissas, lacunas de contexto e próximos passos quando houver
Checklist:
  - [ ] Confirmou inputs mínimos antes de executar
  - [ ] Seguiu o framework e a ordem descritos na task
  - [ ] Registrou entregável, premissas e bloqueios sem inventar contexto
Domain: Operational
pre_condition: |
  - briefing, oferta, canal e contexto mínimo carregados
  - restrições e assets necessários confirmados antes da execução
post_condition: |
  - entregável principal registrado com critérios de revisão e próximo passo explícito
  - handoff, bloqueio ou decisão comercial documentados quando aplicável
performance: |
  - sla_target: "PT24H"
  - error_handling: "registrar bloqueio, atualizar handoff e escalar para @copy-chief"
---

# Create Objection Algorithms - Copywriter Response Patterns

## Metadata
```yaml
task_id: create-objection-algorithms
version: 2.0.0
category: agent-creation
difficulty: advanced
elicit: true
parent_task: create-copywriter-agent.md
phase: 6
last_updated: 2026-01-23

theoretical_foundation:
  primary_models:
    - LAER Model (Listen-Acknowledge-Explore-Respond)
    - Feel-Felt-Found Empathy Framework
    - Kennedy Objection Neutralization
    - Schwartz Mass Desire Channeling
  psychological_basis:
    - Objection Iceberg Model (10% visible, 90% hidden)
    - Cognitive Dissonance Resolution
    - Self-Image Protection Theory
    - Fear-Belief-Identity Stack
  master_approaches:
    - Bencivenga "Reason Why" Method
    - Halbert "Starving Crowd" Reframe
    - Sugarman Logical Progression
    - Hopkins Scientific Evidence

dependencies:
  tasks:
    - tasks/extract-frameworks.md
    - tasks/extract-signature-phrases.md
    - tasks/extract-communication-dna.md
  templates:
    - templates/objection-algorithms-tmpl.yaml
  research:
    - docs/research/objection-algorithms-methodology-research.md

inputs:
  required:
    - source_directory: "Path to source materials"
    - frameworks_file: "outputs/minds/{slug}/analysis/frameworks.yaml"
    - signature_phrases_file: "outputs/minds/{slug}/analysis/signature-phrases.yaml"
  recommended:
    - communication_dna_file: "outputs/minds/{slug}/analysis/communication-dna.yaml"
    - authority_arsenal_file: "outputs/minds/{slug}/analysis/authority-arsenal.yaml"

outputs:
  primary:
    - Objection algorithms file: "outputs/minds/{slug}/analysis/objection-algorithms.yaml"
  specifications:
    - 5 complete objection response algorithms
    - Each algorithm with 5 steps and 2-3 script variations
    - Full example response for each algorithm
    - Voice authenticity validation report

quality_standards:
  minimum_lines: 600
  algorithms_count: 5
  steps_per_algorithm: 5
  scripts_per_step: 2-3
  voice_authenticity_score: "20+ out of 25"
  distinctiveness_rating: "High for all algorithms"
```

---

## Executive Summary

### Purpose

Create 5 systematic objection-handling algorithms that embody the copywriter's unique voice, frameworks, and philosophy. These algorithms enable the AI agent to respond to common objections authentically, using the copywriter's vocabulary, signature phrases, and proven frameworks.

### The Psychology of Objections

Objections are not rejections—they are requests for more information disguised as resistance:

```
Surface Level: "I don't have time"
            ↓
Fear Level: "I'm afraid I'll fail"
            ↓
Belief Level: "I don't believe I'm capable"
            ↓
Identity Level: "This isn't who I am"
```

Understanding this psychology transforms our approach: we don't argue against objections—we resolve the underlying fear, belief, and identity questions.

### Why Voice Integration Matters

Generic objection handling fails because:
- It sounds like every other AI response
- It doesn't leverage the copywriter's proven frameworks
- It misses their unique perspective on common concerns
- It lacks the vocabulary that their audience trusts

Authentic objection handling requires:
- The copywriter's specific word choices
- Their frameworks applied correctly
- Their signature phrases naturally integrated
- Their philosophy consistently expressed

### Theoretical Foundation

This task synthesizes multiple proven frameworks:

| Framework | Application |
|-----------|-------------|
| **LAER Model** | Core structure: Listen, Acknowledge, Explore, Respond |
| **Feel-Felt-Found** | Empathy pattern for acknowledgment |
| **Kennedy Neutralization** | Isolation and reversal technique |
| **Schwartz Channeling** | Reframe desire behind objection |
| **Bencivenga Reason Why** | Evidence that makes objections dissolve |
| **Halbert Starving Crowd** | Future cost visualization |

---

## PREREQUISITES

### Required Inputs

Before starting this task, ensure you have:

| Input | File Location | Purpose |
|-------|---------------|---------|
| Frameworks | `outputs/minds/{slug}/analysis/frameworks.yaml` | For reframe references |
| Signature Phrases | `outputs/minds/{slug}/analysis/signature-phrases.yaml` | For voice markers |
| Communication DNA | `outputs/minds/{slug}/analysis/communication-dna.yaml` | For vocabulary/tone |
| Authority Arsenal | `outputs/minds/{slug}/analysis/authority-arsenal.yaml` | For evidence types |
| Source Materials | `outputs/minds/{slug}/sources/` | For objection mining |

### Input Elicitation

```
elicit: true
question: "Please confirm the following files are available:"
fields:
  - copywriter_name: "Copywriter full name"
  - slug: "Mind slug (snake_case)"
  - frameworks_path: "Path to frameworks.yaml"
  - phrases_path: "Path to signature-phrases.yaml"
  - dna_path: "Path to communication-dna.yaml (optional)"
  - arsenal_path: "Path to authority-arsenal.yaml (optional)"
```

### Quality Gate: Prerequisites

```yaml
gate: prerequisites
checks:
  mandatory:
    - frameworks_file_exists: "frameworks.yaml exists with 10+ frameworks"
    - phrases_file_exists: "signature-phrases.yaml exists with 42+ phrases"
    - source_access: "Access to source materials directory"
    - template_available: "templates/objection-algorithms-tmpl.yaml exists"
  quality:
    - framework_quality: "Frameworks have complete structure"
    - phrase_categorization: "Phrases are categorized by type"
    - source_volume: "Minimum 20 source files available"
```

---

## PHASE 1: OBJECTION MINING

### Objective

Discover how the copywriter's specific audience expresses objections and how the copywriter typically responds. This is NOT generic objection research—it's mining their specific materials.

### Step 1.1: The Objection Iceberg

Understanding what objections really represent:

```
                    ┌──────────────────┐
        Visible:    │  Stated objection │ ← What they say (10%)
                    └──────────────────┘
        ═══════════════════════════════════════════════════════
                    ┌──────────────────────────────────────┐
                    │   Fear of failure                    │
                    │   Fear of embarrassment              │
                    │   Uncertainty about ROI              │ ← What they mean (90%)
                    │   Past negative experiences          │
                    │   Peer/family skepticism             │
                    │   Identity conflict                  │
                    └──────────────────────────────────────┘
```

When mining objections, look for BOTH the surface statement AND indicators of the deeper concern.

### Step 1.2: Source Material Analysis

Read ALL source files systematically. Flag content that contains:

**Direct Objections Addressed:**
- When copywriter explicitly responds to "but what about..."
- FAQ sections and Q&A content
- Comment responses and audience interactions
- Sales page objection-handling sections

**Search Patterns for Mining:**
```
Pattern Set 1 - Direct Objection Signals:
- "But..." followed by response
- "You might be thinking..."
- "The objection I hear most..."
- "People often say..."
- "The problem is..."
- "Here's what people get wrong..."

Pattern Set 2 - Preemptive Handling:
- "Before you think..."
- "I know what you're thinking..."
- "Let me address..."
- "The common mistake is..."
- "What you're probably wondering..."

Pattern Set 3 - Audience Pain Points:
- "The struggle is..."
- "What holds people back..."
- "The reason most people fail..."
- "The fear is..."
- "What stops [audience] from..."

Pattern Set 4 - Response Patterns:
- "Here's the truth..."
- "What I've learned is..."
- "The reality is..."
- "Here's what most people don't understand..."
```

### Step 1.3: The Five Universal Categories

All objections fall into 5 universal categories. Document which specific expressions you find in the source materials for each:

**Category 1: Time/Resource Scarcity**
```yaml
category: time_resource_scarcity
surface_expressions:
  - "I don't have time"
  - "I'm too busy right now"
  - "Maybe later when things calm down"
  - "I can't afford it"
  - "I need to save my money"

hidden_psychology:
  - Fear of additional burden
  - Protecting current lifestyle
  - Prioritization uncertainty
  - Resource allocation anxiety
  - Scarcity mindset

triggers_found_in_sources:
  - "[Specific phrase from source 1]"
  - "[Specific phrase from source 2]"
  # Document actual phrases from materials

copywriter_response_pattern:
  observed_in: "[Source file name]"
  approach: "[How they typically respond]"
  tone: "[Their characteristic tone]"
```

**Category 2: Competence/Expertise Doubt**
```yaml
category: competence_doubt
surface_expressions:
  - "I don't know enough"
  - "I'm not qualified"
  - "Who am I to teach this?"
  - "I need more experience"
  - "I don't have credentials"

hidden_psychology:
  - Imposter syndrome
  - Perfectionism
  - Fear of public failure
  - Comparison to experts
  - Identity uncertainty

triggers_found_in_sources:
  - "[Specific phrase from source 1]"
  - "[Specific phrase from source 2]"

copywriter_response_pattern:
  observed_in: "[Source file name]"
  approach: "[How they typically respond]"
  tone: "[Their characteristic tone]"
```

**Category 3: Market/Competition Saturation**
```yaml
category: market_saturation
surface_expressions:
  - "The market is too crowded"
  - "There are too many competitors"
  - "It's already been done"
  - "I'm too late to the game"
  - "The niche is saturated"

hidden_psychology:
  - Differentiation uncertainty
  - Fear of being invisible
  - Comparison despair
  - Zero-sum thinking
  - Timing anxiety

triggers_found_in_sources:
  - "[Specific phrase from source 1]"
  - "[Specific phrase from source 2]"

copywriter_response_pattern:
  observed_in: "[Source file name]"
  approach: "[How they typically respond]"
  tone: "[Their characteristic tone]"
```

**Category 4: Credibility/Authority Concern**
```yaml
category: credibility_concern
surface_expressions:
  - "I'm not famous enough"
  - "I don't have a following"
  - "No one knows who I am"
  - "I need more credentials"
  - "Why would anyone listen to me?"

hidden_psychology:
  - Authority confusion
  - Credibility misunderstanding
  - Platform dependency thinking
  - Celebrity comparison
  - Permission seeking

triggers_found_in_sources:
  - "[Specific phrase from source 1]"
  - "[Specific phrase from source 2]"

copywriter_response_pattern:
  observed_in: "[Source file name]"
  approach: "[How they typically respond]"
  tone: "[Their characteristic tone]"
```

**Category 5: Audience/Distribution Challenge**
```yaml
category: audience_building
surface_expressions:
  - "I don't have an audience"
  - "How do I get followers?"
  - "I need a platform first"
  - "No one sees my content"
  - "The algorithm doesn't favor me"

hidden_psychology:
  - Chicken-egg confusion
  - Distribution dependency
  - Visibility anxiety
  - Platform overwhelm
  - Audience building misconceptions

triggers_found_in_sources:
  - "[Specific phrase from source 1]"
  - "[Specific phrase from source 2]"

copywriter_response_pattern:
  observed_in: "[Source file name]"
  approach: "[How they typically respond]"
  tone: "[Their characteristic tone]"
```

### Step 1.4: Document Copywriter's Natural Patterns

As you mine, document the copywriter's NATURAL objection-handling style:

```yaml
copywriter_objection_style:
  acknowledgment_style:
    typical_opening: "[How they usually open]"
    empathy_language: "[Specific phrases they use]"
    validation_approach: "[Do they validate emotions? Logic? Both?]"

  reframe_style:
    preferred_technique: "[Perspective shift? Future cost? Authority reversal?]"
    signature_moves: "[Unique ways they reframe]"
    framework_usage: "[How they integrate their frameworks]"

  evidence_style:
    preferred_types: "[Personal story? Data? Social proof?]"
    specificity_level: "[Very specific? Conceptual?]"
    source_references: "[Do they cite? Name drop? Use statistics?]"

  action_style:
    cta_approach: "[Direct? Soft? Question-based?]"
    commitment_size: "[Small steps? Bold moves?]"
    follow_up: "[What do they suggest next?]"
```

### Quality Gate: Objection Mining

```yaml
gate: objection_mining
checks:
  mandatory:
    - source_coverage: "Read minimum 20 source files"
    - category_coverage: "Identified objections in all 5 categories"
    - trigger_documentation: "Documented specific triggers from sources"
    - pattern_documentation: "Noted copywriter's response patterns"
  quality:
    - objections_authentic: "All objections sourced from actual materials"
    - patterns_specific: "Patterns include specific examples, not generic"
    - categories_balanced: "Each category has 3+ unique triggers"
```

---

## PHASE 2: FRAMEWORK MAPPING

### Objective

Map the copywriter's extracted frameworks to each objection category, ensuring that reframes use their proven intellectual property.

### Step 2.1: Load Extracted Frameworks

Read the frameworks file: `outputs/minds/{slug}/analysis/frameworks.yaml`

Create a framework inventory:

```yaml
framework_inventory:
  total_frameworks: [count]
  frameworks:
    1:
      name: "[Framework 1 name]"
      core_principle: "[One sentence summary]"
      best_for: "[What objections it addresses]"
    2:
      name: "[Framework 2 name]"
      core_principle: "[One sentence summary]"
      best_for: "[What objections it addresses]"
    # ... continue for all frameworks
```

### Step 2.2: Map Frameworks to Objections

For each objection category, identify the best-fit frameworks:

**Mapping Matrix:**

| Objection Category | Primary Framework | Secondary Framework | Tertiary Framework |
|--------------------|-------------------|---------------------|--------------------|
| Time/Resource Scarcity | [Name] - addresses [why] | [Name] - addresses [why] | [Name] - backup |
| Competence Doubt | [Name] - addresses [why] | [Name] - addresses [why] | [Name] - backup |
| Market Saturation | [Name] - addresses [why] | [Name] - addresses [why] | [Name] - backup |
| Credibility Concern | [Name] - addresses [why] | [Name] - addresses [why] | [Name] - backup |
| Audience Building | [Name] - addresses [why] | [Name] - addresses [why] | [Name] - backup |

**Selection Criteria:**
```yaml
framework_selection_criteria:
  primary_fit:
    - directly_addresses: "Framework tackles the underlying belief"
    - actionable_solution: "Provides clear path forward"
    - memorable_quotable: "Easy to reference and remember"

  application_notes:
    - principle_extraction: "Pull core principle for reframe"
    - key_components: "Identify which parts to reference"
    - example_usage: "Find example from copywriter's application"
```

### Step 2.3: Extract Framework Principles for Responses

For each mapped framework, extract the specific elements needed for objection responses:

```yaml
framework_application_guide:
  framework_name: "[Name]"
  objection_category: "[Category it maps to]"

  core_principle:
    statement: "[One sentence principle]"
    application: "[How to apply to this objection]"

  key_components:
    - component_1: "[Specific element to reference]"
    - component_2: "[Specific element to reference]"

  vocabulary:
    - "[Term unique to this framework]"
    - "[Term unique to this framework]"

  example_from_source:
    source_file: "[Where copywriter used this]"
    context: "[How they applied it]"
    quote: "[Actual quote if available]"
```

### Quality Gate: Framework Mapping

```yaml
gate: framework_mapping
checks:
  mandatory:
    - complete_mapping: "All 5 categories have primary framework"
    - logical_fit: "Framework selections make sense"
    - principle_extraction: "Core principles extracted for use"
  quality:
    - secondary_mapped: "All categories have secondary framework"
    - application_clear: "Application guides are specific"
    - vocabulary_documented: "Framework vocabulary listed"
```

---

## PHASE 3: PHRASE SELECTION

### Objective

Select and map signature phrases to objection categories for authentic voice integration.

### Step 3.1: Load Signature Phrases

Read the phrases file: `outputs/minds/{slug}/analysis/signature-phrases.yaml`

Create phrase categories relevant to objection handling:

```yaml
phrase_categories:
  validation_phrases:
    purpose: "For ACKNOWLEDGE step"
    phrases:
      - "[Phrase for showing empathy]"
      - "[Phrase for validation]"

  reframe_phrases:
    purpose: "For REFRAME step"
    phrases:
      - "[Phrase that shifts perspective]"
      - "[Phrase that challenges belief]"

  evidence_phrases:
    purpose: "For EVIDENCE step"
    phrases:
      - "[Phrase introducing proof]"
      - "[Phrase for social validation]"

  vision_phrases:
    purpose: "For VISION step"
    phrases:
      - "[Phrase about future possibility]"
      - "[Phrase about transformation]"

  action_phrases:
    purpose: "For ACTION step"
    phrases:
      - "[CTA phrase]"
      - "[Commitment phrase]"
```

### Step 3.2: Map Phrases to Objection Categories

For each objection category, select 3-5 signature phrases that:
- Directly address the objection type
- Fit naturally in conversation
- Enhance rather than disrupt flow

**Phrase Mapping Template:**

```yaml
objection_phrase_map:
  time_scarcity:
    key_phrases:
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"

  competence_doubt:
    key_phrases:
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"

  market_saturation:
    key_phrases:
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"

  credibility_concern:
    key_phrases:
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"

  audience_building:
    key_phrases:
      - phrase: "[Exact phrase]"
        insertion_point: "[Which step]"
        context: "[How to use naturally]"
```

### Step 3.3: Natural Integration Planning

For each selected phrase, plan natural integration:

```yaml
phrase_integration_guide:
  phrase: "[Exact signature phrase]"
  original_context: "[Where/how copywriter originally used it]"
  objection_application: "[How to adapt for objection handling]"
  insertion_technique: "[How to introduce naturally]"
  avoid: "[How NOT to use it - forced/awkward examples]"
```

### Quality Gate: Phrase Selection

```yaml
gate: phrase_selection
checks:
  mandatory:
    - phrase_count: "3-5 phrases per objection category"
    - relevance: "Phrases genuinely relevant to objections"
    - context_documented: "Original context noted"
  quality:
    - natural_fit: "Integration points feel natural"
    - variety: "Mix of phrase types (validation, reframe, action)"
    - authenticity: "Phrases are actual copywriter phrases"
```

---

## PHASE 4: ALGORITHM CONSTRUCTION

### The 5-Step Algorithm Structure

Every objection algorithm follows this proven structure:

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: ACKNOWLEDGE                                         │
│ Purpose: Validate concern without agreeing with belief      │
│ Psychology: Meet them where they are                        │
├─────────────────────────────────────────────────────────────┤
│ STEP 2: REFRAME                                             │
│ Purpose: Shift perspective using copywriter's philosophy    │
│ Psychology: Introduce new way of seeing                     │
├─────────────────────────────────────────────────────────────┤
│ STEP 3: EVIDENCE                                            │
│ Purpose: Prove the reframe with specific examples           │
│ Psychology: Make new belief credible                        │
├─────────────────────────────────────────────────────────────┤
│ STEP 4: VISION                                              │
│ Purpose: Paint positive future if they move past objection  │
│ Psychology: Create emotional pull toward action             │
├─────────────────────────────────────────────────────────────┤
│ STEP 5: ACTION                                              │
│ Purpose: Propose specific, achievable next step             │
│ Psychology: Convert belief shift into momentum              │
└─────────────────────────────────────────────────────────────┘
```

### Algorithm Template

```yaml
algorithm_name:
  name: "[Descriptive Name]"
  category: "[time_scarcity|competence_doubt|market_saturation|credibility_concern|audience_building]"

  trigger:
    description: "When the prospect/reader says something like..."
    examples:
      - "[Specific trigger phrase 1]"
      - "[Specific trigger phrase 2]"
      - "[Specific trigger phrase 3]"
    hidden_concern: "[What they're really worried about]"

  algorithm:
    step_1_acknowledge:
      name: "ACKNOWLEDGE"
      purpose: "Validate their concern without agreeing with the limiting belief"
      psychological_goal: "Show empathy and understanding"
      voice_notes: "[How copywriter typically acknowledges]"
      scripts:
        variation_1:
          text: "[Full script option 1]"
          when_to_use: "[Context for this variation]"
        variation_2:
          text: "[Full script option 2]"
          when_to_use: "[Context for this variation]"
        variation_3:
          text: "[Full script option 3]"
          when_to_use: "[Context for this variation]"

    step_2_reframe:
      name: "REFRAME"
      purpose: "Shift perspective using copywriter's philosophy"
      psychological_goal: "Challenge limiting belief"
      framework_reference: "[Framework name]"
      reframe_technique: "[perspective_shift|future_cost|authority_reversal|minimum_viable]"
      voice_notes: "[How copywriter typically reframes]"
      scripts:
        variation_1:
          text: "[Full script option 1]"
          framework_application: "[How framework is applied]"
        variation_2:
          text: "[Full script option 2]"
          framework_application: "[How framework is applied]"

    step_3_evidence:
      name: "EVIDENCE"
      purpose: "Provide proof supporting the reframe"
      psychological_goal: "Make new belief credible"
      evidence_types:
        - type: "[personal|data|social_proof|third_party]"
          content: "[Specific evidence]"
      voice_notes: "[How copywriter typically provides proof]"
      scripts:
        variation_1:
          text: "[Full script with evidence]"
        variation_2:
          text: "[Alternative evidence script]"

    step_4_vision:
      name: "VISION"
      purpose: "Paint positive future if they move past objection"
      psychological_goal: "Create emotional pull"
      signature_phrases:
        - "[Phrase to integrate]"
        - "[Phrase to integrate]"
      voice_notes: "[How copywriter paints vision]"
      scripts:
        variation_1:
          text: "[Full vision script]"
        variation_2:
          text: "[Alternative vision script]"

    step_5_action:
      name: "ACTION"
      purpose: "Propose specific next step"
      psychological_goal: "Convert belief into momentum"
      commitment_size: "[small|medium|bold]"
      voice_notes: "[How copywriter typically calls to action]"
      scripts:
        variation_1:
          text: "[Full action script]"
          specific_action: "[What they should do]"
        variation_2:
          text: "[Alternative action script]"
          specific_action: "[What they should do]"

  resolution: "[Expected outcome when algorithm is applied]"

  key_phrases_used:
    - "[Signature phrase 1]"
    - "[Signature phrase 2]"
    - "[Signature phrase 3]"

  framework_references:
    primary: "[Framework name]"
    secondary: "[Framework name if used]"

  full_example:
    context: "[Situation this example applies to]"
    response: |
      [Complete example response using all 5 steps]
      [Should be 150-250 words]
      [Must sound authentically like the copywriter]
      [Must integrate frameworks and phrases naturally]

  voice_authenticity_notes:
    vocabulary: "[Specific words used that are theirs]"
    avoided: "[Words deliberately avoided]"
    tone: "[Tone characteristics]"
```

### Step 4.1: Algorithm 1 - Time/Resource Scarcity

**Trigger Focus:** "I don't have time / money / resources"

**Algorithm Design Notes:**
```yaml
design_notes:
  reframe_angle: "Time as investment, not expense"
  framework_application: "[Framework] shows how small investments compound"
  evidence_focus: "People who succeeded despite time constraints"
  vision_focus: "The freedom that comes from taking action now"
  action_focus: "Smallest possible first step"

  key_psychology:
    - "Time scarcity is usually priority confusion"
    - "Resource scarcity often masks fear of commitment"
    - "The cost of inaction exceeds the cost of action"
```

**Complete Algorithm 1 using template above.**

### Step 4.2: Algorithm 2 - Competence/Expertise Doubt

**Trigger Focus:** "I don't know enough / I'm not qualified"

**Algorithm Design Notes:**
```yaml
design_notes:
  reframe_angle: "Expertise as experience + curiosity, not credentials"
  framework_application: "[Framework] shows teaching = learning"
  evidence_focus: "People who started without traditional qualifications"
  vision_focus: "The impact they'll have by sharing their journey"
  action_focus: "First piece of content about their current level"

  key_psychology:
    - "Imposter syndrome affects everyone, even experts"
    - "Being a few steps ahead is more relatable than mastery"
    - "Competence comes from doing, not preparing to do"
```

**Complete Algorithm 2 using template above.**

### Step 4.3: Algorithm 3 - Market Saturation

**Trigger Focus:** "Too crowded / Too much competition / Already done"

**Algorithm Design Notes:**
```yaml
design_notes:
  reframe_angle: "Competition as validation, not barrier"
  framework_application: "[Framework] shows differentiation through voice"
  evidence_focus: "Late entrants who succeeded through unique angle"
  vision_focus: "The specific audience waiting for THEIR specific message"
  action_focus: "Identify what makes their perspective unique"

  key_psychology:
    - "Competition proves demand exists"
    - "Saturation only exists at the generic level"
    - "Your specific audience needs your specific message"
```

**Complete Algorithm 3 using template above.**

### Step 4.4: Algorithm 4 - Credibility/Authority Concern

**Trigger Focus:** "Not famous enough / No credentials / Why would anyone listen"

**Algorithm Design Notes:**
```yaml
design_notes:
  reframe_angle: "Results and relatability over credentials"
  framework_application: "[Framework] shows proof hierarchy"
  evidence_focus: "How authority is built through action"
  vision_focus: "The authority they'll have after taking action"
  action_focus: "Create first piece of authority-building content"

  key_psychology:
    - "Credibility is built, not granted"
    - "Relatability often beats expertise"
    - "Authority comes from taking authority"
```

**Complete Algorithm 4 using template above.**

### Step 4.5: Algorithm 5 - Audience/Distribution Challenge

**Trigger Focus:** "No followers / Need audience first / How to get noticed"

**Algorithm Design Notes:**
```yaml
design_notes:
  reframe_angle: "Value attracts audience, not the reverse"
  framework_application: "[Framework] shows content-first philosophy"
  evidence_focus: "How audiences built through consistent value"
  vision_focus: "The community that will form around their value"
  action_focus: "Create first piece of valuable content"

  key_psychology:
    - "Audience is attracted to value, not chased"
    - "100 true fans beats 10,000 casual followers"
    - "Serving before seeking creates loyal audiences"
```

**Complete Algorithm 5 using template above.**

### Quality Gate: Algorithm Construction

```yaml
gate: algorithm_construction
checks:
  mandatory:
    - all_algorithms_complete: "5 algorithms fully constructed"
    - all_steps_present: "Each algorithm has all 5 steps"
    - scripts_complete: "2-3 script variations per step"
    - full_examples_written: "Each algorithm has full example"
  quality:
    - triggers_specific: "3+ trigger examples from sources"
    - frameworks_valid: "Framework references exist in frameworks.yaml"
    - phrases_valid: "Signature phrases exist in phrases file"
    - voice_consistent: "Scripts sound like copywriter"
```

---

## PHASE 5: VOICE AUTHENTICITY VALIDATION

### Objective

Verify that every algorithm response sounds authentically like the copywriter, not like generic AI output.

### Step 5.1: Voice Consistency Scoring

For each algorithm, score across 5 dimensions:

**Scoring Matrix:**

| Dimension | Definition | Score (1-5) |
|-----------|------------|-------------|
| **Vocabulary** | Uses their specific words, avoids words they'd never use | |
| **Frameworks** | Correctly references and applies their frameworks | |
| **Phrases** | Natural integration of their signature phrases | |
| **Tone** | Matches their energy, style, and approach | |
| **Philosophy** | Aligns with their core beliefs and worldview | |

**Scoring Guide:**

```yaml
scoring_criteria:
  vocabulary:
    5: "Uses 5+ unique vocabulary markers, avoids all forbidden words"
    4: "Uses 3-4 markers, mostly avoids forbidden words"
    3: "Uses 1-2 markers, some generic language"
    2: "Mostly generic language, few voice markers"
    1: "Completely generic, could be anyone"

  frameworks:
    5: "Framework correctly named, principles accurately applied, vocabulary used"
    4: "Framework referenced correctly, principles mostly accurate"
    3: "Framework mentioned but application is shallow"
    2: "Framework reference feels forced or inaccurate"
    1: "No framework reference or completely wrong"

  phrases:
    5: "3+ phrases integrated naturally, enhance the response"
    4: "2 phrases integrated well, feel natural"
    3: "1 phrase integrated, slightly awkward"
    2: "Phrases feel forced or misused"
    1: "No signature phrases or completely wrong usage"

  tone:
    5: "Unmistakably matches their energy and style"
    4: "Mostly matches, occasional generic moments"
    3: "Sometimes sounds like them, sometimes not"
    2: "Mostly generic with hints of their style"
    1: "Could be any generic AI response"

  philosophy:
    5: "Perfectly aligns with their worldview, beliefs present"
    4: "Mostly aligned, minor inconsistencies"
    3: "Generally aligned but missing key beliefs"
    2: "Some alignment but contradictions present"
    1: "Contradicts their known positions"
```

**Passing Score:** 20+ out of 25 (average 4+ per dimension)

### Step 5.2: Distinctiveness Test

**Test Question:** Could this response come from a generic AI or does it clearly reflect this specific copywriter?

**Rating Scale:**
```yaml
distinctiveness_ratings:
  high:
    definition: "Unmistakably this copywriter"
    indicators:
      - "Unique vocabulary appears naturally"
      - "Framework application is precise"
      - "Signature phrases enhance message"
      - "Philosophy is evident throughout"
    action: "Pass - algorithm ready"

  medium:
    definition: "Could be identified with context"
    indicators:
      - "Some unique elements present"
      - "Generic moments break immersion"
      - "Framework reference feels surface-level"
    action: "Revise - strengthen voice elements"

  low:
    definition: "Too generic, needs revision"
    indicators:
      - "Could be any AI response"
      - "No distinguishing characteristics"
      - "Framework/phrases missing or forced"
    action: "Rewrite - start from copywriter's actual responses"
```

**Target:** All algorithms must rate "High"

### Step 5.3: Framework Integration Verification

For each framework reference in each algorithm:

```yaml
framework_verification:
  algorithm: "[Algorithm name]"
  framework_referenced: "[Framework name]"
  verification:
    - exists_check: "Framework exists in frameworks.yaml: [Yes/No]"
    - name_accuracy: "Framework correctly named: [Yes/No]"
    - principle_accuracy: "Principles accurately represented: [Yes/No]"
    - vocabulary_usage: "Framework vocabulary correctly used: [Yes/No]"
    - application_logic: "Application makes logical sense: [Yes/No]"
  status: "[Pass/Needs Revision]"
```

### Step 5.4: Phrase Integration Verification

For each signature phrase used in each algorithm:

```yaml
phrase_verification:
  algorithm: "[Algorithm name]"
  phrase_used: "[Exact phrase]"
  verification:
    - exists_check: "Phrase exists in signature-phrases.yaml: [Yes/No]"
    - accurate_quote: "Phrase is correctly quoted: [Yes/No]"
    - natural_fit: "Phrase fits naturally in context: [Yes/No]"
    - enhances_message: "Phrase enhances rather than disrupts: [Yes/No]"
    - not_overused: "Phrase not overused across algorithms: [Yes/No]"
  status: "[Pass/Needs Revision]"
```

### Step 5.5: Read-Aloud Test

For each full example response:

1. Read the response aloud
2. Evaluate using these criteria:

```yaml
readability_check:
  flow: "Does it flow naturally? [Yes/No]"
  transitions: "Are transitions smooth? [Yes/No]"
  length: "Is the length appropriate? [Yes/No]"
  conversational: "Does it feel like conversation? [Yes/No]"
  engagement: "Would you want to continue the dialogue? [Yes/No]"
  authenticity: "Does it sound like a real person? [Yes/No]"
```

### Quality Gate: Voice Authenticity

```yaml
gate: voice_authenticity
checks:
  mandatory:
    - all_pass_scoring: "All 5 algorithms score 20+ out of 25"
    - all_high_distinctiveness: "All algorithms rate 'High' on distinctiveness"
    - all_frameworks_verified: "All framework references verified"
    - all_phrases_verified: "All phrase integrations verified"
  quality:
    - no_generic_content: "No generic/filler content remains"
    - natural_flow: "All examples pass read-aloud test"
    - consistent_voice: "Voice is consistent across all algorithms"
```

---

## PHASE 6: OUTPUT AND DOCUMENTATION

### Step 6.1: Compile Final YAML

Using the template: `templates/objection-algorithms-tmpl.yaml`

Create the output file with this structure:

```yaml
# Objection Algorithms - [Copywriter Name]
# Generated by: create-objection-algorithms.md task v2.0
# Date: [YYYY-MM-DD]
# Voice Authenticity Score: [X]/25

metadata:
  copywriter:
    name: "[Full Name]"
    slug: "[mind_slug]"
  extraction_date: "[YYYY-MM-DD]"
  task_version: "2.0.0"

  statistics:
    total_algorithms: 5
    source_files_consulted: [count]
    frameworks_referenced: [list]
    signature_phrases_used: [count]

  voice_metrics:
    average_score: "[X]/25"
    distinctiveness_rating: "[High/Medium]"
    framework_integration: "[count] frameworks correctly applied"
    phrase_integration: "[count] phrases naturally used"

objection_algorithms:
  - name: "Time Scarcity Resolution"
    category: "time_scarcity"
    # ... [complete algorithm 1]

  - name: "Competence Doubt Resolution"
    category: "competence_doubt"
    # ... [complete algorithm 2]

  - name: "Market Saturation Resolution"
    category: "market_saturation"
    # ... [complete algorithm 3]

  - name: "Credibility Concern Resolution"
    category: "credibility_concern"
    # ... [complete algorithm 4]

  - name: "Audience Building Resolution"
    category: "audience_building"
    # ... [complete algorithm 5]

quality_report:
  voice_consistency:
    algorithm_1: "[Score]/25 - [Notes]"
    algorithm_2: "[Score]/25 - [Notes]"
    algorithm_3: "[Score]/25 - [Notes]"
    algorithm_4: "[Score]/25 - [Notes]"
    algorithm_5: "[Score]/25 - [Notes]"

  distinctiveness:
    algorithm_1: "[High/Medium] - [Notes]"
    algorithm_2: "[High/Medium] - [Notes]"
    algorithm_3: "[High/Medium] - [Notes]"
    algorithm_4: "[High/Medium] - [Notes]"
    algorithm_5: "[High/Medium] - [Notes]"

  framework_verification:
    all_verified: true
    notes: "[Any notes]"

  phrase_verification:
    all_verified: true
    notes: "[Any notes]"

integration_notes:
  communication_dna_alignment: "[How algorithms align with DNA]"
  authority_arsenal_alignment: "[How algorithms use evidence types]"
  framework_consistency: "[How algorithms apply frameworks]"
```

### Step 6.2: Save Output

Save to: `outputs/minds/{slug}/analysis/objection-algorithms.yaml`

### Quality Gate: Output

```yaml
gate: output
checks:
  mandatory:
    - file_location: "File saved to correct path"
    - yaml_valid: "YAML syntax validates without errors"
    - metadata_complete: "All metadata fields populated"
    - all_algorithms_present: "All 5 algorithms included"
    - quality_report_complete: "Quality report section filled"
  quality:
    - statistics_accurate: "Statistics match actual content"
    - integration_notes_helpful: "Integration notes provide value"
    - ready_for_agent: "Output ready for agent file integration"
```

---

## FINAL CHECKLIST

### Completion Requirements

```yaml
completion_checklist:
  phase_1_objection_mining:
    - [ ] Mined objections from 20+ source files
    - [ ] Documented triggers for all 5 categories
    - [ ] Identified copywriter's natural response patterns
    - [ ] Created objection category documentation

  phase_2_framework_mapping:
    - [ ] Loaded all extracted frameworks
    - [ ] Mapped primary framework to each category
    - [ ] Extracted framework principles for responses
    - [ ] Documented framework application guides

  phase_3_phrase_selection:
    - [ ] Loaded all signature phrases
    - [ ] Selected 3-5 phrases per category
    - [ ] Documented integration points
    - [ ] Created phrase integration guides

  phase_4_algorithm_construction:
    - [ ] Created all 5 algorithms
    - [ ] Each algorithm has 5 complete steps
    - [ ] Each step has 2-3 script variations
    - [ ] Each algorithm has full example response

  phase_5_voice_validation:
    - [ ] All algorithms score 20+ out of 25
    - [ ] All algorithms rate "High" distinctiveness
    - [ ] All framework references verified
    - [ ] All phrase integrations verified

  phase_6_output:
    - [ ] File compiled with correct structure
    - [ ] YAML validates without errors
    - [ ] Saved to correct location
    - [ ] Quality report complete
```

### Quality Standards

```yaml
quality_standards:
  structure:
    - exactly_5_algorithms: "Not more, not less"
    - exactly_5_steps: "Each algorithm has 5 steps"
    - scripts_per_step: "2-3 variations per step"
    - full_example_per_algorithm: "150-250 words each"

  authenticity:
    - voice_score: "20+ out of 25 for each algorithm"
    - distinctiveness: "High rating for all algorithms"
    - no_generic_content: "Zero filler or placeholder text"
    - sounds_like_copywriter: "Read aloud test passes"

  integration:
    - valid_frameworks: "All references exist in frameworks.yaml"
    - valid_phrases: "All phrases exist in signature-phrases.yaml"
    - yaml_syntax: "Output validates without errors"
    - ready_for_agent: "Can be integrated into final agent file"
```

### Integration Verification

```yaml
integration_verification:
  with_frameworks:
    - algorithms_use_frameworks: "Each algorithm references 1-2 frameworks"
    - framework_names_match: "Names exactly match frameworks.yaml"
    - principles_accurately_applied: "No misrepresentation"

  with_phrases:
    - algorithms_use_phrases: "Each algorithm uses 2-3 phrases"
    - phrases_correctly_quoted: "Exact matches to signature-phrases.yaml"
    - natural_integration: "Phrases enhance, not disrupt"

  with_communication_dna:
    - vocabulary_aligned: "Word choices match DNA vocabulary"
    - tone_aligned: "Energy/style matches DNA tone"
    - forbidden_avoided: "No forbidden words/phrases used"

  with_authority_arsenal:
    - evidence_types_used: "Evidence matches arsenal proof types"
    - proof_hierarchy_followed: "Appropriate proof levels used"

  with_agent_file:
    - output_format_compatible: "Structure matches agent file needs"
    - ready_for_integration: "Can be inserted without modification"
```

---

## TROUBLESHOOTING

### Common Issues and Solutions

**Issue:** Can't find objection content in sources
```yaml
solution:
  search_locations:
    - FAQ sections in any content
    - Comment/reply sections
    - Q&A transcripts
    - Sales page objection handling
    - Email sequences addressing concerns
    - Podcast/interview Q&A segments
  alternative_approach:
    - Look for preemptive objection handling
    - Search for "the problem is" patterns
    - Find "people think... but" patterns
```

**Issue:** Framework doesn't fit the objection
```yaml
solution:
  options:
    - Choose different framework from inventory
    - Adapt the angle of application
    - Use framework principle, not full framework
  never_do:
    - Force a framework where it doesn't fit
    - Create fictional frameworks
    - Misrepresent framework principles
```

**Issue:** Signature phrases feel forced
```yaml
solution:
  adjustments:
    - Use fewer phrases (2-3 max per algorithm)
    - Place only where naturally fits
    - Adapt context around phrase
  never_do:
    - Cram in phrases for the sake of it
    - Modify signature phrases
    - Use phrases out of context
```

**Issue:** Response sounds generic
```yaml
solution:
  voice_strengthening:
    - Review communication DNA for vocabulary
    - Add more specific copywriter vocabulary
    - Include concrete examples from their experience
    - Reference their specific frameworks by name
  verification:
    - Read response aloud
    - Ask "Would [Copywriter] actually say this?"
    - Compare to their actual objection handling
```

**Issue:** Algorithm too long/verbose
```yaml
solution:
  length_guidelines:
    - Each step: 1-3 sentences max
    - Full example: 150-250 words
    - Scripts: Conversational, not essay
  focus_on:
    - Impact over word count
    - Clarity over completeness
    - Natural flow over comprehensive coverage
```

**Issue:** Voice scores below 20
```yaml
solution:
  dimension_specific:
    vocabulary_low:
      - Review communication DNA word lists
      - Replace generic words with their specific terms
      - Check forbidden word list
    frameworks_low:
      - Verify framework names match exactly
      - Review framework principles
      - Check application accuracy
    phrases_low:
      - Verify phrases exist in signature file
      - Improve natural integration
      - Remove forced insertions
    tone_low:
      - Read their original content again
      - Match their energy level
      - Replicate their rhythm
    philosophy_low:
      - Review their core beliefs
      - Check for contradictions
      - Align with their worldview
```

---

## REFERENCE: Example Outputs

For reference implementations, review:
- `squads/copy/agents/david-ogilvy.md` (objection_algorithms section)
- `squads/copy/agents/alex-hormozi.md` (objection_algorithms section)
- `squads/copy/agents/dan-kennedy.md` (objection_algorithms section)

These demonstrate expected depth, structure, and voice consistency.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial task creation |
| 2.0.0 | 2026-01-23 | Complete rewrite with theoretical foundation, expanded phases, voice validation, comprehensive quality gates |

---

*CopywriterOS Task v2.0.0*
*Phase 6 of Create Copywriter Agent Pipeline*
