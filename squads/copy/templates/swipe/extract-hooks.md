# EXTRACT-HOOKS Template
# Opening Hooks - First 5-15 seconds/words pattern interrupts
# Based on Hormozi Framework: $100M Money Models + David Ogilvy SwipeFile

## CONTEXT

You are extracting **Opening Hooks** for a copy swipe file library.

Hooks are NOT the same as headlines. Hooks are:
- The first 5-15 seconds of video (VSL/Reels/YouTube)
- The first 7-15 words of any copy piece
- Pattern interrupts that STOP the scroll
- Designed for 0.3-second decision making

## HOOK TYPES (8 Categories from Hormozi)

1. **Labels** - Identity markers: "Local business owners..."
2. **Questions** - Yes/Open questions: "Is it possible to...?"
3. **Conditionals** - If/then structure: "If you're X, then Y"
4. **Commands** - Direct orders: "Read this if...", "Stop scrolling"
5. **Statements** - Bold claims: "The rumors are true..."
6. **Lists/Steps** - Numbered format: "28 ways to..."
7. **Narratives** - Story openers: "One day I was...", "472 days ago..."
8. **Exclamations** - Pattern interrupts: "Wait!", "Ahhhhh..."

## HOOK TRIGGERS (7 Primitive Triggers)

1. **FOMO** - Fear of missing out
2. **Gain** - Quick profit/benefit promised
3. **Identity** - Instant identification ("this is for me")
4. **Curiosity** - Impossible to ignore gap
5. **Controversy** - Calculated contradiction
6. **Social Proof** - Massive numbers/authority
7. **Novelty** - Shocking new information

## YAML FORMAT (Output Structure)

```yaml
# hooks_batch_{N}.yaml
# Extracted from: [SOURCE]
# Date: YYYY-MM-DD
# Entries: {count}

entries:
  - id: "hook_001"
    text: "The rumors are true..."
    type: "Statement"
    subtype: "Confirmation + Twist"
    triggers:
      - "Curiosity Gap"
      - "FOMO"
    numbers: null  # or specific numbers used
    formula: "[The rumors are true + ellipsis + unexpected truth]"
    context: "Video/Email/Ad"  # Where this hook was used
    result: "Used 6x in $100M Money Models launch (tested against 1000+ variations)"
    best_for:
      - "Product launches"
      - "Reveals"
      - "Controversial topics"
    source: "Alex Hormozi - $100M Money Models Campaign"
    rating: 5  # 1-5 stars based on documented performance

  - id: "hook_002"
    text: "At 60 miles an hour, the loudest noise in this new Rolls-Royce comes from the electric clock"
    type: "Statement"
    subtype: "Proof/Quality Signal"
    triggers:
      - "Specificity"
      - "Curiosity"
      - "Quality Signal"
    numbers: "60 miles an hour"
    formula: "[Specific number] + [Condition] + [Extreme quality proof]"
    context: "Print Ad"
    result: "50% increase in sales (1958) with only $50k budget"
    best_for:
      - "Premium products"
      - "Luxury positioning"
      - "Technical superiority"
    source: "David Ogilvy - Rolls-Royce"
    rating: 5
```

## TOP FORMULAS TO EXTRACT (20 Patterns)

### Pattern 1: The Rumors Hook
**Structure:** "The rumors are true... [unexpected truth about X]"
**Example:** "The rumors are true... There IS a million-dollar secret"
**Use:** Confirmations with twist, reveals

### Pattern 2: The Contradiction Hook
**Structure:** "You don't need [what everyone thinks]. You need [real solution]."
**Example:** "You don't need cheaper leads."
**Use:** Breaking limiting beliefs

### Pattern 3: The Transformation Story
**Structure:** "I went from [bad + specific number] to [good + specific number]"
**Example:** "I went from losing $20 on every customer to making $240 profit"
**Use:** Before/after with specificity

### Pattern 4: The Two Types Dichotomy
**Structure:** "There are two types of [people]:"
**Example:** "There are two types of business owners:"
**Use:** Identity positioning, self-selection

### Pattern 5: The Hypothetical Scenario
**Structure:** "If I [constraint/situation], here's exactly what I would do"
**Example:** "If I only had 90 days in a brand new town"
**Use:** Demonstrating competence through scenarios

### Pattern 6: The Shocking Statistic
**Structure:** "What if I told you that [X%] of [group] are [unexpected situation]"
**Example:** "What if I told you that 90% of businesses are losing money"
**Use:** Creating urgency through data

### Pattern 7: The Time Investment
**Structure:** "It took me [X years/days] to learn this"
**Example:** "It took me 8 years to learn this"
**Use:** Valuing knowledge through contrast

### Pattern 8: The Authority Stack
**Structure:** "I have [massive accomplishment] and this is the only [thing you need]"
**Example:** "I have read over 1,000 books on business"
**Use:** Establishing authority with impressive numbers

### Pattern 9: The Smart vs Dumb
**Structure:** "Smart [people] do [X]. Dumb [people] do [Y]."
**Example:** "Smart business owners make money from customers."
**Use:** Clear contrast between approaches

### Pattern 10: The Question Hook
**Structure:** "Is it possible to [specific result] in [specific timeframe]?"
**Example:** "Is it possible to 3x your customer value in 90 days?"
**Use:** Opening with possibility

### Pattern 11: The Identity Qualifier
**Structure:** "If you're [demographic] and [situation/desire]"
**Example:** "If you're 25 to 55 and own a business"
**Use:** Segmenting and qualifying audience

### Pattern 12: The Time Promise
**Structure:** "In the next [X seconds/minutes], I'm going to show you [specific thing]"
**Example:** "In the next 60 seconds, I'm going to show you why 95% of businesses struggle"
**Use:** Creating urgency and commitment

### Pattern 13: The Better Than Hook
**Structure:** "This [thing] will teach you more than [expensive/prestigious alternative]"
**Example:** "This book will teach you more than a $200,000 MBA"
**Use:** Positioning value through comparison

### Pattern 14: The FAQ Opener
**Structure:** "A lot of people ask me [common question]"
**Example:** "A lot of people ask me what's better:"
**Use:** Answering common doubts

### Pattern 15: The First Achievement
**Structure:** "Want to be the first [achievement] in your [group]?"
**Example:** "Want to be the first millionaire in your family?"
**Use:** Appealing to aspiration and legacy

### Pattern 16: The Specific Time Ago
**Structure:** "[Specific time] ago, I started [X]"
**Example:** "472 days ago, I started writing a book"
**Use:** Specificity creates credibility

### Pattern 17: The Pattern Interrupt
**Structure:** Visual/Sound + "You might be wondering why..."
**Example:** [Catching banana] "You might be wondering why I just caught a banana..."
**Use:** Video hooks, stopping scroll

### Pattern 18: The Confession Open
**Structure:** "I have a confession..." + controversial truth
**Example:** "I have a confession... I used to think [common belief] too"
**Use:** Building trust through vulnerability

### Pattern 19: The Mirror Question
**Structure:** "Have you ever [universal but unadmitted situation]?"
**Example:** "Have you ever looked in the mirror and thought 'I should be further ahead by now?'"
**Use:** Quick emotional connection

### Pattern 20: The Real Quick
**Structure:** "Real quick question/Real quick..."
**Example:** "Real quick question: What's your email?"
**Use:** Implies brevity, reduces resistance

## EXTRACTION RULES

1. **ALWAYS capture the exact text** - Word for word
2. **Identify the TYPE** from the 8 categories
3. **Map TRIGGERS** from the 7 primitives
4. **Extract NUMBERS** if present (they're "magic")
5. **Reverse-engineer the FORMULA** (replicable pattern)
6. **Note CONTEXT** (video, email, ad, etc.)
7. **Document RESULTS** if known (test data, sales, etc.)
8. **Rate 1-5** based on documented performance

## MAGIC NUMBERS (Patterns That Recur)

- **90 days** (time constraint)
- **3x, 7.5x, 10x** (multipliers)
- **$200,000** (comparison value)
- **472 days** (extreme specificity)
- **95%/5%** (market division)
- **two types** (dichotomy)
- **1,000+** (authority numbers)

## QUALITY CHECKLIST

- [ ] Hook is <=15 words
- [ ] Has clear pattern interrupt element
- [ ] Triggers at least 2 primitive triggers
- [ ] Formula is replicable (not one-off)
- [ ] Context is clearly identified
- [ ] Source is documented
- [ ] Rating is justified

## SOURCES TO PRIORITIZE

1. **Hormozi** - $100M Leads, Money Models campaigns
2. **David Ogilvy** - Classic 40 hooks
3. **Gary Halbert** - Newsletter openings
4. **Ben Settle** - Email subject lines + first lines
5. **Jon Benson** - VSL openings
6. **John Carlton** - One-legged golfer style
7. **Tested ads** - Any with documented results
