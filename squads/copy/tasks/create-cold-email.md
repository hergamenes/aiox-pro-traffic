---
task: Create Cold Email Task
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

# Create Cold Email Task

## Task Metadata

```yaml
id: create-cold-email
version: 2.0.0
category: sales
tier_recommendation: 2
primary_frameworks:
  - BASHO Method (Hyper-Personalization)
  - Alex Berman (Cold Email Manifesto)
  - REPLY Method
  - Lemlist (Scale Personalization)
min_output_lines: 600
research_source: docs/research/cold-email-methodology-research.md
```

---

## Purpose

Create high-response B2B cold emails that break through inbox noise and generate qualified sales conversations. This task implements methodologies from practitioners who have generated $100M+ in revenue through cold outreach.

**Key Principle:** "88% of people are more likely to reply if the email was specifically written for them" (BASHO Method). Every cold email must feel like it could ONLY have been sent to that one person.

---

## When to Use This Task

### High-Value Use Cases

- B2B lead generation and prospecting
- Outreach for partnerships and collaborations
- Meeting/demo scheduling with decision makers
- Contacting influencers and creators
- Strategic networking
- Account-based marketing (ABM) campaigns
- Sales development representative (SDR) outreach
- Founder-led sales

### Ideal Scenarios

| Scenario | Recommended Approach |
|----------|---------------------|
| Enterprise sales ($50K+ deals) | Full BASHO method, deep personalization |
| SMB outreach (high volume) | Framework + personalization layers |
| Partnership outreach | Mutual value focus |
| Investor outreach | Trigger-based, achievement focus |
| Recruiting/hiring | Role-specific personalization |
| PR/media outreach | Content-based hooks |

---

## Industry Statistics (2025-2026)

### Benchmarks to Target

```
OPEN RATES:
- Average B2B: 39%
- Good: 40-50%
- Excellent: 50-60%
- Elite: 60%+

REPLY RATES:
- Average: 1-5%
- Good: 5-10%
- Great: 10-20%
- Exceptional: 20%+

MEETING/BOOKING RATES:
- Average: 1-3%
- BASHO-level: 8-15%
- Top performers: 15-25%
```

### Data-Driven Insights

```
SUBJECT LINE LENGTH:
- Under 40 characters = 37% higher open rates
- Adding +13 words = 25% drop in opens

EMAIL LENGTH:
- ~120 words = 50%+ booking rates
- Over 200 words = significant drop-off

PERSONALIZATION IMPACT:
- First name only: +22% open rate
- Deep personalization: +50% open rate
- Mentioning prospect 6-10 times: 15% booking rate

FOLLOW-UP CRITICAL:
- 48% of salespeople never follow up
- 55% of replies come from follow-up emails
- 80% of sales require 5+ touchpoints
```

---

## Foundational Frameworks

### Framework 1: BASHO Method (Hyper-Personalization)

The BASHO method achieves 88% higher response rates through deep personalization.

```
BASHO REQUIREMENTS:

1. RESEARCH INVESTMENT
   - Minimum 15 minutes per prospect
   - Find 3+ unique data points
   - Identify "only them" angle

2. PERSONALIZATION LEVELS
   Level 1: Name + Company (baseline - NOT enough)
   Level 2: Role + Industry challenges (better)
   Level 3: Specific content they created (good)
   Level 4: Unique insight about their situation (BASHO level)

3. RELEVANCE CONNECTION
   - Why reaching out NOW
   - Why reaching out to THEM
   - Why this matters to THEIR situation

4. BREVITY
   - Under 100 words ideal
   - Every word earns its place
   - Zero fluff or filler
```

### Framework 2: Alex Berman's REPLY Method

From the Cold Email Manifesto ($100M+ generated):

```
R - RESEARCH
    Deep research before writing any word
    10-15 minutes minimum per prospect

E - EMPATHY
    Show you understand their world
    Reference their challenges specifically

P - PERSONALIZATION
    Make it specific to them
    Not just {first_name} - genuine relevance

L - LEAD WITH VALUE
    Give before you ask
    What can you offer them?

Y - YES MOMENTUM
    Easy first yes (just a reply)
    Low-friction CTA
```

### Framework 3: Copywriting Structures

**AIDA (Adapted for Cold Email)**
```
A - ATTENTION (Subject + First Line)
    Hook that's relevant to THEM
    "Noticed [Competitor] just launched [X]..."

I - INTEREST (Second Paragraph)
    Problem they likely have
    "Most [role]s in [industry] struggle with..."

D - DESIRE (Third Paragraph)
    Your solution + proof
    "We helped [similar company] achieve [result]."

A - ACTION (Last Line)
    Clear, simple CTA
    "Worth 15 minutes to see if relevant?"
```

**PAS (Problem-Agitate-Solve)**
```
P - PROBLEM
    "Are you dealing with [specific problem]?"

A - AGITATE
    "This usually means [negative consequence]
     and leads to [bigger problem]..."

S - SOLVE
    "We've helped [X] companies fix this.
     [Brief how]. Worth a quick chat?"
```

**QVC (Question-Value-CTA)**
```
Q - QUESTION
    Engaging question about their situation
    "How is [Company] handling [challenge]?"

V - VALUE
    What you offer in response
    "We help [type of companies] with [solution]
     that delivers [result]."

C - CTA
    Clear next step
    "Could share how - worth a call?"
```

**BAB (Before-After-Bridge)**
```
B - BEFORE
    Current situation with problem
    "Most [role]s spend [X hours] on [task]..."

A - AFTER
    Ideal situation
    "...when they could [better outcome]."

B - BRIDGE
    How you connect the two
    "Our [solution] helps [similar companies] make that shift."
```

**SUMO (Short-Useful-Message-Offer)**
```
S - SHORT: Under 100 words total
U - USEFUL: Immediate value in the email
M - MESSAGE: Clear and direct, no fluff
O - OFFER: Impossible-to-ignore CTA
```

---

## Required Inputs

```yaml
required:
  recipient_type: string
    description: Who will receive (title, company type, profile)
    example: "VP of Marketing at B2B SaaS companies, 50-200 employees"

  goal: string
    description: Objective of the email
    options: [meeting, demo, reply, introduction, resource_share]
    example: "meeting"

  value_proposition: string
    description: What you offer of value
    example: "Increase demo-to-close rate by 40% with personalized video"

  sender_context: string
    description: Who you are / your company
    example: "Founder of VideoSales, helped 200+ SaaS companies"

optional:
  personalization_data: object
    description: Specific data about the prospect
    example:
      recent_post: "Their LinkedIn post about AI in sales"
      company_news: "Just raised Series B"
      mutual_connection: "Both know Sarah from SaaStr"

  trigger_event: string
    description: Event that justifies the contact
    example: "New funding round announced"

  social_proof: string
    description: Relevant results/clients
    example: "Helped Gong increase meeting rates 3x"

  competitive_context: string
    description: What alternatives they might consider
    example: "Currently using Loom, considering Vidyard"

  follow_up_sequence: boolean
    description: Whether to generate full sequence
    default: true

  email_count: number
    description: Number of emails in sequence
    default: 4

  copywriter_preference: string
    description: Style to emulate
    options: [direct, conversational, formal, challenger]
    default: "conversational"
```

---

## Step-by-Step Workflow

### Phase 1: Prospect Research (CRITICAL)

**Minimum 10-15 minutes per prospect for BASHO-level results.**

```
RESEARCH CHECKLIST:

ABOUT THE PERSON:
□ Full name (correct spelling!)
□ Current title and responsibilities
□ Career history (LinkedIn)
□ Recent content they published
  - LinkedIn posts
  - Blog articles
  - Podcast appearances
  - Conference talks
□ Interests/hobbies (if relevant)
□ Communication style (formal/casual)

ABOUT THE COMPANY:
□ What they do (in simple terms)
□ Company size (employees, revenue)
□ Recent news or announcements
□ Funding status
□ Key challenges in their industry
□ Main competitors
□ Current tech stack (if relevant)

TRIGGER EVENTS (Best timing):
□ New role/promotion
□ Company funding round
□ Product launch
□ Expansion news
□ Award/recognition
□ Recent hire posting (indicates priorities)
□ Conference appearance
□ Content publication

PERSONALIZATION HOOKS:
□ Specific observation about their work
□ Shared connection or experience
□ Relevant insight you can offer
□ Something unique about them/company
```

### Phase 2: Subject Line Creation

**Target: Under 40 characters, 50%+ open rate**

```
SUBJECT LINE HIERARCHY (By Performance):

TIER 1: HIGHEST OPEN RATES (50%+)
Format: Personalized, short, lowercase

Examples:
- "quick question, [name]"
- "[company] + [your company]"
- "about [their recent content]"
- "idea for [company]"
- "[name] - [topic]"

TIER 2: HIGH OPEN RATES (40-50%)
Format: Curiosity or trigger-based

Examples:
- "[mutual connection] suggested..."
- "saw the news about [event]"
- "re: [their priority]"
- "[specific result] for [industry]"

TIER 3: MODERATE OPEN RATES (30-40%)
Format: Value or question-driven

Examples:
- "question about [area]"
- "quick [topic] idea"
- "[number]% [result] in [time]"
```

**Subject Line Rules:**

```
DO:
✓ Keep under 40 characters
✓ Use lowercase (feels personal)
✓ Include name or company when natural
✓ Be specific, not generic
✓ Match the email tone

DON'T:
✗ Use ALL CAPS
✗ Include "[URGENT]" or spam triggers
✗ Use excessive punctuation!!!
✗ Write like marketing copy
✗ Be deceptive (hurts trust)
```

### Phase 3: Opening Line (First 5 Seconds)

**The opening line determines if they read further.**

```
HIGH-CONVERTING OPENING FORMULAS:

CONTENT-BASED:
"Saw your [post/article/talk] on [topic]. Especially liked
[specific point you actually read]."

TRIGGER-BASED:
"Congrats on [event]. That usually means [relevant insight]."

RESEARCH-BASED:
"Noticed [Company] is [observation]. This typically means
[implication relevant to what you offer]."

MUTUAL CONNECTION:
"[Name] mentioned you're working on [initiative] and
thought we should connect."

COMPLIMENT (Genuine only):
"Been following [their work/content] for [time].
[Specific genuine compliment]."

QUESTION:
"How is [Company] handling [specific challenge]?"

OBSERVATION:
"Noticed [insight about their business]. Curious if
[relevant question]?"
```

**Opening Lines to AVOID:**

```
❌ "Hope you're doing well" (generic)
❌ "I know you're busy, but..." (weak)
❌ "My name is [X] and I work at [Y]..." (about you)
❌ "I wanted to reach out because..." (boring)
❌ "I hope this email finds you well" (spam signal)
❌ "Allow me to introduce myself" (formal, dated)
```

### Phase 4: Body Copy (The Value)

**Principles: Short, specific, about THEM**

```
BODY COPY RULES:

BREVITY:
- Maximum 5-7 lines
- Under 125 words total
- Each sentence must earn the next
- Cut without mercy

FOCUS:
- "You" > "I/We"
- Their problems, not your features
- Benefits to THEM
- Relevant to THEIR situation

SPECIFICITY:
- Concrete numbers
- Real examples
- Measurable results
- Similar companies

CREDIBILITY (One line only):
- One social proof point
- Similar client/result
- Specific outcome
```

**Body Copy Structure:**

```
LINE 1-2: PERSONALIZED OPENING
[Reference something specific to them]

LINE 3-4: THE BRIDGE
[Connect your observation to what you do]
"I noticed this because [relevant connection]..."

LINE 5-6: THE VALUE
[One sentence of value + one sentence of proof]
"We help [similar companies] with [result].
[Company] achieved [specific outcome]."

LINE 7: THE ASK
[Clear, low-friction CTA]
"Worth 15 min to see if relevant?"
```

### Phase 5: CTA (Call-to-Action)

**Target: Low friction, easy to say yes**

```
CTA HIERARCHY (By Conversion):

TIER 1: MICRO-CTA (Highest response)
- "Worth 15 minutes to explore?"
- "Relevant to what you're working on?"
- "Make sense to chat?"
- "Could share how - interested?"

TIER 2: SPECIFIC WITH OPTIONS
- "Free Thursday or Friday for a quick call?"
- "How's Tuesday at 2pm or Wednesday at 10am?"
- "15 min this week work?"

TIER 3: PERMISSION-BASED
- "Are you the right person to talk to about this?"
- "Who should I connect with about [topic]?"
- "Mind if I send over a case study?"

TIER 4: VALUE-FIRST
- "Want me to send how [similar company] did it?"
- "Can I share the framework we used?"
- "Want to see the results?"

TIER 5: SOFT CLOSE
- "If relevant, just reply and we'll find a time."
- "If not a priority now, no worries - just let me know."
```

**CTAs to AVOID:**

```
❌ "Let me know your thoughts" (vague)
❌ "Call me when you can" (puts work on them)
❌ "I look forward to hearing from you" (passive)
❌ "Can we schedule a meeting?" (too formal)
❌ "Please advise" (corporate speak)
```

### Phase 6: Signature

**Keep it simple - no novels**

```
GOOD SIGNATURE:
[First name]
[Title] | [Company]
[Phone] (optional)

EXAMPLE:
Alex
Founder | VideoSales
415-555-0123

AVOID:
- Long titles
- Multiple links
- Quotes
- Excessive social icons
- Large images
- Disclaimers (in cold email)
```

---

## Complete Email Templates

### Template 1: BASHO-Style (Hyper-Personalized)

```
Subject: [something only they would recognize]

[Name],

[Personalized observation showing deep research - 1 sentence]

[Bridge to why you're reaching out - 1 sentence]

[Specific value or result relevant to them - 1 sentence]

[Simple, low-friction CTA - 1 sentence]

[First name]
[Simple signature]
```

**Example:**

```
Subject: your talk at SaaStr

Sarah,

Watched your SaaStr talk on PLG metrics - especially liked
your take on activation vs. engagement.

Given [Company]'s focus on that, thought you'd be interested
in how we helped Notion improve their activation rate 40%
with personalized onboarding videos.

Worth 15 minutes to see if relevant?

Alex
Founder | VideoSales
```

### Template 2: Trigger Event (Funding)

```
Subject: congrats on the round

[Name],

Saw the news about [Company]'s [Series X]. Congrats!

Post-funding, [relevant challenge] usually becomes priority.
We've helped [X] companies at this stage with [solution]—
[Client] saw [result] in [time].

Worth a quick chat to see if we can help?

[Signature]
```

### Template 3: Trigger Event (New Role)

```
Subject: congrats on [role]

[Name],

Saw you just joined [Company] as [Title]. Congrats!

First 90 days, [relevant priority] is usually top of mind.
We help new [role]s hit the ground running with [solution].
[Recent client] saw [result] in first [time].

If [priority] is on your list, happy to share how.

[Signature]
```

### Template 4: Content-Based

```
Subject: about [their content]

[Name],

Just read your [article/post] on [topic].
[Specific thing you agreed with or learned].

Made me think you'd find this relevant—
we help [type of companies] with [related solution].
[Client] used it to [result].

Worth a quick call to share more?

[Signature]
```

### Template 5: Question-Based

```
Subject: quick question

[Name],

How is [Company] handling [specific challenge]?

Asking because we help [type of companies] with this—
[brief social proof].

If it's on your radar, happy to share what's working.
If not, no worries at all.

[Signature]
```

### Template 6: Value-First (Resource Offer)

```
Subject: [resource] for [company]

[Name],

Put together a [guide/analysis/checklist] on [topic]
after seeing [observation about their situation].

[Similar companies] used it to [result].

Want me to send it over?
No pitch, just thought you'd find it useful.

[Signature]
```

### Template 7: Mutual Connection

```
Subject: [mutual connection] suggested I reach out

[Name],

[Mutual connection] mentioned you're working on [initiative]
and thought we should connect.

We help [type of companies] with [solution].
Recently helped [similar company] achieve [result].

[Mutual connection] thought it might be relevant.
Worth a quick call?

[Signature]
```

### Template 8: Competitive Intelligence

```
Subject: [competitor] vs [your solution]

[Name],

Noticed [Company] is using [Competitor].
Curious if you're happy with [specific aspect]?

We help teams like yours [specific improvement].
[Similar company] switched and saw [result].

If you're open to comparing, happy to show
what's different.

[Signature]
```

---

## Follow-Up Sequence

**Critical: 55% of replies come from follow-ups**

### Optimal Cadence

```
RECOMMENDED STRUCTURE:

EMAIL 1: Day 0
Initial outreach (templates above)

EMAIL 2: Day 3
Add new value, reference first email

EMAIL 3: Day 7
New angle or social proof

EMAIL 4: Day 14
Breakup email (permission to close)

TOTAL: 4 emails over 14 days
Spacing: 3 → 4 → 7 days
```

### Follow-Up 1 (Day 3): Add Value

```
Subject: Re: [original subject]

[Name],

Quick follow-up—wanted to share [new piece of value]
that relates to what I mentioned.

[One sentence of additional context]

Still think [brief restatement of original value].

[Softer version of original CTA]

[Signature]
```

**Example:**

```
Subject: Re: your talk at SaaStr

Sarah,

Forgot to mention—we just published a case study
on activation rate optimization you might find useful.

Shows exactly how Notion implemented what I mentioned.

Still happy to share specifics on a quick call
if relevant.

Alex
```

### Follow-Up 2 (Day 7): New Angle/Social Proof

```
Subject: Re: [original subject]

[Name],

Quick update—just helped [similar company] with
[related result].

[One specific detail about the result]

If [their challenge] is on your radar,
happy to share how they approached it.

[CTA]

[Signature]
```

**Example:**

```
Subject: Re: your talk at SaaStr

Sarah,

Quick update—just helped [Similar Company] improve
their activation metrics by 52%.

Used a personalized video sequence in their onboarding
that took 2 weeks to implement.

If activation is still a priority, happy to walk
you through exactly what we did.

Alex
```

### Follow-Up 3 (Day 14): Breakup Email

```
Subject: should I close this out?

[Name],

Haven't heard back, so I'm guessing
[topic] isn't a priority right now.

No worries at all—just want to respect your time.

If things change, I'm here.
Otherwise, I'll check back in [timeframe].

[Signature]
```

**Example:**

```
Subject: should I close this out?

Sarah,

Haven't heard back, so I'm guessing
activation optimization isn't a focus right now.

Totally understand—no worries at all.

If it becomes a priority, I'm here.
Otherwise, I'll check back next quarter.

Alex
```

### Follow-Up Best Practices

```
DO:
✓ Add new value in each follow-up
✓ Reference previous email (thread together)
✓ Change the angle slightly
✓ Keep getting shorter
✓ Include clear opt-out option

DON'T:
✗ Say "just following up" (adds no value)
✗ Send identical emails
✗ Follow up too frequently
✗ Be passive-aggressive
✗ Make them feel guilty
```

---

## Personalization at Scale

### Personalization Levels

```
LEVEL 1: BASIC (Minimum - everyone does this)
- First name
- Company name
- Job title
Impact: +22% open rate

LEVEL 2: CONTEXTUAL (Better)
- Industry-specific challenges
- Company size considerations
- Role-specific pain points
Impact: +35% open rate

LEVEL 3: RESEARCH-BASED (Good)
- Their recent content
- Company news
- Mutual connections
Impact: +45% open rate

LEVEL 4: INSIGHT-BASED (BASHO Level)
- Specific observation about their business
- Unique insight you can provide
- Something unexpected
Impact: +50%+ open rate
```

### Scaling Personalization

```
FOR HIGH-VOLUME OUTREACH:

1. SEGMENT BY PERSONA
   Create templates for each buyer persona
   Customize the challenge/value prop per segment

2. CONDITIONAL CONTENT
   Use dynamic fields for industry-specific proof
   Different case studies per company size

3. BATCH RESEARCH
   Research 10 prospects → Write 10 emails → Send
   Don't research one, write one, send one

4. PERSONALIZATION VARIABLES
   [first_name] - Basic
   [company] - Basic
   [recent_achievement] - Research required
   [specific_observation] - Research required
   [similar_client] - Segment based
   [relevant_result] - Segment based
```

---

## Deliverability Best Practices

### Technical Setup (CRITICAL)

```
DOMAIN REQUIREMENTS:
□ Custom domain (NOT @gmail.com)
□ SPF record configured
□ DKIM record configured
□ DMARC policy set
□ Domain warmed up (2-4 weeks minimum)

SENDING PRACTICES:
□ Start with 10-20 emails/day
□ Scale gradually (add 5-10/day)
□ Max 50 emails/day per mailbox
□ Use multiple mailboxes for scale
□ Avoid sending spikes
```

### Content Best Practices

```
DO:
✓ Personalize to avoid pattern detection
✓ Keep links minimal (1-2 max)
✓ Use plain text or minimal HTML
✓ Write like a human, not marketing
✓ Vary your templates

DON'T:
✗ Use spam trigger words
✗ Attach files in cold emails
✗ Include large images
✗ Use tracking pixels excessively
✗ Send identical emails in bulk
```

### Spam Trigger Words to Avoid

```
HIGH RISK:
- Free, Free trial
- Act now, Limited time
- Guaranteed, No risk
- Make money, Cash
- Click here, Click below

MEDIUM RISK:
- Urgent, Important
- Opportunity
- Exclusive offer
- Don't miss
- Special promotion

SAFER ALTERNATIVES:
- "Complimentary" instead of "Free"
- "Worth exploring" instead of "Opportunity"
- "Time-sensitive" instead of "Urgent"
```

### Optimal Send Times

```
BEST DAYS:
Tuesday, Wednesday, Thursday

AVOID:
Monday (inbox overwhelm)
Friday (weekend mode)

BEST TIMES:
8:30-10:30 AM (decision-makers checking email)
1:00-3:00 PM (post-lunch)

LOCALIZE to recipient's time zone

AVOID:
12-1pm (lunch)
After 5pm (low engagement)
Weekends (ignored)
```

---

## Quality Checklist

### Pre-Send Verification

```
OPENING:
□ Personalized (not template generic)?
□ About THEM (not about you)?
□ Earns the next 5 seconds?
□ Something only they would recognize?

BODY:
□ Maximum 7 lines?
□ Under 125 words?
□ Each sentence justifies existing?
□ Clear value for the prospect?
□ Specific, not generic?

CTA:
□ Clear and specific?
□ Low friction?
□ Easy to respond to?
□ Only ONE ask?

TECHNICAL:
□ Name spelled correctly?
□ Company name correct?
□ No typos or errors?
□ Links working?
□ No spam triggers?
□ Signature clean?

DELIVERABILITY:
□ Doesn't sound like template?
□ No spam trigger words?
□ Minimal links?
□ Personalized enough?
```

---

## Output Format

```yaml
generated_output:
  format: markdown
  sections:
    - prospect_research_notes
    - personalization_hooks (3-5 identified)
    - subject_line_variations (3)
    - complete_cold_email
    - opening_line_variations (3)
    - follow_up_sequence (3-4 emails)
    - quality_checklist_completed
    - a/b_test_recommendations
```

---

## A/B Testing Framework

### What to Test

```
PRIORITY 1: SUBJECT LINE
Test length, personalization, curiosity vs clarity

PRIORITY 2: OPENING LINE
Test different personalization hooks

PRIORITY 3: CTA
Test different levels of friction

PRIORITY 4: EMAIL LENGTH
Test shorter vs longer versions

PRIORITY 5: SEND TIME
Test different days/times
```

### Testing Protocol

```
1. SINGLE VARIABLE
   Only change one thing at a time

2. SAMPLE SIZE
   Minimum 100 emails per variation

3. MEASUREMENT
   Wait for full sequence to complete

4. SIGNIFICANCE
   Look for 20%+ difference to be meaningful

5. ITERATION
   Winner becomes control, test new variation
```

---

## Metrics & Benchmarks

### KPIs to Track

```
PRIMARY METRICS:
- Open Rate: Target 40-60%
- Reply Rate: Target 5-15%
- Positive Reply Rate: % that are interested
- Meeting Rate: Target 3-5%

SECONDARY METRICS:
- Bounce Rate: Target <2%
- Unsubscribe Rate: Monitor trend
- Spam Complaint Rate: Target <0.1%

SEQUENCE METRICS:
- Reply by email number
- Drop-off rate between emails
- Time to first reply
```

### Optimization Guide

```
IF OPEN RATE LOW (<30%):
→ Test new subject lines
→ Check deliverability/spam folder
→ Verify email addresses
→ Adjust send times
→ Check domain reputation

IF REPLY RATE LOW (<3%):
→ Improve personalization depth
→ Strengthen value proposition
→ Simplify CTA
→ Shorten email length
→ Add more social proof

IF MEETING RATE LOW:
→ Qualify list better
→ Improve targeting
→ Strengthen social proof
→ Adjust offer positioning
```

---

## Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|-----|
| Talking about yourself first | -40% reply rate | Lead with THEM |
| Generic opening | -50% engagement | Personalize deeply |
| Too long (>200 words) | -30% reply rate | Cut to 125 words |
| No follow-up | Missing 55% of replies | Send 4 email sequence |
| Vague CTA | -35% conversion | Specific, low-friction ask |
| Template-sounding | Spam filters + low trust | Unique every time |
| Wrong send time | -25% open rate | Tuesday-Thursday 8:30-10:30am |
| No research | -60% relevance | 10-15 min per prospect |

---

## Integration with Other Tasks

### Before This Task
- `avatar-research.md` - Deep understanding of target persona
- `copysearch.md` - Research competitors and market

### After This Task
- `create-email-sequence.md` - Nurture sequences for replies
- `create-close-script.md` - Phone scripts for meetings booked

### Complementary Tasks
- `build-authority-arsenal.md` - Social proof for emails
- `create-offer.md` - Value proposition development

---

## References

### Primary Sources
- Berman, Alex. "The Cold Email Manifesto" (2023)
- Close.com. "BASHO Email Method" (Research)
- Moubeche, Guillaume. Lemlist research and methodology
- Lemlist. "Cold Email Copywriting Data" (2024-2025)
- Instantly.ai. "Cold Email Cadence Research" (2025)

### Research Document
`squads/copy/docs/research/cold-email-methodology-research.md`

---

*Task Version: 2.0.0*
*Last Updated: 2026-01-23*
*Primary Frameworks: BASHO, Alex Berman, REPLY Method, Lemlist*
*Minimum Output: 600 lines*
