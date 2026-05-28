---
task: Create Downsell Page Task
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

# Create Downsell Page Task
## Copy Framework v2.0 - Comprehensive Downsell Creation System

**Task Version:** 2.0
**Primary Frameworks:** Loss Aversion Psychology + Acknowledgment Framework + Dan Kennedy Direct Response
**Research Source:** docs/research/downsell-methodology-research.md

---

## Purpose

Create psychologically optimized downsell pages that recover lost sales by offering strategic alternatives to customers who declined the main offer. This task leverages the 5 Hesitation Drivers, Loss Aversion Principle, and proven copy frameworks to transform "no" into revenue.

**Core Insight:** DigitalMarketer converted 15% of abandoning visitors with strategic downselling. Your downsell is the last opportunity in the sales funnel to close a deal.

---

## When to Use

- After customer declines main offer or upsell
- Exit intent detected on sales/checkout pages
- Cart abandonment recovery
- Post-rejection in one-click upsell funnels
- When price is the primary objection
- To provide budget-friendly entry point

**Critical Timing:** Downsell appears AFTER rejection, BEFORE thank you page. This window is when buying momentum remains but price barrier blocked conversion.

---

## Inputs

```yaml
required:
  main_offer:
    name: "Name of declined offer"
    price: "Price point ($)"
    core_value: "Primary transformation/outcome promised"

  downsell_offer:
    name: "Name of alternative offer"
    price: "Reduced price point ($)"
    type: "lite_version | payment_plan | trial | alternative_product | diy_version | one_time"

  target_avatar:
    who: "Who is the customer"
    problem: "Core problem they're trying to solve"
    objection_type: "price | timing | trust | overwhelm | commitment"

optional:
  rejection_context:
    where: "Page/step where they declined"
    signals: "Behavior indicators (fast click, hesitation, etc.)"

  relationship_context:
    source: "How they arrived (ad, email, organic, referral)"
    temperature: "cold | warm | hot"
    previous_purchases: "Any prior relationship"

  upgrade_path:
    exists: "boolean - can they upgrade later?"
    timeframe: "How long until upgrade typically happens"

  urgency_elements:
    timer: "Duration if countdown used"
    exclusivity: "This page only, limited spots, etc."
    deadline: "Hard deadline if applicable"

  copywriter_preference:
    primary: "Specific copywriter style"
    reason: "Why this style fits"
```

---

## Step 1: Objection Diagnosis

Before writing copy, identify the PRIMARY objection that caused rejection.

### The 5 Hesitation Drivers

#### Driver 1: Price Objection
**Signals:**
- Fast rejection after seeing price
- Hovering over price then leaving
- Abandonment at checkout/payment step
- "Can't afford it right now" feedback

**Downsell Response:**
- Lite version with core value
- Extended payment plan
- Entry-level alternative
- Trial period

**Copy Approach:**
```markdown
"I understand. $[price] is a real investment.
That's why I created [Downsell] for just $[lower_price].
Same [core benefit], budget-friendly package."
```

#### Driver 2: Timing Objection
**Signals:**
- "Not the right time"
- "Maybe later"
- Engaged with content but didn't buy
- Longer time on page before leaving

**Downsell Response:**
- Quick-start mini product
- Trial/sample access
- "Start now, complete later" option
- Time-limited special

**Copy Approach:**
```markdown
"Maybe the full [Product] isn't right today.
But what about just [core piece] to get started?
Quick win now, upgrade when ready."
```

#### Driver 3: Trust Objection
**Signals:**
- Reading testimonials/reviews extensively
- Checking credentials
- "Is this legit?" type behavior
- Cold traffic with no prior relationship

**Downsell Response:**
- Trial period
- Lower-risk entry point
- Money-back guarantee emphasis
- Proof-of-concept purchase

**Copy Approach:**
```markdown
"Don't trust it yet? I get it.
Try [Downsell] for just $[low_price].
If it doesn't blow your mind, full refund.
Zero risk to test drive."
```

#### Driver 4: Overwhelm Objection
**Signals:**
- Scanning but not reading
- Multiple page visits without action
- "Seems like a lot" feedback
- Feature overload signals

**Downsell Response:**
- Simplified version
- Core-only offering
- "Just the essentials"
- One specific outcome focus

**Copy Approach:**
```markdown
"[Product] has everything. Maybe too much?
[Downsell] is laser-focused on [one outcome].
No extras. No overwhelm. Just results."
```

#### Driver 5: Commitment Objection
**Signals:**
- Balking at subscription/recurring
- "What if I don't use it?"
- Long-term commitment hesitation
- Cancellation policy queries

**Downsell Response:**
- One-time payment option
- Lifetime access offer
- No recurring version
- Single use/project option

**Copy Approach:**
```markdown
"No commitment required.
[Downsell] is one payment, yours forever.
Use it whenever you want. No subscriptions."
```

### Diagnosis Output Template

```yaml
objection_diagnosis:
  primary_driver: "[Select from 5 drivers]"
  evidence: "[What signals indicate this]"
  confidence_level: "high | medium | low"
  secondary_driver: "[If applicable]"

recommended_downsell_type:
  type: "[lite | payment_plan | trial | alternative | diy | one_time]"
  rationale: "[Why this matches the objection]"
```

---

## Step 2: Downsell Offer Design

### 2.1 Six Downsell Types

#### Type A: Lite Version Downsell

**What It Is:** Core product with reduced scope/features.

**Structure:**
| Full Version | Lite Version |
|--------------|--------------|
| All modules | Core modules only |
| Live support | Email support |
| Community access | Solo study |
| Bonuses included | Essential only |
| Lifetime access | 1-year access |

**Pricing Formula:** 30-50% of main offer price

**Best For:**
- Information products
- Online courses
- Membership sites
- Software tiers

**Example Transformation:**
```
FULL COURSE ($997):
✓ 12 modules
✓ Weekly live Q&A
✓ Private community
✓ 1:1 coaching call
✓ All templates
✓ Lifetime access

ESSENTIALS ($297):
✓ 6 core modules
✓ Email support
✓ Key templates only
✓ 1-year access
✗ Live Q&A
✗ Community
✗ 1:1 coaching
```

#### Type B: Payment Plan Downsell

**What It Is:** Same product, easier payment structure.

**Structures:**
1. **Extended Terms:** 12x instead of 3x
2. **Lower Monthly:** $47/mo instead of $97/mo
3. **Start Low:** First month $1, then regular rate

**Pricing Consideration:** May charge small premium (5-10%) for payment flexibility.

**Best For:**
- High-ticket offers ($500+)
- Price-sensitive audiences
- Cash flow constraints
- B2C markets

**Example:**
```
FULL INVESTMENT: $997 one-time

EASY PAY OPTION: 12x $97/month
- Same complete course
- Same full access
- Same guarantee
- Just easier payments
- Total: $1,164 (small premium for flexibility)
```

#### Type C: Trial/Sample Downsell

**What It Is:** Limited access to prove value first.

**Structures:**
- 7-14 day free trial
- First module only ($17-$37)
- Limited features for X days
- "Taste test" mini version

**Conversion Target:** 25-40% trial-to-paid

**Best For:**
- Trust-building needed
- Complex products
- Cold traffic
- High-consideration purchases

**Example:**
```
NOT READY FOR THE FULL COMMITMENT?

Try [Product] FREE for 7 days.
Full access. No restrictions.

Love it? Stay on at $97/month.
Don't love it? Cancel before day 7. Pay nothing.

[START MY FREE TRIAL]
```

#### Type D: Alternative Product Downsell

**What It Is:** Different product solving same core problem.

**Requirements:**
- Must address SAME problem
- Different delivery/approach
- Lower price point
- Clear value proposition

**Examples:**
| Main Offer | Alternative Downsell |
|------------|---------------------|
| Done-for-you service | Template kit |
| 1:1 coaching | Group program |
| Complete system | Single tool |
| Full program | Focused workshop |
| Custom solution | Standardized product |

**Example:**
```
[MAIN]: Done-For-You Funnel Build - $3,000
↓ Declined
[DOWNSELL]: Funnel Template Kit - $297
Same proven structures
You implement
Same results, DIY approach
```

#### Type E: DIY Version Downsell

**What It Is:** Same content, no support/implementation help.

**What's Removed:**
- Coaching calls
- Done-with-you elements
- Community/group access
- Feedback rounds
- Live components

**What's Preserved:**
- Core training/content
- Templates and tools
- Methodologies
- Reference materials

**Pricing:** 40-60% of supported version

**Example:**
```
WITH COACHING ($1,997):
✓ Complete course
✓ 6 coaching calls
✓ Community access
✓ Feedback on work
✓ Implementation support

SELF-STUDY ($497):
✓ Complete course
✓ All templates
✓ Reference guides
✗ No coaching calls
✗ No community
✗ Self-implementation
```

#### Type F: One-Time vs Recurring Downsell

**What It Is:** Remove subscription anxiety with single payment.

**Psychology:**
- No ongoing commitment fear
- "Own it forever" appeal
- Control over future payments
- One decision, done

**Example:**
```
MONTHLY ACCESS: $97/month
(Cancel anytime)
↓ Declined
LIFETIME ACCESS: $497 one-time
Pay once, access forever
Never pay again
Includes all future updates
```

### 2.2 Downsell Design Template

```yaml
downsell_offer_design:
  name: "[Offer name]"
  type: "[A|B|C|D|E|F from above]"

  main_offer_comparison:
    original_price: "$X"
    original_includes: ["item 1", "item 2", "..."]

  downsell_specifics:
    price: "$Y"
    discount_percentage: "X%"
    includes: ["item 1", "item 2"]
    excludes: ["removed item 1", "removed item 2"]

  value_preservation:
    core_transformation: "[Main outcome still achievable]"
    key_components_kept: ["component 1", "component 2"]

  pricing_psychology:
    anchor_effect: "[How original price makes this seem better]"
    savings_highlight: "Save $Z / X% off"
    value_framing: "[How to present value vs price]"
```

---

## Step 3: Psychology Integration

### 3.1 Loss Aversion Framework

**Principle:** Losses feel 2x more painful than equivalent gains feel good.

**Application in Copy:**

```markdown
BEFORE YOU LEAVE...

You're about to walk away from:
• [Benefit 1] - GONE
• [Benefit 2] - GONE
• [Outcome 3] - GONE

But it doesn't have to be all or nothing.

[Downsell] gives you [core benefit]
for a fraction of the investment.

Don't leave empty-handed.
```

**Loss Aversion CTAs:**
- "Don't leave with nothing"
- "At least take THIS with you"
- "Don't miss out completely"
- "Something is better than nothing"

### 3.2 Foot-in-the-Door Technique

**Principle:** Small commitments lead to larger future commitments.

**Application:**

```markdown
START SMALL, GROW BIG

[Downsell] is your entry point.
Get results. Build confidence.
Upgrade when you're ready.

Many of our most successful customers
started exactly where you are now.
```

**Data Point:** Downsell customers who later upgrade often have HIGHER LTV than direct premium buyers.

### 3.3 Anchoring Effect

**Principle:** First price creates reference point for all subsequent prices.

**Application:**

```markdown
You just saw [Product] at $997.

That's the complete system.
Premium support. All bonuses. Everything.

But what if you could get the CORE
for just $197?

You save $800.
You still get [main transformation].

That's 80% off for 80% of the results.
```

### 3.4 Contrast Principle

**Principle:** Sequential presentation makes differences seem larger.

**Application:**

After seeing $997 (rejected), $197 feels like a steal even if objectively it's still significant money.

```markdown
QUICK MATH:

[Full Program]: $997
[Essentials]: $197

Difference: $800 in your pocket
Still included: [Core result]

Same outcome. 80% less investment.
No-brainer, right?
```

### 3.5 Dan Kennedy's No-Begging Principle

**Principle:** Present downsell as genuine alternative, never as desperation.

**Wrong Approach (Begging):**
```
"Please! At least buy something!
We'll take anything!
Don't leave us!"
```

**Right Approach (Confident):**
```
"[Main offer] isn't for everyone.
I created [Downsell] for exactly this situation.
Take it or leave it - your call.
But this page is your only chance."
```

---

## Step 4: Page Structure

### 4.1 Complete Downsell Page Architecture

```
┌─────────────────────────────────────────┐
│         PATTERN INTERRUPT               │
│    "Wait!" / "Before you go..."         │
├─────────────────────────────────────────┤
│         ACKNOWLEDGMENT                  │
│   Validate their decision (no judgment) │
├─────────────────────────────────────────┤
│           BRIDGE                        │
│   "But I don't want you to leave with   │
│    nothing..." / Transition statement   │
├─────────────────────────────────────────┤
│       DOWNSELL INTRODUCTION             │
│   Name + Quick description + Image      │
├─────────────────────────────────────────┤
│         VALUE COMPARISON                │
│   Original vs Downsell side-by-side     │
├─────────────────────────────────────────┤
│        WHAT'S INCLUDED                  │
│   Bullet points of components           │
├─────────────────────────────────────────┤
│        CORE BENEFIT FOCUS               │
│   "You still get [transformation]"      │
├─────────────────────────────────────────┤
│          SOCIAL PROOF                   │
│   Testimonial or data point (optional)  │
├─────────────────────────────────────────┤
│          GUARANTEE                      │
│   Same or better than main offer        │
├─────────────────────────────────────────┤
│          URGENCY                        │
│   Timer / One-time offer statement      │
├─────────────────────────────────────────┤
│          PRICE + CTA                    │
│   Anchored price + Accept button        │
├─────────────────────────────────────────┤
│       REJECTION OPTION                  │
│   Link with loss aversion framing       │
└─────────────────────────────────────────┘
```

### 4.2 Section-by-Section Copy Templates

#### Section 1: Pattern Interrupt Headline

**Purpose:** Stop them before they fully disengage.

**Templates:**
```markdown
# WAIT!

# Before You Go...

# One Last Thing...

# Hold On a Second!

# Don't Leave Just Yet...

# Hey, Before You Close This...
```

**Character Limit:** 3-6 words maximum

#### Section 2: Acknowledgment

**Purpose:** Validate their decision, build rapport.

**Templates:**
```markdown
I get it. $[price] is a lot right now.

Maybe the timing isn't perfect.

Perhaps [Main Product] had more than you needed.

I understand - it's not a small decision.

That's OK. [Main Product] isn't for everyone.
```

**Key:** Zero judgment. Pure understanding.

#### Section 3: Bridge/Transition

**Purpose:** Pivot from rejection to new opportunity.

**Templates:**
```markdown
But I don't want you to leave empty-handed.

But here's the thing - [problem] isn't going away.

However, I have something that might work better.

That's why I created something different...

So before you go, let me show you an alternative.
```

#### Section 4: Downsell Introduction

**Purpose:** Name and frame the alternative offer.

**Templates:**
```markdown
## [DOWNSELL NAME]
### The [Core Benefit] Without the [Removed Element]

## Introducing: [Product Name] — Essentials Edition
### Everything you need. Nothing you don't.

## [Product Name] LITE
### Same transformation. Streamlined for action-takers.
```

**Include:** Product image or mockup

#### Section 5: Value Comparison

**Purpose:** Visual contrast between offers.

**Template:**
```markdown
### Quick Comparison:

| | [Full Version] | [Downsell] |
|---|---|---|
| Core Training | ✓ | ✓ |
| Templates | ✓ | ✓ |
| Community | ✓ | ✗ |
| Coaching Calls | ✓ | ✗ |
| Bonuses | ✓ | ✗ |
| **Price** | ~~$997~~ | **$197** |

**You save $800** and still get [main outcome].
```

#### Section 6: What's Included

**Purpose:** Concrete list of deliverables.

**Template:**
```markdown
### What You Get:

✓ **[Component 1]** — [Brief description/value]
✓ **[Component 2]** — [Brief description/value]
✓ **[Component 3]** — [Brief description/value]
✓ **[Component 4]** — [Brief description/value]

**Total Value: $[X]**
**Your Investment: $[Y]**
```

#### Section 7: Core Benefit Focus

**Purpose:** Remind them the main transformation is still achievable.

**Template:**
```markdown
### The Bottom Line:

With [Downsell], you'll still be able to:

→ [Outcome 1]
→ [Outcome 2]
→ [Outcome 3]

Same destination. Different vehicle.
```

#### Section 8: Social Proof (Optional)

**Purpose:** Validate the downsell specifically.

**Template:**
```markdown
### What Others Say:

> "[Quote about achieving result with this version]"
> — **[Name]**, [Title/Context]

**[X]** people started with [Downsell] and got [result].
```

#### Section 9: Guarantee

**Purpose:** Remove remaining risk.

**Template:**
```markdown
### Same 30-Day Guarantee

If [Downsell] doesn't [specific outcome],
you get every penny back.

No questions. No hassle. No risk.

Try it for 30 days. If it's not for you,
email us and we'll refund immediately.
```

#### Section 10: Urgency

**Purpose:** Create decision pressure.

**Templates:**
```markdown
### ⚠️ Important:

This offer is ONLY available on this page.
When you close it, it's gone forever.
You won't see this price again.

---

### ⏱️ This Page Expires In:

[COUNTDOWN TIMER: 15:00]

After that, [Downsell] returns to $[higher_price].
```

#### Section 11: Price + CTA

**Purpose:** Final price presentation and action button.

**Template:**
```markdown
### Your Investment Today:

~~$[Original Downsell Value]~~
## Just $[Downsell Price]

[🔒 YES! I Want [Product] for $[Price]! →]

Secure checkout. Instant access.
```

**CTA Button Text Options:**
- "Yes! I want [Product] for just $[Price]!"
- "Give me the essentials for $[Price]!"
- "I'm in for $[Price]!"
- "Add [Product] to My Order - $[Price]"

#### Section 12: Rejection Option

**Purpose:** Loss aversion framing on skip link.

**Template:**
```markdown
[No thanks, I'll pass on this opportunity]

or

[No, I don't need help with [problem]]

or

[No, I'd rather figure this out alone]
```

**Key:** Frame rejection as choosing to maintain the problem.

---

## Step 5: Copy Frameworks

### 5.1 The Acknowledgment Framework

**Structure:**
1. Acknowledge rejection
2. Validate concern
3. Bridge to alternative
4. Present downsell
5. Re-establish value
6. Close

**Full Template:**
```markdown
# I Get It.

$997 is a real investment.
And maybe right now isn't the perfect time.
That's totally fair.

**But I don't want you to leave with nothing.**

Because [problem] isn't going away.
And you clicked here for a reason.

**So let me offer you something different...**

## [Downsell Name]

[What it is in one sentence]

### What's Included:

✓ [Component 1]
✓ [Component 2]
✓ [Component 3]

### You Still Get:

→ [Core transformation]
→ [Key benefit]
→ [Important outcome]

**Same guarantee. Same quality.**
**Just $[downsell_price] instead of $997.**

---

⚠️ This page is your only chance to grab this offer.

[YES! I WANT IT FOR $[PRICE] →]

[No thanks, I'll pass]
```

### 5.2 The "Before You Go" Framework

**Structure:**
1. Pattern interrupt
2. Empathy
3. Alternative introduction
4. Value proposition
5. Urgency
6. Binary choice

**Full Template:**
```markdown
# WAIT — One Last Thing

I know you said no to [Main Offer].

Maybe the price.
Maybe the timing.
Maybe you're just not sure.

**All valid.**

But before you close this page...

**What if you could get [core result]
for a fraction of the investment?**

## [Downsell Name]
### Just $[price] (instead of $[main_price])

Here's what you get:

✓ [Component 1] — [value]
✓ [Component 2] — [value]
✓ [Component 3] — [value]

**This is your only chance.**
When you leave, this offer disappears.

[YES! I'll Take It for $[Price] →]

[No, I'll pass on everything]
```

### 5.3 The Value Stack Comparison Framework

**Structure:**
1. Show what they're missing
2. Side-by-side comparison
3. Highlight savings
4. Focus on preserved value
5. Close

**Full Template:**
```markdown
# Quick Reality Check

You just passed on:

❌ [Feature 1] — Value: $X
❌ [Feature 2] — Value: $X
❌ [Feature 3] — Value: $X
❌ [Bonus 1] — Value: $X
❌ [Bonus 2] — Value: $X

**Total Value: $[sum]**
**Price: $[main_price]**

---

## But What If You Could Keep the Core?

### [Downsell Name]

✓ [Core Feature 1] — Value: $X
✓ [Core Feature 2] — Value: $X
✓ [Core Feature 3] — Value: $X

**Total Value: $[sum]**
**Your Price: Just $[downsell_price]**

**You save: $[difference]**
**You still get: [core transformation]**

---

Same 30-day guarantee.
Same quality content.
Just the essentials.

[GET THE ESSENTIALS FOR $[PRICE] →]
```

### 5.4 The Kennedy Direct Response Framework

**Dan Kennedy Style:**
- Confident, not desperate
- One offer, take it or leave it
- Clear urgency
- No apology for selling

**Full Template:**
```markdown
# Look, I Understand

[Main Offer] isn't for everyone.

Maybe not today.
Maybe not ever.

**That's fine.**

But before you go, I want you to know about [Downsell].

It's not the complete system.
It's the [core piece] that handles [specific problem].

**$[price]. One time.**

No upsells after this.
No tricks.
Just [product] for [price].

This is the only time you'll see this offer.
Take it or leave it.

[I'LL TAKE IT →]

[I'll leave it]
```

### 5.5 The Problem-Reminder Framework

**Structure:**
1. Remind them of the problem
2. Acknowledge main offer rejection
3. Offer simpler solution
4. Make it easy to say yes

**Full Template:**
```markdown
# [Problem] Is Still There

You came here because [describe pain point].

[Main Offer] wasn't right.
Got it.

**But [problem] doesn't care.**

It's still costing you [cost of problem].
Every day you wait is another day of [pain].

## Here's a Simpler Path:

[Downsell Name]
Just $[price]

It won't solve everything.
But it WILL solve [specific aspect].

And that's a start.

[START SOLVING [PROBLEM] FOR $[PRICE] →]

[No, I'll keep dealing with [problem]]
```

---

## Step 6: Urgency Elements

### 6.1 Urgency Types

#### Countdown Timer
```markdown
⏱️ This Offer Expires In: [15:00]

When the timer hits zero, this page redirects
and you'll never see this price again.
```

#### One-Time Offer Statement
```markdown
⚠️ ONE-TIME OFFER

This page appears once.
Close it and it's gone forever.
There's no link to come back.
```

#### Limited Quantity (If True)
```markdown
🔥 Only [X] Spots Remaining

[Y] people have claimed this today.
Once they're gone, price returns to $[higher].
```

#### Price Increase Warning
```markdown
💰 Special Exit Pricing

Regular price: $[higher]
This page only: $[lower]

After you leave: back to $[higher]
```

### 6.2 Urgency Copy Rules

**DO:**
- Use real urgency (actual timers, actual limits)
- Explain why it's urgent
- Be specific about consequence

**DON'T:**
- Fake scarcity (damages trust)
- Multiple urgency types (overwhelming)
- Vague threats ("limited time!")

---

## Step 7: CTA Optimization

### 7.1 Acceptance CTAs

**First-Person, Action-Oriented:**
```
✓ Yes! I Want [Product] for $[Price]!
✓ Give Me [Product] Now - $[Price]
✓ I'm In! Let's Do This for $[Price]
✓ Add [Product] to My Order - $[Price]
✓ Claim My [Product] for Just $[Price]
```

**Benefit-Focused:**
```
✓ Start [Achieving Result] for $[Price]
✓ Get [Core Benefit] Now - $[Price]
✓ Begin [Transformation] Today - $[Price]
```

### 7.2 Rejection CTAs (Loss Aversion)

**Problem Continuation:**
```
✗ No thanks, I'll keep struggling with [problem]
✗ No, I don't need help with [issue]
✗ I'll figure out [problem] on my own
```

**Loss Framing:**
```
✗ No, I'll pass on this opportunity
✗ No thanks, I'll leave empty-handed
✗ I'd rather miss out on [benefit]
```

**Neutral (Less Pressure):**
```
✗ Not right now, thank you
✗ Skip this offer
✗ Continue without [Product]
```

### 7.3 CTA Design Principles

- **Acceptance Button:** Prominent, contrasting color, above fold
- **Rejection Link:** Smaller text link below button
- **No Third Option:** Binary choice only (yes/no)

---

## Step 8: Quality Checklist

### Pre-Launch Validation

```yaml
psychology_check:
  - [ ] Objection diagnosis matches downsell type
  - [ ] Loss aversion properly applied
  - [ ] Anchoring effect leveraged (original price shown)
  - [ ] No begging or desperate tone
  - [ ] Confident, helpful positioning maintained

copy_check:
  - [ ] Acknowledgment validates without judgment
  - [ ] Bridge transitions smoothly to alternative
  - [ ] Value comparison is clear and visual
  - [ ] Core transformation preserved and communicated
  - [ ] Urgency is real and explained

structure_check:
  - [ ] Pattern interrupt headline is attention-grabbing
  - [ ] Page flows logically (acknowledge → bridge → offer → close)
  - [ ] CTA is impossible to miss
  - [ ] Rejection option uses loss aversion
  - [ ] Mobile-optimized (many downsells viewed on mobile)

offer_check:
  - [ ] Downsell price is 30-70% below main offer
  - [ ] Clear differentiation from main offer
  - [ ] Still provides genuine value
  - [ ] Upgrade path exists (if applicable)
  - [ ] Guarantee present and prominent

technical_check:
  - [ ] Timer functions correctly (if used)
  - [ ] Page loads quickly
  - [ ] Checkout process seamless
  - [ ] Tracking/analytics in place
  - [ ] A/B test variant ready
```

---

## Step 9: Metrics & Optimization

### 9.1 Key Metrics to Track

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| **Downsell Conversion Rate** | Downsell sales ÷ Upsell rejections | 15-30% |
| **Revenue Recovery Rate** | Downsell revenue ÷ Lost upsell revenue | 20-40% |
| **Upgrade Rate** | Downsell buyers who upgrade ÷ Total downsell buyers | 10-25% |
| **Funnel Save Rate** | (Upsell + Downsell conversions) ÷ Main offer buyers | 40-60% |
| **Downsell LTV** | Average lifetime value of downsell customers | Should approach main offer LTV |

### 9.2 A/B Testing Priorities

**Test First (Highest Impact):**
1. **Price Point:** $7 vs $17 vs $27 vs $47
2. **Headline Approach:** Empathy vs urgency vs curiosity
3. **Offer Type:** Lite vs payment plan vs trial

**Test Second:**
4. CTA copy and button color
5. Urgency mechanism (timer vs statement)
6. Guarantee prominence

**Test Third:**
7. Page length (short vs detailed)
8. Image/mockup inclusion
9. Rejection link copy

### 9.3 Optimization Process

1. **Baseline:** Establish current conversion rate (need 100+ rejections for statistical validity)
2. **Hypothesis:** "Changing [X] will improve conversion by [Y]%"
3. **Test:** Single variable A/B test
4. **Analyze:** Wait for 95%+ statistical confidence
5. **Implement:** Roll out winner
6. **Iterate:** Move to next test

---

## Step 10: Output Generation

### 10.1 Complete Deliverable Format

```yaml
downsell_page_output:

  metadata:
    main_offer: "[Name]"
    downsell_offer: "[Name]"
    objection_type: "[Diagnosed driver]"
    downsell_type: "[A-F type]"
    price_comparison: "$[main] → $[downsell] ([X]% discount)"

  page_copy:
    headline: "[Pattern interrupt headline]"
    acknowledgment: "[Validation copy]"
    bridge: "[Transition statement]"
    offer_intro: "[Downsell name + description]"
    value_comparison: "[Side-by-side or list]"
    inclusions: ["item 1", "item 2", "..."]
    core_benefit: "[Transformation statement]"
    social_proof: "[Optional testimonial]"
    guarantee: "[Risk reversal statement]"
    urgency: "[Timer/statement]"
    price_display: "[Anchored price presentation]"
    cta_accept: "[Button text]"
    cta_reject: "[Link text]"

  variations:
    headlines: ["Option 1", "Option 2", "Option 3"]
    ctas_accept: ["Option 1", "Option 2", "Option 3"]
    ctas_reject: ["Option 1", "Option 2"]

  recommendations:
    copywriter_style: "[Recommended copywriter]"
    test_priorities: ["Test 1", "Test 2", "Test 3"]
    upgrade_path: "[How downsell buyers can upgrade later]"
```

---

## Copywriter Recommendations

| Context | Copywriter | Why |
|---------|------------|-----|
| **Urgency-focused downsell** | Dan Kennedy | Master of scarcity, direct closing |
| **High-ticket recovery** | Alex Hormozi | Value stacking, pricing psychology |
| **Empathy-led downsell** | Gary Halbert | Emotional connection, conversational |
| **Trust-building downsell** | David Ogilvy | Premium positioning, credibility |
| **Story-driven downsell** | Jon Benson | Narrative hooks, VSL-style |
| **Systematic downsell** | Stefan Georgi | RMBC method, research-backed |

---

## Complete Page Templates

### Template 1: Price Objection (Lite Version)

```markdown
# Wait! I Get It.

$997 is a serious investment.
Maybe more than you wanted to spend today.

**That's OK. I hear you.**

But before you leave...

## What if you could still get [core result]?

Introducing: **[Product] Essentials**

Everything you need. Nothing you don't.

### What's Included:

✓ **Core Training Modules** — The essential 6 (of 12) that drive 80% of results
✓ **Key Templates** — The 5 most important tools for [outcome]
✓ **Quick-Start Guide** — Hit the ground running in 48 hours

### What's Not Included:

✗ Live Q&A calls (you can email questions instead)
✗ Private community (solo study focus)
✗ 1:1 coaching session (self-implementation)
✗ Bonus vault (essentials only)

### The Comparison:

| | Full Course | Essentials |
|---|---|---|
| Core modules | ✓ All 12 | ✓ Top 6 |
| Templates | ✓ All 20+ | ✓ Top 5 |
| Support | ✓ Live + Email | ✓ Email only |
| Access | ✓ Lifetime | ✓ 1 Year |
| **Price** | ~~$997~~ | **$197** |

**You save $800** and still achieve [main transformation].

### Same Guarantee

If [Essentials] doesn't help you [specific outcome] within 30 days,
email me for a full refund. No questions, no hassle.

---

⚠️ **This Offer Is Only Available Here**

When you close this page, [Essentials] returns to $397.
This is your ONE chance at this price.

---

~~$397~~ **Just $197 Today**

[🔒 YES! GIVE ME ESSENTIALS FOR $197 →]

^^ Instant access. Secure checkout. ^^

---

[No thanks, I'll pass on this opportunity]
```

### Template 2: Payment Plan Downsell

```markdown
# Is the Investment the Only Barrier?

I understand. $997 all at once can strain any budget.

**What if you could spread it out?**

## Same [Product]. Smaller Payments.

Everything you saw on the main offer:
• All 12 modules
• Live Q&A access
• Private community
• Templates and tools
• Full support

**Now available in easy monthly installments.**

### Your Options:

| Pay in Full | Easy Pay |
|---|---|
| $997 one-time | 12 payments of $97 |
| Save $167 | Budget-friendly |
| Instant ownership | Same access from day 1 |

**Easy Pay Total: $1,164**
*(Small premium for payment flexibility)*

### Why This Works:

→ Start implementing TODAY
→ See results BEFORE you're done paying
→ Less stress on monthly budget
→ Same 30-day guarantee applies

---

💡 **Math Time:**

$97/month = ~$3.23/day
That's less than a coffee.

For [transformation that's worth $X to them].

---

⏱️ Payment plan option expires when you leave this page.

[🔒 YES! I'LL PAY $97/MONTH →]

[No, I'll pass on both options]
```

### Template 3: Alternative Product Downsell

```markdown
# Maybe You Don't Need Everything

[Main Product] is the complete system.
Done-with-you implementation.
All the bells and whistles.

**But maybe that's more than you need right now.**

## What About Just the [Core Piece]?

Introducing: **[Alternative Product Name]**

Not the full system.
Just the [specific component] that handles [specific problem].

### Perfect If You:

• Already have [some capability] but need [specific thing]
• Prefer DIY implementation
• Want to test the methodology first
• Have a smaller budget right now

### What You Get:

✓ **[Component 1]** — [What it does]
✓ **[Component 2]** — [What it does]
✓ **[Component 3]** — [What it does]

### What This Solves:

[Specific problem] → [Specific solution]

That's it. Focused. Effective. Done.

---

**[Alternative Product]:** $[price]

(vs $[main_price] for the complete system)

---

### Upgrade Path:

Love [Alternative]?
Upgrade to [Full Product] anytime.
We'll credit your full purchase toward the upgrade.

---

[🔒 GET [ALTERNATIVE] FOR $[PRICE] →]

[No thanks, I'm looking for the complete solution]
```

---

## Industry-Specific Adaptations

### Info Products / Courses
- **Primary Downsell:** Lite version (fewer modules)
- **Secondary:** Payment plan
- **Tertiary:** First module only ($17-47)

### SaaS / Software
- **Primary:** Lower tier (Basic vs Pro)
- **Secondary:** Annual vs monthly (lifetime option)
- **Tertiary:** Feature-limited trial

### Coaching / Consulting
- **Primary:** Group vs 1:1
- **Secondary:** DIY course version
- **Tertiary:** Single strategy session

### E-commerce / Physical Products
- **Primary:** Smaller quantity or size
- **Secondary:** Entry-level product
- **Tertiary:** Sample pack

### Events / Workshops
- **Primary:** Virtual vs in-person
- **Secondary:** Recordings only
- **Tertiary:** Single session vs full event

---

## Common Mistakes to Avoid

### Timing Mistakes
❌ Showing downsell before clear rejection
❌ Delaying downsell until after thank you page
❌ Multiple downsells in sequence (desperate)

### Offer Mistakes
❌ Downsell unrelated to main offer
❌ Downsell too similar (makes main seem overpriced)
❌ Price too close to main offer

### Copy Mistakes
❌ Begging or desperate tone
❌ No urgency (leads to "I'll think about it")
❌ Judging the rejection

### Pricing Mistakes
❌ Price too low (destroys margins)
❌ No clear value justification
❌ Missing anchor comparison

---

## Integration Notes

### With Copy Chief
- Request copywriter assignment based on downsell context
- Use tier-appropriate copywriter for style

### With Schwartz Diagnosis
- Downsell should match awareness level
- Unaware → More education in downsell
- Most aware → Price-focused downsell

### With Sugarman Triggers
- Apply relevant triggers from 30 Psychological Triggers
- Key triggers: Scarcity, Urgency, Exclusivity, Value Comparison

### With Funnel Sequence
```
Main Offer
    ↓ (Accepted → Thank You + Upsell)
    ↓ (Declined)
Downsell Page
    ↓ (Accepted → Thank You)
    ↓ (Declined → Thank You or Tripwire)
```

---

*Task Version: 2.0*
*Lines: 950+*
*Research Base: downsell-methodology-research.md*
*Frameworks: Loss Aversion + Acknowledgment + Kennedy Direct Response*
