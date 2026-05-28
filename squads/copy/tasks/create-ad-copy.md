---
task: Create Ad Copy Task
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Content
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

# Create Ad Copy Task

## Metadata

```yaml
task_id: create-ad-copy
version: 2.0
framework: copy-framework-v2
category: paid_media
complexity: advanced
estimated_time: 45-90min
requires_research: true

dependencies:
  research: docs/research/ad-copy-methodology-research.md
  templates: templates/ad-copy-templates/

theoretical_foundation:
  - Claude Hopkins - Scientific Advertising
  - Dan Kennedy - No B.S. Direct Marketing
  - David Ogilvy - Ogilvy on Advertising
  - Frank Kern - Mass Control
```

---

## Purpose

Criar anúncios de alta conversão para qualquer plataforma de mídia paga (Meta, Google, YouTube, TikTok, LinkedIn), aplicando princípios de Scientific Advertising de Claude Hopkins e frameworks modernos de direct response.

**Princípio Core (Hopkins):**
> "Advertising is salesmanship in print. The only purpose of advertising is to make sales."

Cada anúncio deve ter:
1. **Hook** que para o scroll
2. **Promessa** específica e crível
3. **Prova** que sustenta a promessa
4. **CTA** claro com razão para agir agora

---

## Phase 1: Information Gathering

### 1.1 Required Inputs

```yaml
campaign_context:
  platform:
    required: true
    options:
      - meta_feed          # Facebook/Instagram Feed
      - meta_stories       # Stories/Reels
      - google_search      # Search Ads (RSA)
      - google_display     # Display Network
      - youtube_skippable  # TrueView In-Stream
      - youtube_bumper     # 6-second bumper
      - tiktok             # TikTok Ads
      - linkedin_feed      # LinkedIn Sponsored Content
      - linkedin_message   # LinkedIn Message Ads

  objective:
    required: true
    options:
      - awareness          # Brand awareness, reach
      - traffic            # Website visits
      - engagement         # Likes, comments, shares
      - leads              # Lead generation
      - sales              # Conversions, purchases

  funnel_stage:
    required: true
    options:
      - cold               # Never heard of brand
      - warm               # Some familiarity
      - hot                # Ready to buy
      - retargeting        # Visited but didn't convert

product_info:
  product_name:
    required: true
    description: "Nome do produto/serviço/oferta"

  product_type:
    required: true
    options:
      - physical_product
      - digital_product
      - saas
      - service
      - course_coaching
      - info_product
      - event
      - lead_magnet

  price_point:
    required: true
    options:
      - free               # Lead magnet
      - low_ticket         # <$100
      - mid_ticket         # $100-$1000
      - high_ticket        # $1000+

  unique_mechanism:
    required: true
    description: "O que torna este produto diferente?"

  key_benefits:
    required: true
    format: "Lista de 3-5 benefícios principais"

  proof_elements:
    required: false
    format: "Resultados, depoimentos, estudos, números"

audience_info:
  target_avatar:
    required: true
    description: "Descrição detalhada do público-alvo"

  primary_pain:
    required: true
    description: "Principal dor/problema que o produto resolve"

  desired_outcome:
    required: true
    description: "Resultado desejado pelo público"

  objections:
    required: false
    format: "Lista de principais objeções"

  awareness_level:
    required: true
    options:
      - unaware            # Não sabe que tem o problema
      - problem_aware      # Sabe do problema, não da solução
      - solution_aware     # Conhece soluções, não seu produto
      - product_aware      # Conhece seu produto
      - most_aware         # Pronto para comprar
```

### 1.2 Optional Inputs

```yaml
creative_direction:
  copywriter_style:
    options:
      - hopkins            # Data-driven, specific numbers
      - kennedy            # Urgency, scarcity, aggressive
      - ogilvy             # Elegant, credible, brand + response
      - kern               # Casual, authentic, native
      - hormozi            # Value-focused, grand slam offers
    default: hopkins

  tone:
    options:
      - professional
      - casual
      - urgent
      - conversational
      - authoritative
      - playful

  hook_type_preference:
    options:
      - curiosity
      - result
      - contrarian
      - story
      - question
      - authority

competitive_context:
  competitor_ads:
    description: "URLs ou descrição de anúncios concorrentes"

  differentiation:
    description: "Como se diferenciar da concorrência"

performance_context:
  existing_ads:
    description: "Anúncios anteriores para melhorar"

  winning_hooks:
    description: "Hooks que já funcionaram"

  budget:
    description: "Orçamento diário (para ajustar estratégia)"
```

---

## Phase 2: Platform Specifications

### 2.1 Meta (Facebook/Instagram) Feed Ads

```yaml
specifications:
  primary_text:
    visible: "125 characters before 'See More'"
    total_limit: "500 characters"
    best_practice: "Front-load key message in first 125 chars"

  headline:
    limit: "40 characters"
    best_practice: "Benefit or CTA focused"

  description:
    limit: "30 characters"
    usage: "Secondary info or CTA variation"

  image:
    ratio: "1:1 (square) or 4:5 (vertical)"
    text_limit: "Less than 20% of image area"

copy_structure:
  |
  [HOOK - 1-2 sentences, must stop scroll]

  [BRIDGE - Why this matters to them]

  [BODY - Benefits, proof, or story]

  [CTA - Clear next step with reason]

testing_priority:
  1: "Hook (first 125 characters)"
  2: "Creative (image/video)"
  3: "Headline"
  4: "Audience targeting"

benchmarks:
  ctr_good: "1-2%"
  ctr_excellent: "2%+"
  cpm: "Industry dependent"
```

### 2.2 Meta Stories/Reels

```yaml
specifications:
  format: "Vertical 9:16"
  duration: "15 seconds max (recommended)"
  text_overlay: "Minimal, large, readable"
  cta_placement: "Bottom of screen"

copy_approach:
  - Text overlay for hook
  - Minimal copy (visual-first)
  - Strong verbal CTA
  - Native feel (not "ad-like")

structure:
  0-3s: "Hook (text + visual)"
  3-10s: "Problem/Solution"
  10-15s: "CTA + swipe up"
```

### 2.3 Google Search Ads (RSA)

```yaml
specifications:
  headlines:
    count: "3-15 headlines (3 shown at a time)"
    characters: "30 per headline"

  descriptions:
    count: "2-4 descriptions (2 shown at a time)"
    characters: "90 per description"

  display_url:
    paths: "2 paths x 15 characters each"

headline_formulas:
  keyword_benefit:
    pattern: "[Keyword] | [Benefit]"
    example: "Accounting Software | Save 10+ Hours/Week"

  question_solution:
    pattern: "[Question]? | [Solution]"
    example: "Need a CRM? | Free Trial, No Credit Card"

  social_proof_cta:
    pattern: "[Social Proof] | [CTA]"
    example: "Join 50,000+ Businesses | Start Free Today"

  urgency_offer:
    pattern: "[Urgency] | [Offer]"
    example: "20% Off Ends Tonight | Shop Now"

description_formulas:
  features_benefits:
    pattern: "[Features]. [Benefits]—[Value proposition]."
    example: "Automated invoicing, expense tracking, and financial reports. Everything you need to run your business finances—no accounting degree required."

  problem_solution_proof:
    pattern: "[Problem]? [Solution]. [Proof]."
    example: "Tired of spreadsheet chaos? Our platform organizes your finances automatically. Trusted by 50,000+ small businesses."

key_principles:
  - Include primary keyword in Headline 1
  - Match ad message to landing page
  - Use all available ad extensions
  - Include numbers and specifics
  - Create 8-10 headline variations for AI optimization

benchmarks:
  ctr_good: "3-5%"
  ctr_excellent: "5%+"
  quality_score_target: "7+"
```

### 2.4 YouTube Ads (Skippable In-Stream)

```yaml
specifications:
  skip_after: "5 seconds"
  ideal_length: "30-60 seconds"
  max_length: "No limit (quality matters)"
  hook_window: "0-5 seconds CRITICAL"

the_5_second_rule:
  |
  You have exactly 5 seconds before viewers can skip.
  This window determines whether they watch or leave.
  Spend 80% of creative effort on these 5 seconds.

winning_hook_patterns:
  bold_claim:
    pattern: "I'm going to show you how to [result] in [timeframe]."
    example: "I'm going to show you how to generate 100 leads per day in the next 60 seconds."

  question:
    pattern: "What if you could [desired outcome] without [obstacle]?"
    example: "What if you could lose 20 pounds without giving up your favorite foods?"

  pattern_interrupt:
    description: "Start mid-action, unusual visual, unexpected statement"
    example: "*Person screaming* Sorry, just had to get your attention for what I'm about to tell you..."

  social_proof:
    pattern: "Over [X] people have already [result] with this..."
    example: "Over 50,000 entrepreneurs have already tripled their income using this exact method."

  direct_address:
    pattern: "Hey [avatar], if you're struggling with [problem], watch this."
    example: "Hey business owner, if you're struggling to hire good people, the next 60 seconds could change everything."

script_structure:
  0-5s:
    purpose: "HOOK - Must keep them watching"
    tips:
      - Lead with the end result
      - Make a bold claim
      - Pattern interrupt

  5-15s:
    purpose: "PROBLEM - Connect with their pain"
    tips:
      - Agitate the problem
      - Show you understand
      - Create emotional connection

  15-35s:
    purpose: "SOLUTION - Your offer/product"
    tips:
      - Present the mechanism
      - Explain how it works differently
      - Stack benefits

  35-50s:
    purpose: "PROOF - Results, testimonials, data"
    tips:
      - Show real results
      - Use specific numbers
      - Include social proof

  50-60s:
    purpose: "CTA - Clear action + urgency"
    tips:
      - Tell them exactly what to do
      - Give reason to act now
      - Remove friction

benchmarks:
  view_rate_good: "15-25%"
  view_rate_excellent: "25%+"
  watch_time_target: "25%+ of video"
  ctr_good: "0.5-1%"
```

### 2.5 TikTok Ads

```yaml
specifications:
  format: "Vertical 9:16"
  length: "15-60 seconds (21-34s optimal)"
  style: "Must feel like organic content"

the_1_3_second_rule:
  |
  TikTok scroll is faster than any platform.
  Hook must hit within 1-3 seconds or they're gone.
  Native content outperforms polished ads 10x.

native_hook_patterns:
  trend_integration:
    description: "Use trending sounds and formats"
    example: "Follow the 'POV' or 'storytime' format"

  text_overlay:
    pattern: "POV: You just discovered [product]"
    example: "POV: You just discovered the app that pays you to walk"

  direct_talk:
    pattern: "Okay so nobody's talking about this..."
    example: "Okay so nobody's talking about how easy it is to start an online business in 2024..."

  problem_callout:
    pattern: "If you're struggling with [X], you need to hear this"
    example: "If you're struggling to grow on Instagram, you need to hear this"

  transformation:
    description: "Before/after revealed instantly"
    example: "Show dramatic transformation in first 2 seconds"

copy_rules:
  - Don't look like an ad
  - Use creator-style language ("no cap", "lowkey", etc.)
  - Keep text overlays short and punchy
  - Leverage trending sounds/formats
  - Hook in first 1-3 seconds or lose them
  - Authentic > Polished
  - UGC style performs best

structure:
  0-3s: "HOOK - Text overlay + attention grabber"
  3-15s: "STORY - Problem or journey"
  15-25s: "SOLUTION - Product reveal"
  25-30s: "CTA - Learn more, link in bio"
```

### 2.6 LinkedIn Ads

```yaml
specifications:
  sponsored_content:
    intro_text_visible: "150 characters"
    intro_text_total: "600 characters"
    headline: "70 characters"

  message_ads:
    subject: "60 characters"
    body: "1,500 characters"

tone: "Professional but human—not corporate speak"

effective_hook_patterns:
  insight_hook:
    pattern: "[X%] of [professionals] make this mistake..."
    example: "73% of B2B marketers make this critical lead gen mistake..."

  question_hook:
    pattern: "What's your strategy for [business challenge]?"
    example: "What's your strategy for scaling without burning out your team?"

  authority_hook:
    pattern: "After [X years] in [industry], here's what I know..."
    example: "After 15 years in SaaS, here's what I know about churn..."

  data_hook:
    pattern: "We analyzed [X] companies and found..."
    example: "We analyzed 500 high-growth startups and found 3 patterns..."

copy_structure:
  |
  [HOOK - Industry-relevant insight]

  [PROBLEM - Business pain point]

  [SOLUTION - Professional benefit]

  [PROOF - Case study, data, or testimonial]

  [CTA - Download, demo, learn more]

cta_options:
  - "Download the playbook"
  - "Book a demo"
  - "Get the case study"
  - "Join the webinar"
  - "Learn more"
```

---

## Phase 3: Hook Development

### 3.1 Curiosity Hooks

Create an open loop that demands resolution:

```yaml
patterns:
  mistake_reveal:
    template: "The #1 mistake [avatar] make with [topic]..."
    example: "The #1 mistake new entrepreneurs make with their pricing..."

  insider_knowledge:
    template: "What [successful group] knows that you don't..."
    example: "What 7-figure coaches know that you don't about getting clients..."

  hidden_reason:
    template: "The hidden reason your [problem] keeps happening..."
    example: "The hidden reason your ads keep getting rejected..."

  counterintuitive:
    template: "Why [common solution] actually makes [problem] worse..."
    example: "Why posting more content actually makes your engagement worse..."

  secret_trick:
    template: "The [number]-second trick that changes everything..."
    example: "The 30-second trick that changes how you write emails forever..."

psychology: "Curiosity gap creates tension that only clicking/watching can resolve."
```

### 3.2 Result Hooks

Lead with specific, desirable outcomes:

```yaml
patterns:
  how_i_achieved:
    template: "How I [result] in [timeframe] without [sacrifice]"
    example: "How I got 10,000 followers in 30 days without posting every day"

  exact_result:
    template: "[Exact result] in [exact timeframe]—here's how"
    example: "R$50,000 in 7 days—here's the exact funnel I used"

  transformation:
    template: "From [before state] to [after state] in [timeframe]"
    example: "From broke designer to 6-figure agency owner in 18 months"

  method_reveal:
    template: "The method that generated [$X] in [timeframe]"
    example: "The method that generated $1.2M in 90 days for my client"

  normal_person:
    template: "How [normal person] achieved [impressive result]"
    example: "How a stay-at-home mom built a 7-figure business from her phone"

psychology: "Concrete results create belief and desire."
```

### 3.3 Contrarian Hooks

Challenge conventional wisdom:

```yaml
patterns:
  forget_everything:
    template: "Forget everything you know about [topic]..."
    example: "Forget everything you know about lead generation..."

  common_belief_kills:
    template: "[Common belief] is killing your [goal]"
    example: "Posting consistently is killing your Instagram growth"

  stopped_and_result:
    template: "Why I stopped [common practice] and what happened"
    example: "Why I stopped using hashtags and tripled my reach"

  bad_advice:
    template: "The [topic] advice that's actually making things worse"
    example: "The networking advice that's actually hurting your career"

  expert_wrong:
    template: "[Expert/everyone] was wrong about [topic]. Here's proof."
    example: "Gary Vee was wrong about this. Here's proof."

psychology: "Triggers cognitive dissonance and need to resolve."
```

### 3.4 Story Hooks

Open narrative loops:

```yaml
patterns:
  years_ago:
    template: "[X] years ago, I was [desperate situation]..."
    example: "3 years ago, I was living in my parents' basement with $200 to my name..."

  client_call:
    template: "My client called me at [dramatic time] because..."
    example: "My client called me at 2am because their ads stopped working..."

  almost_quit:
    template: "I almost quit [field] until I discovered..."
    example: "I almost quit freelancing until I discovered this one strategy..."

  experiment:
    template: "What happened when I tried [experiment]..."
    example: "What happened when I spent $10,000 testing different hooks..."

  pivotal_moment:
    template: "The [message/email/call] that changed everything..."
    example: "The email that changed my entire business model..."

psychology: "Humans are wired for narrative completion."
```

### 3.5 Authority Hooks

Establish credibility immediately:

```yaml
patterns:
  years_experience:
    template: "After [X] years helping [avatar]..."
    example: "After 12 years helping SaaS companies scale..."

  credential_reveal:
    template: "[Credential] reveals..."
    example: "Ex-Facebook ad buyer reveals the algorithm change nobody's talking about..."

  featured_in:
    template: "Featured in [prestigious source]..."
    example: "Featured in Forbes, Entrepreneur, and Inc.—here's what I learned..."

  impressive_clients:
    template: "The method used by [impressive clients]..."
    example: "The method used by Nike, Apple, and Tesla for their launches..."

  numbers_speak:
    template: "[Number] of [results] can't be wrong..."
    example: "47,000 success stories can't be wrong..."

psychology: "Authority shortcuts trust-building process."
```

### 3.6 Question Hooks

Engage directly by asking:

```yaml
patterns:
  tired_of:
    template: "Are you tired of [problem]?"
    example: "Are you tired of leads that never convert?"

  what_would_you_do:
    template: "What would you do with [benefit]?"
    example: "What would you do with 10 extra hours per week?"

  why_successful:
    template: "Why are some [avatars] so much more successful?"
    example: "Why do some coaches charge $10K while you struggle at $500?"

  ever_wondered:
    template: "Have you ever wondered why [phenomenon]?"
    example: "Have you ever wondered why some posts go viral and yours don't?"

  what_if:
    template: "What if [desired outcome] was actually possible?"
    example: "What if 6-figure months were actually possible for your business?"

psychology: "Questions activate mental engagement."
```

---

## Phase 4: Ad Copy Frameworks

### 4.1 PAS (Problem-Agitate-Solution)

```yaml
structure:
  problem:
    purpose: "Identify specific pain point"
    length: "1-2 sentences"

  agitate:
    purpose: "Make the pain feel more urgent"
    length: "2-3 sentences"
    techniques:
      - Describe consequences of not solving
      - Show they're not alone
      - Paint the frustrating reality

  solution:
    purpose: "Present your offer as the answer"
    length: "2-3 sentences"

  cta:
    purpose: "Clear next step"

template:
  |
  [PROBLEM]
  Tired of [specific pain point]?

  [AGITATE]
  You've tried [common solutions]—but [why they fail].
  Meanwhile, [consequence of not solving]...

  [SOLUTION]
  [Product/Method name] is different because [unique mechanism].
  [Social proof: number] already [achieved result].

  [CTA]
  [Action] + [urgency/benefit]

example:
  |
  Tired of workout programs that don't work?

  You've tried diets, gyms, apps—but the weight keeps coming back.
  Meanwhile, you're exhausted, frustrated, and losing hope...

  Our 12-week metabolic reset targets the REAL issue: metabolic adaptation.
  Join 10,000+ who've lost 20+ lbs and actually kept it off.

  Start your free trial today →

best_for:
  - Cold audiences
  - Awareness stage
  - When audience knows they have a problem
  - Meta Feed ads
  - LinkedIn ads
```

### 4.2 AIDA (Attention-Interest-Desire-Action)

```yaml
structure:
  attention:
    purpose: "Stop the scroll with a hook"
    techniques:
      - Bold statement
      - Surprising statistic
      - Provocative question

  interest:
    purpose: "Build curiosity with benefits"
    techniques:
      - Explain what makes it different
      - Show key benefit
      - Create intrigue

  desire:
    purpose: "Create emotional want with proof"
    techniques:
      - Social proof
      - Testimonials
      - Results
      - Visualization

  action:
    purpose: "Clear CTA with urgency"
    techniques:
      - Specific instruction
      - Reason to act now
      - Risk reversal

template:
  |
  [ATTENTION]
  [Hook - bold claim or question]

  [INTEREST]
  [Product] helps you [benefit] by [mechanism].

  [DESIRE]
  [Proof element - testimonial, stat, or result]

  [ACTION]
  [CTA] + [urgency or bonus]

example:
  |
  What if your team could finish projects 40% faster?

  Our AI-powered workflow tool eliminates bottlenecks
  and automates repetitive tasks automatically.

  Teams at Shopify, Stripe, and Notion save 12+ hours per week.
  Here's what they're saying...

  Try free for 14 days → No credit card required

best_for:
  - Full-funnel messaging
  - Product launches
  - Feature highlights
  - Google Search ads
  - YouTube ads
```

### 4.3 BAB (Before-After-Bridge)

```yaml
structure:
  before:
    purpose: "Paint the current painful state"
    techniques:
      - Describe daily struggle
      - Show frustration
      - Make it vivid

  after:
    purpose: "Show the desired future state"
    techniques:
      - Paint the transformation
      - Show specific outcomes
      - Make it desirable

  bridge:
    purpose: "Explain how your product connects them"
    techniques:
      - Name the solution
      - Explain the mechanism
      - Show the path

template:
  |
  [BEFORE]
  [Current painful reality - be specific]

  [AFTER]
  [Desired future state - be vivid]

  [BRIDGE]
  [Product name] helps you go from [before] to [after] by [mechanism].
  [Social proof or guarantee]

  [CTA]

example:
  |
  Struggling to get clients as a freelancer?
  Cold outreach, crickets, feast-or-famine cycles...

  Imagine: clients coming TO you, a waiting list of projects,
  charging premium rates without negotiating.

  The Inbound Freelancer System teaches you to build
  a client attraction engine in just 6 weeks.

  Join 2,500+ freelancers who've made the switch →

best_for:
  - Transformation offers
  - Coaching and courses
  - Services
  - TikTok ads
  - Stories/Reels
```

### 4.4 4Ps (Picture-Promise-Prove-Push)

```yaml
structure:
  picture:
    purpose: "Paint a vivid scenario"
    techniques:
      - Start with "Imagine..."
      - Describe specific situation
      - Appeal to senses

  promise:
    purpose: "Make a specific claim"
    techniques:
      - Quantify the benefit
      - Be specific
      - Make it believable

  prove:
    purpose: "Back it with evidence"
    techniques:
      - Data/statistics
      - Studies
      - Testimonials
      - Case studies

  push:
    purpose: "Drive to action"
    techniques:
      - Clear CTA
      - Remove risk
      - Add urgency

template:
  |
  [PICTURE]
  Imagine [vivid scenario of desired outcome]...

  [PROMISE]
  [Product] delivers [specific measurable benefit].

  [PROVE]
  [Evidence: study, testimonial, or data]

  [PUSH]
  [CTA] + [risk reversal] + [urgency if applicable]

example:
  |
  Imagine waking up without back pain for the first time in years.

  Our orthopedic mattress reduces spinal pressure by 78%
  and supports proper alignment all night long.

  Backed by 3 clinical studies and 50,000+ 5-star reviews.
  "Best purchase I've made in 10 years" - Jennifer M.

  Risk-free 365-night trial. Free delivery. Shop now →

best_for:
  - High-ticket items
  - Health-related products
  - Skeptical markets
  - Google Search
  - LinkedIn
```

### 4.5 QUEST (Qualify-Understand-Educate-Stimulate-Transition)

```yaml
structure:
  qualify:
    purpose: "Call out your specific audience"
    techniques:
      - "Attention [specific avatar]..."
      - Use specific qualifiers
      - Filter out non-targets

  understand:
    purpose: "Show you know their situation"
    techniques:
      - Describe their reality
      - Show empathy
      - Use their language

  educate:
    purpose: "Teach something valuable"
    techniques:
      - Share insight
      - Explain the real problem
      - Add value before asking

  stimulate:
    purpose: "Create emotional response"
    techniques:
      - Show possibilities
      - Create desire
      - Use contrast

  transition:
    purpose: "Move to CTA"
    techniques:
      - Bridge to offer
      - Clear next step
      - Low commitment first

template:
  |
  [QUALIFY]
  Attention [specific avatar with qualifiers]...

  [UNDERSTAND]
  You've got [achievement], but [current struggle].

  [EDUCATE]
  The problem isn't [obvious thing]—it's [real insight].

  [STIMULATE]
  What if you could [desired outcome] without [sacrifice]?

  [TRANSITION]
  Get our [lead magnet/offer] →

example:
  |
  Attention SaaS founders doing $1-10M ARR...

  You've got product-market fit, but scaling the sales team is brutal.
  Reps take 3 months to ramp, turnover is high, and you're still
  closing most deals yourself.

  The problem isn't hiring—it's having no repeatable playbook.

  What if you could onboard new reps in 2 weeks instead of 3 months?

  Get our Sales Playbook Template (free) →

best_for:
  - B2B offers
  - Long-form ad copy
  - LinkedIn
  - YouTube scripts
```

---

## Phase 5: Copywriter Style Application

### 5.1 Claude Hopkins Style

```yaml
characteristics:
  - Data-driven claims with specific numbers
  - Testable propositions
  - Benefit-focused headlines
  - Service orientation
  - Specificity over platitudes

voice_markers:
  - "Save 47%" not "Save money"
  - "2,340 customers" not "thousands"
  - Facts > hype
  - Proof > claims

best_for:
  - Google Search ads
  - B2B advertising
  - Product-focused campaigns
  - A/B test frameworks

example_ad:
  |
  Accounting software that saves 10+ hours/week.

  Join 47,293 small businesses who've automated their invoicing,
  expense tracking, and tax prep with [Product].

  Average user saves $4,200/year in accountant fees.

  Try free for 14 days. No credit card required.
```

### 5.2 Dan Kennedy Style

```yaml
characteristics:
  - Urgency and scarcity
  - Direct response focus
  - Aggressive CTAs
  - Deadline-driven
  - No-nonsense copy
  - Polarizing to filter non-buyers

voice_markers:
  - "WARNING: This offer ends at midnight"
  - "Only 17 spots remaining"
  - "If you're not serious, this isn't for you"
  - Deadlines, limits, countdown

best_for:
  - Limited-time offers
  - Sales promotions
  - High-ticket services
  - Direct response campaigns

example_ad:
  |
  WARNING: Registration closes at midnight.

  Only 23 spots remaining for the Marketing Mastery Intensive.

  This isn't for tire-kickers. If you're not ready to invest
  $997 and 8 hours of focused work, don't apply.

  But if you're serious about 10X-ing your results in 90 days,
  this is your last chance until 2027.

  Apply now (interview required) →
```

### 5.3 David Ogilvy Style

```yaml
characteristics:
  - Elegant, factual copy
  - Long-form when needed
  - Brand + response balance
  - Credibility first
  - Research-backed claims
  - Sophisticated audience

voice_markers:
  - "At 60 miles an hour, the loudest noise..."
  - Facts told with style
  - Authority without arrogance
  - Refined language

best_for:
  - Premium brands
  - B2B thought leadership
  - LinkedIn advertising
  - Long-form YouTube

example_ad:
  |
  What separates a [FAIXA_CONSULTOR_EXEMPLO] consultant from a [FAIXA_ADVISOR_EXEMPLO] advisor?

  After interviewing 200 top-tier consultants, we found
  the answer wasn't expertise—it was positioning.

  The highest-paid advisors don't sell time.
  They sell transformations with guaranteed outcomes.

  Our research reveals exactly how they structure their offers,
  price their services, and attract premium clients.

  Download the Executive Summary (free) →
```

### 5.4 Frank Kern Style

```yaml
characteristics:
  - Conversational tone
  - Authentic storytelling
  - "Native" feel
  - Casual language
  - Personality-driven
  - Like talking to a friend

voice_markers:
  - "Dude, you gotta see this"
  - "Here's the thing..."
  - "Look, I'm gonna be real with you"
  - Stories > stats

best_for:
  - TikTok ads
  - Instagram Stories/Reels
  - Personal brands
  - Course/coaching offers

example_ad:
  |
  Okay so... nobody's really talking about this.

  But I've been testing this new way of getting clients
  and it's kind of ridiculous how well it works.

  Basically, instead of chasing people, you just...
  [continues story]

  Anyway, I put together a free training on it.
  Link in bio if you want it.
```

### 5.5 Alex Hormozi Style

```yaml
characteristics:
  - Value-stack focused
  - Grand Slam Offer structure
  - Math-based persuasion
  - Remove all friction
  - Risk reversal heavy

voice_markers:
  - "Here's what you get..."
  - Stack the value
  - "Total value: $X. You pay: $Y"
  - Irresistible math

best_for:
  - Offer-centric ads
  - High-value stacks
  - Course launches
  - Service businesses

example_ad:
  |
  What you get:

  ✓ 12-week coaching program ($5,000 value)
  ✓ Private community access ($997/year value)
  ✓ Weekly group calls ($2,500 value)
  ✓ Done-for-you templates ($500 value)
  ✓ 1:1 kickoff call ($500 value)

  Total value: $9,497

  Your investment: $1,997 (or 4 payments of $549)

  Plus: If you don't 3X your investment in 90 days,
  I'll refund every penny AND let you keep everything.

  Limited to 50 spots. 23 remaining.
```

---

## Phase 6: Ad Creation Process

### 6.1 Step-by-Step Workflow

```yaml
step_1_gather_inputs:
  duration: "10-15 min"
  actions:
    - Collect all required inputs from Phase 1
    - Clarify any ambiguities
    - Understand awareness level
    - Identify existing proof elements

step_2_select_platform_specs:
  duration: "5 min"
  actions:
    - Reference Phase 2 specifications
    - Note character limits
    - Understand format requirements
    - Check platform-specific best practices

step_3_develop_hooks:
  duration: "15-20 min"
  actions:
    - Generate 5-10 hook variations
    - Use hook categories from Phase 3
    - Match hook type to audience awareness
    - Prioritize based on platform

step_4_select_framework:
  duration: "5 min"
  actions:
    - Match framework to objective and audience
    - Consider funnel stage
    - Reference Phase 4 frameworks

step_5_apply_copywriter_style:
  duration: "5 min"
  actions:
    - Select style from Phase 5
    - Adapt voice to platform
    - Maintain consistency

step_6_write_ad_variations:
  duration: "20-30 min"
  actions:
    - Write 3 complete ad variations
    - Use best hooks with selected framework
    - Respect platform specifications
    - Include all required elements

step_7_quality_check:
  duration: "10 min"
  actions:
    - Run through quality checklist
    - Verify character counts
    - Check for clarity
    - Ensure CTA is strong
```

### 6.2 Awareness Level Matching

```yaml
unaware:
  hook_type: curiosity, story
  framework: PAS, BAB
  approach: "Lead with problem, don't pitch immediately"
  example_hook: "The hidden reason you're always tired..."

problem_aware:
  hook_type: problem, question
  framework: PAS, QUEST
  approach: "Agitate problem, introduce solution category"
  example_hook: "Tired of [problem]? Here's why nothing has worked..."

solution_aware:
  hook_type: result, contrarian
  framework: AIDA, 4Ps
  approach: "Differentiate your solution, show proof"
  example_hook: "Why [common solution] doesn't work and what to do instead"

product_aware:
  hook_type: result, authority
  framework: 4Ps, value stack
  approach: "Focus on offer, proof, and urgency"
  example_hook: "[Product] helped 10,000+ [avatars] achieve [result]"

most_aware:
  hook_type: urgency, offer
  framework: direct offer
  approach: "Lead with offer, add urgency/scarcity"
  example_hook: "Last chance: [Offer] ends tonight"
```

---

## Phase 7: Output Deliverables

### 7.1 Output Format per Ad

```yaml
ad_deliverable:
  platform: "[Platform name]"
  objective: "[Campaign objective]"

  hooks:
    primary: "[Main hook - best performer prediction]"
    variation_1: "[Alternative hook 1]"
    variation_2: "[Alternative hook 2]"

  copy:
    primary_text: |
      [Full primary text respecting character limits]

    headline: "[Headline within limit]"

    description: "[Description if applicable]"

  cta:
    button: "[CTA button text]"
    verbal: "[Verbal CTA if video]"

  creative_direction:
    image_concept: "[Description of ideal image/visual]"
    video_concept: "[If video, brief storyboard]"
    text_overlay: "[Any text on creative]"

  targeting_suggestions:
    interests: ["List of interest targets"]
    demographics: "[Age, gender, location]"
    custom_audiences: "[Retargeting, lookalike, etc.]"

  testing_recommendations:
    test_1: "[First variable to test]"
    test_2: "[Second variable to test]"
    success_metrics: "[KPIs to track]"

  compliance_notes:
    - "[Any platform policy considerations]"
    - "[Claim substantiation requirements]"
```

### 7.2 Deliverable Package

```yaml
complete_package:
  summary:
    platform: "[Platform]"
    objective: "[Objective]"
    ads_created: "[Number]"

  ads:
    - ad_1: "[Full ad deliverable]"
    - ad_2: "[Full ad deliverable]"
    - ad_3: "[Full ad deliverable]"

  testing_roadmap:
    week_1: "Test hooks (3-5 variations)"
    week_2: "Winner hook + test creatives (3-5)"
    week_3: "Winner creative + test body copy (3-5)"
    week_4: "Winner copy + test CTAs (3-5)"
    week_5: "Scale winners, new hypothesis tests"

  benchmarks:
    ctr_target: "[Platform-specific]"
    cpc_target: "[Industry average or below]"
    conversion_target: "[Based on funnel]"

  next_steps:
    - "[Action 1]"
    - "[Action 2]"
    - "[Action 3]"
```

---

## Phase 8: Quality Assurance

### 8.1 Pre-Launch Checklist

```yaml
hook_quality:
  - [ ] Stops scroll in <3 seconds
  - [ ] Relevant to target avatar
  - [ ] Creates curiosity or desire
  - [ ] Clear, not clever
  - [ ] Matches awareness level

platform_compliance:
  - [ ] Character limits respected
  - [ ] Image/video ratios correct
  - [ ] Policy-compliant claims
  - [ ] No prohibited content
  - [ ] Text-on-image within limits (Meta)

offer_clarity:
  - [ ] Benefit is specific and measurable
  - [ ] CTA is unmistakable
  - [ ] Urgency is present (if applicable)
  - [ ] Value proposition is clear
  - [ ] Reason to act NOW

copy_quality:
  - [ ] Framework properly applied
  - [ ] Copywriter style consistent
  - [ ] Proof elements included
  - [ ] No jargon or confusion
  - [ ] Speaks to ONE avatar

tracking:
  - [ ] UTM parameters set
  - [ ] Conversion tracking configured
  - [ ] Attribution model selected
  - [ ] Pixel/tag verified
```

### 8.2 Performance Benchmarks

```yaml
meta_ads:
  ctr_link:
    good: "1-2%"
    excellent: "2%+"
  cpm:
    note: "Industry dependent"
  conversion_rate:
    landing_page: "5-10%"

google_search:
  ctr:
    good: "3-5%"
    excellent: "5%+"
  quality_score:
    target: "7+"
  cpc:
    target: "Below industry average"

youtube:
  view_rate:
    good: "15-25%"
    excellent: "25%+"
  watch_time:
    target: "25%+ of video"
  ctr:
    good: "0.5-1%"

tiktok:
  view_rate:
    note: "Varies by content type"
  engagement:
    good: "5%+"
  ctr:
    good: "1%+"

linkedin:
  ctr:
    good: "0.5-1%"
  cpl:
    note: "Typically higher than other platforms"
```

### 8.3 Testing Rules

```yaml
rule_1:
  name: "Test One Variable at a Time"
  reason: "Otherwise you can't know what caused the change"

rule_2:
  name: "Statistical Significance Matters"
  minimum: "95% confidence before declaring winner"

rule_3:
  name: "Let Tests Run"
  reason: "Don't stop early—initial results often flip"
  minimum_impressions: "1,000+ per variation"

rule_4:
  name: "Document Everything"
  action: "Build swipe file of winners/losers with hypotheses"

rule_5:
  name: "Test Big Changes First"
  reason: "Small tweaks require huge sample sizes"
  priority: "Big ideas before minor optimizations"
```

---

## Appendix A: Quick Reference Templates

### A.1 Meta Feed Ad Template

```
[HOOK - max 125 chars visible]
________________________________

[BODY - benefits/proof/story]
________________________________

[CTA with reason to act]

---
Headline: [40 chars max]
Description: [30 chars max]
Button: [Learn More / Shop Now / Sign Up / etc.]
```

### A.2 Google Search Ad Template

```
Headline 1: [30 chars - include keyword]
Headline 2: [30 chars - benefit]
Headline 3: [30 chars - CTA/offer]

Description 1: [90 chars - features + benefits]
Description 2: [90 chars - proof + CTA]

Display Path: yoursite.com/[15 chars]/[15 chars]
```

### A.3 YouTube Script Template

```
[0-5s] HOOK
"[Bold claim or question that keeps them watching]"

[5-15s] PROBLEM
"[Agitate their pain point]"

[15-35s] SOLUTION
"[Present your product/offer]"

[35-50s] PROOF
"[Show results, testimonials, data]"

[50-60s] CTA
"[Clear action + urgency]"
```

### A.4 TikTok Ad Template

```
[0-3s] TEXT OVERLAY + HOOK
"[Attention grabber - native style]"

[3-15s] STORY/PROBLEM
"[Show the journey or pain point]"

[15-25s] SOLUTION REVEAL
"[Product demo or transformation]"

[25-30s] CTA
"[Link in bio / Learn more]"
```

---

## Appendix B: Hopkins' 6 Laws Quick Reference

```yaml
law_1_salesmanship:
  principle: "Advertising is salesmanship in print"
  application: "Every ad must lead to conversion"

law_2_service:
  principle: "The best ads ask no one to buy"
  application: "Lead with value, not pitch"

law_3_headlines:
  principle: "5x more people read the headline"
  application: "Spend 50% of time on hooks"

law_4_specificity:
  principle: "Platitudes roll off like water from a duck"
  application: "47% beats 'significant savings'"

law_5_full_story:
  principle: "Don't assume they know your product"
  application: "Include all necessary information"

law_6_test_everything:
  principle: "Any question can be answered by test"
  application: "A/B test systematically"
```

---

## Version History

```yaml
version: 2.0
date: 2026-01-23
author: Ralph Autonomous Agent
project: Copy Framework v2.0 Upgrade
story: US-033

changes:
  - Complete rewrite following Framework v2.0 standards
  - Added comprehensive platform specifications
  - Expanded hook categories with templates
  - Added 5 detailed ad copy frameworks
  - Added copywriter style application guide
  - Added step-by-step creation workflow
  - Added awareness level matching
  - Added quality assurance checklists
  - Added performance benchmarks
  - Research foundation: 720+ lines

line_count: 1150+
quality_gates:
  - [x] 600+ lines ✓
  - [x] Research foundation referenced ✓
  - [x] Platform-specific guidance ✓
  - [x] Multiple frameworks included ✓
  - [x] Quality checklist included ✓
  - [x] Actionable output format ✓
```

---

*Task Version: 2.0*
*Copy Framework v2.0 Upgrade*
*Research: docs/research/ad-copy-methodology-research.md*
