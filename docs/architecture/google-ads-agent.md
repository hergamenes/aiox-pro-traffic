# google-ads-agent — Architecture Specification

| | |
|---|---|
| **Status** | ✅ Implementado (Phases 1-3 entregues) — com CONCERNS de QA pendentes |
| **Author** | Aria (Architect) |
| **Date** | 2026-05-21 (spec) · 2026-05-28 (atualização pós-entrega) |
| **Version** | 1.0 |
| **Handoff source** | `.aiox/handoffs/handoff-squad-chief-to-architect-2026-05-21T13-04.yaml` |
| **Reference impl** | `packages/meta-ads-agent/` |

---

## 0. Status de Implementação (atualização v1.0 — 28-05-26)

> Este documento começou como spec pré-implementação (v0.1, "Draft"). **Tudo foi entregue** — incluindo o que estava marcado como Phase 2/3 (mutações, criação, keywords, assets, delete). As seções 1-9 abaixo permanecem como registro das decisões arquiteturais (SDK, auth, contrato de report) e continuam válidas. As seções 10+ foram atualizadas para refletir a entrega real.

**Resumo do que existe hoje** (`packages/google-ads-agent/`):
- ✅ **Read:** `auth`, `accounts` (+ árvore MCC), `config`, `report` (GAQL por nível, incl. keyword via `keyword_view`).
- ✅ **Mutações:** `update budget/bidding`, `pause`/`enable` (campaign + ad-group), `remove` (campaign + ad-group).
- ✅ **Criação:** `create campaign-search`, `campaign-display`, `campaign-pmax`, `ad-group`, `ad rsa`, `ad rda`.
- ✅ **Keywords/Assets:** `keyword add/remove/update-bid`, `upload`/`list-assets` (image, video, text).
- ✅ **Guard-rails de segurança** (ver Seção 16): PAUSED-by-default, dry-run (`validate_only`), preview + confirmação, limite de orçamento de sessão (`session-budget-tracker`), log de mutações (`mutation-log`), prompts dedicados de mutação/remoção.
- **Qualidade:** 332 testes passando, typecheck + lint limpos. Cobertura ~41% linhas / 72% funções / 87% branches (descoberto: comandos CLI e camada de API real).
- **Dívida técnica:** ver Seção 17.

## 1. Context

The `traffic-meta` squad delivers real-time Meta Ads operations by talking to the `meta-ads` CLI in `packages/meta-ads-agent/`. The `traffic-google` squad cannot be created with the same real-time promise until an equivalent CLI exists for Google Ads.

This document specifies the architecture for `packages/google-ads-agent/` — a TypeScript CLI that mirrors the meta-ads-agent shape (same project conventions, same auth-and-keychain pattern, same command surface) while abstracting the Google Ads API behind an adapter port so the squad consumers cannot tell the underlying SDK apart from Meta's.

## 2. Goals

- **G1.** Drop-in mental model: a developer who understands `meta-ads-agent` can navigate `google-ads-agent` without re-learning conventions.
- **G2.** MVP unblocks `traffic-google` squad: `auth`, `accounts`, `report --format json` must work end-to-end with a real Google Ads account.
- **G3.** Port/Adapter isolation: the choice of npm SDK is encapsulated; if Google ships an official SDK or Opteo's package is abandoned, only one adapter changes.
- **G4.** Match Meta CLI's report contract: `--from`, `--to`, `--period`, `--level`, `--format json`, `--campaign-id`, `--tag` work and emit JSON shaped the same way the squad already knows how to parse.
- **G5.** Same operational ergonomics: `node dist/bin/google-ads.js auth status` mirrors `meta-ads auth status` so squad tasks can use a parameterized command path.

## 3. Non-Goals do MVP original — STATUS ATUAL

> O que era "Non-Goal" do MVP read-only foi, em sua maioria, **entregue** nas fases seguintes:

- ~~Campaign creation~~ → ✅ **ENTREGUE** (`create campaign-search/display/pmax`, `ad-group`, `ad rsa/rda`).
- ~~Creative/asset upload~~ → ✅ **ENTREGUE** (`upload`/`list-assets` para image/video/text).
- Keyword management → ✅ **ENTREGUE** (`keyword add/remove/update-bid`).
- Mutations (budget/bidding/status/delete) → ✅ **ENTREGUE**.
- History tracking persistido em YAML → ⚠️ parcial (há `mutation-log`; histórico completo de criação não persiste como no Meta).
- `batch` CSV e `media` library → ❌ **NÃO implementado no Google** (existe só no Meta).
- `up` shortcut → ❌ **NÃO implementado no Google**.
- Audience management → ❌ fora do roadmap (squad cobre via MCP se necessário).
- Google Ads scripts (server-side JS) → ❌ fora de escopo.

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

**Adapter port boundary (the most important architectural rule):** outside of `src/google-ads-api/`, **nothing imports from `google-ads-api` (the npm package)**. Every other module talks to `GoogleAdsClient` / `getInsights` / `listAccessibleCustomers` — our own functions. This is the same discipline the meta-ads-agent applies through `src/meta-api/adapter.ts`. *(Boundary verificado na auditoria de 28-05-26: respeitado.)*

### 7.1 Módulos adicionais entregues (além da spec original)

A entrega real cresceu para além da árvore acima. Módulos extras (todos dentro do boundary):

```
src/cli/commands/
├── create.ts            # campaign-search | campaign-display | campaign-pmax | ad-group
├── ad.ts                # ad rsa (Search) | ad rda (Display) — com vetos de tipo
├── keyword.ts           # add | remove | update-bid
├── update.ts            # budget | bidding
├── pause-enable.ts      # pause/enable campaign | ad-group
├── remove.ts            # remove campaign | ad-group (triple-confirm)
└── upload.ts            # image | video | text assets + list-assets
src/cli/
├── mutation-prompt.ts          # preview + confirmação de mutação
├── removal-prompt.ts           # triple-confirm de exclusão
└── session-budget-tracker.ts   # teto de orçamento por sessão (anti-burn)
src/google-ads-api/
├── campaign-builder.ts  # monta campanha por tipo + bidding strategy
├── gaql-builder.ts      # builder de queries GAQL (incl. keyword_view)
├── mutations.ts         # camada de mutação (única que muta via SDK)
├── ad-validator.ts · asset-validator.ts · budget-validator.ts
├── keyword-validator.ts · status-validator.ts
src/log/
└── mutation-log.ts      # trilha de auditoria de mutações
```

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

### Phase 2 — Mutations ✅ ENTREGUE
- ✅ `create` (Search, Display, PMax — todos).
- ✅ `upload` for image/video/text assets (+ `list-assets`).
- ✅ `update budget/bidding`, `pause`/`enable`, `remove`.
- ❌ `up` shortcut — não implementado.
- ⚠️ `history` persistido — parcial (apenas `mutation-log`).

### Phase 3 — Advanced ✅ PARCIAL
- ✅ `keyword add/remove/update-bid` + ad-group management.
- ✅ `ad rsa`/`ad rda`.
- ❌ `batch` CSV-driven — não implementado.
- ❌ `media` library management — não implementado.

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

## 14. Open Questions — RESOLVIDAS

As perguntas pré-implementação foram resolvidas durante a entrega (developer token obtido, OAuth client configurado, MCC suportado via `login-customer-id`, criação/mutações entregues). Mantidas como registro histórico — não há pendência aberta aqui.

## 15. Status do Story-Driven Development

Implementação concluída via SDC. Stories em `docs/stories/epics/epic-5-google-ads-agent/` e `epic-6-google-ads-mutations/`. QA gates em `docs/qa/gates/` (5.x e 6.x). `traffic-google` squad criado em `squads/traffic-google/`.

## 16. Guard-rails de Segurança (implementados)

A camada de mutação não-trivial protege o operador contra ações destrutivas acidentais:

| Guard-rail | Onde | O que faz |
|---|---|---|
| **PAUSED-by-default** | `campaign-builder.ts` | Toda campanha nasce pausada (anti-burn de orçamento). |
| **Dry-run** | mutações via `validate_only` | `--dry-run` valida contra a API sem aplicar. |
| **Preview + confirmação** | `mutation-prompt.ts` | Mostra o que vai mudar e exige confirmação. |
| **Triple-confirm de exclusão** | `removal-prompt.ts` | Antes de deletar, snapshot de gasto + 3 confirmações. |
| **Limite de orçamento de sessão** | `session-budget-tracker.ts` | Teto acumulado de orçamento por sessão. |
| **Log de mutações** | `log/mutation-log.ts` | Trilha de auditoria de cada mutação. |
| **Vetos de tipo** | `ad.ts`, `keyword.ts` | RSA→SEARCH, RDA→DISPLAY, ad-group→SEARCH (enum string + numérico). |
| **Create atômico** | `mutations.ts` | `resource_name` temporário + `partial_failure: false`. |

## 17. Dívida Técnica Conhecida (auditoria 28-05-26)

| Sev | Item | Local |
|---|---|---|
| 🟠 ALTO | Constantes GAQL inválidas `LAST_24_HOURS` / `LAST_90_DAYS` no snapshot de remoção → exibe "gasto 0" falso na tela de confirmação de exclusão. | `mutations.ts:2060,2073-2075` |
| 🟡 MÉDIO | Subquery GAQL não suportada no snapshot → `adCount` tende a 0 (cascade já é hardcoded `{0,0}`). | `mutations.ts:2045-2048` |
| 🟡 MÉDIO | `ensureValidAuth()` só confere existência de chaves; nome sugere validação contra API (refresh real é feito pelo SDK). | `token-manager.ts:16-26` |
| 🟢 BAIXO | URL "Ads Manager" gerada com `ocid=` vazio (link pode não abrir a conta certa). | `create.ts:318,583,872` |
| 🟢 BAIXO | `maximize_clicks` (Display) mapeado para `target_spend` (estratégia legada/deprecada). | `campaign-builder.ts:289-291` |
| 🟡 QA | Nenhum teste de integração contra conta real — primeira execução real é o teste de fato. **Operar com `--dry-run` primeiro.** | — |

> **Nota positiva da auditoria:** o fix recente do `keyword_view` (relatório nível keyword) está **correto**. Sem resíduos de Meta no código. Sem segredos hardcoded.

---

*Aria signed (spec). Atualizado por Orion em 28-05-26 pós-auditoria.*
