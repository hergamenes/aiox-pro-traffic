# Copy - Elite Copywriting Squad v4.0

**Command:** `/copy`
**Independence:** 100% Self-Contained
**Version:** 4.0.0

> Um time de 27 executores organizados por Tier e camada operacional para criar pecas de alta conversao com metodologia research-first.

---

## O Que Ha de Novo na v4.0

### Config Sync v4.0.0
- **0 orphan files** após sincronização completa do manifesto e do filesystem
- **27 executores ativos** (23 copywriters + 1 orchestrator + 1 tool + 1 human + 1 worker)
- **76 tasks** registradas (38 core + 15 PLF + 1 Brunson + 22 novas)
- **55 checklists** registradas (10 original + 18 PLF + 1 Brunson + 26 core novos)
- **51 templates** registradas
- **19 data files** com KBs, registry de tokens e governança de quality gates
- **14 workflows** no yolo_mode (7 originais + 7 novos)
- **37 research docs** com metodologia research-first
- **PLF sub-module** completo (Jeff Walker - Product Launch Formula)
- **Brunson sub-module** iniciado (Russell Brunson - Funnels)

### Operational Governance Layer
- **Token Registry** para handoff explícito entre estratégia, execução, review e packaging
- **Quality Gates** com thresholds numéricos, veto conditions e owner por gate
- **Coverage Matrix** ligando os 14 workflows ativos aos gates formais do squad

### Copy Discovery Pipeline v2.0
Pipeline automatizado para projetos completos:
- **14 workflows** por tipo de projeto (full-launch, paid-traffic, high-ticket, etc.)
- **Master Decision Matrix** - 5 perguntas antes de iniciar
- **Clone Combos** - combinacoes validadas de copywriters
- **Parallel Execution** - Headlines e Bullets rodam simultaneamente

### Tier System (v3.0)
Copywriters agora sao organizados por funcao, nao "qualidade":
- **Tier 0 (Diagnostico):** SEMPRE primeiro - avalia antes de escrever
- **Tier 1 (Masters $500M+):** Execucao de copy de alta performance
- **Tier 2 (Systematizers):** Frameworks e sistemas reproduziveis
- **Tier 3 (Format Specialists):** Expertise em formatos especificos
- **TOOL:** Sugarman 30 Triggers (checklist pos-copy)

### Research-First Methodology
Todas as tasks agora tem documentos de pesquisa com 500+ linhas.

### Agentes Arquivados
Apenas Ramit Sethi permanece em `archive/agents/` por nao ser copywriter de direct response. Alex Hormozi, Dan Koe e Frank Kern foram reativados como agents ativos.

---

## Sistema de Tiers

```
+-------------------------------------------------------------+
|                     COPY CHIEF v4.0                         |
|              Orquestrador do Time de Tiers                  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 0 - DIAGNOSTICO (sempre primeiro)            3 agents  |
+-------------------------------------------------------------+
| @claude-hopkins   -> Scientific Advertising, Auditoria      |
| @eugene-schwartz  -> 5 Awareness Levels, Sophistication     |
| @robert-collier   -> Enter the Conversation, Mental Analysis|
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 1 - DOCUMENTED MASTERS ($500M+)              8 agents  |
+-------------------------------------------------------------+
| @gary-halbert        -> Sales Letters, Storytelling Visceral |
| @gary-bencivenga     -> Bullets, Fascinations, 80% win rate |
| @david-ogilvy        -> Premium Branding, Research-based    |
| @clayton-makepeace   -> Visceral Copy, Emotional Amplifier  |
| @parris-lampropoulos -> Fascinations, Bullets 700-to-100    |
| @john-carlton        -> Simple Writing System               |
| @jim-rutz            -> Magalogs & Direct Mail              |
| @david-deutsch       -> Direct Mail & Sales Letters         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 2 - MODERN SYSTEMATIZERS                      7 agents  |
+-------------------------------------------------------------+
| @dan-kennedy      -> Urgencia, 3Ms, NO B.S. (NOT 4Ms!)    |
| @todd-brown       -> Big Ideas, Unique Mechanisms, E5       |
| @jeff-walker      -> Product Launch Formula (PLF)           |
| @alex-hormozi     -> Offer Creation, $100M Methodology      |
| @frank-kern       -> Intent-Based Branding, Mass Control    |
| @stefan-georgi    -> RMBC Method                            |
| @russell-brunson  -> Funnels & Book Launch Systems          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TIER 3 - FORMAT SPECIALISTS                        5 agents  |
+-------------------------------------------------------------+
| @jon-benson       -> VSL (Video Sales Letter) - Inventor    |
| @dan-koe          -> Digital Writing, One-Person Business   |
| @andre-chaperon   -> Soap Opera Sequences, Email Stories    |
| @ben-settle       -> Daily Email & Infotainment             |
| @ry-schwartz      -> Email Copywriting & Sequences          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| TOOL - POST-COPY VALIDATION                        1 tool   |
+-------------------------------------------------------------+
| *sugarman-check   -> 30 Psychological Triggers Checklist    |
|                     (Aplicar APOS escrever copy)            |
+-------------------------------------------------------------+
```

### Quando Usar Cada Tier

| Tier | Quando Usar |
|------|-------------|
| **Tier 0** | SEMPRE primeiro - antes de escrever qualquer copy |
| **Tier 1** | Apos diagnostico, para execucao de alta performance |
| **Tier 2** | Quando precisar de processo estruturado e frameworks |
| **Tier 3** | Quando precisar de expertise em formato especifico (VSL, email, digital) |
| **TOOL** | APOS escrever copy, ANTES de publicar |

---

## Agentes Ativos (27 total: 23 copywriters + 1 orchestrator + 1 tool + 2 executores operacionais)

### Orchestrator

| Agente | ID | Funcao |
|--------|-----|--------|
| **Copy Chief** | `@copy-chief` | Orquestrador do time - diagnostico e delegacao |

### Operational Roles

| Executor | ID | Funcao |
|----------|-----|--------|
| **Launch Owner** | `@launch-owner` | Aprovação humana, julgamento comercial e checkpoints críticos |
| **Copy Ops Worker** | `@copy-ops-worker` | Empacotamento determinístico, normalização de entregáveis e handoff operacional |

### Tier 0 - Diagnostico (3 agents)

| Agente | ID | Especialidade |
|--------|-----|---------------|
| **Claude Hopkins** | `@claude-hopkins` | Scientific Advertising - Auditoria & Testes |
| **Eugene Schwartz** | `@eugene-schwartz` | 5 Levels of Awareness & Market Sophistication |
| **Robert Collier** | `@robert-collier` | Enter the Conversation - Mental Conversation Analysis |

### Tier 1 - Masters $500M+ (8 agents)

| Agente | ID | Especialidade | Era |
|--------|-----|---------------|-----|
| **Gary Halbert** | `@gary-halbert` | Sales Letters, Storytelling Visceral | Direct |
| **Gary Bencivenga** | `@gary-bencivenga` | Bullets, Fascinations, 80% win rate | Direct |
| **David Ogilvy** | `@david-ogilvy` | Branding, Copy Elegante | Classic |
| **Clayton Makepeace** | `@clayton-makepeace` | Visceral Copy, Emotional Amplification | Direct |
| **Parris Lampropoulos** | `@parris-lampropoulos` | Fascinations & Bullets 700-to-100 | Modern |
| **John Carlton** | `@john-carlton` | Simple Writing System | Direct |
| **Jim Rutz** | `@jim-rutz` | Magalogs & Direct Mail Innovation | Direct |
| **David Deutsch** | `@david-deutsch` | Direct Mail & Sales Letters | Direct |

### Tier 2 - Systematizers (7 agents)

| Agente | ID | Especialidade | Key Framework |
|--------|-----|---------------|---------------|
| **Dan Kennedy** | `@dan-kennedy` | Urgencia, Escassez, NO B.S. | 3Ms (NOT 4Ms!) |
| **Todd Brown** | `@todd-brown` | Big Ideas, Mechanisms | E5 Method |
| **Jeff Walker** | `@jeff-walker` | Product Launch Formula | PLF, PLC Sequences |
| **Alex Hormozi** | `@alex-hormozi` | Offer Creation, $100M Methodology | Grand Slam Offers |
| **Frank Kern** | `@frank-kern` | Intent-Based Branding | Mass Control |
| **Stefan Georgi** | `@stefan-georgi` | Copy Sistematizada | RMBC Method |
| **Russell Brunson** | `@russell-brunson` | Funnels & Book Launches | Value Ladder |

### Tier 3 - Format Specialists (5 agents)

| Agente | ID | Especialidade | Formato |
|--------|-----|---------------|---------|
| **Jon Benson** | `@jon-benson` | VSL Scripts, Video Copy | VSL (inventor) |
| **Dan Koe** | `@dan-koe` | Digital Writing, One-Person Business | Content Systems |
| **Andre Chaperon** | `@andre-chaperon` | Soap Opera Sequences | Email Stories |
| **Ben Settle** | `@ben-settle` | Daily Email & Infotainment | Personality Email |
| **Ry Schwartz** | `@ry-schwartz` | Email Copywriting & Sequences | Automation Copy |

### Tool (Not Clone)

| Tool | Comando | Funcao |
|------|---------|--------|
| **Sugarman 30 Triggers** | `*sugarman-check` | Checklist de validacao pos-copy |

**IMPORTANTE:** Joe Sugarman nao e um copywriter ativavel. E uma FERRAMENTA de checklist.

---

## Agentes Arquivados

Os seguintes agentes estao em `archive/agents/`:

| Agente | Razao |
|--------|-------|
| Ramit Sethi | Personal finance educator, nao copywriter |

---

## PLF Sub-Module (Jeff Walker - Product Launch Formula)

O sub-modulo PLF adiciona capacidades completas de lancamento ao squad:

### Tasks PLF (15)
- `plf/create-plc-sequence` - Sequencia PLC (Pre-Launch Content)
- `plf/create-seed-launch` - Seed Launch
- `plf/create-live-launch` - Live Launch
- `plf/create-evergreen-launch` - Evergreen Launch
- `plf/create-jv-launch` - JV Launch (Joint Venture)
- `plf/create-launch-emails` - Emails de lancamento PLF
- `plf/create-preprelaunch` - Pre-Prelaunch
- `plf/create-launch-stack` - Launch Stack
- `plf/create-open-cart-sequence` - Open Cart Sequence
- `plf/create-sales-page-plf` - Sales Page PLF
- `plf/create-case-study` - Case Study
- `plf/plan-paid-traffic` - Paid Traffic para lancamento
- `plf/diagnose-failed-launch` - Diagnostico de lancamento que falhou
- `plf/map-mental-triggers` - Mental Triggers (Walker)
- `plf/evaluate-cpl` - Avaliacao de CPL

### Checklists PLF (18)
Inclui checklists para cada fase do lancamento: PLC1/2/3, open cart, launch stack, seed launch, evergreen, JV partner, mental triggers, pre-prelaunch, e mais.

### Templates PLF (16)
Scripts de PLC1/2/3, email subjects, case study, launch timeline, rubric scores, objection crusher, open cart sequences, sales page blueprint, e mais.

### Workflows PLF (2)
- `wf-evaluate-cpl` - Avaliacao individual de CPL
- `wf-evaluate-cpls-batch` - Avaliacao batch de CPLs

---

## Brunson Sub-Module (Russell Brunson - Funnels)

O sub-modulo Brunson adiciona capacidades de funnel building:

### Tasks Brunson (1)
- `brunson/create-book-funnel` - Book Funnel (Free + Shipping model)

### Checklists Brunson (1)
- `brunson/book-funnel-completeness` - Completude do book funnel

### Templates Brunson (4)
- `brunson/book-funnel-sales-page-tmpl` - Sales page para book funnel
- `brunson/upsell-oto-tmpl` - Template de upsell OTO
- `brunson/order-bump-tmpl` - Template de order bump
- `brunson/follow-up-email-sequence-tmpl` - Email sequence pos-compra

### Workflows Brunson (1)
- `wf-book-launch` - Book Launch workflow

**Nota:** 15 componentes Brunson adicionais (6 frameworks, 5 tasks, 3 templates, 3 checklists) estao planejados em epic separado para completar o dominio do Russell Brunson.

---

## Workflow Padrao (Tier-Based)

### Standard Workflow

```
1. *diagnose           -> Tier 0 avalia o projeto (awareness + sophistication)
2. *recommend          -> Copy Chief seleciona copywriter ideal
3. @copywriter         -> Executa o projeto
4. *audit-copy         -> Hopkins audita resultado
5. *sugarman-check     -> 30 Triggers validation
6. Entrega final
```

### Quick Workflow (Projetos Menores)

```
1. *diagnose           -> Diagnostico rapido
2. @copywriter         -> Execucao
3. *sugarman-check     -> Validacao final
```

### Acesso Direto (Se Ja Sabe o Copywriter)

```
@gary-halbert
*sales-page
```

---

## Workspace Integration Governance

O squad `copy` opera em `workspace_first`.

Antes de qualquer execução:

```bash
bash squads/copy/scripts/bootstrap-copy-workspace.sh
bash squads/copy/scripts/validate-copy-essentials.sh
```

Ordem de leitura de dados (obrigatória):

1. `workspace/businesses/{slug}/L1-strategy/offerbook.yaml`
2. `workspace/businesses/{slug}/L3-product/{product}/offerbook.yaml` quando houver produto alvo
3. `workspace/businesses/{slug}/L2-tactical/brand/*`
4. `workspace/businesses/{slug}/L2-tactical/movement/*` quando a mensagem depender de narrativa identitária
5. `workspace/businesses/{slug}/L3-product/{product}/sales-process.yaml` quando o deliverable depender do funil
6. `workspace/_templates/business-template/L1-strategy/*` e `workspace/_templates/business-template/L2-tactical/*` como fallback estrutural

Comando recomendado no início do trabalho:

- `*workspace-context` para consolidar contexto antes de `*diagnose`.

---

## Comandos do Copy Chief

### Workflow Commands

| Comando | Descricao |
|---------|-----------|
| `*help` | Ver todos os comandos |
| `*workspace-context` | Carregar e validar contexto do workspace |
| `*diagnose` | Iniciar diagnostico Tier 0 |
| `*diagnose-awareness` | Schwartz: identificar nivel de consciencia |
| `*diagnose-sophistication` | Schwartz: identificar estagio de sofisticacao |
| `*briefing` | Iniciar briefing completo |
| `*recommend` | Recomendar copywriter ideal |

### Creation Commands

| Comando | Descricao |
|---------|-----------|
| `*sales-page` | Pagina de vendas (delega para copywriter) |
| `*email-sequence` | Sequencia de emails |
| `*vsl` | Script de VSL (delega para Jon Benson) |
| `*ads` | Anuncios (Facebook/Google/Instagram) |
| `*headlines` | Headlines e hooks |
| `*lead-magnet` | Copy para lead magnet |
| `*webinar` | Script de webinar |
| `*upsell` | Pagina de upsell/downsell |
| `*landing` | Landing page de captura |

### Quality Commands

| Comando | Descricao |
|---------|-----------|
| `*audit-copy` | Hopkins: auditoria cientifica |
| `*sugarman-check` | Aplicar 30 Triggers checklist |
| `*review` | Revisar e melhorar copy existente |

### Team Commands

| Comando | Descricao |
|---------|-----------|
| `*team` | Ver time completo por tier |
| `*tier0` | Ver copywriters de diagnostico |
| `*tier1` | Ver masters documentados |
| `*tier2` | Ver systematizers |
| `*tier3` | Ver especialistas de formato |

---

## Tasks (76 tasks)

### Agent Creation Tasks (6)

| Task | Descricao |
|------|-----------|
| `create-copywriter-agent` | Criar novo agente copywriter |
| `extract-communication-dna` | Extrair DNA de comunicacao |
| `extract-frameworks` | Extrair frameworks |
| `extract-signature-phrases` | Extrair frases assinatura (v2.0, 1197 linhas) |
| `build-authority-arsenal` | Construir arsenal de autoridade |
| `create-objection-algorithms` | Criar algoritmos de objecao |

### Diagnosis Tasks (5)

| Task | Descricao | Tier |
|------|-----------|------|
| `audit-copy-hopkins` | Auditoria cientifica Hopkins | 0 |
| `setup-split-test` | Setup de split test | 0 |
| `audit-landing-page` | Auditoria de landing page | 0 |
| `diagnose-awareness-level` | Diagnosticar nivel de awareness (Schwartz) | 0 |
| `simple-writing-audit` | Auditoria de escrita simples (Carlton) | 1 |

### Research Tasks (3)

| Task | Descricao |
|------|-----------|
| `avatar-research` | Pesquisa de avatar |
| `copysearch` | Pesquisa de copy competidora |
| `map-6-primary-motives` | Mapear 6 motivos primarios (Collier) |

### Creation Tasks - Sales Pages & Funnels (10)

| Task | Descricao |
|------|-----------|
| `create-sales-page` | Pagina de vendas |
| `create-landing-page` | Landing page |
| `create-upsell-page` | Pagina de upsell |
| `create-downsell-page` | Pagina de downsell |
| `create-order-bump` | Order bump |
| `create-thank-you-page` | Thank you page |
| `create-lead-magnet` | Lead magnet (v2.0, 1249 linhas) |
| `create-abandoned-cart` | Carrinho abandonado (v2.0, 1165 linhas) |
| `create-call-script` | Script de call/telefone |
| `create-proof-stack` | Proof stack |

### Creation Tasks - Email (7)

| Task | Descricao |
|------|-----------|
| `create-email-sequence` | Sequencia de emails |
| `create-launch-emails` | Emails de lancamento |
| `create-cold-email` | Cold email |
| `create-newsletter` | Newsletter |
| `create-daily-email` | Daily email (Ben Settle) |
| `create-soap-opera-sequence` | Soap Opera Sequence (Chaperon) |
| `create-decision-matrix` | Decision matrix para email strategy |

### Creation Tasks - Video & Ads (6)

| Task | Descricao |
|------|-----------|
| `vsl-script` | Script de VSL |
| `create-video-hook` | Hook de video |
| `create-ad-copy` | Copy de anuncios |
| `create-ad-script` | Script de anuncio |
| `create-youtube-ads` | Anuncios YouTube |
| `create-native-ads` | Native ads |

### Creation Tasks - Other (9)

| Task | Descricao |
|------|-----------|
| `create-headlines` | Headlines & hooks |
| `create-bullets` | Bullets & fascinations |
| `create-webinar-script` | Script de webinar |
| `create-close-script` | Script de close |
| `create-offer` | Criar oferta |
| `evaluate-offer` | Avaliar oferta |
| `create-magalog` | Magalog (Jim Rutz) |
| `write-visceral-copy` | Copy visceral (Makepeace) |
| `rmbc-method` | RMBC Method (Stefan Georgi) |

### Quality & Methodology Tasks (4)

| Task | Descricao |
|------|-----------|
| `apply-sugarman-triggers` | Aplicar Sugarman 30 Triggers |
| `load-mmos-voice` | Carregar voz MMOS |
| `blend` | Combinar estilos de copywriters |
| `copy-debate` | Debate entre copywriters |

### PLF Tasks (15)

See [PLF Sub-Module](#plf-sub-module-jeff-walker---product-launch-formula) section.

### Brunson Tasks (1)

See [Brunson Sub-Module](#brunson-sub-module-russell-brunson---funnels) section.

---

## Templates (48)

### Core Templates (12)

- `sales-page-tmpl.yaml`
- `email-sequence-tmpl.yaml`
- `ad-copy-tmpl.yaml`
- `vsl-tmpl.yaml`
- `copywriter-agent-tmpl.yaml`
- `communication-dna-tmpl.yaml`
- `frameworks-extraction-tmpl.yaml`
- `signature-phrases-tmpl.yaml`
- `authority-arsenal-tmpl.yaml`
- `objection-algorithms-tmpl.yaml`
- `blend-tmpl.yaml`
- `debate-tmpl.yaml`

### New Core Templates (7)

- `magalog-tmpl.yaml`
- `daily-email-tmpl.yaml`
- `soap-opera-sequence-tmpl.yaml`
- `call-script-tmpl.yaml`
- `proof-stack-tmpl.yaml`
- `decision-matrix-tmpl.yaml`
- `visceral-copy-tmpl.yaml`

### Swipe Extraction Templates (9)

- `swipe/extract-headlines.md`
- `swipe/extract-bullets.md`
- `swipe/extract-leads.md`
- `swipe/extract-closes.md`
- `swipe/extract-hooks.md`
- `swipe/extract-emails.md`
- `swipe/extract-transitions.md`
- `swipe/extract-naming.md`
- `swipe/extract-full-pieces.md`

### PLF Templates (16)

See [PLF Sub-Module](#plf-sub-module-jeff-walker---product-launch-formula) section.

### Brunson Templates (4)

See [Brunson Sub-Module](#brunson-sub-module-russell-brunson---funnels) section.

---

## Checklists (40)

### Core Checklists (10)

| Checklist | Descricao |
|-----------|-----------|
| `copy-quality-checklist.md` | Qualidade de copy |
| `copywriter-quality-checklist.md` | Qualidade por copywriter |
| `hopkins-audit-checklist.md` | Auditoria Hopkins (Tier 0) |
| `copywriter-agent-creation-checklist.md` | Criacao de agente |
| `avatar-research-checklist.md` | Pesquisa de avatar |
| `copysearch-checklist.md` | Pesquisa de copy |
| `vsl-quality-checklist.md` | Qualidade de VSL |
| `email-quality-checklist.md` | Qualidade de email |
| `headline-quality-checklist.md` | Qualidade de headlines |
| `offer-quality-checklist.md` | Qualidade de oferta |

### New Core Checklists (11)

| Checklist | Descricao |
|-----------|-----------|
| `magalog-quality.md` | Qualidade de magalog |
| `daily-email-quality.md` | Qualidade de daily email |
| `soap-opera-quality.md` | Qualidade de soap opera sequence |
| `call-script-quality.md` | Qualidade de call script |
| `proof-stack-quality.md` | Qualidade de proof stack |
| `visceral-copy-quality.md` | Qualidade de copy visceral |
| `decision-matrix-quality.md` | Qualidade de decision matrix |
| `landing-page-quality.md` | Qualidade de landing page |
| `ad-copy-quality.md` | Qualidade de ad copy |
| `cold-email-quality.md` | Qualidade de cold email |
| `close-script-quality.md` | Qualidade de close script |

### PLF Checklists (18)

See [PLF Sub-Module](#plf-sub-module-jeff-walker---product-launch-formula) section.

### Brunson Checklists (1)

See [Brunson Sub-Module](#brunson-sub-module-russell-brunson---funnels) section.

---

## Research Documents (37)

Metodologia research-first: tasks de alta complexidade tem documentos de pesquisa com 500+ linhas.

| Count | Category |
|-------|----------|
| 6 | Original research docs (signature-phrases, lead-magnet, abandoned-cart, etc.) |
| 31 | Novos research docs adicionados no config sync v4.0 |

---

## Workflows (14)

### Core Workflows (7)

| Workflow | Fases | Melhor Para |
|----------|-------|-------------|
| `wf-1-full-launch` | 5 | Curso, membership, lancamento de produto |
| `wf-2-paid-traffic` | 3 | Facebook, Google, YouTube ads |
| `wf-3-high-ticket` | 4 | Coaching, consultoria, programas $5k+ |
| `wf-4-organic-content` | 6 | Personal brand, construcao de autoridade |
| `wf-5-email-marketing` | 4 | Monetizacao de lista, automacao |
| `wf-6-funnel-optimization` | 4 | CRO, melhorar funnels existentes |
| `wf-7-direct-mail` | 4 | B2B, premium, produtos fisicos |

### PLF Workflows (2)

| Workflow | Descricao |
|----------|-----------|
| `wf-evaluate-cpl` | CPL Evaluation (Product Launch Formula) |
| `wf-evaluate-cpls-batch` | Batch CPL Evaluation |

### New Workflows (5)

| Workflow | Descricao |
|----------|-----------|
| `wf-9-call-funnel-complete` | Call Funnel Complete |
| `wf-10-webinar-cold-weekly` | Cold Webinar Weekly |
| `wf-11-ghosted-recovery` | Ghosted Lead Recovery |
| `wf-book-launch` | Book Launch (Brunson) |
| `wf-voice-clone-copy` | Voice Clone Copy (MMOS Integration) |

**Nota:** wf-8 nao existe (numeracao pula de 7 para 9, intencional).

---

## Guia de Escolha de Copywriter

### Por Tipo de Projeto

| Projeto | Copywriter | Por que |
|---------|------------|---------|
| Sales page longa | @gary-halbert | Storytelling visceral |
| Marca premium | @david-ogilvy | Elegancia, credibilidade |
| Mercado saturado | @todd-brown | Big idea, mecanismo unico |
| Testes A/B | @claude-hopkins | Scientific advertising |
| Urgencia/escassez | @dan-kennedy | NO B.S., deadline |
| Bullets/fascinations | @gary-bencivenga | 80% win rate |
| VSL | @jon-benson | Inventor do formato |
| Diagnostico | @eugene-schwartz | 5 awareness levels |
| Lancamento (PLF) | @jeff-walker | Product Launch Formula |
| Oferta irresistivel | @alex-hormozi | $100M Offers methodology |
| Funnel completo | @russell-brunson | Value ladder, funnels |
| Copy visceral | @clayton-makepeace | Emocao amplificada |
| RMBC method | @stefan-georgi | Copy sistematizada |
| Magalog | @jim-rutz | Direct mail inovador |
| Simple Writing | @john-carlton | Copy simplificada |
| Direct mail | @david-deutsch | Sales letters classicas |
| Daily email | @ben-settle | Infotainment marketing |
| Soap opera sequence | @andre-chaperon | Email storytelling |
| Digital writing | @dan-koe | One-person business |
| Email sequences | @ry-schwartz | Automation copy |
| Mental conversation | @robert-collier | Entrar na mente do prospect |
| Intent branding | @frank-kern | Mass control |
| Fascinations 700-to-100 | @parris-lampropoulos | Bullet power |

### Por Nivel de Awareness (Schwartz)

| Awareness Level | Copywriter | Abordagem |
|-----------------|------------|-----------|
| Unaware | @gary-halbert | Story-driven, big idea |
| Problem Aware | @dan-kennedy | P.A.S., agitate problem |
| Solution Aware | @todd-brown | Unique mechanism |
| Product Aware | @gary-bencivenga | Bullets, fascinations |
| Most Aware | @dan-kennedy | Deal, urgency, scarcity |

---

## Master Decision Matrix

Responda ANTES de iniciar o pipeline:

1. **Awareness Level** - Unaware -> Most Aware (Schwartz)
2. **Market Sophistication** - Stage 1 -> 5 (Schwartz)
3. **Price Point** - Low / Mid / High / Premium
4. **Traffic Temperature** - Cold / Warm / Hot
5. **Primary Output** - VSL / Letter / Email / Ad / etc.

---

## Clone Combos que Funcionam

| Combo | Por que |
|-------|---------|
| Schwartz + Anyone | Sempre diagnostico primeiro |
| Todd Brown + Georgi | Mechanism + Production |
| Halbert + Makepeace | Story + Emotion |
| Chaperon + Settle | Hybrid email |
| Bencivenga + Lampropoulos | Bullet power |
| Kennedy + Todd Brown | Avatar + Differentiation |
| Hopkins + Sugarman | Testing + Triggers |
| Walker + Kennedy | Launch + Urgency |
| Brunson + Hormozi | Funnel + Offer |
| Collier + Schwartz | Mental conversation + Awareness |

### Combos com Cuidado

| Combo | Problema |
|-------|----------|
| Halbert + Carlton | Style conflict |
| Ogilvy + Makepeace | Sophisticated vs Visceral |
| All 30 Sugarman triggers | Overkill = distrust |
| Settle + Chaperon same list | Confuses expectations |

---

## Fases do Pipeline

```
Phase 1: TIER 0 Foundation (Schwartz/Collier)
    +-- diagnose-awareness + diagnose-sophistication + mental-conversation

Phase 2: TIER 2 Strategy (Kennedy/Todd Brown/RMBC)
    +-- avatar-research + rmbc-method

Phase 3a + 3b: PARALLEL
    +-- [3a] Headlines (Halbert)
    +-- [3b] Bullets (Bencivenga)

Phase 4: Offer Stack (Kennedy/Hormozi)
    +-- create-offer

Phase 5: Copy Execution (Benson/Makepeace)
    +-- vsl-script + write-visceral-copy

Phase 6: Email Sequences (Chaperon/Settle)
    +-- soap-opera-sequence + daily-email + abandoned-cart

Phase 7: Optimization (Hopkins)
    +-- audit-copy-hopkins
```

---

## Pack Structure

```
squads/copy/
|-- agents/                     # 27 executores (23 copywriters + 1 orchestrator + 1 tool + 1 human + 1 worker)
|   |-- copy-chief.md           # Orchestrador v4.0
|   |-- launch-owner.md         # Aprovação humana e go/no-go
|   |-- copy-ops-worker.md      # Packaging e handoff operacional
|   |-- claude-hopkins.md       # Tier 0
|   |-- eugene-schwartz.md      # Tier 0
|   |-- robert-collier.md       # Tier 0
|   |-- gary-halbert.md         # Tier 1
|   |-- gary-bencivenga.md      # Tier 1
|   |-- david-ogilvy.md         # Tier 1
|   |-- clayton-makepeace.md    # Tier 1
|   |-- parris-lampropoulos.md  # Tier 1
|   |-- john-carlton.md         # Tier 1
|   |-- jim-rutz.md             # Tier 1
|   |-- david-deutsch.md        # Tier 1
|   |-- dan-kennedy.md          # Tier 2
|   |-- todd-brown.md           # Tier 2
|   |-- jeff-walker.md          # Tier 2
|   |-- alex-hormozi.md         # Tier 2
|   |-- frank-kern.md           # Tier 2
|   |-- stefan-georgi.md        # Tier 2
|   |-- russell-brunson.md      # Tier 2
|   |-- jon-benson.md           # Tier 3
|   |-- dan-koe.md              # Tier 3
|   |-- andre-chaperon.md       # Tier 3
|   |-- ben-settle.md           # Tier 3
|   |-- ry-schwartz.md          # Tier 3
|   +-- joe-sugarman.md         # TOOL (30 Triggers)
|-- archive/                    # Agents arquivados
|   +-- agents/
|       +-- ramit-sethi.md
|-- tasks/                      # 76 tasks total
|   |-- [60 root tasks]
|   |-- plf/                    # 15 PLF tasks
|   +-- brunson/                # 1 Brunson task
|-- templates/                  # 51 templates total
|   |-- [22 root templates]
|   |-- plf/                    # 16 PLF templates
|   |-- brunson/                # 4 Brunson templates
|   +-- swipe/                  # 9 swipe extraction templates
|-- checklists/                 # 55 checklists total
|   |-- [32 root checklists]
|   |-- plf/                    # 22 PLF checklists
|   +-- brunson/                # 1 Brunson checklist
|-- workflows/                  # 14 workflows
|-- frameworks/                 # Framework docs by agent
|   |-- bencivenga/
|   |-- halbert/
|   |-- kennedy/
|   |-- makepeace/
|   |-- schwartz/
|   +-- sugarman/
|-- data/                       # 19 data files
|   |-- token-registry.yaml
|   |-- quality-gates.yaml
|   +-- quality-gate-coverage.yaml
|-- docs/
|   |-- frameworks/             # Framework documents
|   +-- research/               # 37 research documents
|-- scripts/                    # Pipeline automation
|   +-- copy-discovery.sh       # Copy Discovery Pipeline v2.0
|-- projects/                   # PRDs de upgrade
|-- squad.yaml                  # v4.0.0 (source of truth)
|-- config.yaml                 # v4.0.0 (compatibility mirror)
|-- ARCHITECTURE.md             # Tier system documentation
+-- README.md                   # Este arquivo
```

---

## Integracao MMOS (Preparado)

Este pack esta preparado para integracao com MMOS (Mind Mapping Operating System):

```yaml
mmos_integration:
  enabled: false  # Ativar quando disponivel
  mind_mapping:
    claude-hopkins: claude_hopkins
    eugene-schwartz: eugene_schwartz
    gary-halbert: gary_halbert
    gary-bencivenga: gary_bencivenga
    david-ogilvy: david_ogilvy
    dan-kennedy: dan_kennedy
    todd-brown: todd_brown
    jon-benson: jon_benson
    joe-sugarman: joe_sugarman  # Tool only
    robert-collier: robert_collier
```

Quando ativado:
- Agentes usarao **clones cognitivos reais**
- Analise profunda de cada obra dos mestres
- Padroes linguisticos extraidos via MMOS pipeline
- Respostas baseadas em como o copywriter REALMENTE pensava

---

## Quick Start

```
@copy-chief

*workspace-context

[Carrega governanca + templates + contexto do workspace]

*diagnose

[Tier 0 analisa seu projeto]

*recommend

[Copy Chief recomenda copywriter ideal]

@gary-halbert

*sales-page

[Executa com copywriter selecionado]

*sugarman-check

[Valida com 30 Triggers]
```

---

**Pronto para criar copy que converte? Ative o Copy Chief e comece com *diagnose!**

```
@copy-chief

*diagnose
```

---

*Copy v4.0.0*
*Elite Copywriting Squad - 27 Executors, 76 Tasks, 55 Checklists, 51 Templates, 14 Workflows*
*Tier System + Discovery Pipeline + PLF Sub-Module + Brunson Sub-Module*
*Research-First Methodology*
*Compatible with: AIOX-FULLSTACK v4+*
*Last Updated: 2026-02-06*
