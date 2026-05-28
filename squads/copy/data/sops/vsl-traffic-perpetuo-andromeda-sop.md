---
sop_id: SOP-COPY-VSL-TRAFFIC-001
process_id: vsl-traffic-perpetuo-andromeda
title: "Tráfego Pago para Perpétuo — Criativos, Campanhas e Escala no Paradigma Andromeda"
version: "0.1.0"
status: DRAFT
source: "EXTRACTED FROM @thiagoroas (Thiago Roas)"
source_material:
  - "Kiwicast #213 — 'Ele Fez Mais De R$7 Milhões No Digital Como Gestor De Tráfego' (Video ID: hnw1pGcc3_A, ~1h25min)"
  - "Hotmart Cast — 'Como Criar FUNIL DE VENDAS EFICIENTE para PÚBLICO FRIO | Thiago Roas' (Video ID: RENU3kEns0E, ~40min)"
  - "Extração Kiwicast #213: outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md"
  - "Extração Hotmart Cast: outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md"
track_record_source: "200M+ gastos em tráfego, 8 nichos escalados (3 acima de R$200k/dia, 5 acima de R$100k/dia)"
owner: "Copy Chief"
approver: "Squad Chief (independent of document owner — per ISO 9001:2015 Clause 7.5.2(c))"
effective_date: "2026-03-12"
review_date: "2027-03-12"
next_review_date: "2027-03-12"
review_frequency: "Annual + on market change (Meta algorithm updates)"
executor: ["Copy Chief", "Traffic Strategist", "Creative Director", "Performance Analyst"]
level: OPERATIONAL
purpose: >
  Estabelecer o protocolo operacional completo de tráfego pago para funis VSL perpétuos
  no paradigma Andromeda (Meta 2025-2026), cobrindo: fundação de budget, infraestrutura
  de conta e atribuição, produção de criativos, teste e iteração, operação de conta em
  escala e protocolo de escala horizontal e vertical.
scope: >
  Este SOP cobre a operação de tráfego de funis VSL perpétuos em public frio via Meta Ads
  (Facebook/Instagram) no paradigma Andromeda. Inclui: estratégia de budget, configuração
  de campanha, produção e análise de criativos, operação de ad sets, e escala.
  NÃO cobre: copy da página de vendas (ver SOP-COPY-VSL-SCRIPT-001),
  diagnóstico de funil (ver SOP-COPY-VSL-DIAG-001), arquitetura de funil
  (ver SOP-COPY-VSL-ARCH-001), ou Google Ads.
training_requirements: "Ver seção Pré-Requisitos"
location: "squads/copy/data/sops/vsl-traffic-perpetuo-andromeda-sop.md"
feedback: "Reportar problemas via Copy Chief ou squad-creator auto-heal"
squad_agnostic: true
notes: >
  Este SOP é genérico — não contém dados de nenhum business específico.
  Aplicável a qualquer funil perpétuo VSL de tráfego frio em public brasileiro.
reviewed_by:
  - "SOP Creator — criação v0.1.0, 2026-03-12"
---

> **DRAFT — EXTRAÍDO DE @thiagoroas**
> Este documento foi extraído de material de referência externa (Kiwicast #213 + Hotmart Cast).
> Cada afirmação carrega marcador de confiança. Antes de uso em produção, verificar itens
> sinalizados com [INF] ou [ASM] e preencher os GAPs identificados na seção final.
> Abreviações de fonte: **HC** = Hotmart Cast (RENU3kEns0E) | **KC213** = Kiwicast #213 (hnw1pGcc3_A)

---

## Legenda de Confiança

| Marcador | Score | Nível | Tipo de Fonte |
|----------|-------|-------|--------------|
| [DOC] | 1.0 | Documentado | Declaração direta e explícita do praticante |
| [REP] | 0.8 | Reportado | Afirmado pelo praticante, corroborado por contexto ou caso |
| [INF] | 0.5 | Inferido | Deduzido de evidência parcial ou referência indireta |
| [ASM] | 0.3 | Assumido | Premissa razoável sem evidência direta |
| [GAP] | — | Lacuna | Não encontrado nas fontes — necessita verificação |

---

## Índice

1. [Propósito e Escopo](#1-propósito-e-escopo)
2. [Pré-Requisitos e Qualificação do Executor](#2-pré-requisitos-e-qualificação-do-executor)
3. [Fase 1 — Fundação de Budget e Reinvestimento](#3-fase-1--fundação-de-budget-e-reinvestimento)
4. [Fase 2 — Infraestrutura de Conta e Inteligência de Atribuição](#4-fase-2--infraestrutura-de-conta-e-inteligência-de-atribuição)
5. [Fase 3 — Produção de Criativos no Paradigma Andromeda](#5-fase-3--produção-de-criativos-no-paradigma-andromeda)
6. [Fase 4 — Teste e Iteração de Criativos](#6-fase-4--teste-e-iteração-de-criativos)
7. [Fase 5 — Operação de Conta no Paradigma Andromeda](#7-fase-5--operação-de-conta-no-paradigma-andromeda)
8. [Fase 6 — Escala Horizontal e Vertical](#8-fase-6--escala-horizontal-e-vertical)
9. [Gestão de Desvios (Error Handling)](#9-gestão-de-desvios-error-handling)
10. [Glossário](#10-glossário)
11. [Referências Cruzadas](#11-referências-cruzadas)
12. [GAPs e Verificações Necessárias](#12-gaps-e-verificações-necessárias)
13. [Quick-Reference Card](#13-quick-reference-card)
14. [Histórico de Revisões](#14-histórico-de-revisões)

---

## 1. Propósito e Escopo

### 1.1 Propósito

Este SOP existe para codificar os fundamentos operacionais de tráfego pago no contexto de funis VSL perpétuos, com base em 200M+ gastos em tráfego documentados por @thiagoroas. A maioria dos operadores falha em tráfego não por falta de acesso à plataforma, mas por falta de estrutura analítica, sequência operacional errada e métricas equivocadas.

> "99% de estratégia, 1% de apertar botão. Apertar botão é a parte mais fácil do processo." — @thiagoroas [DOC — HC ~10:00]

### 1.2 Premissa Estrutural — Lei do Custo Crescente de Tráfego

Antes de qualquer operação, o executor deve internalizar esta lei:

> "O tráfego está mais caro. E vai continuar sendo sempre mais caro. Essa é a única métrica que não mudou. [...] Vai chegar a Black Friday. Vai ficar mais cara." — @thiagoroas [DOC — HC ~30:00-35:00]

**Implicação:** Todo modelo de negócio cuja receita por comprador não cresce ao longo do tempo está em degradação estrutural. O custo de aquisição sobe; a receita por comprador fica estática. Esta lei fundamenta a necessidade de upsell, ticket médio crescente e otimização de funil como componentes obrigatórios — não opcionais.

### 1.3 Paradigma Andromeda — Contexto de Mercado

O Meta Ads de 2025-2026 opera sob um paradigma fundamentalmente diferente dos anos anteriores:

- A segmentação manual de público (interesses, lookalikes detalhados) foi absorvida pelo algoritmo.
- O algoritmo lê o conteúdo dos criativos (texto no vídeo, copy, narração) e distribui para o público correto automaticamente.
- As contas mais escaladas operam com público 100% aberto (broad).

> "O tráfego ficou muito mais fácil de fazer. Então, cara, esquece público hoje em dia. O foco é criativo." — @thiagoroas [DOC — HC ~15:00]

**Implicação operacional:** No paradigma Andromeda, o criativo é o instrumento de segmentação — não o targeting. O operador que passa mais tempo ajustando públicos do que criando criativos está invertendo a prioridade.

### 1.4 Escopo

**Dentro do escopo:**
- Estratégia de budget para funis perpétuos novos e em escala
- Configuração e estrutura de campanhas Meta Ads (objetivo, campanha, conjunto, anúncio)
- Setup de métricas customizadas (custo de finalização de compra)
- Atribuição e janelas de análise
- Produção, briefing e análise de criativos
- Protocolo de teste de criativos (ângulo direto → ângulo adjacente)
- Operação de ad sets: regras de budget, learning phase, duplicação
- Escala horizontal e vertical

**Fora do escopo:**
- Copy da página de vendas → ver SOP-COPY-VSL-SCRIPT-001
- Diagnóstico de funil com métricas de funil → ver SOP-COPY-VSL-DIAG-001
- Arquitetura e precificação de funil → ver SOP-COPY-VSL-ARCH-001
- Google Ads, TikTok Ads, ou outras plataformas
- Gestão de conta de anúncios (banimento, compliance, suporte da plataforma)

---

## 2. Pré-Requisitos e Qualificação do Executor

> **Não inicie este SOP sem validar os pré-requisitos abaixo.**
> Avançar sem eles cria operação de tráfego sobre funil não validado — desperdício garantido.

### 2.1 Pré-Requisitos de Funil

- [ ] Funil VSL perpétuo arquitetado e aprovado — ticket de R$297 (±R$50) definido [REP — HC ~10:00]
- [ ] Página de vendas publicada e funcional (VSL ou texto)
- [ ] Checkout configurado: PIX + cartão, **sem boleto** (ver Fase 2 — item sobre boleto)
- [ ] Upsell configurado com OCU (One-Click Upsell)
- [ ] Pixel Meta instalado e disparando eventos: PageView, ViewContent, InitiateCheckout, Purchase
- [ ] Meta Ads Manager com acesso de Editor na conta de anúncios
- [ ] Conta de anúncios em boa situação (sem violações de política ativas)

### 2.2 Qualificação do Executor

O executor deste SOP deve dominar:

- [ ] Estrutura de campanha do Meta Ads (campanha → conjunto de anúncios → anúncio)
- [ ] Diferença entre objetivo de campanha de engajamento vs. objetivo de vendas
- [ ] Leitura de custo por finalização de compra como métrica soberana
- [ ] Distinção entre diagnóstico de criativo e diagnóstico de página

> "Gestor de tráfego não entende de funil, está morto. Mercado. [...] Você é apertador de botão." — @thiagoroas [DOC — HC ~35:00]

**Perfil mínimo:** O executor de tráfego em perpétuo deve ter visão integrada de funil. Quem gerencia tráfego sem entender a mecânica do funil (checkout, upsell, custo de finalização) não é capaz de diagnosticar a causa-raiz de um problema de performance. [DOC — HC ~35:00]

### 2.3 Pré-Requisitos de Budget

- [ ] Budget inicial mínimo disponível: R$200/dia [DOC — KC213 ~15:00]
- [ ] Comprometimento de reinvestimento: 100% do lucro do perpétuo volta para tráfego até atingir R$200/dia estável [DOC — KC213 ~15:00]

---

## 3. Fase 1 — Fundação de Budget e Reinvestimento

### 3.1 Budget Mínimo Operacional

> "Tenta pelo menos bater uns 200 por dia. Porque menos que isso, quando o investimento, por exemplo, 30 por dia, é muito difícil testar coisas. Demora muito para você ter resultados que te permitam saber se aquela estratégia ou se aquele criativo está funcionando ou não." — @thiagoroas [DOC — KC213 ~15:00]

**Regra:** R$200/dia é o threshold mínimo para operar com dados estatisticamente úteis em perpétuo.

| Budget Diário | Status | Consequência |
|---------------|--------|-------------|
| < R$50/dia | Armadilha | Dados insuficientes; decisões inválidas; nenhum resultado que justifique escalada [DOC — KC213] |
| R$50–R$199/dia | Operação limitada | Testes lentos; pode-se aprender, mas ciclo muito lento para chegar a escala |
| R$200+/dia | Threshold mínimo | Volume suficiente para validar criativos e tomar decisões em tempo útil [DOC — KC213 ~15:00] |
| R$1.000+/dia | Operação de escala | Dados rápidos, múltiplos ad sets possíveis, escala horizontal viável |

> **Anti-padrão documentado:** "R$50/dia durante 6 meses = armadilha — não sai do lugar." [DOC — KC213] O operador tem a ilusão de que está "testando" enquanto o volume baixo impede qualquer conclusão válida.

### 3.2 Protocolo de Reinvestimento (Fase de Fundação)

O primeiro trabalho do operador de perpétuo não é otimização — é crescimento de budget.

> "O maior inimigo do resultado no perpeto é o baixo investimento. O primeiro passo pra quem quer ter resultado com tráfego pago é tudo o que ele ganha e ele reinvestir pra aumentar o investimento. É infinitamente mais fácil eu gerar resultado pra um perpeto investindo, por exemplo, mil reais por dia do que investindo 50 por dia." — @thiagoroas [DOC — KC213 ~15:00]

**Protocolo de reinvestimento:**

```
FASE DE FUNDAÇÃO (até atingir R$200/dia estável)
  ├── Lucro do perpétuo este mês?
  │     └── SIM → 100% reinvestido em tráfego
  │     └── NÃO → Revisar funil antes de aumentar tráfego
  └── Budget atual ≥ R$200/dia por 7 dias consecutivos?
        └── SIM → Autorizado a passar para Fase de Escala (Fase 6)
        └── NÃO → Continuar reinvestindo
```

**Razão matemática:** Com R$50/dia e CPA-alvo de R$150, cada criativo leva ~3-5 dias para acumular dados suficientes para uma decisão. Com R$200/dia, o mesmo criativo tem dados em 1 dia. A velocidade de aprendizado é 3-5x maior — o que se aprende em 6 meses a R$50/dia se aprende em 6 semanas a R$200/dia. [INF — baseado em KC213 ~15:00]

### 3.3 Lei do Custo Crescente — Implicação para Budget

O custo de tráfego sempre sobe. O que é R$200/dia hoje pode ser equivalente a R$120/dia de poder de compra em 12 meses. [DOC — HC ~30:00]

**Implicação:** O target de budget mínimo deve ser revisado anualmente. R$200/dia é o threshold documentado como de março de 2026. [GAP — verificar atualização deste threshold periodicamente]

---

## 4. Fase 2 — Infraestrutura de Conta e Inteligência de Atribuição

### 4.1 Estrutura de Campanha Meta Ads

> "O objeto de tráfego pago, ele é formado por um conjunto de conceitos. Você tem as campanhas. E nas campanhas você tem os conjuntos de anúncios. E nos conjuntos de anúncios você tem os anúncios." — @thiagoroas [DOC — KC213 ~10:00]

**Hierarquia de inteligência:**

| Nível | Nome | Papel | Onde vive a inteligência? |
|-------|------|-------|--------------------------|
| Campanha | Campaign | Define objetivo e orçamento global (se CBO) | Não — apenas configuração |
| Conjunto | Ad Set | Define público, budget (se ABO), placement | **SIM — aqui vive a inteligência** [DOC — KC213 ~40:00] |
| Anúncio | Ad | Criativo (vídeo, imagem, copy, CTA) | Não — apenas conteúdo |

> "A inteligência do tráfego pago no Facebook não está na campanha. Nem no anúncio. Está no conjunto de anúncios." — @thiagoroas [DOC — KC213 ~40:00]

**Implicação operacional:** Qualquer ação que resete o conjunto de anúncios (mudança de budget > 20%, pausa prolongada, alteração de público) destrói a inteligência acumulada. O conjunto precisa de continuidade para otimizar.

### 4.2 Objetivo de Campanha como Instrução de Targeting

> "Campanha de engajamento vai distribuir o seu conteúdo para pessoas que costumam engajar. A campanha de vendas [...] vai entregar o seu conteúdo para pessoas que costumam comprar. Por isso que campanha de vendas é sempre muito mais cara do que engajamento. Porque o público é muito mais qualificado." — @thiagoroas [DOC — KC213 ~1:10:00]

**Regra de objetivo:**

| Objetivo | Meta distribui para | CPM | Usar quando |
|----------|--------------------|----|-------------|
| Engajamento | Pessoas que interagem (comentam, compartilham) | Baixo | Consciência de marca, conteúdo orgânico amplificado |
| Vendas/Conversão | Pessoas com histórico de compra online | Alto | **Perpétuo — sempre** |
| Alcance | Distribuição máxima | Muito baixo | Awareness em nichos de baixa consciência [DOC — KC213 ~35:00] |

> **NUNCA comparar métricas entre objetivos diferentes.** CPM de engajamento vs. CPM de vendas estão atingindo públicos completamente diferentes — a comparação não tem significado. [DOC — KC213 ~1:10:00]

### 4.3 Janela de Atribuição — Regra das 72 Horas

> "Hoje, a gente não pode analisar as campanhas com um prazo de 24 horas. A própria Meta orienta que a análise deve ser feita em um prazo de 72 horas. Por quê? Porque existem conversões que vão acontecer hoje, que só vão ser apontadas lá 3 dias pra frente." — @thiagoroas [DOC — KC213 ~1:25:00]

**Regra:** NUNCA matar ou pausar um criativo com menos de 72 horas de dados.

**Consequência de ignorar a janela de 72h:**
- ROAS na plataforma pode aparecer como 0.8 no dia 1
- ROAS real (após atribuição completa) pode ser 3.0 no dia 3
- Operador que mata criativo no dia 1 está matando um criativo lucrativo com base em dado incompleto

**Protocolo de análise:**

```
Criativo publicado
  └── Aguardar 72 horas
        └── Coletar dados completos
              └── Analisar custo de finalização (métrica soberana)
                    └── Decisão: manter / pausar / escalar
```

### 4.4 Custo de Finalização de Compra — Métrica Soberana

> "A métrica mais importante para quem roda para público frio, mais importante que o ROAS. É custo para a finalização de compra." — @thiagoroas [DOC — HC ~25:00]

**Por que custo de finalização é mais confiável que ROAS:**

> "A taxa de conversão de checkout ela é estável — tem variação estreita. [...] Se eu tenho 20% de conversão de checkout, eu vou ter 20, 19, 18, 21, 22, e aquilo vai ficar." — @thiagoroas [DOC — HC ~25:00]

Conversão de checkout é estável (+/-2-3%). Uma vez que o funil está maduro, a conversão de checkout é previsível. Logo:
- Se custo de finalização está na meta → meta de CPA está na meta (matematicamente determinístico)
- ROAS flutua por variações de atribuição e ticket médio — não é determinístico no curto prazo

**Como criar a métrica no Meta Ads Manager:**

> "No gerenciador, tem uma forma de você criar fórmulas. Você consegue pegar uma coluna de métricas e dividir por outra, e ele vai te dar o resultado." — @thiagoroas [DOC — KC213 ~25:00]

**Fórmula:** `Gasto Total ÷ Eventos de Finalização de Compra (Initiate Checkout) = Custo por Finalização`

**Passo a passo para criar:**
1. No Meta Ads Manager, acessar "Colunas" → "Personalizar colunas"
2. Clicar em "Criar métrica personalizada"
3. Nomear: "Custo por Finalização"
4. Fórmula: `Quantia gasta` ÷ `Finalizações de compra no site`
5. Salvar e adicionar à view padrão

> **Esta métrica não existe por padrão — deve ser criada manualmente.** [DOC — KC213 ~25:00] Operador que não criou esta coluna está operando sem a métrica soberana do perpétuo.

### 4.5 Hierarquia de Métricas para Análise

> "A métrica mais importante de perpétuo: venda, ROI. Depois dessa, a métrica que guia uma otimização de tráfego para o perpétuo é custo por finalização de compra. Não é CTR, não é CPC. Muito menos CPM." — @thiagoroas [DOC — KC213 ~25:00]

**Hierarquia de análise (da mais para a menos importante):**

| Prioridade | Métrica | O que revela | Quando analisar |
|-----------|---------|-------------|----------------|
| 1 | ROAS / Vendas | Lucratividade total | Sempre — visão final |
| 2 | Custo de finalização | Eficiência do criativo em mandar compradores ao checkout | Antes de qualquer decisão de criativo |
| 3 | CTR | Apelo do criativo na feed | Só depois de #1 e #2 entendidos |
| 4 | CPC | Custo de cada clique | Contexto secundário |
| 5 | CPM | Custo por mil impressões | Raramente acionável isolado |

> **CTR e CPC são perigosos para iniciantes.** [DOC — KC213 ~20:00] 99% dos gestores analisam campanhas com base em CTR/CPC — métricas que não têm relação direta com o processo de venda. Um meme pode ter CTR de 5%+ e não vender nada porque o criativo não está conectado à persona que compra.

### 4.6 CPM — Interpretação Contextual

> "Muita gente olha o CPM e fala 'meu CPM está alto'. Ele não sabe que muitas vezes CPM alto significa público mais qualificado. Quando você roda remarketing [...] você tem que ter CPM mais alto." — @thiagoroas [DOC — KC213 ~1:05:00]

**Regra de interpretação de CPM:**

| Contexto | CPM esperado | Interpretação |
|----------|-------------|---------------|
| Tráfego frio (objetivo de vendas) | Mais alto que engajamento | Normal — público mais qualificado tem CPM maior |
| Remarketing (visitantes da página) | Alto | Correto — público muito qualificado |
| CPM alto + vendas acontecendo | Positivo | Custo correto para o público correto |
| CPM baixo + zero vendas | Sinal de alerta | Público errado ou criativo desconectado |

**Regra:** CPM alto não é problema. CPM alto sem conversão é sintoma de outro problema (criativo errado, página com problema, público errado para o objetivo).

### 4.7 Boleto — Remoção Obrigatória do Checkout de Perpétuo

> "Boleto é o maior assassino de perpétuo. [...] O boleto suja o seu público de initiate checkout. Ele atrapalha a inteligência do Facebook. O Facebook entende que aquilo é uma compra e não é. A minoria paga o boleto." — @thiagoroas [DOC — KC213 ~1:15:00]

**Por que boleto destrói a operação de perpétuo:**

1. **Corrupção de pixel:** Todo boleto gerado dispara o evento de compra (ou initiate checkout) no pixel Meta, mesmo que 70-80% dos boletos nunca sejam pagos. O algoritmo aprende a otimizar para "compradores" que na realidade são pessoas que geraram boleto e não pagaram.
2. **Destruição da métrica soberana:** O custo de finalização fica artificialmente baixo (muitos "checkouts" falsos via boleto), mascarando o problema real.
3. **Razão de uso:** Com PIX disponível, não há justificativa funcional para boleto em perpétuo.

**Regra:** Remover boleto do checkout de perpétuo. Exceção operacional: se cliente solicitar boleto via contato direto (DM, WhatsApp), gerar link manual sem expô-lo no checkout. [DOC — KC213 ~1:15:00]

---

## 5. Fase 3 — Produção de Criativos no Paradigma Andromeda

### 5.1 O Papel do Criativo — Reframing Fundamental

> "Eu não concordo com a tese de que o papel do criativo é levar para a página. A minha visão é diferente. O criativo tem papel de venda. Ele é o início do processo de venda." — @thiagoroas [DOC — HC ~15:00]

**Dois paradigmas de criativo:**

| Paradigma Antigo | Paradigma Andromeda |
|-----------------|---------------------|
| Criativo = veículo de tráfego | Criativo = primeiro passo da venda |
| Objetivo: gerar clique | Objetivo: iniciar persuasão e qualificar prospect |
| Sucesso = alto CTR | Sucesso = custo de finalização baixo |
| Foco: imagem, headline | Foco: copy, narrativa, conexão com dor |

### 5.2 Criativo como Instrumento de Segmentação (Andromeda)

> "O criativo tem um papel de segmentação. Hoje a segmentação é toda por criativo. Não é por públicos mais. [...] A plataforma já está otimizando o pull." — @thiagoroas [DOC — HC ~15:00-20:00]

**Como funciona a segmentação por criativo:**
- O algoritmo Meta lê o conteúdo do criativo (texto no vídeo, narração, copy da legenda)
- Distribui o criativo para pessoas cujo comportamento online combina com o conteúdo
- Um criativo que fala sobre "aprender a falar em público para virar palestrante" → Meta encontra pessoas que pesquisam sobre palestras, assistem conteúdo de oratória, compram cursos relacionados
- Não é necessário definir esses interesses manualmente — o algoritmo faz automaticamente

**Implicação para produção:** O que está escrito e dito no criativo é o briefing de targeting do algoritmo. Copy ruína no criativo = segmentação ruim.

### 5.3 Regra Andromeda — Criativos Genuinamente Diferentes

> "A Meta quer criativo efetivamente diferente. Por isso não se mata a rede social com um monte de criativo semelhante. [...] A galera está rodando hoje [mudar só gancho]. Mas isso está morrendo aos poucos." — @thiagoroas [DOC — HC ~15:00-20:00]

**O que está morrendo:** A prática de criar variantes mudando apenas o gancho inicial (primeiros 3-5 segundos) enquanto o restante do criativo é idêntico. O algoritmo Andromeda detecta a similaridade e trata como redundante.

**O que o algoritmo quer:** Criativos com abordagem, formato, ângulo e narrativa genuinamente diferentes — não variações superficiais de um mesmo criativo.

**Checklist de diferenciação real de criativos:**
- [ ] Ângulo de ataque diferente (dor direta vs. desejo vs. prova social vs. autoridade)
- [ ] Formato diferente (UGC vs. falando para câmera vs. slideshow vs. B-roll com narração)
- [ ] Persona do apresentador diferente (produtor vs. aluno vs. especialista vs. ceticismo inicial)
- [ ] Hook estruturalmente diferente (pergunta vs. afirmação chocante vs. história vs. estatística)
- [ ] Narrativa diferente (problema-solução vs. antes-depois vs. revelação vs. comparação)

### 5.4 O Paradoxo CTR — Métricas Secundárias vs. Conversão

> "Os criativos que eram segmentados para o público mais amplo tinham métricas secundárias muito melhores — custo por clique mais barato, CTR mais alto — converteu menos. Quando segmentado para palestrantes, as métricas secundárias eram piores. Convertiam mais." — @thiagoroas [DOC — HC ~15:00]

**Caso documentado:** Dois criativos para o mesmo produto de oratória:
- Criativo A (público amplo, comunicação geral): CTR 3%, CPC R$1,50, conversão baixa
- Criativo B (palestrantes específico): CTR 1,2%, CPC R$3,80, conversão alta

**Princípio:** Um criativo que qualifica o prospect (fala diretamente para a persona que compra) afasta os curiosos. CTR cai porque pessoas não qualificadas não clicam. Conversão sobe porque quem clica tem alta probabilidade de comprar.

**Regra:** Nunca matar um criativo com base em CTR baixo ou CPC alto. A métrica de decisão é custo de finalização. [DOC — HC ~15:00]

### 5.5 Público Aberto como Estado Padrão

> "As contas mais escaladas que eu tenho, a gente não roda nenhum público. É público aberto. O foco é criativo." — @thiagoroas [DOC — HC ~15:00]

**Público aberto:** Campanha com zero targeting manual — sem interesses, sem lookalikes, sem restrições de comportamento. O algoritmo tem liberdade total para encontrar compradores.

**Quando usar público aberto:**
- Contas com histórico de dados (pixel com eventos suficientes — recomendado mínimo 50 eventos de Purchase por semana) [INF — KC213]
- Funil validado (a página converte com tráfego frio)
- Após fase inicial de aprendizado

**Quando usar targeting mais restrito:**
- Conta nova sem histórico de pixel
- Fase de validação inicial do funil
- Nichos muito específicos sem dados históricos suficientes [INF]

### 5.6 Briefing de Criativo — Elementos Obrigatórios

Todo criativo de perpétuo deve incluir no conteúdo (não necessariamente na legenda):

| Elemento | Função | Presença |
|---------|---------|----------|
| Identificação da persona | Fazer o algoritmo segmentar para o público certo | Obrigatória |
| Dor ou desejo específico | Gerar reconhecimento e parar o scroll | Obrigatória |
| Promessa (transformação) | Iniciar o processo de venda | Obrigatória |
| Indicador de credibilidade | Quebrar objeção de golpe [DOC — KC213 ~45:00] | Recomendada |
| CTA claro | Instrução de ação (ver vídeo, clicar, saiba mais) | Obrigatória |

> **A primeira objeção de quem cai em qualquer página de vendas não é preço, não é qualidade — é "será que isso é golpe?"** [DOC — KC213 ~45:00] O criativo deve endereçar este ceticismo antes de chegar na página, ou ao menos não amplificá-lo.

---

## 6. Fase 4 — Teste e Iteração de Criativos

### 6.1 Hierarquia de Análise de Criativo

> "A métrica mais importante de perpétuo é venda, ROI. Depois, custo por finalização. Não é CTR, não é CPC. Muito menos CPM." — @thiagoroas [DOC — KC213 ~25:00]

**Sequência de análise de criativo (nesta ordem):**

```
1. ROAS / Vendas atribuídas ao criativo
      ↓
2. Custo de finalização de compra (initiate checkout)
      ↓ (só se #1 e #2 estiverem problemáticos)
3. CTR (Link Click Through Rate)
      ↓
4. CPC (Custo por clique)
      ↓ (raramente necessário)
5. CPM (Custo por mil impressões)
```

**Diagnóstico por coluna:**

| Situação | Diagnóstico | Ação |
|----------|------------|------|
| ROAS bom + custo finalização bom | Criativo saudável | Escalar |
| ROAS baixo + custo finalização bom | Problema na conversão de checkout ou ticket médio | Investigar checkout |
| ROAS baixo + custo finalização alto | Criativo não está atraindo compradores | Revisar ou pausar criativo |
| TODOS os criativos com custo finalização alto | Problema na página, não no criativo | Não testar mais criativos — corrigir página |

> "Eu rodo 5 criativos, 10 criativos. Nenhum está dando bom. O problema está na página. Não é o tráfego. Não adianta ficar testando mais criativo." — @thiagoroas [DOC — KC213 ~45:00]

### 6.2 Anti-Padrão — Loop Infinito de Criativos

> "O cara que testei 10 criativos. Testei 10 públicos. Vou testar mais. Não é isso. O problema está na sua página." — @thiagoroas [DOC — KC213 ~45:00]

**O Loop Infinito de Criativos** é o anti-padrão mais comum em perpétuo:

```
Operador testa criativo 1 → não vende → testa criativo 2 → não vende →
testa criativo 3 → não vende → [...] → testa criativo 10 → não vende →
conclusão: "o mercado está difícil" / "meu nicho não funciona"
CAUSA REAL: problema na página de vendas nunca diagnosticado
```

**Detecção do Loop Infinito:**
- Mais de 5 criativos diferentes testados com custo de finalização alto em todos
- Nenhuma mudança feita na página de vendas entre os testes
- Operador atribui o problema ao criativo, ao público, ou ao "mercado"

**Solução:** Parar de testar criativos. Ir para SOP-COPY-VSL-DIAG-001 — diagnóstico de funil.

### 6.3 Moment-Hijacking — Criativos Ligados ao Momento Cultural

> "Criativos ligados ao momento performam muito bem. Por exemplo, aconteceu algo. Filme da Barbie. A gente botou criativos ligados ao filme da Barbie. E performavam bem. Pandemia: criativos com máscara. Fatos muito conhecidos do público em geral — quando você cria criativos ligados a isso, tendem a performar muito bem." — @thiagoroas [DOC — KC213 ~1:00:00]

**Moment-Hijacking:** Estratégia de criar criativos conectados a eventos culturais de alta atenção (filmes, notícias, tendências virais) para aumentar CTR e relevância.

**Regra crítica:** O evento cultural deve conectar-se organicamente com a dor/desejo da persona. Forçar uma conexão artificial gera CTR mas não conversão.

**Exemplos de conexão válida:**
- Filme sobre mulheres empreendedoras → criativo para curso de finanças feminino
- Copa do Mundo → criativo para curso de disciplina/performance
- Pandemia → criativo para curso de produtividade em home office

**Janela de oportunidade:** Criativos de moment-hijacking têm vida útil limitada ao evento. Planejar entrada no início da janela de atenção — não no pico (concorrência alta) nem no declínio. [INF]

### 6.4 Progressão de Ângulo — Do Direto ao Adjacente

> "Para escalar, eu posso criar criativos que peguem dores adjacentes, ou desejos adjacentes. [...] Dois adjacentes. Só que você não pode começar por isso. Isso é um processo de escala, de teste. Primeiro você tem que ir direto na dor do seu público." — @thiagoroas [DOC — KC213 ~1:05:00]

**Sequência de ângulo de criativo:**

**Fase 1 — Validação (dor/desejo direto):**
- Criativo fala diretamente com a dor central da persona
- Exemplo (oratória): "Você trava na hora de falar em público?"
- Objetivo: validar que o funil converte antes de expandir

**Fase 2 — Escala (dores/desejos adjacentes):**
- Após validar conversão com ângulo direto, expandir para ângulos adjacentes
- Exemplo (oratória adjacentes): "Quem fala bem em público é promovido mais rápido" / "Quanto custa cada oportunidade que você perde por não saber se comunicar?"
- Objetivo: atingir fatias do público que não respondem ao ângulo direto mas têm o mesmo problema

**Regra:** Não pular para ângulos adjacentes antes de validar o ângulo direto. O ângulo adjacente é estratégia de escala, não de validação. [DOC — KC213 ~1:05:00]

### 6.5 Arquétipo Vencedor — Modelagem e Variação

> "Pega criativos que performam bem, modelem eles e criem variações. Não precisa reinventar a roda. A gente teve uma época que criativos de super-herói para a gente explodiu. A gente ia ficar tentando criativos de carro? Não. Era só super-herói." — @thiagoroas [DOC — KC213 ~1:05:00]

**Metodologia de arquétipo vencedor:**

```
1. Identificar arquétipo vencedor (tema, formato, ângulo que performa)
2. Criar variações do arquétipo:
     - Mesmo tema, protagonista diferente
     - Mesmo ângulo, hook diferente
     - Mesmo formato, dor adjacente
3. Continuar criando variações até o arquétipo saturar
4. Quando arquétipo satura → identificar novo arquétipo vencedor
5. Não abandonar arquétipo vencedor prematuramente para "inovar"
```

**Importante:** Variações do arquétipo devem ser genuinamente diferentes no conteúdo (não só no gancho), para satisfazer o requisito Andromeda de criativos diferentes. [DOC — HC ~15:00-20:00]

---

## 7. Fase 5 — Operação de Conta no Paradigma Andromeda

### 7.1 Onde Vive a Inteligência — Ad Set como Unidade de Otimização

> "A inteligência do tráfego pago no Facebook não está na campanha. Nem no anúncio. Está no conjunto de anúncios. Quando a gente faz uma alteração de duplicação da verba de um conjunto de anúncios, ele reinicia a fase de aprendizagem." — @thiagoroas [DOC — KC213 ~40:00]

**Regras de preservação do ad set:**

| Ação | Impacto na inteligência | Recomendação |
|------|------------------------|-------------|
| Aumentar budget 10-20%/dia | Sem reset | Permitido |
| Aumentar budget > 20%/dia | Reset da fase de aprendizado | Evitar |
| Dobrar budget de uma vez | Reset total | Proibido |
| Pausar por < 24h | Impacto mínimo | Permitido |
| Pausar por > 3 dias | Perda parcial de otimização | Evitar — preferir manter ativo |
| Alterar público do ad set | Reset total | Criar novo ad set em vez de editar |
| Duplicar ad set | Cria novo ad set, original intacto | Método correto para escala |

### 7.2 Regra de Aumento de Budget — 10-20% por Dia

> "Quando a gente faz uma alteração de duplicação da verba de um conjunto de anúncios, ele reinicia a fase de aprendizagem. [...] Regra: máximo 10-20% de aumento de budget por dia por ad set." — @thiagoroas [DOC — KC213 ~40:00]

**Protocolo de aumento vertical de budget:**

```
Ad set em R$100/dia com bom desempenho
  └── Dia 1: R$110–R$120 (aumento 10-20%)
        └── Aguardar 48-72h para estabilização
              └── Desempenho mantido?
                    ├── SIM → aumentar mais 10-20%
                    └── NÃO → manter no nível anterior
```

### 7.3 Fatias de Público — Mecanismo de Escala Horizontal

> "O Facebook trabalha com fatias de público em cada conjunto de anúncios. Se eu coloquei um público que tem 2 milhões de pessoas, ele vai atingir 100, 150 mil pessoas. É uma fatia de público. Quando eu duplico, eu pego outra fatia. Então, eu posso encontrar fatias que performam melhores ou piores." — @thiagoroas [DOC — KC213 ~40:00]

**Como funciona o mecanismo de fatia:**

```
Pool de audiência: 2.000.000 pessoas
  ├── Ad Set A → Fatia 1: ~100-150k pessoas
  ├── Ad Set B (duplicado) → Fatia 2: ~100-150k pessoas diferentes
  ├── Ad Set C (duplicado) → Fatia 3: ~100-150k pessoas diferentes
  └── [continuação horizontal...]

NÃO há competição entre ad sets no mesmo pool — eles atingem fatias diferentes.
```

**Implicação:** Duplicar um ad set vencedor não divide o público — acessa uma fatia diferente. É uma forma de multiplicar o alcance sem conflito de leilão.

### 7.4 Campanha de Conscientização — Sempre-On para Nichos de Baixa Consciência

> "Esse tipo de anúncio não para nunca. É um anúncio de conscientização. Para público frio, que é quem não te conhece, e para público quente, que é quem já te conhece." — @thiagoroas [DOC — KC213 ~35:00]

**Quando usar campanha de conscientização always-on:**
- Produto cujo público-alvo não sabe que tem o problema (Nível 1-2 de consciência de Schwartz)
- Nicho onde a dor é latente, não articulada (ex.: gastronomia — ninguém acorda pensando "preciso aprender a cozinhar melhor")

**Estrutura para baixa consciência:**
1. Campanha de conscientização (always-on): educa sobre o problema, não tenta vender
2. Campanha de conversão (principal): para quem foi exposto à campanha de conscientização e/ou tem perfil de compra

**Orçamento para conscientização:** Não documentado nas fontes. [GAP — GAP-TR-04]

---

## 8. Fase 6 — Escala Horizontal e Vertical

### 8.1 Dois Tipos de Escala — Prioridade e Mecanismo

> "A gente tem duas formas de escala no tráfego. Vertical e horizontal. [...] A escala que te leva para o próximo nível é horizontal. [...] A horizontal pode levar seu faturamento. Em 3-4 dias, de R$400/dia para R$10 mil por dia." — @thiagoroas [DOC — KC213 ~40:00]

| Tipo | Mecanismo | Velocidade | Quando usar |
|------|-----------|-----------|------------|
| **Horizontal (primário)** | Novos ad sets, novos públicos, duplicação de vencedores | Rápida (3-4 dias para 10-25x) | Principal método de escala |
| **Vertical (secundário)** | Aumento de budget 10-20%/dia em ad sets existentes | Lenta (meses para 3-5x) | Complementar, não primário |

### 8.2 Escala Horizontal — Protocolo

> "A horizontal pode levar seu faturamento em 3-4 dias de sei lá, R$400/dia para R$10 mil por dia." — @thiagoroas [DOC — KC213 ~40:00]

**Protocolo de escala horizontal:**

```
Ad set vencedor identificado (ROAS positivo, custo finalização dentro da meta)
  │
  ├── Ação 1: Duplicar ad set vencedor
  │     └── Novo ad set acessa fatia diferente do mesmo pool de audiência
  │
  ├── Ação 2: Duplicar para novos públicos
  │     └── Mesmo criativo, público completamente diferente (broad em geral)
  │
  ├── Ação 3: Testar novo criativo em ad set separado
  │     └── Manter o vencedor ativo enquanto testa o novo
  │
  └── Ação 4: Construir pipeline de backup
        └── Qualquer ad set que performa hoje vai parar eventualmente
            → horizontal constrói substitutos antes que o atual sature
```

**Regra anti-saturação:** Todo ad set que está performando hoje vai, em algum momento, parar de performar. A escala horizontal não é só para crescer — é para construir um pipeline de ad sets backup antes que os atuais saturem. [DOC — KC213 ~40:00]

### 8.3 Tríade de Ouro 2026

> "Criativo, converter público frio, aprender otimização de funil. Para mim, é a tríade de ouro para quem quer escalar hoje em dia em 2026." — @thiagoroas [DOC — HC ~30:00-35:00]

**Os três pilares em ordem de prioridade:**

| Pilar | O que é | Por que é essencial |
|-------|---------|---------------------|
| 1. Criativos | Produzir criativos genuinamente diferentes que segmentam pelo conteúdo | É o 80-20 do tráfego no Andromeda |
| 2. Conversão de público frio | Página que converte visitantes que nunca viram sua marca | Sem isso, todo tráfego é desperdício |
| 3. Otimização de funil | Checkpoint, upsell, downsell otimizados | Cada ponto percentual de conversão = múltiplos de ROAS |

### 8.4 Complexidade de Funil — Profit Enhancer, Não Ponto de Partida

> "O iniciante nunca deve começar um perpétuo tentando colocar funis. É muito mais difícil vender perpétuo através de funis do que de tráfego direto. Primeiro começa com tráfego direto. Está funcionando? Coloca funis para potencializar o lucro." — @thiagoroas [DOC — KC213 ~1:10:00]

**Sequência de adição de complexidade de funil:**

| Estágio | O que fazer | O que NÃO fazer ainda |
|---------|------------|----------------------|
| Fundação | Tráfego direto → página de vendas | Funis de email, webinar, WhatsApp |
| Validado | Perpétuo convertendo com ROAS positivo | — |
| Escala | Adicionar email sequences, webinar, mini-launches como profit enhancers | Substituir o tráfego direto |

**Funis de email, webinar e WhatsApp são multiplicadores de lucro para perpétuos validados — não substitutos do tráfego direto.** [DOC — KC213 ~1:10:00]

### 8.5 Indicadores de Prontidão para Escala

Antes de entrar em escala agressiva, confirmar:

- [ ] Funil convertendo com ROAS positivo por 7+ dias consecutivos
- [ ] Custo de finalização dentro da meta por 7+ dias consecutivos
- [ ] Conversão de checkout estável (variação ≤ 3%) [DOC — HC ~25:00]
- [ ] Boleto removido do checkout
- [ ] Pixel intacto (sem contaminação de boleto)
- [ ] Custo de finalização (métrica custom) criado no Ads Manager
- [ ] Budget ≥ R$200/dia estável

---

## 9. Gestão de Desvios (Error Handling)

### 9.1 Tabela de Desvios e Protocolos

| Desvio | Diagnóstico Provável | Ação Imediata | Escalação |
|--------|---------------------|--------------|----------|
| Todos os criativos com custo de finalização alto | Problema na página, não nos criativos | PARAR de testar criativos. Ir para SOP-COPY-VSL-DIAG-001 | Copy Chief |
| ROAS positivo mas custo de finalização alto | Conversão de checkout está baixa — ticket médio compensando | Investigar checkout, orderb bump, preço visível | Performance Analyst |
| ROAS plataforma = 0.8, mas vendas acontecendo | Janela de atribuição — dados incompletos (< 72h) | Aguardar 72h antes de qualquer decisão | Nenhuma — aguardar |
| Ad set parou de performar de repente | Saturação de fatia de público | Duplicar ad set para nova fatia; não editar o original | Traffic Strategist |
| ROAS caiu 3 dias consecutivos | Sinal de diagnóstico — múltiplas causas possíveis | Verificar: mudança no funil, mudança de mercado, nova temporada de CPM | Copy Chief + Performance Analyst |
| Custo de finalização alto em 1 único criativo | Problema de criativo específico | Pausar criativo. Manter os demais. Criar nova variação | Creative Director |
| Pixel disparando eventos sem compra correspondente | Provável boleto no checkout gerando eventos falsos | Verificar configuração de checkout. Remover boleto. | Desenvolvedor + Performance Analyst |
| Budget aumentou mais de 20% de uma vez | Learning phase resetada | Aguardar 7 dias para re-estabilização antes de analisar | Nenhuma — aguardar |

### 9.2 Regra de Um Problema por Vez

Ao diagnosticar um problema de performance, alterar uma variável por vez:

1. Se suspeita de problema de criativo → trocar criativo, manter página igual
2. Se suspeita de problema de página → corrigir página, manter criativos iguais
3. Se suspeita de problema de budget → ajustar budget, manter todo o resto

Alterar múltiplas variáveis simultaneamente torna impossível isolar a causa. [INF — princípio de diagnóstico científico]

### 9.3 Escalonamento de Urgência

| Prioridade | Condição | Tempo de Resposta |
|-----------|----------|-----------------|
| CRÍTICO | ROAS negativo por 3+ dias + budget > R$500/dia | Imediato (< 4h) |
| ALTO | Todos os criativos com custo de finalização alto | Mesmo dia |
| MÉDIO | 1 criativo com problema, demais saudáveis | 48h |
| BAIXO | Métricas secundárias degradadas (CTR, CPC) sem impacto em custo de finalização | Próximo ciclo de análise |

---

## 10. Glossário

| Termo | Definição | Referência |
|-------|-----------|-----------|
| **Ad Set / Conjunto de Anúncios** | Nível intermediário da hierarquia Meta Ads. Define público, budget (ABO) e placement. Onde vive a inteligência de otimização do algoritmo. | Fase 2, item 4.1 |
| **Andromeda** | Nome do paradigma de algoritmo Meta Ads (2025-2026) em que a segmentação é feita automaticamente pelo conteúdo do criativo, não por targeting manual. | Seção 1.3 |
| **ABO (Ad Set Budget Optimization)** | Modelo em que o budget é definido no nível do ad set — cada conjunto tem seu próprio orçamento diário. | Fase 2 |
| **CBO (Campaign Budget Optimization)** | Modelo em que o budget é definido no nível da campanha e o algoritmo distribui entre os ad sets. | Fase 2 |
| **CPC (Custo por Clique)** | Métrica de custo por clique no anúncio. Secundária — não usar como métrica de decisão primária. | Fase 2, item 4.5 |
| **CPM (Custo por Mil Impressões)** | Custo para exibir o anúncio mil vezes. Contextuais — alto CPM pode indicar público qualificado. | Fase 2, item 4.6 |
| **CTR (Click-Through Rate)** | Taxa de cliques no anúncio. Mede apelo do criativo — não mede intenção de compra. | Fase 2, item 4.5 |
| **Custo de Finalização** | Custo por evento de InitiateCheckout (finalização de compra). Métrica soberana do perpétuo. Calculada: Gasto ÷ Initiate Checkout. | Fase 2, item 4.4 |
| **Escala Horizontal** | Criar novos ad sets com novos criativos ou públicos para atingir fatias diferentes do pool de audiência. Método primário de escala. | Fase 6, item 8.2 |
| **Escala Vertical** | Aumentar o budget de ad sets existentes incrementalmente (10-20%/dia). Método secundário. | Fase 6, item 8.1 |
| **Fatia de Público** | Subconjunto de ~100-150k pessoas de um pool maior (ex.: 2M) atingido por um único ad set. | Fase 5, item 7.3 |
| **Janela de Atribuição** | Período durante o qual o Meta atribui conversões a um anúncio após o clique. Padrão atual: 72 horas. | Fase 2, item 4.3 |
| **Learning Phase** | Fase de aprendizado do algoritmo Meta após criação ou edição significativa de um ad set. Dura até o algoritmo otimizar suficientemente. | Fase 5 |
| **Loop Infinito de Criativos** | Anti-padrão: testar criativos indefinidamente sem diagnosticar o problema real (a página). | Fase 4, item 6.2 |
| **Moment-Hijacking** | Estratégia de criar criativos conectados a eventos culturais de alta atenção para aumentar CTR e relevância. | Fase 4, item 6.3 |
| **OCU (One-Click Upsell)** | Tecnologia de upsell que permite compra adicional sem redigitar dados de pagamento — o clique em "sim" completa a compra com o cartão já cadastrado. | Pré-Requisitos |
| **Público Aberto (Broad)** | Configuração de ad set sem targeting manual — zero interesses, lookalikes ou restrições. O algoritmo distribui livremente. | Fase 5, item 7 |
| **ROAS (Return on Ad Spend)** | Retorno sobre o investimento em anúncios. Calculado: Receita atribuída ÷ Gasto com anúncios. | Fase 2, item 4.5 |
| **Pixel Meta** | Script de rastreamento instalado na página de vendas que registra eventos (PageView, InitiateCheckout, Purchase) e alimenta o algoritmo de otimização. | Fase 2 |
| **Tríade de Ouro 2026** | Os três pilares prioritários para escala de perpétuo: (1) Criativos, (2) Conversão de público frio, (3) Otimização de funil. | Fase 6, item 8.3 |

---

## 11. Referências Cruzadas

Este SOP integra-se ao ecossistema de SOPs de VSL perpétuo:

| SOP | ID | Quando usar em relação a este SOP |
|-----|----|------------------------------------|
| Funil VSL Perpétuo — Arquitetura Completa | SOP-COPY-VSL-ARCH-001 | **Antes** — define ticket, upsell, estrutura de funil que este SOP opera |
| VSL — Criação de Script | SOP-COPY-VSL-SCRIPT-001 | **Antes** — cria a página de vendas que o tráfego vai receber |
| VSL — Diagnóstico e Otimização | SOP-COPY-VSL-DIAG-001 | **Paralelo / Depois** — quando performance cair, usar para diagnosticar funil |

**Fluxo completo:**

```
SOP-COPY-VSL-ARCH-001   → Arquitetura e precificação do funil
        ↓
SOP-COPY-VSL-SCRIPT-001 → Criação do script e página de vendas
        ↓
SOP-COPY-VSL-TRAFFIC-001 → Operação de tráfego (este SOP)
        ↓
SOP-COPY-VSL-DIAG-001   → Diagnóstico quando performance cair
```

**Dependências específicas:**

- **Fase 2, item 4.7 (Boleto):** Complementa SOP-COPY-VSL-DIAG-001 seção de diagnóstico de pixel.
- **Fase 4, item 6.2 (Loop Infinito):** Quando detectado, acionar SOP-COPY-VSL-DIAG-001 imediatamente.
- **Fase 5, item 7.4 (Conscientização):** Conecta com SOP-COPY-VSL-ARCH-001 Fase 1 (qualificação de nicho / nível de consciência de Schwartz).
- **Fase 6 (Escala):** Os indicadores de prontidão de escala incluem métricas cobertas em SOP-COPY-VSL-DIAG-001.

---

## 12. GAPs e Verificações Necessárias

| ID | GAP | Fonte | Impacto | Owner | Prazo |
|----|-----|-------|---------|-------|-------|
| GAP-TR-01 | Threshold de R$200/dia é específico para março de 2026 — verificar atualização anual conforme CPM médio do mercado evolui | KC213 ~15:00 | MÉDIO | Traffic Strategist | Revisão anual |
| GAP-TR-02 | Número mínimo de eventos Purchase/semana para usar público aberto não declarado nas fontes | HC ~15:00 | ALTO | Performance Analyst | Próxima versão |
| GAP-TR-03 | Fatia de público de 100-150k por ad set pode variar significativamente por tamanho de nicho e localização — valor aproximado, não testado em todos os contextos | KC213 ~40:00 | MÉDIO | Traffic Strategist | Próxima versão |
| GAP-TR-04 | Proporção recomendada de budget entre campanha de conscientização (always-on) e campanha de conversão não declarada nas fontes | KC213 ~35:00 | ALTO | Traffic Strategist | Próxima versão |
| GAP-TR-05 | Protocolo completo de configuração de campanha (CBO vs. ABO, estrutura exata de testes iniciais) não coberto nas fontes disponíveis | — | ALTO | Traffic Strategist | Nova fonte necessária |
| GAP-TR-06 | Mecanismo técnico exato de como o Andromeda lê o conteúdo de criativos (transcrição de vídeo, metadados, copy de legenda) não documentado nas fontes | HC ~15:00 | MÉDIO | Performance Analyst | Nova fonte necessária |
| GAP-TR-07 | Benchmark de budget inicial para fase de conscientização vs. volume de dados necessários antes de migrar para público aberto | — | ALTO | Traffic Strategist | Nova fonte necessária |
| GAP-TR-08 | Protocolo de reativação de ad set que parou de performar (manter, duplicar, ou pausar e criar do zero?) não declarado explicitamente | KC213 ~40:00 | MÉDIO | Traffic Strategist | Próxima versão |

---

## 13. Quick-Reference Card

> Condensado para uso operacional diário. Para detalhes, consultar as seções completas.

```
┌─────────────────────────────────────────────────────────────────────┐
│           SOP-COPY-VSL-TRAFFIC-001 — QUICK REFERENCE               │
├─────────────────────────────────────────────────────────────────────┤
│ LEIS FUNDAMENTAIS                                                    │
│  • Tráfego sempre fica mais caro — funil deve acompanhar            │
│  • 99% estratégia, 1% apertar botão                                 │
│  • Criativo = 80-20 do tráfego no Andromeda                        │
│  • Funil ANTES de tráfego (nunca o contrário)                       │
├─────────────────────────────────────────────────────────────────────┤
│ BUDGET                                                              │
│  • Mínimo operacional: R$200/dia                                    │
│  • < R$50/dia = armadilha (dados inúteis)                          │
│  • Regra de reinvestimento: 100% do lucro volta ao tráfego          │
│    até atingir R$200/dia estável                                    │
├─────────────────────────────────────────────────────────────────────┤
│ MÉTRICAS — HIERARQUIA OBRIGATÓRIA                                   │
│  1. ROAS / Vendas                                                   │
│  2. Custo de Finalização (Spend ÷ Initiate Checkout)                │
│  3. CTR (só depois de #1 e #2)                                      │
│  4. CPC (contexto secundário)                                       │
│  5. CPM (raramente acionável isolado)                               │
├─────────────────────────────────────────────────────────────────────┤
│ REGRAS CRÍTICAS                                                     │
│  • NUNCA matar criativo em < 72h (janela de atribuição)            │
│  • NUNCA aumentar budget > 20%/dia por ad set                       │
│  • NUNCA ter boleto no checkout de perpétuo                        │
│  • NUNCA comparar métricas entre objetivos diferentes               │
│  • CPM alto ≠ problema (remarketing deve ter CPM alto)             │
├─────────────────────────────────────────────────────────────────────┤
│ DIAGNÓSTICO RÁPIDO                                                  │
│  Todos os criativos com custo finalização alto?                     │
│    → Problema na PÁGINA — ir para SOP-COPY-VSL-DIAG-001           │
│  1 criativo com custo finalização alto?                            │
│    → Problema no CRIATIVO — pausar e criar variação               │
│  ROAS = 0 no dia 1?                                                │
│    → Aguardar 72h antes de qualquer decisão                        │
├─────────────────────────────────────────────────────────────────────┤
│ ESCALA                                                              │
│  Horizontal (primário): Duplicar ad sets vencedores                │
│    → R$400/dia para R$10k/dia em 3-4 dias [DOC]                   │
│  Vertical (secundário): +10-20%/dia em ad sets existentes          │
│    → Lento — meses para 3-5x                                       │
│                                                                     │
│  TRÍADE DE OURO 2026:                                              │
│    1. Criativos (genuinamente diferentes)                           │
│    2. Conversão de público frio (página que vende)                 │
│    3. Otimização de funil (checkout, upsell, downsell)             │
├─────────────────────────────────────────────────────────────────────┤
│ INDICADORES DE PRONTIDÃO PARA ESCALA                               │
│  ✓ ROAS positivo por 7+ dias                                       │
│  ✓ Custo finalização dentro da meta por 7+ dias                    │
│  ✓ Checkout sem boleto                                              │
│  ✓ Pixel limpo (sem contaminação)                                   │
│  ✓ Métrica "Custo de Finalização" criada no Ads Manager            │
│  ✓ Budget ≥ R$200/dia estável                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. Histórico de Revisões

| Versão | Data | Autor | Tipo | Descrição |
|--------|------|-------|------|-----------|
| 0.1.0 | 2026-03-12 | SOP Creator (SOP Factory Squad) | CRIAÇÃO | Versão inicial. Extraída de Kiwicast #213 (hnw1pGcc3_A) e Hotmart Cast (RENU3kEns0E). Cobre 6 fases: budget, infraestrutura de conta, criativos, teste, operação e escala. |

---

*SOP-COPY-VSL-TRAFFIC-001 v0.1.0 — DRAFT — SOP Factory Squad — 2026-03-12*
*Fonte: @thiagoroas (Kiwicast #213 + Hotmart Cast) — 200M+ em tráfego documentados*
*Este documento é genérico — não contém dados de nenhum business específico.*
