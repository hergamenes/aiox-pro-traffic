---
task: Build Authority Arsenal - Complete Credibility Extraction Task
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
Domain: Strategic
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

# Build Authority Arsenal - Complete Credibility Extraction Task

## Metadata

```yaml
task_id: build-authority-arsenal
version: 2.0.0
category: agent-creation
difficulty: advanced
elicit: true
minimum_output_lines: 600

methodology_source: "docs/research/authority-arsenal-methodology-research.md"
theoretical_foundation:
  - "Robert Cialdini - 6 Principles of Influence (Authority, Social Proof)"
  - "Dan Kennedy - Direct Response Authority Building"
  - "Gary Bencivenga - Proof-to-Claim Ratio Principle"
  - "Conversion Rate Experts - 7 Types of Persuasive Proof"

dependencies:
  templates:
    - templates/authority-arsenal-tmpl.yaml
  reference:
    - agents/dan-kennedy.md  # authority_proof_arsenal section
    - agents/david-ogilvy.md # authority_proof_arsenal section
  research:
    - docs/research/authority-arsenal-methodology-research.md

outputs:
  primary: "outputs/minds/{slug}/analysis/authority-arsenal.yaml"
  supplementary:
    - "Crucible story (4 acts) with source citations"
    - "Authority statistics (minimum 5, categorized)"
    - "Notable products/clients list"
    - "4 proof stack templates (transformation, results, credibility, social)"
```

---

## Executive Summary

**What This Task Does:**
Build a comprehensive authority proof arsenal that enables any copywriter agent to establish credibility naturally and powerfully in every piece of copy.

**Why This Matters:**
Authority is the foundation of persuasion. As Gary Bencivenga (one of the world's greatest living copywriters) famously said:

> "Never make your claim bigger than your proof. The size of your claim should always be constrained by the amount and quality of proof you have."

A copywriter agent without structured credibility elements will produce hollow, unconvincing copy. This arsenal provides the "proof layer" that makes every claim believable.

**The Authority Equation:**
```
Credibility = Crucible Story + Verifiable Statistics + Social Proof + Proof Templates
```

---

## Theoretical Foundation

### The Psychology of Authority

Based on Robert Cialdini's research in "Influence: The Psychology of Persuasion":

**Authority Principle:** People defer to experts and authorities, often automatically. When we perceive someone as an expert, we're more likely to:
- Accept their claims without extensive scrutiny
- Follow their recommendations
- Trust their judgment over our own

**Social Proof Principle:** People look to the actions of others to determine their own. We're wired to follow the tribe - large communities signal safety and correct choice.

### The Bencivenga Proof Hierarchy

```
Level 5: IRREFUTABLE PROOF (10/10 credibility)
├── Third-party verified studies
├── Government/regulatory endorsements
├── Independent laboratory results
└── Court-validated claims

Level 4: STRONG PROOF (8/10 credibility)
├── Named testimonials with verifiable details
├── Case studies with specific metrics
├── Expert endorsements with credentials
└── Media coverage from respected outlets

Level 3: MODERATE PROOF (6/10 credibility)
├── Customer testimonials (named, no photo)
├── Usage statistics (self-reported)
├── Before/after demonstrations
└── Industry awards

Level 2: WEAK PROOF (4/10 credibility)
├── Anonymous testimonials
├── Self-reported results without evidence
├── Vague statistics
└── Implied endorsements

Level 1: NO PROOF (DANGEROUS)
├── Unsupported claims
├── "Trust me" appeals
└── Features without benefits
```

**Rule:** Match proof strength to claim size. Extraordinary claims require extraordinary evidence.

---

## PREREQUISITES

### Required Inputs

```yaml
elicit: true
question: "Please confirm the following inputs are available:"
fields:
  - copywriter_name: "Full name of the copywriter"
  - slug: "Snake_case identifier (e.g., dan_kennedy)"
  - source_directory: "Path to source materials with autobiographical content"
  - psychometric_profile: "Path to psychometric profile (optional but recommended)"
```

### Source Material Requirements

| Material Type | Purpose | Minimum | Quality Indicators |
|--------------|---------|---------|-------------------|
| Autobiographical content | Extract crucible story | 2+ files | Contains "I used to...", "When I started...", timeline markers |
| Business/career mentions | Extract statistics | 3+ files | Contains numbers, metrics, results |
| Product launches/offers | Notable products | 2+ files | Named products, descriptions, results |
| Client results/testimonials | Notable clients | 1+ file | Client names or types, outcomes |

### Quality Gate: Prerequisites Checklist

```
- [ ] Source directory exists with autobiographical content
- [ ] At least 2 files contain personal journey/story details
- [ ] At least 3 files contain business metrics or achievements
- [ ] Output directory exists at `outputs/minds/{slug}/analysis/`
- [ ] Source files contain enough detail for specific extraction
- [ ] Timeline markers present (years, ages, periods)
```

---

## PHASE 1: EXTRACT CRUCIBLE STORY

### 1.0 Understanding the Crucible Story

**What is a Crucible Story?**
A crucible is a transformative experience that shapes character. In copywriting, it's the authority's origin story - how they went from ordinary (relatable) to extraordinary (authority).

**Why It Works:**
1. **Relatability** - Readers see themselves in the struggle
2. **Transformation proof** - If they changed, I can too
3. **Credibility** - Adversity builds trust
4. **Emotional connection** - Stories bypass rational resistance
5. **Memorability** - Stories are 22x more memorable than facts (Stanford research)

**The Four-Act Structure:**

```
ACT 1: ORIGIN ──────────────────────────────────────────────────►
│ "Where they started - the humble/relatable beginning"
│ Purpose: Establish relatability through shared human experience
│
ACT 2: STRUGGLE ────────────────────────────────────────────────►
│ "The challenges, failures, dark night of the soul"
│ Purpose: Build credibility through adversity
│
ACT 3: BREAKTHROUGH ────────────────────────────────────────────►
│ "The turning point - what changed everything"
│ Purpose: Establish the unique insight or methodology
│
ACT 4: MASTERY ─────────────────────────────────────────────────►
  "Current state - where they are now as authority"
  Purpose: Establish current authority position
```

### 1.1 Scanning for Autobiographical Content

**Step 1.1.1: Create Source Inventory**

Read ALL source files and create extraction notes for autobiographical content:

**Markers to Search For:**
- "I used to..." / "When I started..."
- "My first..." / "In the beginning..."
- "I failed at..." / "I lost..."
- "Everything changed when..."
- "That's when I realized..."
- "Today, I..." / "Now I..."
- Year markers (1974, in my 20s, after college)
- Money markers ([PONTO_DE_PARTIDA_FINANCEIRO], broke, first big milestone)
- Emotional markers (desperate, frustrated, excited)

**Extraction Table Template:**

| Quote/Paraphrase | Source File | Line/Location | Act (1/2/3/4) | Confidence |
|-----------------|-------------|---------------|---------------|------------|
| "[exact quote]" | [filename] | [line #] | [1-4] | High/Med/Low |

**Example:**
| Quote/Paraphrase | Source File | Line/Location | Act | Confidence |
|-----------------|-------------|---------------|-----|------------|
| "In 1974, I was broke in Cleveland..." | interview_2019.md | Line 47 | 1 | High |
| "I failed at three businesses before..." | autobiography.md | Page 12 | 2 | High |
| "Everything changed when I studied..." | newsletter_2020.md | Section 3 | 3 | Medium |

### 1.2 Building Act 1 - Origin

**Objective:** Capture the starting point - where they began their journey.

**Required Fields:**

```yaml
act_1_origin:
  year: "YYYY or YYYY-YYYY range"
  location: "[City, state, country if relevant]"
  context: "[Starting situation - job, life circumstances, age]"
  key_event: "[The inciting incident that started the journey]"
  initial_belief: "[What they believed at this stage]"
  initial_struggle: "[First challenge or problem they faced]"
  emotional_state: "[How they felt - frustrated, desperate, curious]"
  sources:
    - file: "[Source file name]"
      location: "[Line number or section]"
      quote: "[Supporting quote]"
```

**Questions to Answer:**
1. What was their life like before the transformation?
2. What was their first job/career/situation?
3. What made them start down this path?
4. What did they believe at this stage?
5. What was the emotional tone of this period?
6. What was the inciting incident?

**Example (Dan Kennedy):**

```yaml
act_1_origin:
  year: "1974"
  location: "Cleveland, Ohio"
  context: "Young entrepreneur, recently failed at third business venture"
  key_event: "Started writing sales letters for local businesses who couldn't afford advertising"
  initial_belief: "Believed traditional advertising was the path to success"
  initial_struggle: "No money, no clients, no track record"
  emotional_state: "Desperate but determined"
  sources:
    - file: "autobiography_chapter_1.md"
      location: "Pages 12-15"
      quote: "I sat in my cramped apartment staring at a pile of bills..."
```

### 1.3 Building Act 2 - Struggle

**Objective:** Capture the challenges, failures, and lessons that built expertise.

**Required Fields:**

```yaml
act_2_struggle:
  period: "YYYY-YYYY or 'X years'"
  primary_challenge: "[The main obstacle they faced]"

  failures:
    - failure: "[Specific failure #1]"
      year: "YYYY or approximate"
      impact: "[How it affected them - financially, emotionally]"
      lesson: "[What they learned from it]"
    - failure: "[Specific failure #2]"
      year: "YYYY"
      impact: "[Impact]"
      lesson: "[Lesson]"

  dark_moment:
    description: "[The lowest point - be specific]"
    year: "YYYY"
    what_almost_happened: "[What they almost did - quit, gave up, etc.]"
    emotional_state: "[How they felt]"

  pivotal_lessons:
    - "[Key lesson 1 learned during struggle]"
    - "[Key lesson 2]"
    - "[Key lesson 3]"

  sources:
    - file: "[Source file name]"
      location: "[Line number or section]"
      quote: "[Supporting quote]"
```

**Questions to Answer:**
1. What specific failures did they experience? (names, dates, amounts)
2. How many attempts before success?
3. What was the darkest moment? (be specific - not just "things were hard")
4. What did they almost give up on?
5. What key lessons emerged from the struggle?
6. How long did the struggle period last?

**Quality Criteria for Dark Moment:**
- Must be SPECIFIC, not generic ("lost [PREJUÍZO_EXATO_EXEMPLO] in bad investment" not "lost money")
- Must be EMOTIONAL, not clinical ("couldn't feed my family" not "experienced hardship")
- Must be VERIFIABLE with source citation
- Must lead logically to Act 3 breakthrough

### 1.4 Building Act 3 - Breakthrough

**Objective:** Capture the turning point that changed everything.

**Required Fields:**

```yaml
act_3_breakthrough:
  year: "YYYY"
  catalyst: "[What triggered the breakthrough - specific event, person, insight]"

  realization:
    insight: "[The key insight or shift in thinking]"
    why_unique: "[Why hadn't they/others seen this before?]"
    how_discovered: "[How did they discover this?]"

  first_success:
    description: "[The first significant win using new approach]"
    metric: "[Specific result - money, clients, recognition]"
    timeframe: "[How quickly did it happen?]"

  validation:
    how_confirmed: "[How did they know this wasn't a fluke?]"
    second_success: "[The follow-up win that confirmed it]"
    pattern_recognition: "[What pattern emerged?]"

  sources:
    - file: "[Source file name]"
      location: "[Line number or section]"
      quote: "[Supporting quote]"
```

**Questions to Answer:**
1. What was the specific breakthrough moment?
2. What did they figure out that others hadn't?
3. What was their first major success using this insight?
4. How did they validate the approach worked (not luck)?
5. What was the timeline from breakthrough to success?

**Quality Criteria for Breakthrough:**
- Must be SPECIFIC insight, not vague ("discovered urgency architecture" not "got better")
- Must be ACTIONABLE - something that can be taught/replicated
- Must CONNECT logically to Act 2 struggles
- Must EXPLAIN their subsequent success

### 1.5 Building Act 4 - Mastery

**Objective:** Capture their current authority position and impact.

**Required Fields:**

```yaml
act_4_mastery:
  current_state:
    position: "[Current title, role, reputation]"
    reach: "[Size of audience, influence, platform]"
    recognition: "[How the industry sees them]"

  signature_achievement:
    achievement: "[The single most defining accomplishment]"
    scale: "[Numbers that demonstrate scale]"
    uniqueness: "[What makes this achievement noteworthy]"

  impact_on_others:
    students_helped: "[Number/type of people transformed]"
    methodology_spread: "[How their approach has been adopted]"
    legacy: "[What they'll be remembered for]"

  core_philosophy:
    belief: "[The central belief that emerged from the journey]"
    teaching: "[What they most want others to understand]"
    mission: "[Their ongoing purpose]"

  sources:
    - file: "[Source file name]"
      location: "[Line number or section]"
      quote: "[Supporting quote]"
```

**Questions to Answer:**
1. Where are they now in their career?
2. What is their signature achievement?
3. How have they helped others?
4. What philosophy emerged from their journey?
5. What will they be remembered for?

### 1.6 Quality Gate: Crucible Story

```
MANDATORY CHECKS:
- [ ] All 4 acts populated with specific content (no placeholders)
- [ ] Each act has at least 1 verifiable source citation
- [ ] Timeline is coherent (years make chronological sense)
- [ ] Story has clear transformation arc (Act 1 person ≠ Act 4 person)
- [ ] Dark moment (Act 2) is specific, not generic
- [ ] Breakthrough (Act 3) is specific, actionable insight
- [ ] Current state (Act 4) reflects recognized authority position

QUALITY CHECKS:
- [ ] Emotional journey is clear (desperation → struggle → hope → mastery)
- [ ] Story creates reader relatability in Act 1
- [ ] Story builds credibility through Act 2 struggles
- [ ] Breakthrough explains their unique value proposition
- [ ] Mastery state matches claimed expertise level
```

---

## PHASE 2: COMPILE AUTHORITY STATISTICS

### 2.0 Understanding Authority Statistics

**What Are Authority Statistics?**
Verifiable numbers that demonstrate expertise, results, and influence.

**The Dan Kennedy Principle:**
- "Be specific. '[VALOR_EXATO_EXEMPLO]' is more believable than 'almost [VALOR_ARREDONDADO_EXEMPLO]'"
- "Use odd numbers. Specific odd numbers feel more authentic than round numbers"
- "Name names. When possible, name specific clients, specific results, specific timeframes"

**Statistical Categories:**

```
CAREER STATISTICS
├── Years of experience
├── Projects completed
├── Hours invested
└── Clients served

RESULTS STATISTICS
├── Revenue generated
├── ROI achieved
├── Transformations enabled
└── Specific wins

RECOGNITION STATISTICS
├── Awards received
├── Rankings achieved
├── Media features
└── Publications/books

REACH STATISTICS
├── Audience size
├── Content reach
├── Community size
└── Engagement metrics
```

### 2.1 Identifying Statistical Categories

**Step 2.1.1: Scan Source Files for Numbers**

Search for quantitative information related to:

| Category | Search Terms | Examples |
|----------|-------------|----------|
| **Career** | years, experience, started, since, clients, projects | "27 years", "4,847 projects" |
| **Results** | generated, achieved, grew, increased, revenue, ROI | "[RESULTADO_AGREGADO_EXEMPLO]", "847% ROI" |
| **Recognition** | awarded, ranked, featured, published, bestseller | "7x winner", "NYT bestseller" |
| **Reach** | followers, subscribers, members, views, audience | "847,000 subscribers" |

**Step 2.1.2: Create Statistics Inventory**

| Statistic Type | Raw Value | Source File | Location | Verifiable? | Date Stated |
|---------------|-----------|-------------|----------|-------------|-------------|
| [category] | [number] | [filename] | [line #] | Yes/No/Partial | [YYYY] |

### 2.2 Extracting and Verifying Statistics

**Verification Levels:**

```yaml
verification_levels:

  level_a_verified:
    label: "Third-Party Verified"
    markers:
      - "Independent audit or verification exists"
      - "Public documentation available"
      - "Methodology disclosed"
    examples: "Financial audits, scientific studies, regulatory filings"
    use_in_copy: "Lead with these - highest credibility"

  level_b_documented:
    label: "Publicly Documented"
    markers:
      - "Published in reputable source"
      - "Can be fact-checked"
      - "Source is named"
    examples: "Media coverage, published case studies"
    use_in_copy: "Use freely with source citation"

  level_c_self_reported_evidence:
    label: "Self-Reported with Evidence"
    markers:
      - "Screenshots or documentation provided"
      - "Specific and detailed"
      - "Timeline included"
    examples: "Dashboard screenshots, payment receipts"
    use_in_copy: "Use with qualifier ('documented', 'tracked')"

  level_d_self_reported:
    label: "Self-Reported Claim"
    markers:
      - "Stated by the authority"
      - "Specific enough to be verifiable"
    examples: "Personal claims in interviews"
    use_in_copy: "Use with attribution ('reports', 'shares')"

  level_e_unverifiable:
    label: "Unverifiable"
    markers:
      - "Cannot be independently verified"
      - "Vague or rounded numbers"
    examples: "Rough estimates, implied claims"
    use_in_copy: "AVOID - damages credibility"
```

**Verification Decision Tree:**

```
1. Is there third-party documentation?
   → YES: Level A (use as lead proof)
   → NO: Continue...

2. Is it published in reputable source?
   → YES: Level B (use with citation)
   → NO: Continue...

3. Is there self-documentation (screenshots, receipts)?
   → YES: Level C (use with qualifier)
   → NO: Continue...

4. Is it specific and stated by authority?
   → YES: Level D (use with attribution)
   → NO: Level E (AVOID using)
```

### 2.3 Structuring Statistics Output

**Required Structure:**

```yaml
authority_statistics:

  career:
    - metric: "[Career metric name]"
      value: "[Specific number/range]"
      context: "[What this means / why it matters]"
      verification_level: "[A/B/C/D]"
      source:
        file: "[Source file]"
        location: "[Line/section]"
        quote: "[Direct quote if available]"

  results:
    - metric: "[Results metric name]"
      value: "[Specific number/range]"
      context: "[What this means / why it matters]"
      verification_level: "[A/B/C/D]"
      source:
        file: "[Source file]"
        location: "[Line/section]"

  recognition:
    - metric: "[Recognition metric name]"
      value: "[Specific credential/award]"
      context: "[What this means]"
      verification_level: "[A/B/C/D]"
      source:
        file: "[Source file]"
        location: "[Line/section]"

  reach:
    - metric: "[Reach metric name]"
      value: "[Specific number/range]"
      context: "[What this means]"
      verification_level: "[A/B/C/D]"
      source:
        file: "[Source file]"
        location: "[Line/section]"
```

**Example (Filled):**

```yaml
authority_statistics:

  career:
    - metric: "Years in Direct Response"
      value: "50+ years"
      context: "One of the longest careers in direct response marketing"
      verification_level: "B"
      source:
        file: "biography.md"
        location: "Section 1"
        quote: "Kennedy began his direct response career in 1974..."

  results:
    - metric: "Client Revenue Generated"
      value: "[RESULTADO_DOCUMENTADO_EM_ESCALA]"
      context: "Cumulative revenue for clients using Kennedy methodologies"
      verification_level: "C"
      source:
        file: "marketing_materials.md"
        location: "About section"

  recognition:
    - metric: "Published Works"
      value: "23 books including 4 NYT bestsellers"
      context: "Most prolific author in direct response marketing"
      verification_level: "A"
      source:
        file: "amazon_author_page.md"
        location: "Bibliography"

  reach:
    - metric: "Newsletter Subscribers"
      value: "200,000+ monthly readers"
      context: "No B.S. Marketing Letter circulation"
      verification_level: "C"
      source:
        file: "media_kit.pdf"
        location: "Page 2"
```

### 2.4 Quality Gate: Statistics

```
MANDATORY CHECKS:
- [ ] Minimum 5 statistics extracted across categories
- [ ] At least 2 different categories represented
- [ ] All statistics have source citations
- [ ] No statistics are Level E (unverifiable)
- [ ] Numbers are specific (not "many" or "several")

QUALITY CHECKS:
- [ ] At least 1 career statistic
- [ ] At least 1 results statistic
- [ ] At least 1 reach statistic
- [ ] Statistics are impressive enough to establish authority
- [ ] Context provided for each statistic
- [ ] Verification levels documented
```

---

## PHASE 3: DOCUMENT NOTABLE PRODUCTS AND CLIENTS

### 3.0 Understanding Notable Work

**Why This Matters:**
Products and clients serve as third-party validation. "Creator of Magnetic Marketing" is instant credibility. "Worked with Google, Amazon, Microsoft" transfers their authority to you.

### 3.1 Extracting Notable Products

**Search Markers:**
- "Created/Built/Developed..."
- "Author of..."
- "Founder of..."
- "My program/course/system..."
- Product/brand names mentioned repeatedly

**Required Structure:**

```yaml
notable_products:
  - name: "[Product name]"
    type: "course|book|software|service|community|system"
    description: "[One-line description]"
    result_claim: "[What it helps people achieve]"
    social_proof: "[Sales figures, user count, testimonials if available]"
    launch_year: "YYYY"
    status: "active|legacy|archived"
    source:
      file: "[Source file]"
      location: "[Line/section]"
```

**Product Type Definitions:**

| Type | Definition | Examples |
|------|------------|----------|
| **course** | Educational program with curriculum | Masterclass, coaching program |
| **book** | Published written work | Bestseller, self-published guide |
| **software** | Digital tool or platform | SaaS product, app, plugin |
| **service** | Done-for-you or consulting | Agency services, consulting |
| **community** | Membership or group access | Mastermind, membership site |
| **system** | Methodology or framework | Named system, trademarked process |

### 3.2 Extracting Notable Clients

**Search Markers:**
- "I worked with..."
- "My client [Name]..."
- Client testimonials
- Case study subjects
- "Helped [Company/Person]..."

**Required Structure:**

```yaml
notable_clients:
  - name: "[Client/student name or type]"
    type: "individual|company|organization"
    recognition_level: "celebrity|industry_leader|notable|general"
    result: "[What they achieved]"
    quote: "[Direct quote if available]"
    context: "[How they worked together]"
    source:
      file: "[Source file]"
      location: "[Line/section]"
```

**Recognition Level Definitions:**

| Level | Definition | Credibility Impact |
|-------|------------|-------------------|
| **celebrity** | Widely recognized name | Highest - instant credibility |
| **industry_leader** | Known within the industry | High - niche credibility |
| **notable** | Successful but not famous | Medium - relatable proof |
| **general** | Anonymous or aggregated | Lower - use client TYPES instead |

**When Specific Names Aren't Available:**
Use client TYPES instead:
- "Fortune 500 executives"
- "7-figure business owners"
- "Medical professionals"
- "First-time entrepreneurs"

### 3.3 Quality Gate: Products & Clients

```
MANDATORY CHECKS:
- [ ] At least 3 notable products listed
- [ ] At least 2 notable clients/student types listed
- [ ] Each entry has clear result/benefit
- [ ] Sources are cited for each entry

QUALITY CHECKS:
- [ ] Products span multiple types (not all books)
- [ ] Clients include at least 1 recognizable name OR specific types
- [ ] Result claims are specific, not generic
- [ ] Status is current for active products
```

---

## PHASE 4: CREATE PROOF STACK TEMPLATES

### 4.0 Understanding Proof Templates

**What Are Proof Templates?**
Reusable structures for deploying authority proof in copy. Templates ensure consistent, effective credibility building across all marketing communications.

**The Four Template Types:**

| Template | Purpose | When to Use |
|----------|---------|-------------|
| **Transformation** | Show personal journey | Opening hooks, about sections |
| **Results** | Demonstrate achievements | Credibility sections, after claims |
| **Credibility** | Establish expertise | Introductions, author bios |
| **Social** | Leverage community validation | Testimonial sections, social proof |

### 4.1 Transformation Proof Template

**Purpose:** Establish relatability through personal journey

**Template Structure:**

```yaml
proof_template_transformation:
  name: "Transformation Proof"
  purpose: "Establish relatability through personal journey"

  when_to_use:
    - "Opening hooks to establish connection"
    - "About sections and author bios"
    - "Case study introductions"
    - "Email sequence openers"
    - "Webinar introductions"

  structure:
    before_state: "[Act 1 origin context - relatable starting point]"
    struggle: "[Act 2 dark moment - the challenge]"
    turning_point: "[Act 3 breakthrough - what changed]"
    after_state: "[Act 4 mastery - where they are now]"

  variables:
    - "{origin_year}: Year the journey started"
    - "{origin_state}: Starting circumstances"
    - "{dark_moment}: Lowest point description"
    - "{breakthrough}: Key insight or turning point"
    - "{current_position}: Current authority status"
    - "{impact_metric}: How many others helped"

  template_short: |
    From {origin_state} to {current_position} after discovering {breakthrough}.

  template_medium: |
    In {origin_year}, [Name] was {origin_state}. After {dark_moment},
    everything changed when {breakthrough}. Today, [Name] has helped
    {impact_metric} achieve {transformation_result}.

  template_full: |
    [Full crucible story narrative using all 4 acts]

  example_application: |
    "In 1974, Dan Kennedy was a broke entrepreneur in Cleveland who couldn't
    afford to mail his own sales letters. After failing at three businesses
    and nearly giving up, he discovered the 'urgency architecture' that would
    generate his first [RESULTADO_SEMANAL_EXEMPLO] in a single week. Today, he's helped create
    more self-made millionaires than any other marketing consultant, with
    clients generating over [RESULTADO_AGREGADO_EXEMPLO] using his methods."

  usage_guidance:
    - "Use SHORT version for headlines and social media"
    - "Use MEDIUM version for landing pages and emails"
    - "Use FULL version for sales letters and about pages"
    - "Always lead with the relatable before state"
    - "Make the transformation concrete with numbers"
```

### 4.2 Results Proof Template

**Purpose:** Demonstrate capability through numbers

**Template Structure:**

```yaml
proof_template_results:
  name: "Results Proof"
  purpose: "Demonstrate capability through specific achievements"

  when_to_use:
    - "After making claims to substantiate"
    - "In headlines for specific hooks"
    - "Stacking multiple statistics"
    - "Credibility sections of sales pages"
    - "Email signature lines"

  structure:
    primary_metric: "[The most impressive number]"
    secondary_metric: "[Supporting number]"
    timeframe: "[When achieved - for recency]"
    context: "[What it means in real terms]"
    verification: "[How this can be confirmed]"

  variables:
    - "{primary_stat}: Lead impressive statistic"
    - "{secondary_stat}: Supporting statistic"
    - "{timeframe}: Time period of achievement"
    - "{context}: Real-world meaning"
    - "{client_count}: Number of people helped"
    - "{avg_result}: Average result achieved"

  template_headline: |
    {primary_stat} in {timeframe}

  template_body: |
    With {years} years of experience and {primary_stat} in results,
    [Name] has helped {client_count} [client type] achieve {avg_result}.

  template_detailed: |
    {primary_stat} in documented results ({timeframe}). That's an average
    of {avg_result} per [client/project]. These results have been
    {verification_method} and are documented in {proof_location}.

  example_application: |
    "[RESULTADO_AGREGADO_EXEMPLO] in documented client revenue (2008-2024). That's an
    average of [RESULTADO_MÉDIO_POR_CLIENTE] per client served. These results have been
    verified by independent CPA audits and are documented in our
    public case study library."

  usage_guidance:
    - "Lead with the most impressive statistic"
    - "Use specific numbers (not rounded)"
    - "Include timeframe for recency"
    - "Provide context for large numbers"
    - "Stack multiple stats for compound proof"
```

### 4.3 Credibility Proof Template

**Purpose:** Position as recognized authority in the field

**Template Structure:**

```yaml
proof_template_credibility:
  name: "Credibility Proof"
  purpose: "Position as recognized authority in the field"

  when_to_use:
    - "Author bios and introductions"
    - "When presenting frameworks or methods"
    - "Countering 'who are you?' objection"
    - "Expert positioning content"
    - "Speaking engagement bios"
    - "Podcast guest introductions"

  structure:
    title_position: "[Role/title that establishes authority]"
    credentials: "[Degrees, certifications, affiliations]"
    experience: "[Years and depth of expertise]"
    recognition: "[Awards, media, peer acknowledgment]"
    notable_work: "[Signature products or achievements]"

  variables:
    - "{title}: Current role/position"
    - "{company}: Company or brand name"
    - "{book_title}: Notable book"
    - "{years}: Years of experience"
    - "{client_types}: Types of clients served"
    - "{media_features}: Media appearances"
    - "{signature_achievement}: Defining accomplishment"

  template_one_line: |
    [Name], {title} and author of {book_title}

  template_short: |
    [Name], founder of {company} and author of {book_title}, has spent
    {years} years helping {client_types} achieve {result}.

  template_full: |
    [Name] is the {title} of {company} and author of {book_title}.
    Featured in {media_features} and trusted by {notable_clients},
    [Name] is recognized as {industry_position}. With {years} years
    of experience and {primary_stat} in results, they have helped
    {client_count} {client_types} achieve {transformation}.

  example_application: |
    "Dan Kennedy is the founder of Magnetic Marketing and author of
    23 books including 4 New York Times bestsellers. Featured in Forbes,
    Entrepreneur, and Inc. Magazine, Kennedy is recognized as one of the
    most influential direct response marketers alive. With 50+ years of
    experience and [RESULTADO_AGREGADO_EXEMPLO] in client results, he has helped create
    more self-made millionaires than any other marketing consultant."

  usage_guidance:
    - "Lead with the most recognizable credential"
    - "Match credential emphasis to audience needs"
    - "Include third-party recognition (media, awards)"
    - "End with results/impact"
```

### 4.4 Social Proof Template

**Purpose:** Leverage others' validation and results

**Template Structure:**

```yaml
proof_template_social:
  name: "Social Proof"
  purpose: "Leverage community validation and peer results"

  when_to_use:
    - "Testimonial sections"
    - "Email opt-in pages"
    - "Purchase decision pages"
    - "Community building content"
    - "FOMO creation"

  structure:
    audience_size: "[Total community/customer count]"
    audience_type: "[Who these people are]"
    notable_members: "[Recognizable names or companies]"
    aggregate_results: "[Combined outcomes]"
    recent_activity: "[Fresh proof of ongoing success]"

  variables:
    - "{community_size}: Number of members/customers"
    - "{community_type}: Description of who they are"
    - "{notable_names}: Recognizable clients/members"
    - "{aggregate_result}: Combined achievement"
    - "{recent_stat}: Recent activity metric"
    - "{transformation}: What members achieve"

  template_join: |
    Join {community_size}+ {community_type} who have used [Method] to {transformation}.

  template_trust: |
    Trusted by {community_size}+ {community_type} including teams from
    {notable_names}.

  template_results: |
    Our community of {community_size} {community_type} reports an average
    {aggregate_result}. Just this month, {recent_stat}.

  template_testimonial_intro: |
    Here's what {community_size}+ {community_type} are saying:

  example_application: |
    "Join 47,000+ direct response marketers who have used Kennedy's methods
    to create breakthrough campaigns. Our community includes teams from
    Google, Amazon, and Microsoft, and members report an average 3x increase
    in conversion rates within 90 days."

  usage_guidance:
    - "Use specific numbers (47,000 not 'thousands')"
    - "Include recognizable names when available"
    - "Add recency ('just this month')"
    - "Specify the transformation, not just membership"
    - "Use peer language ('marketers like you')"
```

### 4.5 Quality Gate: Proof Templates

```
MANDATORY CHECKS:
- [ ] All 4 proof template types created
- [ ] Each template has clear structure defined
- [ ] Variables are mapped to extracted data
- [ ] Usage guidance provided for each
- [ ] Example applications included

QUALITY CHECKS:
- [ ] Templates are actually usable (not too abstract)
- [ ] Variables reference real extracted data
- [ ] Multiple format lengths provided (short/medium/full)
- [ ] Examples feel natural and persuasive
- [ ] Guidance covers common use cases
```

---

## PHASE 5: ASSEMBLE FINAL OUTPUT

### 5.1 Compile Complete Arsenal

**Final YAML Structure:**

```yaml
# Authority Arsenal - {Copywriter Name}
# Generated: {YYYY-MM-DD}
# Source files analyzed: {count}
# Task version: 2.0.0

metadata:
  copywriter: "{Full Name}"
  slug: "{snake_case_slug}"
  extraction_date: "{YYYY-MM-DD}"
  source_files_analyzed: {count}
  task_version: "2.0.0"

crucible_story:
  title: "{One-line story title}"
  transformation_arc: "{From X to Y}"
  word_count: {number}

  act_1_origin:
    # ... all Act 1 fields

  act_2_struggle:
    # ... all Act 2 fields

  act_3_breakthrough:
    # ... all Act 3 fields

  act_4_mastery:
    # ... all Act 4 fields

authority_statistics:
  total_statistics: {count}
  verification_summary:
    level_a: {count}
    level_b: {count}
    level_c: {count}
    level_d: {count}

  career:
    # ... career statistics

  results:
    # ... results statistics

  recognition:
    # ... recognition statistics

  reach:
    # ... reach statistics

notable_products:
  total_products: {count}
  # ... product entries

notable_clients:
  total_clients: {count}
  # ... client entries

proof_stack_templates:
  transformation:
    # ... full template

  results:
    # ... full template

  credibility:
    # ... full template

  social:
    # ... full template

quality_scores:
  crucible_story: "{X}/10"
  statistics: "{X}/10"
  products_clients: "{X}/10"
  proof_templates: "{X}/10"
  overall: "{X}/10"
```

### 5.2 YAML Validation Checklist

```
SYNTAX VALIDATION:
- [ ] Run YAML linter/validator
- [ ] Check for proper indentation (2 spaces)
- [ ] Verify no duplicate keys
- [ ] Ensure strings with special characters are quoted
- [ ] Check multi-line strings use proper | notation

CONTENT VALIDATION:
- [ ] All required sections present
- [ ] No placeholder text remaining
- [ ] All sources cited
- [ ] Numbers are specific
- [ ] Templates reference actual extracted data
```

### 5.3 Output Location

**Save to:** `outputs/minds/{slug}/analysis/authority-arsenal.yaml`

---

## FINAL QUALITY CHECKLIST

### Section Completeness

```
CRUCIBLE STORY (30% weight)
- [ ] Act 1 (Origin): year, context, key_event, sources ✓
- [ ] Act 2 (Struggle): challenges, failures, dark_moment, sources ✓
- [ ] Act 3 (Breakthrough): catalyst, realization, first_success, sources ✓
- [ ] Act 4 (Mastery): current_state, signature_achievement, sources ✓
- [ ] Transformation arc is clear and compelling

STATISTICS (25% weight)
- [ ] Minimum 5 statistics extracted
- [ ] At least 1 career statistic
- [ ] At least 1 results statistic
- [ ] At least 1 reach statistic
- [ ] All statistics have verification levels
- [ ] All statistics have source citations

PRODUCTS & CLIENTS (15% weight)
- [ ] At least 3 notable products listed
- [ ] At least 2 client types or names listed
- [ ] Each entry has clear result claim
- [ ] Sources cited

PROOF TEMPLATES (20% weight)
- [ ] Transformation proof template complete
- [ ] Results proof template complete
- [ ] Credibility proof template complete
- [ ] Social proof template complete
- [ ] Variables mapped to extracted data
- [ ] Usage guidance provided

TECHNICAL (10% weight)
- [ ] Valid YAML syntax
- [ ] Proper sources cited throughout
- [ ] No placeholder text remaining
- [ ] File saved to correct location
```

### Quality Scoring

| Section | Weight | Criteria | Score |
|---------|--------|----------|-------|
| Crucible Story | 30% | All 4 acts, compelling arc, specific details | /30 |
| Statistics | 25% | 5+ stats, specific, verified | /25 |
| Products/Clients | 15% | 3+ products, 2+ clients | /15 |
| Proof Templates | 20% | All 4 types, usable, examples | /20 |
| Technical | 10% | Valid YAML, proper sources | /10 |
| **TOTAL** | 100% | Target: 90%+ | /100 |

---

## TROUBLESHOOTING GUIDE

### Common Issues and Solutions

**Issue:** Not enough autobiographical content for crucible story

**Solutions:**
- Search for podcast/video interviews (people share stories there)
- Check social media for "journey" or "throwback" posts
- Look for 'About' pages, speaker bios, book forewords
- Search for graduation speeches or award acceptance speeches
- Check for written Q&As or interview transcripts

---

**Issue:** Statistics seem inflated or unverifiable

**Solutions:**
- Use more conservative estimates with qualifiers ("over", "approximately")
- Note the source and date of claim
- Downgrade verification level appropriately
- Exclude truly unverifiable statistics
- Use rate-based stats instead of absolutes

---

**Issue:** Crucible story feels generic

**Solutions:**
- Find MORE specific details (exact dates, places, dollar amounts)
- Look for the unique angle (what makes THEIR story different?)
- Include specific failures, not just "challenges"
- Find the exact breakthrough moment, not just "I got better"
- Add sensory details where available (smells, sounds, feelings)

---

**Issue:** No notable clients to name

**Solutions:**
- Use client TYPES instead of names ("Fortune 500 executives")
- Look for any testimonial content for names
- Check for collaboration mentions
- Use audience demographics as proxy
- Check for companies that have publicly mentioned working with them

---

**Issue:** Breakthrough (Act 3) is vague

**Solutions:**
- Look for the "aha moment" description
- Search for "that's when I realized" or "everything changed when"
- Find what SPECIFICALLY they did differently
- Connect it to their unique methodology
- Make it actionable - something that can be taught

---

## REFERENCE: Golden Standard Examples

### Dan Kennedy Example

See `agents/dan-kennedy.md` for reference implementation:
- Crucible story with specific years and events
- Statistics with verification levels
- Proof templates with actual data

### David Ogilvy Example

See `agents/david-ogilvy.md` for reference implementation:
- Extended crucible story (6 acts)
- Rich statistical detail
- Comprehensive proof templates

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial task creation |
| 2.0.0 | 2026-01-23 | Complete rewrite with research-first methodology, added theoretical foundation, expanded templates, quality gates |

---

*CopywriterOS Task v2.0.0*
*Part of the AIOX Squad System*
*Based on: docs/research/authority-arsenal-methodology-research.md*
