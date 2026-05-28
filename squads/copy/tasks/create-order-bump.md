---
task: Create Order Bump Task
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

# Create Order Bump Task
## Copy Framework v2.0 - Comprehensive Order Bump Creation System

**Task Version:** 2.0
**Primary Frameworks:** Three Psychological Triggers + Value Stacking + Impulse Purchase Psychology
**Research Source:** docs/research/order-bump-methodology-research.md

---

## Purpose

Create high-converting order bump offers that leverage the buyer's existing commitment momentum to increase Average Order Value (AOV) by 10-30%. Order bumps are the lowest-friction revenue multiplier in any funnel.

**Core Insight:** Order bumps are "the sneakiest, friendliest little sales ninja in your funnel" - a tiny checkbox that capitalizes on the buyer's "yes" mindset to add complementary value.

**Golden Rule:** An order bump should make the customer's life easier, faster, or better - NOT trick them into buying something they don't need.

---

## When to Use

- Checkout/payment page (primary use case)
- Shopping cart before payment
- Any pre-purchase decision point
- Subscription signup pages
- Event registration checkouts

**Critical Context:** Order bumps appear ON the checkout page with a simple checkbox - not after purchase (that's upselling) or during browsing (that's cross-selling).

---

## Inputs

```yaml
required:
  main_product:
    name: "Product being purchased"
    price: "Price point ($)"
    core_transformation: "What it helps them achieve"

  bump_offer:
    name: "Order bump product name"
    type: "accelerator | complement | upgrade | tool | support | bonus"
    price: "Bump price ($)"
    what_it_is: "Brief description"

  target_avatar:
    who: "Who is buying"
    pain_points: "What they struggle with"
    desired_outcome: "What they want to achieve"

optional:
  relationship:
    how_complements: "How bump enhances main product"
    gap_fills: "What's 'missing' from main offer"

  value_elements:
    original_price: "Original/regular price for anchoring"
    time_savings: "Hours saved by using bump"
    specific_deliverables: "Tangible items included"

  urgency:
    type: "checkout_only | limited_time | limited_quantity"
    social_proof: "% of customers who add, testimonials"

  copywriter_preference:
    primary: "Specific copywriter style"
    reason: "Why this style fits"
```

---

## Step 1: Bump Type Selection

### 1.1 The Six Core Bump Types

#### Type A: Accelerator Bump
**What it does:** Makes the result happen faster

**Best For:**
- Courses with implementation component
- Programs with learning curves
- Any product requiring action

**Characteristics:**
- Shortcuts to success
- Time-saving tools
- Implementation aids
- Done-for-you elements

**Examples:**
| Main Product | Accelerator Bump |
|--------------|------------------|
| Course | Templates pack |
| Program | Quick-start guide |
| System | Checklists |
| Training | Scripts |

**Copy Angle:** "Get there 2x faster"

**Expected Take Rate:** 25-40%

#### Type B: Complementary Enhancement Bump
**What it does:** Fills a gap in the main product

**Best For:**
- Products with natural companions
- Offers that feel "incomplete" without X
- Training with application component

**Characteristics:**
- Fills a gap
- Improves core experience
- Natural pairing
- Enhanced delivery

**Examples:**
| Main Product | Complement Bump |
|--------------|-----------------|
| Course | Workbook |
| Software | Training videos |
| Physical product | Accessories |
| Service | Implementation guide |

**Copy Angle:** "The missing piece you need"

**Expected Take Rate:** 20-35%

#### Type C: Premium Upgrade Bump
**What it does:** Unlocks better/more features

**Best For:**
- Tiered products
- Products with expandable access
- Community/support-based offers

**Characteristics:**
- Enhanced version
- More access
- Exclusive content
- Priority treatment

**Examples:**
| Main Product | Upgrade Bump |
|--------------|--------------|
| Standard course | VIP access |
| Basic plan | Premium features |
| Solo study | Community access |
| Email support | Live Q&A calls |

**Copy Angle:** "Unlock the full experience"

**Expected Take Rate:** 15-25%

#### Type D: Tool/Resource Bump
**What it does:** Provides practical implementation asset

**Best For:**
- Training products
- How-to content
- Process-oriented offers

**Characteristics:**
- Software or templates
- Immediate utility
- Tangible deliverable
- Practical application

**Examples:**
| Main Product | Tool Bump |
|--------------|-----------|
| Marketing course | Spreadsheet calculator |
| Writing training | Script library |
| Design program | Template pack |
| Sales training | Swipe file |

**Copy Angle:** "The tool that does the work"

**Expected Take Rate:** 25-35%

#### Type E: Support/Access Bump
**What it does:** Provides additional help and connection

**Best For:**
- Complex products
- High-commitment purchases
- Customers who may get stuck

**Characteristics:**
- Direct contact
- Expert guidance
- Community
- Implementation help

**Examples:**
| Main Product | Support Bump |
|--------------|--------------|
| DIY course | 1:1 session |
| Self-study | Group access |
| Program | Office hours |
| Training | Review service |

**Copy Angle:** "Never get stuck"

**Expected Take Rate:** 10-20%

#### Type F: Bonus Content Bump
**What it does:** Extra exclusive material

**Best For:**
- Audiences who want depth
- Knowledge-hungry buyers
- Premium positioning

**Characteristics:**
- Depth/breadth expansion
- Exclusive interviews
- Case studies
- Advanced content

**Examples:**
| Main Product | Bonus Bump |
|--------------|------------|
| Course | Masterclass recording |
| Training | Expert interviews |
| Program | Case study pack |
| System | Behind-the-scenes |

**Copy Angle:** "Go deeper than anyone else"

**Expected Take Rate:** 20-30%

### 1.2 Type Selection Decision Tree

```
Q1: What does the customer need MOST after buying?

→ To implement faster?
  → Type A: Accelerator

→ Something that makes the main better?
  → Type B: Complement

→ A "better" version of what they're getting?
  → Type C: Upgrade

→ A practical tool to apply it?
  → Type D: Tool

→ Help if they get stuck?
  → Type E: Support

→ To go deeper on the topic?
  → Type F: Bonus
```

### 1.3 Type Selection Output

```yaml
bump_type_selection:
  selected_type: "[A-F]"
  rationale: "[Why this type]"
  expected_take_rate: "[X-Y%]"
  copy_angle: "[Primary angle]"
```

---

## Step 2: Pricing Strategy

### 2.1 The Golden Rule: 10-25% of Main Product

**Price Mapping:**

| Main Product Price | Bump Range | Sweet Spot |
|-------------------|------------|------------|
| $27-$47 | $5-$12 | $7 |
| $97-$147 | $17-$37 | $27 |
| $197-$297 | $27-$67 | $47 |
| $497-$697 | $47-$127 | $97 |
| $997-$1,497 | $97-$247 | $147 |
| $1,997+ | $197-$397 | $297 |

### 2.2 Price Psychology Techniques

#### Technique 1: Original Value Anchor
```markdown
"Usually $197 — yours for just $47 today"
Savings: 76% OFF

"Normally $97 → Checkout price: $27"
You save: $70
```

#### Technique 2: Daily Cost Breakdown
```markdown
"Just $27 — that's less than $1 per day for a month"
"$47 = price of a few coffees"
"$97 = what you'd spend on [comparable waste]"
```

#### Technique 3: Per-Use Value
```markdown
"$47 for unlimited use = pennies per [use case]"
"Use these 20 templates forever — that's $2.35 each"
```

#### Technique 4: Comparison Anchor
```markdown
"The same templates agencies charge $500 to create"
"What would cost $2,000 to build yourself"
"Comparable tools sell for $99/month"
```

### 2.3 Price Testing Framework

**Test Order:**
1. Sweet spot price (from table)
2. -$10 from sweet spot
3. +$10 from sweet spot
4. Different anchoring approach

**Decision Matrix:**
- If take rate < 15%: Test lower price
- If take rate 20-40%: Optimize copy, keep price
- If take rate > 45%: Test higher price

### 2.4 Pricing Output

```yaml
pricing_strategy:
  main_product_price: "$X"
  bump_price: "$Y"
  ratio: "X%"
  anchor_price: "$Z (original value)"
  savings_display: "[How to show savings]"
```

---

## Step 3: The Three Psychological Triggers

### 3.1 Trigger 1: The "No-Brainer" Effect

**Principle:** Make the bump so obviously valuable it requires zero deliberation.

**How to Apply:**

✅ **Make it stupidly obvious:**
```markdown
Main: Course on [Topic]
Bump: Templates to implement [Topic]

"You just bought [how to do X].
Here's everything you need to actually do it."
```

✅ **Direct complement:**
- Bump should feel like a natural pairing
- Customer shouldn't need to think "why would I need this?"
- Should feel like "of course I want that"

✅ **Low price point:**
- Keep within 10-25% rule
- Impulse-friendly
- No analysis paralysis

**Copy Test:** If a customer has to think more than 3 seconds, simplify.

### 3.2 Trigger 2: Fear of Missing Out (FOMO)

**Principle:** Leverage urgency and exclusivity.

**Key Insight:** "Once someone says yes, it gets easier to say yes again."

**FOMO Application Methods:**

#### Method A: Checkout-Only Pricing
```markdown
"This price is ONLY available at checkout"
"Once you leave, this offer disappears"
"You won't see this price again"
```

#### Method B: Price Escalation
```markdown
"Usually $97 — checkout price: $27"
"After checkout, returns to full price"
```

#### Method C: Exclusive Access
```markdown
"Only available when buying [Main Product]"
"Not sold anywhere else"
"Exclusive bundle offer"
```

#### Method D: Social Proof FOMO
```markdown
"87% of customers add this"
"Most popular add-on"
"Join [X] others who grabbed this"
```

**Important:** Create perceived scarcity WITHOUT being manipulative.

### 3.3 Trigger 3: Tiny Yes Momentum

**Principle:** Capitalize on already-committed mental state.

**Context:** Customer is already:
- Wallet out
- In "yes" mindset
- Past major decision
- Looking to complete purchase

**Application:**

✅ **Frame as natural progression:**
```markdown
"Since you're already getting [Main], add [Bump] for just $X"
"Complete your purchase with [Bump]"
"While you're here, grab [Bump]"
```

✅ **Minimize new decisions:**
- One simple checkbox
- Clear yes/no choice
- No extra deliberation required

✅ **Connect to existing purchase:**
```markdown
"The perfect companion to what you just chose"
"Makes your [Main Product] even more powerful"
```

### 3.4 Trigger Integration

**Best Practice:** Combine all three triggers:

```markdown
☐ YES! Add the [Bump] for just $47

### Get Results 2x Faster [No-Brainer]

[Main Product] teaches the method.
[Bump] gives you the shortcuts.

✓ 20 done-for-you templates [No-Brainer]
✓ Used by 85% of our customers [FOMO]
✓ Perfect with what you're buying [Momentum]

~~$197~~ → Just $47 (checkout only) [FOMO]

⚠️ This offer disappears after checkout [FOMO]
```

---

## Step 4: Copy Structure

### 4.1 Complete Bump Anatomy

```
┌─────────────────────────────────────────────────────┐
│ ☐ [CHECKBOX LABEL: Yes-oriented, benefit + price]   │
├─────────────────────────────────────────────────────┤
│ ### [HEADLINE: Primary benefit/angle]               │
│                                                     │
│ [DESCRIPTION: 2-3 lines, problem→solution or        │
│  complement→benefit format]                         │
│                                                     │
│ ✓ [BULLET 1: Specific tangible benefit]             │
│ ✓ [BULLET 2: Specific tangible benefit]             │
│ ✓ [BULLET 3: Specific tangible benefit]             │
│                                                     │
│ ~~$[Original Price]~~ → Just $[Bump Price]          │
│                                                     │
│ [URGENCY/EXCLUSIVITY STATEMENT]                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 Checkbox Label Formulas

**YES-Oriented (Highest Converting):**
```
☐ YES! Add [Bump Name] for just $X
☐ YES! I want [benefit] for only $X
☐ YES! Include [Bump] with my order — $X
```

**Benefit-Oriented:**
```
☐ [Achieve result] faster — Add [Bump] for $X
☐ Get [outcome] with [Bump] — Only $X
☐ Unlock [benefit] for just $X more
```

**Action-Oriented:**
```
☐ Add the [Bump Name] ($X)
☐ Include [Bump] in my order — $X
☐ Upgrade with [Bump] for $X
```

### 4.3 Headline Formulas

**Acceleration Headlines:**
```
"Get [Result] 2x Faster"
"The Shortcut to [Outcome]"
"Skip the Learning Curve"
"Cut Your [Time/Effort] in Half"
"From Zero to [Result] in [Time]"
```

**Enhancement Headlines:**
```
"The Perfect Companion to [Main Product]"
"Complete Your [Main Product] Setup"
"Make [Main Product] Even More Powerful"
"The Missing Piece You Need"
"Unlock the Full Potential of [Main]"
```

**Exclusive/FOMO Headlines:**
```
"Exclusive Add-On: Available Only Here"
"One-Time Offer: [Bump Name]"
"Checkout Price Only: [Bump Name]"
"Your Only Chance to Get [Bump] at This Price"
```

**Value Headlines:**
```
"$X Worth of [Content] for Just $Y"
"Save [X Hours] with [Bump]"
"What Takes Pros [X Time], Done in [Y Time]"
"[X] [Deliverables] for Less Than $Y Each"
```

### 4.4 Description Formulas

**Problem → Solution (2-3 lines):**
```markdown
Most [avatars] struggle with [specific problem].
[Bump] solves that with [solution].
Start seeing [result] immediately.
```

**Complement + Benefit (2-3 lines):**
```markdown
[Main Product] teaches you [skill].
[Bump] gives you [tool/shortcut] to apply it immediately.
Skip the guesswork and get straight to results.
```

**Social Proof + Result (2-3 lines):**
```markdown
[X]% of our customers add [Bump].
They report [specific result] in half the time.
Join them for just $[price].
```

**Time Saving (2-3 lines):**
```markdown
Instead of spending [X hours] on [task],
[Bump] does it for you in [Y minutes].
Your time is worth more than $[bump price].
```

**Before/After (2-3 lines):**
```markdown
Without [Bump]: [Pain/struggle]
With [Bump]: [Pleasure/ease]
The choice is easy.
```

### 4.5 Bullet Point Formulas

**Format:** ✓ [Specific, tangible benefit]

**Quantity Bullets:**
```
✓ [X] ready-to-use templates
✓ [X]-page implementation guide
✓ [X] video walkthroughs
✓ [X] proven [scripts/formulas/frameworks]
```

**Time Saving Bullets:**
```
✓ Save [X] hours of [specific task]
✓ Get done in [X] what takes others [Y]
✓ Instant access — start using today
✓ No learning curve required
```

**Result Bullets:**
```
✓ [Specific outcome] guaranteed
✓ Used by [X] successful [avatars]
✓ Proven to deliver [result]
✓ Works even if you're [beginner qualifier]
```

**Feature → Benefit Bullets:**
```
✓ [Feature] — so you can [benefit]
✓ [Deliverable] — [what it does for them]
✓ [Component] — [outcome it produces]
```

**Value/Include Bullets:**
```
✓ Lifetime updates included
✓ Instant download access
✓ Works with [Main Product]
✓ Support via [channel]
```

### 4.6 Price Display Formulas

**Strikethrough + Current:**
```markdown
~~$197~~ → Just $47

~~$97~~ → Only $27 Today

Regular: $147 | Checkout Price: $47
```

**Savings Emphasis:**
```markdown
Save 76%: Just $47 (normally $197)

$150 OFF: Get [Bump] for $47 instead of $197

You save: $100+ | Your price: $47
```

**Value Breakdown:**
```markdown
$197 Value → $47 Investment
(That's $150 in instant savings)

$47 for $197 worth of [content]
= 76% OFF
```

### 4.7 Urgency/Exclusivity Statements

**Checkout-Only:**
```markdown
⚠️ This offer disappears after checkout
⏱️ Only available on this page
🔒 Checkout exclusive — not available later
```

**Price-Based:**
```markdown
💰 Checkout price only — returns to $197 after
📈 Price increases after you leave this page
🎯 This discount won't be repeated
```

**Social Proof:**
```markdown
🔥 85% of customers add this
⭐ Most popular add-on
👥 Join [X]+ who grabbed this offer
```

---

## Step 5: Visual Design Guidelines

### 5.1 Placement

**Optimal Position:** Directly above payment button

**Page Flow:**
```
[Order Summary]
     ↓
═══════════════════════════════
[   ORDER BUMP BOX          ]
═══════════════════════════════
     ↓
[Payment Information]
     ↓
[Complete Purchase Button]
```

### 5.2 Container Design

**DO:**
- Subtle colored border (matches brand)
- Light background tint
- Clear visual separation from order summary
- Looks "special" without being spammy

**DON'T:**
- Aggressive flashing or animation
- Clashing colors
- Looks like an ad/banner
- Blends too much (invisible)

**Example Styling:**
```css
.order-bump {
  border: 2px solid [brand-accent];
  background: [brand-light-tint];
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}
```

### 5.3 Checkbox Design

**Size:** Large enough for easy clicking (minimum 20px x 20px)

**States:**
- Unchecked: Clear empty box
- Checked: Filled with checkmark + slight color
- Hover: Subtle highlight

**Mobile:** Thumb-friendly size (44px x 44px touch target)

### 5.4 Typography

**Checkbox Label:** Bold, clear, prominent
**Headline:** Slightly larger than body, bold
**Description:** Regular weight, readable
**Bullets:** Clear checkmarks, scannable
**Price:** Bold, color for current price

### 5.5 Optional Product Image

**When to Include:**
- Physical products (show what they get)
- Digital bundles (mockup of deliverables)
- When visual helps communicate value

**When to Skip:**
- Simple add-ons
- Services
- When space is limited

**If Including:**
- Small (doesn't dominate)
- Clean mockup
- Shows what they're getting
- Left or right of text

---

## Step 6: Complete Templates

### Template 1: Accelerator Bump

```markdown
☐ YES! Add the [Bump Name] for just $47

### Get [Result] 2x Faster

[Main Product] teaches you the complete method.
[Bump] gives you the shortcuts that save [X] hours.

✓ [X] ready-to-use templates
✓ Step-by-step implementation checklists
✓ [Specific deliverable] included

~~$197~~ → Just $47 (checkout only)

⚠️ This offer disappears when you complete your purchase
```

### Template 2: Complementary Enhancement Bump

```markdown
☐ YES! Include [Bump Name] — Only $37

### The Perfect Companion to [Main Product]

While [Main Product] teaches you [skill],
[Bump] gives you [tool] to apply it immediately.

✓ [Component 1] — [what it does]
✓ [Component 2] — [what it does]
✓ [Component 3] — [what it does]

$147 value → Just $37 today

💡 87% of customers add this to their order
```

### Template 3: Premium Upgrade Bump

```markdown
☐ UPGRADE: Add VIP Access for +$97

### Unlock the Full [Main Product] Experience

Everything in your order, PLUS:

✓ Access to private community
✓ [X] live Q&A sessions monthly
✓ Priority email support
✓ [Exclusive VIP bonus]

Regular upgrade: $297 | Checkout price: $97

🔒 VIP pricing only available here
```

### Template 4: Tool/Resource Bump

```markdown
☐ Add [Tool Name] — $27

### The Tool That Does [Specific Task] For You

Stop spending [X hours] on [task].
[Tool] handles it in [Y minutes].

✓ [Feature 1] — [benefit]
✓ [Feature 2] — [benefit]
✓ Lifetime updates included

~~$97~~ → $27 (checkout exclusive)

⏱️ You'll save [X] hours on your first use alone
```

### Template 5: Support/Access Bump

```markdown
☐ YES! Add [Support Type] for $147

### Never Get Stuck: [Support Name]

Get direct access to [expert/support]:

✓ [X]-minute strategy session
✓ Personal review of your [work/project]
✓ Direct [email/chat] access for [period]
✓ Priority response within [time]

Value: $497 | Your price: $147

🎯 Perfect if you want guaranteed results
```

### Template 6: Bonus Content Bump

```markdown
☐ Add [Bonus Bundle] — $67

### Go Deeper: [Bonus Name]

For those who want the complete picture:

✓ [X] expert interviews ([combined hours])
✓ [Y] case study breakdowns
✓ [Z]-page advanced guide
✓ Behind-the-scenes [content]

Sold separately: $247 | Bundle price: $67

📚 The knowledge others charge $[X]/hour to share
```

---

## Step 7: Industry-Specific Applications

### 7.1 Digital Products / Online Courses

| Main Product | Best Bump Type | Example |
|--------------|----------------|---------|
| Course | Accelerator | Template pack |
| Program | Complement | Implementation workbook |
| Membership | Upgrade | VIP tier access |
| Ebook | Tool | Action checklist |

**Copy Focus:** Time savings, implementation speed, practical application

### 7.2 SaaS / Software

| Main Product | Best Bump Type | Example |
|--------------|----------------|---------|
| Monthly plan | Upgrade | Annual discount |
| Basic tier | Upgrade | Pro features |
| New signup | Support | Onboarding call |
| Any plan | Tool | Template library |

**Copy Focus:** Feature unlock, time savings, support access

### 7.3 E-commerce / Physical Products

| Main Product | Best Bump Type | Example |
|--------------|----------------|---------|
| Main item | Complement | Accessory |
| Electronics | Support | Extended warranty |
| Bundle | Upgrade | Premium version |
| Any product | Tool | Care kit |

**Copy Focus:** Protection, enhancement, convenience

### 7.4 Coaching / Consulting

| Main Product | Best Bump Type | Example |
|--------------|----------------|---------|
| Group program | Support | 1:1 add-on |
| Course | Accelerator | Implementation guide |
| Coaching | Upgrade | Extra sessions |
| Any service | Tool | Resource library |

**Copy Focus:** Personal attention, faster results, implementation help

### 7.5 Events / Workshops

| Main Product | Best Bump Type | Example |
|--------------|----------------|---------|
| General admission | Upgrade | VIP seating |
| Virtual ticket | Upgrade | Recordings access |
| Workshop | Bonus | Materials pack |
| Conference | Support | Meet-and-greet |

**Copy Focus:** Enhanced experience, exclusive access, tangible materials

---

## Step 8: Quality Checklist

### Pre-Launch Validation

```yaml
relevance_check:
  - [ ] Bump directly complements main product
  - [ ] Makes sense for target avatar
  - [ ] Solves real problem or adds real value
  - [ ] Natural pairing (no mental gymnastics needed)

pricing_check:
  - [ ] Price is 10-25% of main product
  - [ ] Original/anchor price is shown
  - [ ] Savings are clear and specific
  - [ ] Feels like impulse-friendly amount

psychology_check:
  - [ ] "No-brainer" effect applied (obvious value)
  - [ ] FOMO element present (urgency/exclusivity)
  - [ ] Momentum leveraged (connects to purchase)
  - [ ] No manipulation or trickery

copy_check:
  - [ ] Checkbox label is YES-oriented
  - [ ] Headline states clear benefit
  - [ ] Description is 2-3 lines max
  - [ ] 3-5 bullets, specific and tangible
  - [ ] Price display includes anchor
  - [ ] Urgency statement present

design_check:
  - [ ] Positioned above payment button
  - [ ] Visually distinct but not spammy
  - [ ] Checkbox is large and clickable
  - [ ] Mobile-friendly (thumb-sized checkbox)
  - [ ] Scannable in 5 seconds

ethical_check:
  - [ ] Offers genuine value
  - [ ] Customer would be happy to have it
  - [ ] Not deceptive or hidden
  - [ ] Clear opt-in (not pre-checked)
  - [ ] Easy to skip if not wanted
```

---

## Step 9: Metrics & Optimization

### 9.1 Key Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| **Take Rate** | Bump purchases ÷ Checkouts | 20-40% |
| **Revenue Per Order** | Total bump revenue ÷ Orders | +$5-$30 |
| **AOV Impact** | (New AOV - Old AOV) ÷ Old AOV | +10-30% |
| **Bump Refund Rate** | Bump refunds ÷ Bump purchases | <5% |

### 9.2 Optimization Actions

**If Take Rate < 15%:**
- Test lower price point
- Improve relevance to main product
- Rewrite headline for clearer benefit
- Check visibility/placement

**If Take Rate 20-40%:**
- Optimize copy (test headlines, bullets)
- Keep price, test variations
- A/B test different bump types

**If Take Rate > 45%:**
- Test higher price point
- Consider adding second bump
- Explore premium bump option

### 9.3 A/B Testing Priorities

**Test First (Highest Impact):**
1. Price point ($X vs $X±10)
2. Bump offer/product itself
3. Headline approach

**Test Second:**
4. Description copy
5. Number/content of bullets
6. Urgency mechanism

**Test Third:**
7. Checkbox label wording
8. Visual design
9. Product image presence

### 9.4 Testing Protocol

**Minimum Sample:**
- 100+ orders per variant
- 50+ bump conversions per variant
- 95% confidence level

**Duration:**
- Minimum: 7 days
- Ideal: 14-21 days
- Maximum: 30 days

---

## Step 10: Output Generation

### Complete Deliverable Format

```yaml
order_bump_output:

  metadata:
    main_product: "[Name]"
    main_price: "$X"
    bump_product: "[Name]"
    bump_type: "[A-F]"
    bump_price: "$Y"
    price_ratio: "X%"
    anchor_price: "$Z"

  copy_components:
    checkbox_label: "[Complete label]"
    headline: "[Headline]"
    description: "[2-3 lines]"
    bullets: ["bullet 1", "bullet 2", "bullet 3"]
    price_display: "[Price with anchor]"
    urgency_statement: "[Urgency/exclusivity]"

  variations:
    headlines: ["Option 1", "Option 2", "Option 3"]
    checkbox_labels: ["Option 1", "Option 2"]
    urgency_statements: ["Option 1", "Option 2"]

  testing_plan:
    priority_tests: ["Test 1", "Test 2", "Test 3"]
    success_metrics: ["Metric 1 target", "Metric 2 target"]

  design_notes:
    placement: "[Where on page]"
    visual_style: "[Design direction]"
    mobile_considerations: "[Mobile notes]"

  copywriter_recommendation:
    style: "[Recommended copywriter]"
    reason: "[Why]"
```

---

## Copywriter Recommendations

| Context | Copywriter | Why |
|---------|------------|-----|
| **Value stacking bump** | Alex Hormozi | Master of perceived value |
| **Urgency-driven bump** | Dan Kennedy | Scarcity and action |
| **Logical demonstration** | Joe Sugarman | Features → Benefits |
| **Premium/sophisticated** | David Ogilvy | Elegant positioning |
| **Story-driven bump** | Gary Halbert | Emotional connection |
| **Systematic approach** | Stefan Georgi | Research-backed copy |

---

## Common Mistakes to Avoid

### Relevance Mistakes
❌ Bump unrelated to main product
❌ Bump competes with main product
❌ Requires explanation to understand fit

### Pricing Mistakes
❌ Price > 30% of main (too much deliberation)
❌ Price too low (destroys margin)
❌ No anchor price (misses psychology)

### Copy Mistakes
❌ Too much text (not scannable)
❌ Feature-focused, not benefit-focused
❌ Generic headlines ("Special Offer!")
❌ No urgency element

### Design Mistakes
❌ Hidden or tiny checkbox
❌ Looks spammy/aggressive
❌ Poor mobile experience
❌ Pre-checked by default (unethical)

### Ethical Mistakes
❌ Tricking customers
❌ Offering low-value products
❌ Making it hard to decline
❌ Confusing checkout flow

---

## Integration Notes

### With Copy Chief
- Request copywriter based on bump context
- Tier-appropriate style selection

### With Sugarman Triggers
- Apply relevant psychological triggers
- Key: Simplicity, Greed, Exclusivity

### With Funnel Sequence
```
Main Product Page
    ↓
Checkout Page
    → [ORDER BUMP HERE]
    ↓
Payment Processing
    ↓
Upsell/OTO Page (separate)
    ↓
Thank You Page
```

### With Schwartz Awareness
- Most Aware: Price-focused bump
- Product Aware: Benefit-focused bump
- Solution Aware: Value comparison bump

---

*Task Version: 2.0*
*Lines: 1100+*
*Research Base: order-bump-methodology-research.md*
*Frameworks: Three Psychological Triggers + Value Stacking + Impulse Psychology*
