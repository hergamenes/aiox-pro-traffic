---
task: Create Landing Page Task
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

# Create Landing Page Task

Task completo para criar landing pages de alta conversão usando metodologias científicas de CRO e copywriting.

## Metadata

```yaml
task:
  name: Create Landing Page
  id: create-landing-page
  version: "2.0"
  category: copywriting
  primary_frameworks:
    - MECLABS Conversion Heuristic
    - Schwartz Awareness Levels
    - Unbounce Conversion Centered Design
    - StoryBrand BrandScript
    - Hopkins Scientific Testing
  page_types:
    - squeeze_page
    - webinar_registration
    - waitlist
    - demo_request
    - sales_page
  quality_standard: "Minimum 7/10 on conversion checklist"
```

---

## FASE 0: DIAGNÓSTICO OBRIGATÓRIO (SCHWARTZ TIER 0)

### Por Que Awareness Level é MANDATÓRIO

Antes de escrever qualquer copy, você DEVE identificar o nível de consciência do público-alvo. Uma landing page criada para "Product Aware" fracassará completamente com tráfego "Unaware".

### Os 5 Níveis de Consciência de Schwartz

```yaml
awareness_levels:

  1_most_aware:
    description: "Conhecem seu produto, querem oferta"
    characteristics:
      - Clientes existentes
      - Leads quentes/retargeting
      - Já decidiram, comparam preços
    traffic_sources:
      - Lista de clientes
      - Carrinho abandonado
      - Retargeting quente
    page_strategy:
      headline: "Oferta direta (preço, desconto)"
      length: "Curta (500-800 palavras)"
      focus: "Deal, condições, urgência"
    example_headline: "[Produto] - 50% off só esta semana"

  2_product_aware:
    description: "Conhecem você, não convencidos"
    characteristics:
      - Visitantes que retornam
      - Leads de conteúdo
      - Comparando alternativas
    traffic_sources:
      - Retargeting de visitantes
      - Leads de webinar
      - Seguidores engajados
    page_strategy:
      headline: "Diferenciação + prova"
      length: "Média (1500-2500 palavras)"
      focus: "Por que você, não concorrente"
    example_headline: "Por que 47.000 empreendedores escolheram [Produto]"

  3_solution_aware:
    description: "Conhecem categoria, não você"
    characteristics:
      - Pesquisaram soluções
      - Conhecem tipo de produto
      - Não encontraram ideal
    traffic_sources:
      - Pesquisa por categoria
      - Comparação de produtos
      - Reviews de concorrentes
    page_strategy:
      headline: "Categoria + mecanismo único"
      length: "Média-longa (2000-3500 palavras)"
      focus: "Sua abordagem diferente"
    example_headline: "O [tipo] que [diferenciador inesperado]"

  4_problem_aware:
    description: "Sabem do problema, não da solução"
    characteristics:
      - Sentem a dor
      - Não pesquisaram soluções
      - Precisam de esperança
    traffic_sources:
      - Pesquisa por sintoma
      - Grupos de discussão
      - Conteúdo educacional
    page_strategy:
      headline: "Dor/sintoma + esperança"
      length: "Longa (3000-5000 palavras)"
      focus: "Agitação → Revelação → Solução"
    example_headline: "Se você [sintoma], leia isso"

  5_unaware:
    description: "Não sabem do problema"
    characteristics:
      - Audiência fria total
      - Não pesquisaram nada
      - Precisam de disrupção
    traffic_sources:
      - Display ads
      - Facebook cold
      - YouTube broad
    page_strategy:
      headline: "Story + curiosidade"
      length: "Muito longa (5000+) ou VSL"
      focus: "História → Problema → Solução"
    example_headline: "A maioria dos empreendedores trabalha de graça sem saber"
```

### Checklist de Diagnóstico

```yaml
diagnosis_questions:
  - "De onde vem esse tráfego?"
  - "O prospect já pesquisou soluções?"
  - "Ele conhece nossa marca?"
  - "Ele sabe que tem um problema?"
  - "Qual é o match entre ad/source e página?"
```

---

## FASE 1: COLETA DE INPUTS

### Inputs Obrigatórios

```yaml
required_inputs:

  page_type:
    description: "Tipo de landing page"
    options:
      squeeze_page:
        purpose: "Captura email por lead magnet"
        conversion: "30-60%"
      webinar_registration:
        purpose: "Inscrição para webinar"
        conversion: "30-50%"
      waitlist:
        purpose: "Lista de espera pré-lançamento"
        conversion: "40-70%"
      demo_request:
        purpose: "Agendar demo/call"
        conversion: "5-20%"
      sales_page:
        purpose: "Venda direta"
        conversion: "0.5-5%"

  offer:
    description: "O que o visitante recebe"
    examples:
      - Lead magnet (ebook, checklist, template)
      - Acesso a webinar
      - Entrada na lista VIP
      - Demo personalizada
      - Produto/serviço

  target_avatar:
    description: "Público-alvo específico"
    required_info:
      - Demografia básica
      - Principal dor/problema
      - Desejo principal
      - Objeções comuns

  main_benefit:
    description: "Benefício/resultado principal"
    format: "Específico, mensurável quando possível"
    example: "Dobrar faturamento em 90 dias"

  awareness_level:
    description: "Nível Schwartz identificado"
    options:
      - most_aware
      - product_aware
      - solution_aware
      - problem_aware
      - unaware
```

### Inputs Opcionais

```yaml
optional_inputs:

  traffic_source:
    description: "De onde vem o tráfego"
    options:
      - paid_ads (Facebook, Google)
      - organic (SEO, social)
      - email (lista própria)
      - referral (afiliados)
    impact: "Message match e expectativa"

  urgency:
    description: "Se há limite de tempo/vagas"
    requirements:
      - Deve ser genuíno
      - Consequência clara
    examples:
      - "Inscrições fecham [data]"
      - "Apenas [X] vagas"

  social_proof:
    description: "Evidência de resultados"
    types:
      - Número de clientes/alunos
      - Testimonials com resultados
      - Logos de empresas
      - Media mentions

  unique_mechanism:
    description: "O que torna diferente"
    example: "Método de 3 Fases"

  tone:
    description: "Tom desejado"
    options:
      - professional
      - conversational
      - provocative
      - educational
```

---

## FASE 2: ESTRUTURAS POR TIPO DE PÁGINA

### Tipo 1: SQUEEZE PAGE

```yaml
squeeze_page:
  purpose: "Captura email por lead magnet"
  target_conversion: "30-60%"
  length: "Above-the-fold apenas"

  structure:
    above_fold_only:
      element_1:
        type: "Headline"
        formula: "[Número] [Estratégias/Dicas] Para [Resultado]"
        alternatives:
          - "Como [Resultado] em [Tempo]"
          - "O Guia Completo Para [Resultado]"
          - "[Checklist/Template] de [Resultado]"

      element_2:
        type: "Subheadline (opcional)"
        formula: "Baixe grátis o [tipo] que [benefício]"

      element_3:
        type: "Imagem do Lead Magnet"
        specs: "Mockup 3D, cover, ou preview"

      element_4:
        type: "Form"
        fields: "Email apenas (ou + nome)"
        labels:
          email: "Seu melhor email"
          name: "Como posso te chamar?"

      element_5:
        type: "CTA Button"
        formula: "Quero Meu [Nome do Lead Magnet]"
        alternatives:
          - "Baixar Agora (Grátis)"
          - "Acessar [Conteúdo]"
          - "Enviar Para Meu Email"

      element_6:
        type: "Micro Social Proof (opcional)"
        examples:
          - "Mais de X pessoas baixaram"
          - "Usado por empresas como [logos]"

  example:
    headline: "7 Scripts de Email Que Converteram [RESULTADO_TOTAL_EXEMPLO]"
    subheadline: "Baixe grátis os templates que você pode copiar hoje"
    lead_magnet_image: "[Mockup 3D do PDF]"
    form: "[Campo de email]"
    cta: "Quero Meus Scripts Grátis"
    micro_proof: "Mais de 15.000 pessoas já baixaram"

  rules:
    - Zero navigation
    - Uma única ação
    - Lead magnet visualmente atraente
    - Benefício claro no headline
```

### Tipo 2: WEBINAR REGISTRATION PAGE

```yaml
webinar_registration:
  purpose: "Inscrição para webinar"
  target_conversion: "30-50%"
  length: "1500-2000 palavras"

  structure:
    section_1_above_fold:
      tag: "[MASTERCLASS GRATUITA]"
      headline:
        formula: "Como [Resultado] em [Tempo]"
        alternatives:
          - "Masterclass: [Tema] - Ao Vivo"
          - "Workshop Gratuito: [Resultado]"
          - "[Número] Estratégias Para [Resultado]"
      date_time: "[Dia], [Data] às [Horário]"
      presenter_photo: "Foto profissional"
      form: "Nome + Email"
      cta: "Reservar Minha Vaga"

    section_2_what_youll_learn:
      title: "O Que Você Vai Descobrir:"
      bullets: "3-5 pontos específicos"
      format:
        - "✅ [Benefício 1 com especificidade]"
        - "✅ [Benefício 2 com curiosidade]"
        - "✅ [Benefício 3 com resultado]"

    section_3_presenter:
      title: "Sobre [Nome]"
      content:
        - Mini bio (2-3 frases)
        - Credenciais principais
        - Resultado impressionante

    section_4_who_is_for:
      title: "Este Masterclass é Para Você Se:"
      bullets: "3-4 qualificações"

    section_5_bonus:
      title: "Bônus Por Se Inscrever:"
      content: "Algo de valor imediato"

    section_6_cta_repeat:
      headline: "Reserve Sua Vaga Agora"
      urgency: "[Se genuína]"
      form_repeat: "Nome + Email"
      cta: "Garantir Meu Lugar"

    section_7_faq:
      questions: "2-3 mais comuns"

  example:
    tag: "[MASTERCLASS GRATUITA]"
    headline: "Como Criar Lançamentos de 6 Dígitos Sem Audiência"
    date: "Quinta-feira, 25 de Janeiro às 20h"
    bullets:
      - "✅ O sistema de 3 passos que faturou [RESULTADO_COM_LISTA_ENXUTA] com lista de 500 pessoas"
      - "✅ Por que audiência grande não é pré-requisito (e o que realmente importa)"
      - "✅ A estrutura exata de oferta que converte frio em comprador"
    presenter: "João Silva - Especialista em lançamentos, ajudou 200+ empreendedores..."
    cta: "Reservar Minha Vaga (Grátis)"

  rules:
    - Data e hora bem visíveis
    - Presenter foto humaniza
    - Bullets específicos (não genéricos)
    - Bonus incentiva ação imediata
```

### Tipo 3: WAITLIST PAGE

```yaml
waitlist_page:
  purpose: "Lista de espera pré-lançamento"
  target_conversion: "40-70%"
  length: "Mínima (squeeze-style)"

  structure:
    minimal:
      element_1:
        type: "Headline"
        formula: "Seja o Primeiro a Saber Quando [Produto] Lançar"
        alternatives:
          - "Lista VIP: Acesso Antecipado a [Produto]"
          - "Entre na Lista de Espera Para [Benefício]"
          - "Lançamento Em Breve - Garanta Sua Vaga"

      element_2:
        type: "Teaser"
        content: "1-2 frases sobre o que está por vir"

      element_3:
        type: "Countdown (opcional)"
        condition: "Se data de lançamento definida"

      element_4:
        type: "Form"
        fields: "Email apenas"

      element_5:
        type: "CTA"
        formula: "Entrar na Lista VIP"
        alternatives:
          - "Me Avise Quando Lançar"
          - "Quero Acesso Antecipado"

      element_6:
        type: "Benefício da Lista"
        examples:
          - "Você será o primeiro a saber"
          - "Desconto exclusivo para a lista"
          - "Bônus especial para quem entrar"

  example:
    headline: "Lista VIP: Acesso Antecipado ao Curso [Nome]"
    teaser: "Algo grande está chegando em Março. Esteja entre os primeiros."
    form: "[Campo de email]"
    cta: "Entrar na Lista VIP"
    benefit: "Membros da lista ganham 30% de desconto no lançamento"

  rules:
    - Exclusividade é o driver principal
    - Benefício concreto por entrar
    - Simplicidade máxima
```

### Tipo 4: DEMO/CALL REQUEST PAGE

```yaml
demo_page:
  purpose: "Agendar demonstração ou call"
  target_conversion: "5-20%"
  length: "1000-2000 palavras"

  structure:
    section_1_above_fold:
      headline:
        formula: "Agende Sua [Tipo de Call] Gratuita"
        alternatives:
          - "[Tempo] Para Descobrir [Benefício]"
          - "Veja Como [Resultado] - Demo Personalizada"
      subheadline: "Sem compromisso. [Tempo] para [benefício]"
      calendar_embed: "Calendly ou similar"
      # OU form com campos de qualificação

    section_2_what_happens:
      title: "O Que Acontece Na Call:"
      bullets:
        - "[Passo 1]: Entendemos sua situação"
        - "[Passo 2]: Identificamos oportunidades"
        - "[Passo 3]: Mostramos próximos passos"
      time: "Duração: [X] minutos"

    section_3_who_is_for:
      title: "Esta Call é Para Você Se:"
      bullets: "3-4 qualificações"

    section_4_who_is_not_for:
      title: "Esta Call NÃO é Para Você Se:"
      bullets: "2-3 desqualificações"
      purpose: "Filtrar leads ruins"

    section_5_proof:
      type: "Testimonial de quem fez a call"
      content: "Mini depoimento + resultado"

    section_6_faq:
      questions: "3-4 mais comuns"

  form_fields:
    minimum:
      - Nome
      - Email
      - Telefone
    qualifying:
      - "Qual seu principal desafio?"
      - "Qual seu faturamento atual?"
      - "Qual seu orçamento para essa solução?"

  example:
    headline: "Agende Sua Análise de Marketing Gratuita"
    subheadline: "30 minutos para descobrir onde você está perdendo dinheiro"
    what_happens:
      - "1. Analisamos seu funil atual"
      - "2. Identificamos vazamentos de conversão"
      - "3. Mostramos plano de ação personalizado"
    cta: "Agendar Minha Análise"

  rules:
    - Valor claro da call (não só "conversar")
    - Campos de qualificação se necessário
    - Testimonial de call anterior
    - Desqualificação filtra leads ruins
```

### Tipo 5: SALES PAGE (Long-Form)

```yaml
sales_page:
  purpose: "Venda direta de produto/serviço"
  target_conversion: "0.5-5%"
  length: "3000-10000+ palavras"
  note: "Ver tasks/create-sales-page.md para estrutura completa"

  summary_structure:
    section_1: "Pre-head + Headline + Subheadline"
    section_2: "Lead/Hook (história ou problema)"
    section_3: "Agitação do problema"
    section_4: "Revelação da solução"
    section_5: "Mecanismo único"
    section_6: "Credenciais/autoridade"
    section_7: "Benefícios (bullets)"
    section_8: "Testimonials/prova"
    section_9: "Apresentação da oferta"
    section_10: "Bonus stack"
    section_11: "Garantia"
    section_12: "CTA"
    section_13: "FAQ"
    section_14: "CTA final"
```

---

## FASE 3: FÓRMULAS DE COPY

### Headline Formulas por Tipo de Página

```yaml
headline_formulas:

  squeeze_page:
    benefit:
      - "[Número] [Dicas/Estratégias] Para [Resultado]"
      - "O Guia Completo Para [Resultado]"
      - "[Checklist/Template] de [Resultado]"
    curiosity:
      - "O Segredo de [Autoridade] Para [Resultado]"
      - "Por Que [Crença] Está Errado"
    how_to:
      - "Como [Resultado] em [Tempo]"
      - "Como [Resultado] Sem [Obstáculo]"

  webinar:
    masterclass:
      - "Masterclass Gratuita: [Resultado] em [Tempo]"
      - "Workshop Ao Vivo: [Tema]"
    training:
      - "Treinamento: [Resultado] (Mesmo Se [Objeção])"
      - "[Número] Estratégias Para [Resultado]"
    reveal:
      - "Como [Resultado] - Revelado Ao Vivo"
      - "A Verdade Sobre [Tópico]"

  waitlist:
    exclusivity:
      - "Seja o Primeiro a Saber Quando [Produto] Lançar"
      - "Lista VIP: Acesso Antecipado a [Produto]"
    anticipation:
      - "Algo Grande Está Chegando"
      - "[Produto] Chega Em Breve"

  demo:
    value:
      - "Agende Sua [Tipo de Call] Gratuita"
      - "[Tempo] Para Descobrir [Benefício]"
    result:
      - "Veja Como [Resultado] - Demo Personalizada"
      - "Descubra Onde Você Está Perdendo [Recurso]"
```

### Subheadline Formulas

```yaml
subheadline_formulas:

  expands_headline:
    - "[Especifica o benefício com detalhes]"
    - "[Adiciona credibilidade]"
    - "[Qualifica o público]"

  handles_objection:
    - "Sem [Objeção Comum]"
    - "Mesmo Se [Limitação]"
    - "Funciona Para [Público Específico]"

  adds_proof:
    - "Usado Por [Número] [Avatar]"
    - "O Método Que [Autoridade] Usa"
    - "Comprovado Por [Evidência]"

  examples:
    headline: "Como Dobrar Seu Faturamento em 90 Dias"
    options:
      expands: "O sistema passo a passo para negócios digitais"
      objection: "Sem investir em anúncios ou contratar equipe"
      proof: "Usado por mais de 2.000 empreendedores"
```

### CTA Button Copy

```yaml
cta_formulas:

  download:
    - "Baixar Agora (Grátis)"
    - "Quero Meu [Nome do Lead Magnet]"
    - "Enviar Para Meu Email"
    - "Acessar [Conteúdo] Grátis"

  registration:
    - "Reservar Minha Vaga"
    - "Quero Participar (Grátis)"
    - "Garantir Meu Lugar"
    - "Inscrever-Me Agora"

  waitlist:
    - "Entrar na Lista VIP"
    - "Me Avise Quando Lançar"
    - "Quero Acesso Antecipado"

  demo:
    - "Agendar Minha Análise"
    - "Quero Uma Demo"
    - "Conversar Com Especialista"

  purchase:
    - "Quero Começar Agora"
    - "Sim, Quero [Resultado]!"
    - "Garantir Minha Vaga"

  rules:
    - Use primeira pessoa ("Meu" > "Seu")
    - Include benefit when possible
    - Action verb + outcome
    - Avoid: "Submit", "Click Here", "Enter"
```

### Bullet Point Formulas

```yaml
bullet_formulas:

  benefit_bullets:
    - "Como [alcançar resultado específico]"
    - "[Número] maneiras de [benefício]"
    - "A técnica de [autoridade] para [resultado]"

  curiosity_bullets:
    - "O segredo para [resultado] (revelado na página X)"
    - "A única coisa que [grupo de sucesso] faz diferente"
    - "O erro de R$[valor] que [avatar] comete"

  specificity_bullets:
    - "Como [resultado específico] em [tempo específico]"
    - "A estratégia de [X] passos que gerou R$[valor]"
    - "O script de [X] palavras que [resultado]"

  objection_bullets:
    - "[Resultado] mesmo se [objeção comum]"
    - "Funciona mesmo para quem [limitação]"
    - "Sem [sacrifício comum]"
```

---

## FASE 4: UNBOUNCE - CONVERSION CENTERED DESIGN

### Os 7 Princípios de Oli Gardner

```yaml
unbounce_principles:

  1_attention_ratio:
    rule: "1:1 - Uma ação, um objetivo"
    implementation:
      remove:
        - Menu de navegação
        - Links para outros conteúdos
        - Social media links
        - Footer elaborado
      keep:
        - Um CTA principal (repetido)
        - Link de política de privacidade
        - Logo (sem link)

  2_encapsulation:
    rule: "Enquadrar elementos importantes"
    implementation:
      - Caixa ao redor do form
      - Background diferente para CTA
      - Bordas em testimonials
      - Espaço negativo ao redor

  3_contrast_color:
    rule: "CTA deve contrastar com tudo"
    implementation:
      - CTA única cor distinta
      - Não usar essa cor em mais nada
      - Squint test: borra os olhos, CTA se destaca?

  4_directional_cues:
    rule: "Guiar o olhar para CTA"
    implementation:
      - Pessoa olhando para form
      - Setas sutis
      - Números de passos
      - Scroll indicators

  5_white_space:
    rule: "Espaço = foco e legibilidade"
    implementation:
      - Espaço generoso entre seções
      - Muito espaço ao redor do CTA
      - Parágrafos não comprimidos

  6_urgency_scarcity:
    rule: "Razões GENUÍNAS para agir agora"
    implementation:
      - Deadline real (countdown)
      - Vagas limitadas (número real)
      - Bônus por tempo limitado
    red_flags:
      - Countdown que reinicia
      - "Últimas vagas" sempre
      - Escassez falsa

  7_social_proof:
    rule: "Evidência de que outros escolheram"
    hierarchy:
      1: "Video testimonials"
      2: "Case studies com números"
      3: "Testimonials com foto + cargo"
      4: "Número de clientes"
      5: "Logos de empresas"
      6: "Media mentions"
      7: "Trust badges"
```

---

## FASE 5: STORYBRAND FRAMEWORK

### BrandScript para Landing Pages

```yaml
storybrand_elements:

  1_character:
    question: "Quem é o herói? (CLIENTE, não você)"
    output: "Definição clara do avatar"

  2_problem:
    levels:
      external: "Problema prático visível"
      internal: "Frustração emocional"
      philosophical: "Por que isso é errado"
    example:
      external: "Não consegue escalar além de 50k/mês"
      internal: "Sente que está deixando dinheiro na mesa"
      philosophical: "Empreendedores merecem crescer"

  3_guide:
    qualities:
      empathy: "Eu entendo como é..."
      authority: "Eu já ajudei X pessoas..."
    implementation: "Guide section na página"

  4_plan:
    requirements:
      - Máximo 3-4 passos
      - Nomes simples e claros
      - Numerados visualmente
    example:
      - "1. Diagnóstico"
      - "2. Implementação"
      - "3. Escala"

  5_call_to_action:
    types:
      direct: "CTA principal (compra, inscrição)"
      transitional: "CTA secundário (download, vídeo)"

  6_failure:
    purpose: "O que acontece se não agir"
    placement: "Stakes section"

  7_success:
    purpose: "Transformação se agir"
    placement: "Value/benefits section"
```

### One-Liner Formula

```yaml
one_liner:
  formula: "[PROBLEMA] + [SOLUÇÃO] + [RESULTADO]"

  example:
    problem: "A maioria das empresas luta para escalar"
    solution: "Nós criamos sistemas de automação"
    result: "Que triplicam faturamento sem aumentar equipe"
    combined: "A maioria das empresas luta para escalar. Nós criamos sistemas de automação que triplicam faturamento sem aumentar equipe."

  length: "2-3 frases, máximo 30 palavras"
  placement: "Hero section"
```

---

## FASE 6: FORMULÁRIOS E OTIMIZAÇÃO

### Regras de Formulário

```yaml
form_rules:

  field_impact:
    email_only: "Baseline (40-60% conversion)"
    plus_name: "-10-15% conversion"
    plus_phone: "-20-30% conversion"
    plus_company: "-10-15% conversion"
    plus_qualifying: "-15-25% conversion"

  when_more_fields:
    - B2B lead gen (qualify > quantity)
    - High-ticket sales
    - Demo requests

  when_minimize:
    - Top of funnel
    - Paid traffic
    - High-volume goals

  field_labels:
    avoid: ["Email Address", "First Name", "Submit"]
    prefer:
      - "Seu melhor email"
      - "Como posso te chamar?"
      - "Quero Meu [Lead Magnet]"

  multi_step:
    benefit: "Higher completion than long forms"
    structure:
      step_1: "Easy (name, email)"
      step_2: "Qualifying questions"
      step_3: "Contact details"
    rule: "Always show progress"
```

### Anxiety Reducers

```yaml
anxiety_reducers:

  below_cta:
    - "Não enviamos spam. Cancele quando quiser."
    - "Seus dados estão seguros."
    - "Sem cartão de crédito necessário."
    - "Garantia de [X] dias."

  visual:
    - SSL badges
    - Money-back badge
    - "Pagamento seguro" icons
    - Privacy policy link

  social:
    - "[X] pessoas se inscreveram hoje"
    - "Mais de [X] downloads"
    - "Avaliação 4.9/5"
```

---

## FASE 7: ABOVE-THE-FOLD CHECKLIST

### O Que DEVE Estar Above-the-Fold

```yaml
above_fold_mandatory:
  - [ ] Headline claro com benefício
  - [ ] Subheadline que expande ou qualifica
  - [ ] CTA visível (botão ou form)
  - [ ] Visual relevante (imagem/vídeo)

above_fold_recommended:
  - [ ] Micro social proof (número ou logo)
  - [ ] Anxiety reducer near CTA

above_fold_avoid:
  - [ ] Slider/carousel
  - [ ] Autoplay video pesado
  - [ ] Texto demais
  - [ ] Múltiplos CTAs competindo

5_second_test:
  visitor_should_understand:
    - O que você oferece
    - Para quem é
    - O que fazer
    - Por que se importar
```

### Layout Patterns

```yaml
hero_layouts:

  left_text_right_image:
    best_for: "SaaS, software, digital products"
    structure:
      left_60: "Headline, subheadline, CTA"
      right_40: "Product screenshot, mockup"

  centered_text:
    best_for: "Lead magnets, webinars, personal brands"
    structure:
      centered: "Headline"
      below: "Subheadline, CTA, image"

  video_hero:
    best_for: "VSL pages, complex explanations"
    structure:
      centered: "Video player"
      below: "Minimal text, CTA"
    caution: "Fast load time required"
```

---

## FASE 8: MOBILE OPTIMIZATION

### Mobile-First Requirements

```yaml
mobile_optimization:

  statistics:
    - "60%+ do tráfego é mobile"
    - "Mobile converte 50% menos que desktop"
    - "Oportunidade: mobile otimizado = vantagem"

  requirements:
    - [ ] Responsive (no horizontal scroll)
    - [ ] Touch-friendly buttons (44x44px min)
    - [ ] Readable text (16px min)
    - [ ] Simplified forms
    - [ ] Load time <3s on 3G

  layout_changes:
    desktop_2_columns: "→ Mobile single column"
    desktop_side_by_side: "→ Mobile stacked"
    desktop_horizontal_nav: "→ Mobile hamburger"

  cta_mobile:
    - Sticky bottom button
    - Full-width buttons
    - Touch-friendly spacing
    - Click-to-call when relevant
```

---

## FASE 9: OUTPUT FORMAT

### Entregáveis Padrão

```yaml
deliverables:

  landing_page_copy:
    - Headline (+ 3 variações)
    - Subheadline
    - Body copy (por seção)
    - Bullet points
    - CTA button (+ 2 variações)
    - Form fields recommendation
    - Anxiety reducers

  supporting_elements:
    - Above-fold mockup description
    - Thank you page copy (básico)
    - Confirmation email (básico)

  metadata:
    - Awareness level identificado
    - Page type selecionado
    - Estimated conversion range
    - Testing recommendations
```

### Exemplo de Output Completo

```yaml
output_example:

  project_info:
    page_type: "webinar_registration"
    awareness_level: "solution_aware"
    avatar: "Empreendedores digitais que querem escalar"
    main_benefit: "Escalar para 6 dígitos"

  above_fold:
    tag: "[MASTERCLASS GRATUITA]"
    headline_primary: "Como Escalar Para 6 Dígitos Sem Depender de Lançamentos"
    headline_variations:
      - "O Sistema Para Faturar 100k/mês com Tráfego Perpétuo"
      - "Por Que 93% Dos Empreendedores Travam - E Como Evitar"
    subheadline: "O método que 200+ negócios usam para vender todo dia"
    date: "Quinta-feira, 25/01 às 20h"
    cta_primary: "Reservar Minha Vaga (Grátis)"
    cta_variations:
      - "Quero Participar"
      - "Garantir Meu Lugar"

  section_what_youll_learn:
    title: "O Que Você Vai Descobrir:"
    bullets:
      - "✅ O erro fatal que 93% dos empreendedores cometem ao tentar escalar"
      - "✅ O sistema de 3 etapas para vender todo dia sem lançamentos"
      - "✅ Como criar uma oferta que vende sozinha (mesmo dormindo)"
      - "✅ O segredo de quem fatura 6 dígitos trabalhando 4h/dia"

  section_presenter:
    title: "Sobre João Silva"
    content: "Especialista em crescimento perpétuo. Ajudou 200+ empreendedores a escalar seus negócios. Faturou [RESULTADO_ANUAL_EXEMPLO] em vendas perpétuas nos últimos 12 meses."

  section_who_is_for:
    title: "Este Masterclass é Para Você Se:"
    bullets:
      - "Você já vende online mas trava nos 30-50k/mês"
      - "Está cansado de depender de lançamentos"
      - "Quer previsibilidade de receita todo mês"

  anxiety_reducers:
    - "100% gratuito e online"
    - "Replay disponível por 48h"
    - "Não enviamos spam"
```

---

## FASE 10: CHECKLIST DE QUALIDADE

### Pre-Launch Checklist

```yaml
quality_checklist:

  diagnosis:
    - [ ] Awareness level identificado corretamente
    - [ ] Page type apropriado para objetivo
    - [ ] Avatar claramente definido

  above_fold:
    - [ ] Headline comunica benefício em <3 segundos
    - [ ] Subheadline expande ou qualifica
    - [ ] CTA visível sem scroll
    - [ ] Visual relevante e carrega rápido
    - [ ] 5-second test passa

  messaging:
    - [ ] Copy apropriado para awareness level
    - [ ] Benefícios > features
    - [ ] Linguagem do avatar
    - [ ] Sem jargão desnecessário

  conversion_elements:
    - [ ] Uma única ação clara (1:1 attention ratio)
    - [ ] Zero navigation links
    - [ ] Anxiety reducers presentes
    - [ ] Social proof estratégico
    - [ ] Urgência genuína (se aplicável)

  forms:
    - [ ] Mínimo de campos necessários
    - [ ] Labels amigáveis
    - [ ] CTA com ação + benefício
    - [ ] Validação de erros clara

  technical:
    - [ ] Load time <3 segundos
    - [ ] Mobile responsive
    - [ ] Tracking configurado
    - [ ] SSL ativo
    - [ ] Links funcionando

  compliance:
    - [ ] Privacy policy acessível
    - [ ] Terms of service linkado
    - [ ] LGPD/GDPR compliance
```

### Scoring Matrix

```yaml
scoring_matrix:

  criteria:
    above_fold_clarity:
      weight: 25%
      question: "Visitor entende proposta em 5 segundos?"

    value_proposition:
      weight: 20%
      question: "Benefício é claro e específico?"

    attention_ratio:
      weight: 15%
      question: "1:1 - uma ação, sem distrações?"

    social_proof:
      weight: 15%
      question: "Prova relevante e crível?"

    cta_strength:
      weight: 15%
      question: "CTA claro, visível, acionável?"

    technical:
      weight: 10%
      question: "Mobile + speed + tracking?"

  thresholds:
    below_5: "Não publicar - reescrever"
    5_to_6: "Melhorias significativas"
    7_to_8: "Bom para lançar, otimizar depois"
    9_to_10: "Excelente, priorizar tráfego"
```

---

## FASE 11: BENCHMARKS E MÉTRICAS

### Conversion Rate por Tipo

| Page Type | Poor | Average | Good | Excellent |
|-----------|------|---------|------|-----------|
| Squeeze Page | <20% | 20-30% | 30-50% | 50%+ |
| Webinar Reg | <20% | 20-35% | 35-50% | 50%+ |
| Waitlist | <30% | 30-45% | 45-60% | 60%+ |
| Demo Request | <3% | 3-8% | 8-15% | 15%+ |
| Sales Cold | <0.5% | 0.5-1.5% | 1.5-3% | 3%+ |
| Sales Warm | <2% | 2-5% | 5-10% | 10%+ |

### Key Metrics to Track

```yaml
metrics:

  primary:
    - Conversion rate
    - Cost per conversion
    - Revenue per visitor

  secondary:
    - Bounce rate
    - Time on page
    - Scroll depth
    - Form abandonment

  diagnostic:
    - Page load time
    - Mobile vs desktop
    - Traffic source
```

---

## FASE 12: TESTING FRAMEWORK (HOPKINS)

### Scientific Testing Approach

```yaml
hopkins_testing:

  process:
    1: "Formular hipótese testável"
    2: "Criar variações (A vs B)"
    3: "Split test (50/50)"
    4: "Medir resultados"
    5: "Significância estatística"
    6: "Declarar vencedor"
    7: "Iterar"

  what_to_test_first:
    1: "Headline"
    2: "CTA copy"
    3: "Hero image"
    4: "Social proof"
    5: "Form length"

  rules:
    - Uma variável por teste
    - 100+ conversões por variante
    - 95% significância
    - Mínimo 2 semanas
```

### PIE Prioritization

```yaml
pie_framework:

  factors:
    P_potential: "Quanto pode melhorar? (1-10)"
    I_importance: "Quão valioso é o tráfego? (1-10)"
    E_ease: "Quão fácil implementar? (1-10)"

  calculation: "Score = P × I × E"

  prioritize: "Maior score primeiro"
```

---

## ANEXO: QUICK REFERENCE

### Headline por Page Type

| Page Type | Top Formula |
|-----------|-------------|
| Squeeze | "[Número] [Dicas] Para [Resultado]" |
| Webinar | "Masterclass: Como [Resultado] em [Tempo]" |
| Waitlist | "Lista VIP: Acesso Antecipado a [Produto]" |
| Demo | "Agende Sua [Tipo de Call] Gratuita" |

### CTA por Page Type

| Page Type | Top CTA |
|-----------|---------|
| Squeeze | "Quero Meu [Lead Magnet]" |
| Webinar | "Reservar Minha Vaga" |
| Waitlist | "Entrar na Lista VIP" |
| Demo | "Agendar Minha Análise" |

### Fields por Page Type

| Page Type | Recommended Fields |
|-----------|-------------------|
| Squeeze | Email only |
| Webinar | Nome + Email |
| Waitlist | Email only |
| Demo | Nome + Email + Qualifying |

---

*Task Version: 2.0*
*Line Count: 600+*
*Primary Frameworks: MECLABS, Schwartz, Unbounce CCD, StoryBrand, Hopkins*
*Page Types: Squeeze, Webinar, Waitlist, Demo, Sales*
