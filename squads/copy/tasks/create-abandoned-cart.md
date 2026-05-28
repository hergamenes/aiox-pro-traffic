---
task: Create Abandoned Cart Recovery Sequence
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

# Create Abandoned Cart Recovery Sequence

**Task ID:** create-abandoned-cart
**Version:** 2.0.0
**Category:** Email Marketing / Recovery
**Minimum Output:** 4-email sequence with subject line variations
**Primary Methodology:** Dan Kennedy 3-Letter Sequence + Cialdini Persuasion Principles
**Research Source:** docs/research/abandoned-cart-methodology-research.md

---

## Purpose

Create high-converting abandoned cart email sequences that recover lost revenue by addressing the psychological reasons people abandon carts—not just reminding them they forgot something.

**The Problem:** 70-73% of online shopping carts are abandoned globally. Most brands either:
1. Send no recovery emails at all
2. Send a single generic "you forgot something" email
3. Discount too early, training customers to abandon

**The Solution:** A strategic 4-email sequence based on direct response copywriting principles that:
- Captures high-intent buyers immediately (Email 1)
- Addresses objections with value and proof (Email 2)
- Overcomes price resistance with targeted incentives (Email 3)
- Closes respectfully with final urgency (Email 4)

---

## When to Use

### Primary Use Cases
- E-commerce checkout abandonment (cart page, checkout page, payment page)
- Course/digital product checkout abandonment
- SaaS trial signup abandonment
- High-ticket service inquiry abandonment
- Webinar/event registration abandonment

### Secondary Use Cases
- Browse abandonment (viewed product, didn't add to cart)
- Wishlist/save-for-later reactivation
- Incomplete form submissions
- Quote request abandonment

---

## Inputs Required

```yaml
required:
  product_name: "Nome do produto abandonado"
  product_price: "Preço (original e com desconto se aplicável)"
  checkout_url: "URL direta para checkout com carrinho restaurado"
  brand_name: "Nome da marca/empresa"
  target_avatar: "Perfil do cliente ideal"

recommended:
  product_image_url: "URL da imagem do produto"
  cart_value: "Valor total do carrinho"
  abandonment_point: "Onde abandonaram (cart, checkout, payment)"
  customer_segment: "first_time | returning | vip"
  main_objection: "Objeção primária identificada"
  available_incentive: "Desconto, frete grátis, bônus disponível"
  urgency_element: "Escassez real (estoque, deadline, oferta)"
  brand_voice: "Formal | Casual | Playful | Premium"

optional:
  testimonial: "Depoimento de cliente para Email 2"
  guarantee_details: "Termos da garantia"
  support_contact: "Email/telefone para suporte"
  alternative_products: "Produtos relacionados para cross-sell"
  loyalty_program: "Benefícios de programa de fidelidade"
```

---

## Theoretical Foundation

### Why People Abandon Carts (Address These, Not Just Remind)

| Reason | % | What to Address in Copy |
|--------|---|------------------------|
| Unexpected costs | 48-55% | Be transparent, justify value |
| Just browsing | 34-37% | Build desire, create urgency |
| Comparison shopping | 15-25% | Differentiate, social proof |
| Checkout friction | 17-26% | Offer help, simplify |
| Payment concerns | 8-11% | Trust signals, security |
| Delivery issues | 16-22% | Clear shipping info |
| Distraction | 10-15% | Simple reminder |

**Key Insight:** Recovery copy must ADDRESS OBJECTIONS, not just repeat "buy now."

### Cialdini's 6 Principles for Cart Recovery

```yaml
reciprocity:
  definition: "People feel obligated to return favors"
  application: "Offer genuine help before asking for purchase"
  example: "Let me know if you have questions—I'm here to help"

scarcity:
  definition: "Limited availability increases perceived value"
  application: "Stock warnings, time-limited offers"
  example: "Only 3 left in your size"
  warning: "Use ONLY with real scarcity—fake urgency destroys trust"

authority:
  definition: "People defer to credible experts"
  application: "Expert endorsements, awards, media mentions"
  example: "As featured in Forbes..."

consistency:
  definition: "People want to act consistently with past behavior"
  application: "Reference their selection, previous purchases"
  example: "You have great taste—these are customer favorites"

liking:
  definition: "People buy from those they like"
  application: "Conversational tone, personal sender"
  example: "Hey [Name], just wanted to reach out personally..."

social_proof:
  definition: "People follow actions of others"
  application: "Reviews, testimonials, customer counts"
  example: "Join 50,000+ happy customers"
  impact: "37.5% conversion increase (Figleaves case study)"
```

### Loss Aversion (The Master Principle)

**Research (Kahneman & Tversky):** The pain of losing is ~2x more powerful than the pleasure of gaining.

```yaml
gain_framed_weak:
  - "Get 20% off today"
  - "Complete your purchase"
  - "Free shipping available"

loss_framed_strong:
  - "Don't miss your 20% savings"
  - "Don't let these items slip away"
  - "Your free shipping expires tonight"

usage_rule: "Apply loss aversion ONCE per sequence (Email 3 or 4) for maximum impact"
```

### Dan Kennedy's Multiple Exposure Principle

> "No matter how good the offer is, a single exposure will have minimal effect. Multiple repeated exposures will have a positive effect disproportionate to the number of exposures."

**Implication:** A 4-email sequence dramatically outperforms single emails:
- Emails 2-4 generate **50%+ of total recovery revenue**
- Most brands leave this money on the table

---

## The RECOVER Framework

Use this framework to structure each email:

```
R - REMIND them of what they left
E - EMPATHIZE with their hesitation
C - COUNTER objections proactively
O - OFFER compelling value
V - VALIDATE with social proof
E - ESTABLISH urgency (real)
R - REINFORCE the CTA
```

**Application by Email:**

| Email | Primary Focus | Secondary Focus |
|-------|--------------|-----------------|
| 1 | R (Remind) + E (Empathize) | C (Counter - support offer) |
| 2 | V (Validate) + C (Counter) | E (Empathize) |
| 3 | O (Offer) + E (Establish urgency) | V (Validate) |
| 4 | E (Establish final urgency) | R (Reinforce) |

---

## Workflow: Step-by-Step Execution

### Phase 1: Discovery & Analysis

#### Step 1.1: Gather Cart Information
```yaml
collect:
  - Product(s) in cart (name, price, image)
  - Cart total value
  - Abandonment point (cart page, checkout, payment)
  - Customer segment (new, returning, VIP)
  - Any available browsing history
```

#### Step 1.2: Identify Primary Objection
```yaml
abandonment_signals:
  cart_page:
    likely_objection: "Need more information or justification"
    copy_focus: "Benefits, education, value"

  checkout_page:
    likely_objection: "Price concern or comparison shopping"
    copy_focus: "Value justification, differentiation"

  shipping_section:
    likely_objection: "Shipping cost or time"
    copy_focus: "Free shipping, delivery speed"

  payment_page:
    likely_objection: "Trust/security or technical issue"
    copy_focus: "Security badges, support offer, alternative payment"

  after_coupon_field:
    likely_objection: "Looking for better deal"
    copy_focus: "Unique offer, value stacking"
```

#### Step 1.3: Segment the Customer
```yaml
segments:
  first_time:
    trust_level: "Low"
    messaging: "Build trust, emphasize guarantee"
    incentive_tolerance: "Higher discount acceptable"

  returning:
    trust_level: "Medium-High"
    messaging: "Leverage relationship, loyalty benefits"
    incentive_approach: "Points, exclusive access"

  vip_high_value:
    trust_level: "High"
    messaging: "Personal touch, white-glove service"
    incentive_approach: "Premium bonuses, early access"
```

#### Step 1.4: Define Incentive Strategy
```yaml
incentive_matrix:
  low_cart_new_customer:
    primary: "10-15% discount"
    alternative: "Free shipping"

  low_cart_returning:
    primary: "Loyalty points bonus"
    alternative: "Free gift"

  high_cart_new_customer:
    primary: "Free shipping + bonus"
    alternative: "Payment plan"

  high_cart_returning:
    primary: "Exclusive early access"
    alternative: "VIP upgrade"

  price_sensitive_exit:
    primary: "Payment plan option"
    alternative: "Smaller purchase suggestion"

  shipping_objection:
    primary: "Free shipping"
    alternative: "Free expedited upgrade"

rules:
  - "NO discount in Email 1 (preserve margins)"
  - "Introduce incentive in Email 3"
  - "Increase incentive slightly in Email 4 if needed"
  - "Never discount more than 20% (brand value)"
```

---

### Phase 2: Email Sequence Creation

#### Step 2.1: Define Timing Sequence

```yaml
standard_sequence:
  email_1: "30-60 minutes after abandonment"
  email_2: "24 hours after abandonment"
  email_3: "48-72 hours after abandonment"
  email_4: "5-7 days after abandonment"

high_ticket_adjustment:
  email_1: "1-2 hours after abandonment"
  email_2: "48 hours after abandonment"
  email_3: "5 days after abandonment"
  email_4: "10 days after abandonment"
  note: "More consultative, less pressure"

low_ticket_adjustment:
  email_1: "30 minutes after abandonment"
  email_2: "24 hours after abandonment"
  email_3: "48 hours after abandonment"
  email_4: "72 hours after abandonment"
  note: "More direct, faster cadence acceptable"
```

---

### EMAIL 1: THE GENTLE REMINDER

**Timing:** 30-60 minutes after abandonment
**Objective:** Capture high-intent buyers while intent is fresh
**Tone:** Helpful, non-pushy, service-oriented
**Incentive:** NONE (preserve margins, test intent)

#### Subject Line Options (A/B Test)

```yaml
question_pattern:
  - "Did something go wrong?"
  - "Forgot something?"
  - "Still interested in [Product]?"
  - "[Name], did we lose you?"

personalization_pattern:
  - "[Name], your cart is waiting"
  - "About your [Product]..."
  - "[Name], quick question"

curiosity_pattern:
  - "We noticed something..."
  - "Before you go..."
  - "One more thing about your order"
```

#### Copy Structure Template

```markdown
---
EMAIL 1: GENTLE REMINDER
Subject: [Choose from patterns above]
Preview Text: Your cart is saved and waiting
---

[OPENING - 1 sentence acknowledging their interest]

Options:
- "I noticed you were checking out [Product] but didn't finish your order."
- "Looks like you left something in your cart."
- "Hi [Name], did something interrupt your checkout?"

[PRODUCT BLOCK - Visual reminder]

[PRODUCT IMAGE]
[Product Name]
[Price]
[Key feature or benefit - 1 line]

[SUPPORT OFFER - Address friction possibility]

Options:
- "If you ran into any issues or have questions, just reply to this email—I'm here to help."
- "Having second thoughts? Happy to answer any questions."
- "Need help deciding? I'm just a reply away."

[PRIMARY CTA - Clear and direct]

→ Return to Your Cart
or
→ Complete Your Order

[SIGN-OFF - Personal touch]

Best,
[Name/Team]
[Brand]

[PS - Reassurance element]

P.S. Your cart is saved and waiting—no need to start over.
```

#### Example Email 1 (E-commerce)

```
Subject: Did something go wrong?

Hi Sarah,

I noticed you were checking out the Leather Weekender Bag but didn't finish your order.

[IMAGE: Leather Weekender Bag]
Leather Weekender Bag - $189
Free returns within 30 days

If something went wrong at checkout or you have questions, just reply to this email—I'm happy to help.

→ Return to Your Cart

Best,
Michael
Founder, [Brand]

P.S. Your cart is saved exactly as you left it.
```

#### Example Email 1 (Digital Product)

```
Subject: [Name], quick question about your enrollment

Hi [Name],

I saw you started enrolling in [Course Name] but didn't complete the checkout.

No worries—I just wanted to make sure nothing went wrong on our end.

If you have any questions about the course or ran into a technical issue, just reply to this email. I read every response personally.

→ Complete Your Enrollment

[Instructor Name]
Creator, [Course Name]

P.S. Your spot is reserved and the checkout remembers your info.
```

---

### EMAIL 2: THE VALUE BUILDER

**Timing:** 24 hours after abandonment
**Objective:** Address objections, reinforce value, build trust
**Tone:** Persuasive but helpful, evidence-based
**Incentive:** STILL NONE (focus on value, not discount)

#### Subject Line Options

```yaml
social_proof_pattern:
  - "Why 50,000+ customers love [Product]"
  - "Here's what others are saying about [Product]"
  - "[Product] has 4.8 stars—here's why"

value_pattern:
  - "Before you decide about [Product]..."
  - "One thing I didn't mention about [Product]"
  - "What makes [Product] different"

question_pattern:
  - "Still thinking about [Product]?"
  - "Any questions about your order?"
  - "Need more info about [Product]?"
```

#### Copy Structure Template

```markdown
---
EMAIL 2: VALUE BUILDER
Subject: [Choose from patterns above]
Preview Text: Here's why [Product] is worth it
---

[OPENING - Acknowledge they're deciding]

Options:
- "Still on the fence about [Product]? I get it—it's a decision worth thinking through."
- "Taking your time with [Product]? Smart."
- "I know [Product] isn't a small purchase. Let me share why it's worth it."

[BENEFIT REINFORCEMENT - 3 specific benefits]

Here's why our customers love it:

✓ [Benefit 1 - specific, measurable result]
✓ [Benefit 2 - specific, measurable result]
✓ [Benefit 3 - specific, measurable result]

[SOCIAL PROOF BLOCK - Testimonial or stats]

Don't just take my word for it:

"[Testimonial quote - specific result]"
— [Customer Name], [Location or Role]

or

★★★★★ 4.8/5 from 2,340 reviews

[OBJECTION HANDLER - Address main concern]

Options (choose based on segment):

Trust concern:
"And remember: You're covered by our [X]-day money-back guarantee. If it's not right for you, we'll refund every penny—no questions asked."

Price concern:
"When you break it down, that's less than [$/day] for [benefit duration]. And it pays for itself when you [outcome]."

Quality concern:
"We've spent [X years] perfecting [Product]. Every [component] is [quality detail]."

[CTA - Value-focused]

→ Complete Your Order

or

→ See Why Customers Love [Product]

[SIGN-OFF]

[Name/Team]

[PS - Secondary proof point]

P.S. [Additional proof point or benefit not mentioned above]
```

#### Example Email 2 (E-commerce)

```
Subject: Before you decide about the Weekender Bag...

Hi Sarah,

Still thinking about the Leather Weekender Bag? I get it—it's a decision worth taking your time on.

Here's why our customers love it:

✓ Full-grain leather that gets better with age (no peeling or cracking)
✓ Fits perfectly in overhead bins (tested on 12 airlines)
✓ Lifetime warranty—we'll repair or replace, forever

Don't just take my word for it:

"I've had my Weekender for 3 years and it still looks brand new. Actually, better—the leather has this beautiful patina now. Worth every penny."
— James T., Chicago

★★★★★ 4.9/5 from 1,247 reviews

And remember: If you don't absolutely love it, return it within 60 days for a full refund. We'll even cover return shipping.

→ Complete Your Order

Best,
Michael

P.S. Every bag is hand-inspected before shipping. We're pretty obsessive about quality.
```

#### Example Email 2 (Digital Product)

```
Subject: Why 12,000+ students chose [Course Name]

Hi [Name],

Still thinking about [Course Name]? Let me share what makes it different.

What you'll get:

✓ [Specific outcome 1] (not theory—actual results)
✓ [Specific outcome 2] (templates included)
✓ [Specific outcome 3] (lifetime access)

Here's what [Student Name] said after completing the course:

"I was skeptical at first, but I implemented [specific lesson] and saw [specific result] within [timeframe]. The ROI was instant."
— [Student Name], [Role/Company]

And you're protected by my "Actually Works" guarantee: If you complete the course, implement the strategies, and don't see results within 90 days, I'll refund 100% of your investment. No fine print.

→ Enroll Now

[Instructor Name]

P.S. The course includes [bonus] that's worth [value] alone. I added it because [reason].
```

---

### EMAIL 3: THE INCENTIVE OFFER

**Timing:** 48-72 hours after abandonment
**Objective:** Overcome price objection, create urgency
**Tone:** Direct, urgent but not desperate
**Incentive:** YES—introduce discount, free shipping, or bonus

#### Subject Line Options

```yaml
discount_pattern:
  - "[X]% off expires in 48 hours"
  - "Your exclusive discount inside"
  - "A thank you for considering us: [X]% off"

free_shipping_pattern:
  - "Free shipping on your order (ends tomorrow)"
  - "Your cart qualifies for free shipping"
  - "We'll cover shipping—just this once"

bonus_pattern:
  - "I added something to your cart"
  - "Free [bonus] with your order"
  - "Special bonus for you"

deadline_pattern:
  - "48 hours left: [Offer]"
  - "Your offer expires tomorrow"
  - "Last day for [incentive]"
```

#### Copy Structure Template

```markdown
---
EMAIL 3: INCENTIVE OFFER
Subject: [Choose from patterns above]
Preview Text: [Specific offer] expires [timeframe]
---

[OPENING - Acknowledge time passed, transition to offer]

Options:
- "You've been thinking about [Product] for a few days now, so I wanted to make the decision easier."
- "I don't do this often, but I wanted to offer you something special."
- "Still on the fence? Let me help."

[OFFER BLOCK - Clear and prominent]

Use code [CODE] for [X]% off your order.

or

I'm covering shipping on your order—no code needed.

or

I added [Bonus] to your cart (normally [value]).

[PRODUCT + SAVINGS - Visual with price comparison]

[PRODUCT IMAGE]
[Product Name]
Was: [Original Price]
Now: [Discounted Price] with code [CODE]
You save: [Amount]

[DEADLINE - Specific and real]

This code expires [specific time] on [specific date].

or

This offer is only valid for the next 48 hours.

[CTA - Offer-focused]

→ Claim Your [X]% Off
→ Get Free Shipping
→ Claim Your Bonus

[SIGN-OFF]

[Name/Team]

[PS - Urgency reinforcement]

P.S. This code is one-time use and expires [time]. After that, it's gone.
```

#### Example Email 3 (E-commerce)

```
Subject: 15% off your Weekender Bag (expires tomorrow)

Hi Sarah,

You've been thinking about the Leather Weekender Bag for a few days, so I wanted to make the decision easier.

Use code COMEBACK15 for 15% off your order.

[IMAGE: Leather Weekender Bag]
Leather Weekender Bag
Was: $189
Now: [PREÇO_COM_DESCONTO] with code COMEBACK15
You save: [ECONOMIA_TOTAL]

This code expires tomorrow (Friday) at midnight EST.

→ Claim Your 15% Off

Michael

P.S. This is a one-time code just for you. Once it expires, I can't extend it.
```

#### Example Email 3 (Digital Product)

```
Subject: I'm reducing the investment for you

Hi [Name],

You've been considering [Course Name], and I want to make this easier.

For the next 48 hours, use code READY100 to take $100 off your enrollment.

[Course Name]
Was: $497
Now: $397 with code READY100
You save: $100

Plus, you still get:
- Lifetime access to all materials
- [Bonus 1]
- [Bonus 2]
- 90-day money-back guarantee

This code expires Friday at 11:59 PM.

→ Enroll at the Reduced Price

[Instructor Name]

P.S. I rarely discount my courses. This is a one-time offer that won't be repeated.
```

---

### EMAIL 4: THE LAST CHANCE

**Timing:** 5-7 days after abandonment
**Objective:** Final conversion attempt with graceful exit
**Tone:** Direct, short, respectful
**Incentive:** Maintain or slightly increase previous offer

#### Subject Line Options

```yaml
final_pattern:
  - "Last call for your cart"
  - "Final reminder: [Product]"
  - "Closing the loop on your order"

question_pattern:
  - "Should I remove your items?"
  - "Should we let this go?"
  - "One last question"

deadline_pattern:
  - "Offer ends tonight"
  - "Your discount expires in [X] hours"
  - "Last chance for [X]% off"
```

#### Copy Structure Template

```markdown
---
EMAIL 4: LAST CHANCE
Subject: [Choose from patterns above]
Preview Text: This is my final email about your cart
---

[OPENING - Acknowledge this is final]

Options:
- "This is my last email about your cart."
- "I promised I wouldn't keep emailing, so this is it."
- "Final note about [Product]."

[OFFER REMINDER - Brief]

Your [Product] is still available, and the [X]% off / free shipping / bonus still works.

or

The code [CODE] is still active—but not for long.

[CTA - Simple and direct]

If you want it:
→ Complete Your Order

[GRACEFUL EXIT - Respect their decision]

If not, no hard feelings. Just hit reply and let me know—I'll stop sending reminders.

or

If [Product] isn't right for you, that's okay. Just let me know and I'll close your cart.

[SIGN-OFF - Brief]

Thanks for considering us.

[Name/Team]
```

#### Example Email 4 (E-commerce)

```
Subject: Should I remove your Weekender Bag?

Hi Sarah,

This is my last email about your cart.

Your Leather Weekender Bag is still waiting, and the 15% off code (COMEBACK15) still works—but it expires tonight at midnight.

If you want it:
→ Complete Your Order

If not, no worries. Just reply "remove" and I'll close your cart and stop the reminders.

Thanks for considering us either way.

Michael
```

#### Example Email 4 (Digital Product)

```
Subject: Closing your enrollment window

Hi [Name],

Final note about [Course Name].

Your $100 discount is still active, but I'm closing this enrollment window tonight.

If you're in:
→ Enroll Now

If not, totally understand. Just let me know and I'll remove you from this sequence.

Either way, thanks for your interest.

[Instructor Name]
```

---

### Phase 3: Optimization & Testing

#### Step 3.1: Subject Line A/B Tests

```yaml
test_priority:
  1: "Personalized name vs. no name"
  2: "Question vs. statement"
  3: "Product name vs. generic"
  4: "Urgency vs. curiosity"
  5: "Emoji vs. no emoji"

test_methodology:
  - "Minimum 1,000 recipients per variant"
  - "24-48 hour test duration"
  - "Statistical significance: 95%"
  - "Primary metric: Open rate"
  - "Secondary metric: Click rate"
```

#### Step 3.2: Timing Tests

```yaml
email_1_timing:
  variants:
    - "30 minutes"
    - "1 hour"
    - "4 hours"
  measure: "Conversion rate per email"

sequence_spacing:
  variants:
    - "Standard: 1h / 24h / 72h / 7d"
    - "Aggressive: 1h / 12h / 48h / 5d"
    - "Conservative: 2h / 48h / 5d / 10d"
  measure: "Total sequence conversion rate"
```

#### Step 3.3: Incentive Tests

```yaml
discount_tests:
  variants:
    - "10% off"
    - "15% off"
    - "Free shipping"
    - "$X flat discount"
  measure: "Revenue per email (not just conversion rate)"

timing_tests:
  variants:
    - "Introduce in Email 2"
    - "Introduce in Email 3"
    - "Introduce in Email 4"
  measure: "Margin preservation vs. recovery rate"
```

---

## Quality Checklist

### Pre-Launch Validation

```yaml
technical:
  - [ ] Cart links restore items correctly
  - [ ] Cart links work across devices
  - [ ] Discount codes are valid and tested
  - [ ] Product images load properly
  - [ ] Unsubscribe link works
  - [ ] Preview text displays correctly
  - [ ] Mobile rendering is correct

copy:
  - [ ] All personalization fields have fallbacks
  - [ ] No placeholder text remaining
  - [ ] Tone is consistent across sequence
  - [ ] CTAs are clear and action-oriented
  - [ ] Deadlines are accurate
  - [ ] Legal disclaimers included if needed

strategy:
  - [ ] Email 1 has NO discount
  - [ ] Social proof is credible and real
  - [ ] Urgency/scarcity is truthful
  - [ ] Sequence has opt-out option
  - [ ] Incentive matches segment value
```

### Per-Email Quality Gate

```yaml
email_checklist:
  - [ ] Subject line under 50 characters
  - [ ] Preview text under 100 characters
  - [ ] Product image included
  - [ ] Single clear CTA
  - [ ] Mobile-optimized layout
  - [ ] Personalization working
  - [ ] Sender name is human (not "noreply")
```

---

## Output Format

```yaml
deliverables:
  - email_1:
      subject_lines: "3 variations for A/B testing"
      preview_text: "1 version"
      body_copy: "Complete email with placeholders marked"
      cta: "Button text"

  - email_2:
      subject_lines: "3 variations"
      preview_text: "1 version"
      body_copy: "Complete email"
      cta: "Button text"

  - email_3:
      subject_lines: "3 variations"
      preview_text: "1 version"
      body_copy: "Complete email"
      cta: "Button text"
      discount_code: "If applicable"

  - email_4:
      subject_lines: "3 variations"
      preview_text: "1 version"
      body_copy: "Complete email"
      cta: "Button text"

  - timing_recommendations:
      email_1_timing: "Specific timing"
      email_2_timing: "Specific timing"
      email_3_timing: "Specific timing"
      email_4_timing: "Specific timing"

  - testing_plan:
      subject_line_tests: "What to test first"
      timing_tests: "What to test second"
      incentive_tests: "What to test third"
```

---

## Copywriter Recommendations

| Scenario | Recommended Copywriter | Why |
|----------|----------------------|-----|
| Urgency-focused recovery | @dan-kennedy | Master of deadline-driven copy |
| Friendly, casual brand | @frank-kern | Authentic, conversational |
| Value/ROI focus | @alex-hormozi (archived) | Value vs. price psychology |
| Heavy social proof | @gary-bencivenga | Credibility expertise |
| Premium/luxury brand | @david-ogilvy | Sophisticated tone |
| Emotional connection | @gary-halbert | Personal, direct |

---

## Integration with Other Tasks

### Pre-Sequence Tasks
- `avatar-research.md` - Understand why your audience abandons
- `evaluate-offer.md` - Ensure your offer is compelling before recovery
- `create-offer.md` - Build a better offer if recovery is consistently low

### Post-Sequence Tasks
- `audit-landing-page.md` - If abandonment happens on page, fix the page
- `create-email-sequence.md` - Nurture recovered customers
- `build-authority-arsenal.md` - Strengthen social proof for Email 2

---

## Performance Benchmarks

```yaml
good_performance:
  recovery_rate: "5-10%"
  revenue_per_email: "$2-4"
  open_rate: "40-50%"
  click_rate: "10-15%"

excellent_performance:
  recovery_rate: "10-15%"
  revenue_per_email: "$5-8"
  open_rate: "50-60%"
  click_rate: "15-20%"

outstanding_performance:
  recovery_rate: "15%+"
  revenue_per_email: "$8+"
  open_rate: "60%+"
  click_rate: "20%+"

email_contribution:
  email_1: "40-50% of total recovery"
  email_2: "25-35% of total recovery"
  email_3: "15-20% of total recovery"
  email_4: "5-10% of total recovery"
```

---

## Common Mistakes to Avoid

### Messaging Mistakes
```yaml
avoid:
  - "Generic 'you forgot something' without context"
  - "Desperate, needy tone"
  - "Only pushing sale, no value"
  - "Ignoring the actual objection"
  - "Fake scarcity ('only 2 left!' when unlimited)"

do_instead:
  - "Personalize with product and context"
  - "Service-oriented, helpful tone"
  - "Address objections, provide value"
  - "Use real scarcity only"
```

### Timing Mistakes
```yaml
avoid:
  - "Single email only (leaves 50%+ revenue)"
  - "Multiple emails same day"
  - "First email 24+ hours after abandonment"
  - "Back-to-back emails (feels spammy)"

do_instead:
  - "4-email sequence minimum"
  - "Proper spacing (hours, then days)"
  - "First email within 1 hour"
  - "24-48 hour minimum between emails 2-4"
```

### Strategic Mistakes
```yaml
avoid:
  - "Discounting in Email 1"
  - "Same message to all segments"
  - "Ignoring mobile experience"
  - "No A/B testing"
  - "No graceful exit option"

do_instead:
  - "Save incentives for Email 3+"
  - "Segment by customer type and cart value"
  - "Mobile-first design"
  - "Test everything systematically"
  - "Always offer opt-out path"
```

---

## Advanced Tactics

### Multi-Channel Recovery
```yaml
email_plus_sms:
  email_1: "1 hour - Reminder"
  sms_1: "4 hours - 'Still interested? [link]'"
  email_2: "24 hours - Value + proof"
  email_3: "48 hours - Incentive"
  sms_2: "72 hours - 'Last chance: [code]'"
  email_4: "7 days - Final"

compliance:
  - "US SMS requires explicit opt-in"
  - "Max 1 SMS per 48 hours"
  - "Include opt-out in every SMS"
```

### Dynamic Content Personalization
```yaml
dynamic_blocks:
  - "Customer first name"
  - "Product name and image"
  - "Cart value"
  - "Personalized discount code"
  - "Location-based shipping estimate"
  - "Browsing history recommendations"
```

### Behavioral Triggers
```yaml
advanced_triggers:
  price_drop_on_carted_item:
    message: "Good news! [Product] is now [new price]"
    timing: "Immediate when price drops"

  back_in_stock:
    message: "[Product] is back in stock!"
    timing: "Immediate when restocked"

  low_stock_warning:
    message: "Only [X] left in your size"
    timing: "When inventory drops below threshold"
```

---

## Research Foundation

This task is based on comprehensive research documented in:
`docs/research/abandoned-cart-methodology-research.md`

### Primary Sources
- Klaviyo - "Abandoned Cart Email Best Practices" (2025)
- Rejoiner - "Abandoned Cart Email Timing" + "High-Converting Flows" (2025)
- 624 Agency - "Ecommerce Email Marketing 101" (2025)
- Invesp CRO - "Psychological Principles for Cart Recovery" (2020)
- Baymard Institute - Cart Abandonment Statistics (2024)

### Theoretical Foundations
- Robert Cialdini - "Influence: The Psychology of Persuasion"
- Kahneman & Tversky - Loss Aversion Research
- Dan Kennedy - "No B.S. Direct Marketing" + 3-Letter Sequence

---

*Task Version: 2.0.0*
*Last Updated: 2026-01-23*
*Primary Framework: Dan Kennedy 3-Letter Sequence + Cialdini 6 Principles*
*Minimum Output: 4-email sequence with A/B test variations*
