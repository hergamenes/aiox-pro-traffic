---
task: Create Close Script Task
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

# Create Close Script Task

## Task Metadata

```yaml
id: create-close-script
version: 2.0.0
category: sales
tier_recommendation: 2
primary_frameworks:
  - CLOSER Framework (Hormozi)
  - Pain Funnel (Sandler)
  - SPIN Selling (Rackham)
  - NEPQ (Miner)
min_output_lines: 600
research_source: docs/research/close-script-methodology-research.md
```

---

## Purpose

Generate comprehensive sales closing scripts using methodologies from the world's top closers. This task creates complete call frameworks that handle discovery, presentation, objection handling, and closing sequences for any sales context.

**Key Principle:** "People buy emotionally and justify intellectually" (Sandler). Every script must address both the emotional pain and logical justification.

---

## When to Use This Task

### High-Value Use Cases

- Building or training a sales team
- Launching high-ticket ($2K+) offers
- Phone/video sales calls
- Setter + Closer call structures
- Low close rates that need improvement
- Systematizing sales process
- Onboarding new sales reps
- Handling specific objection patterns

### Ideal Scenarios

| Scenario | Recommended Focus |
|----------|-------------------|
| High-ticket coaching ($5K+) | Full CLOSER framework + extensive objection handling |
| SaaS enterprise sales | SPIN selling + multiple stakeholder scripts |
| One-call close (<$2K) | Condensed framework + urgency closes |
| Setter/qualifier calls | Qualification + booking scripts |
| Follow-up sequences | Objection-specific response scripts |
| Team training | Role-play scenarios + evaluation rubrics |

---

## Foundational Frameworks

### Framework 1: The CLOSER Framework (Hormozi)

The CLOSER framework creates a systematic conversation flow:

```
C - CLARIFY why they're there
    "What made you book this call today?"
    "What's happening that made this a priority?"

L - LABEL them with a problem
    "So it sounds like you're dealing with [problem]. Is that accurate?"

O - OVERVIEW their past experiences
    "What have you tried before?"
    "Why do you think those didn't work?"

S - SELL the vacation (outcome)
    "In a perfect world, what would [solved] look like?"
    "What would that mean for you?"

E - EXPLAIN away their concerns
    "What questions do you have?"
    "What would need to be true for you to feel confident?"

R - REINFORCE their decision
    "You made a great decision. Here's why..."
    "Your first step is [action]."
```

### Framework 2: The Pain Funnel (Sandler)

Systematically moves from surface symptoms to deep emotional pain:

```
LEVEL 1: IDENTIFY
"Tell me about your [situation]..."

LEVEL 2: EXPAND
"Tell me more about that..."
"Can you be more specific?"
"Give me an example..."

LEVEL 3: QUANTIFY
"How long has this been going on?"
"How much is this costing you?"
"What's the impact?"

LEVEL 4: EMOTIONALIZE
"How do you feel about that?"
"What's that doing to you personally?"

LEVEL 5: URGENCY
"What have you tried?"
"Did that work?"
"Have you given up trying to solve this?"

LEVEL 6: COMMITMENT
"If you could solve this, what would that mean?"
"How important is it... scale of 1-10?"
```

### Framework 3: SPIN Selling (Rackham)

Research-based questioning for complex sales:

```
S - SITUATION Questions
    Facts about current state
    "Tell me about your current [process]..."

P - PROBLEM Questions
    Difficulties and dissatisfaction
    "What challenges are you facing?"

I - IMPLICATION Questions
    Consequences of the problems
    "What effect does that have on [area]?"
    "What happens if you don't solve this?"

N - NEED-PAYOFF Questions
    Value of the solution
    "How would it help if you could [benefit]?"
    "What would solving this be worth?"
```

### Framework 4: NEPQ (Miner)

Neuro-Emotional Persuasion Questioning - let prospects close themselves:

```
CONNECTING QUESTIONS
"What made you decide to take this call?"
"What are you hoping to get out of this?"

SITUATION QUESTIONS
"Walk me through how you're currently handling [area]..."

PROBLEM AWARENESS QUESTIONS
"What's the most frustrating part?"
"How long has this been going on?"

SOLUTION AWARENESS QUESTIONS
"What would it mean if you could solve this?"
"If there was a way to [outcome], how would that change things?"
```

**Tone Layering (NEPQ):**
- **Curious tone**: Rising inflection for exploration
- **Concerned tone**: Softer, slower for pain
- **Skeptical tone**: Flat, questioning for challenge
- **Confused tone**: Uncertain for redirection

---

## Required Inputs

```yaml
required:
  product_name: string
    description: What you're selling
    example: "Executive Coaching Program"

  price: number
    description: Price point of the offer
    example: 5000

  offer_summary: string
    description: What they get (deliverables)
    example: "12 weeks of 1-on-1 coaching, weekly calls, Slack access"

  main_objections: array[string]
    description: Top 3-5 objections you hear most
    example:
      - "I need to think about it"
      - "It's too expensive"
      - "I need to talk to my spouse"

  target_outcome: string
    description: The transformation/result they want
    example: "Scale from $100K to $500K revenue"

optional:
  call_type: enum
    options: [one_call_close, setter_closer, strategy_call]
    default: one_call_close

  call_length: number
    description: Typical call duration in minutes
    default: 45

  guarantee: string
    description: Guarantee offered
    example: "30-day money-back guarantee"

  payment_options: array[string]
    description: Available payment plans
    example: ["Pay in full", "3 payments of $1,800"]

  qualification_criteria: array[string]
    description: What makes a qualified lead
    example: ["Revenue $50K+", "Ready to invest", "Decision maker"]

  urgency_element: string
    description: Legitimate scarcity or deadline
    example: "Only 5 spots this quarter"

  competitive_alternatives: array[string]
    description: What else they might consider
    example: ["DIY", "Other coaches", "Do nothing"]

  case_studies: array[object]
    description: Success stories to reference
    example:
      - name: "Sarah"
        situation: "Stuck at $80K"
        result: "Scaled to $300K in 6 months"
```

---

## Step-by-Step Workflow

### Phase 1: Pre-Call Preparation

Before writing the script, complete this analysis:

```
PROSPECT ANALYSIS:
□ Who is the ideal prospect? [Demographics, psychographics]
□ What problem do they have? [Symptom vs. root cause]
□ What emotional pain does this cause? [Fear, frustration, shame]
□ What logical impact exists? [Time, money, opportunity cost]
□ What have they likely tried? [Past failed solutions]
□ Why are those insufficient? [Gaps in previous approaches]

OFFER ANALYSIS:
□ What is the core transformation? [Before → After]
□ What makes this different? [Unique mechanism]
□ What proof exists? [Case studies, data, testimonials]
□ What objections will arise? [Top 5]
□ What is the risk reversal? [Guarantee, trial]
```

### Phase 2: Call Structure Selection

Choose the appropriate call structure:

```
OPTION A: ONE-CALL CLOSE (Simple offer, <$3K)
Duration: 30-45 minutes
Structure: Discovery → Pitch → Close
Best for: Low-mid ticket, single decision maker

OPTION B: SETTER + CLOSER (High-ticket, >$5K)
Setter Call: 15-20 min (qualify + book)
Closer Call: 45-60 min (full presentation)
Best for: High-ticket, needs extensive discovery

OPTION C: STRATEGY CALL (Consultative)
Duration: 60-90 minutes
Structure: Audit → Diagnosis → Prescription → Close
Best for: Complex sales, multiple stakeholders
```

### Phase 3: Opening Script (Minutes 0-5)

**Objective:** Build rapport, set expectations, gain permission.

```
OPENING TEMPLATE:

"Hey [Name], this is [Your Name] from [Company].
Can you hear me okay? Great.

Before we dive in, I want to set some expectations for our call.

I'm going to ask you some questions to understand your situation.
Then I'll share what we do and see if it's a fit.
If it makes sense for both of us, we can talk about working together.
If it doesn't make sense, I'll tell you that too.

Sound fair?

[Wait for yes]

Great. So tell me... what made you book this call today?"
```

**Opening Variations:**

```
VARIATION 1: REFERRAL OPENING
"Hey [Name], [Referrer] mentioned you were looking for help with [area].
They thought we'd be a good fit to chat.
What's going on that made you interested?"

VARIATION 2: CONTENT OPENING
"Hey [Name], I noticed you [downloaded/watched/attended] our [resource].
What caught your attention about that?"

VARIATION 3: APPLICATION OPENING
"Hey [Name], I reviewed your application and had some questions.
You mentioned [specific detail]. Can you tell me more about that?"
```

### Phase 4: Discovery Questions (Minutes 5-25)

**Objective:** Uncover deep pain and establish urgency.

```
TIER 1: SITUATION QUESTIONS (2-3 questions)
Purpose: Establish baseline understanding

"Tell me about your current [situation/business/health]..."
"How long have you been doing [activity]?"
"Walk me through a typical [day/week/process]..."
"What are you currently doing to [address area]?"

TIER 2: PROBLEM QUESTIONS (3-5 questions)
Purpose: Surface explicit problems

"What challenges are you running into with [situation]?"
"What's the most frustrating part of [process]?"
"What's not working the way you'd like?"
"Where do things tend to break down?"
"What's keeping you from [goal]?"

TIER 3: IMPLICATION QUESTIONS (3-5 questions)
Purpose: Expand perceived severity

"What effect does that have on [other area]?"
"How is this impacting your [time/money/relationships/health]?"
"What happens if nothing changes?"
"How long can you afford to let this continue?"
"What opportunities are you missing because of this?"

TIER 4: EMOTIONAL QUESTIONS (2-3 questions)
Purpose: Connect to feelings

"How do you feel about that situation?"
"What's that doing to you personally?"
"When you think about [problem], what comes up for you?"
"What would it mean to finally solve this?"

TIER 5: COMMITMENT QUESTIONS (2-3 questions)
Purpose: Establish urgency and readiness

"On a scale of 1-10, how important is solving this?"
"What would solving this be worth to you?"
"If you could wave a magic wand and fix this, what would that look like?"
"Are you ready to do something about this, or are you just exploring?"
```

**Discovery Flow Example:**

```
YOU: "Tell me about your current business..."

THEM: "I'm a coach doing about $100K/year."

YOU: "Got it. And what challenges are you facing?"

THEM: "I can't seem to scale past where I am."

YOU: "Tell me more about that..."

THEM: "I'm working all the time but my revenue is flat."

YOU: "How long has this been going on?"

THEM: "About 2 years now."

YOU: "What have you tried to fix it?"

THEM: "Courses, masterminds, different marketing..."

YOU: "And did those work?"

THEM: "Not really. I'm still in the same place."

YOU: "How does that feel?"

THEM: "Honestly? Frustrating. I feel stuck."

YOU: "What happens if nothing changes in the next year?"

THEM: "I'll probably burn out. I can't keep going like this."

YOU: "On a scale of 1-10, how urgent is solving this?"

THEM: "It's a 9. I need to figure this out."

[PAIN ESTABLISHED - Ready for transition]
```

### Phase 5: Transition to Presentation (Minutes 25-28)

**Objective:** Bridge from their pain to your solution.

```
TRANSITION TEMPLATE:

"Based on what you've shared, I think we can help.

Let me make sure I understand correctly:
- You're dealing with [main problem]
- You've tried [past attempts] but they didn't work because [reason]
- And what you really want is [dream outcome]

Did I get that right?

[Wait for confirmation]

Great. Let me share how we've helped people in your exact situation..."
```

**Transition Variations:**

```
VARIATION 1: DIAGNOSIS TRANSITION
"Based on what you've told me, I see three main issues:
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]
Does that sound accurate?
Good. Let me show you how we address each of these..."

VARIATION 2: QUALIFICATION TRANSITION
"I think you'd be a great fit for what we do.
Before I explain more, I want to ask:
If we can solve [problem], are you ready to move forward today?"

VARIATION 3: STORY TRANSITION
"What you just described is EXACTLY what [Client Name] was dealing with.
Let me tell you what happened with them..."
```

### Phase 6: Presentation (Minutes 28-42)

**Objective:** Present solution focused on their specific pain.

```
PRESENTATION STRUCTURE:

SECTION 1: THE MECHANISM
"Here's WHY you're stuck and what it takes to fix it..."
[Explain the unique approach/framework]

SECTION 2: THE SOLUTION
"Our [program/product] is designed specifically for [their situation]..."
[Overview of what they get]

SECTION 3: THE VALUE STACK
"Here's everything included:
- [Core deliverable] - valued at $X
- [Bonus 1] - valued at $Y
- [Bonus 2] - valued at $Z
Total value: $[sum]"

SECTION 4: THE PROOF
"Here's what happened for [Client 1]..."
"And [Client 2] went from [before] to [after]..."

SECTION 5: THE INVESTMENT
"The investment for all of this is not $[anchor price].
It's just $[actual price]."

SECTION 6: THE GUARANTEE
"And to make this a complete no-brainer,
[Explain guarantee in full detail]"

SECTION 7: THE URGENCY
"The only caveat is [legitimate scarcity/deadline]..."
```

**Value Stack Template:**

```
"Let me walk you through exactly what you get:

CORE COMPONENT:
[Main deliverable] - This alone is worth $[X] based on [reasoning].

COMPONENT 2:
[Secondary deliverable] - Clients tell me this is worth $[Y] because [reason].

COMPONENT 3:
[Support element] - This ensures you [benefit], valued at $[Z].

BONUS 1:
[Additional item] - I'm including this to help you [benefit], worth $[A].

BONUS 2:
[Fast-action bonus] - For people who start today, you also get [item] worth $[B].

TOTAL VALUE: $[sum]

YOUR INVESTMENT: $[price]

That's [savings amount] in savings, plus the [transformation] you'll achieve."
```

### Phase 7: Objection Handling (Minutes 42-55)

**Objective:** Address concerns and remove barriers.

```
PROACTIVE OBJECTION SURFACING:

"Before we move forward, I want to make sure you're 100% confident.
What questions or concerns do you have?"

[Listen without interrupting]

"Anything else?"

[Continue until they have no more concerns]
```

**The A.C.E. Objection Framework:**

```
A - ACKNOWLEDGE
    Validate their concern without agreeing it's insurmountable
    "I hear you. That's a fair concern."

C - CLARIFY
    Ask questions to understand the true objection
    "Help me understand - what specifically concerns you about [X]?"

E - EMPATHIZE and EXPLAIN
    Connect emotionally, then address logically
    "Many of my clients felt the same way. Here's what they discovered..."
```

---

## Complete Objection Scripts

### Objection 1: "I need to think about it"

```
SCRIPT:

YOU: "I totally understand. This is a big decision and thinking it through is smart.

[CLARIFY]
Just so I can help - when you say you need to think about it, what specifically are you thinking about?

Is it:
- The investment?
- Whether it's the right fit?
- The timing?
- Something else?

[Wait for answer]

THEM: [Gives real concern]

YOU: [Address that specific concern]

Then ask: "If we can address that, are you ready to move forward today?"
```

**Alternative paths:**

```
IF THEY SAY "THE INVESTMENT":
"I get it. Let me ask - is it that you don't have the funds,
or you're not sure it's worth the investment?"

[If not sure it's worth it]:
"Fair. What would [the result we discussed] be worth to you?
If you could guarantee that outcome, what would you pay?"

[If don't have funds]:
"What could you do to make this happen?
Do you have access to credit?
We do have payment options - would $X/month work better?"
```

```
IF THEY SAY "WHETHER IT'S RIGHT FOR ME":
"That's an important consideration. Let me ask you:

Based on what we discussed:
- You have [problem]
- You want [outcome]
- You've tried [other things] that didn't work

What specifically makes you unsure this would be different?"

[Address their specific concern]

"Given that, does it make sense to move forward?"
```

```
IF THEY SAY "THE TIMING":
"I understand. Timing matters.

Help me understand - is this a 'not right now' or 'never'?

[If not right now]:
"When would be better? And what changes between now and then?

Here's what I've found: [thing they're waiting for] rarely changes on its own.
The best time to start is when you've identified the problem - which is now.

What would need to happen for now to be the right time?"
```

### Objection 2: "It's too expensive"

```
SCRIPT:

YOU: "I appreciate you being upfront about that.

[CLARIFY]
Help me understand - when you say it's too expensive, compared to what?

- Compared to the cost of staying where you are?
- Compared to what you expected?
- Compared to another option you're considering?

[Wait for answer]

THEM: [Gives context]
```

**Alternative paths:**

```
IF COMPARED TO STAYING WHERE THEY ARE:
"Let me ask you this:

You mentioned [problem] is costing you [X per month/year].
Over the next 12 months, that's $[total cost of problem].

The investment here is $[price].

If we solve this problem, you actually SAVE $[difference].

Does it make more financial sense to invest now and solve it,
or keep paying the cost of the problem?"
```

```
IF COMPARED TO THEIR EXPECTATION:
"I understand. What were you expecting?

[Listen]

The reason for the investment is [explain value].

Let me break it down another way:
$[price] over [X months] = $[per month]
That's $[per day] per day for [major benefit].

Is that worth it to finally solve [their problem]?"
```

```
IF COMPARED TO A COMPETITOR:
"That's smart to compare. What are you looking at?

[Listen]

Here's how we compare:
[Differentiator 1]
[Differentiator 2]
[Differentiator 3]

The reason we're priced this way is [value explanation].

Based on those differences, which makes more sense for your situation?"
```

**Payment Plan Pivot:**

```
"I hear you on the investment.

We do have payment options that might work better:
- [Option 1]: $X/month for Y months
- [Option 2]: $A upfront + $B/month

Which of those would make this more manageable for you?"
```

### Objection 3: "I need to talk to my spouse/partner"

```
SCRIPT:

YOU: "Of course - big decisions should be made together. I'd do the same thing.

[CLARIFY]
When you talk to them, what do you think they'll say?"

THEM: [Predicts response]
```

**Alternative paths:**

```
IF THEY THINK SPOUSE WILL BE SUPPORTIVE:
"Great! Since they're likely to support it, why don't we get them on the phone right now?

That way I can answer any questions they have directly, and you two can decide together.

What's the best way to reach them?"
```

```
IF THEY THINK SPOUSE WILL HAVE CONCERNS:
"Understandable. What concerns do you think they'll have?

[Listen to each concern]

Let me address those:
[Concern 1]: [Response]
[Concern 2]: [Response]
[Concern 3]: [Response]

If you can share those points with them, do YOU feel confident about moving forward?

[If yes]:
Great. Here's what I suggest:
Talk to them tonight, share what we discussed, and let's reconnect tomorrow at [time].

Does that work?

[Schedule specific follow-up]"
```

```
IF SPOUSE/PARTNER ISN'T AVAILABLE NOW:
"I understand they're not available right now.

Here's what I'd suggest:
1. I'll send you a summary email you can share with them
2. Let's schedule a call for tomorrow at [time] when they CAN be there
3. We'll make the decision together on that call

Does that work?"
```

### Objection 4: "I've been burned before"

```
SCRIPT:

YOU: "I'm really sorry to hear that. That's frustrating - and unfortunately too common.

[CLARIFY]
What happened?"

THEM: [Shares their story]

YOU: "I appreciate you sharing that. That would make me cautious too.

[EMPATHIZE]
The truth is, not every solution works for everyone, and some providers don't deliver.

[DIFFERENTIATE]
Here's how we're different:
1. [Specific differentiator addressing their past failure]
2. [Another differentiator]
3. [Your guarantee that protects them]

[CLOSE]
Given our [guarantee], you're completely protected.
If we don't deliver, you get [refund/money back/etc].

Does that give you enough confidence to move forward?"
```

### Objection 5: "I want to do more research"

```
SCRIPT:

YOU: "I appreciate thoroughness. That's smart.

[CLARIFY]
What specifically do you want to research?"

THEM: [Names specific area]

YOU: "I can probably answer that right now. What do you want to know about [area]?

[Provide the information]

Does that answer your question?

[If yes]:
Great. Any other questions before we move forward?

[If no]:
What else would you need to research?

[Continue until all questions answered]

Now that we've covered those points, are you ready to proceed?"
```

### Objection 6: "Let me check with my team/boss"

```
SCRIPT:

YOU: "Makes sense - big decisions often need buy-in.

[CLARIFY]
Who else is involved in this decision?
And what do you think their concerns will be?

[Listen]

[STRATEGIZE]
Here's what I suggest:
1. I'll send you a proposal document you can share
2. Let's schedule a call where everyone can join
3. That way I can address their questions directly

When would work for that group call?"
```

### Objection 7: "I don't have time right now"

```
SCRIPT:

YOU: "I hear you - time is precious.

[CLARIFY]
When you say you don't have time, is it:
- Time to implement the solution?
- Time in your schedule generally?
- Time to focus on this specific area?

[Listen]

[REFRAME]
Here's the thing:
The problem you described is COSTING you time - [X hours/week].
Our solution actually SAVES you time - [Y hours/week].

So the question isn't 'do you have time for this?'
It's 'can you afford NOT to make time for this?'

What would you do with [Y extra hours] per week?"
```

### Objection 8: "Can you send me more information?"

```
SCRIPT:

YOU: "Absolutely, I can send you information.

[CLARIFY]
Before I do - what specific questions do you have that the information would answer?

[Listen]

Actually, let me answer those right now:
[Answer each question]

Does that cover what you wanted to know?

[If yes]:
Great. So what's stopping us from moving forward today?

[If no]:
What else would you need to know?

[Continue until done]

Now that we've covered everything, ready to get started?"
```

---

## Close Types Reference Library

### Category 1: Assumptive Closes

Assume the sale; focus on details.

```
THE ALTERNATE CHOICE CLOSE:
"Would you prefer the monthly or annual plan?"
"Should we start with the basic or premium package?"
"Do you want to pay in full or use the payment plan?"

THE SCHEDULING CLOSE:
"When would you like to start - this week or next?"
"I have openings Tuesday or Thursday. Which works better?"

THE PAPERWORK CLOSE:
"Let me pull up the agreement while we're together.
What email should I send it to?"
```

### Category 2: Urgency Closes

Create time pressure.

```
THE DEADLINE CLOSE:
"This price is only available until [date].
After that, it increases by $[X].
Shall we lock this in now?"

THE SCARCITY CLOSE:
"I only have [3] spots available this quarter.
Once they're gone, you'd have to wait [time].
Should I reserve one for you?"

THE FAST-ACTION CLOSE:
"For people who start today, I'm including [bonus] worth $[X].
That offer expires at midnight.
Want me to include that?"
```

### Category 3: Value Closes

Emphasize ROI.

```
THE MATH CLOSE:
"Let me break this down:
Your problem costs you $[X/month].
Our solution is $[Y/month].
That's a net positive of $[difference/month].
In 12 months, you're ahead by $[total].
Does it make financial sense to wait?"

THE DAILY COST CLOSE:
"The investment is $[total].
Over [X months], that's $[monthly].
That's $[daily] per day.
Less than a [coffee/lunch].
Is [benefit] worth that?"
```

### Category 4: Trial Closes

Test readiness.

```
THE TEMPERATURE CHECK:
"How does everything sound so far?"
"Does this seem like it could work for you?"

THE SCALE CLOSE:
"On a scale of 1-10, how confident are you this could help?
What would make it a 10?"

THE CONCERN CHECK:
"What questions do you still have?"
"What's holding you back?"
```

### Category 5: Emotional Closes

Connect to feelings.

```
THE FUTURE PACE CLOSE:
"Imagine it's 6 months from now.
You made the decision to join.
[Problem] is solved.
You're now [enjoying outcome].
How does that feel?
...
Let's make that real. Ready to get started?"

THE COST OF INACTION CLOSE:
"What happens if you don't solve this?
Where will you be in 6 months?
In 12 months?
Is that acceptable?
...
Then let's fix it today."

THE LEGACY CLOSE:
"What would it mean to finally [achieve goal]?
How would that change things for your [family/team/life]?
Let's make that happen."
```

### Category 6: Reversal Closes

Use psychology.

```
THE TAKEAWAY CLOSE:
"Actually, based on what you've said, this might not be right for you.
[Pause]
...
Why do you think it WOULD be a good fit?"

THE PUPPY DOG CLOSE:
"Why don't you try it for [period] with our guarantee?
If it's not everything I promised, you get every penny back.
What do you have to lose?"

THE CHALLENGE CLOSE:
"The question isn't whether this works - we've proven that.
The question is whether YOU'RE ready to do the work.
Are you?"
```

---

## Complete Call Scripts

### Script A: High-Ticket Closer Call (45-60 min)

```
[OPENING - 3 min]

"Hey [Name], this is [You] from [Company].
Can you hear me okay? Great.

Before we dive in, let me set some expectations.

I'm going to ask you questions to understand your situation.
Then I'll share what we do and see if it's a fit.
If it makes sense, we'll talk about working together.
If not, I'll tell you that too.

Sound fair? Great.

So tell me - what made you book this call today?"

---

[DISCOVERY - 20 min]

[Listen to their initial response, then dig deeper]

"Tell me more about that..."
"How long has this been going on?"
"What have you tried to solve it?"
"Did that work?"
"What's this costing you - in time, money, opportunity?"
"How do you feel about the situation?"
"What happens if nothing changes?"
"On a scale of 1-10, how urgent is solving this?"

[Continue until you have deep understanding of pain]

---

[TRANSITION - 2 min]

"Based on what you've shared, I think we can definitely help.

Let me make sure I understand:
- You're dealing with [pain]
- You've tried [past solutions] but they didn't work because [reason]
- What you want is [outcome]

Did I get that right? Good.

Let me show you how we've helped people in your exact situation..."

---

[PRESENTATION - 12 min]

"Here's what's really going on...
[Explain the underlying problem/mechanism]

And here's how we solve it...
[Overview of your approach]

Let me walk you through what you get:

CORE: [Main deliverable] - This alone is worth $X

INCLUDES: [Component 2] - Worth $Y

PLUS: [Component 3] - Worth $Z

BONUS: [Fast-action bonus] - Worth $A if you start today

Total value: $[sum]

Your investment: $[price]

And to make this a complete no-brainer:
[Explain guarantee in detail]

The only thing is [legitimate urgency]..."

---

[CLOSE - 8 min]

"So based on everything we've discussed:
- You have [pain]
- You want [outcome]
- We've helped [X] people achieve exactly that
- You're protected by [guarantee]

The investment is $[price].

Does it make sense to move forward?"

[Handle objections using A.C.E.]

[Continue closing until they say yes or provide unmovable objection]

---

[POST-CLOSE - 5 min]

"Congratulations! You made a great decision.

Here's why this is going to work for you:
[Reinforce decision]

Over the next 24-48 hours, you might have doubts.
That's totally normal. When that happens, remember:
[Key reassurance point]

Here's what happens next:
1. [Immediate step]
2. [First 24 hours]
3. [First week]

Your first action is [specific step].
Can you do that by [time]?

Welcome to [program]. I'm excited to see your results."
```

### Script B: Setter/Qualifier Call (15-20 min)

```
[OPENING - 2 min]

"Hi [Name], this is [You] from [Company].
I'm reaching out because you [trigger - downloaded/registered/etc].
Do you have a few minutes to chat?"

---

[QUALIFICATION - 10 min]

"Tell me a bit about your situation..."
"What made you [take that action]?"
"What are you hoping to achieve?"
"How urgent is solving this for you?"
"What have you tried before?"
"Are you the decision maker, or is someone else involved?"
"If we could help, are you in a position to invest in a solution?"

[Evaluate against qualification criteria]

---

[BOOKING - 5 min]

[If qualified]:
"Based on what you've shared, you'd be a great fit for a Strategy Call with [Closer].
They'll dive deeper and show you exactly how we can help.

I have [time] or [time] available. Which works better?"

[If not qualified]:
"Based on what you've shared, I don't think we're the best fit right now.
Here's what I'd recommend instead: [alternative resource]
When [criteria changes], feel free to reach back out."

---

[CONFIRMATION - 3 min]

"Great! You're confirmed for [date/time].
You'll receive a calendar invite and text reminder.

A few things to make the most of this call:
1. Block off [X] minutes - no interruptions
2. Be in a quiet place
3. Come ready to [expectation]

Any questions before we hang up?

Looking forward to helping you [outcome]. Talk soon!"
```

---

## Post-Close Protocols

### Preventing Buyer's Remorse

```
IMMEDIATE REINFORCEMENT (On the call):

"You made a great decision today. Here's why:
1. [Reminder of their pain]
2. [Reminder of the solution]
3. [Reminder of the outcome]

You're going to look back on this as a turning point."

---

ANTICIPATE DOUBT:

"Quick heads up - over the next day or two, you might have second thoughts.
Your brain will come up with reasons why this won't work.
That's totally normal. It's called buyer's remorse.

When that happens, remember:
- You have [guarantee], so you're protected
- [X] other people have done exactly what you're about to do
- I wouldn't have let you sign up if I didn't think you'd succeed

If doubt creeps in, message me. I'll remind you why you made this decision."
```

### Setting Expectations

```
"Here's exactly what happens next:

IMMEDIATELY:
- You'll receive [confirmation email/welcome message]
- [Immediate access details]

WITHIN 24 HOURS:
- [Next step they should take]
- [What they'll receive from you]

FIRST WEEK:
- [Onboarding process]
- [First milestone]

FIRST 30 DAYS:
- [Expected progress]
- [Key checkpoint]

Your immediate next step is [specific action].
Can you do that in the next [time]?"
```

### Follow-Up Sequence (For Non-Closes)

```
FOLLOW-UP 1 (24 hours after call):

Subject: Quick follow-up from our call

Hey [Name],

Wanted to follow up on our conversation yesterday.

You mentioned [specific pain point] was really frustrating.
I kept thinking about it after we hung up.

Quick question: Have you made a decision about how to solve this?

[Your name]

---

FOLLOW-UP 2 (3 days after call):

Subject: Still thinking about [outcome]?

Hey [Name],

I know you mentioned needing to [think about it/talk to spouse/etc].

Just curious where your head is at.

If you have questions I didn't answer, I'm happy to jump on a quick call.

[Your name]

---

FOLLOW-UP 3 (7 days after call):

Subject: Closing the loop

Hey [Name],

I want to respect your time, so I'll keep this short.

Are you still interested in [solving problem]?

If yes - let's schedule a quick call to address any remaining questions.
If no - no worries at all. I'll close out your file.

Either way, let me know?

[Your name]
```

---

## Quality Metrics & Benchmarks

### Performance Tracking

```
ACTIVITY METRICS:
□ Calls completed per day: _____
□ Talk time per call: _____ minutes
□ Presentations given: _____
□ Objections encountered: _____

CONVERSION METRICS:
□ Show rate: _____% (Target: 75%+)
□ Close rate: _____% (Target: 25-35%+)
□ Cash collected: _____% (Target: 60%+)
□ Refund rate: _____% (Target: <5%)

QUALITY METRICS:
□ Discovery-to-pitch ratio: _____ (Target: 60%+)
□ Questions asked per call: _____ (Target: 10-15)
□ Closes attempted: _____ (Target: 5-7)
```

### Benchmark Targets

| Metric | Poor | Average | Good | Elite |
|--------|------|---------|------|-------|
| Show Rate | <50% | 60% | 75% | 85%+ |
| Close Rate | <15% | 25% | 35% | 50%+ |
| Avg Call Length | <30min | 40min | 50min | 60min |
| Cash Collected | <40% | 55% | 70% | 85%+ |
| Refund Rate | >15% | 10% | 5% | <3% |
| Closes Attempted | 1-2 | 3-4 | 5-6 | 7+ |

---

## Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|-----|
| Pitching too early | -50% close rate | Complete discovery FIRST |
| Not handling "think about it" | -30% close rate | Dig for the REAL objection |
| Weak urgency | -25% close rate | Add legitimate deadline |
| Not asking for the sale | -40% close rate | Always ask directly |
| Giving up after 1 no | -20% close rate | Average close takes 5-7 asks |
| Talking more than listening | -35% close rate | 60%+ should be questions |
| No post-close reinforcement | +15% refund rate | Always reinforce decision |

---

## Output Format

```yaml
generated_output:
  format: markdown
  sections:
    - call_framework_summary
    - opening_script
    - discovery_questions (customized)
    - transition_script
    - presentation_script
    - objection_scripts (per objection provided)
    - closing_sequences
    - post_close_protocol
    - follow_up_sequence
    - role_play_scenarios
    - tracking_scorecard
```

---

## Integration with Other Tasks

### Before This Task
- `avatar-research.md` - Understand your prospect deeply
- `create-offer.md` - Build the irresistible offer to sell

### After This Task
- `create-email-sequence.md` - Follow-up for non-closes
- `audit-landing-page.md` - Ensure landing page supports close

### Complementary Tasks
- `create-objection-algorithms.md` - Deep objection handling
- `build-authority-arsenal.md` - Proof for presentations

---

## References

### Primary Sources
- Ziglar, Zig. "Secrets of Closing the Sale" (1984)
- Sandler, David. "You Can't Teach a Kid to Ride a Bike at a Seminar" (1995)
- Rackham, Neil. "SPIN Selling" (1988)
- Cardone, Grant. "The Closer's Survival Guide" (2008)
- Hormozi, Alex. "$100M Offers" (2021)
- Miner, Jeremy. "NEPQ Black Book of Questions" (2023)

### Research Document
`squads/copy/docs/research/close-script-methodology-research.md`

---

*Task Version: 2.0.0*
*Last Updated: 2026-01-23*
*Primary Frameworks: CLOSER (Hormozi), Pain Funnel (Sandler), SPIN (Rackham), NEPQ (Miner)*
*Minimum Output: 600 lines*
