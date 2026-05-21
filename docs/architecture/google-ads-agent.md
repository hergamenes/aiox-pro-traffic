# google-ads-agent — Architecture Specification

| | |
|---|---|
| **Status** | Draft — pending @dev implementation |
| **Author** | Aria (Architect) |
| **Date** | 2026-05-21 |
| **Version** | 0.1 |
| **Handoff source** | `.aiox/handoffs/handoff-squad-chief-to-architect-2026-05-21T13-04.yaml` |
| **Reference impl** | `packages/meta-ads-agent/` (v0.1.0) |

---

## 1. Context

The `traffic-meta` squad delivers real-time Meta Ads operations by talking to the `meta-ads` CLI in `packages/meta-ads-agent/`. The `traffic-google` squad cannot be created with the same real-time promise until an equivalent CLI exists for Google Ads.

This document specifies the architecture for `packages/google-ads-agent/` — a TypeScript CLI that mirrors the meta-ads-agent shape (same project conventions, same auth-and-keychain pattern, same command surface) while abstracting the Google Ads API behind an adapter port so the squad consumers cannot tell the underlying SDK apart from Meta's.

## 2. Goals

- **G1.** Drop-in mental model: a developer who understands `meta-ads-agent` can navigate `google-ads-agent` without re-learning conventions.
- **G2.** MVP unblocks `traffic-google` squad: `auth`, `accounts`, `report --format json` must work end-to-end with a real Google Ads account.
- **G3.** Port/Adapter isolation: the choice of npm SDK is encapsulated; if Google ships an official SDK or Opteo's package is abandoned, only one adapter changes.
- **G4.** Match Meta CLI's report contract: `--from`, `--to`, `--period`, `--level`, `--format json`, `--campaign-id`, `--tag` work and emit JSON shaped the same way the squad already knows how to parse.
- **G5.** Same operational ergonomics: `node dist/bin/google-ads.js auth status` mirrors `meta-ads auth status` so squad tasks can use a parameterized command path.

## 3. Non-Goals (out of MVP)

- Campaign creation (`create`, `up`, `batch`) — second phase.
- Creative upload (`upload`, `media`, `creatives`) — second phase.
- History tracking with local persistence — second phase.
- Audience management — not on roadmap; squad covers via MCP if needed.
- Google Ads scripts (server-side JS) — out of scope.

## 4. Constraints

| ID | Constraint | Source |
|----|-----------|--------|
| C1 | License must be MIT/Apache-2.0 compatible | meta-ads-agent precedent |
| C2 | Node >= 22 | tsup config + meta-ads engines field |
| C3 | TypeScript strict mode, ESM only | meta-ads tsconfig + tsup config |
| C4 | macOS Keychain via `keytar` for secret storage | meta-ads precedent (zero plaintext on disk) |
| C5 | Logs in Portuguese, code identifiers in English | project CLAUDE.md |
| C6 | No CommonJS interop; pure ESM | meta-ads pattern |
| C7 | SDK must support: MCC `login_customer_id`, OAuth refresh token, streaming reports | from research |

## 5. SDK Selection

**Decision: `google-ads-api` (Opteo) v23.x**

Rationale (from architecture research):

| Criterion | google-ads-api | google-ads-node | google-ads-nodejs-client |
|-----------|----------------|-----------------|--------------------------|
| Weekly downloads | **220k** | 222k (dep of above) | 112 |
| License | **MIT** | MIT | Apache-2.0 |
| TS support | Native `.d.ts` | Native | Native (generated) |
| MCC support | First-class `login_customer_id` | Manual header | Manual header |
| `listAccessibleCustomers` helper | **Yes** | Service call | Service call |
| Report streaming | `reportStream` async iterator | Raw gRPC | Raw gRPC |
| API ergonomics | `customer.report({...})` matches our shape | Bare gRPC | Bare gRPC |
| Maintenance signal (2026) | Active, last release 2026-01-30 | Recommended-against by author | Single maintainer, 3 stars |

The Opteo package wraps REST+Protobuf (not gRPC), which removes a binary-deps liability (no Bazel build chain). It also exposes `client.listAccessibleCustomers(refreshToken)` and a `customer.report({ entity, attributes, metrics, segments, from_date, to_date })` shape that maps 1:1 onto the meta-ads `getInsights` adapter.

**Risk mitigation:** isolate the SDK behind a `GoogleAdsClient` port (Section 7) so that if Opteo's package stagnates the swap is localized.

## 6. Authentication Model

Google Ads auth is structurally heavier than Meta's single long-lived access token. The MVP must persist four things in macOS Keychain (mirroring `keychain.ts`):

| Key | What | How obtained | Lifetime |
|-----|------|--------------|----------|
| `developer-token` | API access pass per Google Ads account | https://developers.google.com/google-ads/api/docs/first-call/dev-token | Permanent until revoked |
| `client-id` | OAuth client (Google Cloud project) | Google Cloud Console → OAuth credentials | Permanent |
| `client-secret` | OAuth client secret | same | Permanent |
| `refresh-token` | Per-user refresh token | OAuth setup flow (manual or `auth setup`) | Long-lived (months/years; revocable) |
| `customer-id` | Default customer (10-digit, no dashes) | from `accounts` listing | Per-installation |
| `login-customer-id` | MCC ID if operating via Manager Account | optional, from user | Per-installation |

**Service name in Keychain:** `google-ads-agent`

**Auth commands:**
- `google-ads auth setup` — Interactive guide that:
  1. Prompts for developer-token (validates format).
  2. Prompts for client_id / client_secret.
  3. Prints the Google OAuth URL with the required scopes (`https://www.googleapis.com/auth/adwords`) and a redirect to `urn:ietf:wg:oauth:2.0:oob` for the OOB flow, OR opens a local loopback callback at `http://localhost:8765/oauth/callback` (preferable — meta-ads-agent already runs a loopback server, port should be configurable).
  4. User authenticates in browser, receives code, CLI exchanges for refresh_token.
  5. Stores all credentials in Keychain.
- `google-ads auth manual` — Same as above but accepts a paste of `client_id|client_secret|refresh_token` (parity with meta-ads `auth manual`).
- `google-ads auth status` — Validates by calling `client.listAccessibleCustomers(refreshToken)` and prints token health + dev-token presence + default customer.
- `google-ads auth refresh` — (optional, low priority) — force a refresh roundtrip and reports new access_token TTL.

**Veto:** If `auth status` fails or any required Keychain entry is missing, all read/write commands must exit non-zero with a clear PT-BR message pointing back to `auth setup`. (Same pattern as meta-ads.)

## 7. High-Level Module Structure

```
packages/google-ads-agent/
├── bin/
│   └── google-ads.ts              # entrypoint shim, calls run() from cli/index.ts
├── src/
│   ├── auth/
│   │   ├── keychain.ts            # MIRROR keychain.ts pattern. Service = 'google-ads-agent'.
│   │   ├── oauth-flow.ts          # OAuth loopback + URL builder + code exchange
│   │   └── token-manager.ts       # refresh access_token, ensure-valid wrapper
│   ├── cli/
│   │   ├── index.ts               # program.addCommand wiring
│   │   ├── logger.ts              # pino setup (env: GOOGLE_ADS_DEBUG)
│   │   ├── display.ts             # color/table helpers
│   │   ├── progress.ts            # ora spinner wrapper
│   │   └── commands/
│   │       ├── auth.ts            # setup | manual | status | refresh
│   │       ├── accounts.ts        # listAccessibleCustomers + denormalize MCC tree
│   │       ├── config.ts          # set-default (customer_id, login_customer_id)
│   │       └── report.ts          # MVP star command (see Section 8)
│   ├── google-ads-api/            # ADAPTER PORT — only place that imports 'google-ads-api'
│   │   ├── client.ts              # singleton GoogleAdsApi instance + Customer factory
│   │   ├── adapter.ts             # getInsights(params) → ParsedMetrics[]
│   │   ├── accounts.ts            # listAccessibleCustomers + getCustomerHierarchy
│   │   └── types.ts               # internal types (GAQL builders, etc)
│   ├── reporting/
│   │   ├── insights-parser.ts     # row → ParsedMetrics (canonical schema)
│   │   ├── campaign-filter.ts     # filter by tag in name (parity with meta)
│   │   └── report-formatter.ts    # formatTable / formatJson
│   ├── config/
│   │   └── config-repository.ts   # YAML repo: ~/.aiox/google-ads.yaml
│   ├── errors/
│   │   ├── error-handler.ts       # centralizer with PT-BR translation
│   │   ├── error-map.ts           # GoogleAdsError codes → PT-BR action
│   │   └── types.ts               # AppError, GoogleAdsApiError
│   ├── types/
│   │   ├── insights.ts            # InsightsParams, InsightsLevel, InsightsPeriod, ParsedMetrics
│   │   └── customer.ts            # CustomerInfo, MCCNode
│   └── log/
│       └── log-repository.ts      # local history (post-MVP)
├── package.json
├── tsup.config.ts
├── tsconfig.json
├── eslint.config.js
└── vitest.config.ts (or inline)
```

**Adapter port boundary (the most important architectural rule):** outside of `src/google-ads-api/`, **nothing imports from `google-ads-api` (the npm package)**. Every other module talks to `GoogleAdsClient` / `getInsights` / `listAccessibleCustomers` — our own functions. This is the same discipline the meta-ads-agent applies through `src/meta-api/adapter.ts`.

## 8. MVP — Report Command Contract

This is the command the `traffic-google` squad will lean on. It MUST match the meta-ads `report` contract by analogy:

```
google-ads report [customer-id]
  --period <7d|14d|30d>
  --from <YYYY-MM-DD>
  --to <YYYY-MM-DD>
  --level <account|campaign|ad_group|ad|keyword>
  --format <table|json>            (default: table)
  --campaign-id <id>
  --tag <substring>
  --login-customer-id <mcc>        (overrides config default)
```

**Defaults & rules:**
- If `customer-id` arg omitted, fall back to `config.defaults.customerId`.
- `--from` and `--to` must both be provided or both omitted (validate, exit 1 on mismatch — parity with meta-ads).
- If `--from`/`--to` provided, `period` is internally `custom`.
- If `--campaign-id` or `--tag` provided and `--level` not explicit, default to `ad_group` (parity with meta-ads behavior, which goes to `adset`).
- `--format json` MUST emit a flat array of objects with stable keys: `{ id, name, level, spend, impressions, clicks, ctr, cpc, conversions, cpa, roas, date_range, ... }`. The squad's `optimize-cycle.md` and `generate-report.md` already parse this shape — don't drift.

**Internal flow (adapter side):**
1. Build GAQL `SELECT ... FROM campaign WHERE segments.date BETWEEN '...' AND '...'` (or `ad_group`, etc).
2. Call `customer.report({...})` or `reportStream` if expected row count > 10k.
3. Parse each row through `insights-parser.ts` into `ParsedMetrics`.
4. Apply `campaign-filter.ts` if `--tag` provided.
5. Emit through `report-formatter.ts`.

## 9. Hierarchy Mapping (Google vs Meta)

| Meta | Google | Notes |
|------|--------|-------|
| Ad Account | Customer (10-digit, formatted `123-456-7890`) | Strip dashes when calling SDK |
| Page | — | N/A in Google Ads |
| Campaign | Campaign | Equivalent |
| Ad Set | Ad Group | Naming difference; treat as same layer |
| Ad | Ad (= Ad Group Ad) | The SDK exposes via `ad_group_ad` |
| — | Keyword | Google-only; report `--level keyword` is uniquely useful |
| — | Asset / Asset Group | Performance Max layer — POST-MVP |

The squad's existing optimizer/analyst tasks talk about `adset`. For the `traffic-google` squad we will rename to `ad_group` in the new squad's own tasks (out of scope for this CLI build — Aria's note for squad-chief).

## 10. Phased Delivery Plan

### Phase 1 — MVP (this work)
Estimated: 2-3 sessions of @dev work.

- [ ] Scaffold package (package.json, tsup, tsconfig, eslint, vitest config — mirror meta-ads).
- [ ] `src/cli/logger.ts` (port verbatim, rename env var).
- [ ] `src/auth/keychain.ts` with service-name `google-ads-agent` and the 6 keys from Section 6.
- [ ] `src/auth/oauth-flow.ts` — loopback server on port `8765` (configurable), URL builder, code-for-token exchange.
- [ ] `src/auth/token-manager.ts` — `ensureValidAuth()` returns `{ developerToken, clientId, clientSecret, refreshToken }` or throws.
- [ ] `src/google-ads-api/client.ts` — singleton `GoogleAdsApi` + `getCustomer({ customer_id, login_customer_id? })`.
- [ ] `src/google-ads-api/accounts.ts` — `listAccessibleCustomers()` + hierarchy expansion (for MCC).
- [ ] `src/google-ads-api/adapter.ts` — `getInsights(InsightsParams)` returning `ParsedMetrics[]`.
- [ ] `src/cli/commands/auth.ts` — `setup`, `manual`, `status`.
- [ ] `src/cli/commands/accounts.ts` — list (table/json).
- [ ] `src/cli/commands/config.ts` — `set-default`.
- [ ] `src/cli/commands/report.ts` — matches Section 8 contract.
- [ ] `src/errors/error-handler.ts` + `error-map.ts` (translate top 10 Google Ads error codes).
- [ ] Vitest tests for: insights-parser (pure), campaign-filter (pure), report-formatter (pure), error-map.
- [ ] Integration test with mocked SDK (msw or direct mocking) for `accounts` and `report`.
- [ ] `bin/google-ads.ts` + `package.json` bin entry.
- [ ] Smoke test: real auth, real account, `report --period 7d --format json` returns rows.

### Phase 2 — Mutations
- `create` (Search, Display campaigns first; PMax later).
- `upload` for image/video assets.
- `up` shortcut.
- `history` persisted to YAML.

### Phase 3 — Advanced
- `batch` CSV-driven.
- `media` library management.
- `keywords` add/pause/bid commands.
- Conversion goal config helpers.

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Developer token rejected by Google for new clients | Medium | Blocks Phase 1 testing | Document approval process; use existing token in user's possession |
| OAuth loopback blocked by corporate firewall | Low | `auth setup` fails | Provide `auth manual` fallback (paste refresh_token) |
| `google-ads-api` (Opteo) abandoned | Low (active in 2026) | Need to swap SDK | Adapter port (Section 7) localizes the change to `src/google-ads-api/` |
| Hierarchy mismatch confuses squad consumers | Medium | Optimizer reasons about `adset` but Google calls it `ad_group` | Document in squad's own tasks (squad-chief responsibility, not CLI) |
| API quota throttling on report stream | Medium | Slow reports for large accounts | Use `reportStream` for >10k rows; expose `--limit` if needed |
| MCC users have ambiguous default customer | Medium | UX confusion in `accounts` | `accounts` command lists MCC tree with indentation; `config set-default` prompts for both `customer-id` and `login-customer-id` |
| Token revocation silent until next call | Low | First command fails after weeks of idle | `auth status` early in every squad task (already a pattern) |

## 12. Acceptance Criteria for the CLI Build (Phase 1)

The build is done when ALL of these are true:

- [ ] `node dist/bin/google-ads.js --help` lists at least: `auth`, `accounts`, `config`, `report`.
- [ ] `auth setup` completes end-to-end with a real Google Ads account and writes 5+ keys to Keychain.
- [ ] `auth status` returns green for a valid configuration and red+actionable for any missing key.
- [ ] `accounts` returns at least one row when the user has any Google Ads access.
- [ ] `config set-default` accepts a `customer-id` and optionally a `login-customer-id` and persists to `~/.aiox/google-ads.yaml`.
- [ ] `report --period 7d --level campaign --format json` returns a JSON array on stdout with the shape declared in Section 8.
- [ ] `report --from 2026-05-01 --to 2026-05-07 --level ad_group --format json` works for date ranges.
- [ ] `report --campaign-id <id> --format json` filters correctly.
- [ ] `report` exits non-zero with PT-BR message when `auth status` would be red.
- [ ] All unit tests pass (`npm test`).
- [ ] `npm run lint` clean.
- [ ] `npm run build` produces `dist/bin/google-ads.js` < 1 MB (parity with meta-ads).

## 13. Out-of-Scope Clarifications

- **No new MCP server registration.** This is a local CLI; the MCP path is a separate workstream (a future Google Ads MCP could be installed alongside, mirroring the `claude_ai_Facebook` MCP).
- **No squad creation in this work item.** Squad-chief will own `traffic-google` squad creation in a follow-up session, using this CLI exactly as the meta-ads CLI is used by `traffic-meta`.
- **No CI/CD pipeline changes.** The package will be local; publishing to a registry is a later decision.

## 14. Open Questions for User (before @dev starts)

1. **Developer token**: do you already have one for your Google Ads account, or do we need to walk through the request process?
2. **Default OAuth client**: do you want to reuse the same Google Cloud project used elsewhere, or create a fresh one for `google-ads-agent`?
3. **MCC**: do you operate via a Manager Account? If yes, capture the MCC customer ID upfront so `config set-default` can prompt for it.
4. **Phase 2 priority**: is `create` (mutations) needed within the next 30 days, or is read-only MVP enough for now?

## 15. Handoff to @dev

After this document is approved, the implementation work is delegated to @dev (Dex). A separate handoff artifact (`.aiox/handoffs/handoff-architect-to-dev-google-ads-agent-<timestamp>.yaml`) will package this spec with a structured implementation checklist.

The implementation follows Story-Driven Development:
1. @pm or @sm drafts a story (or epic with stories) for the build.
2. @po validates draft.
3. @dev implements following Phase 1 plan in Section 10.
4. @qa gate against acceptance criteria in Section 12.
5. @devops pushes once green.
6. squad-chief picks up to create `traffic-google` squad.

---

*Aria signed.*
