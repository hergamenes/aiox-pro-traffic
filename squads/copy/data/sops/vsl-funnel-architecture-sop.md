---
sop_id: SOP-COPY-VSL-ARCH-001
process_id: vsl-funnel-architecture
title: "Funil VSL Perpétuo — Arquitetura Completa"
version: "0.4.0"
status: DRAFT-ENRICHED
source: "EXTRACTED FROM @thiagoroas (Thiago Roas)"
source_material:
  - "Palestra ao vivo + slides (data exata não confirmada)"
  - "Podcast 'Segredos da Escala #122', host: João Campos (Beturb), 3h01m"
  - "Referência interna: qj04cUeaRAw"
  - "Contexto de gravação: Setembro 2025"
  - "Captura/análise: 2026-03-11"
  - "Hotmart Cast — 'Como Criar FUNIL DE VENDAS EFICIENTE para PÚBLICO FRIO | Thiago Roas' (Video ID: RENU3kEns0E, ~40 min)"
  - "Kiwicast #213 — 'Ele Fez Mais De R$7 Milhões No Digital Como Gestor De Tráfego' (Video ID: hnw1pGcc3_A, ~1h25min)"
  - "Extração Hotmart Cast: outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md"
  - "Extração Kiwicast #213: outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md"
track_record_source: "200M+ gastos em tráfego, 8 nichos escalados (3 acima de 200k/dia, 5 acima de 100k/dia)"
owner: "Copy Chief"
approver: "Squad Chief (or designated SME independent of document owner)"
approver_note: "Per ISO 9001:2015 Clause 7.5.2(c), approver must be independent of document owner"
effective_date: "2026-03-11"
review_date: "2027-03-11"
next_review_date: "2027-03-11"
review_frequency: "Annual + on market change"
executor: ["Copy Chief", "Strategist", "Funnel Architect"]
level: STRATEGIC
purpose: >
  Estabelecer as decisões de arquitetura de funil VSL perpétuo que devem ser tomadas
  ANTES de qualquer copy ser escrita, garantindo que o funil seja construído sobre
  fundamentos validados com 200M+ em tráfego.
scope: >
  Decisões de arquitetura que devem ser tomadas ANTES de qualquer copy ser escrita.
  Este SOP cobre: qualificação de nicho, precificação, estrutura do funil, especificações
  de VSL, framework de métricas e coerência criativo-VSL. Não cobre execução de copy,
  gestão de tráfego operacional, ou configuração de plataformas.
training_requirements: "See Pré-Requisitos section"
location: "squads/copy/data/sops/vsl-funnel-architecture-sop.md"
feedback: "Report issues via squad-creator auto-heal or Copy Chief"
squad_agnostic: true
notes: >
  Este SOP é genérico — não contém dados de nenhum business específico.
  É um framework aplicável a qualquer perpétuo VSL de tráfego frio.
reviewed_by:
  - "Ohno (sop-extractor) — extração inicial, 2026-03-11"
  - "Crosby (pop-auditor) — audit CONDITIONAL (score 64), 2026-03-11"
  - "Crosby (pop-auditor) — re-audit APPROVED (score 81), 2026-03-11"
  - "SOP Creator — remediação v0.3.0, 2026-03-11"
  - "SOP Creator — enriquecimento v0.4.0 com Hotmart Cast + Kiwicast #213, 2026-03-12"
---

> **DRAFT-ENRICHED — EXTRAÍDO DE @thiagoroas**
> Este documento foi extraído de material de referência externa. Cada afirmação carrega marcador de
> confiança. Antes de uso em produção, verificar itens sinalizados com [INF] e preencher GAPs.
> Versão 0.3.0: remediação de qualidade aplicada com base no re-audit (score 81, APPROVED). Alvo: CERTIFIED (90+).
> Versão 0.4.0: enriquecimento com evidências de Hotmart Cast (HC) e Kiwicast #213 (KC213). Novas fontes
> adicionadas, alguns [INF] promovidos a [REP] por corroboração cruzada. Apenas adições — nenhum conteúdo
> existente foi removido ou modificado.

---

## Legenda de Confiança

| Marcador | Nível | Fonte |
|----------|-------|-------|
| [DOC] | Documentado diretamente na fonte | Declaração explícita em palestra ou podcast |
| [REP] | Reportado / corroborado | Afirmado pelo praticante, consistente entre as duas fontes |
| [INF] | Inferido de evidência | Deduzido de dados parciais ou evidência indireta |

**Abreviações de fonte usadas em v0.4.0:**
- **HC** = Hotmart Cast (Video RENU3kEns0E, ~2026)
- **KC213** = Kiwicast #213 (Video hnw1pGcc3_A, ~1h25min)
- **SE122** = Segredos da Escala #122 (fonte original, Podcast João Campos/Beturb)

---

## Índice

1. [Propósito](#propósito)
2. [Pré-Requisitos](#pré-requisitos)
3. [Fase 1 — Qualificação de Nicho](#fase-1--qualificação-de-nicho)
4. [Fase 2 — Arquitetura de Precificação](#fase-2--arquitetura-de-precificação)
5. [Fase 3 — Estrutura do Funil](#fase-3--estrutura-do-funil)
6. [Fase 4 — Especificações da VSL](#fase-4--especificações-da-vsl)
7. [Fase 5 — Framework de Métricas](#fase-5--framework-de-métricas)
8. [Fase 6 — Coerência Criativo-VSL](#fase-6--coerência-criativo-vsl)
9. [Fase 7 — Gestão de Desvios (Error Handling)](#fase-7--gestão-de-desvios-error-handling)
10. [Glossário](#glossário)
11. [Tabela de Resumo de Confiança](#tabela-de-resumo-de-confiança)
12. [GAPs e Verificações Necessárias](#gaps-e-verificações-necessárias)
13. [Fontes](#fontes)
14. [Histórico de Revisões](#histórico-de-revisões)

---

## Propósito

Este SOP existe para evitar o erro mais comum em funis VSL: começar pelo copy antes de validar a arquitetura. Decisões erradas de nicho, precificação ou estrutura de funil não são corrigíveis na execução — elas inviabilizam o funil inteiro.

**O que este SOP garante:**
- Que o funil seja construído para o arquétipo correto (conversão de público frio, não autoridade).
- Que a precificação esteja alinhada com a psicologia de compra do mercado e com a matemática de escala.
- Que a VSL tenha especificações de produção que maximizem retenção.
- Que as métricas certas sejam monitoradas no lugar das erradas.
- Que o criativo e a VSL sejam coerentes, eliminando leaks de retenção.

**SOPs relacionados:**
- Para funis de low ticket: SOP-COPY-LT-001 (planned)
- Para lançamento pago: SOP-COPY-LANC-001 (planned)

---

### Premissa Estrutural — Lei do Custo Crescente de Tráfego

[DOC] `HC` [~30:00-35:00]

> "O tráfego está mais caro. E vai continuar sendo sempre mais caro. Essa é a única métrica que não mudou. [...] Vai chegar a Black Friday. Vai ficar mais cara." [DOC — HC]

**Implicação para arquitetura de funil:** Qualquer modelo de negócio cujo ticket médio ou LTV não aumenta ao longo do tempo está em degradação estrutural — o custo de aquisição sobe enquanto a receita por comprador fica estática. Esta lei fundamenta a necessidade de upsell, ascensão e otimização de ticket médio como componentes arquiteturais, não opcionais.

**Distinção produto × oferta como premissa de conversão** [DOC — KC213, ~55:00]:
> "Você precisa ter uma boa oferta. Ninguém sabe como é que é o seu produto antes de comprar. O bom produto, ele é necessário para você construir um LTV saudável para o seu negócio. [...] Mas para vender no perpeto? O que é importante é a oferta." [DOC — KC213]

Dois papéis distintos na arquitetura do funil:
- **Oferta:** determina se o visitante novo compra (função de conversão — responsabilidade do funil e do copy).
- **Produto:** determina se o comprador retorna, indica e ascende (função de LTV — responsabilidade do produto).

Investir energia apenas no produto sem construir uma oferta forte é o erro do perfeccionista. A oferta determina a velocidade de vendas. O produto determina a sustentabilidade do negócio.

---

## Pré-Requisitos

> **Não inicie este SOP sem validar os pré-requisitos abaixo.**
> Avançar sem eles força decisões de arquitetura sobre premissas não verificadas.

### Conhecimento requerido

- [ ] Entendimento dos dois arquétipos de funil (Fase 1 deste SOP) — quem não conhece a distinção tende a construir o funil errado para o contexto.
- [ ] Familiaridade com níveis de consciência de Schwartz (Level 1-5) — aplicados na Fase 4 para estrutura de VSL e na Fase 6 para coerência criativo-VSL.
- [ ] Fundamentos de tráfego pago (Meta Ads ou equivalente) — as métricas da Fase 5 requerem leitura de gerenciador de anúncios.
- [ ] Acesso a dados históricos de checkout da plataforma de vendas (Hotmart, Kiwify ou similar) — necessário para benchmarkar custo de checkout (Fase 5). Período mínimo recomendado: 7 dias de dados limpos (sem order bumps) para estabelecer baseline de conversão de checkout [INF — derivado do protocolo de teste de 7 dias da Fase 3.3; período explícito de histórico não especificado na fonte].

### Condições de entrada

- [ ] **Nicho identificado.** Não basta "quero fazer uma VSL". O nicho deve estar delimitado antes de qualquer decisão de arquitetura (Fase 1 depende disso).
- [ ] **Produto com transformação central clara.** A VSL vende uma transformação, não um produto. Sem isso definido, não há pitch possível. [INF extraído de contexto geral da fonte — verificar contra critérios do expert]
- [ ] **Decisão de arquétipo de funil tomada.** Este SOP cobre o funil de conversão de público frio. Se o contexto é funil de autoridade, este SOP não se aplica.

### Ferramentas requeridas

- [ ] Plataforma de vendas com suporte a upsell one-click (OCU) — sem OCU, a mecânica de ticket médio documentada na Fase 2 não funciona. [REP — corroborado por KC213: "O upsell tem que ser o ano-click-buai. A pessoa já armazenou os dados do cartão. Isso basta clicar no botão e já comprou o direto." KC213, ~1:15:00]
- [ ] Ferramenta de analytics de vídeo com curva de retenção (Hotmart Analytics, VTurb, Vimeo Analytics ou similar) — obrigatório para as métricas de VSL da Fase 4.
- [ ] Conta de tráfego pago ativa com pixel instalado e histórico de conversão (minimum: conta validada, não nova) — necessário para a Fase 5.

> **Nota de contexto:** orçamento mínimo de teste não foi especificado explicitamente na fonte.
> A Fase 1 de tráfego da fonte usa "limite mínimo por conjunto = custo ideal de initiate checkout
> (R$29-30 para front de R$297) × número de criativos × dobro da soma dos limites mínimos como orçamento de campanha" [DOC] `traffic_structure_updated`.
> Um orçamento inicial de pelo menos R$5.000-10.000 é [INF] derivado da matemática de validação com
> pelo menos 5 criativos rodando 48h cada — [GAP — needs practitioner verification].

---

## Fase 1 — Qualificação de Nicho

> **Princípio:** O nicho determina qual funil é possível. Não o contrário.
> Fonte: [DOC] `funnel_taxonomy` [00:07:04]

> ⚠️ **Risco de pular:** Construir o funil VSL para o nicho errado ou arquétipo errado é erro fatal — não há ajuste de copy ou tráfego que compense. A Fase 1 é o único ponto onde o custo de mudança é zero.

> **Aplicação prática:** Para cada novo projeto, execute a árvore de decisão da seção 1.2 antes de qualquer outra atividade. A resposta à pergunta "quantos potenciais compradores?" determina o restante do roadmap.

**Critério de Saída da Fase 1:**
- [ ] Arquétipo de funil decidido (autoridade OU conversão de público frio)
- [ ] Tamanho de universo estimado (>10M, 1M-10M, <1M)
- [ ] Decisão documentada: VSL R$297 é adequado para este nicho? SIM/NÃO
- [ ] Nível de awareness da dor verificado (topo de funil / dor latente OU dor articulada específica)

### 1.1 Dois Arquétipos de Funil

Antes de qualquer decisão de estrutura, identificar qual dos dois arquétipos-pai se aplica.
[DOC] Declarado explicitamente em [00:07:04].

**Framework de decisão por potencial de nicho** [DOC — HC, ~20:00]:
> "A primeira coisa é entender qual potencial maior do seu nicho. É vender ticket alto ou vender para muita gente." [DOC — HC]

Dois modos de maximização por nicho:
1. **High ticket / volume baixo** — nicho específico, prospect de alta renda ou dor aguda.
2. **Low/mid ticket / volume alto** — nicho massivo, público amplo, escala por volume.

A estratégia de funil VSL R$297 pertence ao modo 2. Nicho onde o modo 1 é dominante não é candidato para este SOP.

| Arquétipo | Descrição | Dependência | Horizonte |
|-----------|-----------|-------------|-----------|
| **Funil de Autoridade** | Prospect compra o expert, não o produto. | Expert magnético, audiência prévia. | Médio-longo prazo |
| **Funil de Conversão de Público Frio** | Converte quem não conhece o expert. Sistema rastreado e intencional. | Funil, oferta, tráfego. Independe de audiência orgânica. | Curto prazo pós-validação |

**Regra de decisão:**
> "Quando você não joga esse jogo (funil de autoridade), só te resta aprender a converter público frio." [DOC]

Se o business não possui autoridade prévia estabelecida ou não quer depender dela — o funil correto é o de Conversão de Público Frio (VSL R$297 + upsell).

**Definição operacional de "público frio"** [DOC] [00:12:21]:
> "Para mim, público frio é a pessoa que não tem na mente dela a tua oferta."
> Inclui quem foi impactado por anúncio mas não lembrou — funcionalmente Level 1.

---

### 1.2 Dimensionamento do Nicho

[DOC] Declarado em `funnel_taxonomy` e confirmado em `brown_enrichment` [00:29:21].

**Regra de ouro:** antes de definir funil, contar quantas pessoas potencialmente querem o resultado prometido.

| Tamanho | Critério orientativo | Funil recomendado | Teto de lucro mensal |
|---------|---------------------|-------------------|----------------------|
| **Big (10M+)** | Universo massivo. Topo de funil. Dor não precisa ser articulada. | VSL R$297 + upsell | 2-3M de lucro (caso documentado: 4M de faturamento) [DOC] |
| **Médio** | Dor identificada, mas universo <10M | Low ticket OU lançamento pago | 100k-500k lucro [DOC] |
| **Profissional (micro)** | Expert ensinando sua própria categoria profissional. | Lançamento pago (ingresso low ticket + conversão high ticket) | 300-500k lucro [DOC] |
| **Qualquer nicho** | Qualquer ticket, qualquer tamanho | Funil perpétuo genérico | 100k de lucro (teto universal) [DOC] |

**Exemplos de nichos "big" não óbvios** [DOC] [00:29:51]:
- Gastronomia (praticidade na cozinha): todo mundo cozinha = big nicho escalável.
- Moda masculina e feminina.
- Renda extra.

**Árvore de decisão — qual funil construir:**

```
Quantos potenciais compradores no nicho?
│
├── > 10M → VSL R$297 + upsell (este SOP)
│   └── A dor precisa ser de "topo de funil" (Level 1-2 de awareness)
│       [INF] Nichos de dor muito articulada tendem a ter universo menor
│
├── 1M–10M → Low ticket OU lançamento pago
│   └── Ver SOP-COPY-LT-001 (planned) para low ticket ou SOP-COPY-LANC-001 (planned) para lançamento pago
│
├── < 1M (profissional) → Lançamento pago com ingresso low ticket
│   └── Expert da mesma categoria do aluno (fisio → fisio, médico → médico)
│
└── Qualquer → Perpétuo (ticket variável), teto 100k/mês
```

**Distinção teto de escala: qualquer nicho vs. big nicho** [DOC — HC, ~20:00]:
> "Para você calar [escalar] público frio, qualquer nicho é capaz de fazer no mínimo sem mil de lucro mês. Qualquer nicho. Mas nem todo nicho é capaz de fazer sem mil por dia." [DOC — HC]

| Meta de escala | Requisito de nicho |
|---|---|
| R$100k de lucro/mês | Qualquer nicho — universal |
| R$100k de lucro/dia (≈3M/mês) | Apenas big nichos (10M+ de universo) |

**Big nichos nunca morrem** [DOC — KC213, ~55:00]:
> "Quem trabalha com o perperto em big nicho? Eu afirmo categoricamente. Não morre nunca. O que é big nicho? O desenvolvimento pessoal, saúde. Renda extra. Finanças. Relacionamento. São big nichos." [DOC — KC213]

Big nicho tem audiência infinita — novos entrantes chegam ao mercado continuamente. Não há saturação real.

**Nichos pequenos: perpétuo como primeiro degrau obrigatório** [DOC — KC213, ~55:00]:
> "Para esses nichos menores, sim, o produto pode ter um prazo de vida, sim. Porque cara, você não tem público infinito. Agora você atingiu todo mundo. E aí você tem que entender que o perperto tem que ser necessariamente o primeiro passo da escada. Tem que ser." [DOC — KC213]

Em nichos pequenos (ex.: gestão de tráfego, copywriting), o perpétuo VSL R$297 deve ser projetado como produto de entrada para uma escada que inclui mentoria, mastermind ou serviço done-for-you. Um perpétuo standalone em nicho pequeno esgota o universo e para de crescer.

**Anti-padrão crítico** [REP — era [INF] em v0.3.0, agora corroborado por HC]:
> Se o nicho requer que o prospect JÁ SAIBA que tem o problema, o universo é pequeno demais
> para escalar VSL. Mudar para lançamento pago ou high ticket.
>
> Corroboração HC [DOC — HC, ~20:00]: "Gastronomia [...] não é uma dor, ninguém acorda de manhã e fala assim, nossa, eu preciso aprender praticidade na cozinha [...] mas você encaixa o funil em caixas peças e ele faz." — Nichos de dor latente (não articulada, não urgente) são escaláveis com funil VSL de público frio desde que o universo seja massivo. A dor não precisa ser urgente — precisa ser universal. [DOC — HC]

---

## Fase 2 — Arquitetura de Precificação

> **Princípio:** Precificação não é escolha arbitrária. É função de psicologia de compra,
> mecânica de pagamento e matemática de escala.

> ⚠️ **Risco de pular:** Ticket errado inviabiliza a escala antes mesmo do tráfego começar. Ticket acima de R$300 derruba conversão de público frio. Sem upsell estruturado, o cost cap de tráfego é calculado pelo valor errado — campanha não gasta ou gasta com ROI negativo.

> **Aplicação prática:** Calcule o ticket médio do funil (seção 2.2) antes de configurar qualquer campanha de tráfego. Esse número, não o ticket do front, define o cost cap correto.

**Critério de Saída da Fase 2:**
- [ ] Ticket de front definido (R$297 para este funil) e justificado
- [ ] Range de upsell definido (R$597-697)
- [ ] Ticket médio do funil calculado
- [ ] Cost cap / CPA máximo calculado baseado no ticket médio (não no front)
- [ ] Decisão sobre order bump: sim (com critério de teste) ou não (padrão recomendado)

### 2.1 Front Ticket — O "Ticket de Ouro"

[DOC] `vsl_funnel.front` e `brown_enrichment` confirmam com evidência de 200M+ em tráfego.

**O ticket correto para VSL de tráfego frio é R$297.** Não é convenção — é resultado de teste.

| Fator | Explicação | Confiança |
|-------|------------|-----------|
| Barreira psicológica dos R$300 | Acima de R$300 o cérebro entra em "modo análise racional": compara, pesquisa, posterga. R$297 fica abaixo desse limiar. | [DOC] |
| Taxa de cartão de crédito | A R$297, mantém-se 60-80% de pagamento em cartão. Abaixo (low ticket) o PIX domina. | [DOC] `pix_cartao_matematica_escala` [00:47:01] |
| Tempo de tela da VSL | VSL de 20-30 min é menor "tempo de tela" que um lançamento. O ticket precisa ser ajustado para baixo para compensar. R$297 equilibra conversão e escala com esse tempo de exposição. | [DOC] `screen_time` |
| Nível de consciência do prospect | R$297 converte em Level 4 parcial (Schwartz). R$497 exige Level 5 completo — impossível com público frio sem autoridade. | [DOC] `ticket_e_nivel_de_consciencia` [00:46:17] |

> **Citação direta:** "R$297 é o 'ticket de ouro do perpétuo'. Não mais que R$300: acima disso,
> taxa de conversão de tráfego frio cai drasticamente. Barreira quase psicológica de pagar
> +R$300 a alguém que acabou de conhecer." [DOC]

**Teto explícito para tráfego frio — não-celebridades** [DOC — KC213, ~1:10:00]:
> "Em 90% dos casos 300 reais. Quando você não é uma celebridade. Trafego direto. Público frio. Para página de vendas 300 reais. 2.700, 2.98. Acima disso a dificuldade aumenta bastante. Acima de 500, 600 reais não é possível fazer escala e roi positivo para o público frio. Se você não for uma celebridade no nicho." [DOC — KC213]

| Range | Viabilidade para público frio (sem autoridade prévia) |
|---|---|
| R$297–R$300 | Ótimo — máxima conversão |
| R$300–R$500 | Possível, mas dificuldade crescente |
| R$500+ | Inviável para não-celebridades em tráfego frio |

**Afirmação categórica: ticket de R$1.500 incompatível com escala de público frio** [DOC — HC, ~0:00]:
> "Para eu converter público frio, o primeiro passo é entender que existe uma precificação ótima, ideal daquele modelo. Não dá. Eu sempre falo isso categoricamente para você escalar para público frio um ticket de 1.500 reais." [DOC — HC]

Existe um teto psicológico e matemático de escalabilidade por ticket para tráfego frio. R$1.500 não está fora do range por preferência — está fora por inviabilidade matemática da conversão em escala.

**Por que não menos (low ticket)?** [DOC] `vsl_funnel.front.why_not_less`:
> "PIX é o maior vilão do digital. Não dá pra tirar do checkout. Low ticket (0-97) não escala
> por causa do PIX — cai a % de cartão de crédito. A R$297 mantém-se 60-80% de pagamento em cartão."

**Mecânica do cartão e escala** [DOC] [00:47:01]:
- 70% em cartão de crédito a R$297.
- 70% elegíveis para upsell one-click (OCU).
- OCU é o mecanismo que puxa ticket médio de R$297 para R$418.
- Ticket médio R$418 = CPA teto maior = escala desbloqueada.
- Fórmula indicativa: `297 (front) × 70% cartão × 15% upsell OCU × 600 (preço upsell) ≈ +R$63 de ticket médio por comprador convertido`. [REP]

---

### 2.2 Ticket Médio do Funil

[DOC] Confirmado com 200M+ em tráfego.

| Cenário | Ticket |
|---------|--------|
| Front puro (sem funil) | R$297 |
| Com funil completo (upsell 15% de conversão) | R$418,62 |
| Aumento | +40,9% |

> "Amadores dominam escala baseada em CPA — escala mais ingrata que existe.
> Escale baseado em TICKET MÉDIO DO FUNIL, não em CPA." [DOC]

**Implicação direta para tráfego pago** [DOC] `limite_custo_segredo` [02:18:19]:

| Referência errada | Referência correta |
|---|---|
| CPA máx baseado em ticket do front (R$297) | CPA máx baseado em ticket médio do funil (R$418) |
| Ex.: ROAS 2 no front → CPA máx R$130 | Ex.: ROAS 2 no ticket médio → CPA máx R$210 |
| Campanha não gasta. Meta abandona o objetivo. | Campanha opera. Meta encontra CPA real de R$180-200. |

---

### 2.3 Precificação de Upsell

[DOC] `vsl_funnel.upsell` — validado com 200M+ em tráfego.

- **Range:** R$597–R$697 para front de R$297.
- **Alvo de conversão:** 15% (com funil de recuperação: efetivo 30%) [DOC].
- **Por que esse range:** testado empiricamente como maximizador de ticket médio. [DOC]

**Configuração base documentada com ticket médio resultante** [DOC — HC, ~10:00-12:00]:
> "Fronte a 2.97, opcêu em torno de 600. Cinco no opcêut ou meia no opcêut. Para poder fechar um ticket de mil." [DOC — HC]

| Componente | Valor |
|---|---|
| Front | R$297 |
| Upsell | R$500–600 |
| Ticket médio alvo | R$300–400 (considerando taxas de conversão reais) |
| Ticket médio "aspiracional" | próximo de R$1.000 (com alta conversão de upsell) |

O ticket médio real do funil fica entre R$300–400 quando se considera que apenas uma fração dos compradores do front converte no upsell. O valor de R$1.000 é o ticket médio "teto" se o upsell convertesse 100% — referência para direção, não para forecast.

---

### 2.4 Precificação de Downsell

[DOC] `funnel_health_metrics.downsell`.

- **Preço:** mesma oferta do upsell + metade do preço + acesso reduzido (6 meses em vez de completo).
- **Conversão alvo:** 5-10%.
- **Regra crítica:** downsell NÃO é desconto simples — é remoção de elemento da oferta. Desconto puro treina o mercado a esperar desconto. [DOC] `commitment_escalation`

> **Script documentado de downsell** [DOC]:
> "Eu vi que por algum motivo você não comprou [produto]. Mas eu sei do impacto que ele pode ter
> para você. Por isso vou cortar metade do preço. Você vai ter 6 meses de acesso.
> Você nunca mais vai ver essa oferta fora daqui."

---

### 2.5 Order Bump — Regras e Anti-Padrões

[DOC] `vsl_funnel.order_bump` e `order_bump_matematica_real` [01:48:44].

**Regra geral:**
> "Praticamente nenhum funil VSL do Thiago usa order bump." [DOC]

**Quando avaliar (não "usar", mas avaliar):**

| Critério | Detalhe | Confiança |
|----------|---------|-----------|
| Máximo 3 bumps | A partir do 4o, queda de conversão é inevitável | [DOC] |
| Benchmark mínimo de conversão | 30% quando é o único bump do checkout | [DOC] |
| Ticket do bump | Acima de R$97 para front de R$297 é muito arriscado | [DOC] |
| Produto muito bom → vira upsell | Se o produto vale R$150+, colocar como upsell (R$297+), não como bump | [DOC] |

**Como medir corretamente (anti-padrão: medir conversão do bump em isolamento):**
[DOC] `order_bump_matematica_real` [01:48:44]:

1. Medir conversão de checkout SEM order bump por 7 dias (base limpa).
2. Adicionar 1 order bump, medir por 7 dias.
3. Comparar: queda na conversão do checkout vs. aumento de ticket médio.
4. Se perda de conversão > ganho de ticket médio: retirar o bump.
5. Adicionar 2o bump somente se 1o passou no teste.

**Case documentado:** uma consultoria revelou que order bumps causavam perda de R$160k/mês. [DOC]

**Mecanismo de por que order bumps reduzem conversão** [DOC — KC213, ~1:15:00]:
> "Order bump pode derrubar a conversão do seu checkout. Oferta demais confunde. [...] A gente tem que ter a métrica que é a taxa de conversão do seu checkout. Se 100 caiu no checkout. 20 compraram. Eu sei que meu checkout está com uma taxa de conversão de 20%. Aí eu posso colocar o order bump. Botei. Eu vi que caiu para 10. Eu tiro." [DOC — KC213]

O mecanismo de dano é a **confusão cognitiva**: múltiplas ofertas no mesmo checkout forçam o prospect a tomar duas decisões simultâneas, aumentando o esforço de decisão e a probabilidade de abandono. A venda primária é sacrificada pela tentativa de vender o bump.

**Métrica correta para order bump** [DOC] `order_bump_nuance` (Kennedy):
> "Métrica correta NÃO é 'conversão do bump' — é 'receita total por visitante do checkout'."

---

## Fase 3 — Estrutura do Funil

> **Princípio:** O funil é um sistema de micro funis conectados. Cada ponto de decisão
> do prospect é um micro funil separado com métricas próprias.

> **Princípio adicional — Design começa pelo upsell** [DOC — HC, ~10:00-12:00]:
> "A gente começa montando um funil de trás para frente. Qual o opcêu? Para definir o fronte, vamos pegar o opcêu primeiro porque o opcêu é fundamental no processo de escala." [DOC — HC]
>
> O upsell é definido ANTES do front. O upsell determina o espaço de ticket médio possível, que por sua vez define o custo de aquisição máximo viável, que por sua vez determina se o front pode escalar. Projetar o front antes do upsell é construir a fundação sem saber qual peso ela precisará suportar.
>
> **Corolário:** "Nem um projeto escala só com fronte. Só com fronte." [DOC — HC, ~10:00-12:00]

> ⚠️ **Risco de pular:** Funil sem upsell captura apenas R$297 de ticket médio — inviabilizando escala baseada em ticket médio (Fase 5). Checkout com order bumps não testados pode reduzir conversão geral em valores documentados de R$160k/mês de perda.

> **Aplicação prática:** Desenhe o mapa completo do funil (seção 3.1) antes de criar qualquer página. Checkout limpo sem order bumps é o ponto de partida obrigatório — nunca lançar com bumps sem baseline estabelecida.

**Critério de Saída da Fase 3:**
- [ ] Mapa do funil desenhado (criativo → VSL → checkout → upsell → downsell → recuperação)
- [ ] Estrutura de página de vendas definida (elementos abaixo do vídeo, posição de CTAs)
- [ ] Checkout configurado limpo (sem bumps, sem banners) como baseline de teste
- [ ] Fluxo de upsell definido (formato diferente do front)
- [ ] Botões "quero" e "não quero" visíveis no upsell
- [ ] Funil de recuperação de upsell planejado (webinário)

### 3.1 Mapa do Funil Principal

[DOC] `vsl_funnel` + `vsl_micro_funnels`.

```
[CRIATIVO] → [PÁGINA VSL] → [CHECKOUT] → [UPSELL 1] → [DOWNSELL 1]
                                                ↓
                                          [UPSELL 2]
                                                ↓
                                    [FUNIL DE RECUPERAÇÃO]
```

**Fluxo detalhado:**

```
Tráfego pago
    │
    ▼
Página VSL
    │ (lead assiste → pitch)
    ▼
Checkout (limpo, sem banners)
    │
    ├── Order bump? (somente se testado e aprovado)
    │
    ▼
Upsell 1 (R$597-697)
    │
    ├── SIM → Upsell 2 ou próximo produto (ascensão)
    │
    └── NÃO → botão "não quero" visível → Downsell (R$~397)
                    │
                    ├── SIM → Próximo produto ou ascensão
                    │
                    └── NÃO → Funil de recuperação de upsell (webinário)
```

---

### 3.2 Estrutura da Página Após o Pitch

[DOC] `ia_workflow_vsl.page_structure_after_pitch` [01:07:32].

> "Ao revelar o preço: a página de vendas ABRE COMPLETA (não só botão)."

**Estrutura mínima da página de vendas abaixo do vídeo:**

| Elemento | Posição | Nota |
|----------|---------|------|
| Depoimentos | Acima dos primeiros botões | [DOC] |
| Prova (resultados, credenciais) | Intercalado | [DOC] |
| Botões de CTA | Espalhados — o mais próximo do vídeo converte mais | [DOC] |
| Preço + condições | Visível | [DOC] |
| Bônus | Abaixo da ancoragem de preço | [DOC] |

> **Regra de CTA** [DOC] `cta_rule_low_ticket` + `brasil_paralelo` (case):
> Para qualquer ticket a partir de R$97, CTA NUNCA no topo da página.
> "Sequência correta: conexão → autoridade → desejo → ancoragem → pitch."
> Remover CTAs do topo de páginas de venda dobrou conversão no caso Brasil Paralelo. [DOC]

**Threshold explícito de ticket para posição do botão** [DOC — KC213, ~30:00]:
> "Na maior parte dos casos, não pode [botar botão no topo]. Tem tempo de convencimento. Para um tíquete de R$37, talvez se você botar o botão no topo lá, pode até vender porque a necessidade de convencimento é mínima. Agora para um tíquete R$250, R$300, não adianta botar o botão no topo." [DOC — KC213]

| Ticket | Posição do botão de CTA | Razão |
|---|---|---|
| ≤R$37 | Topo pode funcionar | Convencimento mínimo necessário |
| R$37–R$300 | Após sequência de convencimento | Botão no topo gera "curiosos" no checkout |
| R$300+ | Após sequência completa obrigatória | Mesma razão — efeito amplificado |

Colocar botão no topo para tickets de R$250–R$300 gera visitantes "curiosos" no checkout (clicam apenas para ver o preço) — infla o custo de checkout sem intenção real de compra.

**Evidência de caso: preço após desejo dobrou conversão** [DOC — HC, ~25:00-30:00]:
> "Preço, depois de desejo. Não é assim que a gente faz lançamento. CPL 1, CPL 2, CPL 3, preço no final, afeta no final. No perfeito. Por algum motivo, alguém decidiu que o CTA tem que ficar no topo. [...] Rapa o CTA daqui e joga para o final. [...] Dobrou a conversão." [DOC — HC]

Empresa faturando centenas de milhões/ano tinha CTA no topo da página de vendas. Diagnóstico aplicado: mover CTA para o final. Resultado documentado: dobrou a conversão. O erro existe nos maiores players — não é apenas um problema de iniciantes.

**Princípio de implementação:** começar simples. Ir encorpando a página somente se conversão estiver baixa. [DOC]

---

### 3.3 Checkout

[DOC] `checkout_limpo_principio` [01:47:36].

- Checkout limpo (sem banner, sem order bump inicial) é o ponto de partida obrigatório.
- Benchmark de conversão de checkout limpo: 20%+ é bom; 10-20% é aceitável; <10% é baixo. [DOC]
- Protocolo: medir 7 dias limpo antes de adicionar qualquer elemento.

---

### 3.4 Upsell — Regras de Formato

[DOC] `vsl_funnel.upsell.key_rule_format_change` + `upsell_advanced` [01:55:07].

**Regra número 1 do upsell** (crédito: Rafa Marques) [DOC]:
> "MUDANÇA DE FORMATO é o que faz o upsell converter. Não venda curso no upsell se vendeu
> curso no front."

| Formato de front | Formato correto de upsell |
|---|---|
| Curso (conteúdo para aprender) | Done-For-You (solução pronta) |
| Qualquer conteúdo | Mentoria/acompanhamento em grupo |
| Qualquer conteúdo | Comunidade exclusiva |
| Qualquer conteúdo | Software/ferramenta que automatiza o que o front ensinou |

**Melhor formato de upsell documentado:** Done-For-You. [DOC] `upsell_advanced.best_upsell_format`:
> "Front ensina a criar loja → Upsell entrega loja pronta (apertar botão, funcionando)."
> "Vende velocidade e conveniência, não mais conteúdo. Prospect não quer outro curso — quer o resultado já."

**Anti-padrão de headline de upsell** [DOC] `upsell_awareness_sequencing` [01:55:07]:
- NÃO começar com "Obrigado pela compra" — diz ao cérebro "acabou", encerra o modo de compra.
- Headline correta: gera CURIOSIDADE, não gratidão. Mantém o "modo sim".
- Exemplos de headline correta: "Ainda falta um passo", "Tem um presente para você". [DOC]

**Headlines de upsell documentadas e validadas** [DOC — KC213, ~1:15:00]:
> "A red line da página não pode ser obrigado para a bens para sua compra. Ninguém vai ver um vídeo. [...] a oferta na página de obrigado do upsell tem que ser assim. Falta um passo. Ou. Tem uma proposta recusável para você. Ou. Assiste o vídeo para finalizar a sua inscrição." [DOC — KC213]

| Headline | Mecanismo |
|---|---|
| "Falta um passo" | Cria incompleto — tensão de conclusão |
| "Tem uma proposta recusável para você" | Curiosidade + FOMO implícito |
| "Assiste o vídeo para finalizar a sua inscrição" | Instrução + senso de processo em andamento |

Todas as headlines acima evitam sinalizar que a transação "acabou" e mantêm o comprador em modo ativo de decisão.

**Por que upsell em vídeo tem taxa de visualização excepcional** [DOC — KC213, ~1:15:00]:
> "Upsell tem que ser vídeo necessariamente. [...] O vídeo, se você caprichar na sua red line, você vai ter uma taxa de visualização do vídeo muito alta. Muito alta. Ao contrário de um vídeo de vendas numa página de vendas. [...] No upsell o contrário. A imensa maioria vai ver. A pessoa acabou de comprar. É um público extremamente qualificado." [DOC — KC213]

Ao contrário da VSL do front (onde a maioria dos visitantes nunca dá play), o vídeo do upsell é visto pela grande maioria — o comprador acabou de tomar uma decisão de compra e está em estado de alta receptividade e confiança. Isso torna o vídeo do upsell um formato de alto retorno: vale investir em qualidade de produção.

**Botões do upsell** [DOC] `vsl_funnel.upsell.show_decline_button`:
> "NÃO oculte o botão 'não quero'. Deixe visível. Se esconder, pessoa fecha a página e
> você perde upsell E downsell."
> Dois botões visíveis obrigatórios: "quero" + "não quero" (não quero leva ao downsell).

**UX do botão de recusa — mecânica do downsell** [DOC — HC, ~12:00-15:00]:
> "No opcêut, você tem lá opção de queiro comprar, não queiro comprar. A galera coloca o botão de não queiro comprar pequenininho, mas esconde. Isso é um erro, porque o cara fecha tela. [...] A gente bota do meio do tamanho. Porque eu quero que ele clique, que não quer comprar, porque ele não quiser. Porque eu falei isso dar um céu [downsell]." [DOC — HC]

Lógica de design: se o usuário não encontra o botão de recusa, fecha a aba (perda total — zero upsell, zero downsell). Se clica em "não quero", entra no downsell (recuperação parcial). O downsell só existe se o botão de recusa for encontrado. Tamanho recomendado: médio — visível, sem ser proeminente.

---

### 3.5 Upsell de Trial (7 dias)

[DOC] `trial_upsell_tactic` [02:07:58].

| Elemento | Detalhe |
|----------|---------|
| Mecanismo | One-click que cobra automaticamente após 7 dias |
| Headline | "Você ganhou 7 dias de acesso grátis ao [produto]" |
| Vantagem | Alta conversão — prospect clica sem sentir o gasto imediato |
| Requisito | One-click via plataforma — cobrar cartão salvo automaticamente |
| Risco | Sem one-click, conversão cai drasticamente |

---

### 3.6 Funil de Recuperação de Upsell

[DOC] `upsell_advanced.webinar_recovery_system` [02:46:41] e `upsell_recovery_funnel`.

**Trigger:** prospect comprou front + NÃO comprou upsell (detectado via API/plataforma).

**Mecanismo:**
- Convidar para webinário ao vivo ou gravado, mensalmente.
- Segmentação obrigatória:
  - Comprou front + não comprou upsell → webinário de recuperação de upsell.
  - Comprou front + comprou upsell → webinário de próximo produto (ascensão).

| Métrica | Valor |
|---------|-------|
| Conversão efetiva de upsell sem recuperação | ~15% |
| Conversão efetiva com recuperação | ~30% (dobra) [DOC] |
| Resultado documentado | Rodando há 14 meses, gera R$1M+/mês de lucro líquido em alguns projetos [DOC] |
| Outro case | R$400k de lucro/mês em webinários semanais sem tocar no tráfego [DOC] |

> "Quem não comprou upsell não disse 'não' ao produto — disse 'não agora'.
> Webinário cria novo contexto e novo momento de decisão." [DOC]

**Operação:** realizar primeiro ao vivo; após validação, gravar e automatizar. Frequência recomendada: 1-2x/mês. [DOC]

---

### 3.7 Princípio de Ascensão

[DOC] `vsl_funnel.ascension` + `vsl_conversion_elements`.

> "O dinheiro está no front, mas a ESCALA nunca esteve no front." [DOC]

**Implicação operacional:**
- O funil de front serve para converter prospectos em clientes, não para gerar lucro.
- Lucro real vem da ascensão: upsell → upsell 2 → novos funis → high ticket.
- "Se empatar no direct response já é maravilhoso. O jogo é ascensão." [DOC]
- Estrutura de ascensão longa: Front → Upsell 1 → Upsell 2 → Downsell 2 → Upsell 3 → Downsell 3 → Novo funil. [DOC]

---

### 3.8 Coexistência Perpétuo × Lançamento — Anti-Padrões

[DOC — KC213, ~50:00-55:00]

> "Perpetos matam lançamentos. [...] O cara às vezes, está fazendo lançamento e fatorando-se lá. 400 mil lançamentos. Com um lucro de 200 mil. Aí ele fala assim, vou botar um perpeto aqui no meio. [...] Perpeto mal encaixado na estere, quando já existe um lançamento, ele mata o lançamento." [DOC — KC213]

**Quando um perpétuo mata um lançamento (dois modos de falha):**

| Modo de falha | Mecanismo |
|---|---|
| Sobreposição de conteúdo | Prospect compra o perpétuo, não precisa mais do lançamento |
| Produto ruim | Prospect compra o perpétuo, fica insatisfeito, não compra o lançamento |
| Produto completo demais | Prospect compra o perpétuo, satisfação total, não sente necessidade do próximo nível |

**Design saudável de perpétuo — premissa de produto** [DOC — KC213, ~55:00]:
> "Um perpeto saudável é um perpeto que gera uma primeira transformação e gera desejo pela transformação maior. Aí você vem de lançamento. Quando você encaixa um perpeto assim, você cria uma estéra saudável de fatoramento para o seu negócio. Gera uma primeira transformação que deve ser rápida. Não pode ser demorada. E gera desejo pelo passo seguinte." [DOC — KC213]

O produto perpétuo deve ser projetado para:
1. Entregar transformação RÁPIDA (horas ou dias, não semanas).
2. Deixar o comprador querendo o próximo nível — não a solução completa.
3. Criar desejo pelo lançamento, não substituí-lo.

**Regra de complementaridade:**
- Perpétuo = previsibilidade de receita diária.
- Lançamento = picos de receita + aquisição em lote.
- Quando o perpétuo entrega a primeira transformação rápida → o lançamento entrega a transformação completa → a combinação é saudável.

---

## Fase 4 — Especificações da VSL

> **Princípio:** "VSL é um jogo de retenção. O mais difícil não é converter, é reter." [DOC]

> ⚠️ **Risco de pular:** VSL gravada em tomada única sem múltiplos leads força regravação completa quando uma seção falha. Formato de teleprompter (morto em 2025) entrega retenção ruim independente da qualidade do copy. Uma VSL morta (>60% de perda no 1o minuto) não é recuperável por otimização de tráfego.

> **Aplicação prática:** Defina o formato da VSL (seção 4.3) antes de escrever uma palavra de copy. Formato determina retenção; copy determina conversão. Sem retenção, copy não chega até o pitch.

**Critério de Saída da Fase 4:**
- [ ] Duração da VSL definida (20-30 min para front de R$297)
- [ ] Número de micro vídeos planejado (mínimo 5)
- [ ] Número de leads planejado (mínimo 3, preferencialmente 5)
- [ ] Formato da VSL definido (casual, call center, podcast, etc.) — não teleprompter
- [ ] Estrutura de jornada de awareness mapeada (Level 2 no lead → Level 4-5 no pitch)
- [ ] Benchmarks de retenção documentados como critério de go/no-go

### 4.1 Duração e Estrutura

[DOC] `vsl_production_extended` + `vsl_sizing`.

| Parâmetro | Especificação | Confiança |
|-----------|--------------|-----------|
| Duração total | 20-30 minutos para front de R$297 | [DOC] |
| Número mínimo de micro vídeos | 5 | [DOC] |
| Lead (seção de entrada) | 1-4 minutos | [DOC] |
| Pitch (revelação do preço) | ~20-25 minutos | [DOC] |

**Estrutura interna da VSL** [DOC] `benson_analysis.structure`:

```
[LEAD — 1-4 min]
    Micro vídeo independente. Pode ter formato, cenário e abordagem
    completamente diferentes do resto da VSL.
    Função: reter pelo gancho + criar antecipação.
    │
    ▼
[CORPO]
    Alternância de: elevação de consciência + prova.
    Cada bloco resolve uma operação: criar crença OU quebrar crença.
    SEM depoimentos longos no meio (destroem retenção).
    │
    ▼
[PITCH — ~min 20-25]
    Revelação do preço → página de vendas abre automaticamente.
    │
    ▼
[OFERTA + ASCENSÃO IMEDIATA]
    Ascensão deve ser imediata (sem delay).
```

**Jornada de awareness dentro da VSL** [DOC] `schwartz_analysis.awareness_journey_inside_vsl`:

| Trecho | Minuto | Nível Schwartz | Ação da VSL |
|--------|--------|----------------|-------------|
| Lead | 0-1 | Level 2 (Problem Aware) | Gancho que valida a dor |
| Lead estendido | 1-4 | Level 2→3 | Agitação do problema + introdução do conceito de solução |
| Corpo inicial | 4-10 | Level 3 (Solution Aware) | Apresentação do mecanismo |
| Corpo central | 10-20 | Level 3→4 | Prova social, credenciais, demonstração |
| Pré-pitch | 20-25 | Level 4 (Product Aware) | Revelação do produto, diferenciação |
| Pitch | 25+ | Level 4→5 | Oferta, ancoragem, urgência, CTA |

---

### 4.2 Regras de Produção — Micro Vídeos

[DOC] `vsl_retention.recording_rules` + `leads_production`.

| Regra | Detalhe |
|-------|---------|
| Mínimo 5 micro vídeos | Nunca gravar VSL em tomada única | [DOC] |
| Mínimo 3 leads por VSL | Mais comum: 5 leads | [DOC] |
| Lead independente | Pode ter formato, cenário, abordagem completamente diferentes | [DOC] |
| Substituição cirúrgica | Micro vídeos permitem trocar seções sem regravar tudo | [DOC] |
| Teste A/B de seções | Identificar ponto exato de problema de retenção | [REP] |

> **Por que múltiplos leads:** "De 5 leads testadas, 4 deram ruim, 1 deu muito boa —
> essa salvou a VSL inteira." [DOC] [01:09:42]

---

### 4.3 Formatos de VSL

[DOC] `vsl_production_extended.formatos_recomendados_2025` + `benson_enrichment.formatos_vivos_vs_mortos`.

**Formato morto (saturado em 2025):**
- Expert lendo teleprompter, olhando fixo para câmera.

**Formatos vivos documentados:**

| Formato | Exemplo |
|---------|---------|
| Casual cotidiano | Expert abrindo geladeira, servindo água, conversando naturalmente |
| Call center | Expert com fone, simulando atender ligação |
| Podcast/entrevista | Dois participantes conversando |
| Talk show | Expert recebendo convidados |
| Palestra | Expert em palco com microfone |
| Nicho-congruente | Chef fazendo receita; homem com futebol na TV ao fundo |

> **Princípio:** "O formato ideal disfarça a mensagem de vendas e parece CONTEÚDO que
> a pessoa quer consumir independente de interesse no nicho." [DOC]

**Case documentado de impacto de formato** [DOC] [00:54:42]:
- Expert Prisciane Pereira (nicho renda extra).
- Mudança: VSL padrão (teleprompter) → call center com fone.
- Copy: mínima alteração (extremamente parecida).
- Resultado: 2X de conversão.

**Hierarquia de retenção** [DOC] `vsl_retention.what_increases_retention`:

| Rank | Fator | Nota |
|------|-------|------|
| 1 | **Formato** | Rei da retenção |
| 2 | **Copy** | Aumenta conversão, não retenção |
| 3 | **Apresentação** | Menor impacto |

> "Mudou formato da VSL (mesma copy) → saiu de 700k/mês para 4M/mês." [DOC]

---

### 4.4 Benchmarks de Retenção

[DOC] `vsl_retention.benchmarks` + `vsl_sizing`.

| Métrica | Benchmark saudável | Ação se abaixo |
|---------|-------------------|----------------|
| Play rate | Acima de 60-70% | Problema de criativo ou segmentação (não de VSL) |
| Retenção no 1o minuto | Acima de 60% | Lead morta. Abaixo de 40% = VSL morta. |
| Retenção no pitch (~min 20-25) | Acima de 30% | Problema de formato ou copy |
| Queda no momento do pitch | BRUTAL = saudável (prospect foi ao checkout) | Queda leve = problema de ticket/oferta |

**Citação direta sobre lead morta** [DOC] [00:56:57]:
> "Se você tem uma VSL que você perdeu 60% no primeiro minuto e acontece, acabou a VSL.
> Ela pode ser maravilhosa depois e ela tá morta."

**Padrão saudável de curva de retenção** [DOC]:
- Após 1o minuto: queda leve e constante até o pitch.
- No pitch: queda brutal (prospect saiu para o checkout — sinal positivo).
- Se queda no pitch for leve: problema de ticket ou oferta (mais fácil de resolver). [DOC]

> "Prefiro 1000x VSL que retém até o pitch mas não converte vs o contrário." [DOC]

---

### 4.5 Matriz de Diagnóstico da VSL

[DOC] `vsl_diagnostic_matrix` [01:17:17].

| Retenção | Conversão | Diagnóstico | Ação |
|----------|-----------|-------------|------|
| Alta | Alta | Perfeito | Escalar |
| Baixa | OK | COP boa, FORMATO ruim | Mudar formato, manter copy |
| Alta | Baixa | Formato bom, COP ruim | Mudar copy, manter formato |
| Baixa | Baixa | Tudo ruim | Nova VSL |

---

### 4.6 Hack de Otimização de Retenção

[DOC] `vsl_retention.optimization_hack`:

> "Se tem problema de retenção: pegar o melhor criativo de ads e transportar o FORMATO dele
> para o início da VSL. Se explodiu retenção, transformar a VSL inteira nesse formato.
> Mesmo que fique visualmente diferente do resto — não tem problema." [DOC]

---

## Fase 5 — Framework de Métricas

> **Princípio:** "A forma mais pobre de analisar um funil é analisá-lo como um todo." [DOC]
> Desmembrar em micro funis e analisar cada um separadamente.

> ⚠️ **Risco de pular:** Analisar métricas erradas ou na janela de tempo errada gera decisões destrutivas — desligar campanha saudável, manter criativo morto, ou configurar cost cap pelo ticket errado. Erro na métrica de referência (front vs. ticket médio) pode inviabilizar escala permanentemente.

> **Aplicação prática:** Configure o mapa de métricas (seção 5.3) antes de ligar tráfego. Defina os thresholds de cada micro funil como critério de go/no-go operacional, não como aspiração.

**Critério de Saída da Fase 5:**
- [ ] Custo de checkout ideal calculado (10-20% do ticket front)
- [ ] Modelo 731 em uso como rotina de decisão
- [ ] Mapa de saúde do funil configurado (8 métricas) com thresholds definidos
- [ ] Significância estatística: mínimo de 10 vendas antes de tomar decisões de ROAS
- [ ] Protocolo de redução de orçamento (50-70%) definido antes de desligar campanha

### 5.1 Custo de Checkout — Métrica Soberana

[DOC] `custo_checkout_metrica_soberana` [01:43:54] — declarado explicitamente como "mais importante que ROAS".

> "O custo por checkout não engana. Porque se você tá batendo o seu custo ideal,
> a venda vai acontecer, o ROI vai aparecer." [DOC]

**Benchmark:** 10-20% do ticket front.

| Ticket front | Custo de checkout saudável |
|---|---|
| R$297 | R$29-30 |
| Exceção: nicho de renda extra | Mais barato (não especificado) [DOC] |

**Por que ROAS engana com orçamento baixo** [DOC]:
- Com R$100/dia, 1 venda = ROAS 2+ matematicamente.
- Mas 1 venda é estatisticamente inválida.
- No dia seguinte, o ROAS desaparece — era ilusão.
- Custo de checkout não engana: se está no nível ideal, a venda acontece.

**Uso conjunto** [DOC]: ROAS manda no final. Checkout mostra a tendência. Usar os dois em conjunto.

---

### 5.2 Modelo 731

[DOC] `modelo_731` [02:33:44] + `brown_enrichment.new_mechanisms.Modelo 731`.

**Toda decisão de otimização segue 3 janelas temporais simultâneas:**

| Janela | Função |
|--------|--------|
| 7 dias | Tendência geral — nunca levar em conta mais de 7 dias |
| 3 dias | Tendência recente — criativo subindo ou caindo? |
| Hoje | Decisão final: bom hoje = mantém; ruim hoje = desliga |

**Matriz de decisão:**

| 7d | 3d | Hoje | Decisão |
|----|----|------|---------|
| Bom | Ruim | Ruim | Desligar |
| Bom | Ruim | OK | Manter, monitorar |
| Ruim | Melhorando | — | Raro — suspeito de anomalia |

**Antes de desligar** [DOC] [02:35:22]:
> "Quando uma campanha ou um criativo para de performar, que que 99% do mercado faz? Ele desliga.
> Só que tem algo que você pode fazer antes disso."

Reduzir orçamento 50-70% antes de desligar campanha.
> "Grande parte das vezes isso faz voltar a performar bem. Voltou a performar bem, volta a subir 20%.
> Não voltou a performar, rapa fora. Sempre assim." [DOC] [02:36:29]

**Regra "o que tá ruim não melhora"** [DOC] [02:19:54] (declarada pelo HOST, confirmada por THIAGO):
> "Começou ruim, performance ruim, custo de checkout ruim, ROI negativo, rodou dois dias,
> jogou dinheiro ali, ele não vai melhorar da noite pro dia."
> Não aguardar "fase de otimização" para criativo que nasceu com mau desempenho.

---

### 5.3 Mapa de Saúde do Funil

[DOC] `funnel_health_metrics` + `vsl_micro_funnels`.

Cada micro funil tem sua métrica-chave:

| Micro funil | Métrica principal | Benchmark | Problema se baixo |
|-------------|------------------|-----------|-------------------|
| Criativo → clique | Custo por initiate checkout | 10-20% do ticket | Criativo ou segmentação |
| Página → play | Play rate | 60-70%+ | Criativo ou segmentação |
| VSL → retenção 1o min | Retenção minuto 1 | >60% | Lead morta |
| VSL → retenção no pitch | Retenção no pitch | >30% | Formato ou copy |
| Checkout → compra | Conversão de checkout | >20% bom; 10-20% aceitável; <10% baixo | Checkout ou oferta |
| Order bump | Receita total por visitante do checkout | Medir vs. base sem bump | Bump sabotando conversão |
| Upsell → conversão | Taxa de conversão do upsell | 15%+ (meta: 30% com recuperação) | Formato ou oferta do upsell |
| Downsell → conversão | Taxa de conversão do downsell | 5-10% | Script ou preço |

---

### 5.4 Significância Estatística

[DOC] `traffic_phases.fase_3.criteria` + `statistical_significance` (Kennedy).

> "Teste sem volume adequado não prova nada — confirma o que você já acreditava." [DOC]

- Mínimo de 10 vendas para considerar ROAS com relevância estatística. [DOC]
- Calcular tamanho de amostra para 95% de significância antes de tomar decisões. [REP]

---

### 5.5 Quando Medir o Quê

[DOC] `traffic_structure_updated` + `modelo_731`.

| Fase | O que medir | Janela |
|------|-------------|--------|
| Teste de criativo (48h mínimo) | Custo de checkout | 48h |
| Validação | ROAS + custo de checkout | 2-3 dias (excluindo dias atípicos) |
| Escala | Ticket médio do funil | 7 dias |
| Decisão de otimização | Modelo 731 | 7/3/hoje |
| Order bump | Receita por visitante de checkout | 7 dias sem bump → 7 dias com bump |

---

### 5.6 Cadência de Monitoramento Operacional

[INF — derivado do Modelo 731 e das janelas de decisão documentadas na fonte; cadência explícita para funis em operação não especificada textualmente por @thiagoroas]

| Frequência | Atividade |
|------------|-----------|
| Diária | Checar custo de checkout vs. benchmark (10-20% do ticket). Aplicar decisão do Modelo 731 (hoje). Verificar criativos ativos. |
| A cada 3 dias | Checar tendência recente (janela de 3 dias do Modelo 731). Identificar criativos em queda. |
| Semanal (7 dias) | Revisão completa de saúde do funil (todas as 8 métricas da seção 5.3). Tendência geral do Modelo 731. Decisão de escalar, manter ou pausar. |
| Por evento | Após adicionar order bump: comparar baseline de checkout (7 dias limpos) vs. novo período (7 dias com bump). Após subida de orçamento: monitorar performance pós-aumento antes do próximo ajuste. |

> **Nota:** A máxima de aumento de orçamento é 20%/dia por campanha existente [DOC] `regra_20_percent`. Aguardar pelo menos 24h de dados pós-aumento antes de nova decisão.

---

### 5.7 Anti-Padrões de Métricas

**Anti-padrão 1 — ROAS como métrica primária em fase de teste** [DOC] `custo_checkout_metrica_soberana` [01:43:54]:
> Com orçamento baixo (ex.: R$100/dia), 1 venda gera ROAS 2+ matematicamente. Essa leitura é estatisticamente inválida. No dia seguinte desaparece. Usar custo de checkout como métrica primária — ele não engana.

**Anti-padrão 2 — Desligar campanha sem reduzir primeiro** [DOC] [02:35:22]:
> "99% do mercado desliga quando para de performar." Protocolo correto: reduzir orçamento 50-70% primeiro. Grande parte das vezes a campanha se recupera. Só depois desligar se não recuperar.

**Anti-padrão 3 — Aguardar otimização em criativo que nasceu ruim** [DOC] [02:19:54]:
> "Começou ruim, ROI negativo, rodou dois dias — ele não vai melhorar da noite pro dia." Criativo que nasce com custo de checkout acima do benchmark por 48h não deve receber orçamento adicional esperando melhora.

**Anti-padrão 4 — Cost cap pelo ticket do front** [DOC] `limite_custo_segredo` [02:18:19]:
> Configurar cost cap por ROAS 2 no ticket do front (R$297) = CPA máximo de R$130. Campanha não gasta. Meta abandona o objetivo. Correto: usar ticket médio do funil (~R$418) como referência para o cap.

**Anti-padrão 5 — Analisar o funil como um todo** [DOC] `vsl_micro_funnels`:
> "A forma mais pobre de analisar um funil é analisá-lo como um todo." Cada micro funil tem sua métrica-chave e seu threshold. Problema de play rate é de criativo/segmentação, não de VSL. Confundir a origem do problema leva a ação no lugar errado.

---

## Fase 6 — Coerência Criativo-VSL

> **Princípio:** O criativo não é apenas gerador de cliques. É um filtro de awareness
> e criador de estado emocional que deve ter continuidade na VSL. [DOC]

> ⚠️ **Risco de pular:** Descontinuidade entre o formato do criativo e o formato da VSL cria leak de retenção imediato — o prospect que se identificou com o criativo encontra um ambiente diferente e sai. Modelar 100% dos criativos a partir de um único vencedor sem diversificação cria dependência de uma única peça — quando ela morre, a escala inteira para.

> **Aplicação prática:** O melhor criativo de ads é o ponto de partida para o formato do lead da VSL (seção 4.6). Planeje o mix 70/30 (seção 6.5) como política, não como reação — produzir somente novos criativos quando o atual "morrer" já é tarde demais.

**Critério de Saída da Fase 6:**
- [ ] Tipo de criativo definido (vídeo para VSL R$297, não estático como padrão)
- [ ] Nível de awareness que o criativo filtra identificado (Level 2, 3 ou 4)
- [ ] Lead da VSL coerente com formato e tom do criativo
- [ ] Mix 70/30 (novos/modelagens) planejado para fase de escala
- [ ] Fontes de pesquisa de formatos fora do nicho identificadas

### 6.1 Criativo como Filtro de Awareness

[DOC] `schwartz_analysis.creative_as_awareness_filter` + `creative_strategy_extended.criativo_is_8020_trafego`.

> "A segmentação é feita VIA CRIATIVO. O criativo filtra a audiência psicograficamente." [DOC]
> "Criativo é o 8020 do tráfego hoje, disparado." [DOC]

**O peso explícito do criativo no resultado** [DOC — HC, ~15:00]:
> "O criativo é o 80-20 do tráfego. O tráfego ficou muito mais fácil de fazer. Então, cara, esquece público hoje em dia. O foco é criativo." [DOC — HC]

Segmentação de público tornou-se secundária — o algoritmo faz automaticamente. O trabalho operacional que gera retorno é criativo.

**Reframing fundamental: criativo como início do processo de venda** [DOC — HC, ~15:00]:
> "Eu não sou do time, eu não concordo com a tese de que o papel do criativo é levar para a página. A minha visão é diferente. O criativo, ele tem papel de venda. Ele é o início do processo de venda." [DOC — HC]

Implicação para avaliação de criativos: o criativo não é julgado pela sua capacidade de gerar cliques — é julgado pela sua capacidade de iniciar o processo de persuasão. Um criativo que gera muitos cliques de pessoas não-qualificadas falha no papel de venda, mesmo que pareça "performático" pelas métricas secundárias.

| Tipo de criativo | Awareness que atrai | Implicação para VSL |
|---|---|---|
| Criativo de conteúdo | Level 2 (Problem Aware) | VSL precisa começar no problema, não no mecanismo |
| Criativo de mecanismo | Level 3 (Solution Aware) | VSL pode pular mais rápido para a solução |
| Criativo de produto/depoimento | Level 4 (Product Aware) | VSL pode ser mais curta, mais voltada a diferenciação |

**Regra atual (set/2025)** [DOC]: nenhuma campanha usa público segmentado. Segmentação = 100% via criativo, só broad.

**Onde vive a inteligência do tráfego pago — e por que isso impacta gestão de criativo** [DOC — KC213, ~40:00]:
> "Quando a gente faz uma alteração. De duplicação da verba de um conjunto de anúncios, ele reinicia a fase de aprendizagem do conjunto de anúncios. A inteligência do tráfego pago no Facebook não está na campanha. Nem no anúncio, está no conjunto de anúncios." [DOC — KC213]

A inteligência do Meta Ads acumula no nível do ad set. Dobrar o orçamento ou fazer alterações grandes (>20%) reinicia a fase de aprendizagem, perdendo o dado acumulado. Regra operacional: máximo 10–20%/dia de aumento em qualquer ad set individual. Esta regra já existe na Fase 5 [DOC] `regra_20_percent` — corroborada aqui com o mecanismo explicado.

---

### 6.2 Vídeo vs. Estático por Tipo de Funil

[DOC] `static_vs_video_by_funnel` + `criativo_coherencia_vsl` [01:19:58].

| Tipo de funil | Formato vencedor | Razão |
|---|---|---|
| VSL R$297 | **Vídeo > Estático** | Criativo conecta com a VSL — mesma energia, mesma pessoa, maior retenção inicial |
| Low ticket | Estático > Vídeo | CPM menor, dependência de CPA — custo é o que conta |
| Lançamento pago / low ticket (set/25) | Estático com caricatura IA do expert + plaquinha de preço | Formato mais escalado documentado [DOC] |

> "A pessoa que gostou do criativo em vídeo tende a reter na VSL porque é a mesma pessoa
> atraída pelo mesmo tipo de formato." [DOC]

---

### 6.3 Coerência de Formato Criativo → Lead da VSL

[DOC] `creative_vsl_coherence` (Benson) + `benson_enrichment.criativo_coherencia_vsl`.

> "O criativo cria estado emocional + expectativa. Lead da VSL deve ser continuação natural
> do criativo. Descontinuidade entre ad e VSL = leak de retenção." [DOC]

**Implicação prática:**
- O formato do criativo que mais converte = forte candidato para o formato do lead da VSL.
- Se criativo informal → lead informal.
- Se criativo tipo podcast → lead tipo entrevista.

---

### 6.4 Estratégia de Caça de Formatos

[DOC] `source_strategy_format_hunting` [01:23:08].

> "Caçar formatos FORA do nicho para evitar bitolamento nos padrões do mercado." [DOC]

**Protocolo:**
1. Criar Instagram dedicado à pesquisa. Seguir contas grandes de OUTROS nichos.
2. Filtro pessoal: "Isso chamou a minha atenção?" → pode chamar de outros.
3. TikTok é fonte válida, especialmente para formatos virais novos. [DOC]
4. O formato não precisa ter nada a ver com o nicho — captura atenção. [DOC]

**Case documentado:** Pianista tocando em público, pessoas se juntando, seta apontando para reações → 106 milhões de views em um vídeo. A mecânica da "seta + close em reação" pode ser adaptada para qualquer nicho. [DOC]

---

### 6.5 Regra 70/30 de Criativos

[DOC] `creative_mix_rule`.

| Proporção | Tipo |
|-----------|------|
| 70% | Novos formatos/ângulos |
| 30% | Modelagens do que já funciona |

**Por que não 100% modelagem** [DOC]:
> "Criativo mãe morre → todas as variações morrem ao mesmo tempo."
> "Escala real vem de criativo MELHOR que o anterior, não de cópia do mesmo." [DOC]

---

### 6.6 Combinação de Elementos de Criativo

[DOC] `criativo_analysis_framework`.

- Estrutura: Hook (gancho) + Body (corpo) + CTA.
- Tática: cruzar elementos. Hook do criativo A + body do criativo B = novo criativo para testar. [DOC]
- Meta penaliza criativos antigos — inevitável. Diversidade é proteção. [DOC]

---

### 6.7 Anti-Padrões de Estratégia Criativa

**Anti-padrão 1 — 100% modelagem, 0% criação** [DOC] `creative_mix_rule`:
> "Criativo mãe morre → todas as variações morrem ao mesmo tempo." Se todos os criativos ativos são variações do mesmo vencedor, a morte do criativo original é catástrofe — escala para instantaneamente. Manter 70% de novos formatos/ângulos como política.

**Anti-padrão 2 — Confundir formato com copy** [DOC] `vsl_retention.what_increases_retention` + `vsl_diagnostic_matrix` [01:17:17]:
> Formato e copy resolvem problemas diferentes. Formato = rei da retenção. Copy = conversão. Reescrever copy para resolver problema de retenção é ação no lugar errado. Usar a matriz de diagnóstico (Fase 4.5) antes de qualquer decisão de otimização criativa.

**Anti-padrão 3 — Pesquisar formatos apenas dentro do próprio nicho** [DOC] `source_strategy_format_hunting` [01:23:08]:
> "Caçar formatos fora do nicho para evitar bitolamento nos padrões do mercado." Nicho saturado tem formatos exaustos que o mercado já ignorou. Formatos de outros nichos capturam atenção por novidade — a mecânica funciona independente do contexto temático.

**Anti-padrão 4 — Usar criativo estático para funil VSL** [DOC] `static_vs_video_by_funnel` [01:19:58]:
> Para VSL R$297, vídeo supera estático porque cria coerência de formato com a VSL. Prospect que gostou do criativo em vídeo tende a reter na VSL pelo mesmo tipo de formato e energia. Estático ganha apenas em funis de low ticket (onde CPM baixo é prioridade).

**Anti-padrão 5 — Esconder desconforto do expert no criativo** [DOC] `expert_criativo_autonomy` [01:31:45]:
> Expert que não está confortável com o criativo performa abaixo do potencial independente da qualidade do roteiro. Priorizar formatos onde o expert se sente natural — o casamento copy + naturalidade do expert é o que faz o criativo decolar.

---

## Fase 7 — Gestão de Desvios (Error Handling)

> **Princípio:** Cada métrica tem um caminho de recuperação. "O que tá ruim não vai melhorar"
> [DOC] — mas antes de desligar, execute o protocolo de redução de orçamento.

Esta seção documenta o que fazer quando as métricas ficam abaixo dos benchmarks das Fases 1-6.

### 7.1 Desvios de VSL (Retenção)

**Play rate < 40%** [DOC] [00:57:50] — benchmark saudável é 60-70%:

> "Passou de 60% de play rate, no mínimo. Play rate é até 70 o ideal." [DOC]

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| Play rate < 40% após 72h com tráfego ativo | Problema de criativo ou segmentação (não da VSL) | 1. Auditar criativo — há alinhamento com a VSL? 2. Substituir criativo antes de tocar na VSL 3. Verificar se a página VSL carrega corretamente em mobile |
| Play rate 40-60% | Criativo fraco ou segmentação imprecisa | 1. Testar novo criativo 2. Verificar se formato do criativo conecta com formato da VSL (Fase 6.3) |

**Retenção no 1o minuto < 40%** [DOC] [00:56:57]:

> "Se você tem uma VSL que você perdeu 60% no primeiro minuto e acontece, acabou a VSL.
> Ela pode ser maravilhosa depois e ela tá morta."

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| Retenção minuto 1 < 40% | Lead morta | 1. Iniciar produção de nova lead IMEDIATAMENTE 2. Enquanto nova lead não fica pronta: testar trocar micro vídeo de lead por melhor criativo de ads (hack da Fase 4.6) 3. Nunca esperar "a VSL melhorar sozinha" |
| Retenção minuto 1 40-60% | Lead fraca | Testar nova lead (mínimo 3 leads — Fase 4.2) |

**Retenção no pitch < 30%** [DOC] `vsl_retention.benchmarks`:

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| Retenção no pitch < 30% | Problema de formato ou copy do corpo da VSL | 1. Aplicar matriz de diagnóstico (Fase 4.5) 2. Retenção baixa + conversão OK → mudar formato, manter copy 3. Retenção alta + conversão baixa → mudar copy, manter formato 4. Ambos baixos → nova VSL |

---

### 7.2 Desvios de Checkout e Conversão

**Conversão de checkout < 10%** [DOC] [01:47:36] — threshold "baixo" explícito na fonte:

> "Eu considero 10% baixo, tá? Considero baixo. Considero uma boa conversão de checkout
> de 20 para cima." [DOC] [01:47:36]

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| Checkout < 10% após 50+ checkouts | Atrito no checkout ou problema de oferta | 1. Verificar se checkout está limpo (sem banners, sem order bumps acumulados) 2. Verificar se preço está visível na página de vendas antes do checkout 3. Remover order bumps existentes e medir por 7 dias limpos 4. Verificar clareza da oferta na página abaixo do vídeo |
| Checkout 10-20% | Aceitável mas otimizável | Documentar como baseline. Testar elementos da página (depoimentos, prova, CTA positioning) |

**Custo de checkout acima do ideal (>20% do ticket front)** [DOC] [01:43:54]:

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| Custo de checkout > R$60 para front de R$297 (>20% do ticket) | Criativo não está qualificando bem, ou nicho tem CPM alto | 1. Auditar criativos — custo de checkout ruim nos primeiros 2 dias = não vai melhorar [DOC] 2. Não aguardar "otimização" da Meta — desligar e testar novo criativo 3. Se padrão se repete com múltiplos criativos: revisar qualificação do nicho (Fase 1) |

---

### 7.3 Desvios de CPA e Escala

**CPA próximo ou acima do ticket médio do funil** [DOC] `limite_custo_segredo` [02:18:19]:

> "Escale baseado em TICKET MÉDIO DO FUNIL, não em CPA."
> Para ROAS 2 com front de R$297: CPA máx baseado no front = R$130 (não escala).
> CPA máx baseado no ticket médio de R$418 = R$210 (escala). [DOC]

| Gatilho | Diagnóstico | Ação |
|---------|-------------|------|
| CPA acima do ticket médio do funil (>R$418) após 7 dias | Funil negativo — insustentável | 1. Aplicar Modelo 731 (Fase 5.2) 2. Reduzir orçamento 50-70% antes de desligar [DOC] 3. Se não recuperar após redução: pausar campanha, auditar funil completo |
| CPA entre ticket front e ticket médio (R$297–R$418) | Zona de atenção | Monitorar com Modelo 731. Verificar se upsell está convertendo. Funil pode ser lucrativo se upsell estiver saudável. |

**Campanha para de performar — protocolo antes de desligar** [DOC] [02:35:22]:

> "Quando uma campanha ou um criativo para de performar, que que 99% do mercado faz?
> Ele desliga. Só que tem algo que você pode fazer antes disso."

1. Verificar pelo Modelo 731: os últimos 7 dias são bons mas os últimos 3 e hoje são ruins.
2. Reduzir orçamento da campanha em 50-70%.
3. Aguardar 24-48h para verificar recuperação.
4. Recuperou → voltar a subir 20%/dia.
5. Não recuperou → desligar. "Não voltou a performar, rapa fora." [DOC] [02:36:29]

---

### 7.4 Regras de Decisão Rápida

[DOC] Consolidado das fontes `modelo_731` + `before_killing` + [02:20:02] + [02:19:54]:

| Situação | Regra | Fonte |
|----------|-------|-------|
| Criativo começou ruim e continua ruim após 2 dias | Não aguardar. Desligar. "O que tá ruim não vai melhorar." | [DOC] [02:19:54] |
| Campanha escalada começa a cair | Reduzir 50-70% antes de desligar — pode se recuperar | [DOC] [02:35:22] |
| ROAS bom nos últimos 7 dias, ruim nos últimos 3 e hoje | Desligar pelo Modelo 731 | [DOC] [02:33:44] |
| ROAS bom nos últimos 7 dias, ruim nos últimos 3, mas OK hoje | Manter, monitorar amanhã | [DOC] [02:33:44] |
| Play rate OK, retenção OK, checkout não converte | Ajustar página de vendas (elementos sob o vídeo) | [DOC] [00:58:20] |

---

## Glossário

Definições baseadas no uso explícito pelo praticante na fonte — não definições genéricas de mercado.

**Público frio** [DOC] [00:12:21]:
> "Para mim, público frio é a pessoa que não tem na mente dela a tua oferta."
Inclui pessoas que foram impactadas por um anúncio mas não lembraram do produto. Funcionalmente corresponde a Level 1 de awareness de Schwartz. Não é necessariamente alguém que nunca ouviu falar do nicho.

**Custo de checkout** [DOC] [01:43:54]:
O custo para levar uma pessoa até a página de checkout (initiate checkout event). Declarado pelo praticante como "a métrica mais importante do tráfego pago" para funis de VSL e low ticket — superior ao ROAS como indicador antecedente de performance. Benchmark: 10-20% do ticket front (R$29-30 para front de R$297).

**Ticket médio do funil** [DOC] `vsl_funnel.ticket_medio`:
O valor médio recebido por comprador quando se considera não apenas o produto de front (R$297) mas o conjunto do funil incluindo upsell e downsell. Com upsell convertendo 15%, o ticket médio passa de R$297 para ~R$418. Usado para calcular o cost cap correto em escala — nunca o ticket do front isolado.

**Modelo 731** [DOC] [02:33:44]:
Framework de decisão de otimização de tráfego baseado em três janelas temporais simultâneas: 7 dias (tendência geral), 3 dias (tendência recente) e hoje (decisão final). O dia de hoje é o desempate. Declarado pelo praticante como sua metodologia de otimização há "muitos anos".

**Lead da VSL** [DOC] [00:56:37]:
O primeiro minuto da VSL — não a história inicial completa (que pode durar 4 minutos). Definição do praticante: "Para mim, o primeiro minuto é a parte mais dramática da VSL." É onde ocorre a maior taxa de abandono (30-40% de perda é normal; >60% de perda = lead morta).

**Funil de recuperação de upsell** [DOC] [02:46:41]:
Sistema de webinário (ao vivo ou gravado) acionado para compradores do front que não compraram o upsell. Segmentação obrigatória: compradores sem upsell recebem webinário de recuperação de upsell; compradores com upsell recebem webinário de ascensão para próximo produto. Documentado como dobrando a conversão efetiva de upsell de 15% para ~30%.

**Ascensão** [DOC] `vsl_funnel.ascension`:
Sequência de produtos de valor crescente oferecidos ao cliente após o front. A declaração do praticante: "O dinheiro está no front, mas a ESCALA nunca esteve no front." A ascensão é onde está o lucro real — front serve para converter prospectos em clientes, não para lucrar.

**Play rate** [DOC] [00:57:50]:
Percentual de visitantes da página VSL que clicam no play e assistem ao vídeo. Benchmark saudável: 60-70%+. Play rate < 40% indica problema de criativo ou segmentação — não da VSL em si.

**Funil de autoridade vs. funil de conversão de público frio** [DOC] [00:07:04]:
Os dois arquétipos-pai de funis no mercado de infoprodutos. Funil de autoridade: prospect compra o expert (lançamentos tradicionais). Funil de conversão de público frio: sistema rastreado e intencional que converte quem não conhece o expert — independe de audiência orgânica.

---

## Tabela de Resumo de Confiança

| Elemento | Confiança | Fonte | Verificação necessária? |
|----------|-----------|-------|------------------------|
| Dois arquétipos de funil | [DOC] | [00:07:04] | Não |
| Dimensionamento de nicho (tabela) | [DOC] | `funnel_taxonomy` | Não |
| R$297 como ticket de ouro | [DOC] | Múltiplas fontes — 200M+ tráfego | Não |
| 60-80% cartão a R$297 | [DOC] | [00:47:01] | Não |
| Ticket médio R$418 com funil | [DOC] | Confirmado com 200M+ | Não |
| Upsell R$597-697 | [DOC] | `vsl_funnel.upsell` | Não |
| Downsell ~R$397 | [DOC] | `funnel_health_metrics.downsell` | Não |
| Order bump: mínimo 30% de conversão | [DOC] | [01:48:44] | Não |
| Order bump: máximo 3 bumps | [DOC] | `funnel_health_metrics.order_bump` | Não |
| Mudança de formato no upsell | [DOC] | Crédito: Rafa Marques | Não |
| Botão "não quero" visível | [DOC] | `vsl_funnel.upsell` | Não |
| Script do downsell | [DOC] | `funnel_health_metrics.downsell` | Não |
| Funil de recuperação → 1M+/mês | [DOC] | "14 meses rodando" [02:46:41] | Contexto do case não especificado |
| VSL 20-30 minutos | [DOC] | `vsl_sizing` | Não |
| Mínimo 5 micro vídeos | [DOC] | `vsl_retention.recording_rules` | Não |
| Mínimo 3 leads por VSL | [DOC] | [01:09:42] | Não |
| Play rate >60% | [DOC] | [00:57:50] | Não |
| Retenção 1o min >60% | [DOC] | `vsl_sizing` | Não |
| Retenção no pitch >30% | [DOC] | `vsl_retention.benchmarks` | Não |
| Lead morta = >60% perda no 1o min | [DOC] | [00:56:57] | Não |
| Formato > copy para retenção | [DOC] | `vsl_retention.what_increases_retention` | Não |
| Case Prisciane: 2X conversão só de formato | [DOC] | [00:54:42] | Não |
| Custo checkout = 10-20% do ticket | [DOC] | [01:43:54] | Não |
| Modelo 731 | [DOC] | [02:33:44] | Não |
| Reduzir 50-70% antes de desligar | [DOC] | [02:35:22] | Não |
| "O que tá ruim não vai melhorar" | [DOC] | [02:19:54] | Não |
| Significância estatística: mínimo 10 vendas | [DOC] | `traffic_phases.fase_3` | Não |
| Segmentação 100% via criativo (broad) | [DOC] | `traffic_phases` + `creative_strategy_extended` | Nota: contexto set/2025 |
| Vídeo > estático para VSL | [DOC] | `static_vs_video_by_funnel` | Não |
| 70/30 regra de criativos | [DOC] | `creative_mix_rule` | Não |
| Checkout limpo como base | [DOC] | [01:47:36] | Não |
| CTA no topo = violação | [DOC] | `brasil_paralelo` + [02:52:21] | Não |
| Cost cap pelo ticket médio | [DOC] | [02:18:19] | Não |
| Conversão de checkout: base 20%+ | [DOC] | `funnel_health_metrics.checkout` | Não |
| Upsell conversão alvo: 15% | [DOC] | `funnel_health_metrics.upsell` | Não |
| Downsell conversão alvo: 5-10% | [DOC] | `funnel_health_metrics.downsell` | Não |
| Máximo 20% de aumento de orçamento/dia | [DOC] | `regra_20_percent` | Nota: contexto set/2025 |
| Fórmula cartão × upsell → ticket médio | [REP] | `pix_cartao_matematica_escala` | Cálculo derivado pelo analista — verificar contra dados reais |
| Jornada de awareness dentro da VSL (tabela Schwartz) | [INF] | `schwartz_analysis` | Inferência do analista de copy — não afirmada diretamente por @thiagoroas |
| Awareness do criativo → tipo de lead necessário | [INF] | `creative_as_awareness_filter` | Inferência do analista — verificar na prática |
| Orçamento mínimo de teste R$5-10k | [INF] | Derivado da matemática de validação | [GAP — needs practitioner verification] |

**Adições v0.4.0 (Hotmart Cast + Kiwicast #213):**

| Elemento | Confiança | Fonte | Verificação necessária? |
|----------|-----------|-------|------------------------|
| Lei do custo crescente de tráfego | [DOC] | HC [~30:00-35:00] | Não — premissa estrutural |
| Oferta (conversão) vs produto (LTV) | [DOC] | KC213 [~55:00] | Não |
| Framework: ticket alto vs. volume | [DOC] | HC [~20:00] | Não |
| Big nicho "nunca morre" | [DOC] | KC213 [~55:00] | Não |
| Pequeno nicho: perpétuo como 1o degrau | [DOC] | KC213 [~55:00] | Não |
| R$100k/mês qualquer nicho vs R$100k/dia apenas big nicho | [DOC] | HC [~20:00] | Não |
| R$1.500 categoricamente incompatível com público frio | [DOC] | HC [~0:00] | Não |
| R$500+ inviável para não-celebridades em público frio | [DOC] | KC213 [~1:10:00] | Não |
| Configuração base: Front R$297 + Upsell R$500-600 | [DOC] | HC [~10:00-12:00] | Ticket médio resultante é estimado, não declarado explicitamente |
| Design upsell-first ("começa de trás para frente") | [DOC] | HC [~10:00-12:00] | Não |
| Nenhum projeto escala só com front | [DOC] | HC [~10:00-12:00] | Não |
| Threshold de ticket para posição do botão (R$37) | [DOC] | KC213 [~30:00] | Não |
| Caso CTA no topo dobrou conversão ao ser movido | [DOC] | HC [~25:00-30:00] | Contexto de empresa não identificado |
| Headlines de upsell: "Falta um passo" / "proposta recusável" / "finalizar inscrição" | [DOC] | KC213 [~1:15:00] | Não |
| Upsell em vídeo: alta taxa de visualização porque comprador está quente | [DOC] | KC213 [~1:15:00] | Não |
| UX botão "não quero": visível de tamanho médio para não perder downsell | [DOC] | HC [~12:00-15:00] | Não |
| Mecanismo: order bump confunde e derruba conversão | [DOC] | KC213 [~1:15:00] | Não |
| Criativo = 80-20 do tráfego | [DOC] | HC [~15:00] | Não |
| Criativo como início do processo de venda (não veículo de clique) | [DOC] | HC [~15:00] | Não |
| Inteligência Meta vive no ad set — 10-20%/dia máximo | [DOC] | KC213 [~40:00] | Não |
| Perpétuo mal encaixado mata lançamento (2 modos de falha) | [DOC] | KC213 [~50:00] | Não |
| Perpétuo saudável = transformação rápida + desejo pelo próximo | [DOC] | KC213 [~55:00] | Não |
| OCU obrigatório no upsell | [REP] | KC213 [~1:15:00] | Era [INF], corroborado explicitamente |
| Anti-padrão: nicho requer awareness prévia → universo pequeno | [REP] | HC [~20:00] | Era [INF], corroborado por evidência de dor latente (gastronomia) |

---

## GAPs e Verificações Necessárias

Os itens abaixo não estão documentados na fonte ou têm confiança abaixo de [DOC].
Devem ser preenchidos antes de uso em produção como decisão de arquitetura.

**Responsável por todos os GAPs abaixo: Copy Chief**
**Data alvo de resolução: 2026-06-11**

| GAP | Detalhe | Prioridade | Owner | Target | Status |
|-----|---------|------------|-------|--------|--------|
| Ticket de upsell fora do BRL | Todo dado é em R$. Relação de proporção upsell/front (2x o front) é [INF] | Alta | Copy Chief | 2026-06-11 | Aberto |
| Fórmula exata de dimensionamento de nicho | "10M+" é orientativo — não há método documentado para contar o universo | Média | Copy Chief | 2026-06-11 | Aberto |
| Downsell com produto diferente vs. mesmo produto | A fonte documenta "mesmo produto com menos acesso". Usar produto diferente não foi coberto. | Média | Copy Chief | 2026-06-11 | Aberto |
| Upsell agendamento (para produtos >R$2k) | Mencionado brevemente mas sem protocolo completo | Baixa | Copy Chief | 2026-06-11 | Aberto |
| Especificações de VSL para ticket diferente de R$297 | Todos os benchmarks são para R$297. Outros tickets não documentados. | Alta se fora do range | Copy Chief | 2026-06-11 | Aberto |
| Frequência de novos criativos em escala | "1 por semana até validar, depois para" — o que fazer após encontrar a vencedora em termos de criativos novos não é completamente especificado | Média | Copy Chief | 2026-06-11 | Aberto |
| Critério exato de "dias ruins" a excluir na fase de validação | Mencionado mas não especificado (fim de semana em alguns nichos) | Baixa | Copy Chief | 2026-06-11 | Aberto |
| Benchmarks de conversão fora do Brasil | Todo o contexto é mercado BR. Mercados com comportamentos de pagamento diferentes podem alterar premissas de PIX/cartão | Alta se aplicar fora do BR | Copy Chief | 2026-06-11 | Aberto |
| Número ideal de micro vídeos acima de 5 | "Mínimo 5" — não há limite superior documentado | Baixa | Copy Chief | 2026-06-11 | Aberto |
| Orçamento mínimo de teste | Não especificado explicitamente. R$5-10k é inferência — verificar com praticante | Alta | Copy Chief | 2026-06-11 | Aberto |

**GAPs adicionados em v0.4.0:**

| GAP | Detalhe | Prioridade | Owner | Target | Status |
|-----|---------|------------|-------|--------|--------|
| Ticket médio resultante de Front R$297 + Upsell R$500-600 | HC afirma "ticket de mil" como alvo e "R$300-400" como real — o valor de R$300-400 é estimado pelo analista a partir da matemática de conversão, não declarado explicitamente [GAP-HC-02] | Alta | Copy Chief | 2026-06-11 | Aberto |
| Protocolo operacional de design de perpétuo saudável | KC213 descreve o princípio (transformação rápida → desejo pelo próximo), mas não o processo de design do produto em si | Média | Copy Chief | 2026-06-11 | Aberto |
| Critérios específicos de quando celebridade pode usar regras diferentes | "Celebridade no nicho" é usada como exceção mas sem critério quantitativo (número de seguidores, volume de autoridade) | Baixa | Copy Chief | 2026-06-11 | Aberto |

---

## Fontes

| ID | Título | Formato | Duração | Expert | Ano |
|----|--------|---------|---------|--------|-----|
| SE122 | Segredos da Escala #122 (host: João Campos/Beturb) | Podcast | 3h01m | Thiago Roas | Set/2025 |
| PALESTRA | Palestra ao vivo (data exata não confirmada) | Slides + apresentação | — | Thiago Roas | ~2025 |
| HC | Hotmart Cast — "Como Criar FUNIL DE VENDAS EFICIENTE para PÚBLICO FRIO" (RENU3kEns0E) | Entrevista em podcast | ~40min | Thiago Roas | ~2025/2026 |
| KC213 | Kiwicast #213 — "Ele Fez Mais De R$7 Milhões No Digital Como Gestor De Tráfego" (hnw1pGcc3_A) | Entrevista em podcast | ~1h25min | Thiago Roas | ~2025/2026 |

**Extração e análise de HC e KC213:**
- Extração HC: `outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md`
- Extração KC213: `outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md`
- Transcrições originais: `outputs/etl/thiago-roas-interviews/`

---

## Histórico de Revisões

| Versão | Data | Autor | Alterações |
|--------|------|-------|-----------|
| 0.1.0-draft | 2026-03-11 | Ohno (sop-extractor) | Extração inicial de @thiagoroas — palestra ao vivo e podcast Segredos da Escala #122 |
| 0.2.0 | 2026-03-11 | SOP Creator (pop-criador) | Remediação estrutural baseada em Audit AUDIT-2026-001 (Crosby, score 64, CONDITIONAL). Adicionado: document control block no YAML (F-01, F-08, F-11), seção de Pré-Requisitos (F-03), Fase 7 de Gestão de Desvios com evidência da fonte (F-02), critérios de saída por fase (F-05), owners e datas para GAPs (F-07), Glossário com definições baseadas na fonte (F-20), campos location/feedback (F-04/F-10/F-14), referência SOP-COPY-VSL-ARCH-001 (F-13), histórico de revisões (F-01). |
| 0.3.0 | 2026-03-11 | SOP Creator (pop-criador) | Remediação de qualidade baseada em re-audit (score 81, APPROVED → alvo CERTIFIED 90+). RF-01: adicionadas seções de anti-padrão em Fase 5 (5.7) e Fase 6 (6.7) com evidência da fonte. RF-02: approver corrigido para independência do owner, nota ISO 9001:2015 Clause 7.5.2(c) adicionada. RF-03: campo training_requirements adicionado ao YAML. RF-04: stub IDs SOP-COPY-LT-001 e SOP-COPY-LANC-001 adicionados nas referências adjacentes. RF-05: período mínimo de histórico de checkout [INF] adicionado nos pré-requisitos. F-15: seção 5.6 de cadência de monitoramento operacional adicionada. F-16: callouts de aplicação prática adicionados a todas as fases. F-18: callouts "Risco de pular" adicionados a todas as fases. Propósito: seção dedicada extraída do scope para bloco próprio. Índice atualizado. |
| 0.4.0 | 2026-03-12 | SOP Creator (pop-criador) | Enriquecimento com evidências de 2 novas fontes: Hotmart Cast (HC) e Kiwicast #213 (KC213). APPEND-ONLY — nenhum conteúdo existente removido. Adições: (1) Premissa estrutural: lei do custo crescente + distinção oferta vs produto. (2) Fase 1: framework ticket alto vs volume, distinção R$100k/mês (qualquer nicho) vs R$100k/dia (big nicho), big nicho nunca morre, pequeno nicho como 1o degrau, corroboração de dor latente como escalável. (3) Fase 2: teto R$1.500 incompatível com público frio, teto R$500+ para não-celebridades, configuração base Front R$297 + Upsell R$500-600. (4) Fase 3: princípio upsell-first (design de trás para frente), threshold de ticket R$37 para posição de botão, caso dobrou conversão ao mover CTA, headlines de upsell validadas, warm buyer psychology para vídeo de upsell, UX botão de recusa, mecanismo de confusão do order bump, seção 3.8 coexistência perpétuo × lançamento (2 modos de falha + design saudável). (5) Fase 6: peso 80-20 do criativo, reframing criativo como início de venda, inteligência Meta no ad set + regra 10-20%/dia. (6) Upgrades de confiança: [INF] → [REP] em OCU e anti-padrão de dor articulada. (7) Seção de Fontes adicionada. (8) Tabela de resumo de confiança expandida. (9) GAPs: 3 novos adicionados, coluna Status adicionada. |

---

*Arquivo: `squads/copy/data/sops/vsl-funnel-architecture-sop.md`*
*SOP ID: SOP-COPY-VSL-ARCH-001*
*Versão: 0.4.0 — DRAFT-ENRICHED*
*Gerado: 2026-03-11 | Remediado (v0.2.0): 2026-03-11 | Remediado (v0.3.0): 2026-03-11 | Enriquecido (v0.4.0): 2026-03-12*
*Extrator: Ohno (sop-extractor) | Auditor: Crosby (pop-auditor) | Remediador/Enriquecedor: SOP Creator*
*Status: DRAFT-ENRICHED — pronto para re-audit. Não usar como referência final sem re-audit.*
*Próximo review: 2027-03-11*
