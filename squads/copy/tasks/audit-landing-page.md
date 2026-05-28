---
task: Audit Landing Page Task
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

# Audit Landing Page Task

## Purpose

Comprehensive landing page audit combining Alex Hormozi's Value Equation, MECLABS Conversion Sequence Heuristic, StoryBrand Framework, and CXL best practices. Delivers actionable scorecard with prioritized fixes and A/B test recommendations.

## When to Use

- Landing page converting below industry benchmarks
- High traffic but low conversions
- Before scaling ad spend
- After offer or messaging changes
- A/B test planning and prioritization
- Launching new campaign or funnel
- Competitive analysis of competitor pages

## Framework Foundation

### MECLABS Conversion Sequence Heuristic

```
C = 4M + 3V + 2(i-f) - 2a

Where:
M = Motivation of user (×4 weight)
V = Value proposition clarity (×3 weight)
i = Incentive to act now (×2 weight)
f = Friction in the process (-×2 weight)
a = Anxiety about converting (-×2 weight)
```

### Alex Hormozi Value Equation

```
Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort Required)

Maximize: Dream Outcome, Likelihood
Minimize: Time Delay, Effort
```

### StoryBrand BrandScript

```
Character → Problem → Guide → Plan → Call to Action → Failure → Success
```

---

## Inputs

```yaml
required:
  - landing_page_url: URL of the page to audit
  - product_name: What you're selling
  - price: Price point or range
  - primary_cta: Main action you want visitors to take

optional:
  - current_conversion: Current conversion rate %
  - traffic_source: Where traffic comes from (paid/organic/email/social)
  - page_type: VSL/Long-form/Short-form/Webinar/Lead-magnet
  - target_avatar: Ideal customer description
  - competitor_urls: Competitor landing pages for comparison
  - ad_creative_url: The ad driving traffic (for message match)
  - brand_voice: Formal/Casual/Professional/Friendly
  - industry: Your industry/niche
  - monthly_traffic: Approximate monthly visitors
```

---

## Phase 1: Pre-Audit Setup

### 1.1 Audit Configuration

```yaml
audit_config:
  audit_type: [full|quick|competitive]

  full_audit:
    duration: 45-60 minutes
    sections: all 10 categories
    deliverables:
      - Complete scorecard (300 points)
      - Prioritized fix list (top 10)
      - Quick wins (5-10)
      - A/B test roadmap
      - Competitor comparison (if provided)

  quick_audit:
    duration: 15-20 minutes
    sections: above-fold, value-prop, cta, trust
    deliverables:
      - Mini scorecard (120 points)
      - Top 5 fixes
      - 3 quick wins

  competitive_audit:
    duration: 30-40 minutes
    sections: comparison matrix
    deliverables:
      - Side-by-side analysis
      - Competitive advantages
      - Gaps to exploit
```

### 1.2 Information Gathering Questions

```yaml
elicit: true
format: numbered_options

questions:
  - question: "What is the primary conversion goal?"
    options:
      1: Purchase/Sale
      2: Lead capture (email)
      3: Free trial signup
      4: Demo/Call booking
      5: Download (lead magnet)
      6: Webinar registration

  - question: "What traffic temperature are you optimizing for?"
    options:
      1: Cold (never heard of you)
      2: Warm (some awareness)
      3: Hot (retargeting/existing list)
      4: Mixed traffic sources

  - question: "What's your current biggest concern?"
    options:
      1: Low conversion rate overall
      2: High bounce rate
      3: People leave without clicking CTA
      4: Form abandonment
      5: Don't know where to start optimizing
      6: Need to beat a competitor

  - question: "Do you have tracking in place?"
    options:
      1: "Yes - GA4 + conversion events"
      2: "Yes - basic analytics only"
      3: "Partial - some tracking gaps"
      4: "No - need to set up"
```

---

## Phase 2: Above-the-Fold Audit (40 points)

### 2.1 The 5-Second Test

**Critical Question:** In 5 seconds, can a visitor understand:
1. What you offer?
2. Who it's for?
3. What action to take?
4. Why they should care?
5. Why they should trust you?

```yaml
five_second_test:
  scoring:
    all_5_clear: 40/40
    4_clear: 32/40
    3_clear: 24/40
    2_clear: 16/40
    1_or_fewer: 8/40
```

### 2.2 Hero Section Checklist

```
□ HEADLINE EVALUATION (10 points)
  □ Specific benefit stated (not vague)
  □ Numbers/specifics included where possible
  □ Addresses reader directly ("you/your")
  □ Matches ad/search intent (message match)
  □ Clear, not clever (clarity > creativity)
  Score: ___/10

□ SUBHEADLINE (5 points)
  □ Elaborates on headline promise
  □ Handles potential objection
  □ Creates curiosity or urgency
  Score: ___/5

□ CTA VISIBILITY (10 points)
  □ CTA button visible without scrolling
  □ High contrast (stands out from page)
  □ Action-oriented text (verb + benefit)
  □ Anxiety reducer present ("No CC required")
  Score: ___/10

□ VISUAL HIERARCHY (10 points)
  □ Eye naturally flows to headline first
  □ Image supports (doesn't distract from) message
  □ No competing visual elements
  □ F-pattern or Z-pattern respected
  Score: ___/10

□ TRUST SIGNAL ABOVE FOLD (5 points)
  □ At least one trust element visible
    - Logo bar ("As seen in")
    - Testimonial snippet
    - Trust badge
    - Review stars
  Score: ___/5

ABOVE-THE-FOLD SCORE: ___/40
```

### 2.3 Message Match Analysis

```yaml
message_match_audit:
  description: "Compare ad/traffic source to landing page"

  check_points:
    - headline_match: "Does LP headline echo ad headline?"
    - visual_match: "Do images/colors match ad creative?"
    - offer_match: "Is the same offer presented?"
    - tone_match: "Is the tone/voice consistent?"

  scoring:
    perfect_match: "No cognitive friction - visitor confirms they're in right place"
    partial_match: "Some disconnect - visitor has to work to confirm relevance"
    no_match: "High bounce risk - visitor feels tricked or confused"

  common_failures:
    - "Ad promises X, page leads with Y"
    - "Ad shows product, page shows people"
    - "Ad casual tone, page corporate tone"
    - "Discount in ad, full price on page"
```

---

## Phase 3: Value Proposition Audit (40 points)

### 3.1 Hormozi Value Equation Analysis

```
□ DREAM OUTCOME (10 points)
  □ Specific transformation stated
  □ Measurable result promised
  □ Emotionally resonant outcome
  □ Realistic yet compelling

  Questions to answer:
  - What will they have/be/feel after?
  - How is their life different?
  - What problem is solved?
  Score: ___/10

□ PERCEIVED LIKELIHOOD (10 points)
  □ Proof that it works (testimonials/case studies)
  □ Mechanism explained (how it works)
  □ Credibility established (authority)
  □ Specific to their situation

  Questions to answer:
  - Why will THIS work for THEM?
  - What makes success inevitable?
  - How do you reduce doubt?
  Score: ___/10

□ TIME TO RESULT (10 points)
  □ Timeline mentioned
  □ Timeline is believable
  □ Quick wins highlighted
  □ Milestone expectations set

  Questions to answer:
  - When will they see first results?
  - What's the full timeline?
  - Is it faster than alternatives?
  Score: ___/10

□ EFFORT REQUIRED (10 points)
  □ Process seems doable
  □ Complexity minimized
  □ "Without [pain]" messaging present
  □ Support/help mentioned

  Questions to answer:
  - How much work do they do?
  - What's been made easier?
  - Why is this simpler than DIY?
  Score: ___/10

VALUE PROPOSITION SCORE: ___/40
```

### 3.2 Value Articulation Checklist

```yaml
value_clarity_test:
  can_visitor_answer:
    - "What exactly am I getting?"
    - "What's different about this vs. alternatives?"
    - "Why should I believe it will work for me?"
    - "What happens if it doesn't work?"
    - "Why should I act now instead of later?"

  all_yes: "Strong value proposition"
  some_no: "Gaps in value communication"
  most_no: "Major value proposition rewrite needed"
```

---

## Phase 4: Trust & Social Proof Audit (40 points)

### 4.1 Trust Element Inventory

```
□ TESTIMONIALS (10 points)
  □ Real names used (not initials)
  □ Photos included (real, not stock)
  □ Specific results mentioned
  □ Company/role for verification
  □ Variety of avatars represented
  □ Video testimonials present (bonus)

  Testimonial Formula Check:
  BEFORE → AFTER → WOULD RECOMMEND
  Score: ___/10

□ AUTHORITY MARKERS (10 points)
  □ "As seen in" media logos
  □ Certifications/credentials displayed
  □ Industry awards/recognition
  □ Years in business/experience
  □ Author/founder credibility section
  Score: ___/10

□ NUMBERS & PROOF (10 points)
  □ Customers served count
  □ Results achieved (aggregate)
  □ Specific case study numbers
  □ Real-time social proof (recent activity)
  □ Verifiable claims
  Score: ___/10

□ CASE STUDIES (10 points)
  □ Detailed transformation stories
  □ Before/after clearly shown
  □ Relatable to target avatar
  □ Timeline included
  □ Specific metrics shared
  Score: ___/10

TRUST SCORE: ___/40
```

### 4.2 Trust Element Placement

```yaml
placement_audit:
  above_fold:
    recommended:
      - One testimonial quote or rating
      - Trust badge or logo bar
      - Customer count or social proof

  mid_page:
    recommended:
      - Full testimonials section
      - Case study highlights
      - "As seen in" section

  near_cta:
    recommended:
      - Guarantee badge
      - Security indicators
      - Risk reversal statement
```

### 4.3 Social Proof Quality Matrix

```yaml
social_proof_scoring:
  video_testimonial_with_results: +5 points
  text_testimonial_with_photo_and_results: +4 points
  text_testimonial_with_photo: +3 points
  text_testimonial_only: +2 points
  star_rating_with_count: +3 points
  media_logo_bar: +2 points
  client_logo_bar: +2 points
  live_customer_count: +3 points

  deductions:
    stock_photo_detected: -2 points
    vague_testimonial: -1 point
    no_attribution: -2 points
```

---

## Phase 5: Objection Handling Audit (40 points)

### 5.1 Common Objections Checklist

```
□ FAQ SECTION (10 points)
  □ Top 5 objections addressed
  □ Answers are helpful (not defensive)
  □ Organized logically
  □ Easy to scan/navigate
  □ Links to relevant sections
  Score: ___/10

□ GUARANTEE/RISK REVERSAL (10 points)
  □ Guarantee clearly stated
  □ Specific (not generic "satisfaction guaranteed")
  □ Better than industry standard
  □ Easy to understand terms
  □ Visually prominent

  Guarantee Types (ranked):
  1. Performance guarantee (best)
  2. Money-back with time period
  3. Exchange/credit guarantee
  4. Generic satisfaction guarantee (weak)
  Score: ___/10

□ PRICE JUSTIFICATION (10 points)
  □ Value stack shown (everything included)
  □ ROI/payback math presented
  □ Comparison to alternatives/cost of inaction
  □ Payment options available
  □ Price anchoring used
  Score: ___/10

□ "IS THIS FOR ME?" SECTION (10 points)
  □ Ideal customer described clearly
  □ "This is for you if..." section
  □ "This is NOT for you if..." (qualifies leads)
  □ Scenarios and use cases shown
  Score: ___/10

OBJECTION HANDLING SCORE: ___/40
```

### 5.2 Objection Mapping

```yaml
objection_audit:
  price_objection:
    present: [yes/no]
    addressed_by: [value stack/ROI/payment plans/comparison]
    location: [section name]

  trust_objection:
    present: [yes/no]
    addressed_by: [testimonials/guarantee/credentials]
    location: [section name]

  need_objection:
    present: [yes/no]
    addressed_by: [problem agitation/urgency]
    location: [section name]

  time_objection:
    present: [yes/no]
    addressed_by: [quick results/easy process]
    location: [section name]

  authority_objection:
    present: [yes/no]
    addressed_by: [case studies/similar customers]
    location: [section name]
```

---

## Phase 6: Urgency & Scarcity Audit (30 points)

### 6.1 Urgency Elements

```
□ DEADLINE PRESENT (10 points)
  □ Clear expiration date/time
  □ Consequence of waiting stated
  □ Countdown timer (if applicable)
  □ Deadline is believable/real
  Score: ___/10

□ SCARCITY SIGNALS (10 points)
  □ Limited quantity communicated
  □ Limited bonuses/pricing
  □ Believable (not fake)
  □ Reason for scarcity explained
  Score: ___/10

□ URGENCY COPY (10 points)
  □ "Why now" clearly answered
  □ Loss aversion triggered
  □ Fear of missing out (FOMO)
  □ Specific not generic ("3 spots left" vs "limited")
  Score: ___/10

URGENCY SCORE: ___/30
```

### 6.2 Urgency Authenticity Check

```yaml
urgency_audit:
  types:
    real_urgency:
      - Limited inventory (verifiable)
      - Price increase date (announced)
      - Cohort/class start date
      - Seasonal/event deadline
      - Bonus expiration

    fake_urgency_red_flags:
      - Perpetual countdown timers
      - "Only X left" that never changes
      - Evergreen "limited time" offers
      - No reason given for deadline

  scoring:
    real_urgency_explained: full_points
    urgency_present_no_explanation: half_points
    fake_urgency_detected: zero_points
```

---

## Phase 7: CTA Optimization Audit (30 points)

### 7.1 Primary CTA Evaluation

```
□ CTA BUTTON DESIGN (10 points)
  □ High contrast color (stands out)
  □ Adequate size (easy to click)
  □ Whitespace around button
  □ Mobile-friendly (thumb-sized)
  □ Single primary CTA per screen
  Score: ___/10

□ CTA COPY (10 points)
  □ Action verb used (Get, Start, Claim, Download)
  □ Benefit included in button text
  □ First-person language ("Get MY free...")
  □ No generic "Submit" or "Click Here"
  □ Urgency word if appropriate ("Now", "Today")
  Score: ___/10

□ CTA PLACEMENT & FREQUENCY (10 points)
  □ CTA above the fold
  □ CTA after value proposition
  □ CTA at page bottom
  □ Sticky CTA (mobile) if appropriate
  □ Not too many (paralysis) or too few (missed opportunities)
  Score: ___/10

CTA SCORE: ___/30
```

### 7.2 CTA Copy Formulas

```yaml
cta_formulas:
  action_benefit:
    - "Get My Free [Resource]"
    - "Start [Desirable Action] Now"
    - "Claim Your [Offer]"
    - "Download the [Asset]"
    - "Schedule My [Service]"

  first_person_test:
    before: "Start Your Free Trial"
    after: "Start My Free Trial"
    typical_lift: "+25-90%"

  anxiety_reducers:
    - "No credit card required"
    - "Cancel anytime"
    - "Free for 14 days"
    - "Takes just 2 minutes"
    - "Join 10,000+ customers"
```

### 7.3 Friction Analysis

```yaml
friction_audit:
  form_fields:
    count: [number]
    necessary: [list of required fields]
    removable: [fields that could be removed]
    impact: "Each unnecessary field = -10% conversion"

  friction_points:
    - required_account_creation: [yes/no]
    - payment_info_upfront: [yes/no]
    - complex_password_requirements: [yes/no]
    - captcha_present: [yes/no]
    - multi_page_form: [yes/no]
    - unclear_next_steps: [yes/no]

  recommendations:
    reduce_fields_to: [minimum necessary]
    add_progress_indicator: [if multi-step]
    add_social_login: [if account required]
```

---

## Phase 8: Technical Performance Audit (40 points)

### 8.1 Page Speed Analysis

```
□ LOAD TIME (10 points)
  □ Desktop loads in <2 seconds
  □ Mobile loads in <3 seconds
  □ No layout shift during load (CLS)
  □ First Contentful Paint <1.8s
  □ Largest Contentful Paint <2.5s
  Score: ___/10

  Speed Impact Reference:
  | Load Time | Conversion Impact |
  |-----------|------------------|
  | 0-2 sec   | Baseline         |
  | 2-3 sec   | -7% conversion   |
  | 3-4 sec   | -11% conversion  |
  | 4-5 sec   | -17% conversion  |
  | 5+ sec    | -22%+ conversion |
```

### 8.2 Mobile Experience

```
□ MOBILE OPTIMIZATION (10 points)
  □ Fully responsive design
  □ No horizontal scrolling
  □ Touch-friendly buttons (44x44px min)
  □ Readable text (16px min)
  □ Forms simplified for mobile
  □ Click-to-call enabled (if applicable)
  Score: ___/10
```

### 8.3 Technical Functionality

```
□ TRACKING & ANALYTICS (10 points)
  □ Google Analytics 4 installed
  □ Conversion events firing correctly
  □ Facebook/Google Pixel installed
  □ Heat mapping available (Hotjar/Clarity)
  □ Form analytics tracking
  Score: ___/10

□ CHECKOUT/FORM FLOW (10 points)
  □ No broken links
  □ Form submits correctly
  □ Confirmation page/email works
  □ Payment processing functions
  □ Error messages are helpful
  Score: ___/10

TECHNICAL SCORE: ___/40
```

### 8.4 Technical Audit Tools

```yaml
recommended_tools:
  speed_testing:
    - Google PageSpeed Insights
    - GTmetrix
    - WebPageTest

  mobile_testing:
    - Google Mobile-Friendly Test
    - BrowserStack
    - Responsive Design Checker

  tracking_verification:
    - Google Tag Assistant
    - Facebook Pixel Helper
    - GA Debugger extension

  heat_mapping:
    - Microsoft Clarity (free)
    - Hotjar
    - Crazy Egg
```

---

## Phase 9: Copy Quality Audit (40 points)

### 9.1 Headline Analysis

```
□ HEADLINES THROUGHOUT PAGE (10 points)
  □ Main headline is benefit-driven
  □ Subheads maintain interest
  □ Section headers are scannable
  □ Numbers/specifics used where possible
  □ Curiosity or emotion triggered
  Score: ___/10
```

### 9.2 Body Copy Evaluation

```
□ BODY COPY (10 points)
  □ Speaks to avatar's specific pain points
  □ Uses "you" language (reader-focused)
  □ Conversational, not corporate
  □ Easy to scan (short paragraphs)
  □ Addresses objections naturally
  Score: ___/10

□ BULLET POINTS (10 points)
  □ Benefits, not features
  □ Fascination-style bullets that create desire
  □ Specific outcomes mentioned
  □ Easy to read quickly
  □ Mixed lengths for visual interest
  Score: ___/10

□ EMOTIONAL HOOKS (10 points)
  □ Fear of loss/missing out present
  □ Desire/aspiration amplified
  □ Status/identity addressed
  □ Story elements (relatable scenario)
  □ Sensory language used
  Score: ___/10

COPY QUALITY SCORE: ___/40
```

### 9.3 Voice of Customer Alignment

```yaml
voc_audit:
  check_for:
    - Customer language used (not corporate jargon)
    - Pain points described in their words
    - Desired outcomes match customer research
    - Objections addressed match real concerns

  voc_sources_to_reference:
    - Customer survey responses
    - Support ticket language
    - Sales call recordings
    - Amazon reviews of similar products
    - Reddit/forum discussions

  scoring:
    heavy_voc_integration: "+10 bonus points"
    some_voc_elements: "standard scoring"
    corporate_speak_only: "-5 penalty points"
```

---

## Phase 10: StoryBrand Framework Audit (Bonus Section)

### 10.1 BrandScript Evaluation

```yaml
storybrand_audit:
  character_hero:
    question: "Is the CUSTOMER positioned as the hero?"
    check: "Copy uses 'you' not 'we' as the main character"

  problem_addressed:
    external: "Is the external problem stated?"
    internal: "Is the internal frustration acknowledged?"
    philosophical: "Is there a 'why it matters' deeper meaning?"

  guide_positioning:
    empathy: "Do you show you understand their struggle?"
    authority: "Do you demonstrate competence to help?"

  plan_clarity:
    question: "Is there a simple 3-step plan?"
    check: "Steps are numbered and clear"

  call_to_action:
    direct: "Is there a clear primary CTA?"
    transitional: "Is there a softer secondary CTA (lead magnet)?"

  failure_stakes:
    question: "What failure are they avoiding?"
    check: "Stakes are clear without being manipulative"

  success_transformation:
    question: "What does success look like?"
    check: "Clear vision of life after using product/service"
```

### 10.2 One-Liner Test

```yaml
one_liner_formula:
  structure: "[PROBLEM] + [SOLUTION] + [RESULT]"

  test: "Can you find this one-liner clearly stated on the page?"

  example:
    problem: "Most businesses struggle to convert website visitors"
    solution: "We create high-converting landing pages"
    result: "That turn clicks into customers"

  full: "Most businesses struggle to convert website visitors.
         We create high-converting landing pages that turn
         clicks into customers."
```

---

## Phase 11: Final Scorecard Generation

### 11.1 Score Compilation

```
+------------------------------------------+
|     LANDING PAGE SCORECARD               |
+------------------------------------------+
| Category              | Score  | Max    |
+------------------------------------------+
| Above the Fold        | ___    | /40    |
| Value Proposition     | ___    | /40    |
| Trust & Social Proof  | ___    | /40    |
| Objection Handling    | ___    | /40    |
| Urgency & Scarcity    | ___    | /30    |
| CTA Optimization      | ___    | /30    |
| Technical Performance | ___    | /40    |
| Copy Quality          | ___    | /40    |
+------------------------------------------+
| TOTAL SCORE           | ___    | /300   |
+------------------------------------------+

CONVERSION POTENTIAL DIAGNOSIS:
0-100:   🔴 BROKEN - Complete redesign needed
101-150: 🟠 WEAK - Major fixes required
151-200: 🟡 DECENT - Optimization needed
201-250: 🟢 GOOD - Fine-tuning opportunities
251-300: 💎 OPTIMIZED - Test and scale
```

### 11.2 Category-Level Diagnosis

```yaml
category_diagnosis:
  above_fold:
    0-15: "Critical - Visitors leave immediately"
    16-25: "Weak - Message unclear"
    26-32: "Decent - Room for improvement"
    33-40: "Strong - Minor tweaks only"

  value_proposition:
    0-15: "Critical - No clear value communicated"
    16-25: "Weak - Value unclear or unbelievable"
    26-32: "Decent - Good but could be stronger"
    33-40: "Strong - Compelling value story"

  trust:
    0-15: "Critical - No reason to trust you"
    16-25: "Weak - Trust elements present but weak"
    26-32: "Decent - Good proof, could add more"
    33-40: "Strong - Highly credible"

  objections:
    0-15: "Critical - Major objections unaddressed"
    16-25: "Weak - Some gaps in objection handling"
    26-32: "Decent - Most objections covered"
    33-40: "Strong - Comprehensive objection handling"

  urgency:
    0-10: "Critical - No reason to act now"
    11-18: "Weak - Generic urgency"
    19-24: "Decent - Some urgency present"
    25-30: "Strong - Compelling reason to act"

  cta:
    0-10: "Critical - CTA confusing or hidden"
    11-18: "Weak - CTA present but not optimized"
    19-24: "Decent - Good CTA, minor improvements"
    25-30: "Strong - Optimized CTAs throughout"

  technical:
    0-15: "Critical - Technical issues hurting conversions"
    16-25: "Weak - Some technical problems"
    26-32: "Decent - Mostly functional"
    33-40: "Strong - Technically excellent"

  copy:
    0-15: "Critical - Copy needs complete rewrite"
    16-25: "Weak - Copy present but not persuasive"
    26-32: "Decent - Good copy, could be stronger"
    33-40: "Strong - Compelling, persuasive copy"
```

---

## Phase 12: Prioritized Recommendations

### 12.1 Fix Prioritization Framework (PIE)

```yaml
pie_framework:
  P_potential: "How much improvement possible? (1-10)"
  I_importance: "How valuable is this traffic? (1-10)"
  E_ease: "How easy to implement? (1-10)"

  priority_score: "P × I × E / 3"

  priority_levels:
    8-10: "Implement immediately"
    5-7: "Schedule for next sprint"
    1-4: "Backlog for future"
```

### 12.2 Fix List Template

```
TOP 10 FIXES BY IMPACT:

FIX #1: [HIGHEST IMPACT]
Category: [Which audit section]
Current State: [What's wrong]
Recommended Change: [Specific fix]
Expected Lift: +X% conversion
PIE Score: [X/10]
Implementation: [Quick/Medium/Complex]

FIX #2: ...
(Continue for top 10)

---

QUICK WINS (15 min each):
1. [Fix] → Expected: +X%
2. [Fix] → Expected: +X%
3. [Fix] → Expected: +X%
4. [Fix] → Expected: +X%
5. [Fix] → Expected: +X%

---

A/B TEST ROADMAP:

TEST #1: [Element]
Hypothesis: If we [change], then [metric] will [improve/increase]
Control: [Current state]
Variant: [Proposed change]
Priority: [1-5]
Expected Lift: [X%]

TEST #2: ...
(Continue for 5-10 tests)
```

### 12.3 Common Fixes Reference

```yaml
high_impact_fixes:
  headline_fixes:
    - Add specific numbers
    - Match ad headline exactly
    - Lead with benefit not feature
    typical_lift: "+10-50%"

  cta_fixes:
    - Change to first-person ("Get MY...")
    - Add action verb + benefit
    - Add anxiety reducer below
    typical_lift: "+10-40%"

  trust_fixes:
    - Add video testimonials
    - Include specific result numbers
    - Show real photos not stock
    typical_lift: "+10-30%"

  urgency_fixes:
    - Add real deadline with reason
    - Show limited availability
    - Add countdown timer
    typical_lift: "+5-25%"

  technical_fixes:
    - Compress images
    - Remove navigation
    - Reduce form fields
    typical_lift: "+5-25%"
```

---

## Phase 13: Copywriter Style Application

### 13.1 Style Guide Integration

```yaml
copywriter_styles:
  claude_hopkins:
    principle: "Specificity over generality"
    application: "Replace vague claims with specific numbers"
    example:
      before: "Grow your business fast"
      after: "Grow your revenue 47% in 90 days"

  david_ogilvy:
    principle: "Headlines do 80% of the work"
    application: "Spend 80% of optimization time on headlines"
    example:
      before: "Welcome to Our Service"
      after: "At 60 miles an hour, the loudest noise comes from the electric clock"

  gary_halbert:
    principle: "Enter the conversation in their head"
    application: "Use exact customer language from research"
    example:
      before: "Optimize your conversion rate"
      after: "Finally stop watching visitors leave without buying"

  eugene_schwartz:
    principle: "Match copy sophistication to awareness level"
    application: "Adjust page structure based on traffic temperature"
    stages:
      unaware: "Lead with problem, not solution"
      problem_aware: "Agitate problem, introduce solution"
      solution_aware: "Differentiate your solution"
      product_aware: "Overcome objections, prove value"
      most_aware: "Make offer, reduce friction"
```

### 13.2 Copy Rewrite Templates

```yaml
headline_rewrites:
  generic_to_specific:
    pattern: "[Generic benefit]" → "[Specific number] + [Specific outcome] + [Timeframe]"
    example:
      before: "Grow Your Business"
      after: "Add $47K Monthly Revenue in 90 Days"

  feature_to_benefit:
    pattern: "[Feature]" → "[Outcome the feature creates]"
    example:
      before: "AI-Powered Analytics"
      after: "Know Exactly Which Ads to Scale (and Which to Kill)"

  we_to_you:
    pattern: "We [do X]" → "You [get Y]"
    example:
      before: "We provide expert marketing services"
      after: "You get marketing that actually brings in customers"

cta_rewrites:
  generic_to_action:
    pattern: "[Generic]" → "[Action verb] + [My/Your] + [Benefit]"
    example:
      before: "Submit"
      after: "Get My Free Audit"

  first_person:
    pattern: "Get Your [X]" → "Get My [X]"
    lift: "+25-90%"
```

---

## Output Deliverables

### Full Audit Output

```yaml
format: markdown
filename: "{company_name}_landing_page_audit_{date}.md"

sections:
  1_executive_summary:
    - Overall score and diagnosis
    - Top 3 opportunities
    - Recommended next steps

  2_detailed_scorecard:
    - All 8 categories with scores
    - Category-level diagnosis
    - Section-by-section breakdown

  3_prioritized_fixes:
    - Top 10 fixes with PIE scores
    - Quick wins list
    - Implementation timeline

  4_ab_test_roadmap:
    - Prioritized test list
    - Hypothesis for each test
    - Expected lift estimates

  5_copy_recommendations:
    - Headline rewrite suggestions
    - CTA optimization
    - Section-by-section copy notes

  6_technical_checklist:
    - Speed improvements
    - Mobile fixes
    - Tracking setup

  7_appendix:
    - Screenshots with annotations
    - Competitor comparison (if provided)
    - Benchmark references
```

### Quick Audit Output

```yaml
format: markdown
filename: "{company_name}_quick_audit_{date}.md"

sections:
  1_score_summary:
    - Mini scorecard (120 points)
    - Diagnosis

  2_top_5_fixes:
    - Prioritized fix list
    - Implementation notes

  3_quick_wins:
    - 3 fixes under 15 minutes each
    - Expected impact
```

---

## Conversion Benchmarks Reference

### By Industry

| Industry | Average | Good | Excellent |
|----------|---------|------|-----------|
| SaaS Free Trial | 2-5% | 5-8% | 8%+ |
| E-commerce | 1-3% | 3-5% | 5%+ |
| B2B Lead Gen | 2-5% | 5-10% | 10%+ |
| Info Products | 1-3% | 3-5% | 5%+ |
| Local Services | 3-6% | 6-10% | 10%+ |
| Finance | 1-3% | 3-5% | 5%+ |
| Healthcare | 2-4% | 4-7% | 7%+ |
| Real Estate | 1-3% | 3-5% | 5%+ |

### By Page Type

| Page Type | Poor | Average | Good | Great |
|-----------|------|---------|------|-------|
| Cold Traffic LP | <1% | 1-2% | 2-5% | 5%+ |
| Warm Traffic LP | <3% | 3-5% | 5-10% | 10%+ |
| Retargeting LP | <5% | 5-10% | 10-20% | 20%+ |
| Checkout Page | <30% | 30-50% | 50-70% | 70%+ |
| VSL Page | <1% | 1-3% | 3-5% | 5%+ |
| Webinar Reg | <15% | 15-30% | 30-50% | 50%+ |
| Lead Magnet | <15% | 15-30% | 30-50% | 50%+ |

---

## Quality Checklist

```yaml
audit_quality_checklist:
  before_delivery:
    - [ ] All 8 categories scored
    - [ ] Total score calculated correctly
    - [ ] Diagnosis matches score range
    - [ ] At least 5 prioritized fixes identified
    - [ ] At least 3 quick wins identified
    - [ ] PIE scores calculated for top fixes
    - [ ] A/B test hypotheses are specific and testable
    - [ ] Copy recommendations include before/after examples
    - [ ] Technical issues documented with screenshots
    - [ ] Benchmarks referenced for context

  quality_standards:
    - Specific not generic (no "improve the headline")
    - Actionable (clear next steps)
    - Prioritized (what to do first)
    - Measurable (expected lift estimates)
    - Evidence-based (citing audit findings)
```

---

## Integration Points

### With Other Copy Tasks

```yaml
integration:
  post_audit_tasks:
    - If headline weak → Use create-ad-copy.md templates
    - If testimonials weak → Request testimonial gathering task
    - If offer unclear → Use evaluate-offer.md
    - If copy needs rewrite → Apply copywriter style guides

  pre_audit_inputs:
    - evaluate-offer.md output (offer clarity)
    - create-ad-copy.md output (for message match)
    - Brand voice documentation
```

---

*Task Version: 2.0*
*Last Updated: January 2026*
*Primary Frameworks: MECLABS Conversion Heuristic, Alex Hormozi Value Equation, StoryBrand BrandScript, CXL Heuristic Analysis*
*Total Lines: 1150+*
