---
task: Map 6 Primary Motives - Collier Method
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

# Map 6 Primary Motives - Collier Method

## Purpose

Identify which of the 6 Primary Motives drives your prospect's buying decision. This is the SECOND STEP in the Collier method, after analyzing the mental conversation.

## When to Use

- **After** analyze-mental-conversation.md
- Before writing any persuasive content
- When unclear which emotional driver dominates
- To prioritize appeal angles in copy
- When copy needs stronger emotional resonance

## Collier's 6 Primary Motives

```
THE 6 MOTIVES THAT DRIVE ALL HUMAN ACTION

Robert Collier identified that EVERY purchase, every decision,
every action humans take is driven by ONE of these 6 motives:

1. LOVE (for others)
2. GAIN (wealth, advantage)
3. DUTY (obligation, responsibility)
4. PRIDE (status, recognition)
5. SELF-INDULGENCE (pleasure, comfort)
6. SELF-PRESERVATION (safety, survival)

Your copy MUST appeal to the DOMINANT motive.
Secondary motives can strengthen, but ONE must lead.
```

## Inputs

```yaml
required:
  - target_audience: Who you're writing to
  - product_service: What you're selling
  - mental_conversation: Output from analyze-mental-conversation.md

optional:
  - customer_research: Interview notes, surveys, reviews
  - purchase_triggers: What made past customers buy
  - competitor_appeals: What motives competitors target
```

## Workflow

### Step 1: Understand Each Motive

```
MOTIVE 1: LOVE (For Others)
═══════════════════════════════════════════════════════════════

Definition: The desire to protect, provide for, or please
those we care about (family, children, spouse, friends)

Key Emotions:
□ Parental instinct
□ Romantic devotion
□ Familial obligation
□ Friendship loyalty
□ Generational responsibility

Typical Products:
□ Insurance ("Protect your family")
□ Education ("Give your children the best")
□ Health products ("Be there for them")
□ Home security ("Keep your loved ones safe")
□ Financial planning ("Secure their future")

Recognition Signals in Research:
□ "I want this for my kids"
□ "My spouse would love it"
□ "I need to provide for my family"
□ "I want to leave something behind"

Appeal Language:
□ "Your family deserves..."
□ "Give your children..."
□ "Protect those who depend on you..."
□ "Be the parent/partner you want to be..."

STRENGTH: Most powerful for family-related purchases
WEAKNESS: Can feel manipulative if forced
```

```
MOTIVE 2: GAIN (Wealth & Advantage)
═══════════════════════════════════════════════════════════════

Definition: The desire to acquire money, possessions,
advantages, or anything that increases one's position

Key Emotions:
□ Ambition
□ Greed (ethical: aspiration)
□ Competitiveness
□ Desire for advantage
□ Accumulation drive

Typical Products:
□ Business opportunities ("Make more money")
□ Investment products ("Grow your wealth")
□ Productivity tools ("Get ahead faster")
□ Professional training ("Earn more")
□ Real estate ("Build your portfolio")

Recognition Signals in Research:
□ "What's the ROI?"
□ "How will this help me earn more?"
□ "I want financial freedom"
□ "I need to get ahead"

Appeal Language:
□ "Earn an extra $___/month..."
□ "The secret to financial freedom..."
□ "Get the unfair advantage..."
□ "Double your income in..."

STRENGTH: Highly effective for B2B and opportunity offers
WEAKNESS: Can attract tire-kickers if overused
```

```
MOTIVE 3: DUTY (Obligation & Responsibility)
═══════════════════════════════════════════════════════════════

Definition: The desire to fulfill obligations, meet
responsibilities, and do what's expected or right

Key Emotions:
□ Sense of responsibility
□ Honor and integrity
□ Moral obligation
□ Professional duty
□ Social responsibility

Typical Products:
□ Professional certifications ("Stay current")
□ Compliance tools ("Meet requirements")
□ Insurance ("Responsible protection")
□ Estate planning ("Fulfill your obligations")
□ Environmental products ("Do your part")

Recognition Signals in Research:
□ "I should probably do this"
□ "It's the responsible thing"
□ "I have an obligation to..."
□ "What's expected of someone in my position?"

Appeal Language:
□ "As a [role], you have a responsibility to..."
□ "Meet your professional obligations..."
□ "The responsible choice is..."
□ "Don't let others down by..."

STRENGTH: Effective for professional/compliance products
WEAKNESS: Can feel like pressure if too heavy
```

```
MOTIVE 4: PRIDE (Status & Recognition)
═══════════════════════════════════════════════════════════════

Definition: The desire for recognition, respect, status,
and to be admired or envied by others

Key Emotions:
□ Need for recognition
□ Desire for status
□ Competitive comparison
□ Achievement drive
□ Social positioning

Typical Products:
□ Luxury goods ("You deserve the best")
□ Premium services ("For discerning buyers")
□ Awards and certifications ("Stand out")
□ Exclusive memberships ("Join the elite")
□ Status symbols ("Show your success")

Recognition Signals in Research:
□ "I want to be seen as..."
□ "What will others think?"
□ "I deserve better than..."
□ "I want to stand out"

Appeal Language:
□ "Join the select few who..."
□ "Be recognized as..."
□ "You've earned the right to..."
□ "Let others see your success..."

STRENGTH: Powerful for premium/luxury positioning
WEAKNESS: Can backfire if audience values humility
```

```
MOTIVE 5: SELF-INDULGENCE (Pleasure & Comfort)
═══════════════════════════════════════════════════════════════

Definition: The desire for pleasure, comfort, enjoyment,
and personal gratification

Key Emotions:
□ Pleasure-seeking
□ Comfort desire
□ Relaxation need
□ Entertainment craving
□ Sensory enjoyment

Typical Products:
□ Vacations ("Pamper yourself")
□ Comfort products ("You deserve comfort")
□ Entertainment ("Enjoy life more")
□ Food and beverages ("Indulge your taste")
□ Spa and wellness ("Treat yourself")

Recognition Signals in Research:
□ "I just want to enjoy myself"
□ "Life is too short not to..."
□ "I deserve a treat"
□ "I want to feel good"

Appeal Language:
□ "Treat yourself to..."
□ "You deserve..."
□ "Indulge in..."
□ "Experience the pleasure of..."

STRENGTH: Effective for B2C, lifestyle products
WEAKNESS: Can trigger guilt in some audiences
```

```
MOTIVE 6: SELF-PRESERVATION (Safety & Survival)
═══════════════════════════════════════════════════════════════

Definition: The desire to protect oneself from harm,
danger, loss, or any threat to wellbeing

Key Emotions:
□ Fear of loss
□ Security need
□ Risk aversion
□ Health concerns
□ Survival instinct

Typical Products:
□ Security products ("Protect yourself")
□ Health products ("Safeguard your health")
□ Insurance ("Guard against loss")
□ Safety equipment ("Stay safe")
□ Legal protection ("Protect your assets")

Recognition Signals in Research:
□ "I'm worried about..."
□ "What if something goes wrong?"
□ "I need to protect myself"
□ "I can't afford to lose..."

Appeal Language:
□ "Protect yourself from..."
□ "Don't let [threat] destroy..."
□ "Safeguard your..."
□ "Before it's too late..."

STRENGTH: Most primal, works when threat is real
WEAKNESS: Fear appeals can paralyze instead of motivate
```

### Step 2: Analyze Your Prospect

```
MOTIVE IDENTIFICATION QUESTIONS

For each motive, rate 1-10 based on your research:

LOVE (For Others)
□ Are they buying for someone else's benefit?
□ Do they mention family/loved ones in their concerns?
□ Is the purchase meant to protect or provide for others?
Rating: ___/10

GAIN (Wealth & Advantage)
□ Are they focused on financial outcomes?
□ Do they ask about ROI, earnings, or advantages?
□ Is the purchase meant to increase their position?
Rating: ___/10

DUTY (Obligation & Responsibility)
□ Are they buying out of obligation?
□ Do they mention "should" or "supposed to"?
□ Is the purchase expected of someone in their role?
Rating: ___/10

PRIDE (Status & Recognition)
□ Are they concerned with how they'll be perceived?
□ Do they care about brand names or prestige?
□ Is the purchase meant to elevate their status?
Rating: ___/10

SELF-INDULGENCE (Pleasure & Comfort)
□ Are they seeking personal enjoyment?
□ Do they use words like "treat" or "deserve"?
□ Is the purchase meant for their own pleasure?
Rating: ___/10

SELF-PRESERVATION (Safety & Survival)
□ Are they motivated by fear or worry?
□ Do they mention threats or dangers?
□ Is the purchase meant to protect themselves?
Rating: ___/10
```

### Step 3: Determine the Hierarchy

```
MOTIVE PRIORITIZATION MATRIX

List your ratings from Step 2:

1. ____________: ___/10 → PRIMARY MOTIVE
2. ____________: ___/10 → SECONDARY MOTIVE
3. ____________: ___/10 → SUPPORTING MOTIVE
4. ____________: ___/10
5. ____________: ___/10
6. ____________: ___/10

DOMINANT MOTIVE: ________________

MOTIVE COMBINATION:
Primary (70%): _____________
Secondary (20%): ___________
Supporting (10%): __________
```

### Step 4: Validate Against Product

```
PRODUCT-MOTIVE FIT ANALYSIS

Your Product: ________________
Dominant Motive Identified: ________________

FIT CHECK:
□ Does your product naturally solve a problem
  related to this motive?
□ Can you make genuine claims supporting this motive?
□ Do your best customers buy for this reason?
□ Does competitor research show this motive works?

If NO to any:
→ Re-examine your motive hierarchy
→ Consider if secondary motive has better fit
→ Adjust copy angle to match genuine fit

WARNING: Forcing a motive that doesn't fit creates
inauthentic copy that fails to convert.
```

### Step 5: Build Your Appeal Strategy

```
APPEAL STRATEGY DOCUMENT

PRIMARY MOTIVE: ________________

CORE APPEAL (use throughout copy):
"[Product] helps you _________________ [motive-driven benefit]"

EMOTIONAL HOOK (for headlines/openings):
"_________________ [motive-triggering statement]"

PROOF POINTS (supporting the motive):
1. _________________ [fact/statistic]
2. _________________ [testimonial angle]
3. _________________ [demonstration]

SECONDARY MOTIVE: ________________

SUPPORTING APPEAL (use to reinforce):
"And as a bonus, you'll also _________________ [secondary benefit]"

MOTIVE BRIDGE:
How does primary motive connect to secondary?
"Not only will you [primary], but you'll also [secondary]"
```

## Output Format

```yaml
motive_analysis:
  audience: [Target audience]
  product: [Product/service]
  analysis_date: [Date]

  motive_ratings:
    love: [1-10]
    gain: [1-10]
    duty: [1-10]
    pride: [1-10]
    self_indulgence: [1-10]
    self_preservation: [1-10]

  motive_hierarchy:
    primary:
      motive: [Name]
      rating: [Score]
      weight: "70%"
    secondary:
      motive: [Name]
      rating: [Score]
      weight: "20%"
    supporting:
      motive: [Name]
      rating: [Score]
      weight: "10%"

  appeal_strategy:
    core_appeal: "[Statement]"
    emotional_hook: "[Statement]"
    proof_angles:
      - "[Proof 1]"
      - "[Proof 2]"
      - "[Proof 3]"

  validation:
    product_fit: [true/false]
    authentic_claims: [true/false]
    customer_evidence: [true/false]

  combined_appeal: |
    [2-3 sentence appeal combining primary and secondary motives]
```

## Example Analysis

```
EXAMPLE: Selling life insurance to a 35-year-old father

MOTIVE RATINGS:
- Love: 9/10 (primary concern is family)
- Self-Preservation: 7/10 (worried about what happens)
- Duty: 6/10 (feels responsible)
- Gain: 3/10 (not about wealth)
- Pride: 2/10 (not status-driven)
- Self-Indulgence: 1/10 (not for pleasure)

HIERARCHY:
- Primary (70%): LOVE
- Secondary (20%): SELF-PRESERVATION
- Supporting (10%): DUTY

APPEAL STRATEGY:
Core: "Protect your family's future even when you can't be there"
Hook: "What would happen to your family if something happened to you?"
Proof: "97% of widows say they wish their spouse had more coverage"

COMBINED APPEAL:
"You work hard every day to provide for your family. But what
happens to them if something happens to you? [Brand] life insurance
ensures your loved ones are protected, giving you peace of mind
that your family will be taken care of—no matter what."
```

## Common Motive Combinations

```
MOTIVE PAIRING PATTERNS

LOVE + SELF-PRESERVATION
→ "Protect your family from [threat]"
→ Common for: Insurance, security, health products for family

GAIN + PRIDE
→ "Achieve success others will admire"
→ Common for: Business opportunities, luxury goods, career advancement

DUTY + LOVE
→ "Be the provider your family deserves"
→ Common for: Financial planning, education savings, estate planning

SELF-INDULGENCE + PRIDE
→ "Reward yourself with the best"
→ Common for: Luxury experiences, premium products, exclusive services

SELF-PRESERVATION + GAIN
→ "Protect and grow your wealth"
→ Common for: Investment protection, insurance with returns, secure assets

DUTY + PRIDE
→ "Be recognized for doing what's right"
→ Common for: Professional certifications, compliance, awards
```

## Motive-Specific Copy Templates

```
LOVE TEMPLATE:
"Your [family member] depends on you. They trust you to
[relevant action]. With [product], you can [benefit] and
know that [loved one] will always be [outcome]."

GAIN TEMPLATE:
"What if you could [financial benefit]? [Product] has helped
[number] people [achieve gain]. Now it's your turn to
[get advantage] and finally [financial goal]."

DUTY TEMPLATE:
"As a [role], you're expected to [responsibility]. [Product]
makes it easy to [fulfill obligation] so you can [outcome]
with confidence and professionalism."

PRIDE TEMPLATE:
"You've worked hard to get where you are. You deserve [product]
that reflects your success. Join the [exclusive group] who
demand—and get—the very best."

SELF-INDULGENCE TEMPLATE:
"You deserve this. After [sacrifice/hard work], it's time to
[indulge]. [Product] gives you the [pleasure/comfort] you've
earned. Treat yourself to [benefit]."

SELF-PRESERVATION TEMPLATE:
"[Threat] is real. Every day, [scary statistic]. Don't wait
until it's too late. [Product] protects you from [danger]
so you can [live without fear]."
```

## Warning Signs

```
MOTIVE MISMATCH RED FLAGS:

□ Copy feels forced or inauthentic
  → You're appealing to wrong motive

□ Features don't support emotional claims
  → Product doesn't fit the motive

□ Testimonials don't mention the motive
  → Customers buy for different reasons

□ Competitors succeed with different motive
  → Market responds to something else

□ You can't find research supporting the motive
  → You're projecting, not discovering
```

## Integration

- **Precedes**: All copy writing tasks
- **Follows**: analyze-mental-conversation.md
- **Informs**: Hook creation, headline writing, body copy
- **Uses**: Mental conversation analysis, customer research
- **Next step**: Start writing copy with clear motive focus
- **Agent**: @robert-collier (Tier 0 - Conversation Master)
