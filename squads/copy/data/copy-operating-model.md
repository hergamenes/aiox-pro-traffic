# Copy Operating Model

## Metadata

```yaml
id: copy-operating-model
version: "1.0.0"
type: operating-model
load: ON_INTAKE
scope: "All campaign and copy production work"
purpose: "Define canonical process stages, artifact names, and handoff rules for the copy squad"
```

## Core Principle

The `copy` squad should use the vocabulary of professional copywriting and advertising.

Do not use product-development terms such as `PRD`, `Epic`, or `Story` as the primary naming layer.
If internal analogies are useful, keep them implicit.

The canonical operating sequence is:

1. `Campaign Brief`
2. `Message Architecture`
3. `Creative Brief`
4. `Asset Brief`
5. `Copy Deck`
6. `Review Gates`
7. `Validation Loop`

This operating model depends on the canonical layer separation defined in:

- `workspace/domains/content/copy-information-architecture.yaml`

## Canonical Artifact Taxonomy

### Campaign Brief

The top-level planning document for a campaign, funnel, or initiative.

Use it to define:

- business context
- objective
- audience
- offer
- channel mix
- constraints
- success criteria

This is the closest functional equivalent to a product requirements document, but it should not be named as one.

### Message Architecture

The strategic message system that governs all downstream copy.

Use it to define:

- category and positioning
- core promise
- unique mechanism or onlyness
- proof hierarchy
- message hierarchy
- claims boundaries
- required and forbidden language
- channel adaptations

`Message Architecture` is not copy.
It is the ordered strategic logic behind the copy.

### Creative Brief

The document that translates strategy into creative direction.

Use it to define:

- desired audience shift
- key message
- angle
- emotional posture
- voice and tone constraints
- mandatory proof and offer elements
- creative guardrails

In agency language, this is the classic downstream brief for execution.

### Asset Brief

The spec for one specific deliverable.

Use it to define:

- asset type
- channel
- objective
- awareness stage
- CTA
- required sections
- constraints
- dependencies
- approval criteria

`Asset Brief` is the canonical unit of scoped execution inside the squad.

### Copy Deck

The working and delivery artifact that contains the actual copy.

Use it to hold:

- draft or final copy
- version and status
- structural markers
- builder or media notes
- test hypotheses
- approval notes

`Copy Deck` is an output artifact, not an upstream planning artifact.

### Review Gates

The mandatory review layer before a piece is promoted to `FINAL`.

At minimum, apply:

- persuasion review
- brand and positioning review
- proof and claims review
- builder handoff review for renderable pages
- final readiness review

### Validation Loop

The post-review learning and optimization layer.

Use it to track:

- pre-launch checks
- pre-test or small-batch validation
- live performance signals
- iteration notes
- next version decisions

## Stage Model

## Stage Source of Truth Matrix

| Stage | Primary artifact | Owner | Canonical path | Source of truth | Fallback |
|---|---|---|---|---|---|
| Intake and Context Loading | `Campaign Brief` | copy | `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/campaign-brief.yaml` | campaign scope, objective, audience, channels, constraints | implicit runtime brief only for small or exploratory `DRAFT` work |
| Message Strategy | `Message Architecture` | copy + traffic | `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/message-architecture.yaml` | campaign message logic, promise, proof hierarchy, language controls | may be compressed for light campaigns, not for strategic `FINAL` work |
| Creative Direction | `Creative Brief` | copy | `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/copy/creative-brief.yaml` | angle, emotional posture, mandatory proof, CTA direction | may be merged into asset planning for simple work |
| Asset Planning | `Asset Brief` | copy | `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/copy/assets/asset-brief-*.yaml` | one deliverable spec per asset | may be implicit for one small asset |
| Writing and Delivery | `Copy Deck` | copy | `outputs/copy/{business}/...` | actual written copy and handoff state | no fallback |
| Review Gates | checklist state | copy + reviewers | `squads/copy/checklists/` + proof/brand/product files | approval truth comes from gates plus upstream facts | no fallback |
| Validation Loop | test / iteration notes | copy + traffic + media | channel-specific runtime evidence | live performance, qualitative feedback, next-version decisions | channel dependent |

## Durable Truth Layers

- `workspace/businesses/{business}/L0-identity/`, `workspace/businesses/{business}/L1-strategy/` and `workspace/businesses/{business}/L2-tactical/brand/` remain the source of truth for identity, positioning, and language rules.
- `workspace/businesses/{business}/L3-product/{product}/` remains the source of truth for offer design, proof, testimonials, and reusable narrative.
- `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/` becomes the source of truth for campaign-specific planning (ADR-012 — raiz com cross-squad contracts, subpasta `copy/` para artefatos copy-specific).
- `outputs/copy/{business}/` is the source of truth for executable copy artifacts.

### Stage 1: Intake and Context Loading

Primary artifact: `Campaign Brief`

Supporting references:

- `copy-brief-protocol`
- `copy-request-routing`

Source of truth:

- `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/campaign-brief.yaml`
- upstream brand and product files loaded by `copy-brief-protocol`

Rule:

- if `campaign_slug` is missing, only exploratory or draft work may proceed

### Stage 2: Message Strategy

Primary artifact: `Message Architecture`

Supporting references:

- `premium-positioning-guardrails`
- `copy-craft-rules`
- `mental-trigger-reference`

Source of truth:

- `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/message-architecture.yaml`
- brand and product truth remain upstream dependencies

### Stage 3: Creative Direction

Primary artifact: `Creative Brief`

This stage converts strategy into angle, posture, and execution constraints.

Source of truth:

- `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/copy/creative-brief.yaml`

### Stage 4: Asset Planning

Primary artifact: `Asset Brief`

Use one `Asset Brief` per page, sequence, script, ad system, or other deliverable.

Source of truth:

- `workspace/businesses/{business}/L4-operational/campaigns/{campaign_slug}/copy/assets/asset-brief-*.yaml`

### Stage 5: Writing and Delivery

Primary artifact: `Copy Deck`

Supporting references:

- `page-section-contract`
- `builder-delivery-guidelines`
- `future-regret-close-technique`
- `high-ticket-ads-framework`

Source of truth:

- `outputs/copy/{business}/...`

### Stage 6: Review Gates

Primary artifact: checklist-driven approval state

Supporting references:

- `final-copy-readiness`
- Hopkins audit
- Sugarman triggers

### Stage 7: Validation Loop

Primary artifact: test notes, review notes, and next-version decisions

This stage closes the loop between persuasion intent and market response.

## Naming Rules

- Use `Campaign Brief` for initiative-level framing.
- Use `Message Architecture` for the message system behind the campaign.
- Use `Creative Brief` for execution direction.
- Use `Asset Brief` for a specific deliverable.
- Use `Copy Deck` for the actual copy artifact.
- Use `Review Gates` for approval checkpoints.
- Use `Validation Loop` for testing and iteration.

Avoid these as the primary external names:

- `PRD`
- `Epic`
- `Story`

Historic terms such as `Copy Strategy` or `Copy Platform` may be mentioned as adjacent legacy vocabulary, but they are not the primary canonical names for this squad.

## Governance Rule

This model does not replace brand or product source files.

- brand artifacts remain the source of truth for durable positioning
- product artifacts remain the source of truth for offer and proof
- campaign artifacts adapt those truths to a specific initiative
- delivery artifacts contain the executable copy

## Execution Tracks

### Launch Campaign

Use the full operating model:

`Campaign Brief -> Message Architecture -> Creative Brief -> Asset Briefs -> Copy Decks -> Review Gates -> Validation Loop`

### Paid Traffic

Use a compressed variant:

`Campaign Brief -> Message Architecture -> Asset Brief -> Copy Deck -> Review Gates -> Validation Loop`

### Content or Community

Use a lighter variant:

`Campaign Brief -> Message Architecture -> Asset Brief -> Copy Deck -> Review Gates`

## Mapping to Existing Copy Squad Assets

- `copy-brief-protocol` populates the source-loaded layer of the `Campaign Brief`
- `copy-request-routing` helps choose the correct execution track and asset path
- `premium-positioning-guardrails` and `copy-craft-rules` shape the `Message Architecture` and `Creative Brief`
- `page-section-contract` and `builder-delivery-guidelines` govern renderable `Copy Deck` outputs
- `final-copy-readiness` remains the final generic gate before promotion to `FINAL`

## Operating Rule

If the request is small, the squad may compress stages.
If the campaign is strategic, multi-asset, or high-ticket, do not skip the explicit `Message Architecture` step.
