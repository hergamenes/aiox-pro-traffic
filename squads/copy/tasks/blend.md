---
task: Blend Task - Copy Style Blending Master Protocol
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

# Blend Task - Copy Style Blending Master Protocol

## Meta

```yaml
task_id: blend
version: 2.0.0
category: copy_creation
complexity: advanced
estimated_time: 45-90 min
dependencies:
  - extract-communication-dna.md
  - extract-frameworks.md
related_agents:
  - copy-chief.md
  - All copywriter agents
research_source: docs/research/copy-blending-methodology-research.md
```

---

## Purpose

Create hybrid copy by strategically combining elements from 2-4 copywriters, resulting in unique pieces that capture the best attributes of each source while maintaining coherence, flow, and a distinct unified voice.

**Core Philosophy:** Copy blending is a measurable science, not an art. Using the Seven-Dimensional Voice Profile system, any blend can be calculated, executed, and validated with precision.

---

## When to Use

### Ideal Use Cases

| Situation | Why Blending Works |
|-----------|-------------------|
| No single copywriter matches needs 100% | Combine complementary strengths |
| Creating unique brand voice | Differentiate from pure styles |
| High-stakes copy needing multiple persuasion layers | Layer different techniques |
| Bridging classic and modern audiences | Combine eras appropriately |
| Premium products needing credibility + warmth | Blend Ogilvy sophistication + Halbert connection |
| Launch campaigns in saturated markets | Combine awareness (Schwartz) + urgency (Kennedy) |
| VSL with strong story component | Blend Benson structure + Halbert narrative |
| Long-form with hypnotic bullets | Combine Bencivenga fascinations + Sugarman flow |

### When NOT to Use

- Simple, straightforward copy (use single copywriter)
- Time-constrained projects (blending takes longer)
- Brand with established voice (match existing, don't blend)
- Client specifically requests one copywriter style
- Learning copywriting (master singles before blending)

---

## Inputs

```yaml
required:
  copywriters:
    type: array
    min: 2
    max: 4
    description: List of copywriters to blend
    example: ["gary_halbert", "david_ogilvy"]

  proportions:
    type: object
    constraint: Must sum to 100%
    description: Weight of each copywriter's influence
    example:
      gary_halbert: 60
      david_ogilvy: 40

  copy_type:
    type: enum
    options:
      - sales_page
      - landing_page
      - email
      - email_sequence
      - vsl_script
      - ad_copy
      - headline_set
      - lead_magnet
      - upsell_page
      - webinar_script
    description: Type of copy to create

  briefing:
    type: object
    required_fields:
      - product_name
      - product_description
      - target_audience
      - primary_benefit
      - price_point
      - desired_action

optional:
  primary_copywriter:
    type: string
    description: Copywriter who defines base structure (defaults to highest proportion)

  blend_focus:
    type: enum
    options:
      - voice_only        # Only blend tone and vocabulary
      - structure_only    # Only blend organizational patterns
      - techniques_only   # Only blend specific tactics
      - all               # Full integration (default)
    default: all

  section_assignment:
    type: object
    description: Assign specific copywriters to specific sections
    example:
      headline: david_ogilvy
      lead: gary_halbert
      body: blend
      close: gary_halbert

  output_length:
    type: enum
    options: [short, medium, long]
    default: medium

  audience_sophistication:
    type: enum
    options: [unaware, problem_aware, solution_aware, product_aware, most_aware]
    description: Schwartz awareness level of target audience
```

---

## The Seven-Dimensional Voice Profile System

### Core Dimensions

Every copywriter's voice is mapped across seven measurable dimensions:

```
STRUCTURAL DIMENSIONS (WTF Framework)
├── Vocabulary Level (1-10)
│   1 = Simple, everyday words (Grade 4)
│   5 = Accessible professional (Grade 8)
│   10 = Sophisticated, complex (Grade 12+)
│
├── Tone Warmth (1-10)
│   1 = Cold, clinical, distant
│   5 = Professional, balanced
│   10 = Warm, personal, intimate
│
└── Cadence Complexity (1-10)
    1 = Short sentences, staccato rhythm
    5 = Mixed lengths, varied rhythm
    10 = Long, flowing, complex structures

EMOTIONAL DIMENSIONS (NN/G Framework)
├── Formality (1-10)
│   1 = Very casual, conversational
│   5 = Business casual
│   10 = Formal, polished
│
├── Humor (1-10)
│   1 = Completely serious
│   5 = Occasional wit
│   10 = Frequent jokes/playfulness
│
├── Respectfulness (1-10)
│   1 = Irreverent, provocative
│   5 = Balanced
│   10 = Highly respectful, deferential
│
└── Enthusiasm (1-10)
    1 = Matter-of-fact, detached
    5 = Engaged but controlled
    10 = High energy, excited
```

### Pre-Built Copywriter Profiles

#### Gary Halbert Profile

```yaml
copywriter: gary_halbert
era: 1971-2007
specialty: Direct mail, sales letters, storytelling

dimensions:
  vocabulary_level: 4      # Simple, everyday language
  tone_warmth: 9           # Very warm, personal
  cadence_complexity: 3    # Short sentences, staccato
  formality: 2             # Very casual
  humor: 7                 # Frequently funny
  respectfulness: 5        # Direct but not rude
  enthusiasm: 8            # High energy

structural_markers:
  avg_sentence_length: 8-12 words
  paragraph_style: Single sentence paragraphs
  headline_formula: "How [person] [achieved result]"
  formatting: Heavy underlining, handwritten feel

signature_elements:
  opening: "Dear Friend" or "Dear [specific reader]"
  personal_stories: Frequent (family, failures, successes)
  urgency_style: Natural scarcity, limited offers
  closing: Direct ask + personal sign-off

vocabulary:
  power_words:
    - amazing
    - secret
    - discover
    - now
    - listen
    - frankly
  transitions:
    - "Here's the deal"
    - "Let me explain"
    - "Here's what I mean"
    - "And get this"
  forbidden:
    - heretofore
    - utilize
    - leverage (as verb)
    - passive constructions
```

#### David Ogilvy Profile

```yaml
copywriter: david_ogilvy
era: 1948-1999
specialty: Brand advertising, long-form, research-based

dimensions:
  vocabulary_level: 8      # Sophisticated, educated
  tone_warmth: 5           # Professional, not cold
  cadence_complexity: 7    # Complex, flowing sentences
  formality: 8             # Formal, polished
  humor: 3                 # Occasional dry wit
  respectfulness: 9        # Very respectful
  enthusiasm: 4            # Understated confidence

structural_markers:
  avg_sentence_length: 18-25 words
  paragraph_style: Dense, logical paragraphs
  headline_formula: "[Number] ways to [benefit]" or "How to [specific result]"
  formatting: Clean, magazine-style layout

signature_elements:
  opening: Fact, research finding, or news hook
  personal_stories: Rare (brand/client stories instead)
  urgency_style: Implicit quality urgency
  closing: Elegant, soft close

vocabulary:
  power_words:
    - research
    - consumer
    - quality
    - brand
    - discover
    - proven
  transitions:
    - Moreover
    - Furthermore
    - In addition
    - The evidence suggests
  forbidden:
    - excessive exclamation marks
    - slang
    - colloquialisms
    - hype words
```

#### Eugene Schwartz Profile

```yaml
copywriter: eugene_schwartz
era: 1956-1995
specialty: Direct mail, awareness-based copy, desire amplification

dimensions:
  vocabulary_level: 6      # Accessible but precise
  tone_warmth: 6           # Balanced
  cadence_complexity: 6    # Varied, strategic
  formality: 5             # Middle ground
  humor: 2                 # Serious, focused
  respectfulness: 7        # Respects reader intelligence
  enthusiasm: 5            # Controlled passion

structural_markers:
  avg_sentence_length: 12-18 words
  paragraph_style: Medium paragraphs with strategic emphasis
  headline_formula: Adapted to awareness level
  formatting: Strategic bolding, subheads

signature_elements:
  opening: Desire identification
  personal_stories: Rare (market stories instead)
  urgency_style: Desire-driven urgency
  closing: Logical progression to action

vocabulary:
  power_words:
    - desire
    - mechanism
    - breakthrough
    - secret
    - discover
    - new
  transitions:
    - Because
    - That's why
    - The reason
    - Here's the proof
  forbidden:
    - maybe
    - might
    - weak modifiers
    - vague adjectives
```

#### Dan Kennedy Profile

```yaml
copywriter: dan_kennedy
era: 1976-present
specialty: Info-marketing, direct response, urgency

dimensions:
  vocabulary_level: 5      # Direct, accessible
  tone_warmth: 4           # Challenging, not warm
  cadence_complexity: 5    # Punchy with crescendos
  formality: 3             # Casual but authoritative
  humor: 5                 # Sarcastic, dry wit
  respectfulness: 3        # Provocative, challenging
  enthusiasm: 7            # High urgency energy

structural_markers:
  avg_sentence_length: 10-15 words
  paragraph_style: Bullet-heavy, scannable
  headline_formula: "The [Specific] Method That [Result]"
  formatting: Heavy bullets, boxes, callouts

signature_elements:
  opening: Contrarian statement or challenge
  personal_stories: Business stories, client examples
  urgency_style: Explicit deadlines, real scarcity
  closing: Strong CTA with deadline

vocabulary:
  power_words:
    - magnetic
    - irresistible
    - now
    - deadline
    - warning
    - exclusive
  transitions:
    - "Here's the point"
    - "Bottom line"
    - "The fact is"
    - "Let me be blunt"
  forbidden:
    - "might work"
    - "possibly"
    - wishy-washy qualifiers
    - "in my opinion"
```

#### Claude Hopkins Profile

```yaml
copywriter: claude_hopkins
era: 1900-1932
specialty: Scientific advertising, testing, specificity

dimensions:
  vocabulary_level: 7      # Educated but clear
  tone_warmth: 3           # Professional distance
  cadence_complexity: 6    # Methodical, measured
  formality: 9             # Very formal
  humor: 1                 # Completely serious
  respectfulness: 8        # Highly respectful
  enthusiasm: 3            # Matter-of-fact

structural_markers:
  avg_sentence_length: 15-20 words
  paragraph_style: Logical, structured
  headline_formula: Specific claim + proof hint
  formatting: Clean, functional

signature_elements:
  opening: Scientific claim or test result
  personal_stories: Test results, data stories
  urgency_style: Offer-driven, trial-based
  closing: Risk-reversal + clear action

vocabulary:
  power_words:
    - tested
    - proven
    - scientific
    - results
    - free trial
    - guaranteed
  transitions:
    - Tests show
    - We found
    - The evidence
    - Our research indicates
  forbidden:
    - superlatives without proof
    - emotional appeals without data
    - exaggeration
    - opinion statements
```

#### Jon Benson Profile

```yaml
copywriter: jon_benson
era: 2005-present
specialty: VSL inventor, video scripts, curiosity loops

dimensions:
  vocabulary_level: 5      # Conversational
  tone_warmth: 7           # Friendly, engaging
  cadence_complexity: 4    # Short, punchy for video
  formality: 2             # Very casual
  humor: 4                 # Occasional
  respectfulness: 6        # Balanced
  enthusiasm: 8            # High energy, hooks

structural_markers:
  avg_sentence_length: 8-15 words (video-optimized)
  paragraph_style: Very short, often single lines
  headline_formula: Curiosity + timeframe
  formatting: Script format, visual cues

signature_elements:
  opening: Curiosity hook, time promise
  personal_stories: Transformation stories
  urgency_style: Limited access, exclusive
  closing: Emotional + logical close

vocabulary:
  power_words:
    - discover
    - secret
    - reveal
    - next X minutes
    - warning
    - shocking
  transitions:
    - "What I'm about to show you"
    - "Here's the thing"
    - "But wait"
    - "Now pay attention"
  forbidden:
    - long complex sentences
    - academic language
    - passive voice
```

#### Gary Bencivenga Profile

```yaml
copywriter: gary_bencivenga
era: 1971-2003
specialty: Fascinations, bullets, headline mastery

dimensions:
  vocabulary_level: 7      # Precise, specific
  tone_warmth: 5           # Professional warmth
  cadence_complexity: 6    # Varied, rhythmic
  formality: 5             # Business professional
  humor: 3                 # Subtle wit
  respectfulness: 7        # Respectful of reader
  enthusiasm: 6            # Controlled excitement

structural_markers:
  avg_sentence_length: 12-20 words
  paragraph_style: Medium, bullet-heavy
  headline_formula: Curiosity + specificity + benefit
  formatting: Strategic bullets, subheads

signature_elements:
  opening: Provocative question or statement
  personal_stories: Case studies, results
  urgency_style: Scarcity of information
  closing: Soft close with irresistible offer

vocabulary:
  power_words:
    - secret
    - discover
    - revealed
    - hidden
    - overlooked
    - breakthrough
  transitions:
    - "What's more"
    - "Better yet"
    - "Here's the best part"
    - "Even more surprising"
  forbidden:
    - generic claims
    - unspecific benefits
    - vague language
```

#### Additional Copywriter Profiles

```yaml
# Joe Sugarman
joe_sugarman:
  dimensions: [5, 8, 5, 4, 6, 6, 7]  # V,W,C,F,H,R,E
  signature: Smooth flow, psychological triggers, storytelling
  best_for: Long-form with hypnotic flow

# John Carlton
john_carlton:
  dimensions: [4, 6, 3, 2, 7, 4, 8]
  signature: Simple writing, one-legged golfer, lizard brain
  best_for: Direct response, aggressive copy

# Ben Settle
ben_settle:
  dimensions: [4, 6, 3, 1, 7, 3, 8]
  signature: Daily email, 3X personality, infotainment
  best_for: Email sequences, personality-driven copy

# Andre Chaperon
andre_chaperon:
  dimensions: [5, 7, 5, 4, 3, 7, 5]
  signature: Soap opera sequences, open loops, Zeigarnik
  best_for: Email sequences, narrative-driven

# Stefan Georgi
stefan_georgi:
  dimensions: [6, 5, 5, 5, 3, 6, 6]
  signature: RMBC method, scale production, mechanisms
  best_for: VSL, sales pages, systematic approach

# Clayton Makepeace
clayton_makepeace:
  dimensions: [6, 7, 6, 4, 4, 5, 8]
  signature: Visceral copy, sensory language, health/finance
  best_for: Health, financial, emotional copy

# Robert Collier
robert_collier:
  dimensions: [6, 8, 6, 6, 3, 8, 6]
  signature: "Enter the conversation", 6 primary motives
  best_for: Letter writing, understanding reader psychology

# Parris Lampropoulos
parris_lampropoulos:
  dimensions: [6, 5, 5, 5, 2, 6, 5]
  signature: Bullet mastery, specificity + curiosity
  best_for: Fascinations, long-form, health niches
```

---

## Workflow

### Phase 1: Pre-Blend Analysis

#### Step 1.1: Validate Copywriter Selection

```
COMPATIBILITY CHECK:

1. Are the copywriters compatible?
   [ ] Voice profiles don't have extreme opposites (>6 gap on any dimension)
   [ ] Eras are compatible or bridged intentionally
   [ ] Styles serve the same goal (conversion, brand, engagement)

2. Is blending justified?
   [ ] No single copywriter achieves 100% of requirements
   [ ] Blend adds value (not just variety for variety's sake)
   [ ] Client/project benefits from hybrid approach

3. Is the blend realistic?
   [ ] Maximum 4 copywriters
   [ ] Clear proportion hierarchy (one is dominant, 60%+)
   [ ] Primary copywriter defines structure
```

**Compatibility Matrix Reference:**

| Blend | Compatibility | Best For |
|-------|--------------|----------|
| Halbert + Ogilvy | ★★★★☆ | Premium products with story |
| Halbert + Schwartz | ★★★★★ | Awareness-based storytelling |
| Halbert + Kennedy | ★★★★☆ | Direct urgency with warmth |
| Ogilvy + Schwartz | ★★★★☆ | Sophisticated theory |
| Ogilvy + Hopkins | ★★★★★ | Scientific elegance |
| Schwartz + Kennedy | ★★★★★ | Awareness + urgency |
| Benson + Halbert | ★★★★★ | VSL with story |
| Bencivenga + Sugarman | ★★★★☆ | Bullets with flow |
| Carlton + Halbert | ★★★★★ | Simple directness |

**Incompatible Blends (Avoid):**
- Hopkins + Kern (era collision)
- Ogilvy + Settle (formal vs ultra-casual)
- Schwartz + Settle (dense theory vs daily email)

#### Step 1.2: Calculate Target Profile

```
BLEND CALCULATION FORMULA:

For each dimension D:
D_blend = Σ (D_copywriter × weight_copywriter)

Example: Halbert (60%) + Ogilvy (40%)

Vocabulary:    (4 × 0.6) + (8 × 0.4) = 5.6 ≈ 6
Tone Warmth:   (9 × 0.6) + (5 × 0.4) = 7.4 ≈ 7
Cadence:       (3 × 0.6) + (7 × 0.4) = 4.6 ≈ 5
Formality:     (2 × 0.6) + (8 × 0.4) = 4.4 ≈ 4
Humor:         (7 × 0.6) + (3 × 0.4) = 5.4 ≈ 5
Respect:       (5 × 0.6) + (9 × 0.4) = 6.6 ≈ 7
Enthusiasm:    (8 × 0.6) + (4 × 0.4) = 6.4 ≈ 6

TARGET BLEND PROFILE:
[6, 7, 5, 4, 5, 7, 6]
```

#### Step 1.3: Create Vocabulary Guide

Compile merged vocabulary lists from selected copywriters:

```yaml
blended_vocabulary:

  power_words:
    from_halbert: [amazing, secret, discover, listen]
    from_ogilvy: [research, proven, quality]
    merged: [amazing, discover, research, proven, secret]

  transitions:
    from_halbert: ["Here's the deal", "Let me explain"]
    from_ogilvy: ["Moreover", "The evidence suggests"]
    merged: ["Here's what the research shows", "Let me explain what we found"]

  forbidden:
    all_sources: [heretofore, utilize, excessive hype, vague claims]

  bridging_phrases:
    # Phrases that work in BOTH styles
    - "The truth is..."
    - "What I discovered was..."
    - "Here's why this matters..."
    - "Consider this..."
```

### Phase 2: Structure Design

#### Step 2.1: Section Assignment

Determine which copywriter influences each section:

```yaml
section_assignment:

  # Option A: Proportional throughout
  proportional:
    every_section: blend_by_proportion

  # Option B: Section-specific assignment
  assigned:
    headline: copywriter_best_at_hooks
    lead: copywriter_best_at_engagement
    body: proportional_blend
    proof: copywriter_best_at_credibility
    close: copywriter_best_at_conversion

  # Option C: Dominant with touches
  dominant:
    base_structure: primary_copywriter
    accent_elements: secondary_copywriter
```

**Recommended Assignments by Copy Type:**

| Copy Type | Headline | Lead | Body | Proof | Close |
|-----------|----------|------|------|-------|-------|
| Sales Page | Ogilvy | Halbert | Blend | Ogilvy | Halbert |
| VSL | Benson | Benson | Blend | Bencivenga | Halbert |
| Email | Halbert | Halbert | Blend | Kennedy | Kennedy |
| Landing Page | Schwartz | Collier | Blend | Hopkins | Kennedy |
| Webinar Script | Benson | Halbert | Blend | Ogilvy | Kennedy |

#### Step 2.2: Transition Planning

Map how styles will flow between sections:

```
TRANSITION TYPES:

1. GRADUAL FADE
   Section A (100% Style 1)
   Transition ¶ (70% Style 1, 30% Style 2)
   Transition ¶ (50% / 50%)
   Transition ¶ (30% Style 1, 70% Style 2)
   Section B (100% Style 2)

2. SECTION BREAK
   Section A [Style 1]
   ─────────────────────
   Section B [Style 2]
   (Visual break justifies voice shift)

3. VOICE BRIDGING
   "Now that you understand [Style 1 content],
   let me share something different..." [Style 2]

4. PERSPECTIVE SHIFT
   "I" (personal, Style 1) →
   "You" (direct, transition) →
   "We" (collaborative, Style 2)
```

**Transition Phrase Library:**

| From → To | Bridging Phrase |
|-----------|-----------------|
| Casual → Formal | "Now, let me share some research that backs this up..." |
| Formal → Casual | "But here's what that really means for you..." |
| Story → Data | "And the numbers confirm what I experienced..." |
| Data → Story | "Let me tell you what those statistics actually look like in real life..." |
| Personal → Universal | "And I'm not alone. Thousands of people..." |
| Technical → Emotional | "Forget the jargon for a moment. Here's what this feels like..." |

#### Step 2.3: Identify Fusion Points

Find natural overlap areas where styles complement:

```
FUSION POINT ANALYSIS:

Halbert + Ogilvy Fusion Points:
├── Personal stories backed by data
├── Emotional appeals with research support
├── Direct address with professional credibility
├── Casual tone + specific statistics
└── Storytelling with factual precision

Schwartz + Kennedy Fusion Points:
├── Awareness-based urgency
├── Desire-driven deadlines
├── Mechanism-focused offers
├── Market sophistication + scarcity
└── Logical persuasion + action pressure

Benson + Halbert Fusion Points:
├── Video storytelling structure
├── Curiosity loops with narrative
├── Emotional hooks with personal appeal
├── VSL format with letter warmth
└── Pattern interrupt + relationship building
```

### Phase 3: Copy Creation

#### Step 3.1: Create Headline

Apply the dominant headline-writer's formula with blended vocabulary:

```
HEADLINE CREATION PROCESS:

1. Identify headline copywriter (from section_assignment)
2. Use their headline formula
3. Apply blended vocabulary
4. Verify dimensions match target profile
5. Test readability (should match target vocabulary level)

EXAMPLE: Halbert (60%) + Ogilvy (40%) for Course

Ogilvy formula: "How to [benefit] with [specific method]"
Halbert vocabulary: discovery, personal results
Ogilvy vocabulary: specific numbers, research

BLENDED HEADLINE:
"How 147 Unknown Writers Discovered the [RESULTADO_ESCALADO_EXEMPLO]
Copywriting Method (And How You Can Too)"

Verification:
- Specificity (Ogilvy): ✓ (147 writers, [RESULTADO_ESCALADO_EXEMPLO])
- Personal promise (Halbert): ✓ ("You Can Too")
- Grade level: 7 (target: 6) ✓
```

#### Step 3.2: Create Lead

Write opening section applying assigned copywriter's style:

```
LEAD CREATION PROCESS:

1. Identify lead copywriter
2. Select their lead pattern (story, fact, challenge, curiosity)
3. Write in their pure voice first
4. Add touches from secondary copywriter
5. Verify emotional dimensions match blend

EXAMPLE: Halbert lead with Ogilvy touches

PURE HALBERT:
"Dear Friend,

Let me tell you something crazy that happened last Tuesday.

I was sitting at my kitchen table, third cup of coffee going
cold, when my phone buzzed..."

WITH OGILVY TOUCHES:
"Dear Friend,

Let me tell you something that changed how I think about
copywriting forever.

I was reviewing the results from our latest test—147 writers,
all from different backgrounds—when the numbers stopped me cold.

The average wasn't supposed to be this high..."

Verification:
- Personal opening (Halbert): ✓
- Research reference (Ogilvy): ✓
- Warmth level: 7 (target) ✓
- Formality: 4 (target) ✓
```

#### Step 3.3: Create Body

Execute the proportional blend throughout main content:

```
BODY WRITING PROTOCOL:

For each paragraph:

1. DETERMINE PRIMARY INFLUENCE
   - What's the paragraph's purpose?
   - Which copywriter excels at this?
   - Default to proportion if unclear

2. WRITE FIRST DRAFT
   - Use primary copywriter's voice
   - Maintain their sentence structure
   - Use their vocabulary patterns

3. APPLY SECONDARY INFLUENCE
   - Add touches from other copywriter(s)
   - Replace some vocabulary
   - Adjust cadence if needed

4. VERIFY BLEND
   - Check against target dimensions
   - Ensure no "seams" visible
   - Read aloud for flow

PARAGRAPH-LEVEL BLEND EXAMPLE:

Purpose: Explain the mechanism
Primary: Ogilvy (clarity, credibility)
Secondary: Halbert (accessibility, warmth)

FIRST DRAFT (Pure Ogilvy):
"The methodology operates through a three-phase process.
First, we analyze your current patterns. Second, we identify
optimization opportunities. Third, we implement systematic
improvements based on empirical testing."

BLENDED VERSION (70% Ogilvy, 30% Halbert):
"Here's how the method actually works.

First, I look at what you're already doing. (No judgment—
just data collection.)

Second, I find the gaps—the places where small changes
create big results.

Third—and this is where it gets exciting—we implement
those changes based on what's actually tested and proven."

Changes applied:
- "Here's how" (Halbert transition)
- Shorter paragraphs (Halbert structure)
- Parenthetical asides (Halbert personality)
- "tested and proven" (Ogilvy credibility)
```

#### Step 3.4: Create Proof Section

Apply credibility-specialist copywriter's approach:

```
PROOF SECTION PATTERNS:

OGILVY-STYLE PROOF:
"Research conducted across 3,000 participants showed...
In controlled testing, the average improvement was 47%...
Dr. [Name], Professor at [University], noted that..."

HALBERT-STYLE PROOF:
"Let me tell you about Tom. Tom was a lot like you—
frustrated, skeptical, and down to his last [RESERVA_FINAL_EXEMPLO].
Six months later, Tom sent me this letter..."

KENNEDY-STYLE PROOF:
"Don't take my word for it. Here's what happened when
real business owners implemented this:
• John M. - [RESULTADO_EM_90_DIAS_EXEMPLO] in 90 days
• Sarah T. - 3X her revenue in 6 months
• Mike R. - Quit his job in 4 months"

BLENDED PROOF (Ogilvy 40% + Halbert 60%):
"Let me share something that surprised even me.

When we tested this with 147 writers—not professionals,
just regular people who wanted to learn—the average
income increase was [AUMENTO_MÉDIO_DE_RENDA_EXEMPLO] in 90 days.

But statistics don't capture what really happened.

Take Maria, a retired teacher from Ohio. She told me:
'I thought copywriting was for young people with marketing
degrees. I was wrong. Three months in, I earned more than
my monthly pension—from a single client.'"
```

#### Step 3.5: Create Close

Apply conversion-specialist copywriter's closing technique:

```
CLOSING PATTERNS BY COPYWRITER:

HALBERT CLOSE:
"Look, I've laid it all out for you.

You know what this is. You know what it costs.
You know what you could make.

The only question left is: are you going to do this?

Here's the link: [URL]

I hope to see your name on the other side.

Sincerely,
[Name]

P.S. Remember—the price goes up Friday at midnight."

KENNEDY CLOSE:
"Let me be blunt.

This offer expires in 72 hours. At midnight on Friday,
two things happen:

1. The price increases by [AUMENTO_DE_PREÇO_EXEMPLO]
2. The bonuses disappear

I'm not playing games. I don't do fake scarcity.

If you want in, now is the time.

Click here: [URL]

Warning: If you click and see a different price,
you're too late."

OGILVY CLOSE:
"We invite you to experience this yourself.

For a limited time, qualified applicants may apply for
consideration. Our team reviews each application
personally to ensure mutual fit.

To request an application: [URL]"

BLENDED CLOSE (Halbert 70% + Kennedy 30%):
"Okay, I've shown you everything.

The method. The results. The proof.

Now here's what happens next:

Click the button below and join before Friday at midnight.

Why the deadline? Simple—after Friday, I'm raising the
price by [AUMENTO_DE_PREÇO_EXEMPLO]. Not because I'm greedy. Because my time
is limited and I want serious people only.

Are you serious?

[JOIN NOW]

Sincerely,
[Name]

P.S. If you're still reading, you're interested. Trust that.
Click now. The worst thing that happens is you get a refund.
The best thing? Your life changes."
```

### Phase 4: Quality Validation

#### Step 4.1: Voice Consistency Audit

```yaml
VOICE AUDIT CHECKLIST:

vocabulary_consistency:
  [ ] Grade level consistent throughout (±1 level)
  [ ] Power words from correct copywriter(s)
  [ ] No forbidden words from any source
  [ ] Transitions match target profile
  [ ] Technical terms consistent
  [ ] Slang/colloquialisms at appropriate level

cadence_consistency:
  [ ] Sentence length varies within target range
  [ ] Paragraph structure matches template
  [ ] Punctuation frequency within parameters
  [ ] Formatting conventions followed
  [ ] Rhythm feels natural when read aloud

tone_consistency:
  [ ] Emotional tone maintained throughout
  [ ] Reader relationship consistent
  [ ] Humor level appropriate and even
  [ ] Formality level steady
  [ ] Enthusiasm matches target

blend_integrity:
  [ ] Proportions respected (can measure by technique count)
  [ ] Fusion points feel natural
  [ ] Transitions smooth (no jarring shifts)
  [ ] No visible "seams" between styles
  [ ] Overall voice feels unified, not patchwork
```

#### Step 4.2: Dimension Verification

Score the final copy against target profile:

```
DIMENSION SCORING:

Read the copy and rate each dimension 1-10.
Compare to calculated target profile.

Target Profile: [6, 7, 5, 4, 5, 7, 6]
Actual Score:   [_, _, _, _, _, _, _]

Acceptable variance: ±1 on any dimension
Concerning variance: ±2 on any dimension
Failure: ±3 or more on any dimension

If variance exceeds acceptable:
1. Identify sections causing drift
2. Rewrite those sections
3. Re-score and validate
```

#### Step 4.3: Read-Aloud Test

```
READ-ALOUD PROTOCOL:

1. Read entire piece aloud (or use text-to-speech)
2. Mark any points where you:
   - Stumble on phrasing
   - Feel a tone shift
   - Notice rhythm break
   - Sense style change

3. For each marked point:
   - Is it intentional (section break)?
   - Is it a blend failure (seam)?
   - Does it serve the reader?

4. Rewrite marked sections if they're blend failures
```

#### Step 4.4: Blind Test (Optional)

```
BLIND TEST PROTOCOL:

1. Show blended copy to 3 people familiar with copywriter styles
2. Ask them:
   - "Which copywriters influenced this piece?"
   - "What proportion would you estimate for each?"
   - "Where do you see each style most clearly?"

3. Score results:
   - Correct copywriter identification: Success
   - Proportion guess within ±15%: Success
   - Couldn't identify copywriters: Strong blend (potentially too blended)
   - Named wrong copywriters: Blend failure

4. Use feedback to calibrate future blends
```

### Phase 5: Documentation

#### Step 5.1: Generate DNA Analysis

Create detailed breakdown of the blend:

```markdown
## DNA Analysis

### Blend Summary
- **Primary Copywriter:** Gary Halbert (60%)
- **Secondary Copywriter:** David Ogilvy (40%)
- **Copy Type:** Sales Page
- **Target Audience:** Aspiring copywriters, problem-aware

### Target Profile vs. Actual
| Dimension | Target | Actual | Variance |
|-----------|--------|--------|----------|
| Vocabulary | 6 | 6 | 0 |
| Warmth | 7 | 7 | 0 |
| Cadence | 5 | 5 | 0 |
| Formality | 4 | 5 | +1 |
| Humor | 5 | 4 | -1 |
| Respect | 7 | 7 | 0 |
| Enthusiasm | 6 | 6 | 0 |

### Elements from Gary Halbert
- **Opening:** Personal letter format ("Dear Friend")
- **Storytelling:** Kitchen table scene, personal revelation
- **Vocabulary:** "crazy", "here's the deal", "look"
- **Structure:** Short paragraphs, conversational flow
- **Close:** Direct personal appeal, P.S. with urgency

### Elements from David Ogilvy
- **Headline:** Specific numbers (147 writers, [RESULTADO_ESCALADO_EXEMPLO])
- **Proof:** Research framework, data presentation
- **Credibility:** Institutional references, testing methodology
- **Vocabulary:** "research", "evidence", "participants"
- **Tone:** Underlying sophistication, professional credibility

### Fusion Points
- **Para 3:** Personal story supported by data
- **Para 7:** Emotional appeal with research citation
- **Proof section:** Story format with statistical backing
- **Close:** Personal warmth with specific deadline

### Transition Locations
- **After headline → lead:** Shift from data to personal
- **After proof → close:** Shift from evidence to appeal
- **P.S.:** Returns to pure Halbert energy
```

#### Step 5.2: Create Copywriter Markers

Annotate where each style appears:

```
COPYWRITER MARKERS:

[H] = Halbert element
[O] = Ogilvy element
[F] = Fusion point (both)

---

[O] "How 147 Unknown Writers Discovered the [RESULTADO_ESCALADO_EXEMPLO]
Copywriting Method (And How You Can Too)"

[H] Dear Friend,

[H] Let me tell you something [F] that changed how I think
about copywriting forever.

[F] I was reviewing the results from our latest test—
[O] 147 writers, all from different backgrounds—
[H] when the numbers stopped me cold.

[O] The average wasn't supposed to be this high...

[continues with markers throughout]
```

---

## Output Format

```yaml
format: markdown

sections:

  blend_summary:
    description: Overview of copywriters, proportions, rationale

  target_profile:
    description: Calculated seven-dimension blend profile

  vocabulary_guide:
    description: Merged vocabulary lists used

  section_assignments:
    description: Which copywriter influenced each section

  blended_copy:
    description: The final copy piece

  dna_analysis:
    description: Detailed breakdown of blend execution

  copywriter_markers:
    description: Annotated copy showing influences

  fusion_points:
    description: Where styles naturally merged

  quality_scores:
    description: Dimension verification results

  alternative_blend:
    description: Optional variant with different proportions
```

---

## Recommended Blend Combinations

### For Sales Pages

| Combination | Result | Best For |
|-------------|--------|----------|
| Halbert 70% + Ogilvy 30% | Warm storytelling with data credibility | Premium products |
| Schwartz 60% + Kennedy 40% | Awareness-calibrated with urgency | Saturated markets |
| Halbert 60% + Bencivenga 40% | Story with fascination bullets | Long-form |

### For VSLs

| Combination | Result | Best For |
|-------------|--------|----------|
| Benson 60% + Halbert 40% | VSL structure with personal warmth | Coaching offers |
| Benson 50% + Bencivenga 50% | Curiosity loops with power bullets | Supplement offers |
| Halbert 50% + Benson 50% | Story-driven video with hooks | Transformation offers |

### For Emails

| Combination | Result | Best For |
|-------------|--------|----------|
| Halbert 70% + Kennedy 30% | Personal with urgency | Launch sequences |
| Settle 60% + Halbert 40% | Infotainment with warmth | Daily emails |
| Chaperon 70% + Halbert 30% | Soap opera with personal touch | Nurture sequences |

### For Landing Pages

| Combination | Result | Best For |
|-------------|--------|----------|
| Schwartz 50% + Hopkins 50% | Awareness + scientific proof | Lead gen |
| Collier 60% + Kennedy 40% | Conversation entry + action | Opt-in pages |
| Ogilvy 60% + Halbert 40% | Elegant with personal appeal | High-ticket |

---

## Anti-Patterns (Avoid)

### The Frankenstein Effect

**Symptom:** Copy feels like disconnected pieces stitched together
**Cause:** No transition strategy, abrupt style switches
**Solution:** Use gradual fades, bridging phrases, consistent thread

### Identity Loss

**Symptom:** No distinct voice recognizable—bland, generic
**Cause:** Blending too many voices, or averaging to mediocrity
**Solution:** Limit to 2-3 copywriters, one dominant at 60%+

### Proportion Drift

**Symptom:** Promised 60/40 but delivered 90/10
**Cause:** Writer fatigue, defaulting to comfort zone
**Solution:** Measure after writing, count techniques from each source

### Seam Visibility

**Symptom:** Reader can feel exactly where style changes
**Cause:** Section-based blending without transitions
**Solution:** Use transition paragraphs, read aloud for smoothness

### Audience Whiplash

**Symptom:** Reader confused about who's "speaking"
**Cause:** Combining incompatible extremes
**Solution:** Check compatibility matrix, choose neighboring profiles

### Era Collision

**Symptom:** Anachronistic language, mixed-period feel
**Cause:** Blending 1920s Hopkins with modern Settle
**Solution:** Modernize classic voices before blending

---

## Examples

### Example 1: Premium Course Sales Page

**Blend:** Halbert (60%) + Ogilvy (40%)
**Target Profile:** [6, 7, 5, 4, 5, 7, 6]

```
HEADLINE:
How 147 Unknown Writers Made [RESULTADO_ESCALADO_EXEMPLO] Using This
Unusual Copywriting Method

LEAD:
Dear Friend,

Let me tell you something that changed everything I thought
I knew about teaching copywriting.

I was reviewing the results from our latest group—147 writers
from completely different backgrounds—when the numbers
stopped me cold.

The average wasn't supposed to be this high.

These weren't professionals. They were people just like you—
nurses, teachers, accountants, even a retired Marine sergeant
who "never wrote anything longer than an email."

Yet there they were. Averaging [AUMENTO_MÉDIO_DE_RENDA_EXEMPLO] in the first 90 days.

That's more than most copywriting courses promise after
a full year.

PROOF:
Let me share the data, then I'll tell you the stories behind it.

Across 147 participants over 18 months:
• Average income increase: [AUMENTO_MÉDIO_DE_RENDA_EXEMPLO] (90 days)
• Highest earner: [MELHOR_RESULTADO_EXEMPLO] (Maria, retired teacher, Ohio)
• Lowest earner: [MENOR_RESULTADO_EXEMPLO] (still 4X the course cost)
• Success rate: 89% earned at least [RESULTADO_MÍNIMO_EXEMPLO]

But numbers don't tell the whole story.

Let me tell you about Tom...

[continues with personal story backed by data]

CLOSE:
Look, I've laid everything out for you.

The method. The proof. The results.

Here's what happens next: click the button below and
join us before Friday at midnight.

Why the deadline? After Friday, two things happen.
The price goes up [AUMENTO_DE_PREÇO_EXEMPLO]. And the current bonuses disappear.

This isn't fake scarcity. It's how I run every launch.
Decisive people deserve better pricing.

Are you decisive?

[JOIN NOW - PREÇO_ATUAL]

Sincerely,
[Name]

P.S. Still reading? Good. That means you're interested
but cautious. I respect that. Here's what I'll do:
join now, go through the first module, and if you don't
see why this is different—get a full refund. No questions.
Your caution protected. Your opportunity secured.
```

### Example 2: VSL for Supplement

**Blend:** Benson (50%) + Bencivenga (50%)
**Target Profile:** [5, 7, 4, 2, 4, 6, 8]

```
HOOK (Benson):
What I'm about to show you in the next 12 minutes
could completely change how you experience energy.

But I have to warn you...

This isn't about caffeine. It's not about energy drinks.
And it definitely isn't what your doctor told you.

What you're about to discover goes against almost
everything you've been taught about tiredness.

FASCINATIONS (Bencivenga):
In the next few minutes, you'll discover:

• The "forgotten mineral" that doubled energy levels
  in a Johns Hopkins study—yet 87% of Americans are
  deficient (hint: it's not magnesium)

• Why your morning coffee actually DRAINS your energy
  by 2pm—and the 3-gram alternative that keeps you
  alert until bedtime without a single crash

• The bizarre discovery a sleep-deprived biochemist
  made at 3am that now helps him sleep 8 hours AND
  wake up more energized than he felt at 20

• How Olympic athletes are secretly abandoning energy
  drinks for a compound you can get at any grocery
  store (costs less than [CUSTO_SEMANAL_EXEMPLO] per week)

CLOSE (Blended):
You felt it, didn't you?

That spark of curiosity? That "wait, what?" moment?

That's exactly what you'll feel every single morning
when you wake up with natural, sustained energy
flowing through your body.

No crashes. No jitters. No afternoon slump.

Just clean, focused energy from the moment you open
your eyes until you decide it's time for bed.

Click below to discover the full protocol...

[REVEAL THE ENERGY SECRET]
```

---

## Blend Ratio Guidelines

### Two Copywriters

| Ratio | Description | Use When |
|-------|-------------|----------|
| **50/50** | Equal presence | Both styles equally important |
| **60/40** | One dominant, one supporting | Clear primary with enhancement |
| **70/30** | One dominant, subtle touches | Mostly one style with refinement |
| **80/20** | Almost single voice | Tiny accents from secondary |

### Three Copywriters

| Ratio | Description | Use When |
|-------|-------------|----------|
| **50/30/20** | Clear hierarchy | One primary, two supporting |
| **40/35/25** | Balanced with lead | Near-equal with slight dominance |
| **60/25/15** | Strong primary | One dominant, two accents |

### Four Copywriters (Use Sparingly)

| Ratio | Description | Use When |
|-------|-------------|----------|
| **40/25/20/15** | Clear hierarchy | Complex requirements |
| **35/30/20/15** | Softer hierarchy | Multiple equal needs |

---

## Quality Checklist

### Pre-Blend Validation
- [ ] Copywriters are compatible (no extreme gaps)
- [ ] Proportions defined and sum to 100%
- [ ] Primary copywriter identified
- [ ] Section assignments clear
- [ ] Transition strategy planned
- [ ] Vocabulary lists compiled
- [ ] Fusion points identified

### Post-Blend Quality Gates
- [ ] Dimension scores within ±1 of target
- [ ] Read-aloud test passed (no stumbles)
- [ ] No visible seams between styles
- [ ] Transitions feel natural
- [ ] Vocabulary consistent throughout
- [ ] Formatting matches plan
- [ ] DNA analysis documented

### Final Verification
- [ ] Copy achieves blend objectives
- [ ] Would pass blind test (style identification)
- [ ] Serves audience better than single style
- [ ] Client/project requirements met

---

## Notes

- Blend works best with 2-3 copywriters; 4 is maximum
- Always read the completed blend aloud
- Copywriters from similar eras blend more naturally
- The copywriter with highest proportion defines the "voice narrative"
- Transitions are the most critical points—invest time here
- Document everything for future reference and learning

---

## Related Tasks

- `extract-communication-dna.md` - Extract style DNA before blending
- `extract-frameworks.md` - Identify techniques to combine
- `audit-copy-hopkins.md` - Validate blended copy quality
- `create-copywriter-agent.md` - Create new copywriter profiles

---

## Related Checklists

- `voice-consistency-checklist.md` - Verify blend coherence
- `copy-quality-checklist.md` - General quality validation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial task |
| 2.0 | 2026-01-23 | Complete rewrite with 7-dimension framework, profiles, examples |

---

*Task Version: 2.0.0*
*Copy Framework v2.0 - Elite Copywriting Squad*
*Research Source: docs/research/copy-blending-methodology-research.md*
