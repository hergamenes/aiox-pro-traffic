---
sop_id: SOP-COPY-VSL-MODEL-001
process_id: vsl-model-selection
title: "Seleção de Modelo de Funil: Quando Usar VSL, Página Escrita ou Lançamento"
version: "0.1.0"
status: DRAFT
level: STRATEGIC
source: "EXTRACTED FROM @thiagoroas (Thiago Roas)"
source_material:
  - "Hotmart Cast — 'Como Criar FUNIL DE VENDAS EFICIENTE para PÚBLICO FRIO | Thiago Roas' (Video ID: RENU3kEns0E, ~40 min)"
  - "Kiwicast #213 — 'Ele Fez Mais De R$7 Milhões No Digital Como Gestor De Tráfego' (Video ID: hnw1pGcc3_A, ~1h25min)"
  - "Extração Hotmart Cast: outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md"
  - "Extração Kiwicast #213: outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md"
track_record_source: "200M+ gastos em tráfego, 8 nichos escalados (3 acima de 200k/dia, 5 acima de 100k/dia)"
owner: "Copy Chief"
approver: "Squad Chief (independent of document owner — per ISO 9001:2015 Clause 7.5.2(c))"
effective_date: "2026-03-12"
review_date: "2027-03-12"
next_review_date: "2027-03-12"
review_frequency: "Annual + on market change"
executor: ["Copy Chief", "Strategist", "Funnel Architect"]
classification: Internal
squad_agnostic: true
notes: >
  Este SOP é genérico — não contém dados de nenhum business específico.
  É um framework de decisão aplicável a qualquer operação de infoproduto que
  avalia qual modelo de funil adotar antes de construir qualquer copy.
reviewed_by:
  - "SOP Creator (Gerber) — criação v0.1.0, 2026-03-12"
---

> **DRAFT — EXTRAÍDO DE @thiagoroas**
> Este documento foi extraído de material de referência externa. Cada afirmação carrega marcador de
> confiança. Antes de uso em produção, verificar itens sinalizados com [INF] e preencher GAPs.
> Versão 0.1.0: criação inicial com base nas extrações Hotmart Cast e Kiwicast #213.

---

## Legenda de Confiança

| Marcador | Nível | Fonte |
|----------|-------|-------|
| [DOC] | 1.0 — Documentado diretamente | Declaração explícita de Thiago Roas nas entrevistas |
| [REP] | 0.8 — Reportado / corroborado | Afirmado pelo praticante, consistente entre as duas fontes |
| [INF] | 0.5 — Inferido de evidência | Deduzido de dados parciais ou evidência indireta |
| [ASM] | 0.3 — Assumido | Pressuposto razoável, não declarado explicitamente |
| [GAP] | — | Informação não encontrada nas fontes disponíveis |

**Abreviações de fonte:**
- **HC** = Hotmart Cast (Video RENU3kEns0E, ~40 min, 2026)
- **KC213** = Kiwicast #213 (Video hnw1pGcc3_A, ~1h25min, 2026)

---

## Índice

1. [Propósito](#1-propósito)
2. [Escopo](#2-escopo)
3. [Definições e Abreviações](#3-definições-e-abreviações)
4. [Papéis e Responsabilidades](#4-papéis-e-responsabilidades)
5. [Pré-Requisitos](#5-pré-requisitos)
6. [Procedimento](#6-procedimento)
   - [Fase 1 — Qualificação de Modelo: Árvore de Decisão](#fase-1--qualificação-de-modelo-árvore-de-decisão)
   - [Fase 2 — Seleção de Formato: VSL, Página Escrita ou Híbrido](#fase-2--seleção-de-formato-vsl-página-escrita-ou-híbrido)
   - [Fase 3 — Integração Perpétuo × Lançamento](#fase-3--integração-perpétuo--lançamento)
   - [Fase 4 — Monetização de Base Existente](#fase-4--monetização-de-base-existente)
7. [Tratamento de Erros e Resolução de Problemas](#7-tratamento-de-erros-e-resolução-de-problemas)
8. [Controles de Qualidade e Métricas](#8-controles-de-qualidade-e-métricas)
9. [Referências e Documentos Relacionados](#9-referências-e-documentos-relacionados)
10. [GAPs e Itens para Verificação](#10-gaps-e-itens-para-verificação)
11. [Histórico de Revisões](#11-histórico-de-revisões)

---

## 1. Propósito

Este SOP estabelece o framework de decisão que deve ser aplicado **antes** de qualquer escolha de modelo de funil, formato de página de vendas ou estratégia de monetização. Seu objetivo é evitar o erro mais caro e irreversível em operações de infoproduto: construir o funil errado para o contexto errado.

A escolha do modelo — perpétuo VSL, página escrita, lançamento, high ticket ou combinações — determina o teto de escala, a viabilidade matemática da operação e a compatibilidade com a base de clientes existente. Uma vez que tráfego e copy são produzidos para um modelo inadequado, o custo de pivô é integral.

Este SOP responde a quatro perguntas em sequência:

1. Qual modelo de funil se aplica a este nicho, ticket e contexto?
2. Qual formato de página — VSL, escrita ou híbrido — maximiza a conversão?
3. Como integrar perpétuo e lançamento sem que um destrua o outro?
4. Como monetizar a base de clientes existente sem depender de tráfego novo?

> "A primeira coisa é entender qual potencial maior do seu nicho. É vender ticket alto ou vender para muita gente." — Thiago Roas [DOC — HC ~20:00]

> "99% estratégia, 1% apertar botão. Apertar botão é a parte mais fácil do processo." — Thiago Roas [DOC — HC ~10:00]

---

## 2. Escopo

### Em Escopo

- Decisão de modelo de funil (perpétuo de público frio, lançamento, high ticket, combinações)
- Decisão de formato de página de vendas (VSL, página escrita, híbrido)
- Decisão de estrutura perpétuo × lançamento em operações com produto duplo
- Estratégia de monetização de base de alunos existente (sem tráfego novo)
- Qualificação de nicho para aplicação do modelo perpétuo VSL

### Fora de Escopo

- Execução de copy (coberta por SOP-COPY-VSL-SCRIPT-001)
- Arquitetura detalhada do funil perpétuo (coberta por SOP-COPY-VSL-ARCH-001)
- Diagnóstico e otimização de funil em operação (coberto por SOP-COPY-VSL-DIAG-001)
- Gestão de tráfego operacional e estrutura de campanhas
- Configuração de plataformas de pagamento

### Aplicabilidade

Este SOP se aplica a:

- Operadores avaliando o primeiro modelo de funil a ser construído
- Operadores com lançamento ativo considerando adicionar um perpétuo
- Operadores com perpétuo ativo considerando integrar um lançamento
- Estrategistas revisando o modelo antes de uma nova fase de escala

---

## 3. Definições e Abreviações

| Termo | Definição |
|-------|-----------|
| **Árvore de Decisão** | Diagrama de perguntas binárias que conduz à escolha do modelo de funil correto |
| **Big Nicho** | Nicho com universo de potencial de compradores acima de 10 milhões de pessoas. Exemplos: saúde, finanças, relacionamento, desenvolvimento pessoal, gastronomia |
| **CTA** | Call to Action — botão ou elemento de ação que leva ao checkout |
| **Dor Articulada** | Dor que o prospect já reconhece e busca ativamente resolver (ex: "preciso emagrecer") |
| **Dor Latente** | Dor que o prospect sente mas não articula explicitamente como urgente (ex: "poderia cozinhar melhor") |
| **Formato Híbrido** | Página de vendas que combina vídeo curto + copy escrita longa |
| **Front** | Produto principal ofertado diretamente ao público frio, com menor ticket |
| **High Ticket** | Produto ou serviço com ticket acima de R$1.500, geralmente vendido via processo de vendas consultivo |
| **Lançamento** | Evento estruturado de vendas com janela de carrinho fechado, geralmente usando sequência de conteúdo pré-lançamento + webinar |
| **Mini-Lançamento** | Evento simplificado de vendas para base de clientes existente, sem tráfego novo. Formato: captura → grupo WhatsApp/email → aula ao vivo → oferta |
| **Modelo Americano** | Estratégia de funil que opera com prejuízo proposital no front-end, compensado por backend de alto ticket |
| **Modelo Brasileiro** | Estratégia de funil que exige lucro no front-end, com backend como multiplicador de margem |
| **Nicho White** | Nicho cujo produto e copy são completamente compatíveis com os Termos de Serviço de anunciantes (Meta, Google). Sem claims de saúde não comprovados, sem promessas financeiras garantidas, sem conteúdo sensível |
| **OCU** | One-Click Upsell — tecnologia que permite ao comprador adicionar o upsell com um clique, sem redigitar dados de pagamento |
| **Página Escrita** | Página de vendas sem vídeo, baseada exclusivamente em copy textual e elementos visuais estáticos |
| **Perpétuo** | Funil de vendas que opera de forma contínua, 24h/dia, com tráfego pago para público frio, sem depender de eventos ou janelas de carrinho |
| **Pitch** | Momento do VSL em que a oferta é apresentada (preço, bônus, garantia, CTA) |
| **Redline** | Headline principal no topo da página de vendas — a primeira promessa que o visitante lê |
| **Sub-Nicho** | Segmento específico dentro de um nicho, com universo de compradores abaixo de 1 milhão de pessoas (ex: "tráfego para dentistas") |
| **Ticket de Ouro** | Faixa de preço de R$297 validada para escala em público frio por múltiplos projetos de 7 dígitos/mês |
| **Ticket Médio** | Valor médio pago por comprador, calculado sobre front + conversão proporcional de upsell e downsell |
| **Upsell** | Oferta adicional de maior valor apresentada imediatamente após a compra do front, antes do acesso ao produto |
| **VSL** | Video Sales Letter — carta de vendas em formato de vídeo, principal formato do perpétuo para público frio |

---

## 4. Papéis e Responsabilidades

| Papel | Responsável (R) | Aprovador (A) | Consultado (C) | Informado (I) |
|-------|-----------------|---------------|----------------|---------------|
| Execução da Fase 1 — Qualificação de Modelo | Copy Chief / Strategist | — | Funnel Architect | Produtor do Conteúdo |
| Execução da Fase 2 — Seleção de Formato | Copy Chief | Funnel Architect | Produtor do Conteúdo | — |
| Execução da Fase 3 — Integração Perpétuo × Lançamento | Funnel Architect | Copy Chief | Gestor de Tráfego | Produtor do Conteúdo |
| Execução da Fase 4 — Monetização de Base | Copy Chief / Strategist | Funnel Architect | — | Gestor de Tráfego |
| Aprovação do Modelo Final | Funnel Architect | Squad Chief | — | Toda a Equipe |
| Escalação em caso de dúvida de modelo | Copy Chief | Squad Chief | Funnel Architect | — |

**Nota:** Um único profissional pode acumular múltiplos papéis nesta tabela se possuir as competências necessárias (ver Pré-Requisitos).

---

## 5. Pré-Requisitos

### 5.1 Competências Requeridas

O executor deve ser capaz de:

- Interpretar métricas de funil (custo de checkout, taxa de conversão, ticket médio)
- Dimensionar o universo de um nicho (avaliar se é "big" ou "sub")
- Distinguir dor latente de dor articulada em um mercado
- Identificar se o produtor tem ou não tem status de celebridade no nicho

### 5.2 Dados de Entrada Necessários

Antes de iniciar a Fase 1, o executor deve ter em mãos:

- [ ] Nicho e sub-nicho do produto
- [ ] Ticket pretendido para o front
- [ ] Ticket pretendido para upsell (se houver)
- [ ] Perfil de autoridade do produtor no nicho (desconhecido, conhecido, celebridade)
- [ ] Existência ou não de produto em lançamento ativo
- [ ] Existência ou não de base de clientes (alunos que já compraram)
- [ ] Plataforma de anúncios preferencial (Meta, Google, ambos)

### 5.3 Documentos Predecessores

- Leitura recomendada (não obrigatória): SOP-COPY-VSL-ARCH-001, Fase 1 — Qualificação de Nicho
- Este SOP é o **ponto de entrada** — não pressupõe nenhum SOP anterior como pré-requisito obrigatório

### 5.4 Condição de Entrada

[CRITICAL] Nenhuma copy, nenhum roteiro de VSL e nenhum criativo deve ser produzido antes que este SOP seja concluído. A produção de copy para o modelo errado representa custo total a ser descartado.

---

## 6. Procedimento

---

### DIAGRAMA DE DECISÃO — RESUMO EXECUTIVO

```
┌─────────────────────────────────────────────────────────────────────┐
│           ÁRV0RE DE DECISÃO DE MODELO DE FUNIL                      │
│                    (Fase 1 — Resumo Visual)                         │
└─────────────────────────────────────────────────────────────────────┘

NICHO WHITE?
├── NÃO ──► FORA DO ESCOPO (risco de conta de anúncios)
│
└── SIM
    │
    TICKET PRETENDIDO?
    ├── R$1.500+ ──► LANÇAMENTO ou MENTORIA HIGH TICKET
    │                (Perpétuo de público frio é categoricamente
    │                 inviável nesta faixa) [DOC — HC ~0:00]
    │
    ├── R$500-R$1.499 ──► DECISÃO BIFURCADA
    │   │
    │   AUTORIDADE DO PRODUTOR?
    │   ├── Celebridade no nicho ──► Perpétuo VSL pode funcionar
    │   │                            (caso fora da curva) [DOC — KC213 ~55:00]
    │   └── Não-celebridade ──► Lançamento ou mentoria recomendados
    │
    └── R$297-R$497 ──► DIMENSIONAMENTO DO NICHO
        │
        BIG NICHO? (>10M potencial de compradores)
        ├── SIM ──► PERPÉTUO VSL — Escala total
        │          (R$100k/mês: qualquer nicho)
        │          (R$100k/dia: somente big nicho) [DOC — HC ~20:00]
        │
        └── NÃO (Sub-Nicho)
            │
            OBJETIVO?
            ├── Escala de público frio ──► PERPÉTUO como
            │                              primeiro degrau
            │                              + HIGH TICKET backend
            │                              [DOC — HC ~20:00]
            └── Topo de funil ──► PERPÉTUO com teto consciente
                                   (R$100k/mês é o teto realista)
                                   [DOC — HC ~20:00]
```

---

### Fase 1 — Qualificação de Modelo: Árvore de Decisão

**Objetivo:** Determinar qual modelo de funil se aplica ao contexto antes de qualquer produção.

---

#### 6.1.1 Verificar Qualificação White

[CRITICAL] Confirme que o nicho e o produto são compatíveis com os Termos de Serviço de anunciantes Meta e Google.

**Critérios de reprovação automática:**
- Claims de saúde não comprovados cientificamente
- Promessas de retorno financeiro garantido
- Conteúdo de nichos sensíveis (armas, apostas, conteúdo adulto, emagrecimento com claims não autorizados)

[DECISION] Se o nicho não é white: encerrar este SOP. O modelo perpétuo com tráfego pago não se aplica. [DOC — HC ~35:00]

[DECISION] Se o nicho é white: avançar para 6.1.2.

---

#### 6.1.2 Avaliar o Ticket Pretendido

Registre o ticket de front pretendido. Aplique a seguinte regra:

**Regra categórica de ticket:**

| Ticket de Front | Veredito | Evidência |
|-----------------|----------|-----------|
| R$1.500+ | INVIÁVEL para público frio | "Categoricamente, para você escalar para público frio um ticket de 1.500 reais." [DOC — HC ~0:00] |
| R$500-R$1.499 | DIFÍCIL — requer celebridade no nicho | "Acima de 500, 600 reais não é possível fazer escala e ROI positivo para o público frio se você não for uma celebridade no nicho." [DOC — KC213 ~1:10:00] |
| R$297-R$497 | VIÁVEL — ticket de ouro | "Quase todos os nossos projetos que escalam 7 dígitos/mês partem de um front de R$297." [DOC — HC ~10:00] |
| R$37-R$296 | LOW TICKET — teto matemático | "Low ticket é ótimo, mas não conheço no mercado ninguém fazendo múltiplos 7 dígitos de lucro/mês com low ticket." [DOC — HC ~20:00] |
| Abaixo de R$37 | MICRO TICKET — escala inviável | [INF] Custo de tráfego inviabiliza o volume necessário |

**Mecanismo causal do teto de low ticket:**

> "É um funil que tem teto por uma questão matemática. O tráfego não sustenta o CPM [CPA]." — Thiago Roas [DOC — HC ~20:00]

O custo de tráfego é estruturalmente crescente e nunca decresce. Um low ticket a R$97 precisa de volume 3x maior que um ticket de R$297 para gerar o mesmo faturamento — mas o CPM do público qualificado não cai proporcionalmente. O modelo matemático quebra em escala.

[DECISION] Se ticket ≥ R$1.500: modelo é lançamento ou high ticket. Encerrar este SOP. Consultar framework de lançamento.

[DECISION] Se ticket R$500-R$1.499 e produtor não é celebridade no nicho: reconsiderar ticket ou modelo. Consultar estrategista.

[DECISION] Se ticket R$297-R$497: avançar para 6.1.3.

---

#### 6.1.3 Dimensionar o Nicho

Avalie se o nicho é "big" ou "sub-nicho" com base nos critérios abaixo.

**Critérios de Big Nicho:**

| Critério | Big Nicho | Sub-Nicho |
|----------|-----------|-----------|
| Universo de potencial compradores | >10M pessoas | <1M pessoas |
| Exemplos confirmados | Saúde, finanças, relacionamento, desenvolvimento pessoal, gastronomia [DOC — KC213 ~55:00] | Tráfego pago, copywriting, nicho de nicho |
| Audiência de novos entrantes | Contínua — pessoas entram no mercado todo dia | Finita — universo saturável |
| Perpetuidade do perpétuo | "Não morre nunca" [DOC — KC213 ~55:00] | Tem prazo de vida — satura |
| Tipo de dor | Pode ser latente ou articulada | Geralmente articulada (especialistas procurando solução) |

**Nota sobre dor latente:**

> "Gastronomia não é uma dor. Ninguém acorda de manhã e fala: preciso aprender praticidade na cozinha. Mas você encaixa o funil e ele faz." — Thiago Roas [DOC — HC ~20:00]

Dor latente (não articulada, não urgente) é escalável com funil perpétuo desde que o universo seja grande. A dor não precisa ser urgente — precisa ser universal.

[DECISION] Se big nicho: avançar para 6.1.4 (confirmação de modelo perpétuo VSL).

[DECISION] Se sub-nicho: avançar para 6.1.5 (modelo alternativo para sub-nicho).

---

#### 6.1.4 Confirmar Modelo Perpétuo VSL (Big Nicho)

Se o nicho passou pelos filtros anteriores, o modelo perpétuo VSL de público frio é o indicado. Documente:

- Ticket de front: _______ (target R$297)
- Ticket de upsell: _______ (target R$500-600) [DOC — HC ~10:00-12:00]
- Ticket médio esperado: _______ (estimativa R$300-400 considerando conversão parcial de upsell)
- Teto de escala esperado:
  - Qualquer big nicho: R$100k/mês de lucro [DOC — HC ~20:00]
  - Big nicho com universo >10M: potencial de R$100k/dia

[VERIFY] Confirme: o modelo americano (prejuízo no front, recuperado no backend) foi avaliado e descartado conscientemente ou adotado? [DOC — HC ~20:00]

> "O modelo americano faz a venda do primeiro produto focado numa lógica de adquirir aquele cliente. A pessoa gastou R$100 e vendeu o produto de R$60. Ela gastou R$40 para aquela pessoa comprar." — Thiago Roas [DOC — HC ~20:00]

No contexto brasileiro, o operador padrão espera lucro no front-end. Se a unidade econômica do nicho exige que o front opere no prejuízo (como em alguns funis de aquisição), isso deve ser declarado explicitamente — não descoberto após meses de operação.

Avance para a Fase 2.

---

#### 6.1.5 Modelo Alternativo para Sub-Nicho

[DECISION] Se sub-nicho e ticket R$297: o perpétuo pode funcionar como **primeiro degrau da escada de produtos**, não como o modelo de negócio completo.

> "Se você for muito sub-nichado, você não vai escalar um perpétuo para público frio para R$100k/dia. Mas você pode fazer quanto você quiser desde que você use outras estratégias." — Thiago Roas [DOC — HC ~20:00]

Opções para sub-nicho:

| Opção | Quando Usar | Resultado Esperado |
|-------|-------------|-------------------|
| Perpétuo como entrada + high ticket backend | Sub-nicho com solução de alto valor (mentoria, consultoria) | Perpétuo qualifica leads, high ticket gera margem |
| Lançamento | Sub-nicho com audiência já construída | Pico de receita, não fluxo contínuo |
| Mentoria ou serviço | Sub-nicho de especialistas buscando resultado específico | Alto ticket, baixo volume |

[INF] A regra empírica é: se o nicho não tem público suficiente para sustentar R$100k/mês sem esgotar o universo, o perpétuo sozinho não é o modelo.

Documente o modelo escolhido e avance apenas para a Fase 2 se o perpétuo está incluído na estratégia.

---

### Fase 2 — Seleção de Formato: VSL, Página Escrita ou Híbrido

**Objetivo:** Determinar se a página de vendas deve usar VSL, copy escrita ou combinação.

---

#### 6.2.1 Questionar a Premissa do VSL

[CRITICAL] VSL não é obrigatório. Esta é a afirmação mais contraintuitiva deste SOP.

> "É mito que toda página de vendas tem que ter vídeo de vendas. Nossas melhores páginas de vendas não tinham vídeo. Faturaram milhões. Múltiplos sete dígitos. Páginas de vendas sem vídeo. Eu não estou dizendo que é melhor não ter vídeo. Estou dizendo que não é necessário em 100% dos casos." — Thiago Roas [DOC — KC213 ~45:00]

O formato de página (VSL vs escrita vs híbrido) é uma variável, não uma constante. O que determina conversão é a qualidade da oferta e da copy, não a presença do vídeo.

---

#### 6.2.2 Aplicar Critérios de Seleção de Formato

Avalie os três critérios abaixo e some os pontos:

**Critério A — Disponibilidade de produção de vídeo de qualidade:**

| Situação | Pontos para VSL | Pontos para Escrita |
|----------|-----------------|---------------------|
| Produção profissional de vídeo disponível (câmera, edição, apresentador treinado) | +2 | 0 |
| Apresentador com boa desenvoltura em câmera | +1 | 0 |
| Sem produção adequada — vídeo ficará amador | 0 | +2 |
| Nenhum apresentador disponível | 0 | +2 |

**Critério B — Nicho e ticket:**

| Situação | Pontos para VSL | Pontos para Escrita |
|----------|-----------------|---------------------|
| Nicho onde o prospect é visual (beleza, culinária, fitness) | +1 | 0 |
| Ticket acima de R$200 (requer mais convicção) | +1 | +1 |
| Nicho técnico onde prospect lê antes de comprar | 0 | +1 |

**Critério C — Velocidade de produção:**

| Situação | Pontos para VSL | Pontos para Escrita |
|----------|-----------------|---------------------|
| Urgência alta — precisa de resultados em menos de 2 semanas | 0 | +2 |
| Prazo flexível — pode produzir e regravar | +1 | 0 |

**Interpretação:**

| Total VSL | Total Escrita | Recomendação |
|-----------|---------------|--------------|
| VSL > Escrita por 2+ pontos | — | Produzir VSL como formato primário |
| Escrita > VSL por 2+ pontos | — | Produzir página escrita como formato primário |
| Diferença de 0-1 ponto | — | Formato híbrido (vídeo curto + copy longa) |

[DECISION] Registre o formato selecionado: _______________

---

#### 6.2.3 Aplicar Regras Universais de Página (Independentes do Formato)

Independente do formato escolhido (VSL, escrita ou híbrido), as seguintes regras se aplicam a todas as páginas de vendas de perpétuo:

**Regra 1 — Primeira objeção é "é golpe?"**

> "Qual a primeira objeção da pessoa que cai na sua página de vendas? Não é se o produto é bom. Não é se o produto é caro. A primeira objeção que a pessoa tem é: será que é golpe?" — Thiago Roas [DOC — KC213 ~45:00]

[CRITICAL] A página de vendas deve resolver a objeção de legitimidade ANTES de qualquer argumento de produto, benefício ou preço. Elementos que resolvem a objeção "golpe":

- Logos de plataformas reconhecidas (Hotmart, Kiwify, Eduzz)
- Número de alunos com depoimentos verificáveis
- Presença em mídia ou certificações visíveis
- Nome e rosto reais do produtor com credenciais verificáveis

**Regra 2 — Preço visível ANTES do CTA**

> "Não bota preço do produto na sua página de vendas? Isso leva curiosos para o checkout. Pessoa vai para o carrinho só para saber o preço. O que acontece? Destrói a métrica de custo de finalização." — Thiago Roas [DOC — KC213 ~30:00]

O preço DEVE ser visível na página de vendas antes do botão de compra. Ocultar o preço até o checkout cria "curiosos" que inflam o custo de finalização sem intenção de compra.

**Regra 3 — CTA/preço apenas após construção de desejo**

> "Preço, depois de desejo. No perpétuo, por algum motivo, alguém decidiu que o CTA tem que ficar no topo. Rapa o CTA daqui e joga para o final. Dobrou a conversão." — Thiago Roas [DOC — HC ~25:00-30:00]

O CTA (botão de compra) deve aparecer somente após a sequência de convicção. Mostrar preço ou botão de compra antes de construir o desejo é um vazamento de conversão. Caso documentado: empresa faturando centenas de milhões/ano dobrou a conversão apenas movendo o CTA para o final da página.

**Regra 4 — Posição do botão por ticket**

> "Para um ticket de R$37, talvez você bote o botão no topo. Para um ticket de R$250, R$300, não adianta botar o botão no topo." — Thiago Roas [DOC — KC213 ~30:00]

| Ticket | Posição do Botão | Racional |
|--------|-----------------|----------|
| R$37 ou abaixo | Topo pode funcionar | Convicção mínima necessária |
| R$38 a R$296 | Somente no final | Convicção intermediária necessária |
| R$297+ | Somente no final + sequência completa | Convicção total necessária |

**Regra 5 — Não copiar táticas de celebridades**

> "Existem alguns players que falam que o botão tem que ficar no topo. Não escondam o botão. Com 2 milhões de seguidores. Quando você é uma celebridade, o comportamento de compra é diferente. Quando você não é uma celebridade, o teu caminho é diferente." — Thiago Roas [DOC — KC213 ~55:00]

[CRITICAL] Regras publicadas por celebridades do nicho são válidas para o contexto deles — não para operadores sem autoridade prévia. A celebridade tem pré-confiança embutida. O não-celebridade precisa construir confiança na página.

**Regra 6 — Página de vendas é o coração do perpétuo**

> "A página de vendas é o coração do perpétuo. Não é o tráfego. Eu vejo a pessoa dedicando 10 horas por dia no tráfego, 30 minutinhos na página de vendas." — Thiago Roas [DOC — KC213 ~30:00]

A alocação de tempo e energia deve ser desproporcional à página de vendas. O tráfego amplifica o que a página já produz — positivamente ou negativamente. Uma página ruim com tráfego escalonado produz apenas mais prejuízo.

---

#### 6.2.4 Registrar Decisão de Formato

Documente:

- Formato selecionado: VSL / Página Escrita / Híbrido
- Justificativa com pontuação dos critérios
- Regras universais de página confirmadas como compreendidas: [ ]
- Próxima etapa: Iniciar SOP-COPY-VSL-SCRIPT-001 (se VSL) ou brief de copy escrita (se página escrita)

---

### Fase 3 — Integração Perpétuo × Lançamento

**Objetivo:** Definir como perpétuo e lançamento coexistem sem que um destrua o outro.

**Esta fase se aplica apenas se:** o operador já tem um lançamento ativo OU planeja ter lançamento no futuro próximo.

---

#### 6.3.1 Compreender os Papéis Complementares

| Modelo | Função Principal | Característica |
|--------|-----------------|---------------|
| Perpétuo | Fluxo de caixa previsível | Receita diária contínua [DOC — KC213 ~50:00] |
| Lançamento | Picos de receita, aquisição em massa | Eventos com janela fechada [DOC — KC213 ~50:00] |

Os dois modelos são complementares — não competitivos — quando o design do produto perpétuo está correto.

---

#### 6.3.2 Identificar os Dois Modos de Falha do Perpétuo sobre o Lançamento

[CRITICAL] Um perpétuo mal posicionado mata o lançamento. Os dois modos de falha são:

**Modo de Falha 1 — Sobreposição de Conteúdo**

> "Perpétuo mal encaixado na estratégia, quando já existe um lançamento, ele mata o lançamento. O cara compra o perpétuo e não precisa mais do lançamento." — Thiago Roas [DOC — KC213 ~50:00]

Ocorre quando o produto perpétuo cobre o mesmo território que o lançamento. O prospect compra o perpétuo, satisfaz a necessidade e não tem razão para comprar o lançamento.

**Modo de Falha 2 — Produto Demasiado Abrangente**

Ocorre quando o perpétuo entrega transformação tão completa que o prospect não sente necessidade de um próximo passo. É o caso de um produto que "entrega o tesouro completo" sem criar desejo pelo que vem depois.

[VERIFY] Avalie: o produto perpétuo proposto resolve o mesmo problema central do lançamento? Se sim, redefinir escopo do perpétuo antes de produzir qualquer copy.

---

#### 6.3.3 Aplicar o Princípio do Design Saudável

> "Um perpétuo saudável é um perpétuo que gera uma primeira transformação e gera desejo pela transformação maior. Aí você vem de lançamento. Quando você encaixa um perpétuo assim, você cria uma estratégia saudável de faturamento para o seu negócio." — Thiago Roas [DOC — KC213 ~55:00]

O produto perpétuo deve ser projetado para:

1. **Entregar transformação RÁPIDA** — horas ou dias, não semanas [DOC — KC213 ~55:00]
2. **Criar desejo pela transformação MAIOR** — o lançamento é o próximo passo natural
3. **NÃO entregar a solução completa** — o lançamento é o destino, o perpétuo é a porta de entrada

**Teste de design saudável:**

Após completar o produto perpétuo, o comprador deveria sentir:
- [ ] "Eu aprendi X e funcionou. Agora quero aprender Y para ir mais longe." (design correto)
- [ ] "Eu aprendi tudo que precisava. Não preciso de mais nada." (design problemático — redefinir escopo)
- [ ] "Não entendi nada / não funcionou." (qualidade do produto — resolver antes de escalar)

---

#### 6.3.4 Protocolo para Perpétuo que Para de Vender

Quando o perpétuo existente começa a apresentar queda de performance, a sequência de intervenção é:

1. **Primeira ação: mudar a apresentação da oferta** — não o produto [DOC — KC213 ~1:00:00]
2. Testar nova redline (headline) que conecte o produto ao momento atual
3. Atualizar visuais e ângulo de copy para contexto contemporâneo
4. Somente se apresentação não resolve: revisar estrutura do produto ou segmentação

> "Hoje a gente sabe que é muito mais uma questão de oferta do que de produto. Uma vez que você percebeu que um funil perpétuo está morrendo, a primeira coisa é mudar a página de vendas." — Thiago Roas [DOC — KC213 ~1:00:00]

**Caso documentado:** Produto de oratória durante a pandemia. A percepção era que o produto havia morrido. Ação: mudança da redline conectando ao contexto pandêmico ("estamos em casa, prepare-se para quando voltarmos"). Resultado: vendas recuperadas. [DOC — KC213]

---

### Fase 4 — Monetização de Base Existente

**Objetivo:** Definir estratégia para gerar receita de clientes existentes sem tráfego novo.

**Esta fase se aplica apenas se:** o operador já tem uma base de clientes (alunos que compraram o front).

---

#### 6.4.1 Webinar Mensal para Conversão de Upsell

> "Experimenta plugar um webinar ao vivo, uma vez por mês, para alunos, não para vender o front, para vender o upsell de quem não comprou." — Thiago Roas [DOC — HC ~12:00]

Esta estratégia ativa o potencial de upsell da base de alunos que compraram o front mas não compraram o upsell no momento da compra.

**Estrutura:**
- Audiência: somente alunos que compraram o front E não compraram o upsell
- Frequência: uma vez por mês [DOC — HC ~12:00]
- Objetivo: converter upsell (não front — não para novos clientes)
- Formato: webinar ao vivo (Zoom, Instagram Live ou equivalente)

**Nota:** Este não é um webinar de aquisição de novos clientes. É uma alavanca de ticket médio sobre base existente, sem custo adicional de tráfego.

---

#### 6.4.2 Mini-Lançamento para Base Quente

> "Se você fizer um mini-lançamento para essa base, pode ser uma aula só, uma aula ao vivo, que você captura sua base de seguidores, joga para um grupo de WhatsApp e faz um Zoom. Você vai fazer um pico de vendas." — Thiago Roas [DOC — KC213 ~50:00]

O mini-lançamento ativa compradores que não estavam prontos no momento do tráfego direto. São pessoas que chegaram à página, talvez não tenham comprado, ou compraram o front mas estão aquecidas.

**Formato operacional:**

1. Captura da base (seguidores, lista de email, lista de alunos)
2. Ingresso em grupo de WhatsApp ou sequência de email
3. Aula ao vivo — Zoom ou Instagram Live
4. Oferta ao final da aula
5. Encerramento do grupo/sequência após o evento

**Quando usar:**
- Quando o perpétuo está em fase de otimização e o tráfego ainda é limitado
- Para gerar pico de caixa sem aumento de verba de tráfego
- Para validar aceitação de uma oferta de upsell antes de escalar via tráfego

---

#### 6.4.3 Regra de Sequência de Complexidade do Funil

[CRITICAL] Adições de complexidade (email, webinar, mini-lançamento) são multiplicadores de lucro em funis validados — não pontos de partida para funis novos.

> "O iniciante nunca deve começar um perpétuo tentando colocar funis. É muito mais difícil vender perpétuo através de funis do que de tráfego direto. Primeiro começa com tráfego direto. Está funcionando? Coloca funis para potencializar o lucro." — Thiago Roas [DOC — KC213 ~1:10:00]

**Sequência obrigatória:**

| Fase | Estratégia | Critério para Avançar |
|------|-----------|----------------------|
| 1 — Validação | Tráfego direto → página de vendas | Custo de checkout dentro da meta por 30 dias consecutivos |
| 2 — Estabilização | Perpétuo validado + otimização de upsell | Ticket médio estável, operação previsível |
| 3 — Multiplicação | + Email sequences + webinar de upsell + mini-lançamentos | Somente após Fase 2 confirmada |

---

## 7. Tratamento de Erros e Resolução de Problemas

### 7.1 Modelo Escolhido Não Converte

**Sintoma:** Funil perpétuo ativo com custo de checkout acima do target por mais de 30 dias após otimização de página.

**Diagnóstico em sequência:**

1. Verificar se o ticket está dentro da faixa viável (R$297-R$497) — se não, reavaliar ticket
2. Verificar se o nicho foi corretamente dimensionado como big — se não, reavaliar modelo
3. Verificar se as regras universais de página estão sendo cumpridas (seção 6.2.3)
4. Ativar SOP-COPY-VSL-DIAG-001 para diagnóstico operacional

**Se nenhuma das ações acima resolver:** questionar se o nicho tem demanda real suficiente para o modelo perpétuo. Consultar Funnel Architect.

### 7.2 Perpétuo Está Matando o Lançamento

**Sintoma:** Após ativar o perpétuo, as conversões do lançamento caíram significativamente sem outra causa identificável.

**Diagnóstico:**

1. [DECISION] Os produtos têm sobreposição de conteúdo? Se sim: redefinir escopo do perpétuo para remover sobreposição
2. O perpétuo está entregando transformação demasiado completa? Se sim: reformular produto perpétuo para criar desejo pelo próximo passo
3. A audiência do perpétuo é a mesma do lançamento? Se sim: criar segmentação explícita (ex: perpétuo para novatos, lançamento para avançados)

**Ação imediata:** Pausar o tráfego do perpétuo e medir impacto no lançamento. Se lançamento se recupera com perpétuo pausado, o problema é de design de produto — não de execução.

### 7.3 Dúvida sobre Qualificação de Nicho como "Big"

**Sintoma:** Incerteza se o nicho é big ou sub-nicho.

**Teste prático:**

1. Buscar no Google: "[palavra-chave do nicho] curso" — verificar número de resultados pagos (anúncios)
2. Buscar no Meta Ads Library: quantos anunciantes ativos existem no nicho
3. Verificar se existem perpétuos concorrentes ativos no nicho há mais de 12 meses

Se há múltiplos concorrentes ativos e faturando, o nicho tem universo suficiente. Concorrência em perpétuo é indicador de viabilidade, não de saturação.

**Escalação:** Se dúvida persiste após o teste, consultar Funnel Architect antes de produzir qualquer copy.

### 7.4 Formato de Página Não Definido após Aplicar Critérios

**Sintoma:** Pontuação de critérios empatada entre VSL e página escrita.

**Ação:**

1. Considerar o ticket: tickets acima de R$250 favorecem VSL (mais tempo de convicção via vídeo) [ASM]
2. Considerar o histórico: se já existe VSL de outro produto do nicho que converteu, replicar o formato
3. Considerar a velocidade: página escrita é mais rápida de produzir e testar — em caso de dúvida, testar escrita primeiro e migrar para VSL após validação [INF]

### 7.5 Mini-Lançamento sem Conversão

**Sintoma:** Mini-lançamento executado, mas vendas abaixo do esperado.

**Diagnóstico:**

1. Verificar tamanho da base ativada (mínimo recomendado: 500 pessoas na lista/grupo) [GAP]
2. Verificar se a oferta do mini-lançamento é diferente do que a base já comprou
3. Verificar se o evento ao vivo aconteceu com engajamento suficiente (mínimo 30% de presença dos confirmados) [ASM]
4. Verificar se a oferta foi feita ao final (não durante) — ofertas no meio de conteúdo têm menor conversão

---

## 8. Controles de Qualidade e Métricas

### 8.1 Critérios de Saída deste SOP

Antes de avançar para qualquer produção de copy ou VSL, confirme que todos os itens abaixo foram respondidos e documentados:

| Item | Pergunta | Status |
|------|----------|--------|
| Q-01 | O nicho é white? | [ ] Confirmado |
| Q-02 | O ticket está na faixa viável para o modelo escolhido? | [ ] Confirmado |
| Q-03 | O nicho foi dimensionado (big ou sub)? | [ ] Confirmado |
| Q-04 | O modelo de funil foi selecionado? | [ ] Confirmado |
| Q-05 | O formato de página foi selecionado? | [ ] Confirmado |
| Q-06 | Se perpétuo + lançamento: o design do perpétuo não sobrepõe o lançamento? | [ ] Confirmado / N/A |
| Q-07 | A sequência de complexidade de funil foi respeitada (direto antes de funil complexo)? | [ ] Confirmado |
| Q-08 | As regras universais de página (seção 6.2.3) foram compreendidas pelo executor de copy? | [ ] Confirmado |

[CRITICAL] Nenhuma produção de copy ou VSL deve iniciar sem que todos os itens acima estejam com status "Confirmado".

### 8.2 Indicadores de Sucesso do Modelo Selecionado

Após 30 dias de operação do modelo, avaliar:

| Indicador | Referência | Fonte |
|-----------|-----------|-------|
| Custo de checkout dentro da meta | Definido por nicho + ticket (não há benchmark universal) [DOC — HC ~25:00] | SOP-COPY-VSL-DIAG-001 |
| Taxa de conversão de checkout | ~20% [DOC — KC213 ~25:00] | Meta operacional |
| Taxa de conversão de upsell | 10-20% [DOC — HC ~12:00-15:00] | Meta operacional |
| Taxa de conversão de downsell | 5-10% [DOC — HC ~12:00-15:00] | Meta opcional |
| Ticket médio | ≥ R$300 para front de R$297 [INF] | Estimativa operacional |

**Nota de benchmark:** Não existe taxa de conversão universal. Benchmarks variam por nicho, ticket e origem de tráfego. [DOC — HC ~25:00] Use os valores acima como referência inicial, ajustados para o contexto específico da operação.

### 8.3 Sinal de Alerta — Revisar Modelo

Revisar o modelo escolhido se, após 60 dias de operação e diagnóstico ativo (SOP-COPY-VSL-DIAG-001), qualquer um dos abaixo for verdadeiro:

- Custo de checkout está acima do target em todos os criativos testados (indica problema de página ou modelo)
- Taxa de upsell abaixo de 5% após otimização de página de upsell
- Lançamento caiu após ativação do perpétuo sem outra causa identificável

---

## 9. Referências e Documentos Relacionados

### 9.1 SOPs da Suite VSL

| SOP | ID | Versão | Relação |
|-----|----|--------|---------|
| Funil VSL Perpétuo — Arquitetura Completa | SOP-COPY-VSL-ARCH-001 | 0.4.0 | Próximo passo após este SOP para modelo perpétuo |
| VSL Script — Do Diagnóstico ao Script Final | SOP-COPY-VSL-SCRIPT-001 | 0.4.0 | Produção do roteiro após decisão de formato VSL |
| VSL Diagnóstico & Otimização | SOP-COPY-VSL-DIAG-001 | 0.4.0 | Diagnóstico de funil em operação |

### 9.2 Fontes das Evidências

| Abreviação | Fonte | ID |
|------------|-------|-----|
| HC | "Como Criar FUNIL DE VENDAS EFICIENTE para PÚBLICO FRIO" — Hotmart Cast | RENU3kEns0E |
| KC213 | "Ele Fez Mais De R$7 Milhões No Digital Como Gestor De Tráfego" — Kiwicast #213 | hnw1pGcc3_A |

### 9.3 Extrações de Referência

| Arquivo | Conteúdo |
|---------|---------|
| `outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md` | Extração completa Hotmart Cast |
| `outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md` | Extração completa Kiwicast #213 |

### 9.4 Localização e Retenção

- **Localização:** `squads/copy/data/sops/vsl-model-selection-sop.md`
- **Retenção:** Mínimo 3 anos após substituição por versão major
- **Acesso:** Read — Copy Squad agents. Write/Approve — Copy Chief + Squad Chief

---

## 10. GAPs e Itens para Verificação

| ID | GAP | Fase | Prioridade | Ação Necessária |
|----|-----|------|-----------|-----------------|
| GAP-MODEL-01 | Critério exato para classificar um nicho como "big" — o limiar de 10M de potenciais compradores é [INF], não declarado explicitamente por Thiago | Fase 1 | ALTA | Confirmar em fonte adicional ou validar empiricamente |
| GAP-MODEL-02 | Protocolo de saída de webinar mensal — frequência "uma vez por mês" foi mencionada de passagem. Detalhes operacionais (duração, estrutura, script) não foram cobertos nas fontes disponíveis | Fase 4 | ALTA | Fonte adicional ou SOP dedicado (PSOP-02) |
| GAP-MODEL-03 | Tamanho mínimo de base para viabilizar mini-lançamento — não declarado explicitamente. Valor de 500 pessoas é [ASM] | Fase 4 | MÉDIA | Confirmar com praticantes ou via teste empírico |
| GAP-MODEL-04 | Critério de decisão de formato híbrido (vídeo curto + copy longa) — critérios de seleção são [INF]. Não há declaração explícita de quando o híbrido supera VSL puro ou página escrita pura | Fase 2 | MÉDIA | Fonte adicional específica sobre formatos de página |
| GAP-MODEL-05 | Detalhes do modelo americano (prejuízo no front) — quando faz sentido adotá-lo no contexto brasileiro. Thiago menciona como ponto de atenção mas não detalha os critérios de viabilidade | Fase 1 | MÉDIA | Fonte adicional ou entrevista específica sobre unidade econômica |
| GAP-MODEL-06 | Estrutura de conteúdo do webinar de upsell para base de alunos — formato (duração, tipo de conteúdo, sequência de oferta) não coberto nas fontes disponíveis | Fase 4 | ALTA | SOP dedicado (PSOP-02) assim que fonte disponível |
| GAP-MODEL-07 | Tempo de maturação mínimo do perpétuo antes de adicionar lançamento — não há declaração de "espere X meses antes de integrar lançamento" | Fase 3 | MÉDIA | Observação empírica + validação com praticantes |

---

## 11. Histórico de Revisões

| Versão | Data | Autor | Tipo | Descrição |
|--------|------|-------|------|-----------|
| 0.1.0 | 2026-03-12 | SOP Creator (Gerber) | CRIAÇÃO | Versão inicial. Conteúdo extraído de Hotmart Cast (HC) e Kiwicast #213 (KC213). Cobre as 4 fases: Qualificação de Modelo, Seleção de Formato, Integração Perpétuo × Lançamento, Monetização de Base. |

**Próxima revisão programada:** 2027-03-12 (ou quando houver mudança de mercado significativa — ex: nova política de anúncios, mudança de algoritmo do Meta, novo benchmark de ticket validado)

**Critérios para revisão antecipada:**
- Mudança de política de anúncios que afete nichos white (Meta/Google TOS update)
- Novo benchmark de ticket de ouro validado por múltiplos projetos de 7 dígitos
- Evidência de que VSL passou a ser obrigatório ou passou a ser substituído por formato dominante

---

*SOP-COPY-VSL-MODEL-001 v0.1.0 — SOP Factory Squad — Generic Framework — Squad Agnostic*
