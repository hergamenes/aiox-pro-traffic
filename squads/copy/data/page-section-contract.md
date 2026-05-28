# Page Section Contract

## Metadata

```yaml
id: page-section-contract
version: "1.0.0"
type: delivery-contract
load: ON_PAGE_DELIVERY
scope: "Renderable page outputs only"
purpose: "Map copy section markers to builder keys and downstream page structure"
```

## Rule

Any copy intended to become a renderable page must use inline HTML comment markers:

```markdown
<!-- sectionKey -->
Section content
<!-- /sectionKey -->
```

## Why This Format

- Invisible in Markdown review flows
- Explicit start and end boundaries for parsers
- Stable enough for builder handoff and component mapping

## Output Types That Must Use Section Markers

| Output Type | Markers Required | Notes |
|---|---:|---|
| `sales-page` | yes | builder-ready page |
| `sales-letter` | yes | long-form page |
| `capture-page` | yes | opt-in page |
| `landing-page` | yes | page builder target |
| `registration-page` | yes | event page |
| `upsell-page` | yes | post-purchase page |
| `vsl-page` | yes | video page |
| `link-bio-page` | yes | link hub |
| `email-sequence` | no | not builder-rendered |
| `ads` | no | not builder-rendered |
| `social-post` | no | not builder-rendered |
| `vsl-script` | no | recording script, not page |

## Valid Section Keys by Page Family

### Core page sections

- `hero`
- `problem`
- `beforeAfter`
- `features`
- `socialProof`
- `testimonials`
- `bio`
- `pricing`
- `guarantee`
- `faq`
- `ctaCard`
- `captureForm`
- `footer`

### Letter-style sections

- `envelope`
- `headline`
- `subheadline`
- `sender`
- `opening`
- `agitation`
- `mechanism`
- `proof`
- `comparison`
- `bullets`
- `qualify`
- `qualifyNegative`
- `offer`
- `closing`
- `ps`

### Special sections

- `event`
- `form`
- `host`
- `congrats`
- `video`
- `cta`
- `linkProfile`
- `linkItems`
- `linkBio`
- `linkFooter`

## Example

```markdown
<!-- hero -->
# Headline
### Supporting promise
[CTA]
<!-- /hero -->

<!-- problem -->
## Symptoms your reader already recognizes
- Pain 1
- Pain 2
<!-- /problem -->

<!-- offer -->
## What they get
Offer stack here.
<!-- /offer -->
```

## Delivery Rules

- Use only the keys listed in this contract.
- Always open and close each section explicitly.
- Keep notes, alternates, and writer comments outside section markers.
- If a section does not map cleanly, choose the closest valid key instead of inventing a new one.

## Related File

Use [builder-delivery-guidelines.md](./builder-delivery-guidelines.md) for packaging and handoff rules.
