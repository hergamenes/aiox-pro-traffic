# Epic 8 — Traffic Kit: Export dos Squads de Tráfego

| | |
|---|---|
| **Epic ID** | epic-8-traffic-kit-export |
| **Status** | Draft |
| **Owner** | @pm (Morgan) |
| **Stakeholders** | gestor de tráfego (Hergamenes), squads traffic-meta + traffic-google, clientes futuros (cada novo projeto/pasta) |
| **Parent product** | aiox-pro-traffic / squads/traffic-* + packages/{meta,google}-ads-agent |
| **Builds on** | Epic 5 (Google read MVP — Done), Epic 6 (Google mutations — Done), Epic 7 (keyword research — In Progress), squads traffic-meta/traffic-google já operacionais |
| **Date drafted** | 2026-06-12 |
| **Origin** | Análise de portabilidade pelo @aiox-master — demanda do gestor de instalar os squads em qualquer projeto/máquina |

---

## 1. Vision Statement

> **Tornar os squads `traffic-meta` e `traffic-google` instaláveis em qualquer projeto ou máquina, 100% funcionais (agentes + CLI + MCP), com um único comando — sem quebrar o isolamento de dados entre clientes.**

Hoje os squads vivem e funcionam apenas **dentro deste repositório**. O squad traffic-meta invoca o CLI por path relativo (`node packages/meta-ads-agent/dist/bin/meta-ads.js ...`), o que quebra fora daqui; há conteúdo duplicado (~614 linhas) entre os dois squads; e dados de clientes reais (Medical Spin) estão embutidos nos squads, violando o princípio de isolamento. O Epic 8 transforma os squads num **kit portátil**: padroniza a invocação dos CLIs via PATH, extrai o que é comum para uma fonte única, remove dados de cliente dos squads e entrega um installer que reproduz tudo num projeto/pasta de destino.

## 2. Business Case

### Por que um kit portátil > squads presos a um repo?

| Aspecto | Hoje (squads acoplados a este repo) | Pós-Epic 8 (Traffic Kit) |
|---------|--------------------------------------|---------------------------|
| Usar os squads em outro projeto | Impossível (path relativo quebra) | `install-traffic-kit.sh <destino>` |
| Invocação do CLI Meta | `node packages/.../meta-ads.js` (frágil) | `meta-ads ...` (PATH global) |
| Conteúdo comum entre squads | ~614 linhas duplicadas (2 fontes de verdade) | `squads/traffic-shared/` (1 fonte) |
| Dados de cliente | Embutidos nos squads (vaza entre projetos) | Só `_TEMPLATE.md`; perfis por projeto |
| Setup em máquina nova | Manual, sem documentação | README + auth + MCP documentados |
| Branding Solaro | Disperso | Bundle copiado pelo installer |

### Quem usa
1. **Hergamenes** — instala os squads em cada novo projeto de cliente sem copiar arquivos na mão
2. **Squads traffic-meta / traffic-google** — passam a rodar idênticos em qualquer pasta (CLIs no PATH)
3. **Futuros projetos/clientes** — recebem o kit com isolamento de dados garantido por construção

### Impacto esperado
- **Tempo de setup de um projeto novo:** de "horas copiando arquivos + ajustando paths" para 1 comando + auth
- **Risco de vazamento de dados entre clientes:** eliminado por construção (squads não carregam perfis reais)
- **Manutenção:** conteúdo comum corrigido em 1 lugar (`traffic-shared`), não em 2

## 3. Goals & Success Metrics

| Goal | Métrica | Target |
|------|---------|--------|
| G1: CLIs invocados por PATH | Squad traffic-meta usa `meta-ads`; traffic-google usa `google-ads` (já) | Story 8.1 Done |
| G2: Fonte única de conteúdo comum | `squads/traffic-shared/` criado; referências nos 2 squads | Story 8.2 Done |
| G3: Isolamento de dados garantido | Nenhum perfil de cliente real dentro de `squads/` (só `_TEMPLATE.md`) | Story 8.3 Done |
| G4: Instalação reproduzível | `install-traffic-kit.sh <destino>` reproduz squads + CLIs + reports + allow rules | Story 8.4 Done |
| G5: Documentação de onboarding | README cobre projeto novo, máquina nova, auth e MCP Facebook | Story 8.4 Done |

## 4. Stories Proposed

### Tier 1 — Portabilidade dos Squads (sequencial obrigatório)

| Story | Título | Pts | Risco | Status |
|-------|--------|-----|-------|--------|
| **8.1** | Padronizar invocação CLI do squad traffic-meta via PATH (`meta-ads`) + instalação global dos 2 CLIs | 3 | Médio | Draft |
| **8.2** | Extrair conteúdo idêntico para `squads/traffic-shared/` e atualizar referências | 5 | Médio | Draft |
| **8.3** | Remover client-profiles reais dos squads; convenção de perfis por projeto | 2 | Baixo | Draft |
| **8.4** | `install-traffic-kit.sh` + `README-TRAFFIC-KIT.md` + branding bundle | 5 | Médio | Draft |

**Total: 4 stories (15 pts).** Não há Tier 2 — o escopo é fechado e sequencial.

### Story 8.1 — Padronizar invocação CLI via PATH

**Acceptance Criteria (alto nível):**
- AC1: Toda invocação de CLI no squad `traffic-meta` (agentes, tasks, workflows, data, checklists) usa `meta-ads ...` no PATH — zero `node packages/.../meta-ads.js`.
- AC2: Squad `traffic-google` auditado e confirmado consistente (já usa `google-ads` no PATH); corrigir qualquer desvio remanescente.
- AC3: Documentado o procedimento de instalação global dos 2 CLIs a partir de `packages/` (`npm install -g` após build de `meta-ads-agent` e `google-ads-agent`).
- AC4: `meta-ads --version` e `google-ads --version` (ou comando equivalente) funcionam de qualquer diretório após instalação global.
- AC5: Nenhuma referência a path relativo do repo permanece nos squads.

### Story 8.2 — Extrair conteúdo comum para `traffic-shared/`

**Acceptance Criteria (alto nível):**
- AC1: Criado `squads/traffic-shared/` contendo os arquivos idênticos: `templates/campaign-brief.md`, `templates/optimization-log.md`, `checklists/pre-launch.md`, `checklists/optimization-rules.md`, `checklists/report-validation.md`, `data/action-prioritization.md`, `data/utm-conventions.md`, `data/client-profiles/_TEMPLATE.md`.
- AC2: Os dois squads (`traffic-meta`, `traffic-google`) passam a **referenciar** os arquivos compartilhados em vez de manter cópias próprias.
- AC3: Todas as referências em agentes/tasks/workflows que citavam os arquivos agora apontam para `traffic-shared/`.
- AC4: Os 2 squads permanecem separados — apenas o conteúdo 100% comum (~614 linhas) é extraído; conteúdo específico de plataforma (83% do total) fica intacto.
- AC5: Nenhuma duplicação remanescente dos arquivos listados; uma única fonte de verdade.

### Story 8.3 — Remover client-profiles reais; convenção por projeto

**Acceptance Criteria (alto nível):**
- AC1: Removidos `squads/traffic-meta/data/client-profiles/medical-spin.md` e `squads/traffic-google/data/client-profiles/medical-spin.md` (e quaisquer outros perfis reais).
- AC2: Mantido apenas `_TEMPLATE.md` (via `traffic-shared/` da Story 8.2).
- AC3: Definida e documentada a convenção de onde os perfis de cliente vivem por projeto (ex.: `reports/{cliente}/client-profile.md`, já usado pelo squad google).
- AC4: Referências de agentes/tasks que liam perfis embutidos atualizadas para a convenção por projeto.
- AC5: Validação: nenhum dado de cliente real permanece sob `squads/` — isolamento garantido por construção.

### Story 8.4 — Installer + README + branding bundle

**Acceptance Criteria (alto nível):**
- AC1: `scripts/install-traffic-kit.sh <destino>` copia `squads/traffic-{shared,meta,google}` e `.claude/commands/traffic{Meta,Google}` para o projeto de destino.
- AC2: O script verifica/instala os CLIs globais a partir de `packages/` (build + `npm install -g`).
- AC3: O script cria `reports/` no destino.
- AC4: O script adiciona, no `.claude/settings.local.json` do destino, **allow rules de LEITURA** (`meta-ads report/accounts/auth status`, `google-ads report/accounts/auth status`), mantendo mutações sob confirmação manual.
- AC5: O script copia os assets de branding Solaro se existirem no repo.
- AC6: `README-TRAFFIC-KIT.md` documenta: instalação em projeto novo, setup em máquina nova (auth via Keychain), e o MCP `claude_ai_Facebook` (conector da conta claude.ai — nada a instalar, apenas documentar).
- AC7: O installer NÃO duplica squads num diretório de kit — opera a partir das fontes deste repo (fonte única de verdade).

## 5. Sequencing Rationale

```
Story 8.1 (CLI via PATH)        — base de portabilidade; sem isto nada roda fora do repo
   ↓
Story 8.2 (traffic-shared)      — toca arquivos dos squads; extrai fonte única
   ↓
Story 8.3 (remover perfis)      — toca arquivos dos squads; depende da estrutura shared
   ↓
Story 8.4 (installer + docs)    — empacota o resultado de 8.1-8.3; depende de todas
```

**Princípio:** ordem estritamente sequencial. 8.2 e 8.3 modificam os mesmos arquivos dos squads — executar em paralelo geraria conflito. 8.4 só faz sentido depois que squads e CLIs estão portáveis e limpos de dados de cliente.

## 6. Risks (Epic-level)

| ID | Risco | Probabilidade | Impacto | Status / Mitigação |
|----|-------|--------------|---------|---------------------|
| E-R1 | **`npm install -g` falha ou CLI não entra no PATH** (perms, nvm, node version) | Média | Alto | Installer valida `meta-ads`/`google-ads` no PATH ao final; README documenta troubleshooting (nvm/perms) |
| E-R2 | **Referência cruzada quebrada** após extrair para `traffic-shared/` | Média | Médio | Grep de validação por arquivo movido; teste de ativação dos 4 agentes de cada squad pós-8.2 |
| E-R3 | **Vazamento residual de dados de cliente** (perfil esquecido, hardcode em task) | Baixa | Crítico | Story 8.3 inclui grep exaustivo por nomes de clientes reais sob `squads/`; constraint inegociável |
| E-R4 | **Installer sobrescreve `settings.local.json` do destino** | Média | Alto | Script faz merge das allow rules (append), nunca overwrite; backup antes de tocar |
| E-R5 | **Branding Solaro ausente** em máquina/projeto sem os assets | Baixa | Baixo | Cópia de branding é condicional ("se existirem"); ausência não bloqueia instalação |
| E-R6 | **Drift entre 2 fontes de verdade** se installer duplicar squads | Baixa | Médio | Decisão de arquitetura: installer copia das fontes do repo, nunca mantém cópia-kit (E-R6 mitigado por design) |

## 7. Dependencies

### Internal (within aiox-pro-traffic)
- `squads/traffic-meta/` (~2.895 linhas) e `squads/traffic-google/` (~3.195 linhas) operacionais
- Shims em `.claude/commands/trafficMeta/agents/*.md` e `.claude/commands/trafficGoogle/agents/*.md`
- `packages/meta-ads-agent` (bin: `meta-ads`) e `packages/google-ads-agent` (bin: `google-ads`) — standalone, zero dependência do `.aiox-core`
- `workflows/full-campaign-cycle.yaml` em cada squad

### External
- **Node + npm** com permissão para `npm install -g` na máquina de destino
- **macOS Keychain** — credenciais dos CLIs vivem por máquina (funcionam em qualquer pasta após auth)
- **MCP `claude_ai_Facebook`** — conector da conta claude.ai do usuário; nada a instalar, apenas documentar no README

### Squad consumer (downstream)
- Qualquer projeto/pasta futuro que receba o kit via installer

## 8. Out of Scope (Epic 8)

- **Unificar os 2 squads num só** — 83% do conteúdo é específico de plataforma; mantê-los separados é decisão deliberada
- **Publicar o kit como pacote npm/marketplace** — installer local por script cobre a necessidade atual
- **Instalar/configurar o MCP Facebook** — é conector da conta claude.ai; fora do escopo do installer (só documentação)
- **Migração automática de perfis de cliente existentes** — perfis são criados por projeto sob demanda
- **Novas features dos squads ou dos CLIs** — Epic 8 é portabilidade/empacotamento, não funcionalidade nova
- **CI/CD para o installer** — execução manual por script é suficiente

## 9. Constraints

| Constraint | Descrição | Severidade |
|-----------|-----------|------------|
| **Isolamento de clientes** | Nenhum dado de cliente real pode residir dentro de `squads/`. Perfis vivem por projeto. Nunca cruzar dados entre empresas. | INEGOCIÁVEL |
| **Fonte única de verdade** | Conteúdo comum em `traffic-shared/` (não duplicado). Installer copia das fontes do repo (não mantém cópia-kit). | MUST |
| **KISS** | Installer é um shell script local + README. Sem over-engineering (sem npm publish, sem CI, sem framework de instalação). | MUST |
| **Squads separados** | traffic-meta e traffic-google permanecem 2 squads distintos. | MUST |
| **CLIs por PATH** | Toda invocação via `meta-ads`/`google-ads` no PATH — zero path relativo do repo. | MUST |
| **Allow rules de leitura apenas** | Installer libera só comandos de leitura (report/accounts/auth status); mutações exigem confirmação manual. | MUST |

## 10. Definition of Done (Epic-level)

Epic 8 está Done quando:

- [ ] Stories 8.1, 8.2, 8.3, 8.4 todas em **Done** (QA gate + PO GO)
- [ ] Squad `traffic-meta` invoca exclusivamente `meta-ads` no PATH; `traffic-google` confirmado em `google-ads` (8.1)
- [ ] `squads/traffic-shared/` é a única fonte dos ~614 linhas comuns; 2 squads referenciam (8.2)
- [ ] Nenhum perfil de cliente real sob `squads/` — grep limpo; só `_TEMPLATE.md` (8.3)
- [ ] `scripts/install-traffic-kit.sh` + `README-TRAFFIC-KIT.md` + branding bundle entregues (8.4)
- [ ] **Teste de instalação real:** rodar `install-traffic-kit.sh` num diretório de teste vazio (simulando projeto novo), validar que os 4 agentes de cada squad ativam, que `meta-ads`/`google-ads` respondem no PATH, e que `reports/` + allow rules de leitura foram criados — sem nenhum dado de cliente herdado
- [ ] README valida o caminho de máquina nova (auth via Keychain) e documenta o MCP Facebook

## 11. Open Questions for User

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Os assets de branding Solaro devem ser parte fixa do kit ou opcionais por projeto? | [AUTO-DECISION] Opcionais — installer copia "se existirem" (reason: nem todo cliente é Solaro; cópia condicional evita acoplamento) |
| 2 | O installer deve suportar atualização (re-run sobre projeto já instalado) ou só instalação limpa? | [AUTO-DECISION] Instalação + merge idempotente de allow rules nesta primeira versão; re-run completo seguro fica como melhoria futura (reason: KISS — cobrir o caso principal sem over-engineering) |
| 3 | Bento Ghostwriting / outros clientes terão perfil criado por projeto após o kit? | A CONFIRMAR — convenção `reports/{cliente}/client-profile.md` definida na 8.3; criação por projeto sob demanda |

## 12. Next Action

```
1. @sm → *draft Story 8.1 (CLI via PATH) — primeira da sequência
2. @po → *validate-story-draft 8.1
3. @dev → implementar 8.1; depois 8.2 → 8.3 → 8.4 em ordem estrita
4. Pós-8.4 → teste de instalação em diretório de teste (DoD do epic)
```

## Change Log

| Date | Description |
|------|-------------|
| 2026-06-12 | Epic 8 formalizado por @pm (Morgan) a partir da análise de portabilidade do @aiox-master. Escopo fechado em 4 stories sequenciais (8.1 CLI via PATH, 8.2 traffic-shared, 8.3 remover perfis, 8.4 installer). Constraints de isolamento de clientes e fonte única registrados como inegociáveis. |
