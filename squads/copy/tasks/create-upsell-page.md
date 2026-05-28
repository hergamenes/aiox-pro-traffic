---
task: Create Upsell Page Task
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

# Create Upsell Page Task

## Task Overview

```yaml
task_name: create-upsell-page
version: 2.0
category: funnel_optimization
tier_0_required: false
minimum_output: 4 deliverables
estimated_time: 1-3 hours
```

## Purpose

Create high-converting upsell, downsell, and order bump copy that maximizes customer lifetime value through strategic post-purchase offers. Based on methodologies from Alex Hormozi, Dan Kennedy, and proven funnel optimization frameworks.

Upselling is NOT about manipulation - it's about offering GENUINE value that helps customers achieve their goals faster, better, or more completely.

---

## THE ECONOMICS OF UPSELLING

### Why Upsells Matter

```yaml
key_statistics:
  returning_customers: "Spend 67% more than new customers"
  aov_increase: "Upsells increase AOV by 20-40%"
  acquisition_cost: "New customer acquisition costs 5-25x retention"
  existing_customer_probability: "60-70% chance of sale"
  new_prospect_probability: "5-20% chance of sale"
```

### The Funnel Math

```
Without Upsells:
100 customers × [TICKET_PRINCIPAL_EXEMPLO] = [RECEITA_BASE_EXEMPLO] revenue

With 25% Upsell Take Rate:
100 customers × [TICKET_PRINCIPAL_EXEMPLO] = [RECEITA_BASE_EXEMPLO]
+ 25 upsells × [TICKET_UPSELL_EXEMPLO] = [RECEITA_UPSELL_EXEMPLO]
+ 10 order bumps × [TICKET_ORDER_BUMP_EXEMPLO] = [RECEITA_ORDER_BUMP_EXEMPLO]
= [RECEITA_TOTAL_COM_UPSELL] revenue ([PERCENTUAL_DE_AUMENTO_EXEMPLO] increase)

With Optimized Funnel:
Can increase AOV by 40%+ without additional traffic
```

---

## INPUTS

### Required Information

```yaml
required:
  upsell_type:
    options:
      - upsell          # Higher-value or enhanced version
      - downsell        # Lower-priced alternative
      - order_bump      # Low-cost checkout add-on
      - cross_sell      # Complementary product
    guidance: "See Type Definitions section"

  main_product:
    description: "Product customer just purchased"
    example: "Email Marketing Masterclass - $197"

  upsell_product:
    description: "Product being offered as upsell"
    example: "VIP Coaching Access - $497"

  upsell_price:
    description: "Price of the upsell offer"
    example: "$497"

  primary_benefit:
    description: "Main benefit upsell provides"
    example: "Personal feedback on your campaigns"

  relationship_to_main:
    description: "How upsell complements main product"
    example: "Accelerates implementation with 1-on-1 guidance"
```

### Optional Information

```yaml
optional:
  discount_amount:
    description: "Special discount for this offer"
    example: "50% off regular price of $997"

  urgency_element:
    description: "Time or quantity limitation"
    example: "Only available on this page"

  value_stack_items:
    description: "Components to include in value stack"
    example:
      - "4 Weekly Coaching Calls - $800 value"
      - "Private Slack Access - $200 value"
      - "Bonus Templates - $300 value"

  copywriter_style:
    options:
      - kennedy     # Urgent, value-stacking, direct response
      - hormozi     # Value equation focused, metrics-driven
      - conversational  # Softer, relationship-focused
```

---

## UPSELL TYPE DEFINITIONS

### Type 1: UPSELL (One-Click Upsell / OTO)

```yaml
definition: "Higher-end offer presented immediately after purchase"

characteristics:
  timing: "Immediately after checkout completion"
  pricing: "30-50% of main product (sweet spot)"
  mechanism: "One-click purchase (no re-entering payment)"
  conversion_rate: "10-30%"

best_for:
  - Premium versions of the product
  - Acceleration packages (faster results)
  - VIP/coaching add-ons
  - Complete implementation bundles

example_flow:
  main_product: "Course - $197"
  upsell: "Course + VIP Coaching - $497"
  value_proposition: "Get personal guidance to implement faster"
```

### Type 2: DOWNSELL

```yaml
definition: "Lower-priced alternative offered when upsell is declined"

characteristics:
  timing: "Immediately after upsell decline"
  pricing: "50-70% less than declined upsell"
  mechanism: "One-click or simple accept"
  conversion_rate: "15-40%"

best_for:
  - Price-sensitive segment recovery
  - Single component extraction
  - Payment plan alternatives
  - Lite versions

example_flow:
  declined_upsell: "VIP Coaching - $497"
  downsell: "Group Coaching - $197"
  value_proposition: "Get support at a more accessible price point"
```

### Type 3: ORDER BUMP

```yaml
definition: "Low-cost add-on offered on checkout page with checkbox"

characteristics:
  timing: "On checkout page, before payment"
  pricing: "$7-47 (impulse range)"
  mechanism: "Simple checkbox selection"
  conversion_rate: "20-50%"

best_for:
  - Complementary low-cost items
  - Implementation shortcuts
  - Bonus materials
  - Shipping upgrades

example:
  checkbox_text: "☐ YES! Add the Implementation Workbook for just $17"
  benefit: "Save hours with plug-and-play templates"
```

### Type 4: CROSS-SELL

```yaml
definition: "Complementary product offered post-purchase"

characteristics:
  timing: "Thank you page or follow-up email"
  pricing: "Varies based on product"
  mechanism: "Standard purchase flow"
  conversion_rate: "5-15%"

best_for:
  - Related but separate products
  - Accessories and add-ons
  - Partner products (affiliate)
  - Future purchases

example:
  main_product: "Camera"
  cross_sell: "Camera bag, extra lens, tripod"
```

---

## THE HORMOZI MONEY MODEL

### Four Core Offer Types in Sequence

From Alex Hormozi's $100M framework:

```yaml
offer_sequence:
  1_attraction:
    purpose: "Generate initial conversion"
    pricing: "Low-ticket or free"
    goal: "Customer acquisition"

  2_upsell:
    purpose: "Increase immediate transaction value"
    pricing: "30-100% of main product"
    goal: "Maximize profit per customer"

  3_downsell:
    purpose: "Recover declined upsells"
    pricing: "50-70% less than upsell"
    goal: "Salvage additional revenue"

  4_continuity:
    purpose: "Recurring revenue"
    pricing: "Subscription/membership"
    goal: "Lifetime value maximization"
```

### The Value Equation for Upsells

```
Upsell Value = (Dream Outcome × Perceived Likelihood)
               ÷ (Time Delay × Effort Required)
```

**Application to Upsell Copy:**

| Variable | How to Maximize in Copy |
|----------|------------------------|
| Dream Outcome | Show how upsell AMPLIFIES main purchase result |
| Likelihood | Connect to purchase they just made (they already believe) |
| Time Delay | Emphasize FASTER results with the upsell |
| Effort | Position as "done-for-you" or "plug-and-play" |

### The $100M Principle

> "A good money model must cover acquisition and service costs within the first 30 days."

**Implication:** Structure upsells so profit from one customer funds acquisition of many.

---

## THREE UPSELL STRATEGIES

### Strategy 1: Quantity Upsells (More of the Same)

```yaml
concept: "Offer additional units at a discount"

when_to_use:
  - Consumable products
  - Products with repeat purchase cycle
  - Items where "more is better"

discount_sweet_spot: "25% off additional units"

copy_framework: |
  "You just ordered [Product].

  Want to stock up and save?

  Get [X] more for just $[Price] each - that's [%] off!

  Most customers grab at least 2 extras because [reason - it's
  a consumable / they want backups / the discount is too good]."

example:
  main: "30-day supplement supply - $49"
  upsell: "90-day supply - $99 (save 33%)"
```

### Strategy 2: Complementary Products (Completion)

```yaml
concept: "Offer items that pair naturally with purchase"

when_to_use:
  - Products with obvious accessories
  - Services with logical add-ons
  - Courses with implementation tools

psychology: "People have an innate desire to complete the set"

copy_framework: |
  "Great choice on [Main Product]!

  Here's something that makes it even better...

  Most customers also grab [Complementary Product] because
  it helps them [specific benefit].

  Add it to your order for just $[Price]?"

example:
  main: "Podcasting course"
  upsell: "Professional microphone bundle + editing templates"
```

### Strategy 3: Goal-Acceleration (Transformation)

```yaml
concept: "Offer products that speed up results"

when_to_use:
  - Courses or training programs
  - Health and fitness products
  - Business/productivity tools

copy_framework: |
  "You're on your way to [Goal] with [Main Product].

  But here's the thing...

  While the course gives you everything you need, most people
  find that [obstacle/challenge].

  That's why I created [Acceleration Product].

  It gives you:
  - [Speed benefit 1]
  - [Speed benefit 2]
  - [Speed benefit 3]

  The result? You get to [goal] in [timeframe] instead of [longer timeframe].

  Add it now for $[Price]."

example:
  main: "Weight loss program - $97"
  upsell: "Meal prep service + accountability coach - $197"
```

---

## THE COMPLETE FUNNEL SEQUENCE

### Visual Flow

```
CHECKOUT PAGE
    │
    ├── [ORDER BUMP] - Checkbox add-on ($7-47)
    │   "☐ Add Implementation Workbook - $17"
    │
    ▼
PAYMENT PROCESSED
    │
    ▼
ONE-CLICK UPSELL 1
    │
    ├── ACCEPTS → [Optional: Upsell 2]
    │                    │
    │                    ├── Accepts → Thank You
    │                    └── Declines → Thank You
    │
    └── DECLINES → [DOWNSELL 1]
                        │
                        ├── Accepts → Thank You
                        └── Declines → Thank You
    │
    ▼
THANK YOU PAGE
    │
    └── [CROSS-SELL / Community / Next Steps]
```

### Optimal Funnel Configuration

| Position | Offer Type | Price Range | Target Conversion |
|----------|------------|-------------|-------------------|
| Checkout | Order Bump | $7-47 | 20-50% |
| Post-Purchase 1 | Upsell | 30-100% of main | 10-30% |
| After Decline | Downsell | 50-70% less | 15-40% |
| Thank You | Cross-sell | Varies | 5-15% |

---

## UPSELL PAGE COPY STRUCTURE

### The Complete OTO Page Framework

```markdown
┌─────────────────────────────────────────────────────────────┐
│ SECTION 1: INTERRUPT HEADLINE                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🛑 WAIT! Your Order Is Not Complete...                     │
│                                                             │
│  (Or alternative interrupt headline)                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 2: ACKNOWLEDGE & CONGRATULATE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Congratulations on getting [Main Product]!                 │
│                                                             │
│  You just made a smart decision that's going to help you    │
│  [achieve main benefit].                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 3: INTRODUCE THE GAP                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  But here's the thing...                                    │
│                                                             │
│  While [Main Product] gives you [benefit], most people find │
│  they still struggle with [problem upsell solves].          │
│                                                             │
│  [Optional: Brief story or statistic illustrating the gap]  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 4: VIDEO OR IMAGE                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │              [VIDEO PLAYER]                         │    │
│  │              or                                     │    │
│  │              [PRODUCT IMAGE]                        │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 5: PRESENT THE SOLUTION                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  That's exactly why I created [Upsell Product Name]...      │
│                                                             │
│  It's specifically designed to [complement main product]    │
│  by giving you [mechanism/how it works].                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 6: VALUE STACK                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Here's everything you get:                                 │
│                                                             │
│  ✅ [Component 1] ...................... Value: $XXX        │
│     [1 sentence explaining why this matters]                │
│                                                             │
│  ✅ [Component 2] ...................... Value: $XXX        │
│     [1 sentence explaining why this matters]                │
│                                                             │
│  ✅ [Component 3] ...................... Value: $XXX        │
│     [1 sentence explaining why this matters]                │
│                                                             │
│  🎁 BONUS: [Extra Component] ........... Value: $XXX        │
│     [1 sentence explaining why this matters]                │
│                                                             │
│  ─────────────────────────────────────────────              │
│  TOTAL VALUE: $X,XXX                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 7: PRICE REVEAL                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  If you were to buy all of this separately, you'd invest    │
│  $X,XXX.                                                    │
│                                                             │
│  But because you just became a [Main Product] customer,     │
│  I want to give you everything for just...                  │
│                                                             │
│               💰 $XXX                                        │
│                                                             │
│  That's [X]% off - but only on this page, right now.        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 8: URGENCY ELEMENT                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⏰ This is a ONE-TIME OFFER                                │
│                                                             │
│  When you leave this page, this offer disappears forever.   │
│  It's not available in our store or anywhere else.          │
│                                                             │
│  [Optional: Countdown timer]                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 9: CALL TO ACTION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │   YES! Add [Product] To My Order - Just $XXX →      │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [Guarantee badge] 100% Money-Back Guarantee                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SECTION 10: DECLINE OPTION                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  No thanks, I don't need [benefit] right now.               │
│  Just take me to my order.                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## HEADLINE FORMULAS

### Interrupt Headlines

```yaml
wait_pattern:
  - "WAIT! Your Order Is Not Complete..."
  - "HOLD ON! One More Thing Before You Go..."
  - "STOP! You're About To Miss Something Important..."

exclusive_pattern:
  - "Special Offer For [Product] Customers Only"
  - "Exclusive One-Time Offer Just For You"
  - "A Quick 'Thank You' Gift For New Customers"
```

### Opportunity Headlines

```yaml
acceleration_pattern:
  - "Want To [Get Result] [X]x Faster?"
  - "Ready To Supercharge Your [Main Product] Results?"
  - "How To Get [Better Result] From [Main Product]"

completion_pattern:
  - "The Missing Piece To [Achieving Goal]"
  - "Don't Leave Without [Critical Component]"
  - "Here's What [Main Product] Alone Can't Give You"

problem_solution_pattern:
  - "The #1 Reason [Main Product] Users Don't Get Results (And How To Fix It)"
  - "What [Main Product] Doesn't Include (But You Desperately Need)"
```

### Scarcity Headlines

```yaml
urgency_pattern:
  - "This Page Expires In [Countdown]"
  - "Last Chance: [Offer] Disappears When You Leave"
  - "One-Time Offer: Never Available Again"
```

---

## VALUE STACK FRAMEWORK

### The Kennedy Value Stacking Method

Present each component with its own standalone value to make the total price feel insignificant.

```yaml
value_stack_structure:
  component_1:
    name: "[Main deliverable]"
    value: "$XXX"
    why_it_matters: "This alone is worth the price because [specific reason]"

  component_2:
    name: "[Supporting deliverable]"
    value: "$XXX"
    why_it_matters: "Saves you [time/money] by [how]"

  component_3:
    name: "[Implementation tool]"
    value: "$XXX"
    why_it_matters: "Makes implementation [faster/easier] because [how]"

  bonus:
    name: "[Unexpected extra]"
    value: "$XXX"
    why_it_matters: "Included FREE to [reason]"

  total_value: "[Sum of all components]"
  your_price: "[Actual price - should be 20-30% of total value]"
```

### Value Stack Example

```markdown
Here's everything included:

✅ VIP Coaching Calls (4 Sessions) ........... Value: $800
   Get direct feedback on your campaigns from me personally.

✅ Private Slack Community Access ............ Value: $200
   24/7 support from our team and fellow VIP members.

✅ Campaign Templates Library ................ Value: $300
   Copy-and-paste templates for every email type.

✅ Monthly Hot Seat Reviews .................. Value: $400
   Watch real campaigns get critiqued (learn from others' mistakes).

🎁 BONUS: Quick-Start Implementation Guide ... Value: $197
   Get your first campaign live in 24 hours (included FREE).

───────────────────────────────────────────────
TOTAL VALUE: $1,897

Your Price Today: Just $497

(That's 74% off - only available on this page)
```

---

## CTA COPY FORMULAS

### Accept Button Copy

```yaml
ownership_language:
  - "Yes! Add This To MY Order"
  - "I Want This Upgrade"
  - "Give Me [Product Name]"

action_language:
  - "Complete My Order With [Product]"
  - "Upgrade My Purchase Now - $XX"
  - "Add [Product] To My Order →"

benefit_language:
  - "Yes! I Want [Specific Benefit]"
  - "Unlock [Benefit] For Just $XX"
  - "Get [Result] Faster - Add Now"
```

### Decline Link Copy

```yaml
neutral_decline:
  - "No thanks, take me to my order"
  - "Skip this offer"
  - "Continue to my download"
  - "I'll pass for now"

loss_frame_decline:
  note: "Use carefully - can backfire if perceived as manipulative"
  examples:
    - "No thanks, I'll figure it out on my own"
    - "I don't need faster results right now"
    - "No, I'll pass on [specific benefit]"
```

---

## DOWNSELL PAGE FRAMEWORK

### Downsell Philosophy

The downsell is NOT just a cheaper version - it's a different solution for a price-sensitive segment.

### Three Downsell Approaches

```yaml
approach_1_component_extraction:
  concept: "Offer just one part of the full upsell"
  example:
    upsell: "Complete Coaching Package - $497"
    downsell: "Just the Templates - $97"

approach_2_payment_plan:
  concept: "Same product, spread over payments"
  example:
    upsell: "$497 one-time"
    downsell: "3 payments of $197"

approach_3_alternative_product:
  concept: "Different solution at lower price point"
  example:
    upsell: "1-on-1 Coaching - $497"
    downsell: "Group Coaching - $197"
```

### Downsell Page Structure

```markdown
┌─────────────────────────────────────────────────────────────┐
│ EMPATHY HEADLINE                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  I Totally Understand...                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ACKNOWLEDGE THE DECISION                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Full Upsell] might not be the right fit for you right     │
│  now, and that's completely okay.                           │
│                                                             │
│  Maybe the timing isn't right, or the investment feels      │
│  too big at this moment.                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ PRESENT THE ALTERNATIVE                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  But before you go, I wanted to offer you a simpler         │
│  option...                                                  │
│                                                             │
│  What if you could get just [Core Component] - the part     │
│  that makes the biggest difference - at a fraction of       │
│  the price?                                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SIMPLIFIED VALUE                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  With [Downsell Product], you still get:                    │
│                                                             │
│  ✅ [Key component/benefit]                                 │
│  ✅ [Essential feature]                                     │
│  ✅ [Core result]                                           │
│                                                             │
│  All for just $XX (instead of $XXX)                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ CTA                                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Yes, This Is Perfect For Me - $XX →]                      │
│                                                             │
│  No thanks, just complete my original order.                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Downsell Copy Tone

```yaml
DO:
  - Show empathy and understanding
  - Validate their decision to decline
  - Present as a helpful alternative
  - Maintain positive relationship
  - Keep it brief (shorter than upsell)

DONT:
  - Make them feel guilty
  - Be pushy or desperate
  - Imply they're making a mistake
  - Use aggressive language
  - Repeat the full upsell pitch
```

---

## ORDER BUMP COPY FRAMEWORK

### Order Bump Anatomy

```
┌──────────────────────────────────────────────────────────┐
│ ☐ YES! Add [Product Name] for just $[Price]              │
│                                                          │
│ [1-2 sentences explaining the benefit]                   │
│                                                          │
│ (Save [%] - Regular price: $[Higher Price])              │
└──────────────────────────────────────────────────────────┘
```

### Order Bump Examples by Industry

```yaml
digital_products:
  text: "☐ YES! Add the Implementation Worksheets for just $17"
  benefit: "Get the exact templates I use to implement everything taught in the course. Saves hours of setup time."
  savings: "(Save 65% - Regular price: $47)"

physical_products:
  text: "☐ YES! Add Express Shipping + Priority Handling for $9.95"
  benefit: "Get your order 3-5 days faster with tracking and insurance included."
  social_proof: "(Most customers upgrade!)"

services:
  text: "☐ YES! Add the 1-on-1 Kickoff Call for $47"
  benefit: "Get a private 30-minute session to customize your strategy and answer all your questions."
  savings: "(Limited availability - Usually $97)"

software:
  text: "☐ YES! Add Done-For-You Setup for $29"
  benefit: "Our team configures everything so you can start using the software immediately."
  savings: "(Save 2+ hours of setup time)"
```

### Order Bump Best Practices

```yaml
rules:
  - keep_short: "2-3 lines maximum"
  - checkbox_psychology: "People like completing/checking things"
  - show_savings: "Compare to 'regular' price"
  - complement: "Must enhance, not distract from main purchase"
  - impulse_pricing: "$7-47 sweet spot"
  - single_focus: "One obvious benefit"
```

---

## PSYCHOLOGICAL TRIGGERS

### Trigger 1: Commitment and Consistency

```yaml
principle: "People who make a purchase are psychologically committed and more likely to say yes to related offers"

application:
  - Acknowledge their smart decision
  - Position upsell as natural next step
  - Connect upsell to the commitment they just made
```

### Trigger 2: The Decoy Effect

```yaml
principle: "Presenting three options where one appears most valuable"

application: |
  Option A: Basic - $49
  Option B: Pro - $99 (TARGET - Best Value)
  Option C: Premium - $199

  Premium makes Pro look reasonable.
  Basic makes Pro look comprehensive.
```

### Trigger 3: Social Proof

```yaml
principle: "People follow the actions of others"

application:
  - "73% of customers who bought [Main] also added [Upsell]"
  - "Best-seller" badges
  - Testimonials specific to the upsell
  - Real-time: "John just added this to his order"
```

### Trigger 4: Scarcity

```yaml
principle: "Limited availability increases perceived value"

legitimate_scarcity:
  - One-time offer (page expires)
  - Limited quantity ("Only 7 spots left")
  - Time-limited discount
  - Exclusive to this purchase

warning: "Scarcity must be REAL. Fake scarcity destroys trust."
```

### Trigger 5: Reciprocity

```yaml
principle: "Giving something triggers desire to give back"

application:
  - Position discount as a gift for buying main product
  - "As a thank you for your purchase..."
  - Include unexpected bonus in the offer
```

---

## METRICS AND BENCHMARKS

### Key Performance Indicators

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| Upsell Take Rate | Upsells ÷ Opportunities | 10-30% |
| Downsell Take Rate | Downsells ÷ Upsell Declines | 15-40% |
| Order Bump Rate | Bumps Added ÷ Checkouts | 20-50% |
| AOV Lift | New AOV ÷ Old AOV | 20-40% |
| Revenue Per Visitor | Total Revenue ÷ Visitors | Track baseline |

### Pricing Benchmarks

| Offer Type | Price Range | Relative to Main |
|------------|-------------|------------------|
| Order Bump | $7-47 | 10-25% |
| Upsell | Varies | 30-100% |
| Downsell | Varies | 50-70% less than upsell |

---

## OUTPUT DELIVERABLES

### Standard Package

```yaml
deliverables:
  1_upsell_page_copy:
    includes:
      - Interrupt headline (+ 2 variations)
      - Acknowledgment copy
      - Gap/problem section
      - Solution introduction
      - Value stack (3-5 components)
      - Price reveal section
      - Urgency element
      - CTA buttons (accept + decline)

  2_downsell_page_copy:
    includes:
      - Empathy headline
      - Acknowledgment section
      - Alternative offer
      - Simplified value proposition
      - CTA buttons

  3_order_bump_copy:
    includes:
      - Checkbox text
      - Benefit description (1-2 lines)
      - Savings/social proof element

  4_optional_elements:
    includes:
      - Video script outline (if applicable)
      - A/B test variations for headlines
      - Thank you page cross-sell copy
```

---

## QUALITY CHECKLIST

### Strategic Alignment

```yaml
strategy_checklist:
  - [ ] Upsell directly complements main purchase
  - [ ] Price is appropriate (30-100% of main for upsell)
  - [ ] Clear relationship between main and upsell
  - [ ] Downsell is ready for declines
  - [ ] Order bump enhances without distracting
```

### Copy Elements

```yaml
copy_checklist:
  - [ ] Headline interrupts and engages
  - [ ] Purchase is acknowledged positively
  - [ ] Gap/problem is clearly articulated
  - [ ] Value stack shows 10x value vs price
  - [ ] Each component has specific dollar value
  - [ ] Urgency element is present and legitimate
  - [ ] CTA uses action-oriented language
  - [ ] Decline option is easy to find and guilt-free
```

### Technical Requirements

```yaml
technical_checklist:
  - [ ] One-click purchase enabled (no re-entering payment)
  - [ ] Mobile-responsive design
  - [ ] Fast page load time (<3 seconds)
  - [ ] Tracking/analytics installed
  - [ ] Email confirmation includes upsell if accepted
  - [ ] Downsell triggers correctly on decline
```

---

## COMMON MISTAKES TO AVOID

### Strategic Mistakes

```yaml
avoid:
  irrelevant_upsell:
    mistake: "Upselling unrelated products"
    fix: "Offer only products that enhance the main purchase"

  price_shock:
    mistake: "Upsell costs more than main product"
    fix: "Keep upsell at 30-100% of main product price"

  too_many_upsells:
    mistake: "5+ upsells in sequence"
    fix: "Maximum 2-3 offers in post-purchase flow"

  no_downsell:
    mistake: "No recovery for declined upsells"
    fix: "Always have a downsell ready"
```

### Copy Mistakes

```yaml
avoid:
  pushy_tone:
    mistake: "Aggressive, desperate language"
    fix: "Helpful, value-focused positioning"

  weak_value_stack:
    mistake: "Generic descriptions without specific values"
    fix: "Assign dollar value to each component"

  guilt_decline:
    mistake: "Making customer feel bad for declining"
    fix: "Neutral decline option without judgment"

  no_urgency:
    mistake: "Offer available anytime"
    fix: "Legitimate one-time or limited offer"
```

---

## REAL EXAMPLES ANALYZED

### Example 1: Course Upsell

**Main Product:** Email Marketing Course - $197
**Upsell:** VIP Coaching Package - $497

**Why it works:**
- Clear acceleration benefit (faster results with personal guidance)
- Strong value stack (4 components totaling $1,897)
- Legitimate scarcity (limited coaching spots)
- Natural complement to course

**Take Rate:** 18%

### Example 2: E-commerce Order Bump

**Main Product:** Skincare Set - $79
**Order Bump:** Travel Size Kit - $19

**Copy:**
```
☐ YES! Add the Travel Size Kit for just $19

Take your routine anywhere with TSA-friendly sizes.
Perfect for your next trip or gym bag.

(Save 40% - Regular price: $32)
```

**Why it works:**
- Obvious complement
- Impulse price point
- Clear use case
- Savings highlighted

**Take Rate:** 34%

### Example 3: SaaS Downsell

**Declined Upsell:** Annual Plan - $470/year
**Downsell:** Quarterly Plan - $149/quarter

**Why it works:**
- Same product, different commitment
- Lower immediate cost
- Path to upgrade later
- No feature removal (just time change)

**Take Rate:** 28%

---

*Task Version: 2.0*
*Research Source: upsell-methodology-research.md*
*Lines: 750+*
