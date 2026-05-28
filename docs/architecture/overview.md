# AIOX Paid Traffic Automation Suite — Architecture Overview

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 28-05-26 | 1.0 | Documento de visão geral da suíte (Meta + Google) | Orion (Master) |

---

## Propósito

Este documento descreve a **arquitetura da suíte** e os **padrões compartilhados** entre as duas CLIs irmãs. Cada CLI tem seu próprio documento detalhado:

- `docs/architecture/meta-ads-agent.md` — particularidades do CLI Meta.
- `docs/architecture/google-ads-agent.md` — particularidades do CLI Google.

A regra de ouro: **convenções compartilhadas vivem aqui; particularidades de plataforma vivem no doc de cada CLI.**

---

## Visão de alto nível

```
aiox-pro-traffic/ (monorepo)
├── packages/
│   ├── meta-ads-agent/      # CLI `meta-ads`   → Graph API (fetch)
│   └── google-ads-agent/    # CLI `google-ads` → google-ads-api (SDK)
├── squads/
│   ├── traffic-meta/        # orquestração/agentes que consomem o CLI Meta
│   ├── traffic-google/      # orquestração/agentes que consomem o CLI Google
│   └── copy/                # criação de textos de anúncio (ferramenta separada)
├── docs/
│   ├── prd.md               # PRD unificado da suíte
│   ├── architecture/        # este doc + meta + google
│   ├── stories/epics/       # stories organizadas por épico
│   └── qa/gates/            # decisões de QA por story
└── reports/                 # saída gerada (não versionada) — relatórios por conta
```

As duas CLIs são **independentes** (cada uma roda, builda e testa sozinha) mas **simétricas** por design: quem conhece uma navega a outra sem reaprender convenções.

---

## Padrões compartilhados

### 1. Stack base
- Node.js + TypeScript ESM estrito, build com `tsup`, testes com `vitest`.
- CLI com `commander` + prompts `inquirer`.
- Validação de input com `zod`.
- Credenciais no **Keychain do macOS** via `keytar` (zero plaintext em disco).

### 2. Padrão arquitetural (pipeline + adapter port)

```
CLI command → orchestrator/builder → strategy (por objetivo/tipo) → adapter → API
```

- **Adapter port é a regra mais importante:** só a pasta da API (`src/meta-api/` ou `src/google-ads-api/`) importa o SDK/faz I/O de rede. Todo o resto fala com funções próprias (`getInsights`, `listAccessibleCustomers`, etc.). Isso permite trocar SDK sem tocar o resto.

### 3. Autenticação
- OAuth 2.0 em ambas; segredos no Keychain.
- Meta: single long-lived token (60 dias) + alerta de expiração.
- Google: developer-token + client-id/secret + refresh-token + customer-id (+ login-customer-id para MCC).
- **Veto comum:** se a auth falha ou falta chave, todo comando sai com código não-zero e mensagem PT-BR apontando para `auth setup`.

### 4. Contrato de relatório (a peça central compartilhada)

`report --format json` produz o **mesmo schema** nas duas plataformas — garantido por teste de paridade (`schema-parity.test.ts` no Google). Isso é o que permite análise unificada sem retrabalho.

Flags comuns: `--period <7d|14d|30d>`, `--from/--to <YYYY-MM-DD>`, `--level`, `--format <table|json>`, `--campaign-id`, `--tag`.

Schema JSON (chaves estáveis): `{ id, name, level, spend, impressions, clicks, ctr, cpc, conversions, cpa, roas, date_range, ... }`.

Pipeline interno idêntico: `API → insights-parser → campaign-filter (se --tag) → report-formatter`.

### 5. Tratamento de erros PT-BR
- `errors/error-map.ts` em cada CLI mapeia os erros mais comuns da API para mensagens em português com ação sugerida.
- `errors/error-handler.ts` centraliza a tradução. Código em inglês, mensagens ao usuário em português (regra do projeto).

### 6. Mapeamento hierárquico Meta ↔ Google

| Meta | Google | Nota |
|------|--------|------|
| Ad Account | Customer (`123-456-7890`) | Remover dashes ao chamar o SDK |
| Page | — | N/A no Google |
| Campaign | Campaign | Equivalente |
| Ad Set | Ad Group | Mesma camada, nome diferente |
| Ad | Ad (= Ad Group Ad) | — |
| — | Keyword | Só Google; `report --level keyword` |
| — | Asset / Asset Group | Camada Performance Max |

---

## Diferenças intencionais entre as CLIs

| Aspecto | Meta | Google |
|---|---|---|
| Objetivos/tipos | 8 objetivos de campanha | 3 tipos (Search/Display/PMax) |
| Criação em lote (`batch`) | ✅ CSV | ❌ não implementado |
| Biblioteca de mídia (`media`) | ✅ | ❌ |
| Atalho `up` | ✅ | ❌ |
| Guard-rails de mutação | rollback transacional | PAUSED-by-default, dry-run, triple-confirm, limite de sessão, mutation-log |
| MCC / multi-conta gerenciada | N/A | `login-customer-id` |

---

## Princípio operacional inegociável

**Isolamento por empresa/cliente.** Toda operação é escopada a UMA conta por vez. Nunca cruzar dados/métricas/benchmarks entre nichos ou contas diferentes. Reflete-se no design: cada CLI opera sobre a conta default configurada ou a passada explicitamente, sem agregação cross-account.

---

## Qualidade e dívida técnica

| | Meta | Google |
|---|---|---|
| Testes | 379 (45 arquivos) | 332 (21 arquivos) |
| Typecheck / Lint | ✅ / ✅ | ✅ / ✅ |
| Cobertura | alta na lógica pura | ~41% linhas / 72% funções / 87% branches |
| Integração conta real | parcial (sales/leads imagem) | nenhuma (usar `--dry-run`) |

A dívida técnica detalhada por CLI está nas Seções "Dívida Técnica Conhecida" de cada documento (`meta-ads-agent.md` §0, `google-ads-agent.md` §17). Status de correção rastreado nas tasks da iniciativa de organização de 28-05-26.
