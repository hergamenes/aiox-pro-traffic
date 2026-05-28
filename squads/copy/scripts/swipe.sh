#!/bin/bash
# Swipe File Extraction Pipeline v1.0
# External bash loop - each phase runs in fresh Claude session
# Based on mmos.sh architecture - forces depth through structure
#
# SWIPE FILE EXTRACTION PLAYBOOK:
# - 8-Phase workflow for building structured copy library
# - 600-1100 entries across 9 categories
# - YAML output format for AI consumption
# - Quality validation with scoring
#
# Usage: ./swipe.sh <action> [options]

set -e

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COPY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TEMPLATES_DIR="$COPY_DIR/templates/swipe"
DOCS_DIR="$COPY_DIR/docs/frameworks"
AGENTS_DIR="$COPY_DIR/agents"
SWIPE_DIR="$COPY_DIR/swipe"

# Source locations - searches outputs/ automatically
OUTPUTS_DIR="$ROOT_DIR/outputs"
BOOKS_DIR="$OUTPUTS_DIR/books"
MINDS_DIR="$OUTPUTS_DIR/minds"

# Custom sources config (optional - create swipe.config to add extra paths)
CONFIG_FILE="$COPY_DIR/swipe.config"
CUSTOM_SOURCES=""
if [[ -f "$CONFIG_FILE" ]]; then
  source "$CONFIG_FILE"
fi

# Category target counts (from playbook)
TARGET_HEADLINES=200
TARGET_BULLETS=300
TARGET_LEADS=75
TARGET_EMAILS=75
TARGET_TRANSITIONS=50
TARGET_CLOSES=75
TARGET_FULL_PIECES=30
TARGET_NAMING=100
TARGET_HOOKS=150  # Video hooks, email hooks, story hooks, etc.

# ═══════════════════════════════════════════════════════════════
# TIER 0-3 SOURCE MAPPING (from playbook)
# ═══════════════════════════════════════════════════════════════

get_tier_sources() {
  case "$1" in
    tier0)
      echo "Claude Hopkins: Scientific Advertising, My Life in Advertising
Robert Collier: The Robert Collier Letter Book
Eugene Schwartz: Breakthrough Advertising, The Brilliance Breakthrough" ;;
    tier1)
      echo "Gary Bencivenga: Bencivenga Bullets (archive)
Gary Halbert: The Gary Halbert Letter, The Boron Letters
Clayton Makepeace: The Total Package Newsletter
Jim Rutz: Magalogs for Boardroom
Parris Lampropoulos: Bottom Line controls
David Deutsch: Boardroom controls" ;;
    tier2)
      echo "Dan Kennedy: No B.S. Series, Magnetic Marketing
Todd Brown: E5 Method materials
Stefan Georgi: RMBC Method materials
John Carlton: Simple Writing System, Kick-Ass Copywriting" ;;
    tier3)
      echo "Jon Benson: VSL Formula materials
Ben Settle: Email Players archives
Andre Chaperon: Autoresponder Madness
David Ogilvy: Confessions of an Advertising Man, Ogilvy on Advertising" ;;
  esac
}

# Category descriptions
get_category_info() {
  case "$1" in
    headlines)   echo "Headlines & Subject Lines|150-200|Attention-grabbing openers" ;;
    leads)       echo "Opening Leads|50-75|First 50-200 words hooks" ;;
    bullets)     echo "Fascinations & Bullets|200-300|Curiosity-driven benefit statements" ;;
    emails)      echo "Email Templates|50-75|Complete email structures" ;;
    transitions) echo "Transitions & Segues|30-50|Section connectors" ;;
    closes)      echo "Closes & CTAs|50-75|Action triggers" ;;
    full_pieces) echo "Full Copy Pieces|20-30|Complete sales letters/VSLs" ;;
    naming)      echo "Brand Names & Naming|100-150|Product/company naming patterns" ;;
    hooks)       echo "Opening Hooks|100-150|First 5-15 seconds/words pattern interrupts" ;;
  esac
}

# ═══════════════════════════════════════════════════════════════
# HELP & USAGE
# ═══════════════════════════════════════════════════════════════

show_help() {
  echo "📚 Swipe File Extraction Pipeline v1.0"
  echo ""
  echo "Usage: $0 <action> [options]"
  echo ""
  echo "Actions:"
  echo "  init                    Initialize swipe directory structure"
  echo "  extract <category>      Extract entries for a specific category"
  echo "  extract-all             Extract all categories (full pipeline)"
  echo "  validate <category>     Validate and score entries"
  echo "  audit                   Run quality audit on entire library"
  echo "  stats                   Show library statistics"
  echo "  search <query>          Search swipe file entries"
  echo "  enrich <category>       Add metadata to existing entries"
  echo "  export <format>         Export library (yaml|json|csv)"
  echo ""
  echo "Categories:"
  echo "  ┌─────────────────┬────────────┬─────────────────────────────────┐"
  echo "  │ Category        │ Target     │ Description                     │"
  echo "  ├─────────────────┼────────────┼─────────────────────────────────┤"
  echo "  │ headlines       │ 150-200    │ Headlines & Subject Lines       │"
  echo "  │ leads           │ 50-75      │ Opening Leads (first 50-200w)   │"
  echo "  │ bullets         │ 200-300    │ Fascinations & Bullets          │"
  echo "  │ emails          │ 50-75      │ Email Templates                 │"
  echo "  │ transitions     │ 30-50      │ Transitions & Segues            │"
  echo "  │ closes          │ 50-75      │ Closes & CTAs                   │"
  echo "  │ full_pieces     │ 20-30      │ Complete Sales Letters/VSLs     │"
  echo "  │ naming          │ 100-150    │ Brand Names & Naming Patterns   │"
  echo "  │ hooks           │ 100-150    │ Opening Hooks (first 5-15sec)   │"
  echo "  └─────────────────┴────────────┴─────────────────────────────────┘"
  echo ""
  echo "Examples:"
  echo "  $0 init                         # Create directory structure"
  echo "  $0 extract headlines            # Extract headlines only"
  echo "  $0 extract-all                  # Full extraction (all categories)"
  echo "  $0 validate bullets             # Validate bullet entries"
  echo "  $0 stats                        # Show current library status"
  echo "  $0 search \"fear of missing\"    # Search entries"
  echo ""
  echo "Pipeline Phases:"
  echo "  1. SOURCE IDENTIFICATION     - Map Tier 0-3 copywriter works"
  echo "  2. CONTENT INGESTION         - Load source materials"
  echo "  3. EXTRACTION                - Extract copy elements by category"
  echo "  4. VALIDATION                - Quality check each entry"
  echo "  5. ENRICHMENT                - Add metadata & context"
  echo "  6. ORGANIZATION              - Categorize & tag"
  echo "  7. AUDIT                     - Quality audit"
  echo "  8. MAINTENANCE               - Update & refresh"
  echo ""
  echo "Quality Criteria:"
  echo "  ★★★★★ (5) - Documented $1M+ results"
  echo "  ★★★★☆ (4) - From Tier 0-1 copywriter + clear mechanism"
  echo "  ★★★☆☆ (3) - From Tier 2-3 copywriter + good structure"
  echo "  ★★☆☆☆ (2) - Verified source + solid technique"
  echo "  ★☆☆☆☆ (1) - Needs review/improvement"
  echo ""
  exit 0
}

# ═══════════════════════════════════════════════════════════════
# DIRECTORY INITIALIZATION
# ═══════════════════════════════════════════════════════════════

init_swipe_file() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        📚 INITIALIZING SWIPE FILE LIBRARY                    ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  # Create main structure
  mkdir -p "$SWIPE_DIR"/{headlines,leads,bullets,emails,transitions,closes,full_pieces,naming,hooks}
  mkdir -p "$SWIPE_DIR"/_meta/{validation,stats,exports}
  mkdir -p "$SWIPE_DIR"/logs

  # Create category index files
  for category in headlines leads bullets emails transitions closes full_pieces naming hooks; do
    local index_file="$SWIPE_DIR/$category/_index.yaml"
    if [[ ! -f "$index_file" ]]; then
      local info=$(get_category_info "$category")
      local name=$(echo "$info" | cut -d'|' -f1)
      local target=$(echo "$info" | cut -d'|' -f2)
      local desc=$(echo "$info" | cut -d'|' -f3)

      cat > "$index_file" << EOF
# $name
# Target: $target entries
# $desc

category: $category
target_count: "${target}"
description: "$desc"
created: $(date -Iseconds)
entries: []
tags: []

# Quality distribution (target)
quality_distribution:
  5_star: "10%"
  4_star: "30%"
  3_star: "40%"
  2_star: "15%"
  1_star: "5%"
EOF
      echo "  ✅ Created $category/_index.yaml"
    fi
  done

  # Show source locations
  echo ""
  echo "  📍 Sources will be read from:"
  local books_count=$(find "$BOOKS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | wc -l | tr -d ' ')
  local minds_count=$(find "$MINDS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | wc -l | tr -d ' ')
  local frameworks_count=$(find "$DOCS_DIR" -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  echo "     $BOOKS_DIR ($books_count files)"
  echo "     $MINDS_DIR ($minds_count files)"
  echo "     $DOCS_DIR ($frameworks_count files)"

  # Create state file
  local state_file="$SWIPE_DIR/_meta/swipe-state.json"
  if [[ ! -f "$state_file" ]]; then
    cat > "$state_file" << EOF
{
  "status": "initialized",
  "created_at": "$(date -Iseconds)",
  "updated_at": "$(date -Iseconds)",
  "categories": {
    "headlines": {"count": 0, "target": $TARGET_HEADLINES, "validated": 0},
    "leads": {"count": 0, "target": $TARGET_LEADS, "validated": 0},
    "bullets": {"count": 0, "target": $TARGET_BULLETS, "validated": 0},
    "emails": {"count": 0, "target": $TARGET_EMAILS, "validated": 0},
    "transitions": {"count": 0, "target": $TARGET_TRANSITIONS, "validated": 0},
    "closes": {"count": 0, "target": $TARGET_CLOSES, "validated": 0},
    "full_pieces": {"count": 0, "target": $TARGET_FULL_PIECES, "validated": 0}
  },
  "quality_distribution": {
    "5_star": 0,
    "4_star": 0,
    "3_star": 0,
    "2_star": 0,
    "1_star": 0
  },
  "sources_ingested": [],
  "last_extraction": null,
  "last_validation": null,
  "last_audit": null
}
EOF
    echo "  ✅ Created _meta/swipe-state.json"
  fi

  # Create extraction prompt templates
  create_extraction_templates

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║              ✅ SWIPE FILE INITIALIZED                       ║"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║                                                              ║"
  echo "║  Output: $SWIPE_DIR"
  echo "║                                                              ║"
  echo "║  Categories:                                                 ║"
  echo "║    📁 headlines/      (150-200)                              ║"
  echo "║    📁 leads/          (50-75)                                ║"
  echo "║    📁 bullets/        (200-300)                              ║"
  echo "║    📁 emails/         (50-75)                                ║"
  echo "║    📁 transitions/    (30-50)                                ║"
  echo "║    📁 closes/         (50-75)                                ║"
  echo "║    📁 full_pieces/    (20-30)                                ║"
  echo "║    📁 naming/         (100-150)                              ║"
  echo "║                                                              ║"
  echo "║  Sources (auto-detected):                                    ║"
  echo "║    📚 outputs/books/  ($books_count files)                   ║"
  echo "║    🧠 outputs/minds/  ($minds_count files)                   ║"
  echo "║    📖 docs/frameworks ($frameworks_count files)              ║"
  echo "║                                                              ║"
  echo "║  Run: ./swipe.sh extract-all                                 ║"
  echo "║                                                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
}

# ═══════════════════════════════════════════════════════════════
# EXTRACTION TEMPLATES
# ═══════════════════════════════════════════════════════════════

create_extraction_templates() {
  mkdir -p "$TEMPLATES_DIR"

  # Headlines extraction template
  cat > "$TEMPLATES_DIR/extract-headlines.md" << 'EOF'
# HEADLINE EXTRACTION PROMPT

You are extracting headlines from proven copywriting sources for a swipe file library.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## EXTRACTION RULES

1. ONLY extract headlines that:
   - Have documented results (conversion, sales, response rate)
   - Come from Tier 0-3 copywriters
   - Demonstrate clear mechanism (curiosity, benefit, specificity)

2. For each headline, capture:
   - The exact headline text
   - Source (author, work, year)
   - Context (what it was selling)
   - Results if known
   - Why it works (technique breakdown)

3. YAML OUTPUT FORMAT (strict):
```yaml
- id: "hl_{{SLUG}}_001"
  text: "Exact headline text here"
  source:
    author: "Gary Halbert"
    work: "The Gary Halbert Letter"
    year: 1983
  context: "Selling coat of arms prints via direct mail"
  results: "600 million pieces mailed"
  technique:
    primary: "curiosity"
    secondary: ["specificity", "exclusivity"]
  awareness_level: "unaware"
  sophistication_stage: 1
  score: 5
  tags: ["direct_mail", "personalization", "family"]
  notes: "One of the most mailed pieces in history"
```

## QUALITY SCORING
- 5 stars: Documented $1M+ results OR legendary status
- 4 stars: From Tier 0-1 copywriter + clear winning mechanism
- 3 stars: From Tier 2-3 copywriter + solid structure
- 2 stars: Verified source + good technique
- 1 star: Needs validation or improvement

## OUTPUT
Extract ALL qualifying headlines. Output ONLY valid YAML array.
EOF

  # Bullets extraction template
  cat > "$TEMPLATES_DIR/extract-bullets.md" << 'EOF'
# BULLET/FASCINATION EXTRACTION PROMPT

You are extracting bullets (fascinations) from proven copywriting sources.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## WHAT MAKES A GREAT BULLET
From Bencivenga + Lampropoulos:
- Specific benefit (numbers, timeframes)
- Curiosity gap (makes you NEED to know)
- Implied proof (studies, experts)
- Page reference when applicable
- Contrarian angle (challenges beliefs)

## EXTRACTION RULES

1. ONLY extract bullets that:
   - Create genuine curiosity
   - Contain specific benefit
   - Come from verified sources

2. For each bullet, capture:
   - Exact text
   - Source
   - Bullet type (contrarian, specific_benefit, curiosity_gap, fear_based, proof_based)
   - Why it works

3. YAML OUTPUT FORMAT:
```yaml
- id: "bl_{{SLUG}}_001"
  text: "The $47,000 mistake that 93% of investors make every month — and how to profit when they lose (page 34)"
  source:
    author: "Gary Bencivenga"
    work: "Financial Promo"
    year: 1995
  type: "contrarian"
  components:
    specific_number: "$47,000"
    curiosity_element: "mistake"
    benefit: "profit when they lose"
    page_reference: "page 34"
  technique_notes: "Combines specific number + contrarian + benefit + page hook"
  score: 5
  tags: ["financial", "contrarian", "number_specificity"]
```

## BULLET TYPES
- contrarian: "Why [common belief] is wrong"
- specific_benefit: "How to [result] in [time] without [sacrifice]"
- curiosity_gap: "The [person]'s technique for [benefit]"
- fear_based: "Warning sign of [problem] that [%] ignore"
- proof_based: "[Institution] study reveals [discovery]"

## OUTPUT
Extract ALL qualifying bullets. Output ONLY valid YAML array.
EOF

  # Leads extraction template
  cat > "$TEMPLATES_DIR/extract-leads.md" << 'EOF'
# LEAD EXTRACTION PROMPT

You are extracting opening leads (first 50-200 words) from proven copy.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## LEAD TYPES (from Schwartz)
1. Direct Lead: States offer/benefit immediately
2. Indirect Lead: Builds to offer through story/intrigue
3. News Lead: Announces breakthrough/discovery
4. How-to Lead: Promises specific instruction
5. Question Lead: Engages with compelling question
6. Command Lead: Direct order to reader
7. Story Lead: Opens with narrative

## EXTRACTION RULES

1. ONLY extract leads that:
   - Hook attention in first sentence
   - Match awareness level appropriately
   - Create irresistible pull to continue

2. For each lead, capture:
   - Full lead text (50-200 words)
   - Source
   - Lead type
   - Target awareness level
   - Why it works

3. YAML OUTPUT FORMAT:
```yaml
- id: "ld_{{SLUG}}_001"
  text: |
    Dear Friend,

    If you've ever wanted to discover the secrets of...
    [full lead text here]
  source:
    author: "Gary Halbert"
    work: "The Boron Letters"
    year: 1984
  lead_type: "story"
  awareness_level: "problem_aware"
  target_market: "entrepreneurs"
  word_count: 127
  technique_notes: "Personal opening + curiosity + implied benefit"
  score: 5
  tags: ["personal", "story", "curiosity"]
```

## OUTPUT
Extract ALL qualifying leads. Output ONLY valid YAML array.
EOF

  # Emails extraction template
  cat > "$TEMPLATES_DIR/extract-emails.md" << 'EOF'
# EMAIL EXTRACTION PROMPT

You are extracting email templates from proven email copywriters.

## SOURCE MATERIAL
{{SOURCE_CONTENT}}

## EMAIL TYPES
1. Infotainment (Ben Settle style): Story + lesson + pitch
2. Soap Opera Sequence (Chaperon): Multi-email story arc with open loops
3. Launch Email: Part of product launch sequence
4. Broadcast: Regular list email
5. Abandoned Cart: Recovery email
6. Welcome: New subscriber onboarding

## EXTRACTION RULES

1. For each email, capture:
   - Subject line
   - Full body text
   - CTA
   - Position in sequence (if applicable)
   - Email type

2. YAML OUTPUT FORMAT:
```yaml
- id: "em_{{SLUG}}_001"
  subject: "The weird thing that happened at the grocery store..."
  body: |
    [Full email body here]
  cta:
    text: "Click here to learn more"
    position: "end"
  source:
    author: "Ben Settle"
    work: "Email Players"
    year: 2018
  email_type: "infotainment"
  sequence_position: null  # or 1-5 for sequences
  word_count: 342
  technique_notes: "Story hook + personality + soft pitch"
  score: 4
  tags: ["infotainment", "story", "daily_email"]
```

## OUTPUT
Extract ALL qualifying emails. Output ONLY valid YAML array.
EOF

  # Transitions extraction template
  cat > "$TEMPLATES_DIR/extract-transitions.md" << 'EOF'
# TRANSITION EXTRACTION PROMPT

You are extracting transitions and segues from proven copy.

## TRANSITION TYPES
1. Problem → Solution: "But here's the good news..."
2. Story → Pitch: "That's when I realized..."
3. Feature → Benefit: "What this means for you..."
4. Proof → Offer: "And now you can have..."
5. Objection → Handle: "Now, you might be thinking..."

## EXTRACTION RULES

1. For each transition, capture:
   - Exact text
   - What it connects (from → to)
   - Why it works

2. YAML OUTPUT FORMAT:
```yaml
- id: "tr_{{SLUG}}_001"
  text: "But here's where it gets really interesting..."
  source:
    author: "Gary Halbert"
    work: "Sales Letter"
    year: 1992
  transition_type: "story_to_pitch"
  connects:
    from: "story"
    to: "product_intro"
  technique_notes: "Creates curiosity while pivoting"
  score: 4
  tags: ["story", "curiosity", "pivot"]
```

## OUTPUT
Extract ALL qualifying transitions. Output ONLY valid YAML array.
EOF

  # Closes extraction template
  cat > "$TEMPLATES_DIR/extract-closes.md" << 'EOF'
# CLOSE/CTA EXTRACTION PROMPT

You are extracting closes and CTAs from proven copy.

## CLOSE TYPES
1. Direct Close: "Click here to order now"
2. Assumptive Close: "When you receive your package..."
3. Urgency Close: "But you must act before midnight..."
4. Risk Reversal: "And if you're not thrilled..."
5. P.S. Close: Final push in postscript
6. Summary Close: Recap of benefits before ask

## EXTRACTION RULES

1. For each close, capture:
   - Full text including surrounding context
   - Close type
   - Urgency elements
   - Risk reversal elements

2. YAML OUTPUT FORMAT:
```yaml
- id: "cl_{{SLUG}}_001"
  text: |
    So here's what I want you to do right now...
    [full close text]
  source:
    author: "Dan Kennedy"
    work: "Sales Letter"
    year: 2005
  close_type: "direct"
  elements:
    urgency: "limited time"
    risk_reversal: "60-day guarantee"
    scarcity: "only 100 available"
  cta_text: "Click Here to Claim Your Spot"
  technique_notes: "Combines urgency + scarcity + risk reversal"
  score: 4
  tags: ["urgency", "scarcity", "guarantee"]
```

## OUTPUT
Extract ALL qualifying closes. Output ONLY valid YAML array.
EOF

  # Full pieces extraction template
  cat > "$TEMPLATES_DIR/extract-full-pieces.md" << 'EOF'
# FULL PIECE EXTRACTION PROMPT

You are cataloging complete sales pieces for reference.

## PIECE TYPES
1. Long-form Sales Letter
2. VSL Script
3. Magalog
4. Email Sequence (complete)
5. Landing Page
6. Advertorial

## EXTRACTION RULES

1. For each piece, capture:
   - Title/identifier
   - Full text OR summary with key sections
   - Structure breakdown
   - Results if known

2. YAML OUTPUT FORMAT:
```yaml
- id: "fp_{{SLUG}}_001"
  title: "Family Crest Letter"
  source:
    author: "Gary Halbert"
    work: "Direct Mail Campaign"
    year: 1971
  piece_type: "long_form_letter"
  length_words: 800
  results:
    pieces_mailed: "600 million"
    response_rate: "high"
    revenue: "multi-million"
  structure:
    - section: "headline"
      technique: "personalization"
    - section: "lead"
      technique: "curiosity + family"
    - section: "body"
      technique: "story + scarcity"
    - section: "close"
      technique: "simple order form"
  full_text: |
    [Complete text if available, otherwise detailed summary]
  key_takeaways:
    - "Personalization at scale"
    - "Simple offer, big promise"
    - "Mass market appeal with personal feel"
  score: 5
  tags: ["direct_mail", "personalization", "legendary"]
```

## OUTPUT
Catalog ALL qualifying pieces. Output ONLY valid YAML array.
EOF

  echo "  ✅ Created extraction templates in $TEMPLATES_DIR"
}

# ═══════════════════════════════════════════════════════════════
# EXTRACTION FUNCTIONS
# ═══════════════════════════════════════════════════════════════

extract_category() {
  local category="$1"
  local max_iterations="${2:-10}"
  local log_file="$SWIPE_DIR/logs/extract-${category}-$(date +%Y%m%d).log"
  local template_file="$TEMPLATES_DIR/extract-${category}.md"
  local output_dir="$SWIPE_DIR/$category"
  local state_file="$SWIPE_DIR/_meta/swipe-state.json"

  # Validate category
  local valid_categories="headlines leads bullets emails transitions closes full_pieces naming hooks"
  if [[ ! " $valid_categories " =~ " $category " ]]; then
    echo "❌ Invalid category: $category"
    echo "   Valid categories: $valid_categories"
    exit 1
  fi

  # Check template exists
  if [[ ! -f "$template_file" ]]; then
    echo "❌ Template not found: $template_file"
    echo "   Run: ./swipe.sh init"
    exit 1
  fi

  local info=$(get_category_info "$category")
  local cat_name=$(echo "$info" | cut -d'|' -f1)
  local cat_target=$(echo "$info" | cut -d'|' -f2)

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        📝 EXTRACTING: $cat_name"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  Target: $cat_target entries"
  echo "║  Output: $output_dir"
  echo "║  Max Iterations: $max_iterations"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  # Find source materials from outputs/books and outputs/minds
  echo "🔍 Scanning for sources in $OUTPUTS_DIR..."

  local sources=""
  local source_count=0

  # Search in outputs/books/
  if [[ -d "$BOOKS_DIR" ]]; then
    local book_sources=$(find "$BOOKS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) ! -name "*.metadata.json" ! -name "*.timestamps.json" 2>/dev/null | head -50)
    if [[ -n "$book_sources" ]]; then
      sources="$sources $book_sources"
      source_count=$((source_count + $(echo "$book_sources" | wc -l | tr -d ' ')))
    fi
  fi

  # Search in outputs/minds/
  if [[ -d "$MINDS_DIR" ]]; then
    local mind_sources=$(find "$MINDS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) ! -name "*.metadata.json" ! -name "*.timestamps.json" 2>/dev/null | head -50)
    if [[ -n "$mind_sources" ]]; then
      sources="$sources $mind_sources"
      source_count=$((source_count + $(echo "$mind_sources" | wc -l | tr -d ' ')))
    fi
  fi

  # Also search frameworks (contains copywriter examples)
  if [[ -d "$DOCS_DIR" ]]; then
    local framework_sources=$(find "$DOCS_DIR" -type f -name "*.md" 2>/dev/null)
    if [[ -n "$framework_sources" ]]; then
      sources="$sources $framework_sources"
      source_count=$((source_count + $(echo "$framework_sources" | wc -l | tr -d ' ')))
    fi
  fi

  # Search custom sources from swipe.config
  if [[ ${#CUSTOM_SOURCES[@]} -gt 0 ]]; then
    for custom_dir in "${CUSTOM_SOURCES[@]}"; do
      if [[ -d "$custom_dir" ]]; then
        local custom_files=$(find "$custom_dir" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | head -50)
        if [[ -n "$custom_files" ]]; then
          sources="$sources $custom_files"
          source_count=$((source_count + $(echo "$custom_files" | wc -l | tr -d ' ')))
          echo "   + Custom: $custom_dir"
        fi
      fi
    done
  fi

  echo "   Found $source_count source files"

  if [[ -z "$sources" || "$source_count" -eq 0 ]]; then
    echo "⚠️  No source materials found"
    echo ""
    echo "   Expected locations:"
    echo "     $BOOKS_DIR/"
    echo "     $MINDS_DIR/"
    echo "     $DOCS_DIR/"
    exit 1
  fi

  # Build extraction prompt
  local template_content=$(cat "$template_file")
  local frameworks_context=""

  # Add relevant framework context
  case "$category" in
    headlines)
      frameworks_context=$(cat "$DOCS_DIR/02-TIER0-FOUNDATION-AI-OPTIMIZED.md" 2>/dev/null | head -200)
      ;;
    bullets)
      frameworks_context=$(cat "$DOCS_DIR/03-TIER1-MASTERS-AI-OPTIMIZED.md" 2>/dev/null | head -200)
      ;;
    emails)
      frameworks_context=$(cat "$DOCS_DIR/05-TIER3-SPECIALISTS-AI-OPTIMIZED.md" 2>/dev/null | head -200)
      ;;
  esac

  for iter in $(seq 1 $max_iterations); do
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "═══ $cat_name Extraction | Iteration $iter ═══"
    echo "═══════════════════════════════════════════════════════════"
    echo "🚀 Starting at $(date +%H:%M:%S)"

    # Prepare prompt
    local EXTRACTION_PROMPT="SWIPE_DIR=$SWIPE_DIR
CATEGORY=$category
OUTPUT_DIR=$output_dir
ITERATION=$iter

You are running the Swipe File Extraction Pipeline for category: $cat_name

## TASK
Extract $category from the source materials and frameworks below.

## FRAMEWORK CONTEXT
$frameworks_context

## TEMPLATE
$template_content

## SOURCES AVAILABLE
$sources

## INSTRUCTIONS
1. Read source materials from SOURCES_DIR
2. Apply the extraction template rules
3. Create YAML output files in $output_dir
4. Each file should be named: ${category}_batch_${iter}.yaml
5. Validate each entry against quality criteria
6. When batch is complete, emit: <promise>EXTRACTION_BATCH_COMPLETE</promise>

## QUALITY RULES
- Only include entries with verifiable sources
- Score each entry 1-5 stars
- Prioritize Tier 0-1 sources
- Include technique breakdown for each entry

Begin extraction now."

    # Run Claude
    local OUTPUT=$(claude -p --dangerously-skip-permissions "$EXTRACTION_PROMPT" 2>&1 | tee -a "$log_file") || true

    echo "⏱️  Iteration $iter completed at $(date +%H:%M:%S)"

    # Check for completion
    if echo "$OUTPUT" | grep -q "<promise>EXTRACTION_BATCH_COMPLETE</promise>"; then
      echo "✅ Batch $iter complete!"

      # Count entries created
      local new_count=$(find "$output_dir" -name "*.yaml" -newer "$state_file" 2>/dev/null | wc -l | tr -d ' ')
      echo "   New files: $new_count"
    fi

    # Check if target reached
    local current_count=$(find "$output_dir" -name "*.yaml" ! -name "_index.yaml" 2>/dev/null | wc -l | tr -d ' ')
    local target_min=$(echo "$cat_target" | cut -d'-' -f1)

    if [[ "$current_count" -ge "$target_min" ]]; then
      echo "🎯 Target reached! $current_count entries (target: $cat_target)"
      break
    fi

    sleep 2
  done

  # Update state
  local final_count=$(find "$output_dir" -name "*.yaml" ! -name "_index.yaml" 2>/dev/null | wc -l | tr -d ' ')

  # Update state file with jq
  if command -v jq &> /dev/null; then
    cat "$state_file" | jq ".categories.\"$category\".count = $final_count | .updated_at = \"$(date -Iseconds)\" | .last_extraction = \"$(date -Iseconds)\"" > "$state_file.tmp" && mv "$state_file.tmp" "$state_file"
  fi

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        ✅ EXTRACTION COMPLETE: $cat_name"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  Entries: $final_count (target: $cat_target)"
  echo "║  Output: $output_dir"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
}

extract_all() {
  local max_iterations="${1:-10}"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        🚀 FULL SWIPE FILE EXTRACTION                         ║"
  echo "║                                                              ║"
  echo "║  Running all 9 categories sequentially                       ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  local categories="headlines leads bullets emails transitions closes full_pieces naming hooks"
  local completed=0
  local total=9

  for category in $categories; do
    completed=$((completed + 1))
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  [$completed/$total] Extracting: $category"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    extract_category "$category" "$max_iterations"
  done

  echo ""
  show_stats
}

# ═══════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════

validate_category() {
  local category="$1"
  local output_dir="$SWIPE_DIR/$category"
  local validation_dir="$SWIPE_DIR/_meta/validation"
  local log_file="$SWIPE_DIR/logs/validate-${category}-$(date +%Y%m%d).log"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        🔍 VALIDATING: $category"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  local VALIDATION_PROMPT="SWIPE_DIR=$SWIPE_DIR
CATEGORY=$category
OUTPUT_DIR=$output_dir

You are running quality validation on the $category swipe file entries.

## VALIDATION CRITERIA

### Specificity Test
- Does it contain specific numbers/percentages?
- Does it name specific things (people, places, methods)?

### Benefit Test
- Is the benefit clear and desirable?
- Does it promise transformation?

### Source Test
- Is the source documented?
- Is it from Tier 0-3 copywriter or documented results?

### Curiosity Test
- Does it create an open loop?
- Would you need to read more to satisfy curiosity?

## SCORING
- 5 stars: Passes ALL tests + documented results
- 4 stars: Passes ALL tests
- 3 stars: Passes 3/4 tests
- 2 stars: Passes 2/4 tests
- 1 star: Needs improvement

## TASK
1. Read all YAML files in $output_dir
2. Validate each entry against criteria
3. Update scores where needed
4. Flag entries that need review
5. Create validation report at $validation_dir/${category}_validation.yaml
6. When complete, emit: <promise>VALIDATION_COMPLETE</promise>

Begin validation now."

  local OUTPUT=$(claude -p --dangerously-skip-permissions "$VALIDATION_PROMPT" 2>&1 | tee -a "$log_file") || true

  if echo "$OUTPUT" | grep -q "<promise>VALIDATION_COMPLETE</promise>"; then
    echo "✅ Validation complete for $category"
  fi
}

# ═══════════════════════════════════════════════════════════════
# STATISTICS
# ═══════════════════════════════════════════════════════════════

show_stats() {
  local state_file="$SWIPE_DIR/_meta/swipe-state.json"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║                📊 SWIPE FILE STATISTICS                      ║"
  echo "╠══════════════════════════════════════════════════════════════╣"

  if [[ ! -f "$state_file" ]]; then
    echo "║  ⚠️  Swipe file not initialized                             ║"
    echo "║  Run: ./swipe.sh init                                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    return
  fi

  # Count files in each category
  local total=0
  echo "║                                                              ║"
  echo "║  Category          Count       Target      Progress          ║"
  echo "║  ─────────────────────────────────────────────────────────   ║"

  for category in headlines leads bullets emails transitions closes full_pieces naming hooks; do
    local count=$(find "$SWIPE_DIR/$category" -name "*.yaml" ! -name "_index.yaml" 2>/dev/null | wc -l | tr -d ' ')
    local info=$(get_category_info "$category")
    local target=$(echo "$info" | cut -d'|' -f2)
    local target_min=$(echo "$target" | cut -d'-' -f1)
    local progress=""

    if [[ "$count" -ge "$target_min" ]]; then
      progress="✅"
    elif [[ "$count" -gt 0 ]]; then
      progress="🔄"
    else
      progress="⬜"
    fi

    total=$((total + count))
    printf "║  %-15s   %-10s  %-10s  %s                   ║\n" "$category" "$count" "$target" "$progress"
  done

  echo "║  ─────────────────────────────────────────────────────────   ║"
  printf "║  TOTAL             %-10s  600-955                       ║\n" "$total"
  echo "║                                                              ║"

  # Source status
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  Sources (auto-detected from outputs/):                      ║"

  local books_count=$(find "$BOOKS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | wc -l | tr -d ' ')
  local minds_count=$(find "$MINDS_DIR" -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | wc -l | tr -d ' ')
  local frameworks_count=$(find "$DOCS_DIR" -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

  printf "║    📚 books/      %4s files                                ║\n" "$books_count"
  printf "║    🧠 minds/      %4s files                                ║\n" "$minds_count"
  printf "║    📖 frameworks  %4s files                                ║\n" "$frameworks_count"

  echo "║                                                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
}

# ═══════════════════════════════════════════════════════════════
# SEARCH
# ═══════════════════════════════════════════════════════════════

search_swipe() {
  local query="$1"

  echo ""
  echo "🔍 Searching swipe file for: \"$query\""
  echo ""

  # Search all YAML files
  grep -r -i -l "$query" "$SWIPE_DIR"/*/*.yaml 2>/dev/null | while read file; do
    echo "📄 $file"
    grep -i -B2 -A2 "$query" "$file" | head -10
    echo ""
  done
}

# ═══════════════════════════════════════════════════════════════
# AUDIT
# ═══════════════════════════════════════════════════════════════

run_audit() {
  local log_file="$SWIPE_DIR/logs/audit-$(date +%Y%m%d).log"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        🔍 RUNNING QUALITY AUDIT                              ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  local AUDIT_PROMPT="SWIPE_DIR=$SWIPE_DIR

You are running a quality audit on the entire swipe file library.

## AUDIT CHECKLIST

### Coverage Audit
- [ ] All categories have minimum entries
- [ ] Balanced representation across Tiers
- [ ] No over-reliance on single author

### Quality Audit
- [ ] Score distribution is reasonable (bell curve)
- [ ] All 5-star entries have documented results
- [ ] Sources are properly attributed

### Freshness Audit
- [ ] Check for duplicates
- [ ] Flag outdated entries
- [ ] Identify gaps in coverage

### Usability Audit
- [ ] YAML is valid and parseable
- [ ] Tags are consistent
- [ ] Metadata is complete

## TASK
1. Analyze all categories
2. Create comprehensive audit report
3. List specific issues found
4. Recommend improvements
5. Save report to $SWIPE_DIR/_meta/audit-$(date +%Y%m%d).md
6. When complete, emit: <promise>AUDIT_COMPLETE</promise>

Begin audit now."

  local OUTPUT=$(claude -p --dangerously-skip-permissions "$AUDIT_PROMPT" 2>&1 | tee -a "$log_file") || true

  if echo "$OUTPUT" | grep -q "<promise>AUDIT_COMPLETE</promise>"; then
    echo "✅ Audit complete"
    echo "📄 Report: $SWIPE_DIR/_meta/audit-$(date +%Y%m%d).md"
  fi
}

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

# Handle no arguments
if [[ -z "$1" ]]; then
  show_help
fi

ACTION="$1"
shift

case "$ACTION" in
  init)
    init_swipe_file
    ;;
  extract)
    if [[ -z "$1" ]]; then
      echo "❌ Category required"
      echo "   Usage: $0 extract <category>"
      exit 1
    fi
    extract_category "$1" "${2:-10}"
    ;;
  extract-all)
    extract_all "${1:-10}"
    ;;
  validate)
    if [[ -z "$1" ]]; then
      echo "❌ Category required"
      echo "   Usage: $0 validate <category>"
      exit 1
    fi
    validate_category "$1"
    ;;
  audit)
    run_audit
    ;;
  stats)
    show_stats
    ;;
  search)
    if [[ -z "$1" ]]; then
      echo "❌ Search query required"
      echo "   Usage: $0 search <query>"
      exit 1
    fi
    search_swipe "$1"
    ;;
  --help|-h|help)
    show_help
    ;;
  *)
    echo "❌ Unknown action: $ACTION"
    echo "   Run: $0 --help"
    exit 1
    ;;
esac
