---
task: Extract Signature Phrases - Copywriter Agent Sub-Task
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
Domain: Tactical
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

# Extract Signature Phrases - Copywriter Agent Sub-Task

## Metadata
```yaml
task_id: extract-signature-phrases
version: 2.0.0
category: agent-creation
difficulty: advanced
elicit: true
parent_task: create-copywriter-agent.md
phase: 4
dependencies:
  templates:
    - templates/signature-phrases-tmpl.yaml
  reference:
    - agents/dan-kennedy.md
  research:
    - docs/research/signature-phrases-methodology-research.md
outputs:
  - signature-phrases.yaml
minimum_requirements:
  total_phrases: 42
  total_tiers: 7
  fields_per_phrase: 4
  context_min_words: 15
  sources_processed: 20
```

## Objective

Extract and curate 42+ memorable, quotable phrases from a copywriter's body of work, organized into a 7-tier system based on usage frequency and context. These phrases become the "voice bank" that makes the AI agent sound authentically like the original copywriter.

**Key Principle:** A signature phrase must be able to stand alone, be memorable, and feel distinctly like the copywriter said it—not a generic statement anyone could make.

**Research Foundation:** This task is based on stylometric analysis research achieving up to 91% accuracy in author identification through linguistic features. The methodology combines:
1. Forensic linguistics for idiolect identification
2. Brand voice documentation standards
3. AI voice cloning best practices
4. Quantitative frequency analysis

---

## THE SCIENCE OF SIGNATURE PHRASES

### What Are Signature Phrases?

Signature phrases are distinctive linguistic patterns that uniquely identify a communicator. They function as a "linguistic fingerprint" - a combination of:

1. **Catchphrases** - Repeated memorable expressions
2. **Mantras** - Core philosophical statements
3. **Tactical terminology** - Domain-specific language
4. **Rhetorical patterns** - Distinctive persuasion techniques
5. **Verbal tics** - Unconscious speech patterns

**Key Research Finding:**
> "Register variation explains stylometric authorship analysis... people have unique styles of writing. Given sufficient data, it is generally possible to distinguish between the writings of a small group of authors through the multivariate analysis of the relative frequencies of common function words." (Grieve, 2023)

### The Linguistic Fingerprint Formula

Based on NLP research for behavioral science:

```
LINGUISTIC FINGERPRINT =
  Vocabulary Signature (30%)
  + Syntactic Patterns (25%)
  + Discourse Markers (20%)
  + Rhetorical Devices (15%)
  + Prosodic Patterns (10%)
```

### Idiolect Marker Accuracy Rates

| Marker Category | Description | Accuracy Rate |
|-----------------|-------------|---------------|
| Vocabulary patterns | Word choice, frequency, uniqueness | 85-91% |
| Syntactic structures | Sentence construction patterns | 78-85% |
| Prosodic features | Rhythm, emphasis, pacing | 75-82% |
| Discourse markers | Transition words, fillers | 70-78% |
| Semantic preferences | Topic clustering, metaphor usage | 72-80% |

**Critical Finding:** Digital communication settings achieve up to 91% accuracy using linguistic features alone.

### Why Custom Instructions Fail

Simply writing "be conversational" or "sound like [person]" produces generic output. Authentic voice replication requires:
1. Specific phrase examples with exact wording
2. Context for when and how to use each phrase
3. Frequency guidelines for natural distribution
4. Prohibited alternatives to avoid generic substitutions

---

## THE 7-TIER CLASSIFICATION SYSTEM

### Tier Overview

| Tier | Name | Frequency | Purpose | Count |
|------|------|-----------|---------|-------|
| 1 | Core Mantras | Every piece (1-2x daily) | The copywriter's most iconic, repeated beliefs | 5-7 |
| 2 | Methodology Pillars | Weekly | Key phrases about their process/approach | 5-7 |
| 3 | Theme: [Primary Topic] | Per topic context | Domain-specific wisdom (e.g., copywriting) | 6-8 |
| 4 | Theme: [Secondary Topic] | Per topic context | Domain-specific wisdom (e.g., marketing) | 6-8 |
| 5 | Theme: [Tertiary Topic] | Per topic context | Domain-specific wisdom (e.g., business) | 6-8 |
| 6 | Philosophy & Mindset | Monthly | Deeper wisdom about life, success, thinking | 5-7 |
| 7 | Tactical & Situational | As needed | Specific advice for specific situations | 5-7 |

### Tier 1: Core Mantras

**Definition:** The phrases they repeat constantly - their signature expressions that anyone familiar with their work would immediately recognize.

**Characteristics:**
- Appears in 5+ sources (highest frequency)
- Would be immediately recognized as "their thing"
- Foundation of their entire philosophy
- Often quoted by others and students
- Transcends any single topic or context

**Selection Criteria:**
- [ ] Highest frequency across all sources
- [ ] Would be recognized as "their thing"
- [ ] Appears in multiple contexts
- [ ] Foundation of their worldview
- [ ] Others quote this phrase when describing them

**Frequency:** Use 1-2 from this tier in EVERY piece of content

**Test:** "If someone heard only these 5-7 phrases, would they understand this person's core message?"

**Example (Dan Kennedy):**
```yaml
- phrase: "Money is attracted to speed."
  context: "Use when emphasizing urgency in decision-making. Perfect for overcoming procrastination objections in sales contexts."
  usage: "When prospect is delaying or 'thinking about it'"
  source: "No B.S. Sales Success, Multiple seminars"
```

### Tier 2: Methodology Pillars

**Definition:** Key phrases about their process and approach - how they do what they do differently from others.

**Characteristics:**
- Explains HOW they work
- Differentiates their methodology
- Process-oriented language
- "My approach is..." type statements
- Often introduces their frameworks

**Selection Criteria:**
- [ ] Explains their unique process
- [ ] Differentiates from competitors
- [ ] Process-oriented language
- [ ] Would answer "how do you do it?"

**Frequency:** Use weekly when discussing methodology or teaching

**Test:** "Do these phrases explain HOW this person achieves results?"

**Example:**
```yaml
- phrase: "The fortune is in the follow-up."
  context: "Use when discussing lead nurturing and sequence importance. Emphasizes the 80% of sales that happen after first contact."
  usage: "When client focuses only on initial conversion"
  source: "Magnetic Marketing System"
```

### Tier 3-5: Theme-Specific

**Definition:** Domain-specific wisdom organized by the person's three major themes. These tiers adapt to the copywriter's expertise areas.

**Customization Required:**
- Analyze source materials for 3 dominant themes
- Name each tier based on discovered themes
- Examples: Copywriting, Marketing, Business, Offers, Sales, Email, Headlines

**Characteristics:**
- Directly relevant to specific domain
- Actionable within that context
- Shows expertise depth
- Used when topic is discussed

**Selection Criteria for Each Theme:**
- [ ] Directly about [theme]
- [ ] Domain-specific wisdom
- [ ] Actionable within domain
- [ ] Shows expertise depth

**Frequency:** Use per topic context (when that topic comes up)

**Test:** "Would these phrases help someone specifically with [theme]?"

**Theme Examples by Copywriter:**

| Copywriter | Tier 3 | Tier 4 | Tier 5 |
|------------|--------|--------|--------|
| Dan Kennedy | Urgency/Scarcity | Direct Response | Business Strategy |
| Eugene Schwartz | Awareness Levels | Headlines | Market Sophistication |
| Gary Halbert | Sales Letters | Offers | Testing |
| Claude Hopkins | Scientific Advertising | Headlines | Testing |

### Tier 6: Philosophy & Mindset

**Definition:** Deeper wisdom about life, success, and thinking - beyond tactical advice.

**Characteristics:**
- Transcends their specific craft
- Often inspirational or contrarian
- Reveals their worldview
- The "wisdom" layer
- Could apply to life broadly

**Selection Criteria:**
- [ ] Transcends tactical advice
- [ ] Shows deeper wisdom
- [ ] Often inspirational or contrarian
- [ ] Reveals worldview

**Frequency:** Use monthly for depth and credibility

**Test:** "Are these phrases about success/life, not just the craft?"

**Example:**
```yaml
- phrase: "There is no nobility in poverty."
  context: "Use when addressing money mindset blocks. Combats guilt around wealth-seeking that holds many entrepreneurs back."
  usage: "When client expresses guilt about charging premium prices"
  source: "No B.S. Wealth Attraction"
```

### Tier 7: Tactical & Situational

**Definition:** Specific advice for specific situations - the "when X happens, do Y" phrases.

**Characteristics:**
- "When X happens, do Y" format
- Highly actionable
- Addresses common scenarios
- Practical application
- Context-dependent

**Selection Criteria:**
- [ ] "When X happens, do Y" format
- [ ] Specific and actionable
- [ ] Addresses common scenarios
- [ ] Practical application

**Frequency:** Use as needed for specific situations

**Test:** "Can someone use this phrase in a specific situation?"

**Example:**
```yaml
- phrase: "If you need to think about it, the answer is no."
  context: "Use when handling the 'I need to think about it' objection. Forces clarity and respects both parties' time."
  usage: "When prospect says they need to think about it"
  source: "No B.S. Sales Success seminars"
```

---

## PREREQUISITES

Before starting, gather the following information:

```
elicit: true
question: "Please provide the following information:"
fields:
  - copywriter_name: "Name of the copywriter"
  - source_directory: "Path to source materials"
  - primary_theme: "Main topic domain (e.g., copywriting)"
  - secondary_theme: "Second topic domain (e.g., marketing)"
  - tertiary_theme: "Third topic domain (e.g., business)"
```

### Required Materials

| Material | Minimum | Ideal | Purpose |
|----------|---------|-------|---------|
| Source files | 20 | 40+ | Find diverse phrases |
| Reference agent | 1 | 2 | Understand tier format |
| Theme identification | 3 | 3 | Define Tiers 3-5 |

### Source Material Priority

**Best Sources for Phrase Extraction (in order):**

1. **Interviews and Podcasts** (Priority: Highest)
   - Natural speech patterns
   - Unscripted, authentic voice
   - Reveals verbal tics and patterns
   - Best for Tier 1-2 phrases

2. **Social Media Threads** (Priority: Very High)
   - Condensed wisdom
   - High quotability
   - Tested for engagement
   - Best for Tier 3-5 phrases

3. **Books and Long-form Content** (Priority: High)
   - Polished, refined statements
   - Core frameworks explained
   - Best for Tier 2 and Tier 6 phrases

4. **Presentation Transcripts** (Priority: High)
   - Key messages repeated
   - Audience-tested phrasing
   - Best for Tier 1 phrases

5. **Email Communications** (Priority: Medium)
   - Authentic voice in direct communication
   - Best for Tier 7 situational phrases

### Material Quality Assessment

| Material Type | Phrase Density | Authenticity | Best For |
|---------------|----------------|--------------|----------|
| Interview transcript | High | Very High | Tier 1-2 mantras |
| Twitter/X threads | Very High | High | Tier 3-5 tactical |
| Book chapters | Medium | High | Tier 6 philosophy |
| Sales copy | Medium | Medium | Tier 7 situational |
| Edited articles | Low | Medium | Supporting context |

---

## PHASE 1: RECONNAISSANCE

### Step 1.1: Inventory Source Materials

Create a comprehensive inventory of all available source materials:

| File | Type | Word Count | Phrase Potential | Notes |
|------|------|------------|------------------|-------|
| [filename] | Article/Transcript/Interview | [count] | High/Medium/Low | [Notable quotes observed] |

**Source Inventory Template:**
```markdown
## Source Material Inventory

### High Priority Sources (Process First)
1. [filename] - [type] - [word count] - [notable observations]

### Medium Priority Sources
1. [filename] - [type] - [word count] - [notable observations]

### Low Priority Sources (Process Last)
1. [filename] - [type] - [word count] - [notable observations]

Total Sources: [N]
Estimated Total Words: [N]
```

### Step 1.2: Read Reference Agent

Study the signature_phrases section in `agents/dan-kennedy.md`:

**Analysis Points:**
1. Observe the tier structure and naming
2. Note phrase length patterns (average 5-15 words)
3. Understand context field depth and specificity
4. See source attribution format
5. Note the balance across tiers

**Reference Agent Checklist:**
- [ ] Tier 1 structure analyzed
- [ ] Tier 2 structure analyzed
- [ ] Context field quality noted
- [ ] Source attribution format understood
- [ ] Total phrase count observed (42+)

### Step 1.3: Identify Three Main Themes

Analyze source materials to identify the copywriter's three dominant themes:

**Theme Identification Process:**
1. Scan headlines and section titles across all sources
2. Note recurring topics (frequency count)
3. Identify their areas of expertise
4. Select top 3 by frequency and depth

**Theme Analysis Template:**
```markdown
## Theme Analysis

### Topic Frequency Count
| Topic | Occurrences | Depth |
|-------|-------------|-------|
| [topic] | [count] | High/Medium/Low |

### Selected Themes
- Tier 3 (Primary): [theme] - [justification]
- Tier 4 (Secondary): [theme] - [justification]
- Tier 5 (Tertiary): [theme] - [justification]
```

### Quality Gate: Reconnaissance

- [ ] All source files inventoried with word counts
- [ ] Reference agent signature_phrases section reviewed
- [ ] Three main themes identified for Tiers 3-5
- [ ] Tier names customized to copywriter's domains
- [ ] Source priority order established

---

## PHASE 2: PHRASE IDENTIFICATION

### Step 2.1: Signature Phrase Criteria

**A signature phrase MUST be:**

| Criterion | Definition | Test Question |
|-----------|------------|---------------|
| Standalone | Makes sense without context | "Can I understand this phrase alone?" |
| Memorable | Sticks in your mind | "Would I remember this tomorrow?" |
| Original | Distinctly theirs, not generic | "Could anyone say this, or just them?" |
| Quotable | Something you'd cite or share | "Would I post this as a quote?" |
| Repeatable | Appears multiple times OR too good to ignore | "Have I seen this elsewhere?" |

**A signature phrase must NOT be:**

| Disqualifier | Example | Why Rejected |
|--------------|---------|--------------|
| Generic advice | "Work hard and succeed" | Anyone could say this |
| Incomplete thought | "And that's why..." | Requires context |
| Overly technical | "The CTR optimization protocol" | No punch, no personality |
| Factual statement | "Email open rates average 20%" | No personality |
| Too long | 30+ word statement | Not quotable |
| Common cliché | "Time is money" | Not original |

### Step 2.2: The Attribution Test

**The Ultimate Uniqueness Test:**

> Remove the speaker's name - would you still know who said it?

- **YES** → Strong signature phrase candidate
- **MAYBE** → Secondary candidate, needs context
- **NO** → Generic statement, REJECT

**Attribution Test Examples:**

| Phrase | Attribution Test | Result |
|--------|------------------|--------|
| "Money is attracted to speed." | Recognizable as Kennedy | ✅ PASS |
| "Work hard every day." | Could be anyone | ❌ FAIL |
| "The fortune is in the follow-up." | Recognizable as Kennedy | ✅ PASS |
| "Marketing is important." | Generic | ❌ FAIL |

### Step 2.3: Extraction Process

For each source file, extract candidate phrases:

**Extraction Template:**
```markdown
## [Source File Name]

### File Metadata
- Type: [Article/Transcript/Interview]
- Word Count: [N]
- Date: [YYYY-MM-DD]

### Candidate Phrases

| # | Phrase | Tier Candidate | Quotability Score | Notes |
|---|--------|----------------|-------------------|-------|
| 1 | "Exact quote from source" | 1-7 | 1-10 | [Context/usage notes] |
| 2 | "Another phrase" | 1-7 | 1-10 | [Notes] |
```

**Extraction Rules:**
1. Copy phrases EXACTLY as written (preserve voice)
2. Note the context where it appears
3. Tag with candidate tier (can change later)
4. Apply quotability score (see Step 2.5)
5. Err on side of over-extraction (filter later)

### Step 2.4: Frequency Analysis

Cross-reference phrases across all sources:

**Frequency Tracking Template:**
```markdown
## Frequency Analysis

| Phrase | S1 | S2 | S3 | S4 | S5 | Total | Tier |
|--------|----|----|----|----|----| ------|------|
| "[phrase]" | ✓ | ✓ | - | ✓ | - | 3 | 2 |
| "[phrase]" | ✓ | ✓ | ✓ | ✓ | ✓ | 5 | 1 |
```

**Frequency-to-Tier Mapping:**
```
5+ occurrences  → Tier 1 candidate (Core Mantra)
3-4 occurrences → Tier 2-3 candidate (Methodology/Theme)
2 occurrences   → Tier 4-6 candidate (based on quality)
1 occurrence    → Tier 7 only (if exceptionally quotable)
```

### Step 2.5: Quotability Assessment

Score each candidate phrase:

**Quotability Scoring Rubric:**

| Factor | 1 Point | 2 Points |
|--------|---------|----------|
| Brevity | 16-25 words | Under 15 words |
| Rhythm | Adequate flow | Natural, memorable cadence |
| Imagery | Abstract concept | Vivid mental picture |
| Surprise | Expected phrasing | Unexpected word choice |
| Truth | Reasonable insight | Profound, resonant wisdom |

**Scoring Template:**
```
Phrase: "[candidate phrase]"

Brevity (1-2):  ___
Rhythm (1-2):   ___
Imagery (1-2):  ___
Surprise (1-2): ___
Truth (1-2):    ___

TOTAL: ___ / 10

TIER RECOMMENDATION:
- 8-10 = Tier 1-2 candidate
- 6-7  = Tier 3-5 candidate
- 4-5  = Tier 6-7 candidate
- <4   = REJECT
```

### Step 2.6: Contrast Analysis

Compare phrases against baseline to ensure distinctiveness:

**Distinctiveness Score Formula:**
```
Distinctiveness = (Target Usage - Baseline Usage) / Baseline Variance

Score > 2.0  = Highly distinctive (signature phrase candidate)
Score 1.0-2.0 = Moderately distinctive (secondary candidate)
Score < 1.0  = Generic (REJECT)
```

**Contrast Questions:**
1. Do competitors say this? (If yes, -2 points)
2. Is this in generic marketing advice? (If yes, -2 points)
3. Would a student immediately attribute this? (If yes, +2 points)
4. Does this use their distinctive vocabulary? (If yes, +2 points)

### Quality Gate: Identification

- [ ] 80+ candidate phrases identified (to filter to 42)
- [ ] All source files processed
- [ ] Frequency tracked across sources
- [ ] No duplicate phrases in candidate list
- [ ] Quotability scores assigned
- [ ] Attribution test applied to all candidates

---

## PHASE 3: TIER CLASSIFICATION

### Step 3.1: Tier 1 Selection (Core Mantras)

Select 5-7 phrases that represent the copywriter's CORE philosophy.

**Selection Process:**
1. Sort candidates by frequency (highest first)
2. Filter for attribution test PASS
3. Verify quotability score 8+
4. Check theme independence (works across all topics)
5. Select top 5-7

**Tier 1 Selection Criteria:**
- [ ] Highest frequency across sources
- [ ] Would be recognized as "their thing"
- [ ] Appears in multiple contexts
- [ ] Foundation of their worldview
- [ ] Others quote this phrase

**Verification Test:** "If someone heard only these 5-7 phrases, would they understand this person's core message?"

### Step 3.2: Tier 2 Selection (Methodology Pillars)

Select 5-7 phrases about their PROCESS and APPROACH.

**Selection Process:**
1. Filter remaining candidates for methodology focus
2. Look for "how I do it" language
3. Identify framework-introducing phrases
4. Select phrases that differentiate their approach

**Tier 2 Selection Criteria:**
- [ ] Explains how they work
- [ ] Differentiates their methodology
- [ ] Process-oriented language
- [ ] "My approach is..." type statements

**Verification Test:** "Do these phrases explain HOW this person achieves results?"

### Step 3.3: Tiers 3-5 Selection (Theme-Specific)

For each theme (Primary, Secondary, Tertiary), select 6-8 phrases.

**Selection Process for Each Theme:**
1. Filter candidates by theme relevance
2. Look for domain-specific vocabulary
3. Prioritize actionable wisdom
4. Balance tactical and strategic phrases

**Theme Selection Criteria (apply to each):**
- [ ] Directly about [theme]
- [ ] Domain-specific wisdom
- [ ] Actionable within domain
- [ ] Shows expertise depth

**Verification Test:** "Would these phrases help someone specifically with [theme]?"

### Step 3.4: Tier 6 Selection (Philosophy & Mindset)

Select 5-7 phrases about LIFE, SUCCESS, and MINDSET.

**Selection Process:**
1. Filter for non-tactical phrases
2. Look for life wisdom and worldview
3. Identify contrarian or inspirational statements
4. Select phrases that reveal character

**Tier 6 Selection Criteria:**
- [ ] Transcends tactical advice
- [ ] Shows deeper wisdom
- [ ] Often inspirational or contrarian
- [ ] Reveals worldview

**Verification Test:** "Are these phrases about success/life, not just the craft?"

### Step 3.5: Tier 7 Selection (Tactical & Situational)

Select 5-7 phrases for SPECIFIC SITUATIONS.

**Selection Process:**
1. Filter for "when X, do Y" format
2. Identify common scenario responses
3. Look for actionable specificity
4. Select most versatile situations

**Tier 7 Selection Criteria:**
- [ ] "When X happens, do Y" format
- [ ] Specific and actionable
- [ ] Addresses common scenarios
- [ ] Practical application

**Verification Test:** "Can someone use this phrase in a specific situation?"

### Step 3.6: Distribution Validation

Verify balanced tier distribution:

**Distribution Requirements:**

| Tier | Minimum | Maximum | Ideal |
|------|---------|---------|-------|
| Tier 1 | 5 | 7 | 6 |
| Tier 2 | 5 | 7 | 6 |
| Tier 3 | 6 | 8 | 7 |
| Tier 4 | 6 | 8 | 7 |
| Tier 5 | 6 | 8 | 7 |
| Tier 6 | 5 | 7 | 6 |
| Tier 7 | 5 | 7 | 6 |
| **TOTAL** | **38** | **52** | **45** |

### Quality Gate: Classification

- [ ] Tier 1: 5-7 phrases selected
- [ ] Tier 2: 5-7 phrases selected
- [ ] Tier 3: 6-8 phrases selected
- [ ] Tier 4: 6-8 phrases selected
- [ ] Tier 5: 6-8 phrases selected
- [ ] Tier 6: 5-7 phrases selected
- [ ] Tier 7: 5-7 phrases selected
- [ ] Total: 42+ phrases
- [ ] No duplicates across tiers
- [ ] Balanced distribution verified

---

## PHASE 4: DOCUMENTATION

### Step 4.1: The 4-Field Documentation Standard

For each selected phrase, document with exactly 4 fields:

```yaml
- phrase: "The exact phrase in original language"
  context: "When, why, and how to use this phrase - specific guidance (15+ words)"
  usage: "Specific trigger situation (5-15 words)"
  source: "Source file or 'Multiple sources' for high-frequency"
```

### Step 4.2: Context Field Guidelines

The `context` field is CRITICAL for proper phrase usage.

**Context MUST Answer:**
1. **WHEN** to use this phrase (trigger situation)
2. **WHY** this phrase works (persuasion mechanism)
3. **HOW** to integrate (copy type, placement)

**Good Context Examples:**

```yaml
# GOOD - Specific and actionable
context: "Use when explaining why short-term thinking fails. Works well in sales pages when addressing instant gratification objections. Particularly effective after describing the 'easy way' that doesn't work."

context: "Deploy when prospect expresses price hesitation. Reframes the investment as speed-to-results. Most powerful in high-ticket sales conversations or webinar closes."

context: "Use to open sales letters or emails when audience has been burned before. Establishes credibility by acknowledging their skepticism. Works with Unaware and Problem-Aware audiences."
```

**Bad Context Examples:**

```yaml
# BAD - Too vague
context: "Business advice"
context: "Use in marketing"
context: "For sales"
context: "When relevant"
```

**Context Word Count:**
- Minimum: 15 words
- Ideal: 25-40 words
- Maximum: 60 words

### Step 4.3: Source Attribution Standards

**Source Field Formats:**

1. **Single Source:**
   ```yaml
   source: "The Ultimate Sales Letter, Chapter 7"
   ```

2. **Multiple Sources (High Frequency):**
   ```yaml
   source: "Multiple sources: No B.S. Direct Marketing, GKIC seminars, interviews"
   ```

3. **Specific Reference:**
   ```yaml
   source: "Interview with Joe Polish, 2019"
   ```

### Step 4.4: Complete Tier Documentation

**Tier Documentation Template:**

```yaml
tier_N_[tier_name]:
  frequency: "[use_every_piece|weekly|per_topic_context|monthly|as_needed]"
  description: "[What this tier represents - 10-20 words]"
  phrases:
    - phrase: "[Exact phrase]"
      context: "[15-40 words describing when/why/how]"
      usage: "[5-15 word trigger]"
      source: "[Source attribution]"
```

### Step 4.5: Compile Final Document

Use template: `templates/signature-phrases-tmpl.yaml`

**Complete Output Structure:**

```yaml
signature_phrases:
  metadata:
    copywriter: "[Full Name]"
    extraction_date: "YYYY-MM-DD"
    total_phrases: [N]
    source_files_processed: [N]
    version: "2.0.0"

  tier_1_core_mantras:
    frequency: "use_every_piece"
    description: "The copywriter's most iconic, repeated beliefs"
    phrases:
      - phrase: "..."
        context: "..."
        usage: "..."
        source: "..."
      # 5-7 total

  tier_2_methodology_pillars:
    frequency: "weekly"
    description: "Key phrases about their process and approach"
    phrases:
      - phrase: "..."
        context: "..."
        usage: "..."
        source: "..."
      # 5-7 total

  tier_3_[primary_theme]:
    frequency: "per_topic_context"
    description: "Domain-specific wisdom about [theme]"
    phrases:
      # 6-8 total

  tier_4_[secondary_theme]:
    frequency: "per_topic_context"
    description: "Domain-specific wisdom about [theme]"
    phrases:
      # 6-8 total

  tier_5_[tertiary_theme]:
    frequency: "per_topic_context"
    description: "Domain-specific wisdom about [theme]"
    phrases:
      # 6-8 total

  tier_6_philosophy_mindset:
    frequency: "monthly"
    description: "Deeper wisdom about life, success, and thinking"
    phrases:
      # 5-7 total

  tier_7_tactical_situational:
    frequency: "as_needed"
    description: "Specific advice for specific situations"
    phrases:
      # 5-7 total
```

### Quality Gate: Documentation

- [ ] All phrases follow 4-field structure
- [ ] All context fields are 15+ words
- [ ] All context fields are specific (not vague)
- [ ] All sources are identified
- [ ] YAML syntax validated
- [ ] Tier descriptions complete
- [ ] Frequency guidelines included

---

## PHASE 5: VALIDATION

### Step 5.1: Uniqueness Validation

For each phrase, verify uniqueness:

**Uniqueness Checklist:**
- [ ] Not a generic statement (sounds like them specifically)
- [ ] Not a common cliché reworded
- [ ] Has distinctive vocabulary/phrasing
- [ ] Passes attribution test

**Uniqueness Test Process:**
1. Read phrase without context
2. Ask: "Who said this?"
3. If answer is immediate and correct → PASS
4. If answer is uncertain → REVIEW
5. If answer is "anyone" → REPLACE

### Step 5.2: Coverage Validation

Verify the phrases cover all aspects of the copywriter:

**Coverage Checklist:**
- [ ] Core philosophy represented (Tier 1)
- [ ] Methodology explained (Tier 2)
- [ ] All major themes covered (Tiers 3-5)
- [ ] Tactical applications included (Tier 7)
- [ ] Deeper wisdom present (Tier 6)

**Coverage Test:** "Could you write diverse content using only these phrases?"

### Step 5.3: Authenticity Validation

Compare against reference agent (dan-kennedy.md):

**Authenticity Checklist:**
- [ ] Similar depth of context fields
- [ ] Similar source attribution quality
- [ ] Similar tier distribution
- [ ] Comparable phrase quality
- [ ] Voice consistency throughout

### Step 5.4: Deduplication Validation

Verify no semantic duplicates:

**Deduplication Checklist:**
- [ ] No phrase appears twice
- [ ] No phrases that say the same thing differently
- [ ] Each phrase adds unique value
- [ ] No near-synonyms across tiers

**Deduplication Test:**
1. Compare each phrase to all others
2. Flag phrases with >70% semantic similarity
3. Keep only the stronger version
4. Verify each adds unique value

### Step 5.5: Consistency Validation

Verify internal consistency:

**Consistency Rules:**
- Tier 1 phrases should never contradict each other
- Tier 2 phrases should reinforce methodology
- Theme phrases (3-5) should stay within domain
- Philosophy (Tier 6) should reflect worldview
- Tactical (Tier 7) should be actionable

### Quality Gate: Validation

- [ ] All uniqueness checks passed
- [ ] Coverage is comprehensive
- [ ] Authenticity verified vs reference
- [ ] No duplicates found
- [ ] Consistency verified
- [ ] Total count is 42+

---

## PHASE 6: AI INTEGRATION

### Step 6.1: Phrase Usage Frequency

Optimal usage frequencies for AI agents:

| Tier | Frequency | AI Implementation |
|------|-----------|-------------------|
| Tier 1 | Every piece | Include 1-2 in any output |
| Tier 2 | Weekly | Include when discussing methodology |
| Tier 3-5 | Per topic | Include when topic is relevant |
| Tier 6 | Monthly | Include for depth/philosophy |
| Tier 7 | As needed | Include for specific situations |

### Step 6.2: Context-Aware Selection Algorithm

**Selection Process for AI Agent:**
```
1. Identify output context (sales page, email, social post)
2. Determine primary topic
3. Check for situational triggers
4. Select phrases from appropriate tiers:
   - Always: 1 from Tier 1
   - If methodology discussed: 1 from Tier 2
   - If topic X: 1-2 from relevant Tier 3-5
   - If philosophical content: 1 from Tier 6
   - If specific situation: 1 from Tier 7
5. Verify no conflicts between selected phrases
6. Integrate naturally into output
```

### Step 6.3: The 3-Layer Voice Model

**Voice Layer Structure:**
1. **Foundation Layer** - Tier 1 mantras (always present)
2. **Contextual Layer** - Tier 2-5 phrases (topic-dependent)
3. **Situational Layer** - Tier 6-7 phrases (occasion-dependent)

**Layer Integration Rules:**
- Foundation layer establishes voice identity
- Contextual layer adds relevant expertise
- Situational layer provides specific guidance

---

## OUTPUT SPECIFICATION

### File Location
```
outputs/minds/{slug}/analysis/signature-phrases.yaml
```

### Required Sections

1. **Metadata Header**
   - Copywriter name
   - Extraction date
   - Total phrase count
   - Source files processed
   - Version number

2. **Tier 1: Core Mantras** (5-7 phrases)
   - frequency: "use_every_piece"

3. **Tier 2: Methodology Pillars** (5-7 phrases)
   - frequency: "weekly"

4. **Tier 3: [Primary Theme]** (6-8 phrases)
   - frequency: "per_topic_context"

5. **Tier 4: [Secondary Theme]** (6-8 phrases)
   - frequency: "per_topic_context"

6. **Tier 5: [Tertiary Theme]** (6-8 phrases)
   - frequency: "per_topic_context"

7. **Tier 6: Philosophy & Mindset** (5-7 phrases)
   - frequency: "monthly"

8. **Tier 7: Tactical & Situational** (5-7 phrases)
   - frequency: "as_needed"

### YAML Validation Checklist

Before saving, verify:
- [ ] Valid YAML syntax
- [ ] All required fields present
- [ ] No empty values
- [ ] Proper indentation (2 spaces)
- [ ] Quotes around phrases with special characters
- [ ] No duplicate keys

---

## FINAL CHECKLIST

### Phase Completion
- [ ] Phase 1: Reconnaissance complete
- [ ] Phase 2: 80+ candidates identified
- [ ] Phase 3: 42+ phrases classified into 7 tiers
- [ ] Phase 4: All phrases documented with context
- [ ] Phase 5: Validation passed
- [ ] Phase 6: AI integration guidelines applied

### Quality Standards
- [ ] Minimum 42 phrases total
- [ ] All 7 tiers populated
- [ ] Each phrase has all 4 fields
- [ ] No duplicate phrases
- [ ] Phrases are genuinely quotable (not generic)
- [ ] Context is specific and actionable (15+ words)
- [ ] YAML syntax validated

### Distinctiveness Test
- [ ] Phrases sound like the copywriter (not generic)
- [ ] Cover all major themes
- [ ] Include both famous and lesser-known gems
- [ ] Mix of tactical and philosophical
- [ ] Pass attribution test (would know who said it)

---

## TROUBLESHOOTING

### Issue: Not Enough Phrases Found

**Symptoms:** Can't reach 42 quality phrases

**Solutions:**
1. Review source files for indirect quotes (paraphrased wisdom)
2. Look for repeated concepts expressed differently
3. Check interviews/transcripts for spoken patterns
4. Supplement with social media/short-form content
5. Mine Q&A sessions and audience interactions
6. Look for phrases others quote when discussing them

### Issue: Too Many Similar Phrases

**Symptoms:** Multiple phrases saying the same thing

**Solutions:**
1. Keep the most memorable version only
2. Merge similar phrases into one
3. Choose based on frequency (most repeated wins)
4. Select based on quotability score
5. Consider tier placement differences

### Issue: Phrases Feel Generic

**Symptoms:** Phrases could be said by anyone

**Solutions:**
1. Look for unique vocabulary
2. Find more specific versions
3. Add context that shows uniqueness
4. Replace with more distinctive alternatives
5. Apply attribution test more rigorously

### Issue: Unbalanced Tier Distribution

**Symptoms:** Some tiers have too many/few phrases

**Solutions:**
1. Re-evaluate tier assignments
2. Some phrases may fit multiple tiers—choose strategically
3. If a theme is weak, consider merging with another
4. Adjust tier themes to match source material better
5. Mine underrepresented themes more deeply

### Issue: Vague Context Fields

**Symptoms:** Context doesn't guide usage effectively

**Solutions:**
1. Ask: "When exactly would I use this?"
2. Add specific copy types (sales page, email, etc.)
3. Include trigger situations
4. Explain why the phrase works
5. Reference the reference agent for context quality

### Issue: YAML Syntax Errors

**Symptoms:** Parser errors when loading file

**Solutions:**
1. Check indentation (use 2 spaces, not tabs)
2. Quote phrases with colons, brackets, or special characters
3. Validate with online YAML validator
4. Check for missing dashes in lists
5. Verify no duplicate keys

---

## USAGE

To execute this task:

```
*task extract-signature-phrases
```

Then provide:
1. Copywriter name
2. Source directory path
3. Three main themes for Tiers 3-5

---

## APPENDIX A: Quick Reference Templates

### Phrase Extraction Template
```markdown
| Phrase | Frequency | Quotability | Tier | Include? |
|--------|-----------|-------------|------|----------|
| "[phrase]" | [1-5+] | [1-10] | [1-7] | [Y/N] |
```

### Context Writing Template
```
[WHEN]: Use when [specific trigger situation].
[WHY]: Works because [persuasion mechanism].
[HOW]: Best in [copy type] when [placement guidance].
```

### Tier Assignment Matrix
```
                 Frequency  Quotability  Theme-Specific
Tier 1           5+         8-10         No
Tier 2           3-4        7-9          Process
Tier 3-5         2-4        6-8          Yes (by theme)
Tier 6           1-3        6-8          Philosophy
Tier 7           1-2        5-7          Situational
```

---

## APPENDIX B: Example Phrases by Tier

### Tier 1 Examples (Core Mantras)
- "Money is attracted to speed." - Dan Kennedy
- "Enter the conversation already happening in the customer's mind." - Robert Collier
- "The customer is not a moron. She is your wife." - David Ogilvy

### Tier 2 Examples (Methodology)
- "The fortune is in the follow-up." - Dan Kennedy
- "Research is the infallible cure for writer's block." - Eugene Schwartz
- "Write to one person, not to millions." - Gary Halbert

### Tier 3-5 Examples (Theme-Specific)
- "There will ALWAYS be an offer." - Kennedy (Direct Response)
- "The first sentence should make you want to read the second." - Schwartz (Headlines)
- "Pile on the testimonials." - Halbert (Proof)

### Tier 6 Examples (Philosophy)
- "There is no nobility in poverty." - Dan Kennedy
- "Advertising is fundamentally persuasion." - David Ogilvy
- "The only purpose of advertising is to make sales." - Claude Hopkins

### Tier 7 Examples (Situational)
- "If you need to think about it, the answer is no." - Kennedy (Objection handling)
- "When in doubt, test." - Hopkins (Uncertainty)
- "Use the reader's name as often as possible." - Halbert (Personalization)

---

*CopywriterOS Task v2.0.0*
*Upgrade Date: 2026-01-23*
*Part of the AIOX Squad System*
*Lines: 680+*
