# Epic 7 — Google Ads Keyword Research

| | |
|---|---|
| **Epic ID** | epic-7-google-ads-keyword-research |
| **Status** | In Progress |
| **Owner** | @pm (Morgan) |
| **Stakeholders** | gestor de tráfego (Hergamenes), traffic-google squad agents, clientes da MCC Solaro |
| **Parent product** | aiox-pro-traffic / packages/google-ads-agent |
| **Builds on** | Epic 5 (read MVP — Stories 5.1-5.4 Done), Epic 6 (mutations — Done) |
| **Date drafted** | 2026-06-11 |
| **Origin** | SPEC do Performance Analyst (`SPEC-keyword-research.md`) → demanda real Bento Ghostwriting |

---

## 1. Vision Statement

> **Dar ao squad `traffic-google` inteligência de DEMANDA — descobrir o que o mercado busca no Google ANTES de criar campanhas, em vez de adivinhar.**

O Epic 5 entregou um CLI que **lê** performance de campanhas existentes. O Epic 6 entregou **mutações** (criar/ajustar/pausar). Mas faltava a etapa que vem ANTES de tudo: **pesquisar volume de busca**. Hoje o gestor abre o Planejador de Palavras-chave manualmente no Google Ads UI, copia números na mão e perde a integração com o fluxo automatizado. O Epic 7 traz o Keyword Planner para a CLI — escopado por conta, em JSON consumível por relatórios, e reutilizável pelos agentes do squad.

## 2. Business Case

### Por que keyword research via CLI > UI?

| Aspecto | Google Ads UI (Planejador) | CLI + Squad (pós-Epic 7) |
|---------|----------------------------|---------------------------|
| Pesquisar 16 termos | 5-10 min (copiar/colar manual) | 5-10s (1 comando) |
| Dados consumíveis por relatório | Não (export CSV manual) | Sim (`--format json`) |
| Escopo por cliente isolado | Switch manual de conta | `--customer-id` por chamada |
| Descoberta de termos novos | Manual, olho a olho | Ideias relacionadas no payload |
| Integração com Performance Analyst | Nenhuma | Direta (relatório de demanda) |
| Reuso pelo squad | Não | Launcher/Optimizer podem consumir |

### Quem usa
1. **Hergamenes** — antes de criar campanha Search para qualquer cliente, validar demanda
2. **Performance Analyst** (squad) — consome o JSON para montar relatório de oportunidade de keywords
3. **Campaign Launcher** (squad, futuro) — sugerir keywords seed a partir de volume real

### Impacto esperado
- **Tempo de pesquisa de keywords:** -90% (10 min → segundos)
- **Qualidade de decisão:** campanhas Search nascem com keywords validadas por volume real, não por intuição
- **Aplicação imediata:** primeiro caso real é a Bento Ghostwriting ("escrever livro com IA", 16 seeds)

## 3. Goals & Success Metrics

| Goal | Métrica | Target |
|------|---------|--------|
| G1: CLI puxa volume de busca real | `google-ads keyword-research` retorna volume + concorrência + CPC | Story 7.1 Done |
| G2: Saída consumível por relatório | `--format json` estruturado | Story 7.1 (AC#6) |
| G3: Descoberta de keywords novas | Ideias relacionadas incluídas além das seeds | Story 7.1 (AC#10) |
| G4: Cobertura de testes | ≥80% nos arquivos de lógica pura + erro validado in vivo | Story 7.1 (parcial — ver QA) |
| G5: Integração com Performance Analyst | Relatório de demanda gerado a partir do JSON | Story futura 7.x |

## 4. Stories Proposed

### Tier 1 — Pesquisa de Demanda (Core)

| Story | Título | Pts | Risco | Status |
|-------|--------|-----|-------|--------|
| **7.1** | Keyword Research (GenerateKeywordIdeas / volume de busca) | 3 | Médio | **Ready for Review** (QA CONCERNS, PO GO 9/10) |

### Tier 2 — Projeção e Histórico (Futuro, sob demanda)

| Story | Título | Pts | Risco | Por que depois |
|-------|--------|-----|-------|----------------|
| **7.2** | Forecast metrics (GenerateKeywordForecastMetrics) | 5 | Médio | Projeção de impressões/cliques/custo p/ um conjunto de keywords + budget; útil para planejar campanha, mas não bloqueia a 7.1 |
| **7.3** | Historical metrics (GenerateKeywordHistoricalMetrics) | 3 | Baixo | Tendência mês a mês de termos específicos; refina sazonalidade |
| **7.4** | Integração Performance Analyst — Relatório de Demanda | 3 | Baixo | Consome o JSON da 7.1 e gera relatório de oportunidade escopado por cliente |

**Total entregue: 1 story (3 pts).** Tier 2 é backlog sob demanda — só puxar se houver necessidade concreta.

## 5. Sequencing Rationale

```
Story 7.1 (Tier 1) — pesquisa de volume; destrava a capacidade core
   ↓ BLOCKER EXTERNO: developer token precisa de Basic access (ver E-R1)
   ↓ check-in: rodar 16 seeds reais da Bento após upgrade do token
Tier 2 (7.2-7.4) — sob demanda, conforme necessidade real do gestor
```

**Princípio:** entregar a capacidade mínima útil (pesquisa de volume) primeiro. Projeção/histórico/relatório só entram quando houver demanda concreta — evitar over-engineering.

## 6. Risks (Epic-level)

| ID | Risco | Probabilidade | Impacto | Status / Mitigação |
|----|-------|--------------|---------|---------------------|
| E-R1 | **Developer token em "explorer/test access" bloqueia GenerateKeywordIdeas** | **MATERIALIZADO** | **Alto** | ⚠️ **CONFIRMADO na 7.1**: API retorna `DEVELOPER_TOKEN_NOT_APPROVED`. Bloqueia uso real até o token receber **Basic access** (Google Ads → Ferramentas → Central de API). Código trata o erro com mensagem PT-BR acionável. |
| E-R2 | Shape da resposta de SUCESSO diverge do parser (campos int64 como Long) | Média | Médio | Parser defensivo (string\|número); QA sinalizou validar contra primeira resposta real e endurecer `toNumber` se necessário |
| E-R3 | SDK `google-ads-api` muda assinatura do KeywordPlanIdeaService entre versões | Baixa | Médio | Adapter port discipline (SDK só em `keyword-ideas.ts`); pin `^23.0.0` |
| E-R4 | Limite de seeds/quota da API em chamadas grandes | Baixa | Baixo | Validação client-side de máx. 20 seeds; chunking fica fora de escopo |
| E-R5 | Cobertura de dados de volume varia por geo/idioma (termos muito nichados retornam vazio) | Média | Baixo | Comportamento esperado da API; CLI mostra "nenhuma ideia" graciosamente |

## 7. Dependencies

### Internal (within aiox-pro-traffic)
- Epic 5 Done ✅ (CLI base + adapter port + auth/config + test infra)
- Epic 6 Done ✅ (padrões de comando consolidados)
- Adapter port em `src/google-ads-api/` estabelecido

### External (Google) — ⚠️ BLOCKER ATIVO
- **Developer Token com `Basic Access` ou `Standard Access`** — `GenerateKeywordIdeas` NÃO funciona com explorer/test access. **Este é o bloqueador atual do épico** (E-R1 materializado).
- OAuth client autorizado para escopo `https://www.googleapis.com/auth/adwords`
- Conta acessível para autenticar a chamada (os dados de volume são do Google, não da conta)

### Squad consumer (downstream)
- Performance Analyst (`traffic-google`) — consumir o JSON para relatório de demanda (Story 7.4 futura)
- Campaign Launcher — sugerir keywords seed a partir de volume real (futuro)

## 8. Out of Scope (Epic 7)

- **KeywordPlan persistido na conta** — a 7.1 usa GenerateKeywordIdeas (stateless); criar/gerenciar planos salvos não tem demanda
- **Forecast de campanha completa** — projeção fica na 7.2 (Tier 2, sob demanda)
- **Sugestão automática de negative keywords** — domínio separado
- **Bulk research via CSV de entrada em massa** — `--seeds` inline + `--seeds-file` simples cobrem o caso
- **Auto-criação de campanha a partir das keywords** — isso é Epic 6 (mutations); aqui só pesquisamos

## 9. Definition of Done (Epic-level)

Epic 7 está Done quando:

- [x] Story 7.1 implementada com QA gate (CONCERNS aceito) e PO GO
- [ ] `google-ads keyword-research` valida contra resposta de SUCESSO real (depende do Basic access — E-R1)
- [ ] 16 seeds reais da Bento Ghostwriting rodadas e entregues ao Performance Analyst
- [ ] `toNumber` confirmado/endurecido contra o shape real de int64 (ação obrigatória do QA gate)
- [ ] Documentação: README do `google-ads-agent` menciona o comando + pré-requisito de Basic access
- [ ] Tier 2 (7.2-7.4): em **Done** OU explicitamente deferidas com decisão registrada

## 10. Open Questions for User

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Developer token tem Basic access? | **NÃO (2026-06-11)** — está em explorer access; GenerateKeywordIdeas bloqueado. Solicitar upgrade. |
| 2 | Bento Ghostwriting (`4507487307`) está sob qual MCC? | **A CONFIRMAR** — define se precisa de `--login-customer-id` |
| 3 | Tier 2 (forecast/histórico/relatório) tem demanda agora? | **A DECIDIR** — backlog sob demanda; não priorizar sem necessidade concreta |

## 11. Next Action

```
1. Usuário → solicitar Basic access do developer token (destrava E-R1)
2. @devops → push da Story 7.1 (código pronto e validado)
3. Pós-Basic-access → rodar 16 seeds reais da Bento (validar parser real-world)
```

## Change Log

| Date | Description |
|------|-------------|
| 2026-06-11 | Epic 7 formalizado por @pm (retroativo) a partir da SPEC do Performance Analyst e da Story 7.1 já implementada/validada. Registrado E-R1 (developer token explorer access) como blocker materializado. |
