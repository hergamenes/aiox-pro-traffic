---
task: Extract Frameworks - Operational Framework Extraction for Copywriter Agents
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Analysis
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

# Extract Frameworks - Operational Framework Extraction for Copywriter Agents

## Metadata
```yaml
task_id: extract-frameworks
version: 2.0.0
category: copywriter-agent-creation
difficulty: advanced
elicit: true
parent_task: tasks/create-copywriter-agent.md
phase: 2
last_updated: 2026-01-23

theoretical_foundation:
  primary_models:
    - Expert Knowledge Elicitation
    - Pattern Recognition Theory
    - Knowledge Systematization Framework
  classification:
    - Framework Taxonomy (8 categories)
    - Framework Value Hierarchy
    - Cross-Category Integration

dependencies:
  templates:
    - templates/frameworks-extraction-tmpl.yaml
  reference:
    - agents/david-ogilvy.md (structure reference)
    - agents/dan-kennedy.md (structure reference)
    - agents/alex-hormozi.md (structure reference)
  research:
    - docs/research/framework-extraction-methodology-research.md

inputs:
  required:
    - source_directory: "Path to source materials (20+ files)"
    - copywriter_name: "Full name of the copywriter"
    - mind_slug: "Snake_case identifier"

outputs:
  primary:
    - frameworks_file: "outputs/minds/{slug}/analysis/frameworks.yaml"
  specifications:
    - Exactly 10 operational frameworks
    - Complete structure for each framework
    - Minimum 4 category coverage
    - Examples from actual sources

quality_standards:
  minimum_lines: 600
  framework_count: 10 (exactly)
  category_coverage: 4+ different categories
  completeness: "All fields populated"
  distinctiveness: "Frameworks unique to copywriter"
```

---

## Executive Summary

### Purpose

Extract exactly 10 operational frameworks from a copywriter's source materials. These frameworks represent the copywriter's systematic approaches to specific problems in copywriting, marketing, sales, and content creation.

### What is an Operational Framework?

**Definition:** An operational framework is a repeatable system or methodology that produces consistent results when applied to similar situations.

**The Framework Formula:**
```
Framework = Named System + Structured Process + Repeatable Results
```

**Core Elements:**
1. **Named Components:** Distinct parts that work together
2. **Clear Steps:** A process that can be followed
3. **Defined Outcomes:** What the framework produces
4. **Applicability Triggers:** When to use it
5. **Transferability:** Can be taught and replicated

### Framework vs. Advice

Understanding what qualifies as a framework is critical:

**IS a Framework:**
```yaml
framework_characteristics:
  - Has explicit or implied name
  - Contains distinct steps or components
  - Can be replicated by someone else
  - Solves a specific, recurring problem
  - Produces consistent results when applied
  - Appears multiple times or is emphasized as core methodology

examples:
  - "The AIDA Formula" (Attention, Interest, Desire, Action)
  - "The Value Ladder" (progression of offers)
  - "The Dream 100 Method" (targeting high-value prospects)
```

**IS NOT a Framework:**
```yaml
not_framework:
  general_advice: "Write good headlines" (no structure)
  one_off_examples: "I once got 40% CTR" (no methodology)
  opinions: "Long copy is better" (no system)
  preferences: "I write in the morning" (not transferable)
```

### Framework Value Hierarchy

Not all frameworks are equally valuable:

```yaml
framework_value_hierarchy:
  tier_1_signature:
    value: "Highest"
    description: "Frameworks unique to this copywriter"
    characteristics:
      - Coined by them
      - Central to their teaching
      - What they're known for

  tier_2_adapted:
    value: "High"
    description: "Standard frameworks with their unique twist"
    characteristics:
      - Based on known frameworks
      - Modified with their experience
      - Applied in distinctive way

  tier_3_applied:
    value: "Medium"
    description: "Standard frameworks they use consistently"
    characteristics:
      - Industry-standard frameworks
      - Part of their toolkit
      - May have minor variations
```

---

## FRAMEWORK STRUCTURE REFERENCE

### Complete Framework Documentation Template

Each extracted framework must follow this structure:

```yaml
- name: "Framework Name"
  category: "[copywriting|offer_creation|marketing_strategy|sales|content|audience|product|mindset]"
  origin: "Where first documented (book, course, interview, etc.)"
  value_tier: "[signature|adapted|applied]"

  definition: >
    Clear explanation of what this framework does and when to use it.
    Should be 2-4 sentences that capture the essence.
    Use copywriter's language where possible.

  principle: "One-sentence core principle that underlies the framework"

  components:
    description: "Overview of the framework's parts"
    parts:
      - name: "Component 1 Name"
        description: "What this component does"
        role: "How it fits in the whole"
      - name: "Component 2 Name"
        description: "What this component does"
        role: "How it fits in the whole"
      # ... (typically 3-7 parts)

  process:
    description: "How to execute this framework"
    steps:
      - step: 1
        name: "Step name"
        action: "What to do"
        outcome: "What completing this produces"
      - step: 2
        name: "Step name"
        action: "What to do"
        outcome: "What completing this produces"
      # ... (typically 3-7 steps)

  application:
    when: "Specific situations/triggers for using this framework"
    process:
      - "Application step 1"
      - "Application step 2"
      - "Application step 3"
    expected_outcome: "What success looks like"

  common_mistakes:
    - "Mistake 1 - what people do wrong"
    - "Mistake 2 - what people do wrong"
    - "Mistake 3 - what people do wrong"

  examples:
    - context: "Specific situation description"
      application: "How framework was used"
      result: "What happened"

  integrations:
    works_with: ["Other framework names"]
    precedes: ["What frameworks typically come after"]
    follows: ["What frameworks typically come before"]
```

---

## PREREQUISITES

### Required Inputs

Before starting, ensure you have:

| Input | Location | Minimum | Purpose |
|-------|----------|---------|---------|
| Source Materials | `outputs/minds/{slug}/sources/` | 20 files | Framework extraction |
| Source Catalog | Created in Phase 1 | Complete | Source tracking |

### Input Elicitation

```
elicit: true
question: "Confirm the following for framework extraction:"
fields:
  - copywriter_name: "Full name of the copywriter"
  - slug: "Mind slug (snake_case, e.g., dan_kennedy)"
  - source_directory: "Path to source materials"
  - output_path: "Output path (default: outputs/minds/{slug}/analysis/frameworks.yaml)"
```

### Quality Gate: Prerequisites

```yaml
gate: prerequisites
checks:
  mandatory:
    - source_count: "Minimum 20 source files available"
    - source_variety: "Mix of content types"
    - output_template: "templates/frameworks-extraction-tmpl.yaml exists"
  quality:
    - source_quality: "Sources include teaching/methodology content"
    - reference_available: "Agent reference files accessible"
```

---

## PHASE 1: SOURCE CATALOGING AND ANALYSIS

### Objective

Create a complete catalog of source materials with framework signal assessment.

### Step 1.1: Gather Source Materials

```
elicit: true
question: "Where are the source materials for this copywriter?"
options:
  - Mind directory (outputs/minds/{slug}/sources/)
  - External folder path
  - Specific file list
```

### Step 1.2: Create Source Catalog

Document every source file:

```yaml
source_catalog:
  files:
    - file_name: "[filename]"
      file_type: "[article|interview|book|course|transcript|email|sales_page]"
      word_count: "[approximate count]"
      topics_covered: ["topic1", "topic2"]
      framework_signals: "[explicit|implicit|none]"
      quality_rating: "[A|B|C]"
```

**Quality Rating Criteria:**

| Rating | Description | Extraction Priority |
|--------|-------------|---------------------|
| A | Explicit framework teaching, named systems | Highest |
| B | Implicit frameworks, consistent patterns | High |
| C | General content, occasional insights | Medium |

### Step 1.3: Complete Source Reading

**CRITICAL REQUIREMENT:** Read each source file COMPLETELY. Do NOT skim.

**For each source, track:**
1. Named systems or frameworks
2. Numbered lists (steps, components)
3. Repeated structures across sources
4. Methodology emphasis signals
5. Teaching moments about "how I do X"

### Step 1.4: Source Quality Assessment

Create framework signal assessment:

```yaml
source_assessment:
  total_sources: "[count]"
  a_rated: "[count]"
  b_rated: "[count]"
  c_rated: "[count]"

  high_signal_sources:
    - file: "[filename]"
      frameworks_indicated: ["list"]
      evidence_strength: "[strong|medium]"
```

### Quality Gate: Source Cataloging

```yaml
gate: source_cataloging
checks:
  mandatory:
    - all_sources_cataloged: "Every file has entry"
    - complete_reading: "All files read completely"
    - signal_assessment: "Framework signals noted"
  quality:
    - a_sources_identified: "High-signal sources found"
    - topic_coverage: "Diverse topics represented"
```

---

## PHASE 2: FRAMEWORK IDENTIFICATION

### Objective

Identify all potential frameworks from source materials, distinguishing between explicit and implicit frameworks.

### Step 2.1: Framework Signal Detection

**Strong Signals (High Confidence):**

```yaml
strong_signals:
  explicit_naming:
    patterns:
      - "I call this the [X] Method"
      - "This is my [X] Framework"
      - "The [X] Formula works like this"
    action: "Direct capture"

  numbered_systems:
    patterns:
      - "The 5 steps to..."
      - "These 3 components..."
      - "The 7 laws of..."
    action: "Document structure"

  acronym_frameworks:
    patterns:
      - "PASTOR stands for..."
      - "Using AIDA..."
      - "My [ACRONYM] method..."
    action: "Expand and document"

  emphasis_markers:
    patterns:
      - "This is the most important thing I teach"
      - "Everything I do comes back to this"
      - "If you only remember one thing..."
    action: "High priority extraction"
```

**Medium Signals (Requires Validation):**

```yaml
medium_signals:
  repeated_sequences:
    indicators:
      - Same steps mentioned across multiple sources
      - Consistent order of operations
      - Similar structure in different contexts
    validation: "Cross-reference across sources"

  teaching_patterns:
    indicators:
      - "First... then... finally..."
      - "The key components are..."
      - "You need to understand these elements..."
    validation: "Confirm structure completeness"
```

### Step 2.2: Initial Framework List

As you read each source, document potential frameworks:

```yaml
potential_framework:
  name: "[Explicit name or descriptive name]"
  source: "[file name, page/section]"
  signal_type: "[explicit|implicit|recurring]"
  category_guess: "[category]"

  raw_evidence:
    quotes:
      - "[Direct quote 1]"
      - "[Direct quote 2]"

  structure_notes:
    components_found:
      - "[component 1]"
      - "[component 2]"
    steps_found:
      - "[step 1]"
      - "[step 2]"

  confidence_level: "[high|medium|low]"
```

### Step 2.3: Implicit Framework Identification

Many valuable frameworks are never named but consistently applied:

**Implicit Framework Extraction Process:**

```yaml
implicit_extraction:
  step_1_pattern_observation:
    action: "Track how they solve recurring problems"
    look_for:
      - Consistent sequences of actions
      - Repeated structural elements
      - Same approach in different contexts

  step_2_structure_mapping:
    action: "Document the consistent structure"
    document:
      - Steps they consistently follow
      - Components always present
      - Decision points in process

  step_3_name_synthesis:
    action: "Create descriptive name"
    guidelines:
      - Use their vocabulary if possible
      - Make it memorable
      - Describe the function

  step_4_validation:
    action: "Confirm framework validity"
    requirements:
      - Appears across multiple sources
      - Structure is consistent
      - Can be taught independently
```

### Step 2.4: Framework Frequency Analysis

Rank all potential frameworks:

```yaml
framework_ranking:
  framework_name: "[name]"
  metrics:
    mentions: "[count across sources]"
    depth: "[high|medium|low - how much detail given]"
    uniqueness: "[high|medium|low - is it distinctive?]"
    centrality: "[high|medium|low - core to methodology?]"
  priority_score: "[1-20]"
  selection_status: "[selected|backup|rejected]"
```

### Quality Gate: Framework Identification

```yaml
gate: framework_identification
checks:
  mandatory:
    - frameworks_found: "15+ potential frameworks identified"
    - explicit_implicit: "Both explicit and implicit captured"
    - evidence_documented: "All have source evidence"
  quality:
    - high_confidence: "10+ have high/medium confidence"
    - category_diversity: "Multiple categories represented"
    - signature_identified: "Signature frameworks found"
```

---

## PHASE 3: FRAMEWORK SELECTION

### Objective

Select exactly 10 frameworks that best represent the copywriter's methodology with proper category distribution.

### Step 3.1: Category Distribution Planning

Ensure coverage across categories:

```yaml
category_distribution:
  targets:
    copywriting:
      target: 2-3
      description: "Writing techniques, formulas, structures"
      examples: ["PASTOR", "PAS", "AIDA", "Story frameworks"]

    offer_creation:
      target: 1-2
      description: "Building offers, pricing, bundling"
      examples: ["Value Ladder", "Godfather Offer", "Risk Reversal"]

    marketing_strategy:
      target: 1-2
      description: "Overall marketing approach, positioning"
      examples: ["Category Design", "Content Pyramid", "Omnipresence"]

    sales:
      target: 1-2
      description: "Sales processes, objection handling"
      examples: ["Closing Scripts", "Objection Framework"]

    content:
      target: 1-2
      description: "Content creation, distribution"
      examples: ["Newsletter Formula", "Social Strategy", "Content Wheel"]

    audience:
      target: 0-1
      description: "Avatar, targeting, segmentation"
      examples: ["Dream 100", "Avatar Deep Dive"]

    product:
      target: 0-1
      description: "Product development, improvement"
      examples: ["Minimum Viable Offer", "Product Pyramid"]

    mindset:
      target: 0-1
      description: "Beliefs, psychology, personal development"
      examples: ["Identity Shift", "Abundance Mindset"]

  rules:
    total: 10
    minimum_categories: 4
    maximum_per_category: 3
```

### Step 3.2: Selection Criteria

Apply selection criteria to choose final 10:

```yaml
selection_criteria:
  must_have:
    - Sufficient source evidence
    - Complete structure documentable
    - Clear category fit
    - Unique to this copywriter OR distinctively applied

  prioritize:
    - Signature frameworks (what they're known for)
    - Central to their methodology
    - High teaching frequency
    - Strong practical application

  balance:
    - Tactical frameworks (how-to)
    - Strategic frameworks (big picture)
    - Different categories
```

### Step 3.3: Final Framework Selection

Document final selection:

```yaml
final_selection:
  selected_frameworks:
    1:
      name: "[Framework Name]"
      category: "[category]"
      value_tier: "[signature|adapted|applied]"
      selection_rationale: "[Why selected]"

    2:
      name: "[Framework Name]"
      category: "[category]"
      value_tier: "[signature|adapted|applied]"
      selection_rationale: "[Why selected]"

    # ... continue for all 10

  category_distribution:
    copywriting: [X]
    offer_creation: [X]
    marketing_strategy: [X]
    sales: [X]
    content: [X]
    audience: [X]
    product: [X]
    mindset: [X]
    TOTAL: 10

  backup_frameworks:
    - "[Backup 1] - would replace [X] if needed"
    - "[Backup 2] - would replace [X] if needed"
```

### Step 3.4: Selection Validation

Validate selection meets requirements:

```yaml
selection_validation:
  checks:
    - exactly_10: "[Yes/No]"
    - minimum_4_categories: "[Yes/No]"
    - no_category_over_3: "[Yes/No]"
    - includes_signature: "[Yes/No]"
    - all_documentable: "[Yes/No]"
    - balanced_tactical_strategic: "[Yes/No]"
```

### Quality Gate: Framework Selection

```yaml
gate: framework_selection
checks:
  mandatory:
    - count_exact: "Exactly 10 frameworks selected"
    - category_coverage: "At least 4 categories"
    - distribution_valid: "No category exceeds 3"
  quality:
    - signature_included: "Signature frameworks prioritized"
    - balance_achieved: "Tactical/strategic balance"
    - backups_identified: "Backup options available"
```

---

## PHASE 4: DEEP DOCUMENTATION

### Objective

Create complete, detailed documentation for each selected framework.

### Step 4.1: Documentation Process

For EACH of the 10 selected frameworks:

```yaml
documentation_process:
  step_1_source_collection:
    action: "Gather all source mentions"
    output: "Complete evidence file per framework"

  step_2_language_extraction:
    action: "Pull copywriter's exact language"
    focus:
      - How they describe it
      - Words they use
      - Examples they give

  step_3_structure_identification:
    action: "Map complete structure"
    identify:
      - Named components
      - Step sequences
      - Decision points

  step_4_example_collection:
    action: "Find real applications"
    require:
      - Specific context
      - How it was applied
      - What resulted

  step_5_mistake_identification:
    action: "Document warnings"
    sources:
      - Explicit warnings from copywriter
      - Implicit cautions in teaching
      - Common misapplications mentioned
```

### Step 4.2: Definition Writing

Write clear, complete definitions:

**Definition Standards:**
```yaml
definition_requirements:
  length: "2-4 sentences"
  content:
    - What the framework does
    - When to use it
    - What problem it solves
  voice: "Use copywriter's language where possible"
  clarity: "Understandable without prior context"

  good_example: >
    The PASTOR Framework is a six-part copywriting formula that guides readers
    through a journey from problem awareness to purchase. Use it for long-form
    sales pages, webinar presentations, or email sequences where you need to
    build emotional resonance before presenting the solution.

  bad_example: >
    A copywriting formula.
```

### Step 4.3: Component Documentation

Document each component clearly:

```yaml
component_documentation_standard:
  required_fields:
    - name: "Component name"
    - description: "What it does"
    - role: "How it fits in the whole"

  optional_fields:
    - examples: "Real applications"
    - variations: "Different versions"
    - common_errors: "What goes wrong"

  format:
    - name: "Problem (P in PASTOR)"
      description: "Identify and articulate the reader's core problem"
      role: "Opens the piece by creating resonance"
      example: "Are you tired of writing content that gets ignored?"
```

### Step 4.4: Process Documentation

Document steps that are actionable:

```yaml
process_documentation_standard:
  step_format:
    step: "Sequential number"
    name: "Brief name"
    action: "What to do"
    outcome: "What completing produces"

  requirements:
    minimum_steps: 3
    maximum_steps: 10
    actionable: "Each step can be executed"
    clear_sequence: "Logical progression"

  example:
    - step: 1
      name: "Problem Research"
      action: "Interview 10 customers about their biggest struggle"
      outcome: "List of pain points in customer language"

    - step: 2
      name: "Agitation Mapping"
      action: "For each pain point, write 3 consequences of not solving"
      outcome: "Emotional connection to urgency"
```

### Step 4.5: Example Documentation

Document real applications:

```yaml
example_documentation_standard:
  required_fields:
    context: "Specific situation"
    application: "How framework was used"
    result: "What happened"

  quality_criteria:
    specific: "Not generic"
    sourced: "From copywriter's work"
    complete: "Shows cause and effect"

  good_example:
    context: "Launching a new course on copywriting"
    application: "Used PASTOR in sales page with problem section focused on 'invisible content syndrome'"
    result: "[RESULTADO_EM_48H_EXEMPLO] in sales in first 48 hours"

  bad_example:
    context: "Marketing campaign"
    application: "Used the framework"
    result: "It worked"
```

### Step 4.6: Framework Quality Checklist

For each framework, verify:

```yaml
framework_quality_checklist:
  identification:
    - name_clear: "Name is recognizable and memorable"
    - category_accurate: "Fits the problem it solves"
    - origin_documented: "Source is cited"

  explanation:
    - definition_complete: "2-4 sentences, what + when"
    - principle_memorable: "One sentence, quotable"

  structure:
    - components_distinct: "Each part has clear role"
    - process_actionable: "Steps can be followed"

  application:
    - triggers_specific: "Clear when to use"
    - outcome_defined: "Success is measurable"

  warnings:
    - mistakes_real: "Based on source warnings"
    - minimum_three: "At least 3 mistakes documented"

  evidence:
    - examples_exist: "At least one concrete case"
    - from_sources: "Examples from their actual work"
```

### Quality Gate: Deep Documentation

```yaml
gate: deep_documentation
checks:
  mandatory:
    - all_10_complete: "All frameworks fully documented"
    - all_fields_populated: "No empty fields"
    - no_placeholders: "No template text remaining"
  quality:
    - definitions_clear: "All definitions meet standards"
    - examples_specific: "All examples are concrete"
    - voice_consistent: "Language matches copywriter"
```

---

## PHASE 5: INTEGRATION AND RELATIONSHIPS

### Objective

Document how frameworks relate to each other and form a cohesive system.

### Step 5.1: Identify Framework Relationships

**Relationship Types:**

```yaml
relationship_types:
  sequential:
    description: "One framework leads to another"
    example: "Avatar Framework → PASTOR Framework"
    documentation: "Note in application section"

  complementary:
    description: "Frameworks work together"
    example: "Value Ladder + Risk Reversal"
    documentation: "Note in application section"

  nested:
    description: "One framework contains another"
    example: "Content System contains Newsletter Framework"
    documentation: "Note in components section"

  alternative:
    description: "Frameworks for same problem"
    example: "PASTOR vs. PAS for sales copy"
    documentation: "Note in when_to_use section"
```

### Step 5.2: Map Framework Relationships

For each framework:

```yaml
framework_relationships:
  framework_name: "[Name]"
  relationships:
    precedes:
      - framework: "[Name]"
        relationship: "Typically leads to..."

    follows:
      - framework: "[Name]"
        relationship: "Usually comes after..."

    works_with:
      - framework: "[Name]"
        relationship: "Complements by..."

    alternative_to:
      - framework: "[Name]"
        context: "Use instead when..."
```

### Step 5.3: System View

Understand how frameworks create a complete system:

```yaml
system_view:
  pre_sale:
    frameworks: ["Audience frameworks", "Content frameworks"]
    purpose: "Attract and nurture audience"

  sale:
    frameworks: ["Copywriting frameworks", "Offer frameworks"]
    purpose: "Convert audience to customers"

  post_sale:
    frameworks: ["Product frameworks", "Retention frameworks"]
    purpose: "Deliver value and retain"

  underlying:
    frameworks: ["Mindset frameworks", "Strategy frameworks"]
    purpose: "Foundation for all activities"
```

### Quality Gate: Integration

```yaml
gate: integration
checks:
  mandatory:
    - relationships_mapped: "All framework relationships documented"
    - system_coherent: "Frameworks form logical system"
  quality:
    - integration_useful: "Relationship info helps application"
    - no_contradictions: "Frameworks don't conflict"
```

---

## PHASE 6: COMPILATION AND OUTPUT

### Step 6.1: Assemble Final YAML

Use the template structure:

```yaml
# Copywriter Operational Frameworks Extraction
# Generated: [YYYY-MM-DD]
# Copywriter: [Full Name]
# Task Version: 2.0.0

metadata:
  copywriter:
    name: "[Full Name]"
    slug: "[mind_slug]"
  extraction_date: "[YYYY-MM-DD]"
  task_version: "2.0.0"
  total_frameworks: 10
  source_files_count: [XX]
  source_directory: "[path]"

categories_covered:
  copywriting: [X]
  offer_creation: [X]
  marketing_strategy: [X]
  sales: [X]
  content: [X]
  audience: [X]
  product: [X]
  mindset: [X]

framework_summary:
  signature_frameworks: ["list"]
  adapted_frameworks: ["list"]
  applied_frameworks: ["list"]

operational_frameworks:
  # Framework 1
  - name: "[...]"
    category: "[...]"
    origin: "[...]"
    value_tier: "[...]"
    definition: >
      [...]
    principle: "[...]"
    components:
      description: "[...]"
      parts:
        - name: "[...]"
          description: "[...]"
          role: "[...]"
    process:
      description: "[...]"
      steps:
        - step: 1
          name: "[...]"
          action: "[...]"
          outcome: "[...]"
    application:
      when: "[...]"
      process:
        - "[...]"
      expected_outcome: "[...]"
    common_mistakes:
      - "[...]"
    examples:
      - context: "[...]"
        application: "[...]"
        result: "[...]"
    integrations:
      works_with: ["[...]"]
      precedes: ["[...]"]
      follows: ["[...]"]

  # Framework 2-10...

quality_report:
  completeness: "[All fields populated]"
  category_coverage: "[X categories]"
  signature_count: "[X]"
  examples_count: "[X total]"
  validation_passed: "[Yes/No]"
```

### Step 6.2: Final Validation

Run complete validation:

```yaml
final_validation_checklist:
  count_validation:
    - exactly_10_frameworks: "[Yes/No]"

  completeness_validation:
    - all_fields_populated: "[Yes/No]"
    - no_placeholder_text: "[Yes/No]"
    - no_empty_sections: "[Yes/No]"

  category_validation:
    - minimum_4_categories: "[Yes/No]"
    - no_category_over_3: "[Yes/No]"

  distinctiveness_validation:
    - frameworks_unique: "[Yes/No]"
    - copywriter_specific: "[Yes/No]"

  quality_validation:
    - definitions_complete: "[Yes/No]"
    - processes_actionable: "[Yes/No]"
    - examples_specific: "[Yes/No]"
    - mistakes_documented: "[Yes/No]"

  technical_validation:
    - yaml_syntax_valid: "[Yes/No]"
    - proper_indentation: "[Yes/No]"
    - no_special_chars_breaking: "[Yes/No]"

  voice_validation:
    - language_matches_copywriter: "[Yes/No]"
    - framework_names_authentic: "[Yes/No]"
```

### Step 6.3: Save Output

Save to: `outputs/minds/{slug}/analysis/frameworks.yaml`

### Quality Gate: Final Output

```yaml
gate: final_output
checks:
  mandatory:
    - file_saved: "Output saved to correct location"
    - yaml_valid: "YAML syntax validates"
    - count_correct: "Exactly 10 frameworks"
    - all_complete: "Every field populated"
  quality:
    - category_diverse: "4+ categories covered"
    - voice_authentic: "Sounds like copywriter"
    - usable: "Frameworks can be applied from documentation"
```

---

## FINAL CHECKLIST

### Completion Requirements

```yaml
completion_checklist:
  phase_1_source_cataloging:
    - [ ] All sources cataloged with metadata
    - [ ] Framework signals assessed
    - [ ] Quality ratings assigned
    - [ ] Complete reading confirmed

  phase_2_framework_identification:
    - [ ] 15+ potential frameworks identified
    - [ ] Explicit frameworks captured
    - [ ] Implicit frameworks extracted
    - [ ] Evidence documented for all

  phase_3_framework_selection:
    - [ ] Exactly 10 frameworks selected
    - [ ] 4+ categories covered
    - [ ] No category exceeds 3
    - [ ] Selection rationale documented

  phase_4_deep_documentation:
    - [ ] All 10 frameworks fully documented
    - [ ] Definitions meet standards
    - [ ] Components fully described
    - [ ] Processes actionable
    - [ ] Examples specific and sourced
    - [ ] Mistakes documented

  phase_5_integration:
    - [ ] Framework relationships mapped
    - [ ] System view documented
    - [ ] Integration useful

  phase_6_output:
    - [ ] YAML compiled correctly
    - [ ] All validations passed
    - [ ] File saved to correct location
```

---

## TROUBLESHOOTING

### Common Issues and Solutions

**Issue:** Can't find 10 frameworks

```yaml
solution:
  expand_search:
    - Look for implicit frameworks (unnamed but consistent patterns)
    - Check for combined frameworks that could be split
    - Review B-rated sources more carefully
  adjust_criteria:
    - Consider adapted frameworks (their version of standard frameworks)
    - Include their consistent processes as frameworks
```

**Issue:** Too many frameworks in one category

```yaml
solution:
  combine_similar:
    - Merge overlapping frameworks into one comprehensive framework
    - Keep the more complete version
  prioritize:
    - Keep signature frameworks
    - Keep most distinctive versions
  search_other_categories:
    - Explicitly look for underrepresented categories
```

**Issue:** Framework documentation incomplete

```yaml
solution:
  return_to_sources:
    - Re-read sources specifically for that framework
    - Look for examples and applications
    - Note any warnings or cautions
  infer_from_pattern:
    - If implicit framework, document observed pattern
    - Note that structure is inferred
```

**Issue:** Can't determine if something is a framework

```yaml
solution:
  apply_test:
    questions:
      - Does it have distinct components or steps?
      - Can someone else apply it?
      - Does it solve a specific problem?
      - Does it appear in multiple sources?
    if_yes_to_3_or_more: "It's a framework"
    if_no: "It's advice, not framework"
```

**Issue:** Frameworks overlap significantly

```yaml
solution:
  determine_relationship:
    - Is one nested inside the other?
    - Are they alternatives for same problem?
    - Do they address different aspects?
  action:
    - If nested: Document parent only, note child in components
    - If alternative: Keep more distinctive/signature one
    - If different aspects: Keep both with clear differentiation
```

---

## REFERENCE: Example Output Structure

See these agent files for structure reference:
- `squads/copy/agents/david-ogilvy.md`
- `squads/copy/agents/dan-kennedy.md`
- `squads/copy/agents/alex-hormozi.md`

These demonstrate expected depth, structure, and documentation quality.

---

## CATEGORY ENUM REFERENCE

| Category | Description | Example Frameworks |
|----------|-------------|-------------------|
| `copywriting` | Writing techniques, formulas, structures | PASTOR, PAS, AIDA |
| `offer_creation` | Building offers, pricing, bundling | Godfather Offer, Value Stack |
| `marketing_strategy` | Overall marketing approach, positioning | Content Pyramid, Category Design |
| `sales` | Sales processes, objection handling | Risk Reversal, Closing Scripts |
| `content` | Content creation, distribution | Newsletter Formula, Social Strategy |
| `audience` | Avatar, targeting, segmentation | Dream 100, Audience Research |
| `product` | Product development, improvement | Minimum Viable Offer, Product Market Fit |
| `mindset` | Beliefs, psychology, personal development | Identity Shift, Abundance Mindset |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial task creation |
| 2.0.0 | 2026-01-23 | Complete rewrite with pattern recognition theory, framework value hierarchy, implicit framework extraction, integration documentation, comprehensive quality gates |

---

*CopywriterOS Task v2.0.0*
*Phase 2 of Create Copywriter Agent Pipeline*
