---
task: Create Newsletter Task
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Content
Entrada: |
  - briefing e objetivo comercial
  - contexto de oferta, avatar, canal e provas disponíveis
  - restrições, assets e referências existentes
Saída: |
  - entregável definido por esta task, alinhado ao framework descrito no corpo
  - premissas, lacunas de contexto e próximos passos quando houver
Checklist:
  - [ ] Confirmou inputs mínimos antes de executar
  - [ ] Seguiu o framework e a ordem descritos na task
  - [ ] Registrou entregável, premissas e bloqueios sem inventar contexto
Domain: Tactical
pre_condition: |
  - briefing, oferta, canal e contexto mínimo carregados
  - restrições e assets necessários confirmados antes da execução
post_condition: |
  - entregável principal registrado com critérios de revisão e próximo passo explícito
  - handoff, bloqueio ou decisão comercial documentados quando aplicável
performance: |
  - sla_target: "PT24H"
  - error_handling: "registrar bloqueio, atualizar handoff e escalar para @copy-chief"
---

# Create Newsletter Task

## Metadata

```yaml
task_id: create-newsletter
version: 2.0
framework: copy-framework-v2
category: email_marketing
complexity: intermediate
estimated_time: 30-60min
requires_research: true

dependencies:
  research: docs/research/newsletter-methodology-research.md
  templates: templates/newsletter-templates/

theoretical_foundation:
  - Ramit Sethi - GrowthLab Email Copywriting
  - Laura Belgray - Talking Shrimp
  - Gary Halbert - Letter Writing
```

---

## Purpose

Criar newsletters de alto engajamento que entregam valor consistente, constroem relacionamento com a audiência e geram vendas de forma natural através da filosofia "serve, don't sell".

**Princípio Core (Ramit Sethi):**
> "When you focus on writing emails your audience is actively excited to open, selling becomes the easy part."

**Estatísticas que importam:**
- Email gera £32 de retorno para cada £1 investido
- 40x mais efetivo que redes sociais para aquisição
- 91% dos consumidores querem emails de marcas que confiam

---

## Phase 1: Information Gathering

### 1.1 Required Inputs

```yaml
newsletter_context:
  newsletter_name:
    required: true
    description: "Nome da newsletter ou marca"

  edition_topic:
    required: true
    description: "Tema principal desta edição"

  target_avatar:
    required: true
    description: "Quem é o leitor ideal?"

  newsletter_frequency:
    required: true
    options:
      - daily
      - weekly
      - biweekly
      - monthly

content_direction:
  format_type:
    required: true
    options:
      - curation           # Links e recursos curados
      - essay              # Ensaio pessoal/opinião
      - tutorial           # Como fazer algo
      - story_lesson       # História + lição
      - qa                 # Perguntas e respostas
      - hybrid             # Combinação de formatos

  value_hook:
    required: true
    description: "O que o leitor vai aprender/ganhar com esta edição?"

  primary_goal:
    required: true
    options:
      - engagement         # Respostas, interação
      - education          # Ensinar algo útil
      - relationship       # Construir conexão
      - soft_sell          # Promover produto suavemente
      - launch_prep        # Preparar para lançamento
```

### 1.2 Optional Inputs

```yaml
content_elements:
  personal_story:
    description: "História pessoal para incluir"

  data_or_research:
    description: "Dados ou pesquisa para citar"

  curated_links:
    description: "Links para curar (se formato curadoria)"

  reader_question:
    description: "Pergunta de leitor para responder"

promotion_context:
  cta_goal:
    description: "Objetivo de conversão (se houver)"
    options:
      - reply              # Gerar respostas
      - click              # Clique em link
      - product            # Produto/serviço
      - lead_magnet        # Conteúdo gratuito
      - none               # Sem CTA de venda

  product_to_mention:
    description: "Produto para mencionar (se aplicável)"

  urgency:
    description: "Urgência (se lançamento/promoção)"

style_preferences:
  tone:
    options:
      - casual             # Conversa com amigo
      - expert             # Autoridade no assunto
      - provocative        # Opiniões fortes
      - warm               # Acolhedor
      - playful            # Divertido

  copywriter_style:
    options:
      - ramit_sethi        # Value-first, soft sell
      - laura_belgray      # Conversational, personality
      - gary_halbert       # Story-driven letters
      - dan_kennedy        # Direct, provocative
      - david_ogilvy       # Elegant, sophisticated
```

---

## Phase 2: Newsletter Format Selection

### 2.1 Format Descriptions

```yaml
format_1_curation:
  description: "Links e recursos selecionados com sua opinião"

  structure:
    - Abertura pessoal (2-3 linhas)
    - 3-7 itens curados com comentário
    - Fechamento + CTA

  best_for:
    - "Thought leadership"
    - "Manter lista engajada com pouco tempo"
    - "Newsletters de indústria/nicho"

  production_time: "Baixo (1-2 horas)"

  template:
    |
    Olá [Nome],

    [Abertura pessoal - 2-3 linhas sobre sua semana]

    Aqui está o que chamou minha atenção:

    ---

    **1. [Título do item]**
    [Link]

    Por que importa: [2-3 linhas de opinião/contexto]

    ---

    **2. [Título do item]**
    [Link]

    Por que importa: [2-3 linhas de opinião/contexto]

    ---

    [Continue para 3-7 itens]

    ---

    O que você achou? Responde esse email.

    [Assinatura]

format_2_essay:
  description: "Uma ideia desenvolvida, peça de opinião"

  structure:
    - Hook provocativo
    - Desenvolvimento do argumento
    - Evidências/exemplos
    - Conclusão com takeaway

  best_for:
    - "Marcas pessoais fortes"
    - "Thought leadership"
    - "Posicionamento como expert"

  production_time: "Alto (3-5 horas)"

  template:
    |
    Olá [Nome],

    [Hook provocativo - 1-2 linhas]

    [Desenvolvimento - 3-5 parágrafos com argumento]

    [Evidência/exemplo]

    [Mais desenvolvimento]

    **Conclusão:**

    [Takeaway em 2-3 frases]

    O que você acha? [Convite para resposta]

    [Assinatura]

format_3_tutorial:
  description: "Ensina algo prático passo a passo"

  structure:
    - Por que isso importa
    - Passo 1, 2, 3...
    - Resumo rápido
    - CTA para aplicar

  best_for:
    - "Negócios educacionais"
    - "Cursos/coaching"
    - "SaaS"

  production_time: "Médio (2-3 horas)"

  template:
    |
    Olá [Nome],

    [Por que isso importa - 2-3 linhas]

    Vamos ao passo a passo:

    **Passo 1: [Nome do passo]**

    [Explicação + exemplo]

    **Passo 2: [Nome do passo]**

    [Explicação + exemplo]

    **Passo 3: [Nome do passo]**

    [Explicação + exemplo]

    ---

    **Resumo rápido:**
    1. [Passo 1 em uma linha]
    2. [Passo 2 em uma linha]
    3. [Passo 3 em uma linha]

    Tenta e me conta como foi.

    [Assinatura]

    P.S. Quer mais [tema]? [CTA]

format_4_story_lesson:
  description: "Conta uma história e extrai uma lição"

  structure:
    - Story hook
    - Desenvolvimento da história
    - Momento de virada
    - Lição extraída
    - Aplicação prática

  best_for:
    - "Personal branding"
    - "Coaches/speakers"
    - "Conexão emocional"

  production_time: "Médio (2-4 horas)"

  template:
    |
    Olá [Nome],

    [Story hook - 2-3 linhas que prendem]

    [Desenvolvimento da história - 4-5 parágrafos]

    [Momento de virada/insight]

    A lição?

    **[Lição em 1-2 frases fortes]**

    Como você pode aplicar isso:

    1. [Aplicação prática 1]
    2. [Aplicação prática 2]
    3. [Aplicação prática 3]

    [Fechamento pessoal]

    [Assinatura]

    P.S. [CTA suave ou teaser próxima edição]

format_5_qa:
  description: "Responde perguntas da audiência"

  structure:
    - Intro sobre o tema
    - Pergunta 1 + Resposta
    - Pergunta 2 + Resposta
    - Convite para mais perguntas

  best_for:
    - "Community building"
    - "Engajamento alto"
    - "Entender a audiência"

  production_time: "Baixo-Médio (1-2 horas)"

  template:
    |
    Olá [Nome],

    Recebi muitas perguntas sobre [tema] essa semana.

    Vou responder as principais:

    ---

    **Pergunta de [Nome/Anônimo]:**
    "[Pergunta]"

    **Minha resposta:**
    [Resposta detalhada e útil]

    ---

    **Pergunta de [Nome/Anônimo]:**
    "[Pergunta]"

    **Minha resposta:**
    [Resposta detalhada e útil]

    ---

    Sua pergunta não apareceu?
    Responde esse email que eu respondo na próxima edição.

    [Assinatura]

format_6_hybrid:
  description: "Combina múltiplos formatos"

  structure:
    - Intro pessoal
    - Conteúdo principal (qualquer formato)
    - Quick hits/links
    - CTA

  best_for:
    - "Newsletters estabelecidas"
    - "Audiências maduras"
    - "Variedade de conteúdo"

  production_time: "Médio-Alto"
```

### 2.2 Format Selection Guide

```yaml
choose_by_goal:
  engagement: "Q&A ou Story+Lesson"
  education: "Tutorial"
  thought_leadership: "Essay ou Curation"
  relationship: "Story+Lesson"
  soft_sell: "Tutorial ou Story+Lesson"

choose_by_time:
  low_time: "Curation (mais rápido)"
  medium_time: "Tutorial ou Q&A"
  high_time: "Essay ou Story+Lesson"

choose_by_strength:
  good_storyteller: "Story+Lesson ou Essay"
  good_curator: "Curation"
  good_teacher: "Tutorial"
  good_listener: "Q&A"
```

---

## Phase 3: Subject Line Creation

### 3.1 Subject Line Formulas

```yaml
curiosity:
  templates:
    - "A coisa sobre [tema] que ninguém menciona"
    - "Isso mudou como eu penso sobre [área]"
    - "O problema com [crença comum]"
    - "Eu estava errado sobre [tema]"
    - "O que descobri sobre [tema] essa semana"

  best_for: "Qualquer formato, especialmente Essay"
  psychology: "Abre loop que precisa ser fechado"

benefit:
  templates:
    - "Como [resultado] em [tempo curto]"
    - "[X] maneiras de [benefício]"
    - "O segredo de [pessoas admiradas] para [resultado]"
    - "Finalmente: uma forma de [resultado] que funciona"

  best_for: "Tutorial, How-To"
  psychology: "Promessa clara de valor"

personal:
  templates:
    - "Uma confissão..."
    - "Preciso te contar uma coisa"
    - "O que aconteceu na terça"
    - "Pergunta rápida"
    - "Eu quase não mandei esse email"

  best_for: "Story+Lesson, Essay"
  psychology: "Intimidade gera resposta"

numbered:
  templates:
    - "3 coisas que aprendi essa semana"
    - "5 links que salvei pra você"
    - "[X] perguntas que recebi"
    - "7 erros que cometi com [tema]"

  best_for: "Curation, Tutorial, Q&A"
  psychology: "Especificidade cria credibilidade"

provocative:
  templates:
    - "Você está fazendo [X] errado"
    - "Pare de [ação comum]"
    - "A mentira sobre [tema]"
    - "Por que parei de [prática popular]"

  best_for: "Essay, Contrarian takes"
  psychology: "Desafia crenças, exige atenção"

story:
  templates:
    - "O email que mudou tudo"
    - "Meu cliente ligou às 2h da manhã..."
    - "Eu quase desisti até que..."
    - "O que meu [pai/mentor/cliente] me ensinou sobre [tema]"

  best_for: "Story+Lesson"
  psychology: "Curiosidade narrativa"
```

### 3.2 Subject Line Best Practices

```yaml
do:
  - Manter abaixo de 50 caracteres
  - Colocar palavras importantes no início
  - Usar minúsculas (soa pessoal)
  - Testar diferentes abordagens
  - Combinar subject com conteúdo real

dont:
  - Usar CAPS LOCK (parece spam)
  - Exagerar em emojis (dados mostram impacto negativo)
  - Usar palavras de spam (GRÁTIS, URGENTE, CLIQUE)
  - Mentir sobre o conteúdo
  - Ser genérico ("Newsletter #47")

character_limits:
  mobile_safe: "30-40 caracteres"
  desktop_full: "50-60 caracteres"
  recommendation: "Front-load key words in first 30"
```

### 3.3 Preview Text

```yaml
what: "Texto que aparece após o subject no inbox"
length: "35-90 caracteres"
purpose: "Estender curiosidade, complementar subject"

mistakes:
  - "Deixar como 'Ver no navegador'"
  - "Repetir o subject"
  - "Texto padrão do template"

good_examples:
  - Subject: "Uma confissão..."
    Preview: "Eu estava mentindo pra mim mesmo sobre isso."

  - Subject: "3 coisas que aprendi essa semana"
    Preview: "A #2 me pegou de surpresa."

  - Subject: "O problema com [tema]"
    Preview: "E a solução que ninguém fala."
```

---

## Phase 4: Opening Hooks

### 4.1 Hook Formulas

```yaml
story_hook:
  template: "[Tempo/lugar], [situação inesperada]"

  examples:
    - "Na terça passada, às 3h da manhã, acordei com uma ideia que não me deixava dormir."
    - "Meu pai sempre dizia uma coisa que eu achava boba. Até que..."
    - "Eu estava numa cafeteria quando ouvi uma conversa que mudou minha visão sobre [tema]."

  why_works: "Humanos são programados para histórias"

provocation:
  template: "[Desafia crença comum]"

  examples:
    - "Todo mundo está fazendo [X] errado. Inclusive eu, até semana passada."
    - "Se você acha que [crença comum], precisa ler isso."
    - "Vou te contar algo que pode te irritar."

  why_works: "Cria dissonância cognitiva"

confession:
  template: "[Admite algo vulnerável]"

  examples:
    - "Vou te contar algo que me dá vergonha admitir."
    - "Eu menti pra você. Não intencionalmente, mas..."
    - "Eu quase não mandei esse email porque [razão]."

  why_works: "Vulnerabilidade cria conexão"

curiosity_gap:
  template: "[Padrão ou observação sem resolução]"

  examples:
    - "Existe um padrão entre as pessoas mais bem-sucedidas que conheço."
    - "A diferença entre [A] e [B] se resume a uma coisa."
    - "Eu passei semanas observando [fenômeno] e finalmente entendi."

  why_works: "Cérebro precisa de closure"

contrarian:
  template: "[Oposto do conselho comum]"

  examples:
    - "Vou te dar o conselho que ninguém te dá: [conselho contrário]."
    - "Ignore [conselho popular]. Aqui está o porquê."
    - "Todo mundo fala pra fazer [X]. Eu digo: não faça."

  why_works: "Diferencia, exige atenção"

timely:
  template: "[Evento atual + sua perspectiva]"

  examples:
    - "Você viu o que aconteceu com [evento]? Isso me fez pensar em..."
    - "Todo mundo está falando de [trending]. Minha opinião impopular:"
    - "Depois de [evento recente], eu tinha que compartilhar isso."

  why_works: "Relevância e timing"

question:
  template: "[Pergunta provocadora]"

  examples:
    - "Você já parou pra pensar por que [fenômeno]?"
    - "Quantas vezes você já [ação comum] e não deu em nada?"
    - "O que você faria se [cenário]?"

  why_works: "Perguntas engajam ativamente"
```

---

## Phase 5: Value Delivery Frameworks

### 5.1 Framework 1-3-1 (Ramit Sethi)

```yaml
structure:
  1_story: "Uma história ou contexto (gancho)"
  3_points: "Três pontos de valor acionável"
  1_cta: "Um call to action claro"

template:
  |
  [HISTÓRIA/CONTEXTO]
  Semana passada, tive uma conversa com um leitor que ficou na minha cabeça...

  [PONTO 1]
  Primeiro, ela estava cometendo o erro de [X]

  [PONTO 2]
  Segundo, ela não percebia que [Y]

  [PONTO 3]
  Terceiro, a solução simples era [Z]

  [CTA]
  Se isso ressoou com você, responde esse email me contando...

why_works: "Estruturado, fácil de consumir, acionável"
best_for: "Newsletters semanais, educacionais"
```

### 5.2 Story → Lesson → Application

```yaml
structure:
  story: "Conta história engajante (40%)"
  lesson: "Extrai o insight/princípio (20%)"
  application: "Mostra como aplicar (30%)"
  cta: "Call to action (10%)"

template:
  |
  [HISTÓRIA]
  Três anos atrás, eu estava prestes a desistir.
  Meu negócio estava fracassando, minhas economias haviam acabado,
  e eu não fazia ideia do que fazer.
  Então algo inesperado aconteceu...

  [LIÇÃO]
  A lição? Às vezes a virada não vem de fazer mais,
  mas de parar de fazer as coisas erradas.

  [APLICAÇÃO]
  Como você pode aplicar isso:
  1. Identifique o que não está funcionando (seja honesto)
  2. Pare de fazer essas coisas (sim, de verdade)
  3. Dobre a aposta no que ESTÁ funcionando

  [CTA]
  Qual é uma coisa que você deveria parar de fazer?
  Responde esse email.

best_for: "Conexão emocional, personal branding"
```

### 5.3 Problem → Solution → Proof

```yaml
structure:
  problem: "Identifica a dor do leitor"
  solution: "Apresenta seu insight/resposta"
  proof: "Mostra evidência que funciona"

template:
  |
  [PROBLEMA]
  Se você está gastando horas em [tarefa] e não chegando a lugar nenhum...

  [SOLUÇÃO]
  A solução é mais simples do que você imagina: [método]
  Funciona porque [explicação do mecanismo]

  [PROVA]
  Aqui está o que aconteceu quando [cliente] tentou: [resultado específico]

best_for: "Conteúdo educacional, promoção de produto"
```

---

## Phase 6: Soft Selling Techniques

### 6.1 A Filosofia Value-First

```yaml
principle: "Dê tanto valor que eles se sintam obrigados a comprar"

ratio:
  value_emails: "3-4 emails de valor para cada 1 de venda"
  within_email: "80% valor, 20% pitch (se houver)"

ramit_insight:
  |
  "90% da nossa receita vem de email marketing.
  Mas 90% dos nossos emails não vendem nada.
  Quando você entrega valor consistentemente,
  vender se torna a parte fácil."
```

### 6.2 Técnicas de CTA Suave

```yaml
ps_promotion:
  description: "Coloca a venda no P.S."

  template:
    |
    [Email completo de valor...]

    [Assinatura]

    P.S. Se você quer se aprofundar em [tema],
    [Produto] pode ser exatamente o que você precisa.
    [Link]

  why_works: "P.S. é uma das seções mais lidas"

natural_bridge:
  description: "Transição natural do conteúdo para oferta"

  template:
    |
    Por falar em [tema], é exatamente isso que cobrimos
    em [Produto]. Se faz sentido pra você: [link]

  why_works: "Conexão lógica com o conteúdo"

soft_recommendation:
  description: "Como recomendaria a um amigo"

  template:
    |
    Se isso ressoou com você, acho que vai gostar de [Produto].
    Não é pra todo mundo, mas se [critério], pode ser perfeito.

  why_works: "Tom de conselho, não de venda"
  dont: "BUY NOW! LIMITED TIME! (nunca)"

content_upgrade:
  description: "Oferece versão expandida"

  template:
    |
    Quer o checklist completo com todos os [X] passos?
    Coloquei num PDF gratuito. [Link para lead magnet]

  why_works: "Valor adicional, captura leads"
```

### 6.3 Quando Vender (e Quando Não)

```yaml
sell_when:
  - "Você entregou valor consistente"
  - "O produto genuinamente ajuda no tema discutido"
  - "Há conexão natural com o conteúdo"
  - "Período de lançamento/promoção"
  - "O leitor está pronto (awareness level)"

dont_sell_when:
  - "Todo email (fadiga)"
  - "Sem conexão com o conteúdo"
  - "Ainda não construiu confiança"
  - "O ask é grande demais para o relacionamento"
```

---

## Phase 7: Newsletter Structure

### 7.1 Template Visual

```
┌─────────────────────────────────────┐
│ SUBJECT LINE                        │
│ (Curiosidade + sinal de valor)      │
├─────────────────────────────────────┤
│ PREVIEW TEXT                        │
│ (Complementa subject, estende hook) │
├─────────────────────────────────────┤
│ ABERTURA (2-3 linhas)               │
│ Hook que ganha a próxima frase      │
├─────────────────────────────────────┤
│ CORPO (300-800 palavras)            │
│ Conteúdo principal de valor         │
│ - História, tutorial ou curadoria   │
│ - Subheads para escaneabilidade     │
├─────────────────────────────────────┤
│ TAKEAWAY                            │
│ Resume o ponto-chave/ação           │
├─────────────────────────────────────┤
│ CTA (opcional)                      │
│ Prompt de resposta, link ou produto │
├─────────────────────────────────────┤
│ ASSINATURA                          │
│ Pessoal, humanizada                 │
├─────────────────────────────────────┤
│ P.S. (opcional)                     │
│ Frequentemente a seção mais lida    │
└─────────────────────────────────────┘
```

### 7.2 Diretrizes de Tamanho

```yaml
ideal_length:
  minimum: "300 palavras"
  optimal: "500-800 palavras"
  maximum: "1500 palavras (para conteúdo denso)"

by_format:
  curation: "300-500 palavras"
  essay: "800-1500 palavras"
  tutorial: "600-1000 palavras"
  story_lesson: "500-800 palavras"
  qa: "400-800 palavras"

principles:
  - "Mais longo ≠ melhor"
  - "Densidade de valor importa mais que tamanho"
  - "Respeite o tempo do leitor"
  - "Match tamanho ao tipo de conteúdo"
```

---

## Phase 8: Output Deliverables

### 8.1 Output Format

```yaml
newsletter_deliverable:
  metadata:
    format: "[Curation/Essay/Tutorial/Story+Lesson/Q&A/Hybrid]"
    word_count: "[Número]"
    reading_time: "[X] minutos"
    cta_type: "[Reply/Click/Product/None]"

  subject_lines:
    primary: "[Subject line principal]"
    variation_1: "[Alternativa 1]"
    variation_2: "[Alternativa 2]"

  preview_text: "[Preview text]"

  complete_newsletter: |
    [Newsletter completa pronta para envio]

  cta_options:
    soft_cta: "[CTA suave]"
    direct_cta: "[CTA direto - se aplicável]"
    reply_prompt: "[Prompt para resposta]"
```

### 8.2 Complete Deliverable Package

```yaml
package_contents:
  strategy:
    format: "[Formato escolhido]"
    hook_type: "[Tipo de hook usado]"
    value_framework: "[Framework de valor]"
    cta_approach: "[Abordagem de CTA]"

  content:
    subject_lines: "[3 opções]"
    preview_text: "[Preview]"
    complete_newsletter: "[Newsletter completa]"

  variations:
    opening_variation: "[Abertura alternativa]"
    cta_variation: "[CTA alternativo]"

  metrics_to_track:
    - Open rate
    - Click rate
    - Reply rate
    - Unsubscribe rate

  testing_suggestions:
    - "[O que testar A/B]"
```

---

## Phase 9: Quality Assurance

### 9.1 Quality Checklist

```yaml
value_check:
  - [ ] Leitor aprende algo útil?
  - [ ] Poderia ser cobrado por esse conteúdo?
  - [ ] É específico (não genérico)?
  - [ ] Tem insight original ou perspectiva única?

engagement_check:
  - [ ] Abertura prende atenção nos primeiros 2 segundos?
  - [ ] É fácil de ler (escaneável)?
  - [ ] Tem personalidade/voz consistente?
  - [ ] Parágrafos curtos (2-3 frases)?

relationship_check:
  - [ ] Humaniza você/marca?
  - [ ] Convida interação/resposta?
  - [ ] Tom é consistente com edições anteriores?
  - [ ] Leitor se sente falando com uma pessoa, não empresa?

cta_check:
  - [ ] Se vende, é natural e conectado ao conteúdo?
  - [ ] Não é agressivo/spammy?
  - [ ] Faz sentido para o awareness level do leitor?
  - [ ] Ação é clara e fácil de executar?

technical_check:
  - [ ] Subject line < 50 caracteres?
  - [ ] Preview text configurado?
  - [ ] Links funcionando?
  - [ ] Mobile-friendly?
  - [ ] Sem erros de gramática/ortografia?
```

### 9.2 Métricas de Performance

```yaml
benchmarks:
  open_rate:
    good: "20-25%"
    excellent: "30%+"
    factors: "Subject line, sender reputation, send time"

  click_rate:
    good: "2-3%"
    excellent: "5%+"
    factors: "Content relevance, CTA clarity"

  reply_rate:
    why_track: "Maior sinal de engajamento"
    how_to_increase: "Perguntas, convites para resposta"

  unsubscribe_rate:
    acceptable: "<0.5% por email"
    concerning: ">1%"
    note: "Algumas desscrições são saudáveis"
```

---

## Phase 10: Copywriter Style Guides

### 10.1 Ramit Sethi Style

```yaml
characteristics:
  - Value-first, venda é secundária
  - Específico com números e detalhes
  - Tom de "amigo esperto"
  - Stories pessoais com lições
  - Chamadas diretas para ação de resposta

voice_markers:
  - "Deixa eu te contar..."
  - "Aqui está exatamente como..."
  - "A maioria das pessoas [erro]. Aqui está o que funciona:"
  - Uso de itálico para ênfase
  - Perguntas retóricas

best_for: "Educacional, cursos, coaching, SaaS"
```

### 10.2 Laura Belgray Style

```yaml
characteristics:
  - Extremamente conversacional
  - Humor e personalidade
  - Stories mundanas com insights
  - Parece email de amigo
  - Absolutamente não-corporativo

voice_markers:
  - "Okay, então..."
  - "Tipo, sabe quando..."
  - Referências pop culture
  - Parênteses com apartes
  - Emojis ocasionais (mas poucos)

best_for: "Personal brands, criativos, coaches"
```

### 10.3 Gary Halbert Style

```yaml
characteristics:
  - Storytelling como método principal
  - Cartas pessoais e íntimas
  - Construção de suspense
  - Direct response mascarado de conversa
  - P.S. sempre poderoso

voice_markers:
  - Abertura com história pessoal
  - "Meu caro amigo..."
  - Detalhes vívidos e específicos
  - Cliffhangers no meio

best_for: "High-ticket, relacionamento longo"
```

### 10.4 Dan Kennedy Style

```yaml
characteristics:
  - Opiniões fortes e polarizantes
  - Direct response sem vergonha
  - Urgência e escassez
  - Filtra não-compradores ativamente
  - Não tenta agradar todo mundo

voice_markers:
  - "Se você é [tipo], pare de ler agora"
  - Deadlines e limites
  - Consequências claras de não agir
  - Tom de autoridade

best_for: "Ofertas premium, audiências B2B"
```

---

## Appendix: Frequency Guidelines

### A.1 Opções de Frequência

```yaml
daily:
  pros:
    - "Maior engajamento e formação de hábito"
    - "Top of mind constantemente"
    - "Mais oportunidades de vender"
  cons:
    - "Alto esforço de produção"
    - "Risco de fadiga"
    - "Qualidade pode sofrer"
  best_for: "Notícias, dicas rápidas"

weekly:
  pros:
    - "Produção sustentável"
    - "Engajamento equilibrado"
    - "Padrão da indústria"
  cons:
    - "Pode perder momentum"
    - "Competição no inbox"
  best_for: "Maioria das newsletters"

biweekly:
  pros:
    - "Mais tempo para qualidade"
    - "Menos fadiga no inbox"
  cons:
    - "Risco de esquecimento"
    - "Menos touchpoints"
  best_for: "Conteúdo denso, long-form"

monthly:
  pros:
    - "Alta qualidade possível"
    - "Sensação de evento especial"
  cons:
    - "Risco de baixo engajamento"
    - "Fácil de esquecer"
  best_for: "Curadoria extensiva, premium"
```

### A.2 Regras de Consistência

```yaml
rules:
  - "Escolha um dia e horário, mantenha"
  - "Mesmo nome de remetente sempre"
  - "Formato previsível"
  - "Nunca suma da lista"

best_times:
  days: "Terça, Quarta, Quinta"
  times: "6-8h, 12-13h, 20-21h"
  caveat: "Teste SUA audiência - esses são médias"
```

---

## Version History

```yaml
version: 2.0
date: 2026-01-23
author: Ralph Autonomous Agent
project: Copy Framework v2.0 Upgrade
story: US-035

changes:
  - Complete rewrite following Framework v2.0 standards
  - Added comprehensive format selection guide
  - Expanded subject line formulas with psychology
  - Added detailed opening hook patterns
  - Added value delivery frameworks (1-3-1, Story→Lesson→Application)
  - Added soft selling techniques
  - Added copywriter style guides
  - Added quality checklist
  - Research foundation: 590+ lines

line_count: 850+
quality_gates:
  - [x] 600+ lines ✓
  - [x] Research foundation referenced ✓
  - [x] Multiple formats covered ✓
  - [x] Subject line formulas ✓
  - [x] Quality checklist included ✓
  - [x] Actionable output format ✓
```

---

*Task Version: 2.0*
*Copy Framework v2.0 Upgrade*
*Research: docs/research/newsletter-methodology-research.md*
