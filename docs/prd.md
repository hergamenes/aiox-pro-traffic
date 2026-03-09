# Meta Ads Campaign Automation Agent — Product Requirements Document (PRD)

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 09-03-26 | 0.1 | Initial PRD draft | Morgan (PM) |
| 09-03-26 | 0.2 | Added Out of Scope, removed NFR5, added MVP success criteria | Morgan (PM) |

---

## Goals

- Automatizar 100% do processo de criação e ativação de campanhas de Vendas (Compra) e Leads na Meta Ads
- Eliminar o trabalho manual repetitivo de configurar 50+ campanhas por semana no Gerenciador de Anúncios
- Permitir criação de campanhas via comando único (ex: "suba campanha de leads"), com o agente configurando tudo do zero até a ativação
- Suportar múltiplas páginas do Facebook e uma conta de Instagram
- Manter padrão de nomenclatura consistente: `PPT_VENDAS_COMPRA_DATA_NOME`

## MVP Success Criteria

O MVP será considerado bem-sucedido quando:

1. Criar e ativar 10 campanhas reais (5 Vendas + 5 Leads) sem erro em uma semana
2. Tempo médio de criação por campanha < 60 segundos (excluindo upload de vídeo)
3. 100% das campanhas seguindo nomenclatura correta automaticamente
4. Zero intervenção manual no Gerenciador de Anúncios após criação

## Out of Scope (MVP)

Os seguintes itens **não** fazem parte do MVP e podem ser considerados em versões futuras:

- Interface web ou dashboard visual
- Integração com Google Ads, TikTok Ads ou outras plataformas
- A/B testing automático entre criativos
- Gestão inteligente de orçamento (auto-scaling, regras de otimização)
- Relatórios de performance das campanhas
- Edição ou pausar campanhas existentes
- Criação em lote (batch) de múltiplas campanhas simultâneas
- Agendamento de campanhas para data futura
- Geração automática de textos com IA
- Modo offline para preparação de campanhas

## Background Context

Hergamenes é um gestor de tráfego pago que atualmente cria todas as campanhas manualmente pelo Gerenciador de Anúncios da Meta. Com um volume de 50+ campanhas semanais, o processo repetitivo de configurar campanha, conjunto de anúncios e anúncio consome tempo significativo que poderia ser investido em análise e otimização.

O sistema proposto é um agente de automação que acessa criativos locais (pasta Downloads), recebe textos do anúncio do usuário, e utiliza a Meta Ads API para criar e ativar campanhas completas com estrutura 1→1→1 (1 campanha, 1 conjunto, 1 anúncio), usando Advantage+ para público-alvo e orçamento diário fixo.

---

## Requirements

### Functional Requirements

- **FR1:** O sistema deve autenticar com a Meta Ads API usando OAuth 2.0 e manter tokens de acesso válidos (com refresh automático)
- **FR2:** O sistema deve listar e permitir seleção de Ad Accounts, Páginas do Facebook e perfil do Instagram disponíveis na conta do usuário
- **FR3:** O sistema deve acessar a subpasta de criativos configurada (`~/Downloads/criativos-meta/`) e identificar arquivos de imagem (JPG, PNG), vídeo (MP4, MOV) e múltiplos arquivos para carrossel
- **FR4:** O sistema deve criar campanhas do tipo Vendas (objetivo: Compra) e Leads (objetivo: tráfego para landing page) via Meta Ads API
- **FR5:** O sistema deve criar a estrutura completa 1 campanha → 1 conjunto de anúncios → 1 anúncio em uma única execução
- **FR6:** O sistema deve aplicar Advantage+ (público-alvo totalmente automatizado pela Meta) em todos os conjuntos de anúncios
- **FR7:** O sistema deve solicitar e aplicar orçamento diário definido pelo usuário no momento da criação
- **FR8:** O sistema deve solicitar textos do anúncio (título, texto principal, descrição) do usuário no momento da criação
- **FR9:** O sistema deve fazer upload dos criativos (imagem, vídeo ou carrossel) para a conta de anúncios da Meta antes de criar o anúncio
- **FR10:** O sistema deve aplicar nomenclatura automática seguindo o padrão `PPT_[TIPO]_[EVENTO]_[DATA]_[NOME]` (ex: `PPT_VENDAS_COMPRA_09-03-26_BlackFriday`)
- **FR11:** O sistema deve ativar a campanha automaticamente após criação completa (status: ACTIVE)
- **FR12:** O sistema deve suportar múltiplas páginas do Facebook e uma conta do Instagram, permitindo seleção no momento da criação
- **FR13:** O sistema deve aceitar URL de landing page para campanhas de Leads
- **FR14:** O sistema deve validar os criativos antes do upload (formatos suportados, tamanho máximo, resolução mínima conforme specs da Meta)
- **FR15:** O sistema deve exibir confirmação com resumo da campanha criada (nome, tipo, orçamento, criativo, status)

### Non-Functional Requirements

- **NFR1:** O sistema deve criar e ativar uma campanha completa em menos de 60 segundos (excluindo tempo de upload de vídeos grandes)
- **NFR2:** O sistema deve funcionar via CLI (linha de comando) no macOS
- **NFR3:** O sistema deve armazenar credenciais da Meta API de forma segura (nunca em plain text no código)
- **NFR4:** O sistema deve fornecer mensagens de erro claras em português quando a API da Meta retornar falhas
- **NFR5:** O sistema deve respeitar os rate limits da Meta Ads API, implementando retry com backoff exponencial
- **NFR6:** O sistema deve manter log de todas as campanhas criadas para auditoria

---

## User Interface Design Goals

### Overall UX Vision

Uma experiência de comando único: o usuário digita um comando natural (ex: "suba campanha de vendas para BlackFriday com R$50/dia") e o agente executa todo o processo, exibindo progresso em tempo real no terminal até a confirmação de ativação.

### Key Interaction Paradigms

- **Comando único:** Interação primária via um comando com parâmetros naturais
- **Prompts inteligentes:** Quando faltar informação obrigatória (textos, orçamento), o agente pergunta de forma direta
- **Feedback em tempo real:** Barra de progresso ou status por etapa (upload criativo → criando campanha → ativando)
- **Confirmação final:** Resumo da campanha criada com link direto para o Gerenciador de Anúncios

### Core Screens and Views

- **Setup inicial (uma vez):** Wizard de autenticação Meta API + seleção de Ad Account padrão
- **Comando de criação:** Input do usuário + prompts para dados faltantes
- **Progresso:** Status de cada etapa da criação em tempo real
- **Resultado:** Resumo com nome, tipo, orçamento, criativo usado, status e link

### Accessibility

Nenhum — aplicação CLI sem interface gráfica.

### Branding

Sem branding específico. Uso de cores ANSI no terminal para status (verde = sucesso, vermelho = erro, amarelo = aviso).

### Target Device and Platforms

macOS (Terminal / zsh) — Apple Silicon (arm64)

---

## Technical Assumptions

### Repository Structure

**Monorepo** — dentro do projeto AIOX existente (`aiox-app-1`), como um pacote dedicado em `packages/meta-ads-agent/`.

### Service Architecture

**CLI Application (Single Service)** — aplicação de linha de comando Node.js que se comunica diretamente com a Meta Ads API. Sem necessidade de backend, banco de dados ou microsserviços para o MVP.

```
packages/meta-ads-agent/
├── src/
│   ├── cli/           # Comandos e interface do terminal
│   ├── meta-api/      # Integração com Meta Ads API
│   ├── creative/      # Leitura e validação de criativos
│   ├── campaign/      # Lógica de criação de campanhas
│   └── config/        # Configuração e credenciais
├── package.json
└── tsconfig.json
```

### Tech Stack

| Categoria | Tecnologia | Justificativa |
|-----------|-----------|---------------|
| Runtime | Node.js 18+ | Compatível com AIOX, amplo ecossistema |
| Linguagem | TypeScript | Type-safety, autocompletar, menos bugs |
| Meta API SDK | `facebook-nodejs-business-sdk` | SDK oficial da Meta para Node.js |
| CLI Framework | `commander` + `inquirer` | Parsing de comandos + prompts interativos |
| HTTP | `axios` | Requests HTTP para upload de criativos |
| Validação | `zod` | Validação de inputs e configs |
| Armazenamento seguro | `keytar` | Armazena tokens no Keychain do macOS |
| Logs | `pino` | Logs estruturados, leve e rápido |

### Testing Requirements

**Unit + Integration** — testes unitários para lógica de negócio (nomenclatura, validação de criativos) e testes de integração com mocks da Meta API para o fluxo completo de criação.

- Framework: `vitest`
- Mocks: `msw` (Mock Service Worker) para simular respostas da Meta API
- Coverage target: 80%+

### Additional Technical Assumptions

- **Meta App:** O usuário precisará criar um Meta App no developers.facebook.com com permissões `ads_management`, `ads_read`, `pages_read_engagement`
- **Token de longa duração:** Sistema deve converter short-lived token em long-lived token (60 dias) e alertar quando próximo do vencimento
- **Rate Limits:** Meta API permite ~200 calls/hora por ad account para operações de escrita. Com 50+ campanhas/semana, não deve ser problema.
- **Criativos:** Suporte a imagens até 30MB e vídeos até 4GB conforme limites da Meta
- **macOS only:** Sem necessidade de compatibilidade cross-platform no MVP
- **Sem banco de dados:** Logs e configurações armazenados em arquivos locais (JSON/YAML)

---

## Epic List

- **Epic 1: Foundation & Meta API Setup** — Estabelecer o projeto, autenticação OAuth com a Meta, e primeiro comando funcional que lista Ad Accounts e Páginas disponíveis.
- **Epic 2: Campaign Creation Engine** — Implementar o fluxo completo de criação de campanha (Vendas e Leads) com upload de criativos, nomenclatura automática e ativação via Meta API.
- **Epic 3: Smart CLI & Polish** — Adicionar experiência de comando único com prompts inteligentes, validação de criativos, feedback em tempo real, logs e tratamento de erros em português.

---

## Epic 1: Foundation & Meta API Setup

**Goal:** Estabelecer a base do projeto com estrutura de código, autenticação OAuth 2.0 com a Meta Ads API, e um primeiro comando funcional que permite listar Ad Accounts e Páginas disponíveis — confirmando que a integração funciona de ponta a ponta.

### Story 1.1: Project Scaffolding & CLI Bootstrap

> As a gestor de tráfego,
> I want ter o projeto inicializado com estrutura organizada e um comando CLI funcional,
> So that eu tenha a base onde toda a automação será construída.

**Acceptance Criteria:**

1. Pacote `packages/meta-ads-agent/` criado com `package.json`, `tsconfig.json` e dependências base (TypeScript, commander, pino)
2. Comando `meta-ads` executável via `npx` ou `node` que exibe versão e help
3. Estrutura de pastas criada: `src/cli/`, `src/meta-api/`, `src/creative/`, `src/campaign/`, `src/config/`
4. Logger (pino) configurado com output formatado para terminal (pino-pretty)
5. Script `npm run dev` funcional para desenvolvimento com watch mode
6. Script `npm run build` compila TypeScript sem erros
7. Testes configurados com vitest e pelo menos 1 teste de sanidade passando

### Story 1.2: Meta API Authentication (OAuth 2.0)

> As a gestor de tráfego,
> I want autenticar minha conta da Meta no sistema,
> So that o agente tenha permissão de criar campanhas na minha conta.

**Acceptance Criteria:**

1. Comando `meta-ads auth setup` inicia fluxo de autenticação OAuth 2.0
2. Sistema abre o navegador para o usuário autorizar o Meta App com permissões `ads_management`, `ads_read`, `pages_read_engagement`
3. Callback local (localhost) captura o authorization code e troca por access token
4. Short-lived token é convertido automaticamente para long-lived token (60 dias)
5. Token armazenado de forma segura no macOS Keychain via `keytar`
6. Comando `meta-ads auth status` mostra status da autenticação (autenticado/expirado/não configurado) e dias restantes do token
7. Sistema alerta quando token está a 7 dias de expirar
8. Mensagens de erro em português para falhas de autenticação

### Story 1.3: List Ad Accounts & Pages

> As a gestor de tráfego,
> I want listar minhas contas de anúncio e páginas disponíveis,
> So that eu possa confirmar que a integração funciona e escolher onde criar campanhas.

**Acceptance Criteria:**

1. Comando `meta-ads accounts` lista todas as Ad Accounts acessíveis com ID, nome e status
2. Comando `meta-ads pages` lista todas as Páginas do Facebook com ID, nome e categoria
3. Comando `meta-ads pages` também mostra a conta do Instagram conectada (se houver)
4. Comando `meta-ads config set-default` permite definir Ad Account, Página do Facebook e perfil do Instagram padrão
5. Configurações padrão salvas em arquivo local (`~/.meta-ads/config.yaml`)
6. Todos os comandos validam autenticação antes de executar e orientam o usuário a rodar `meta-ads auth setup` se não autenticado
7. Output formatado em tabela legível no terminal

---

## Epic 2: Campaign Creation Engine

**Goal:** Implementar o motor completo de criação de campanhas, desde a leitura de criativos locais até a ativação na Meta Ads API, suportando campanhas de Vendas (Compra) e Leads (Landing Page) com estrutura 1→1→1 e nomenclatura automática.

### Story 2.1: Creative File Reader & Validator

> As a gestor de tráfego,
> I want que o sistema leia e valide meus criativos da pasta configurada,
> So that eu tenha certeza de que os arquivos estão corretos antes de subir a campanha.

**Acceptance Criteria:**

1. Sistema lê arquivos da pasta `~/Downloads/criativos-meta/` (configurável)
2. Identifica tipo de criativo automaticamente: imagem (JPG, PNG, WEBP), vídeo (MP4, MOV) ou múltiplos arquivos para carrossel
3. Valida dimensões mínimas conforme specs da Meta (1080x1080 para feed, 1080x1920 para stories)
4. Valida tamanho máximo: imagens até 30MB, vídeos até 4GB
5. Para carrossel: detecta quando há 2-10 imagens na pasta e sugere criação como carrossel
6. Exibe relatório de validação no terminal: arquivos encontrados, tipo detectado, status (válido/inválido) com motivo
7. Retorna erro claro em português se pasta vazia ou sem arquivos válidos
8. Testes unitários para cada tipo de validação

### Story 2.2: Creative Upload to Meta

> As a gestor de tráfego,
> I want que o sistema faça upload dos meus criativos para a Meta,
> So that eles fiquem disponíveis para usar nos anúncios.

**Acceptance Criteria:**

1. Upload de imagens via Meta Marketing API endpoint `/act_{ad_account_id}/adimages`
2. Upload de vídeos via endpoint `/act_{ad_account_id}/advideos` com suporte a resumable upload para arquivos grandes
3. Para carrossel: upload individual de cada imagem e retorno dos hashes/IDs
4. Barra de progresso no terminal durante upload (especialmente para vídeos)
5. Retry automático (até 3 tentativas) com backoff exponencial em caso de falha de rede
6. Retorna hash/ID do criativo para uso na criação do anúncio
7. Mensagens de erro em português para falhas de upload
8. Testes de integração com mocks da Meta API (msw)

### Story 2.3: Sales Campaign Creation (Purchase Event)

> As a gestor de tráfego,
> I want criar uma campanha de Vendas com objetivo de Compra via comando,
> So that eu possa subir campanhas de vendas sem usar o Gerenciador de Anúncios.

**Acceptance Criteria:**

1. Comando `meta-ads create sales` inicia fluxo de criação de campanha de Vendas
2. Sistema solicita: nome do anúncio, orçamento diário (R$), textos (título, texto principal, descrição, URL do site)
3. Cria campanha com objetivo `OUTCOME_SALES` e optimization goal `OFFSITE_CONVERSIONS` evento `PURCHASE`
4. Cria ad set com Advantage+ audience (targeting automático), orçamento diário informado
5. Cria ad com criativo da pasta, textos fornecidos, página do Facebook e Instagram padrão
6. Aplica nomenclatura automática: `PPT_VENDAS_COMPRA_[DD-MM-AA]_[NOME]`
7. Ativa a campanha (status `ACTIVE`) automaticamente
8. Exibe resumo final: nome, ID, orçamento, criativo usado, link para Gerenciador de Anúncios
9. Testes de integração cobrindo fluxo completo com mocks

### Story 2.4: Leads Campaign Creation (Landing Page)

> As a gestor de tráfego,
> I want criar uma campanha de Leads que direciona para minha landing page,
> So that eu possa captar leads sem configurar manualmente no Gerenciador.

**Acceptance Criteria:**

1. Comando `meta-ads create leads` inicia fluxo de criação de campanha de Leads
2. Sistema solicita: nome do anúncio, orçamento diário (R$), URL da landing page, textos (título, texto principal, descrição)
3. Cria campanha com objetivo `OUTCOME_LEADS`
4. Cria ad set com Advantage+ audience, orçamento diário, destination type `WEBSITE`
5. Cria ad com criativo, textos, URL da landing page, página do Facebook e Instagram padrão
6. Aplica nomenclatura automática: `PPT_LEADS_LP_[DD-MM-AA]_[NOME]`
7. Ativa a campanha (status `ACTIVE`) automaticamente
8. Exibe resumo final com link para Gerenciador de Anúncios
9. Testes de integração cobrindo fluxo completo com mocks

### Story 2.5: Page & Account Selection per Campaign

> As a gestor de tráfego,
> I want poder escolher qual página do Facebook usar ao criar uma campanha,
> So that eu possa gerenciar campanhas de diferentes páginas/clientes.

**Acceptance Criteria:**

1. Nos comandos `create sales` e `create leads`, flag opcional `--page` permite selecionar página diferente da padrão
2. Se `--page` não informado, usa a página padrão configurada na Story 1.3
3. Se múltiplas páginas e nenhuma padrão definida, exibe lista numerada para seleção interativa
4. Valida que a página selecionada tem Instagram conectado antes de criar anúncio com posicionamento Instagram
5. Atualiza o anúncio com a página e Instagram corretos

---

## Epic 3: Smart CLI & Polish

**Goal:** Transformar os comandos individuais em uma experiência de comando único e inteligente, com validação prévia, feedback visual em tempo real, logs de auditoria e tratamento de erros robusto em português — tornando o sistema agradável e confiável para uso diário com 50+ campanhas/semana.

### Story 3.1: Single Command Experience

> As a gestor de tráfego,
> I want criar campanhas com um único comando natural,
> So that eu não precise lembrar subcomandos e flags separados.

**Acceptance Criteria:**

1. Comando unificado `meta-ads up` aceita parâmetros inline: `meta-ads up sales "BlackFriday" --budget 50`
2. Parâmetros opcionais: `--page`, `--budget`, `--url` (para leads)
3. Quando parâmetros obrigatórios faltam (textos do anúncio, orçamento), sistema faz prompts interativos com `inquirer`
4. Suporte a atalhos: `meta-ads up sales` (prompta tudo), `meta-ads up leads --url https://...` (prompta o resto)
5. Detecção automática de tipo de criativo na pasta sem precisar informar
6. Fluxo completo executado em sequência: validar criativos → upload → criar campanha → ativar → exibir resumo
7. Testes cobrindo cenários: todos os params inline, nenhum param (full prompt), params parciais

### Story 3.2: Real-Time Progress Feedback

> As a gestor de tráfego,
> I want ver o progresso da criação da campanha em tempo real,
> So that eu saiba exatamente o que está acontecendo e quanto falta.

**Acceptance Criteria:**

1. Indicador de progresso com etapas nomeadas: `[1/5] Validando criativos...`, `[2/5] Fazendo upload...`, `[3/5] Criando campanha...`, `[4/5] Configurando anúncio...`, `[5/5] Ativando...`
2. Spinner animado durante operações de espera (upload, chamadas API)
3. Barra de progresso percentual para upload de vídeos grandes
4. Cores ANSI: verde para sucesso ✓, vermelho para erro ✗, amarelo para aviso ⚠
5. Tempo total de execução exibido ao final
6. Modo silencioso via `--quiet` que exibe apenas resultado final

### Story 3.3: Error Handling & Portuguese Messages

> As a gestor de tráfego,
> I want mensagens de erro claras em português quando algo der errado,
> So that eu saiba exatamente o que corrigir sem precisar pesquisar códigos de erro.

**Acceptance Criteria:**

1. Mapeamento dos 20 erros mais comuns da Meta API para mensagens em português com ação sugerida
2. Exemplos: `"Imagem muito pequena (800x600). Mínimo: 1080x1080. Redimensione o criativo."`, `"Token expirado. Execute: meta-ads auth setup"`, `"Orçamento abaixo do mínimo da Meta (R$5/dia)."`
3. Erros de rede tratados: timeout, sem internet, DNS failure — com sugestão de retry
4. Erros inesperados salvos em log com stack trace para debug, mensagem amigável para o usuário
5. Validação prévia (antes de chamar API): criativos, orçamento mínimo, token válido, página configurada
6. Testes unitários para cada mapeamento de erro

### Story 3.4: Campaign Log & Audit Trail

> As a gestor de tráfego,
> I want um histórico de todas as campanhas criadas pelo sistema,
> So that eu tenha controle e possa consultar o que foi criado.

**Acceptance Criteria:**

1. Cada campanha criada registrada em `~/.meta-ads/campaigns.log` com: timestamp, nome, tipo, orçamento, ID da campanha, status, criativo usado
2. Comando `meta-ads history` exibe últimas 20 campanhas em tabela formatada
3. Comando `meta-ads history --all` exibe histórico completo
4. Filtros: `meta-ads history --type sales`, `meta-ads history --date 09-03-26`
5. Exportar para CSV: `meta-ads history --export csv`
6. Log rotacionado automaticamente a cada 10.000 entradas (arquivo antigo renomeado com data)

---

## Checklist Results Report

### Executive Summary

- **Completude geral:** ~92%
- **Escopo do MVP:** Just Right — 3 epics, 12 stories
- **Prontidão para arquitetura:** READY

### Category Statuses

| Categoria | Status |
|-----------|--------|
| 1. Problem Definition & Context | PASS |
| 2. MVP Scope Definition | PASS |
| 3. User Experience Requirements | PASS |
| 4. Functional Requirements | PASS |
| 5. Non-Functional Requirements | PASS |
| 6. Epic & Story Structure | PASS |
| 7. Technical Guidance | PASS |
| 8. Cross-Functional Requirements | PARTIAL — monitoramento a definir pelo Architect |
| 9. Clarity & Communication | PASS |

### Recommendations

1. Architect deve investigar Advantage+ API docs (feature relativamente nova)
2. Architect deve validar fluxo OAuth callback local para macOS
3. Architect deve definir estratégia de monitoramento (token health, error rates)

### Final Decision

**READY FOR ARCHITECT** — PRD completo, escopo definido, Out of Scope documentado, critérios de sucesso estabelecidos.

---

## Next Steps

### UX Expert Prompt

> @ux-design-expert — Revise o PRD em `docs/prd.md`, focando na seção "User Interface Design Goals". O produto é CLI-only no macOS. Valide a experiência de comando único, prompts interativos e feedback visual no terminal. Sugira melhorias de usabilidade para gestores de tráfego que criam 50+ campanhas/semana.

### Architect Prompt

> @architect — Revise o PRD em `docs/prd.md` e crie a arquitetura técnica do Meta Ads Campaign Automation Agent. Foco em: integração OAuth 2.0 com Meta API, estrutura do CLI (commander + inquirer), fluxo de upload de criativos, e armazenamento seguro de tokens via keytar. Stack: TypeScript, Node.js 18+, facebook-nodejs-business-sdk. Localização: `packages/meta-ads-agent/`.
