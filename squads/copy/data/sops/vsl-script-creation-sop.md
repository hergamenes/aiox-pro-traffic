---
sop_id: SOP-COPY-VSL-SCRIPT-001
title: "VSL Script — Do Diagnóstico ao Script Final"
version: "0.4.0"
status: APPROVED
effective_date: "2026-03-12"
owner: Copy Chief
approver: Squad Chief
review_cycle: "90 days or after significant process change"
next_review: "2026-06-11"
location: "squads/copy/data/sops/vsl-script-creation-sop.md"
training_requirements:
  - "Direct Response copywriting fundamentals (Kennedy, Hopkins)"
  - "Schwartz Awareness Levels framework"
  - "Jon Benson VSL structure methodology"
  - "Manus AI platform operation"
distribution:
  read_access: "Copy Squad agents"
  write_approve_access: "Copy Chief"
  notification: "Updates communicated within 48 hours via squad channel"
---

# SOP: VSL Script — Do Diagnóstico ao Script Final

| Campo | Valor |
|-------|-------|
| **SOP ID** | SOP-COPY-VSL-SCRIPT-001 |
| **Título** | VSL Script — Do Diagnóstico ao Script Final |
| **Versão** | 0.4.0 |
| **Status** | APPROVED |
| **Data Efetiva** | 2026-03-12 |
| **Document Owner** | Copy Chief |
| **Approver** | Squad Chief (independent of document owner, per ISO 9001:2015 Clause 7.5.2(c)) |
| **Review Cycle** | A cada 90 dias ou após mudança significativa de processo |
| **Próxima Revisão** | 2026-06-11 |
| **Process ID** | `vsl-script-creation` |
| **Level** | OPERATIONAL |
| **Executor primary** | Copy Chief |
| **Executor agents** | @jon-benson, @eugene-schwartz, @todd-brown, @dan-kennedy, @claude-hopkins |
| **Scope** | Genérico — sem dados de business específico |
| **Localização** | `squads/copy/data/sops/vsl-script-creation-sop.md` |
| **Distribuição** | Copy Squad agents (leitura); Copy Chief (escrita/aprovação) — atualizações comunicadas em 48h via canal do squad |
| **Last extraction** | 2026-03-12 |

---

## Confidence Key

| Marker | Score | Meaning |
|--------|-------|---------|
| [DOC] | 1.0 | Documentado diretamente na fonte |
| [REP] | 0.8 | Relatado/citado pelo praticante com corroboração |
| [INF] | 0.5 | Inferido de evidência parcial ou contexto |
| [ASM] | 0.3 | Assumido por princípio de domínio, sem evidência direta |

---

## Índice (Table of Contents)

1. [Visão Geral do Processo](#visão-geral-do-processo)
2. [Pré-condições Obrigatórias](#pré-condições-obrigatórias)
3. [Roles e Responsabilidades (RACI)](#roles-e-responsabilidades-raci)
4. [Materiais e Ferramentas](#materiais-e-ferramentas)
5. [Fase 1 — Diagnóstico Schwartz](#fase-1--diagnóstico-schwartz)
6. [Fase 2 — Design do Mecanismo Único](#fase-2--design-do-mecanismo-único)
7. [Fase 3 — Estrutura da VSL (Jon Benson)](#fase-3--estrutura-da-vsl-jon-benson)
8. [Fase 4 — Seleção de Formato](#fase-4--seleção-de-formato)
9. [Fase 5 — Escrita da Copy (Dan Kennedy + Claude Hopkins)](#fase-5--escrita-da-copy-dan-kennedy--claude-hopkins)
10. [Fase 6 — Produção Assistida por IA (Manus AI Workflow)](#fase-6--produção-assistida-por-ia-manus-ai-workflow)
11. [Fase 7 — Validação de Qualidade](#fase-7--validação-de-qualidade)
12. [Fase 8 — Estrutura da Página Pós-Pitch](#fase-8--estrutura-da-página-pós-pitch)
13. [Tratamento de Erros e Escalação](#tratamento-de-erros-e-escalação)
14. [Checklist Final de Saída do SOP](#checklist-final-de-saída-do-sop)
15. [Glossário](#glossário)
16. [Tabela de Confiança por Fase](#tabela-de-confiança-por-fase)
17. [Gaps e Itens para Verificação](#gaps-e-itens-para-verificação)
18. [Documentos Relacionados](#documentos-relacionados)
19. [Referências das Fontes](#referências-das-fontes)
20. [Histórico de Revisões](#histórico-de-revisões)

---

## Visão Geral do Processo

**O que é:** Processo completo de criação de script de VSL para funil perpétuo de tráfego frio, do diagnóstico de awareness até o script final pronto para gravação.

**Por que existe:** VSL mal diagnosticada perde conversão não por falta de técnica de copy, mas por incompatibilidade com o nível de awareness do prospect. O processo começa com o diagnóstico, não com a escrita.

**Quando usar:** Sempre que for criar um novo VSL de raiz — não para refinamento de VSL existente.

**Saída esperada:** Script completo de VSL (20-30 min para ticket ~R$297), estruturado em mínimo 5 micro-vídeos, com no mínimo 3 variações de lead, pronto para gravação.

**Duração estimada:** 2-5 dias (incluindo iteração com IA e revisão humana).

### Fora do Escopo (Out of Scope)

Este SOP NÃO cobre:

- **Refinamento de VSL existente** — para VSLs já ao vivo, usar SOP-COPY-VSL-DIAG-001 (diagnóstico)
- **Tickets acima de R$497** — exige funil de autoridade ou mais tempo de tela; processo documentado como gap (ver Tabela de Confiança)
- **Webinars ao vivo** — estrutura, timing e conversão são diferentes de VSL perpétua
- **Produtos físicos** — a lógica de entrega imediata e ancoragem de valor digital não se aplica
- **Gestão de tráfego** — escala, otimização de CPA e decisões de orçamento cobertos em SOP de tráfego separado
- **Layout e otimização da página pós-pitch** (Fase 8) — incluído como referência contextual, mas é escopo de SOP de página, não de script

### Indicadores de Qualidade do Processo (Process KPIs)

| KPI | Meta | Como Medir |
|-----|------|-----------|
| Tempo total de execução do SOP | 2-5 dias corridos | Data de início (pré-condições) → data de entrega do script revisado |
| Variações de lead produzidas | Mínimo 3 (prática comum: 5) | Contagem de leads escritas e revisadas na saída da Fase 6 |
| Ciclos de revisão humana pós-IA | Máximo 2 iterações | Número de rodadas de revisão no Manus antes de aprovar |
| Cadência de VSLs até encontrar vencedora | Mínimo 1 VSL nova por semana | Data da VSL anterior vs. data de entrega da atual [DOC — @thiagoroas timestamp 01:09:42] |

---

## Pré-condições Obrigatórias

### Qualificações do Executor

Antes de executar este SOP, o Copy Chief responsável deve atender às seguintes qualificações mínimas:

| Domínio | Requisito | Base |
|---------|-----------|------|
| Direct Response copywriting | Conhece os princípios de Kennedy (sequência de comprometimento psicológico, CTA timing) e Hopkins (claims verificáveis, copy testável) | [ASM — sem declaração direta de Thiago sobre qualificação; baseado no perfil do próprio Thiago e no nível técnico do material] |
| Awareness Levels (Schwartz) | Capaz de identificar os 5 níveis e mapear a jornada de awareness em minutagem | [DOC — framework central do SOP] |
| Estrutura VSL (Jon Benson) | Entende a diferença entre lead, corpo, oferta e ascensão; já assistiu ou criou pelo menos 1 VSL completa | [INF — inferido da complexidade das fases 3-5] |
| Uso de IA para copy | Capaz de operar o Manus AI, estruturar prompts com referências e documentos de persona, e iterar refinamentos específicos | [DOC — @thiagoroas timestamp 01:07:32: "não gostei dessa parte, muda da seguinte forma"] |
| Experiência prática | Copywriter humano com capacidade de revisão crítica de output de IA; NÃO pode ser só IA sem revisão humana | [DOC — @thiagoroas: "IA NÃO entrega perfeito. Entrega bom o suficiente para testar. A iteração é humana."] |

> Thiago confirma ter um copywriter sênior na equipe (Mateus) para revisão, mesmo usando IA para geração em volume: "Tenho um cop muito bom que é o Mateus. Só que como a gente produz em muita quantidade, não dá para ele fazer tudo." [DOC — timestamp 01:16:33]

**Se o executor não atende essas qualificações:** Escale para o Copy Chief ou contrate revisão de especialista em direct response antes de gravar.

### Documentos Obrigatórios

Antes de iniciar, confirme que os seguintes documentos estão disponíveis E atendem ao critério de completude:

- [ ] **Documento de persona:** dores, desejos internos/externos, objeções [REP]
  - Completo quando: contém pelo menos as categorias dores, desejos internos, desejos externos, objeções e descrição do que o produto entrega — todos preenchidos
  - Incompleto quando: faltam categorias ou campos vazios. Ação: PARE. Não inicie a Fase 1 sem persona completa.
- [ ] **Definição do ticket (valor exato do front)** [DOC]
  - Completo quando: valor numérico exato definido (ex.: R$297). Não aceitar "em torno de R$300".
- [ ] **Definição do nicho e tamanho estimado de audiência** [REP]
  - Completo quando: nicho descrito e estimativa de potencial de audiência documentada (mínimo: referência a big nicho 10M+, nicho médio, ou nicho profissional)
- [ ] **Oferta do front definida (o que o produto entrega)** [DOC]
  - Completo quando: a transformação prometida está descrita em linguagem de prospect, não em lista de módulos
- [ ] **VSLs próprias já escaladas disponíveis como referência estrutural (para uso com IA)** [REP]
  - Completo quando: pelo menos 1 VSL com evidência de escala (anúncio ativo por semanas/meses) está salva e acessível para upload no Manus. Se não existir, o executor deve identificar uma VSL de referência do mercado (com cautela — Thiago prefere as próprias)

> Se qualquer pré-condição estiver ausente ou incompleta, PARE aqui. Não existe VSL boa sem diagnóstico de persona completo.

### Contexto de Mercado Obrigatório (Paradigma Andromeda)

Antes de iniciar a criação do script — especialmente ao pensar no criativo que vai alimentar a VSL — o executor deve internalizar as seguintes mudanças estruturais de mercado (2025-2026):

> **CREATIVE-03 [DOC — Thiago Roas, Hotmart Cast ~15:00-20:00]:** No paradigma Andromeda (algoritmo Meta 2025-2026), a segmentação acontece via copy e conteúdo do criativo, não via targeting manual de público. A plataforma lê as palavras do vídeo e distribui para o público correto automaticamente. Implicação para o script: as palavras usadas no lead e nos primeiros minutos da VSL definem quem a Meta vai entregar esse conteúdo. Copy vaga = público vago = conversão baixa.
>
> "O criativo, ele tem um papel de segmentação. Hoje a segmentação é toda por criativo. Não é por públicos mais. [...] A plataforma já está otimizando o pull." — @thiagoroas [DOC — Hotmart Cast ~15:00-20:00]

> **CREATIVE-04 [DOC — Thiago Roas, Hotmart Cast ~15:00-20:00]:** No paradigma Andromeda, a Meta quer criativos genuinamente diferentes — não variações com apenas o gancho inicial alterado. A prática de criar múltiplas variantes trocando somente o hook está se tornando obsoleta e pode sinalizar conteúdo redundante ao algoritmo. Implicação para o script: leads diferentes precisam ser estruturalmente distintas — formato, abordagem, tipo de abertura — não apenas a primeira frase.
>
> "A meta quer criativo efetivamente diferente. Por isso não se mata a rede social com um monte de criativo [semelhante]. [...] A galera está rodando hoje [mudar só gancho]. Mas isso está morrendo aos poucos." — @thiagoroas [DOC — Hotmart Cast ~15:00-20:00]

**Implicação operacional para este SOP:** As 3+ variações de lead obrigatórias (Fase 3.3) devem ser estruturalmente diferentes entre si — tipo (story/problem/mechanism), formato visual e abordagem — não variações do mesmo lead com gancho trocado.

---

## Roles e Responsabilidades (RACI)

| Atividade | Copy Chief | VSL Scriptwriter Agent | Fonte Especialista (ex.: @thiagoroas) | Squad Chief |
|-----------|-----------|----------------------|--------------------------------------|-------------|
| Validar pré-condições | **A** | R | — | I |
| Diagnóstico de awareness (Fase 1) | **A** | R | C | — |
| Design do mecanismo único (Fase 2) | **A** | R | C | — |
| Estrutura e planejamento da VSL (Fases 3-4) | **A** | R | C | — |
| Escrita da copy (Fase 5) | **A** | R | C | — |
| Produção com IA — Manus AI (Fase 6) | **A** | R | — | — |
| Revisão humana obrigatória do script | **A** | R | — | — |
| Validação de qualidade (Fase 7) | **A** | R | C | — |
| Aprovação final para gravação | **A** | — | — | I |
| Escalação em bloqueio >4h | **A** | R | C | I |
| Aprovação do SOP (documento) | I | — | — | **A** |

**Legenda:**
- **R** = Responsible (executa)
- **A** = Accountable (responsável final)
- **C** = Consulted (consultado antes da decisão)
- **I** = Informed (notificado após a decisão)

> Nota: deve haver exatamente um (A) por atividade. O Copy Chief é o Accountable operacional de todas as fases de execução. O Squad Chief é Accountable apenas pela governança do documento SOP em si.

---

## Materiais e Ferramentas

### Ferramentas de Software

| Ferramenta | Uso | Obrigatório? |
|-----------|-----|-------------|
| **Manus AI** | Geração e refinamento iterativo de scripts de VSL (Fase 6) | Sim — ferramenta principal [DOC — @thiagoroas timestamp 01:07:32] |
| **GPT-4 / Claude Sonnet** | Substituto do Manus AI em caso de indisponibilidade | Não — fallback apenas [ASM 0.3] |
| **Editor de texto / Google Docs** | Revisão humana e edição do script final | Sim |
| **Plataforma de hospedagem de vídeo** | Upload dos micro-vídeos gravados | Sim (pós-gravação) |
| **Plataforma de analytics de vídeo** | Medição de retenção minuto a minuto e play rate | Sim (pós-publicação) |

### Documentos de Input

| Documento | Conteúdo Mínimo | Pré-condição? |
|-----------|----------------|--------------|
| Documento de persona | Dores, desejos internos/externos, objeções, transformação prometida | Sim (bloqueante) |
| VSLs próprias escaladas | Pelo menos 1 VSL com evidência de escala (anúncio ativo por semanas/meses) | Sim (para Fase 6) |
| Definição de oferta do front | Transformação em linguagem de prospect (não lista de módulos) | Sim (bloqueante) |
| Mapa de awareness (saída Fase 1) | Jornada minuto a minuto, nível de entrada, mapa de crenças | Sim (gerado no SOP) |
| Mecanismo único (saída Fase 2) | Nome proprietário, arquitetura de 4 camadas | Sim (gerado no SOP) |

### Acesso e Permissões

| Recurso | Quem precisa | Como obter |
|---------|-------------|-----------|
| Conta Manus AI | Copy Chief + VSL Scriptwriter Agent | Provisionar antes de iniciar Fase 6 |
| Acesso às VSLs escaladas da biblioteca | Copy Chief | Solicitar ao proprietário do acervo |
| Acesso à plataforma de analytics de vídeo | Copy Chief | Solicitar ao gestor de tráfego |

---

## Fase 1 — Diagnóstico Schwartz

**Agente responsável:** @eugene-schwartz
**Objetivo:** Definir o ponto de entrada de awareness e mapear a jornada que o VSL precisa conduzir.

> "VSL precisa GRADUAR o prospect de Level 2-3 até Level 5 no momento do pitch." — @thiagoroas [DOC]

### 1.1 Identificar Nível de Entrada de Awareness

O tráfego frio de VSL a R$297 **não** converte em Level 1 (Unaware). O criativo pré-filtra o awareness — quem clica já admite o problema. [DOC]

| Nível | Estado | Característica |
|-------|--------|---------------|
| Level 1 | Unaware | Não sabe que tem o problema |
| Level 2 | Problem Aware | Sabe do problema, não conhece solução |
| Level 3 | Solution Aware | Conhece soluções, não conhece seu produto |
| Level 4 | Product Aware | Conhece seu produto, ainda não comprou |
| Level 5 | Most Aware | Pronto para comprar |

**Entrada padrão para VSL frio R$297:** Level 2-3 [DOC]

> "Tráfego frio de VSL R$297 NÃO é Unaware. O criativo pré-filtra awareness. Quem clica já admite o problema." — @thiagoroas [DOC]

**Ação:** Confirme o nível de entrada observando: qual a linguagem do criativo que vai trazer esse tráfego? Criativo de conteúdo = Level 2. Criativo de mecanismo = Level 3. Criativo de produto/depoimento = Level 4. [DOC]

- [ ] Nível de entrada de awareness definido: _______

### 1.2 Mapear a Jornada de Awareness Dentro da VSL

Para VSL de ticket R$297, a jornada minuto a minuto é: [DOC]

| Minuto | Nível | Operação de Copy |
|--------|-------|-----------------|
| 0–1 | Level 2 (Problem Aware) | LEAD — gancho que valida a dor |
| 1–4 | Level 2 → 3 (transição) | Agitação do problema + introdução do conceito de solução |
| 4–10 | Level 3 (Solution Aware) | Apresentação do MECANISMO |
| 10–20 | Level 3 → 4 | Prova social, credenciais, demonstração |
| 20–25 | Level 4 (Product Aware) | Revelação do produto, diferenciação |
| 25–30+ | Level 4 → 5 | Oferta, ancoragem, urgência, CTA |

> "Retenção = TEMPO necessário para completar a GRADUAÇÃO de awareness. Se o prospect sai no minuto 5, nunca passou de Level 2 para Level 3." — @thiagoroas [DOC]

**Implicação operacional:** Copy longa não é questão de volume — é de tempo necessário para completar a jornada. Não corte a VSL sem verificar se a jornada de awareness está completa.

- [ ] Jornada de awareness mapeada minuto a minuto

### 1.3 Identificar Sofisticação de Mercado

| Estágio | Característica | Resposta de Copy |
|---------|---------------|-----------------|
| 1 | Nicho virgem | Claim direto |
| 2 | Primeiras promessas | Promessa ampliada |
| 3 | Metodologias saturadas | Mecanismo único |
| 4 | Metodologias copiadas | Posicionamento acima dos métodos |
| 5 | Tudo foi tentado | Transcender a categoria |

**Estágio padrão para mercados digitais BR 2025:** Estágio 3-4 [REP]

> "'Princípios > Metodologia' é manobra de Estágio 5 — transcender a categoria." — Análise @todd-brown [DOC]

- [ ] Estágio de sofisticação de mercado definido: _______

### 1.4 Mapear Crenças a Criar e Crenças a Quebrar

> "CRIAR crença = mover de Level 1-2 para Level 3 (introdução de mecanismo). QUEBRAR crença = remover objeção que BLOQUEIA transição entre níveis. Cada crença aceita torna a próxima inevitável." — @thiagoroas [DOC]

**Ação:** Liste para cada transição de nível:

| Transição | Crença a Criar | Crença a Quebrar |
|-----------|---------------|-----------------|
| L2 → L3 | ___ | ___ |
| L3 → L4 | ___ | ___ |
| L4 → L5 | ___ | ___ |

- [ ] Mapa de crenças preenchido

### 1.5 Selecionar Tipo de Lead com Base no Awareness

| Nível de Entrada | Tipo de Lead | Exemplo |
|-----------------|-------------|---------|
| Level 1-2 | Story lead | "Eu estava trabalhando 14 horas por dia quando..." |
| Level 2 | Problem lead | "Se você já tentou X e não funcionou..." |
| Level 3 | Mechanism lead | "Descobrimos que o verdadeiro motivo é..." |
| Level 4-5 | Offer lead | "Por tempo limitado, acesso a..." |

**Regra:** Para funil frio R$297, default é story lead ou problem lead. [DOC]

- [ ] Tipo de lead selecionado: _______

**Critério de saída Fase 1:**
- [ ] Nível de entrada definido
- [ ] Jornada de awareness mapeada
- [ ] Sofisticação de mercado identificada
- [ ] Mapa de crenças preenchido
- [ ] Tipo de lead selecionado

---

## Fase 2 — Design do Mecanismo Único

**Agente responsável:** @todd-brown
**Objetivo:** Identificar ou criar o Mecanismo Único que diferencia o produto de toda solução anterior.

> Teste de unicidade: "Can a competitor copy this mechanism easily? If yes, it's not unique enough." — Princípio E5 Method @todd-brown [REP]

### 2.1 Categorias de Mecanismo (E5 Method)

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| Process | Processo nomeado com resultado específico | "Funil SR 418" |
| Discovery | Descoberta de ponto-ótimo ou verdade oculta | "Ticket de Ouro R$297" |
| Positioning | Posicionamento acima da categoria | "Princípios > Metodologia" |
| Contrarian | Contra-intuitivo verificável | "Order bump diminui conversão" |
| Speed | Entrega mais rápida via mecanismo | "VSL factory via IA" |
| Simplicity | Uma métrica que domina todas as outras | "Custo de Checkout como Norte" |

[DOC — @todd-brown]

- [ ] Categoria de mecanismo definida: _______
- [ ] Mecanismo nomeado (nome proprietário): _______

### 2.2 Arquitetura de Posicionamento (4 Camadas)

O mecanismo se posiciona melhor quando construído sobre 4 camadas empilhadas: [DOC — @todd-brown]

| Camada | Função | Exemplo |
|--------|--------|---------|
| Layer 1: Princípios | Autoridade — posiciona-se acima do campo | "Princípios atemporais do DR" |
| Layer 2: Matemática | Rigor — fala em equações, não em "otimizar" | "ROAS 2 exige CPA máx R$130" |
| Layer 3: Contrarian | Expertise — contra-intuitivo e verificável | "Order bump destrói conversão" |
| Layer 4: Sistemas | Produto — prova de longevidade | "14 meses rodando, 1M+/mês" |

> "Princípios atemporais + Matemática específica + Contra-senso verificável + Sistemas com prova = Autoridade indiscutível" — @todd-brown [DOC]

- [ ] Camadas de posicionamento do mecanismo definidas

### 2.3 Teste de Unicidade do Mecanismo

Responda:

1. Um concorrente consegue copiar este mecanismo em 24h? Se sim, adicione especificidade (números, nomes proprietários, história de origem).
2. O nome do mecanismo já carrega prova? Ex: "Funil SR 418" — o número já é prova implícita. [DOC — @todd-brown]
3. O mecanismo explica por que as soluções anteriores do prospect falharam?

- [ ] Mecanismo passou no teste de unicidade

**Critério de saída Fase 2:**
- [ ] Mecanismo único definido e nomeado
- [ ] Arquitetura de posicionamento em 4 camadas construída
- [ ] Mecanismo passou no teste de unicidade

---

## Fase 3 — Estrutura da VSL (Jon Benson)

**Agente responsável:** @jon-benson
**Objetivo:** Definir a estrutura modular da VSL antes de escrever qualquer palavra.

> "VSL replica a jornada emocional completa de um lançamento. Todos os benefícios do lançamento, ajustando uma única variável: o ticket." — @jon-benson [DOC]

### 3.1 Estrutura Macro

A VSL para ticket R$297 tem 4 blocos: [DOC — @jon-benson]

```
LEAD (1-4 min)
  → Micro-vídeo independente
  → Pode ter formato/cenário completamente diferente do restante
  → É a "headline" da VSL

CORPO
  → Série de blocos alternando:
     a) Criação de crença (move prospect para nível de awareness acima)
     b) Quebra de crença (remove objeção bloqueadora)
  → Cada bloco resolve UMA ÚNICA operação
  → Prova social intercalada (sem depoimentos longos — destroem retenção)

OFERTA
  → Revelação do produto e construção da oferta irresistível
  → Ancoragem de valor antes do preço
  → Preço revelado → página de vendas ABRE AUTOMATICAMENTE (não apenas botão)

ASCENSÃO
  → Imediata — sem delay após a compra
```

- [ ] Estrutura macro validada

### 3.2 Segmentação em Micro-Vídeos

**Mínimo de micro-vídeos:** 5 [DOC — @jon-benson / @thiagoroas]

| Micro-vídeo | Conteúdo sugerido | Duração aprox. |
|------------|-------------------|---------------|
| MV-01 | Lead (pode ser formato diferente) | 1-4 min |
| MV-02 | Agitação de problema + introdução de mecanismo | 3-5 min |
| MV-03 | Prova social + credenciais + demonstração | 4-6 min |
| MV-04 | Revelação do produto + diferenciação | 3-5 min |
| MV-05 | Oferta + ancoragem + urgência + CTA | 3-5 min |

**Por que micro-vídeos:** [DOC — @jon-benson]
- Substituição cirúrgica de seções sem regravar tudo
- Teste A/B de seções individuais
- Localização precisa de problema de retenção (se MV-03 sangra, o problema está ali)

- [ ] Segmentação em micro-vídeos definida (mínimo 5)

### 3.3 Planejamento de Leads Múltiplos

**Mínimo de leads:** 3. Prática comum: 5. [DOC — @thiagoroas]

> "De 5 leads testadas, 4 deram ruim, 1 deu muito boa — essa salvou a VSL inteira." — @thiagoroas [DOC]

**Para cada lead, defina:**
- Tipo (story / problem / mechanism / offer)
- Formato visual (casual, call center, podcast, palestra, nicho-congruente)
- Gancho de abertura (primeira frase)
- Duração (1-4 min)

| Lead | Tipo | Formato | Gancho de abertura |
|------|------|---------|-------------------|
| Lead A | ___ | ___ | ___ |
| Lead B | ___ | ___ | ___ |
| Lead C | ___ | ___ | ___ |

> Leads são testados como peças independentes. O restante da VSL permanece o mesmo.

**C-01 — Ângulo de Moment-Hijacking [DOC — Thiago Roas, Kiwicast #213 ~1:00:00]**

Criativos e leads ligados a eventos culturais do momento performam dramaticamente melhor por aproveitar atenção já ativada no mercado. A condição crítica: o evento cultural deve conectar com a dor/desejo central da persona — não é apenas usar o trend como isca de clique.

> "Criativos ligados ao momento performam muito bem. Então, por exemplo, aconteceu algo. Filme da Barbie. A gente botou o criativo ligado ao filme da Barbie. E performam bem. Pandemia: criativos com máscara. Então, fatos muito conhecidos do público em geral. Quando você cria criativos ligados a isso, tend a performar muito bem." — @thiagoroas [DOC — Kiwicast #213 ~1:00:00]

**Aplicação para leads:** Uma das variações de lead pode usar um evento cultural relevante como gancho de abertura, conectando imediatamente à dor da persona. Esta é uma técnica de escala — não de validação inicial (veja C-03 abaixo para a sequência correta).

**C-03 — Progressão de Ângulo: Dor Direta → Dor Adjacente [DOC — Thiago Roas, Kiwicast #213 ~1:05:00]**

Existe uma sequência obrigatória para os ângulos dos leads:

> "Para escalar, eu posso criar criativos que peguem dores adjacentes, ou desejos adjacentes. [...] Só que você não pode começar por isso. Isso é um processo de escala. De teste. Primeiro você tem que ir direto na dor do seu público." — @thiagoroas [DOC — Kiwicast #213 ~1:05:00]

| Fase | Ângulo | Exemplo (oratória) | Quando usar |
|------|--------|-------------------|------------|
| Fase 1 — Validação | Dor direta do avatar principal | "Aprenda a falar em público" | Sempre primeiro |
| Fase 2 — Escala | Desejo/dor adjacente | "Quem fala bem ganha mais"; "Seja promovido pela comunicação" | Após validar a dor direta |

**Implicação:** Na criação de 3+ leads, a lead principal (Lead A) deve sempre usar a dor direta do avatar. Leads B e C podem explorar ângulos adjacentes — mas somente se o avatar primário já foi confirmado.

- [ ] Mínimo 3 leads planejados com gancho definido
- [ ] Lead A usa dor direta do avatar primário
- [ ] Leads adicionais estruturalmente distintas (formato, tipo, abordagem — não apenas gancho trocado)

### 3.4 Especificações de Duração

Para ticket R$297: [DOC — @thiagoroas]

| Métrica | Target |
|---------|--------|
| Duração total | 20-30 minutos |
| Pitch timing | ~20-25 minutos |
| Play rate | Acima de 60-70% |
| Retenção no 1º minuto | Acima de 60% (abaixo de 40% = VSL morta) |
| Retenção no pitch | Acima de 30% |

> "Prefiro 1000x VSL que retém até o pitch mas não converte vs o contrário." — @thiagoroas [DOC]

- [ ] Especificações de duração validadas

**Critério de saída Fase 3:**
- [ ] Estrutura macro definida (Lead / Corpo / Oferta / Ascensão)
- [ ] Mínimo 5 micro-vídeos planejados
- [ ] Mínimo 3 leads planejados com ângulos estruturalmente distintos (não apenas gancho trocado)
- [ ] Lead A usa dor direta do avatar; leads adicionais podem usar ângulos adjacentes
- [ ] Duração-alvo definida

---

## Fase 4 — Seleção de Formato

**Agente responsável:** @jon-benson
**Objetivo:** Selecionar o formato visual da VSL antes de escrever o script.

> "Formato decide RETENÇÃO. Copy decide CONVERSÃO. Mas sem retenção, copy não chega até a conversão." — @jon-benson / @thiagoroas [DOC]

**Hierarquia de retenção:**

| Rank | Fator | O que controla |
|------|-------|---------------|
| 1 | FORMATO | Retenção (é o rei) |
| 2 | Copy | Conversão |
| 3 | Apresentação | Qualidade percebida |

### 4.1 Formatos Vivos vs. Mortos (2025)

**MORTO:** Expert olhando para câmera lendo teleprompter. [DOC — @thiagoroas]

**VIVOS:**

| Formato | Descrição | Melhor para |
|---------|-----------|------------|
| Casual / cotidiano | Expert abrindo geladeira, servindo água, ambiente real | Proximidade, quebra de barreira |
| Call center | Expert com fone, simulando atender ligação | Autoridade consultiva |
| Podcast / entrevista | Dois participantes conversando | Credibilidade via terceiro |
| Talk show | Expert recebendo convidados | Prova social + autoridade |
| Palestra | Expert em palco com microfone | Autoridade, público ao vivo |
| Nicho-congruente | Chef fazendo receita; homem com futebol na TV | Congruência identitária |

> "O formato ideal disfarça a mensagem de vendas e parece CONTEÚDO que a pessoa quer consumir independente de interesse no nicho." — @thiagoroas [DOC]

**Case documentado:**
> "Prisciane Pereira (renda extra): VSL padrão → call center com fone. Copy mínima. Resultado: conversão 2X." — @thiagoroas [DOC]

- [ ] Formato selecionado para cada micro-vídeo (pode variar entre MV)

### 4.2 Coerência Criativo-VSL

O lead da VSL deve ser continuação natural do criativo de anúncio. [DOC — @jon-benson]

> "O criativo cria estado emocional + expectativa. Descontinuidade entre ad e VSL = leak de retenção." — @jon-benson [DOC]

**Ação:** Identifique o formato do melhor criativo de tráfego em performance. O lead da VSL deve espelhar esse formato.

> "Se tem problema de retenção: pegar o melhor criativo de ads e transportar o FORMATO dele para o início da VSL. Se explodiu retenção, transformar a VSL inteira nesse formato." — @thiagoroas [DOC]

- [ ] Formato do lead alinhado com o criativo de melhor performance

### 4.3 Regra de Formato do Expert

> "Quando o expert NÃO está confortável com o criativo, a performance cai — não importa a qualidade do roteiro." — @jon-benson / Rafa Marques [REP]

**Ação:** Valide com o expert se o formato selecionado é confortável. Se não for, priorize conforto do expert sobre o formato teoricamente superior.

- [ ] Conforto do expert com o formato validado

**Critério de saída Fase 4:**
- [ ] Formato definido para cada micro-vídeo
- [ ] Coerência criativo-VSL validada
- [ ] Expert validou conforto com o formato

---

## Fase 5 — Escrita da Copy (Dan Kennedy + Claude Hopkins)

**Agente responsável:** @dan-kennedy (princípios DR) + @claude-hopkins (audit de copy)
**Objetivo:** Escrever o script completo, bloco a bloco, seguindo o sequenciamento de awareness mapeado na Fase 1.

### 5.1 Princípio Central: Escreva para a Oferta, Não para o Produto

> "Para o processo de venda, o produto não importa. A pessoa só vai ter acesso ao produto depois que ela comprar. O que ela vê é que importa e o que ela vê é a tua oferta." — @thiagoroas [DOC]

**Implicação prática:**
- Não descreva funcionalidades do produto — descreva a transformação prometida
- A oferta é a promessa + mecanismo + prova social (não o produto em si)
- Copy ruim: "12 módulos, 47 aulas, 6 bônus" — Copy boa: "Em 3 semanas você vai [resultado específico]"

### 5.2 Estrutura de Copy do LEAD (Bloco MV-01)

O lead funciona como a headline da VSL. É o momento de maior taxa de abandono. [DOC — @jon-benson]

**Para cada variação de lead, escreva:**

```
[GANCHO - primeiros 5-10 segundos]
  → Pattern interrupt (inesperado)
  → Relevância (fala diretamente com o avatar)
  → Promessa de revelação (o que vão descobrir se ficarem)

[PROMESSA DE PERMANÊNCIA - 10-30 segundos]
  → "Se você ficar até o final..."
  → Antecipação do mecanismo (sem revelar ainda)
  → Criação de curiosidade sobre a continuação

[VALIDAÇÃO DA DOR - 30-90 segundos]
  → Nomear o problema com precisão cirúrgica
  → Fazer o prospect sentir que você o conhece
  → Preparar para a transição para Level 3
```

- [ ] Todas as variações de lead escritas (mínimo 3)

### 5.3 Estrutura de Copy do CORPO (Blocos MV-02 a MV-04)

Cada bloco do corpo resolve **uma** das operações abaixo: [DOC — @jon-benson]

**Operação A: Criação de Crença**
- Move o prospect de Level N para Level N+1
- Introduz nova evidência, lógica ou prova
- Finaliza com micro-confirmação interna do prospect

**Operação B: Quebra de Crença**
- Remove objeção que bloqueia a próxima transição
- Nomeia a crença errada sem humilhar quem a tem
- Substitui pela crença nova que abre o próximo passo

**Regra de intercalação:** Criar crença → Prova → Criar crença → Quebrar objeção → Prova → ... [INF]

**F-04 — Primeira objeção a quebrar: "é golpe?" [DOC — Thiago Roas, Kiwicast #213 ~45:00]**

> "Qual a primeira objeção da pessoa que cai na sua página de vendas? Não é se o produto é bom. Não é se o produto é caro. Não é se é o melhor produto. Não. A primeira objeção que a pessoa tem é será que se é golpe." — @thiagoroas [DOC — Kiwicast #213 ~45:00]

A objeção de fraude/golpe é a objeção implícita que bloqueia todas as outras. Se o prospect não resolveu "isso é real?", ele não vai processar o mecanismo, não vai avaliar o preço, não vai considerar o upsell. Essa objeção é quebrada por: demonstração de autoridade, prova social reconhecível, logos de plataformas conhecidas, screenshots verificáveis, credenciais. Esta quebra de crença pertence ao início do corpo da VSL (Bloco MV-02), antes da apresentação do mecanismo.

**Sequência recomendada de quebra de crenças no corpo:**
1. Quebrar "é golpe?" → autoridade + prova social inicial (MV-02 abertura)
2. Apresentar mecanismo → criar crença no método
3. Provas específicas → corroborar o mecanismo
4. Quebrar objeções de execução ("funciona para mim?")
5. Revelar produto + ancoragem (MV-04/MV-05)

- [ ] Objeção de fraude/golpe endereçada no início do corpo (MV-02)

**Sobre depoimentos no corpo:**
> "SEM depoimentos longos no meio (destroem retenção)." — @thiagoroas [DOC]
Use prova social intercalada brevemente. Depoimentos completos ficam na página de vendas pós-pitch.

- [ ] Corpo escrito em blocos (cada bloco = uma operação)
- [ ] Depoimentos longos removidos do corpo

### 5.4 Sequenciamento de CTA

> "CTA deve aparecer no exato momento em que o próximo pensamento natural do leitor é 'onde eu compro?'" — @dan-kennedy [DOC]

**Regra absoluta:** Nenhum CTA antes de completar a graduação de awareness até Level 4-5. [DOC]

> "CTA no topo vai contra princípios fundamentais: gerar conexão → gerar autoridade → gerar desejo → gerar ancoragem → SÓ DEPOIS fazer pitch." — @thiagoroas [DOC]

**Anti-padrão documentado:**
> "Empresa com 200M+/mês removeu CTAs do topo → triplicou conversão." — @thiagoroas [DOC]

- [ ] CTA posicionado após conclusão da graduação de awareness

### 5.5 Copy da Oferta (Bloco MV-05)

**3 Pilares da Oferta:** [DOC — @thiagoroas]

| Pilar | Descrição | Anti-padrão |
|-------|-----------|-------------|
| Brilhe os Olhos | Oferta que gera desejo emocional | Oferta genérica, técnica |
| Seja Simples | Resultado claro, não lista de módulos | "465 horas, 312 aulas" |
| Seja Rápida | Promessa de resultado em curto prazo | Jornada longa e trabalhosa |

**Ancoragem de preço:** Apresente o valor percebido antes do preço real. Construa a âncora alta antes de revelar R$297.

**Copy de urgência e escassez (ambiente PIX):**

> "PIX = dor imediata. Cada passo (abrir app, copiar código, confirmar) é oportunidade para o cérebro racional entrar e dizer 'você realmente precisa disso?'" — @dan-kennedy [DOC]

Urgência e escassez reais devem ser **mais fortes** num ambiente PIX — não mais fracas. A copy precisa fazer o trabalho de dissociação que o cartão fazia automaticamente. [DOC]

**Psicologia do preço R$297:** [DOC — @dan-kennedy]
- Abaixo da barreira cognitiva dos R$300
- O "7" no final tem histórico empírico superior ao "0"
- Preço máximo antes que o processo de decisão mude de emocional para racional

- [ ] Copy de oferta escrita com os 3 pilares
- [ ] Ancoragem de valor construída antes do preço
- [ ] Urgência e escassez adequadas ao ambiente PIX

### 5.6 Copy do Upsell (se aplicável)

**Headline do upsell — regra crítica:** [DOC — @thiagoroas / @eugene-schwartz]

> "Headline NÃO pode parecer venda (quebraria o estado de 'modo sim'). Função da headline: fazer a pessoa ASSISTIR o vídeo, não comprar imediatamente." — @thiagoroas [DOC]

| Abordagem | Efeito |
|-----------|--------|
| "Obrigado pela compra" | Quebra o estado emocional — diz ao cérebro "acabou" |
| "Ainda falta um passo" | Mantém o "modo sim" — gera curiosidade |
| "Tem um presente para você" | Antecipação positiva, não sensação de venda |

> "Gratidão diz ao cérebro: 'acabou'. Curiosidade mantém o 'modo sim'." — @thiagoroas [DOC]

- [ ] Headline do upsell validada contra anti-padrão de gratidão prematura

### 5.7 Escalação de Comprometimento

> "Front converte prospectos em clientes — elimina ceticismo, não gera lucro. Upsell = momento de estado máximo de compra — 'modo sim'." — @dan-kennedy [DOC]

**Sequência psicológica:**
1. Front → elimina ceticismo, cria o primeiro "sim"
2. Upsell → aproveita o estado máximo de compra
3. Downsell → não é desconto — é remoção de elemento (senão treina o mercado a esperar desconto) [DOC]

- [ ] Lógica de escalação de comprometimento validada

**Critério de saída Fase 5:**
- [ ] Todos os blocos de copy escritos
- [ ] Mínimo 3 variações de lead completas
- [ ] CTA posicionado corretamente
- [ ] Oferta construída com os 3 pilares
- [ ] Copy de upsell validada (se aplicável)

---

## Fase 6 — Produção Assistida por IA (Manus AI Workflow)

**Agente responsável:** Copy Chief (supervisão) + Manus AI (geração)
**Objetivo:** Acelerar a produção de variações usando IA como rascunhador, com revisão humana obrigatória.

> "IA NÃO entrega perfeito. Entrega bom o suficiente para testar. A iteração é humana." — @thiagoroas [DOC]

### 6.1 Setup de Inputs para a IA

**Ferramenta:** Manus AI (preferido ao GPT para copy de VSL) [DOC — @thiagoroas]

**Inputs obrigatórios para a sessão:**

- [ ] **Input 1:** VSLs próprias já escaladas (estrutura validada) como referência estrutural
  > "Subir VSL, só que eu subo as minhas. Subo as minhas que eu sei que estão escaladas. Eu não pego de fora porque eu já tenho as minhas." — @thiagoroas [DOC]
- [ ] **Input 2:** Documento de persona completo: dores, desejos internos/externos, objeções, o que o produto entrega
- [ ] **Input 3:** Mapa de awareness e mecanismo único (saídas das Fases 1 e 2)

### 6.2 Processo de Geração

| Passo | Ação | Output esperado |
|-------|------|----------------|
| 1 | Upload das VSLs escaladas como referência estrutural | IA entende o padrão |
| 2 | Upload do documento de persona completo | IA conhece o avatar |
| 3 | Solicitar 2-3 variações de VSL modelando estrutura das referências | 2-3 scripts rascunho |
| 4 | Refinar iterativamente dentro do Manus | Scripts refinados |
| 5 | Copywriter humano revisa e ajusta | Script final de cada variação |

[DOC — @thiagoroas]

**Instrução de refinamento:** Fazer mudanças específicas sem sair do contexto da sessão. Ex: "Não gostei dessa parte, muda da seguinte forma: [instrução específica]." [REP — @thiagoroas]

- [ ] Sessão Manus configurada com os 3 inputs
- [ ] 2-3 variações geradas
- [ ] Refinamento iterativo realizado
- [ ] Revisão humana concluída

### 6.3 Cadência de Produção

**Regra de cadência:** Mínimo 1 VSL nova por semana até encontrar a VSL escalada. [DOC — @thiagoroas]

> "Variação de conversão entre VSLs pode ser brutal — 1 lead salva uma VSL inteira." — @thiagoroas [DOC]

- Após encontrar a VSL vencedora: parar iteração e escalar
- Não otimizar indefinidamente — procurar o vencedor, escalar o vencedor

**Expectativa de leads:**
> "De 5 leads testadas, espere 4 ruins e 1 ótima." — @thiagoroas [DOC]

- [ ] Cadência de produção definida (mínimo 1/semana)

**Critério de saída Fase 6:**
- [ ] Mínimo 1 script completo revisado por humano
- [ ] Mínimo 3 variações de lead prontas para teste

---

## Fase 7 — Validação de Qualidade

**Agente responsável:** @claude-hopkins (audit) + @eugene-schwartz (awareness check)
**Objetivo:** Validar o script antes da gravação usando a matriz diagnóstica de retenção como referência e aplicar audits de copy.

### 7.1 Hierarquia de Retenção — Diagnóstico Preventivo

Antes de gravar, use esta hierarquia para identificar o elemento de maior risco no script: [DOC — @thiagoroas]

| Rank | Fator | Pergunta de diagnóstico |
|------|-------|------------------------|
| 1 | FORMATO | "O formato vai manter o prospect assistindo, ou parece vídeo de vendas óbvio?" |
| 2 | Copy | "A copy completa a jornada de awareness até Level 5 antes do CTA?" |
| 3 | Apresentação | "O expert está confortável e natural, ou está lendo?" |

### 7.2 Matriz Diagnóstica (Pós-Publicação)

Use esta matriz ao analisar os primeiros dados de performance: [DOC — @thiagoroas / @jon-benson]

| Retenção | Conversão | Diagnóstico | Ação |
|----------|-----------|-------------|------|
| Alta | Alta | Perfeito | Escalar |
| Baixa | OK | Formato ruim, Copy boa | Mudar formato, manter copy |
| Alta | Baixa | Copy ruim, Formato bom | Mudar copy, manter formato |
| Baixa | Baixa | Tudo ruim | Nova VSL |

> "VSL entrega retenção baixa, mas conversão legal. Conclusão: a COP tá boa, o formato tá ruim." — @thiagoroas [DOC]

- [ ] Matriz diagnóstica revisada preventivamente

### 7.3 Checklist Hopkins de Copy

Aplicado pelo @claude-hopkins. Para cada bloco da VSL:

- [ ] Cada afirmação é verificável ou demonstrável?
- [ ] A promessa é específica e mensurável?
- [ ] Existe prova de respaldo para cada claim?
- [ ] A copy está escrita para o avatar, não para o copywriter?
- [ ] Toda palavra ganha seu lugar (nenhuma palavra vazia)?

### 7.4 Benchmarks de Retenção para Validação Pós-Gravação

| Métrica | Benchmark saudável | Sinal de problema |
|---------|-------------------|------------------|
| Play rate | Acima de 60-70% | Abaixo de 60% = problema de criativo/segmentação |
| Retenção minuto 1 | Acima de 60% | Abaixo de 40% = VSL morta (Lead ruim) |
| Retenção no pitch | Acima de 30% | Abaixo de 20% = problema de formato |
| Queda no pitch | Queda brutal | Queda leve = problema de oferta/ticket |

[DOC — @thiagoroas]

> "Na hora do pitch, queda BRUTAL é sinal saudável — o prospect foi ao checkout." — @thiagoroas [DOC]

- [ ] Benchmarks documentados para uso na análise pós-publicação

### 7.5 Checklist de Coerência Schwartz

- [ ] O script começa no nível de awareness correto (não trata Level 2 como Level 4)?
- [ ] A jornada de awareness está completa (Level 2 → Level 5) antes do CTA?
- [ ] O mecanismo é introduzido no timing correto (minutos 4-10)?
- [ ] Cada crença criada prepara o terreno para a próxima?
- [ ] O CTA aparece apenas após completar a graduação de awareness?

**Critério de saída Fase 7:**
- [ ] Checklist Hopkins aplicado
- [ ] Checklist Schwartz aplicado
- [ ] Benchmarks documentados para análise futura
- [ ] Script aprovado para gravação

---

## Fase 8 — Estrutura da Página Pós-Pitch

**Agente responsável:** @jon-benson + @dan-kennedy
**Objetivo:** Definir a estrutura da página de vendas que abre automaticamente quando o preço é revelado na VSL.

> "Ao revelar o preço: a página de vendas ABRE COMPLETA (não só botão)." — @thiagoroas [DOC]

### 8.0 Regras Estruturais Críticas da Página (Pré-Design)

Antes de montar a estrutura da página, as seguintes regras devem ser internalizadas — violações dessas regras são as causas mais frequentes de conversão baixa mesmo com VSL de qualidade:

**ARCH-06 — CTA e preço APÓS construção de desejo, nunca no topo [DOC — Thiago Roas, Hotmart Cast ~25:00-30:00]**

> "Preço, depois de desejo. [...] Por algum motivo, alguém decidiu que o CTA tem que ficar no topo. [...] Rapa o CTA daqui e joga para o final. [...] Dobrou a conversão." — @thiagoroas [DOC — Hotmart Cast ~25:00-30:00]

Caso documentado: empresa faturando centenas de milhões por ano tinha CTA no topo da página de vendas. Após mover o CTA para o final — sem alterar nenhum outro elemento — a conversão dobrou. Este é o impacto de um único erro estrutural de posicionamento de CTA.

**Regra:** CTA/botão de compra na seção superior da página (antes da sequência de convencimento) gera "curiosos" que chegam ao checkout sem intenção real de compra, destruindo a métrica de custo por finalização.

**F-03 — Preço deve ser visível na página ANTES do CTA [DOC — Thiago Roas, Kiwicast #213 ~30:00]**

> "Não bota preço do produto na sua página de vendas. Porque [...] as pessoas jogam para o checkout sem saber o preço do produto. O que acontece? Página de vendas que tem botão muito no topo, ou que não tem preço, leva curiosos para o checkout." — @thiagoroas [DOC — Kiwicast #213 ~30:00]

O preço deve ser exibido na própria página de vendas, antes do botão de compra. Esconder o preço (mostrá-lo apenas no checkout) faz com que o prospect vá ao checkout apenas para descobrir o valor — sem intenção de compra. Isso:
- Infla o volume de "initiate checkout" artificialmente
- Destrói a métrica soberana de custo por finalização
- Polui a inteligência do pixel com dados falsos de intenção

**Dois elementos obrigatórios antes de cada botão de compra:**
1. Sequência de convencimento (copy + prova) completa
2. Preço explicitamente declarado

**F-08 — VSL NÃO é obrigatório: exceção importante [DOC — Thiago Roas, Kiwicast #213 ~45:00]**

> "É mito de que toda a página de vendas tem que ter vídeo de vendas. As nossas melhores páginas de vendas não tinham vídeo. Faturaram milhões — múltiplos 7 dígitos. Página de vendas sem vídeo. Eu não estou dizendo que é melhor não ter vídeo. Eu estou dizendo que não é necessário em 100% dos casos." — @thiagoroas [DOC — Kiwicast #213 ~45:00]

Este SOP assume VSL como formato primário — e VSL é o padrão recomendado para funil perpétuo de público frio. No entanto, o executor deve saber que:
- Páginas de vendas escritas (sem vídeo) podem superar páginas com VSL quando a copy e a oferta estão bem estruturadas
- Uma VSL mal produzida pode **prejudicar** a conversão em comparação com uma página escrita bem estruturada
- O fator determinante é a força da oferta e da copy, não o formato
- Se a VSL não está disponível ou está prejudicando retenção: uma página de vendas escrita com os elementos desta Fase 8 é uma alternativa legítima

**Esta exceção não invalida o SOP** — invalida apenas a crença de que VSL é condição necessária para conversão.

### 8.1 Estrutura Mínima da Página Pós-Pitch

| Elemento | Posição | Regra |
|----------|---------|-------|
| Vídeo (VSL embutida) | Topo | Ainda rolando quando a página abre |
| Botão de compra (1º) | Próximo ao vídeo | Mais próximo do vídeo = maior conversão [DOC] |
| Depoimentos | Logo abaixo do 1º botão | Curtos — os longos ficam aqui, não no corpo da VSL |
| Prova | Distribuída | Prints, resultados, screenshots |
| Preço + Bônus | Meio-inferior | Após prova |
| Botão de compra (2º) | Após preço + bônus | Segundo ponto de conversão |
| Urgência / Garantia | Abaixo do 2º botão | Real, não performática |
| Botão de compra (3º) | Final da página | Último ponto de conversão |

[DOC — @thiagoroas]

> "Começar simples. Ir encorpando se conversão estiver baixa." — @thiagoroas [DOC]

**Regra de otimização:** Não adicionar elementos antes de ter dados. Começa com estrutura mínima, adiciona elementos conforme o diagnóstico indicar o problema.

- [ ] Estrutura da página pós-pitch definida
- [ ] Botão mais próximo ao vídeo posicionado corretamente

### 8.2 Checklist de Página Mínima

- [ ] Depoimentos incluídos (reservados do corpo da VSL)
- [ ] Prova espalhada (screenshots, resultados, números)
- [ ] Botões em mínimo 3 posições (começo, meio, final)
- [ ] Preço e bônus visíveis sem scrollar excessivamente
- [ ] Urgência/escassez real declarada

**MM-01 — Aviso: Não copiar táticas de celebridades [DOC — Thiago Roas, Kiwicast #213 ~55:00]**

> "Existem alguns players no mercado que falam o contrário. Que o botão que leva para o checkout tem que ficar lá em cima. Não escondam o botão. Eles falam. Com 2 milhões de seguidores. [...] Quando você é uma celebridade [...] o cara sabe o produto que vai comprar. Mas quando você não é uma celebridade, o teu caminho é diferente da celebridade." — @thiagoroas [DOC — Kiwicast #213 ~55:00]

Referências de mercado contraditórias sobre posicionamento de CTA, ausência de sequência de convencimento, botão no topo, múltiplos produtos na mesma página — frequentemente vêm de operadores com audiência pré-existente de milhões de seguidores. As regras de celebridade são contextuais à autoridade pré-instalada, confiança prévia e base de seguidores. **Para funil de público frio sem autoridade pré-existente, as regras deste SOP se aplicam.** Ignore conselhos de celebridades sobre estrutura de página sem confirmar se o contexto deles é comparável ao seu.

**Critério de saída Fase 8:**
- [ ] Estrutura da página definida e documentada
- [ ] Preço explicitamente declarado na página antes de cada botão de compra
- [ ] CTA posicionado apenas após sequência completa de convencimento (nunca no topo como único CTA)
- [ ] Depoimentos alocados para a página (não para o corpo da VSL)

---

## Tratamento de Erros e Escalação

Esta seção define o que o executor deve fazer quando algo falha. O princípio central de Thiago se aplica aqui diretamente: **"O que tá ruim não vai melhorar."** [DOC — @thiagoroas timestamp 02:19:48] — não continue investindo esforço em um caminho bloqueado. Diagnostique e pivot.

> Nota de numeração: esta seção usa prefixo EH (Error Handling) para evitar conflito com a numeração da Fase 8 acima.

### EH-1 Matriz de Falhas por Fase

| Fase | Modo de Falha | Sintoma | Ação | Escalação |
|------|--------------|---------|------|-----------|
| Pré-condições | Documento de persona incompleto | Campos de dores, desejos ou objeções vazios | PARE. Retorne ao responsável pela persona. Não inicie Fase 1 com persona incompleta. | Escale para Copy Chief se o responsável pela persona não consegue completar em 24h |
| Pré-condições | Ticket indefinido ou acima de R$497 | Ticket não numérico ou fora do escopo do SOP | PARE. Para tickets >R$497, o processo é diferente (mais tempo de tela, funil de autoridade) — este SOP não cobre [DOC — @thiagoroas timestamp 00:46:17] | Consulte especialista ou documento de escopo expandido |
| Fase 1 | Awareness de entrada incerto | Não é possível classificar o tráfego em Level 2 ou 3 | Analise o criativo que vai levar o tráfego. Criativo de conteúdo = Level 2. Criativo de mecanismo = Level 3. Se criativo não existe ainda, defina uma hipótese e documente. | [GAP — needs practitioner verification para casos sem criativo definido] |
| Fase 2 | Mecanismo único não diferenciado | Concorrente pode copiar em 24h | Adicione especificidade: números proprietários, nome exclusivo, história de origem. Se ainda não diferencia: [GAP — needs practitioner verification] | Escale para @todd-brown (agente) ou especialista em Big Ideas |
| Fase 4 | Expert não confortável com formato selecionado | Expert recusa ou performa mal no formato | Priorize o conforto do expert sobre o formato teoricamente superior. "Quando o expert não está confortável com o criativo, a performance cai — não importa a qualidade do roteiro." [DOC — @jon-benson / Rafa Marques] | Ofereça ao expert 2-3 opções de formato alternativo. Se nenhum é confortável: [GAP — needs practitioner verification] |
| Fase 6 | Manus AI indisponível | Plataforma fora do ar, acesso bloqueado ou sessão perdida | Fallback: escreva o script manualmente usando as saídas das Fases 1-5 como roteiro. O documento de persona + mapa de awareness são suficientes para um copywriter qualificado. Alternativas de IA (GPT-4, Claude) podem ser usadas como substitutos, mas não têm o mesmo resultado documentado [ASM — Thiago menciona apenas Manus como preferido; outros não foram comparados] | Se nenhuma IA disponível: delegar a copywriter sênior para escrita manual completa |
| Fase 6 | 5 leads testadas — 4 ruins, 1 ótima | Taxa de falha alta, mas dentro do esperado | Este é o comportamento NORMAL. "De 5 leads testadas, 4 deram ruim, 1 deu muito boa — essa salvou a VSL inteira." [DOC — @thiagoroas timestamp 01:10:05] Não interrompa o processo. A lead vencedora é o objetivo. | Escale apenas se NENHUMA das 5 leads estiver funcionando após teste de tráfego real |
| Fase 6 | Nenhuma das leads produzidas converte após teste | Retenção <40% no primeiro minuto em todas as variações | Diagnóstico: problema de formato ou de awareness entry. Siga a Matriz Diagnóstica da Fase 7.2. Se retenção baixa em todos: mude o formato. Se retenção ok mas conversão baixa: mude a copy. Se tudo ruim: nova VSL. [DOC] | "O que tá ruim não vai melhorar." [DOC] — inicie nova VSL ao invés de otimizar indefinidamente |
| Fase 7 | Play rate abaixo de 60% | Poucos visitantes estão iniciando o vídeo | Diagnóstico: problema de criativo ou segmentação, NÃO de retenção da VSL. A VSL não é o problema — o anúncio ou a página são. [DOC — @thiagoroas] | Pausar análise da VSL. Resolver criativo e página primeiro. |
| Qualquer fase | Executor bloqueado por mais de 4h sem progresso | Decisão impossível de tomar sozinho | Use o protocolo de decisão: documente o bloqueio, liste as opções disponíveis, e escale para o Copy Chief com as opções já mapeadas. | Copy Chief resolve ou convoca @thiagoroas (praticante) para validação |

### EH-2 Matriz Diagnóstica de VSL ao Vivo (Pós-Publicação)

Use esta matriz nos primeiros dados de performance após publicação: [DOC — @thiagoroas timestamp 01:17:17 / @jon-benson]

| Retenção | Conversão | Diagnóstico | Ação |
|----------|-----------|-------------|------|
| Alta | Alta | Perfeito | Escalar tráfego |
| Baixa | OK | Formato ruim, Copy boa | Mudar formato — manter copy |
| Alta | Baixa | Copy ruim, Formato bom | Mudar copy — manter formato |
| Baixa | Baixa | Tudo ruim | Nova VSL |

> "Às vezes, a VSL entrega retenção baixa, mas conversão legal. Nesse caso, a COP tá boa, o formato tá ruim." — @thiagoroas [DOC timestamp 01:17:17]

### EH-3 Escalação — Quando e Para Quem

| Condição | Acione | Via |
|----------|--------|-----|
| Persona incompleta e responsável não responde em 24h | Copy Chief | Direto |
| Mecanismo único não encontrado após 2h de trabalho | @todd-brown (agente) ou especialista externo | Sessão de Big Ideas |
| Expert recusa todos os formatos propostos | Copy Chief + Expert direto | Reunião de alinhamento |
| Manus AI fora do ar por mais de 1 dia útil | Escrever manualmente ou usar alternativa [ASM] | Comunicar Copy Chief imediatamente |
| Nenhuma VSL converte após 3 semanas de iteração (3+ VSLs testadas) | Copy Chief + Squad Chief — escalar para revisão estratégica de oferta | [ASM 0.3] Conduzir diagnóstico de oferta antes de criar nova VSL — quando múltiplas VSLs falham sistematicamente, o problema é provavelmente a oferta, não o script. Revisar proposta de valor, ticket, e nicho. Considerar consulta com especialista em offer design (ex.: Hormozi framework) ou Copy Chief sênior externo. "O que tá ruim não vai melhorar." [DOC — @thiagoroas timestamp 02:19:48] — não continue iterando scripts sem revisar a oferta. |

---

## Checklist Final de Saída do SOP

Antes de enviar o script para gravação, confirme:

**Diagnóstico:**
- [ ] Nível de awareness de entrada identificado
- [ ] Jornada de awareness mapeada minuto a minuto
- [ ] Mapa de crenças a criar e quebrar completo

**Mecanismo:**
- [ ] Mecanismo único definido, nomeado, testado
- [ ] Arquitetura de posicionamento em 4 camadas construída

**Estrutura:**
- [ ] Mínimo 5 micro-vídeos planejados
- [ ] Mínimo 3 variações de lead escritas
- [ ] Duração de 20-30 min respeitada

**Formato:**
- [ ] Formato "vivo" selecionado (não expert lendo teleprompter)
- [ ] Coerência com o criativo de anúncio validada
- [ ] Expert confortável com o formato

**Copy:**
- [ ] Escrita para a oferta, não para o produto
- [ ] CTA apenas após completar graduação de awareness
- [ ] Oferta com os 3 pilares (brilhe os olhos, simples, rápida)
- [ ] Ancoragem de valor antes do preço
- [ ] Urgência adequada ao ambiente PIX

**Produção:**
- [ ] Script gerado/refinado com IA e revisado por humano
- [ ] Mínimo 3 variações de lead prontas para teste

**Qualidade:**
- [ ] Checklist Hopkins aplicado
- [ ] Checklist Schwartz aplicado
- [ ] Benchmarks de retenção documentados para análise pós-publicação

**Página:**
- [ ] Estrutura mínima da página pós-pitch definida
- [ ] Botão mais próximo ao vídeo posicionado
- [ ] Preço explicitamente declarado na página antes de cada botão de compra
- [ ] CTA posicionado após sequência de convencimento (não no topo como único CTA)
- [ ] Objeção de fraude/golpe endereçada no início do corpo da VSL (MV-02)
- [ ] Leads estruturalmente distintas entre si (não apenas gancho trocado)

---

## Glossário

Definições baseadas no uso de @thiagoroas nas fontes primárias, não em definições genéricas de mercado.

| Termo | Definição no contexto deste SOP |
|-------|--------------------------------|
| **Ancoragem de Valor** | Apresentação do valor percebido da oferta antes da revelação do preço real. Constrói uma "âncora alta" na mente do prospect para que o preço de R$297 pareça razoável em comparação. [DOC — @dan-kennedy] |
| **Awareness Level** | Um dos 5 estágios de consciência do prospect sobre seu problema e a solução, conforme framework de Eugene Schwartz: Level 1 (Unaware), Level 2 (Problem Aware), Level 3 (Solution Aware), Level 4 (Product Aware), Level 5 (Most Aware). A VSL precisa graduar o prospect de L2-3 até L5 antes do CTA. [DOC] |
| **Criativo** | O anúncio de tráfego pago (vídeo ou imagem) que precede a VSL. Atua como filtro de awareness: criativo de conteúdo atrai Level 2, criativo de mecanismo atrai Level 3. [DOC — @eugene-schwartz] |
| **CTA (Call to Action)** | Chamada para a ação de compra. Neste SOP, deve aparecer somente após completar a graduação de awareness até Level 4-5. CTA prematuro não gera venda — gera abandono. [DOC — @dan-kennedy] |
| **Downsell** | Oferta alternativa apresentada após recusa do upsell. NÃO é desconto — é remoção de um elemento do produto (ex.: acesso por 6 meses em vez de acesso completo). Desconto treina o mercado a esperar desconto. [DOC — @dan-kennedy] |
| **Front (Produto Front-End)** | O produto principal vendido na VSL, ao preço de R$297. É o único ponto onde o tráfego pago trabalha. Não gera lucro principal — converte prospectos em clientes e elimina ceticismo. O lucro vem do upsell. [DOC — @thiagoroas] |
| **Funil Perpétuo** | Sistema de vendas automatizado que converte tráfego frio continuamente, sem depender de janelas de lançamento ou de audiência existente. Inclui VSL + checkout + upsell + downsell. [DOC — @thiagoroas] |
| **Lead (de VSL)** | Os primeiros 1-4 minutos da VSL. Funciona como a headline do vídeo. É o momento de maior taxa de abandono. Pode ter formato, cenário e abordagem completamente diferentes do restante da VSL. [DOC — @jon-benson] |
| **Mecanismo Único** | O elemento proprietário que diferencia o produto de toda solução anterior e que explica por que as tentativas anteriores do prospect falharam. Deve ter nome proprietário. Quanto mais difícil de copiar, mais eficaz. [DOC — @todd-brown E5 Method] |
| **Micro-vídeo** | Um segmento da VSL gravado como arquivo independente. O mínimo são 5 micro-vídeos. A segmentação permite substituição cirúrgica, teste A/B por seção e diagnóstico preciso de retenção. [DOC — @jon-benson] |
| **Nicho Big** | Nicho com 10 milhões ou mais de potenciais compradores. Requisito para VSL R$297 escalar. Exemplos: saúde, relacionamento, renda extra, desenvolvimento pessoal, gastronomia. [DOC — @thiagoroas] |
| **PIX (no contexto de conversão)** | Método de pagamento que cria "dor imediata" — ao contrário do cartão de crédito, que dissociava o momento do pagamento do momento da dor. A copy de urgência e escassez deve ser mais forte num ambiente PIX, não mais fraca. [DOC — @dan-kennedy] |
| **Play Rate** | Percentual de visitantes da página de VSL que iniciam a reprodução do vídeo. Benchmark saudável: acima de 60-70%. Play rate baixo é problema de criativo ou segmentação, NÃO de retenção da VSL. [DOC — @thiagoroas] |
| **Retenção** | Percentual de espectadores que continuam assistindo em cada minuto da VSL. Retenção no minuto 1 deve ser acima de 60%. Retenção no pitch (minuto 20-25) deve ser acima de 30%. Retenção = tempo necessário para completar a graduação de awareness. [DOC — @thiagoroas] |
| **ROAS (Return on Ad Spend)** | Retorno sobre o gasto em anúncios. Neste contexto, ROAS deve ser medido sobre o ticket médio do funil (R$418 com upsell de 15%), não apenas sobre o ticket do front (R$297). ROAS sobre front puro é enganoso para decisões de escala. [DOC — @dan-kennedy] |
| **Sofisticação de Mercado** | O estágio de maturidade do mercado em relação às promessas e metodologias do nicho, conforme framework de Eugene Schwartz (Estágios 1-5). Mercados digitais BR em 2025 estão em Estágio 3-4. [REP] |
| **Tempo de Tela** | A duração total de vídeo que o prospect assiste durante o processo de compra. VSL de 20-30 min é o ticket de tempo que justifica conversão de R$297 em tráfego frio. Mais tempo de tela = maior conversão potencial. [DOC — @thiagoroas] |
| **Ticket** | O preço de venda do produto. "Ticket de ouro" para funil perpétuo de tráfego frio: R$297 — abaixo da barreira psicológica dos R$300, máximo de cartão de crédito, máximo de conversão de público frio. [DOC — @thiagoroas timestamp 00:46:17] |
| **Ticket Médio do Funil** | A receita média por cliente convertido, considerando front + upsell + downsell. Com upsell de 15%, o ticket médio de um funil R$297 é aproximadamente R$418. Decisões de escala devem ser baseadas no ticket médio, não no ticket do front. [DOC] |
| **Tráfego Frio** | Tráfego de pessoas que não têm na mente a oferta do expert. "Público frio não é quem nunca te viu. É quem não tem na mente a tua oferta." [DOC — @thiagoroas timestamp 00:12:21]. Inclui quem foi impactado por anúncio mas não lembrou. |
| **Upsell** | Oferta de ascensão apresentada imediatamente após a compra do front, enquanto o cliente está no "modo sim". Preço típico R$597-697. Taxa de conversão alvo: 15%. A headline do upsell NÃO pode parecer venda — deve gerar curiosidade para que o prospect assista o vídeo. [DOC — @thiagoroas timestamp 01:55:07] |
| **VSL (Video Sales Letter)** | Vídeo de vendas de forma longa (20-30 min para ticket R$297) que replica a jornada emocional completa de um lançamento, comprimida em uma única peça. Replica todos os benefícios do lançamento ajustando uma única variável: o ticket. [DOC — @jon-benson] |

---

## Tabela de Confiança por Fase

| Fase | Confiança Geral | Fonte Principal | Itens Abaixo de 0.8 |
|------|----------------|-----------------|---------------------|
| 1 — Diagnóstico Schwartz | 0.8 (REP) | @thiagoroas palestra + podcast | Nenhum crítico |
| 2 — Mecanismo Todd Brown | 0.8 (REP) | Análise @todd-brown do material | Categoria de mecanismo = [INF 0.5] |
| 3 — Estrutura Benson | 0.8 (REP) | @thiagoroas + análise @jon-benson | Timing exato de micro-vídeos = [INF 0.5] |
| 4 — Seleção de Formato | 1.0 (DOC) | Case Prisciane + múltiplas referências | Nenhum |
| 5 — Escrita de Copy | 0.8 (REP) | @thiagoroas + análise @dan-kennedy | Sequência exata de intercalação corpo = [INF 0.5] |
| 6 — Produção IA | 0.8 (DOC) | @thiagoroas podcast timestamp [01:07:32] | Outros modelos de IA = [ASM 0.3] |
| 7 — Validação | 0.8 (DOC) | Benchmarks documentados + matrix | Sugarman 30 triggers = [ASM 0.3] |
| 8 — Página Pós-Pitch | 0.8 (DOC) | @thiagoroas podcast + slides | Sequência de otimização = [INF 0.5] |

---

## Gaps e Itens para Verificação

Os seguintes itens estão abaixo de 0.8 de confiança e devem ser verificados:

| Gap | Confiança | Razão | Como verificar |
|-----|-----------|-------|---------------|
| Sequência exata de intercalação (criação/quebra de crença no corpo) | 0.5 [INF] | Mencionada como princípio, estrutura exata não detalhada | Testar A/B com diferentes intercalações |
| Outros modelos de IA além do Manus para produção | 0.3 [ASM] | Apenas Manus citado como preferido, outros não comparados | Testar GPT-4, Claude Sonnet em paralelo |
| Sugarman 30 Psychological Triggers — aplicação específica para VSL | 0.3 [ASM] | Referenciado na tarefa vsl-script.md mas não nas fontes primárias | Aplicar framework completo de Sugarman e documentar |
| Timing ótimo de segmentação de micro-vídeos dentro do corpo | 0.5 [INF] | "Mínimo 5" documentado, posicionamento interno inferido | Mapear com análise de curva de retenção em testes |
| Adaptação do processo para tickets acima de R$497 | 0.5 [INF] | Mencionado que exige mais tempo de tela, sem detalhes. Kiwicast #213 S-01 corrobora que tickets acima de R$500 são inviáveis para tráfego frio sem autoridade de celebridade — restringe ainda mais o escopo, mas não detalha o processo alternativo. | Requer fonte adicional ou validação prática para o processo de alta autoridade |
| Copy específica de downsell | 0.8 [DOC] | Estrutura documentada mas script de exemplo é do funil de @thiagoroas — pode variar por nicho | Adaptar script documentado para o nicho específico |

---

## Documentos Relacionados

| Documento | Tipo | Relação com Este SOP |
|-----------|------|---------------------|
| `squads/copy/tasks/vsl-script.md` | Task de execução | Complementar — contém o framework Benson 9 passos e formatos adicionais de VSL. Usar em paralelo com este SOP para execução detalhada. |
| `squads/copy/data/copy-brief-protocol.md` | Protocolo de briefing | Pré-requisito — deve ser executado antes deste SOP para garantir que ICP, voz de marca e prova estão carregados |
| SOP-COPY-VSL-ARCH-001 (a criar) | SOP de arquitetura | Pré-requisito — cobre a decisão de arquitetura do funil (front, upsell, downsell) antes de criar o script |
| SOP-COPY-VSL-DIAG-001 (a criar) | SOP de diagnóstico | Pós-publicação — usar quando a VSL já está ao vivo e precisa de análise de retenção e conversão. Este SOP (SCRIPT) entrega a VSL. O SOP de DIAG analisa a VSL depois. |

## Referências das Fontes

| Fonte | Tipo | Conteúdo extraído |
|-------|------|-------------------|
| `squads/copy/data/references/thiagoroas-copy-analysis.yaml` | Análise de palestra ao vivo | Diagnóstico Schwartz completo, estrutura VSL Benson, mecanismos Todd Brown, princípios Kennedy |
| `squads/traffic-masters/data/references/thiagoroas-vsl-funnel-and-traffic-framework.yaml` | Palestra + Podcast "Segredos da Escala #122" (3h01m, Set/2025) | Especificações de produção, formatos vivos/mortos, Manus AI workflow, página pós-pitch, métricas de retenção |
| `outputs/etl/etl-20260311-qj04/qj04cUeaRAw-diarized.md` | Transcrição diarizada do Podcast "Segredos da Escala #122" | Fonte primária de timestamps e citações diretas de @thiagoroas |
| `squads/copy/tasks/vsl-script.md` | Task existente (referência de contexto) | Framework Benson 9 passos, formatos de VSL, duração por ticket — não duplicado aqui |
| `outputs/etl/thiago-roas-interviews/hotmart-cast-diarized.md` | Transcrição diarizada — Hotmart Cast (YouTube: RENU3kEns0E, ~40min) | Regra CTA pós-desejo (ARCH-06, case dobrou conversão), Paradigma Andromeda — segmentação por criativo (CREATIVE-03/04) |
| `outputs/gerador-pop/extractions/hotmart-cast-gold-extraction.md` | Gold extraction processada por Ohno (SOP Extractor) — 2026-03-12 | Mapa de enrichments ARCH-06, CREATIVE-03, CREATIVE-04 para este SOP |
| `outputs/etl/thiago-roas-interviews/kiwicast-213-diarized.md` | Transcrição diarizada — Kiwicast #213 (YouTube: hnw1pGcc3_A, ~1h25min) | Primeira objeção = golpe (F-04), VSL não obrigatório (F-08), preço visível (F-03), moment-hijacking (C-01), progressão de ângulo (C-03), exceção de celebridade (MM-01) |
| `outputs/gerador-pop/extractions/kiwicast-213-gold-extraction.md` | Gold extraction processada por Ohno (SOP Extractor) — 2026-03-12 | Mapa de enrichments F-04, F-08, F-03, C-01, C-03, MM-01 para este SOP |

---

## Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 0.1.0 | 2026-03-11 | Ohno (SOP Extractor) — SOP Factory Squad | Extração inicial a partir de @thiagoroas (palestra ao vivo + Podcast Segredos da Escala #122) |
| 0.2.0 | 2026-03-11 | Gerber (SOP Creator) — SOP Factory Squad | Remediação de governança conforme Audit AUDIT-VSL-SCRIPT-001: adição de controle documental (NC-01, NC-02), seção de Error Handling (NC-03), qualificações do executor (NC-04), localização/distribuição (NC-05), documentos relacionados (NC-06), glossário de 22 termos (NC-07), KPIs de processo (NC-08), critérios de verificação das pré-condições (NC-09), seção de Out of Scope (NC-10). Status atualizado para DRAFT-REMEDIATED. |
| 0.3.0 | 2026-03-11 | Gerber (SOP Creator) — SOP Factory Squad | Remediação para CERTIFIED (90+) conforme re-audit AUDIT-VSL-SCRIPT-001 P3: (NC-11) YAML frontmatter completo adicionado ao topo do documento com todos os campos de metadados; (NC-15/NEW-01) renumeração das subseções de Error Handling de 8.x para EH-x eliminando conflito com Fase 8; (NC-05 reclassificado) lista de distribuição completa e método de notificação adicionados ao header e ao frontmatter; (NC-16/NEW-02) ação provisional adicionada ao cenário de escalação "3+ VSLs falham após 3 semanas" com marcação [ASM 0.3]; adição de matriz RACI formal com todos os roles e atividades; adição da seção de Materiais e Ferramentas com ferramentas, documentos de input e permissões necessárias; Approver corrigido para "Squad Chief" com referência à ISO 9001:2015 Clause 7.5.2(c) garantindo independência do aprovador; Índice (TOC) adicionado; status atualizado para APPROVED. |
| 0.4.0 | 2026-03-12 | Gerber (SOP Creator) — SOP Factory Squad | Enriquecimento com evidências de 2 novas fontes primárias (Hotmart Cast + Kiwicast #213 — Thiago Roas). Adições APPEND-ONLY. Nenhum conteúdo existente removido. Enrichments aplicados: (1) ARCH-06 — Regra CTA após desejo com case "dobrou conversão" adicionado à nova seção 8.0 da Fase 8; (2) CREATIVE-03 — Paradigma Andromeda: segmentação por criativo adicionado às Pré-condições (nova seção "Contexto de Mercado Obrigatório"); (3) CREATIVE-04 — Andromeda exige criativos genuinamente diferentes adicionado às Pré-condições; (4) F-04 — Primeira objeção = golpe/fraude adicionado à Fase 5.3 com sequência de quebra de crenças recomendada; (5) F-08 — VSL não é obrigatório (exceção documentada) adicionado à seção 8.0; (6) C-01 — Moment-hijacking em criativos/leads adicionado à Fase 3.3; (7) C-03 — Progressão de ângulo dor direta → dor adjacente adicionado à Fase 3.3 com tabela de fases; (8) F-03 — Preço deve ser visível na página antes do CTA adicionado à seção 8.0; (9) MM-01 — Aviso exceção de celebridade adicionado ao critério de saída da Fase 8. Audit de upgrades de confiança: nenhum [INF] existente corroborado diretamente pelas novas fontes — mantidos como [INF]. Gap de tickets >R$497 anotado com corroboração parcial de Kiwicast S-01. Novas fontes adicionadas à tabela de Referências. |

**Próxima Revisão Programada:** 2026-06-11
**Trigger de Revisão Antecipada:** Qualquer mudança significativa no processo de produção de VSL, mudança de ferramenta de IA principal, ou 3+ falhas documentadas na execução do SOP.

---

*Extraction: Ohno, SOP Extractor — SOP Factory Squad*
*Remediation v0.2.0: Gerber, SOP Creator — SOP Factory Squad*
*Remediation v0.3.0: Gerber, SOP Creator — SOP Factory Squad (CERTIFIED target)*
*Enrichment v0.4.0: Gerber, SOP Creator — SOP Factory Squad*
*Sources: @thiagoroas (palestra ao vivo + Podcast Segredos da Escala #122, 2026-03-11; Hotmart Cast RENU3kEns0E + Kiwicast #213 hnw1pGcc3_A, 2026-03-12)*
*Audit basis: AUDIT-VSL-SCRIPT-001 — Crosby Zero Defects + ISO 9001 + FDA/GMP (adapted)*
*Do not use this SOP without loading the full confidence table and gaps section.*
