# Epic 9 — Google Ads Audiences (Públicos-Alvo)

| | |
|---|---|
| **Epic ID** | epic-9-google-ads-audiences |
| **Status** | Draft |
| **Owner** | @sm (River) — draft retroativo; formalização de escopo pendente @pm |
| **Stakeholders** | gestor de tráfego (Hergamenes), squad `traffic-google`, clientes operados via CLI |
| **Parent product** | aiox-pro-traffic / packages/google-ads-agent (`@aiox/google-ads-agent` v0.1.2) |
| **Builds on** | Epic 5 (read MVP — Done), Epic 6 (mutations — Done), Epic 7 (keyword research — Ready for Review) |
| **Date drafted** | 2026-07-23 |
| **Origin** | Demanda direta do usuário — pacote não possui NENHUM suporte a públicos-alvo (confirmado por varredura: `grep -rn "user_list|UserList|remarketing|audience" src/` retornou zero ocorrências de negócio) |

---

## 1. Vision Statement

> **Dar ao gestor de tráfego a capacidade de criar e usar públicos-alvo do Google Ads via CLI — remarketing, segmentação por interesse e Customer Match — sem depender da UI do Google Ads.**

Os Epics 5-7 entregaram leitura, mutação de campanhas/anúncios/keywords e pesquisa de demanda. Mas nenhum deles toca em **audiences** — o pacote não sabe criar uma lista de remarketing, aplicar um público a uma campanha, criar um segmento personalizado, nem subir uma lista de Customer Match. Isso força o gestor a abrir a UI do Google Ads sempre que precisa configurar remarketing para um cliente — quebrando o fluxo "tudo via CLI" que os epics anteriores estabeleceram.

A tag do Google Ads já está instalada e coletando dados nos sites dos clientes atendidos por este projeto, então há uma base real para popular listas de remarketing assim que forem criadas.

## 2. Business Case

### Por que audiences via CLI > UI?

| Aspecto | Google Ads UI (Gerenciador de Públicos-alvo) | CLI + Squad (pós-Epic 9) |
|---------|-----------------------------------------------|---------------------------|
| Criar lista de remarketing | Navegação manual, 5-8 cliques | 1 comando |
| Repetir para múltiplos clientes | Repetir toda a navegação por conta | 1 comando com `--customer-id` diferente |
| Auditoria de quem criou o quê / quando | Não nativo | `appendMutationLog` (mesmo padrão de todas as mutações do Epic 6) |
| Consistência de duração de associação | Depende de lembrar o padrão | Default fixo documentado, sempre igual |
| Integração futura com squad (sugestão de públicos por cliente) | Nenhuma | Direta (JSON/CLI reusável por agentes) |

### Quem usa
1. **Hergamenes** — cria remarketing/segmentos/Customer Match para clientes reais, direto do terminal
2. **Squad `traffic-google`** (futuro) — pode reusar os comandos para sugerir/aplicar públicos automaticamente

### Impacto esperado
- Elimina a única lacuna funcional remanescente entre "o que o gestor faz na UI" e "o que o CLI cobre" para o fluxo de segmentação
- Reduz risco de erro manual (ex.: esquecer de configurar a duração de associação corretamente)
- Prepara terreno para Customer Match (Story 4), que é a forma mais poderosa de remarketing (dados 1st-party) mas também a mais arriscada

## 3. Goals & Success Metrics

| Goal | Métrica | Target |
|------|---------|--------|
| G1: Criar lista de remarketing via CLI | `google-ads create audience-remarketing` cria `user_list` real na conta | Story 9.1 Done |
| G2: Aplicar público a uma campanha | Comando de segmentação/observação usando `campaign_criterion`/`ad_group_criterion` | Story 9.2 (backlog) |
| G3: Segmento personalizado (interesse) | Comando de custom segment | Story 9.3 (backlog) |
| G4: Customer Match | Upload de dados hasheados via `OfflineUserDataJob` | Story 9.4 (backlog, alto risco) |
| G5: Auditoria consistente | Toda mutação de audience registrada em `appendMutationLog` | Todas as stories |

## 4. Stories Proposed

### Tier 1 — Fundação de Remarketing (Core, esta entrega)

| Story | Título | Pts | Risco | Status |
|-------|--------|-----|-------|--------|
| **9.1** | Criar lista de remarketing rule-based (`create audience-remarketing`) | 3 | Médio | **Draft** (redigida nesta sessão) |

### Tier 2 — Aplicação e Expansão (Esboçado, sob demanda)

| Story | Título | Pts (est.) | Risco | Descrição resumida |
|-------|--------|------------|-------|---------------------|
| **9.2** | Aplicar público existente a campanha/grupo de anúncios | 3 (est.) | Médio | Novo comando (ex.: `google-ads update campaign-audience` ou `google-ads audience apply`) que cria `campaign_criterion` ou `ad_group_criterion` do tipo `user_list`, em modo **observação** (`bidding_strategy` inalterado, só coleta de dados) ou **segmentação** (`TARGETING`). Depende de uma `user_list` já existir (produzida pela Story 9.1). Reaproveita padrão de preview/confirm/dry-run/audit já estabelecido no Epic 6 (`update.ts`/`pause-enable.ts`). Risco: enum `campaign_criterion.negative` e `user_list.targeting_status` precisam ser confirmados nos types do SDK v23 durante implementação — não inventar a forma exata aqui. |
| **9.3** | Criar custom segment (público de interesse personalizado) | 5 (est.) | Médio | Novo comando (ex.: `google-ads create audience-custom-segment`) usando o recurso `CustomAudience`/`custom_audience` (substituto do antigo "custom affinity/intent audience" na API v23 — **a confirmar o nome exato do serviço/entidade nos types do SDK durante implementação**, não assumir aqui). Definição por palavras-chave/URLs/apps de interesse do público, não por comportamento no site do cliente (diferença central vs Story 9.1). Reaproveita o mesmo esqueleto de comando (auth → preview → confirm → mutate → audit) da Story 9.1. |
| **9.4** | Customer Match (`crm_based_user_list` + upload de dados hasheados) | 8 (est.) | **Alto** | A mais complexa e arriscada do épico. Fluxo de duas fases: (1) criar `crm_based_user_list` (`user_list.crm_based_user_list_info`); (2) enviar os dados via `OfflineUserDataJob` (`CREATE`, adicionar operações de `UserData` com identificadores **hasheados SHA-256 normalizados** — e-mail/telefone —, depois `run`). **Pré-requisito de política do Google**: a conta precisa estar aprovada para Customer Match (nem toda conta tem acesso automático). Risco de segurança adicional: dados de PII do cliente final passam pelo CLI antes de hash — precisa de tratamento de dado sensível em memória/log (nunca logar PII em claro, nunca persistir em `appendMutationLog` sem hash). Isso é maior escopo que uma "story simples" — pode exigir spec pipeline (`@architect`/`@pm`) antes de virar story implementável, dado o Artigo V (Quality First) e o risco de compliance. |

**Total entregue nesta sessão: 1 story detalhada (9.1, 3 pts). Tier 2 é backlog esboçado — cada uma precisa passar por refinamento de @sm/@po antes de ir para @dev, especialmente a 9.4 pelo risco de compliance/PII.**

## 5. Sequencing Rationale

```
Story 9.1 (Tier 1) — cria a lista de remarketing; destrava a capacidade core
   ↓ a lista fica vazia até a tag popular membros (comportamento esperado — fora do controle do CLI)
Story 9.2 — aplicar a lista criada em 9.1 a uma campanha real (depende de 9.1 Done)
Story 9.3 — segmento de interesse (independente de 9.1/9.2, pode ser puxada em paralelo se houver demanda)
Story 9.4 — Customer Match (maior risco; só puxar quando houver caso de uso real E confirmação de que a conta tem aprovação de política)
```

**Princípio:** entregar a capacidade mínima útil (remarketing simples) primeiro, igual ao Epic 7. As demais stories do Tier 2 só devem ser puxadas para draft completo quando houver demanda concreta de um cliente — evitar over-engineering, especialmente na 9.4 que tem custo de compliance real.

## 6. Risks (Epic-level)

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| E-R1 | Forma exata do campo de regra do `rule_based_user_list` (`FlexibleRuleUserListInfo` vs `ExpressionRuleUserListInfo`) diverge do esperado nos types do SDK v23 | Média | Médio | @dev confirma contra `node_modules/google-ads-api` (ou docs oficiais) antes de codar o builder; documentado como pendência explícita na Story 9.1 |
| E-R2 | Conta não tem permissão/elegibilidade para criar `user_list` (ex.: algumas contas MCC-only não permitem) | Baixa-Média | Médio | Tratamento de erro dedicado seguindo o padrão de `errors/error-map.ts`; AC de erro na Story 9.1 |
| E-R3 | Lista de remarketing criada mas vazia por muito tempo (tag não dispara para o segmento esperado) | Média | Baixo | Fora do escopo do CLI — é comportamento de coleta de dados, não de código; mencionar como expectativa no output "próximos passos" |
| E-R4 | Story 9.4 (Customer Match) tratar PII de forma inadequada (log, persistência) | Baixa (story ainda não implementada) | **Alto** | Story 9.4 permanece só esboçada até passar por spec pipeline dedicado (@architect + @pm) antes de virar story implementável |
| E-R5 | SDK `google-ads-api` muda assinatura do `UserListService`/`CustomAudienceService`/`OfflineUserDataJobService` entre versões | Baixa | Médio | Boundary rule mantida: SDK só importado em `src/google-ads-api/`; pin `^23.0.0` |

## 7. Dependencies

### Internal (within aiox-pro-traffic)
- Epic 5 Done ✅ (CLI base + adapter port + auth/config + test infra)
- Epic 6 Done ✅ (padrão de comando de mutação: preview → confirm → mutate → audit)
- Epic 7 Ready for Review (padrão de comando read-only para referência de flags, não usado diretamente aqui pois 9.1 é mutação)
- Adapter port em `src/google-ads-api/` estabelecido (SOMENTE `client.ts`, `mutations.ts`, `adapter.ts`, `accounts.ts` importam `google-ads-api`)

### External (Google)
- Conta com permissão para criar `user_list` (a maioria das contas de anunciante tem; a confirmar caso a conta seja restrita)
- Story 9.4 (futura): aprovação de política de Customer Match na conta — bloqueador externo conhecido, análogo ao developer token do Epic 7

## 8. Out of Scope (Epic 9, nesta entrega)

- **Stories 9.2, 9.3, 9.4 completas** — só esboçadas neste EPIC.md; cada uma precisa de rodada própria de `*create-story` antes de virar implementável
- **Relatório de performance por audience** — isso seria uma extensão do Epic 4 (reporting), não deste épico
- **Sugestão automática de públicos por IA** — fora de escopo; isso é trabalho de squad/agente consumidor, não do CLI base
- **Importação de audiences de outras plataformas (Meta, etc.)** — cada plataforma tem seu próprio pacote (`meta-ads-agent`); sem integração cruzada

## 9. Definition of Done (Epic-level)

Epic 9 está Done quando:

- [ ] Story 9.1 implementada, validada por @po, com QA gate e push
- [ ] Story 9.2 redigida em detalhe e implementada (aplicar público a campanha)
- [ ] Story 9.3 redigida em detalhe e implementada OU explicitamente deferida com decisão registrada (sem demanda concreta)
- [ ] Story 9.4 passou por spec pipeline de compliance/PII e foi redigida em detalhe (ou explicitamente deferida)
- [ ] README do `google-ads-agent` documenta os novos comandos de audience

## 10. Open Questions for User

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | A conta usada nos smokes reais tem permissão para criar `user_list`? | **A CONFIRMAR** durante implementação da Story 9.1 |
| 2 | Story 9.4 (Customer Match) tem demanda concreta agora ou é preparação futura? | **A DECIDIR** — mantida só esboçada até haver caso de uso real, dado o risco de PII |
| 3 | Tier 2 completo (9.2-9.4) deve ser priorizado logo após 9.1, ou aguardar a lista de remarketing popular primeiro? | **[AUTO-DECISION]** Priorizar 9.2 logo após 9.1 (aplicar o público é o que dá valor de negócio à lista criada); 9.3 e 9.4 ficam sob demanda (reason: uma lista de remarketing sem campanha usando-a não gera valor — a sequência natural é criar → aplicar) |

## 11. Next Action

```
1. @po → *validate-story-draft 9.1 (validação dos 10 critérios antes de @dev)
2. @dev → *develop-story 9.1 após GO do @po
3. Após 9.1 Done → @sm redige Story 9.2 em detalhe (aplicar público à campanha)
```

## Change Log

| Date | Description |
|------|-------------|
| 2026-07-23 | Epic 9 criado por @sm (River) a partir de demanda direta do usuário. Story 9.1 redigida em detalhe; Stories 9.2-9.4 esboçadas para refinamento futuro. |
