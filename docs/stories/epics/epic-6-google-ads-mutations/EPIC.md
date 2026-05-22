# Epic 6 — Google Ads CLI Mutations

| | |
|---|---|
| **Epic ID** | epic-6-google-ads-mutations |
| **Status** | Draft |
| **Owner** | @pm (Morgan) |
| **Stakeholders** | gestor de tráfego (Hergamenes), traffic-google squad agents |
| **Parent product** | aiox-pro-traffic / packages/google-ads-agent |
| **Builds on** | Epic 5 (google-ads-agent MVP — Stories 5.1-5.4 Done) |
| **Date drafted** | 2026-05-21 |

---

## 1. Vision Statement

> **Transformar o squad `traffic-google` de "read + coordenação manual" em "operação autônoma" — permitindo que campanhas Google Ads sejam criadas, ajustadas, pausadas e otimizadas sem que o operador precise abrir o Google Ads UI.**

Hoje o Epic 5 entregou um CLI que **lê** (accounts, report) e o squad **coordena** publicação via UI manual. O Epic 6 adiciona **mutações** — a CLI passa a fazer o que o UI faz, mas com segurança, auditoria e veto conditions que o UI não tem.

## 2. Business Case

### Por que mutações via CLI > UI?

| Aspecto | Google Ads UI | CLI + Squad (pós-Epic 6) |
|---------|---------------|---------------------------|
| Tempo p/ criar 1 campanha Search | 5-15 min | 30-60s |
| Replicar para 5 contas | 25-75 min | 30-60s (batch) |
| Auditoria de ações | Apenas via change history | Log local + version control |
| Veto conditions (anti-erro) | Confirmações genéricas | Específicas (anti-runaway-spend, double-confirm para pause em campanha ativa, etc) |
| Multi-conta MCC | Switch manual de conta | Loop programático |
| Rollback | Manual (sem snapshot) | Snapshot pré-mudança no log |
| Aprendizado entre clientes | Não — cada cliente é silo | Optimizer ML cross-client (futuro) |

### Quem usa
1. **Hergamenes** (gestor da MCC Solaro com 24 clientes) — operação diária
2. **Squad `traffic-google`** — agentes consomem essas mutações nos workflows
3. **Outros gestores de tráfego** (futuro — se o CLI virar produto)

### Impacto esperado
- **Tempo de operação:** -70% (criar+ajustar campanhas)
- **Erros operacionais:** -80% (veto conditions previnem acidentes recorrentes)
- **Cobertura:** todas as 24 contas Solaro ativas via batch

## 3. Goals & Success Metrics

| Goal | Métrica | Target |
|------|---------|--------|
| G1: CLI suporta CRUD completo de campanhas | 100% das 5 operações (create/read/update/pause/delete) | 6 stories Done |
| G2: Squad Publisher pode criar campanhas autonomamente | `*publish` chama CLI sem ir ao UI | Story 6.1 Done |
| G3: Optimizer pode aplicar recomendações | `*optimize --apply` executa via CLI | Stories 6.3+6.4 Done |
| G4: Zero accidents em produção | Sem aumento de budget >100% sem dupla confirmação; sem pause acidental | Veto conditions em todas as stories |
| G5: Cobertura de testes | ≥80% nas mutações + smoke real em conta cliente | Stories 6.1-6.4 com smoke real |

## 4. Stories Proposed

Ordem revisada após análise de risco/valor (movi budget/pause pra mais cedo conforme recomendação @qa: gestor mexe budget 50x para cada campanha que cria):

### Tier 1 — Operações Cotidianas (Alta Frequência, Médio Risco)

| Story | Título | Pts | Risco | Por que primeiro |
|-------|--------|-----|-------|------------------|
| **6.1** | Update budget + bidding strategy | 5 | Médio | Operação mais frequente; veto crítico anti-runaway-spend |
| **6.2** | Pause / enable campaign + ad_group | 3 | Baixo | Safety operation; baixo risco; alto valor |

### Tier 2 — Criação (Média Frequência, Médio-Alto Risco)

> **Decisão (2026-05-21):** Story 6.3 split em 3 sub-stories por tipo de campanha — granularidade melhor, risco menor por story, permite shipping incremental por tipo.

| Story | Título | Pts | Risco | Por que segundo |
|-------|--------|-----|-------|------------------|
| **6.3a** | Campaign create — Search | 5 | Médio | Tipo mais comum; hierarquia tradicional; destrava `*publish` para Search |
| **6.3b** | Campaign create — Display | 5 | Médio | Hierarquia tradicional (sem keywords); banner/imagem; common para remarketing |
| **6.3c** | Campaign create — Performance Max | 8 | Alto | Modelo asset_group + AI bidding; mais complexo; deferível se necessário |
| **6.4** | Ad group create + keyword management (add/remove/bid) | 5 | Médio | Search/Display inúteis sem keywords/ad_groups; veto anti-bid-shock |

### Tier 3 — Mídia e Tipos Avançados (Baixa Frequência, Médio Risco)

| Story | Título | Pts | Risco | Por que terceiro |
|-------|--------|-----|-------|------------------|
| **6.5** | Ad create (RSA + RDA) | 5 | Médio | Criativos podem ser feitos no UI primeiro; CLI agiliza replicação |
| **6.6** | Asset upload (image + video) | 5 | Baixo | Pre-req para RDA scale; pode ser deferido |

### Tier 4 — Operações Destrutivas (Baixa Frequência, Alto Risco)

| Story | Título | Pts | Risco | Por que último |
|-------|--------|-----|-------|----------------|
| **6.7** | Campaign delete + cleanup | 3 | **Alto** | Operação irreversível; última a chegar; veto triplo + dry-run obrigatório |

**Total: 9 stories, 39 story points.** Estimativa 5-8 sessões para o épico inteiro.

**Anti-runaway-spend confirmed:** +50% como threshold default para double-confirm em budget updates (configurable via flag `--max-budget-increase` por sessão).

## 5. Sequencing Rationale

```
Sessão 1: 6.1 + 6.2 (Tier 1) — operações cotidianas; baixo risco; squad já ganha valor
   ↓ check-in: usuário valida com 1-2 ajustes em conta cliente real
Sessão 2: 6.3 + 6.4 (Tier 2) — criação Search end-to-end
   ↓ check-in: usuário cria 1 Search campaign via *publish autônomo
Sessão 3-4: 6.5 + 6.6 (Tier 3) — RSA/RDA + assets
   ↓ check-in: usuário cria 1 Display campaign autonomamente
Sessão 5: 6.7 (Tier 4) — delete com guardrails
   ↓ Epic Done
```

**Princípio:** cada Tier desbloqueia capacidade real do squad antes do próximo. Não é "Big Bang" — entregamos valor incremental.

## 6. Risks (Epic-level)

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| E-R1 | Operador aciona mutation que gera prejuízo financeiro real (ex: budget 10x acidental) | Baixa | **Crítico** | Veto conditions específicas + double-confirm em todas as stories; logs de auditoria; opção `--dry-run` em mutações destrutivas |
| E-R2 | SDK `google-ads-api` (Opteo) muda API de mutações entre versões | Baixa | Médio | Adapter port discipline da Story 5.1 protege; pin de versão `^23.0.0`; testes de regressão |
| E-R3 | Mutação aplicada com sucesso na API mas Google leva >30min para refletir | Média | Baixo | Documentar janela de propagação; report após mutation pode mostrar "stale" por minutos |
| E-R4 | `developer_token` em "Test access only" recusa mutações em produção | Média | Alto | Documentar como pré-requisito do Epic; pedir ao Google `Basic Access` ou `Standard Access` |
| E-R5 | Conflito de mutação concorrente (operador no UI + CLI ao mesmo tempo) | Baixa | Médio | Cada mutation faz read antes + diff explícito; warning se snapshot pré-mudança diverge |
| E-R6 | Story 6.1 (budget) sem 6.3 (create) limita valor — só atualiza o que já existe | Alta (intentional) | Baixo | Aceito — gestor já tem 24 contas com campanhas existentes; atualizar é valor imediato |

## 7. Dependencies

### Internal (within aiox-pro-traffic)
- Epic 5 Done ✅ (5.1, 5.2, 5.3, 5.4 todas Done)
- CLI base (`packages/google-ads-agent/`) operacional
- Adapter port em `src/google-ads-api/` estabelecido
- Test infrastructure (vitest + msw mocks) pronto da 5.1

### External (Google)
- Developer Token com `Basic Access` ou `Standard Access` (não apenas Test)
- OAuth client autorizado para escopo `https://www.googleapis.com/auth/adwords`
- Conta cliente (não MCC) configurada como default

### Squad consumer (downstream)
- Stories de update do squad `traffic-google` (apontar Publisher para `*publish` automático em vez de UI manual; apontar Optimizer para `*optimize --apply`)
- Story possivelmente separada: "Squad traffic-google Phase 2 — automated mutations consumption"

## 8. Out of Scope (Epic 6)

- **Performance Max asset_group management** — complexidade própria; merece epic dedicado (Epic 7?)
- **Shopping feed management** — outro domínio (catálogo de produtos)
- **App campaigns** — pouca demanda atual
- **YouTube specific tooling** — UI cobre bem
- **Audience management (lists, custom audiences)** — não tem demanda imediata; UI funciona
- **Conversion tag setup** — UI cobre bem; CLI é overkill
- **Reporting alerts/scheduled reports** — squad analyst supre via *report

## 9. Definition of Done (Epic-level)

Epic 6 está Done quando:

- [ ] Stories 6.1, 6.2, 6.3, 6.4 todas em status **Done** com QA gate PASS
- [ ] Stories 6.5, 6.6, 6.7 em status **Done** OU explicitamente deferidas para Epic 7 com decisão registrada
- [ ] `google-ads --help` lista pelo menos: `update budget`, `update bidding`, `pause`, `enable`, `create campaign`, `create ad-group`, `keyword add/remove`, `ad create`, `delete campaign`
- [ ] Squad `traffic-google` Publisher agent atualizado para usar `*publish` automatizado (não mais coordenação manual no UI)
- [ ] Squad Optimizer ganhou flag `--apply` que executa recomendações via CLI
- [ ] Smoke real-time end-to-end: criar campanha Search → publicar → aguardar 30min → reportar → otimizar (ajustar budget) → pausar → tudo via CLI
- [ ] Zero incidentes financeiros reportados durante smoke (orçamento bate o esperado)
- [ ] Documentação atualizada: README do `google-ads-agent` + README do squad `traffic-google`

## 10. Open Questions for User — RESOLVED 2026-05-21

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Developer Token level | **Standard** (sem limites de chamadas; mutações em todas as 24 contas Solaro autorizadas) |
| 2 | Smoke target | **Customer 5562216599** ("Solaro Marketing e Vendas" — sub-conta da MCC; segura para teste) |
| 3 | Tipo de campanha 6.3 | **Splitar em 6.3a (Search) / 6.3b (Display) / 6.3c (PMax)** — 9 stories totais |
| 4 | Anti-runaway threshold | **+50%** como default; configurable via `--max-budget-increase` por sessão |

## 11. Next Action

```
@pm → *create-story 6.1   (Story Update budget + bidding strategy)
```

Ou aguardar respostas das open questions acima antes de drafter.

## Change Log

| Date | Description |
|------|-------------|
| 2026-05-21 | Epic 6 drafted by @pm based on user request + @qa recommendation re-prioritization (budget/pause before create) |
