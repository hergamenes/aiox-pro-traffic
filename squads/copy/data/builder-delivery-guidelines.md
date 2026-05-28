# Builder Delivery Guidelines

## Metadata

```yaml
id: builder-delivery-guidelines
version: "1.0.0"
type: delivery-guideline
load: ON_PAGE_DELIVERY
scope: "Renderable page outputs only"
purpose: "Define how copy is packaged for builder handoff without content loss"
```

## Objective

When `copy` produces a page-ready deliverable, the output must be structured so a builder or parser can assemble the page with minimal interpretation.

## Required Delivery Shape

Renderable page outputs should provide:

1. A primary Markdown body with section markers from `page-section-contract.md`
2. A short handoff summary that clarifies page type, key proof assets, and any missing inputs

## Handoff Checklist

- [ ] Section markers are present for every renderable block
- [ ] Section keys match the contract exactly
- [ ] Offer, CTA, proof, and risk-reversal sections are present when relevant
- [ ] Claims with numbers have a source in the loaded brief/proof files
- [ ] Any missing asset is called out explicitly instead of being invented

## Packaging Rules

- Keep the writer-facing copy as the source of truth
- Do not invent JSON schemas if the downstream builder does not require them
- Preserve copy in readable Markdown first
- Add handoff notes only when they reduce ambiguity for assembly

## Recommended Handoff Summary

```yaml
builder_handoff:
  page_type: "sales-page"
  section_contract: "data/page-section-contract.md"
  proof_sources:
    - "workspace/businesses/{business}/L3-product/{product}/proof.yaml"
    - "workspace/businesses/{business}/L3-product/{product}/testimonials.yaml"
  required_assets_missing: []
  notes:
    - "Use existing brand tokens from workspace/businesses/{business}/L2-tactical/brand/"
```

## When Not to Use

Do not apply this guideline to:

- emails
- ads
- social posts
- VSL narration scripts
- internal brainstorming drafts

## Final Rule

If the output is meant to become a page, it is not `FINAL` until the section contract and this handoff guideline are satisfied.
