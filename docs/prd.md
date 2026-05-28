# AIOX Paid Traffic Automation Suite — Product Requirements Document (PRD)

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 09-03-26 | 0.1 | Initial PRD draft (Meta-only MVP) | Morgan (PM) |
| 09-03-26 | 0.2 | Added Out of Scope, removed NFR5, added MVP success criteria | Morgan (PM) |
| 28-05-26 | 1.0 | **Unificação Meta + Google.** Reescrito para refletir o estado real implementado: 8 objetivos Meta, placements, reporting, batch/media, e CLI Google Ads completo (Search/Display/PMax, RSA/RDA, keywords, assets, mutações, delete). | Orion (Master) |

> **Nota de versão (v1.0):** Este PRD foi reescrito a partir de uma auditoria do código entregue. A v0.2 descrevia apenas um MVP de Meta com 2 objetivos. A implementação real cresceu para uma **suíte de duas CLIs irmãs** (Meta + Google) com paridade de contrato de relatório. Esta versão documenta o que existe hoje.

---

## Goals

- Automatizar a criação, ativação, otimização e relatórios de campanhas de tráfego pago em **duas plataformas**: Meta Ads (Facebook/Instagram) e Google Ads.
- Eliminar o trabalho manual repetitivo de configurar dezenas de campanhas por semana nos gerenciadores nativos.
- Permitir operação via **comando único** no terminal, com o agente configurando tudo do zero até a ativação/relatório.
- Manter **isolamento por empresa/cliente**: cada conta é operada de forma independente, sem cruzamento de dados entre nichos.
- Garantir **contrato de relatório idêntico** entre as duas plataformas (`report --format json` produz o mesmo schema), permitindo análise unificada.
- Operar com **segurança em primeiro lugar**: criação padrão em estado pausado (Google), dry-run, confirmações antes de ações destrutivas, limite de orçamento de sessão e trilha de auditoria.

## MVP Success Criteria

Esta suíte é considerada bem-sucedida quando:

1. Cria e ativa campanhas reais (Meta) e gerencia campanhas reais (Google) sem erro, em contas de produção isoladas por cliente.
2. Tempo médio de criação por campanha < 60 segundos (excluindo upload de mídia grande).
3. 100% das campanhas Meta seguindo nomenclatura automática correta.
4. Relatórios das duas plataformas no mesmo formato, prontos para análise sem retrabalho.
5. Zero ações destrutivas acidentais — toda exclusão/mutação passa por confirmação.

## Out of Scope

Os seguintes itens **não** fazem parte da suíte hoje (candidatos a versões futuras):

- Interface web ou dashboard visual (a suíte é CLI-only).
- Outras plataformas além de Meta e Google (TikTok, LinkedIn, etc.).
- A/B testing automático entre criativos.
- Gestão inteligente/autônoma de orçamento (auto-scaling por regras de ML).
- Agendamento de campanhas para data futura.
- Geração automática de textos com IA dentro da CLI (o squad de copy é uma ferramenta separada).
- Modo offline para preparação de campanhas.

> **Itens que JÁ saíram do "Out of Scope" original** (entregues entre v0.2 e v1.0): relatórios de performance, criação em lote (batch), edição/pausar/excluir campanhas, integração com Google Ads, gestão de orçamento e estratégia de lance, gestão de keywords e assets.

## Background Context

Hergamenes é gestor de tráfego pago (media buyer) que opera **múltiplas empresas/clientes** como projetos isolados. Antes, todas as campanhas eram criadas e geridas manualmente pelos gerenciadores da Meta e do Google, com volume alto e repetição que consumia o tempo que deveria ir para análise e otimização.

A suíte resolve isso com duas CLIs irmãs que compartilham padrões (autenticação segura, contrato de relatório, mensagens de erro em português) mas respeitam as particularidades de cada plataforma. A regra inegociável de operação é o **isolamento por empresa**: nenhuma análise ou ação cruza dados entre contas/nichos diferentes.

---

## Requirements

### Shared Functional Requirements (ambas as CLIs)

- **SR1:** Autenticar com cada plataforma via OAuth 2.0 e armazenar credenciais com segurança (Keychain do macOS via `keytar`, nunca em plain text).
- **SR2:** Listar e permitir seleção/definição de contas padrão; salvar config local por plataforma.
- **SR3:** Produzir relatórios de performance (`report`) com **contrato JSON idêntico** entre Meta e Google (validado por testes de paridade de schema).
- **SR4:** Fornecer mensagens de erro claras em **português** mapeando os erros mais comuns de cada API, com ação sugerida.
- **SR5:** Respeitar rate limits com retry/backoff exponencial em erros recuperáveis (429/5xx).
- **SR6:** Manter trilha de auditoria local das operações executadas.

### Meta Ads — Functional Requirements

- **FR-M1:** Autenticação OAuth 2.0 (`ads_management`, `ads_read`, `pages_read_engagement`) com long-lived token (60 dias) e alerta de expiração.
- **FR-M2:** Listar Ad Accounts, Páginas do Facebook e perfil do Instagram conectado; definir padrões.
- **FR-M3:** Ler e validar criativos de pasta local (imagem JPG/PNG/WEBP, vídeo MP4/MOV, e múltiplos arquivos para carrossel).
- **FR-M4:** Fazer upload de criativos (imagem, vídeo, carrossel) para a conta antes de criar o anúncio.
- **FR-M5:** Criar campanhas em **8 objetivos**, cada um com estratégia dedicada:
  | Objetivo | Comando | Objetivo Meta |
  |---|---|---|
  | Vendas | `create sales` | OUTCOME_SALES (Purchase) |
  | Leads | `create leads` | OUTCOME_LEADS (Landing Page) |
  | Reconhecimento | `create awareness` | OUTCOME_AWARENESS |
  | Tráfego | `create traffic` | OUTCOME_TRAFFIC |
  | Engajamento | `create engagement` | OUTCOME_ENGAGEMENT |
  | WhatsApp (Click-to-WhatsApp) | `create whatsapp` | OUTCOME_ENGAGEMENT / mensagens |
  | Lead Form (nativo) | `create leadform` | OUTCOME_LEADS / formulário instantâneo |
  | App Promotion | `create app` | OUTCOME_APP_PROMOTION |
- **FR-M6:** Criar estrutura 1 campanha → 1 conjunto → 1 anúncio em uma execução, com Advantage+ audience.
- **FR-M7:** Suportar seleção de **placements/plataformas** (`--plataforma`).
- **FR-M8:** Aplicar nomenclatura automática `PPT_[TIPO]_[EVENTO]_[DATA]_[NOME]`.
- **FR-M9:** Rollback transacional automático em falha (deleta ad → adset → campaign → leadform criados parcialmente).
- **FR-M10:** Criação em **lote (`batch`)** via CSV, suportando os 8 objetivos.
- **FR-M11:** Gestão de **biblioteca de mídia** (`media`) e criação rápida (`up`) reaproveitando mídia já enviada.
- **FR-M12:** **Relatórios** (`report`) de insights: spend, CPM, ações, ROAS, com formatação de funil.
- **FR-M13:** Histórico/auditoria local de campanhas criadas (`history`).

### Google Ads — Functional Requirements

- **FR-G1:** Autenticação OAuth 2.0 + developer token; suporte a **MCC / `login-customer-id`** com precedência (option → config default → cred).
- **FR-G2:** Listar contas acessíveis e **árvore MCC** (`accounts`); definir customer/login-customer padrão.
- **FR-G3:** **Relatórios via GAQL** (`report`) por nível: account, campaign, ad_group, ad e **keyword** (via `keyword_view`).
- **FR-G4:** Criar campanhas em 3 tipos: **Search** (`create campaign-search`), **Display** (`create campaign-display`), **Performance Max** (`create campaign-pmax`), com estratégias de lance coerentes e mutuamente exclusivas por tipo.
- **FR-G5:** Criar **ad groups** e gerir **keywords** (`keyword add/remove/update-bid`).
- **FR-G6:** Criar anúncios **RSA** (`create ad rsa`, Search) e **RDA** (`create ad rda`, Display), com vetos de tipo de campanha.
- **FR-G7:** **Upload e listagem de assets** (`upload` / `list-assets`: image, video, text).
- **FR-G8:** **Mutações**: atualizar orçamento e estratégia de lance (`update budget/bidding`), pausar/ativar (`pause`/`enable` em campaign e ad-group).
- **FR-G9:** **Remoção** de campaign/ad-group (`remove`) — irreversível, protegida por triple-confirm com snapshot de gasto.
- **FR-G10:** **Guard-rails de segurança:** criação sempre `PAUSED` por padrão (anti-burn), `--dry-run` (`validate_only`), preview antes de confirmar, limite de orçamento por sessão, e log de mutações.

### Non-Functional Requirements

- **NFR1:** Criar e ativar uma campanha completa em < 60s (excluindo upload de mídia grande).
- **NFR2:** Operar via CLI no macOS (Terminal / zsh), Apple Silicon.
- **NFR3:** Credenciais sempre no Keychain; nunca em plain text nem em logs (tokens truncados).
- **NFR4:** Mensagens de erro claras em português para falhas de API de ambas plataformas.
- **NFR5:** Retry com backoff exponencial respeitando rate limits (deve funcionar para 429/5xx — ver dívida técnica).
- **NFR6:** Trilha de auditoria de todas as campanhas/mutações criadas.
- **NFR7:** Contrato de relatório idêntico entre plataformas garantido por teste de paridade de schema.

---

## User Interface Design Goals

### Overall UX Vision

Experiência de **comando único** no terminal: o operador digita um comando (ex: `meta-ads up sales "BlackFriday" --budget 50` ou `google-ads report --level campaign`) e o agente executa o processo exibindo progresso em tempo real, com confirmação final e link para o gerenciador nativo.

### Key Interaction Paradigms

- **Comando único** com parâmetros inline e prompts inteligentes para o que faltar.
- **Feedback em tempo real:** etapas nomeadas, spinner e barra de progresso.
- **Segurança visível:** preview + confirmação antes de mutações; triple-confirm antes de exclusão.
- **Confirmação final:** resumo da operação com link direto para o gerenciador.

### Accessibility

Nenhum — aplicação CLI sem interface gráfica.

### Branding

Cores ANSI para status (verde = sucesso, vermelho = erro, amarelo = aviso).

### Target Device and Platforms

macOS (Terminal / zsh) — Apple Silicon (arm64).

---

## Technical Assumptions

### Repository Structure

**Monorepo** com dois pacotes irmãos:
- `packages/meta-ads-agent/` — CLI `meta-ads`
- `packages/google-ads-agent/` — CLI `google-ads`

Squads de orquestração relacionados: `squads/traffic-meta/` e `squads/traffic-google/` (+ `squads/copy/` para criação de anúncios).

### Service Architecture

Duas **aplicações CLI** independentes (Node.js + TypeScript ESM), cada uma comunicando-se diretamente com a API da sua plataforma. Sem backend nem banco de dados — config/logs em arquivos locais.

Padrão arquitetural comum: `CLI command → orchestrator → strategy/builder (por objetivo/tipo) → adapter (API)`. A camada de adapter é a única que importa o SDK/faz I/O de rede (boundary respeitado).

### Tech Stack

| Categoria | Meta | Google |
|-----------|------|--------|
| Runtime | Node.js 18+ | Node.js 22+ |
| Linguagem | TypeScript | TypeScript (ESM) |
| API | Graph API (via `fetch`) | `google-ads-api` v23 |
| CLI | `commander` + `inquirer` | `commander` + `inquirer` |
| Validação | `zod` | `zod` |
| Credenciais | `keytar` (Keychain) | `keytar` (Keychain) |
| Testes | `vitest` + `msw` | `vitest` |
| Build | `tsup` | `tsup` |

### Testing Requirements

**Unit + Integration.** Lógica pura (validators, builders, parsers, error-map) com cobertura alta; fluxos de API com mocks. Contrato de relatório validado por teste de paridade entre as duas CLIs.

- Meta: **379 testes** passando (45 arquivos).
- Google: **332 testes** passando (21 arquivos); cobertura ~41% linhas / 72% funções / 87% branches (descoberto concentrado em comandos CLI e camada de API real).

---

## Epic List

- **Epic 1: Foundation & Meta API Setup** — Scaffolding, OAuth Meta, listar contas/páginas. ✅
- **Epic 2: Campaign Creation Engine (Meta)** — Criação de campanhas (inicialmente Vendas/Leads; expandida para 8 objetivos), upload de criativos, nomenclatura, ativação. ✅
- **Epic 3: Smart CLI & Polish (Meta)** — Comando único, feedback em tempo real, erros em PT-BR, auditoria. ✅
- **Epic 4: Reporting & Insights (Meta)** — Relatórios de performance e funil via Insights API. ✅
- **Epic 5: Google Ads Agent (Read)** — Scaffolding, OAuth, MCC, contas, relatórios GAQL. ✅
- **Epic 6: Google Ads Mutations** — Criação (Search/Display/PMax), ad groups, keywords, RSA/RDA, assets, update budget/bidding, pause/enable, delete. ✅ (com CONCERNS — ver dívida técnica)

---

## Epic Details

> As stories detalhadas vivem em `docs/stories/epics/`. Resumo do escopo por épico abaixo. O estado de QA de cada story está em `docs/qa/gates/`.

### Epic 1: Foundation & Meta API Setup ✅
Scaffolding do pacote, CLI bootstrap, OAuth 2.0 Meta com long-lived token e Keychain, comandos `accounts`/`pages`/`config set-default`.
Stories: 1.1, 1.2, 1.3.

### Epic 2: Campaign Creation Engine (Meta) ✅
Leitura/validação de criativos, upload (imagem/vídeo/carrossel), criação Vendas e Leads, seleção de página/conta por campanha. **Expandido pós-MVP** para 8 objetivos (awareness, traffic, engagement, whatsapp, leadform, app) com estratégias dedicadas, placements e criação em lote (`batch`).
Stories: 2.1–2.5 (+ expansão de objetivos documentada na arquitetura).

### Epic 3: Smart CLI & Polish (Meta) ✅
Comando único (`up`), feedback em tempo real, tratamento de erros em PT-BR (`error-map`), histórico/auditoria (`history`).
Stories: 3.1–3.4.

### Epic 4: Reporting & Insights (Meta) ✅
Relatórios de performance e funil via Meta Insights API; parser de insights, filtro de campanha, formatação de relatório. Saída no contrato compartilhado.
Stories: 4.1.

### Epic 5: Google Ads Agent — Read ✅
Scaffolding e OAuth Google, suporte a MCC/`login-customer-id`, listagem de contas e árvore MCC, relatórios GAQL por nível (incl. keyword via `keyword_view`).
Stories: 5.1, 5.2, 5.3, 5.4. QA gates: 5.1/5.2/5.4 PASS, 5.3 CONCERNS.

### Epic 6: Google Ads Mutations ✅ (CONCERNS)
Update budget/bidding, pause/enable, criação Search/Display/PMax, ad-group + keyword management, RSA/RDA, asset upload, campaign delete. Todos com guard-rails de segurança (PAUSED-by-default, dry-run, confirmação, limite de sessão, log).
Stories: 6.1, 6.2, 6.3a/b/c, 6.4, 6.5, 6.6, 6.7. QA gates: 6.1 PASS, demais CONCERNS (pendência comum: smoke test em conta Google real).

---

## Dívida Técnica Conhecida (registrada na v1.0)

Auditoria de código identificou itens a corrigir antes de operação plena em produção:

**Meta:**
- 🔴 Retry não dispara em rate limit (429) / 5xx — erros vêm no corpo JSON com HTTP 200 e não acionam `withRetry`.
- 🔴 Falta verificação de `response.ok` — risco de "criar" entidade com ID `undefined`.
- 🟠 Upload de vídeo não-chunked e sem espera de processamento — vídeos grandes falham.
- 🟡 4 dos 8 objetivos (whatsapp, leadform, app, parcial awareness/engagement) ainda não validados em conta real.

**Google:**
- 🟠 Constantes GAQL inválidas (`LAST_24_HOURS`, `LAST_90_DAYS`) no snapshot de remoção → mostra "gasto 0" falso na tela de confirmação de exclusão.
- 🟡 Subquery GAQL não suportada no snapshot de remoção → contagens zeradas.
- 🟡 Sem teste de integração contra conta real — primeira execução real é o teste de fato (usar `--dry-run`).

> Status de correção rastreado nas tasks de Fase 3 desta iniciativa de organização.

---

## Princípio Operacional Inegociável

**Isolamento por empresa/cliente.** Toda análise, relatório ou ação é escopada a UMA conta por vez. Nunca cruzar dados, métricas ou benchmarks entre nichos/contas diferentes. A única exceção é transferência de aprendizado genérico (técnica), nunca de dados.
