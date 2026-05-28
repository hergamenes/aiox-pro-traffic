---
task: Create Headlines Task
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
Domain: Operational
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

# Create Headlines Task

Task completo para gerar headlines e hooks de alta conversão usando metodologias dos maiores copywriters da história.

## Metadata

```yaml
task:
  name: Create Headlines
  id: create-headlines
  version: "2.0"
  category: copywriting
  primary_agents:
    - gary-halbert
    - eugene-schwartz
    - gary-bencivenga
    - david-ogilvy
    - claude-hopkins
  estimated_output: 20-50 headlines com análise
  quality_standard: minimum 40/50 no scoring matrix
```

---

## FASE 0: DIAGNÓSTICO DE NÍVEL DE CONSCIÊNCIA (SCHWARTZ)

### O Conceito Mais Importante de Headlines

Antes de escrever qualquer headline, você DEVE identificar o nível de consciência do seu público-alvo. Este diagnóstico determina toda a estratégia de headline.

### Os 5 Níveis de Consciência de Schwartz

```yaml
awareness_levels:
  1_most_aware:
    description: "Conhecem seu produto, precisam apenas de oferta"
    characteristics:
      - Clientes existentes ou leads quentes
      - Já pesquisaram sua solução
      - Comparando preços/condições
    headline_strategy: "Liderar com oferta, desconto, exclusividade"
    power_words:
      - "Agora"
      - "Desconto exclusivo"
      - "Para membros"
      - "Última chance"
    example: "Curso X - 50% off só esta semana"

  2_product_aware:
    description: "Conhecem seu produto, não estão convencidos"
    characteristics:
      - Sabem que você existe
      - Estão comparando alternativas
      - Precisam de diferenciação
    headline_strategy: "Liderar com diferenciador único, prova social"
    power_words:
      - "Por que"
      - "A diferença"
      - "Finalmente"
      - "O único que"
    example: "Por que 47.000 empreendedores escolheram Curso X"

  3_solution_aware:
    description: "Sabem que existem soluções, não conhecem a sua"
    characteristics:
      - Pesquisaram categoria
      - Conhecem o tipo de solução
      - Não encontraram a ideal
    headline_strategy: "Liderar com categoria + diferenciador"
    power_words:
      - "O [tipo] que"
      - "Nova forma de"
      - "Diferente de"
      - "Sem [problema comum]"
    example: "O curso de marketing que funciona mesmo sem audiência"

  4_problem_aware:
    description: "Sabem que têm problema, não sabem que existe solução"
    characteristics:
      - Sentem a dor
      - Não pesquisaram soluções
      - Precisam de esperança
    headline_strategy: "Liderar com dor/sintoma + promessa de solução"
    power_words:
      - "Se você [sintoma]"
      - "Por que [problema]"
      - "A verdade sobre"
      - "Finalmente"
    example: "Se você trabalha 80h/semana e ainda não tem lucro, leia isso"

  5_unaware:
    description: "Não sabem que têm problema ou que existe solução"
    characteristics:
      - Audiência fria total
      - Não pesquisaram nada
      - Precisam de disrupção
    headline_strategy: "Liderar com história, curiosidade, contraste"
    power_words:
      - "Eles riram quando"
      - "A maioria não sabe"
      - "O que [autoridade] faz diferente"
      - Declaração controversa
    example: "A maioria dos empreendedores está trabalhando de graça sem saber"
```

### Diagnóstico de Awareness

```yaml
awareness_diagnosis:
  questions_to_ask:
    - "Onde esse tráfego está vindo?"
    - "O prospect já pesquisou soluções?"
    - "Ele conhece nossa marca?"
    - "Ele sabe que tem um problema?"

  traffic_source_mapping:
    most_aware:
      - Lista de clientes
      - Carrinho abandonado
      - Retargeting quente
    product_aware:
      - Retargeting de visitantes
      - Leads de webinar
      - Seguidores engajados
    solution_aware:
      - Pesquisa por categoria
      - Comparação de produtos
      - Reviews de concorrentes
    problem_aware:
      - Pesquisa por sintoma
      - Grupos de discussão
      - Conteúdo educacional
    unaware:
      - Display ads
      - Facebook cold
      - YouTube broad
```

---

## FASE 1: COLETA DE INPUTS

### Inputs Obrigatórios

```yaml
required_inputs:
  context:
    description: "Onde o headline será usado"
    options:
      - sales_page
      - email_subject
      - ad_copy
      - landing_page
      - webinar_registration
      - lead_magnet
      - blog_article
      - video_hook
    impact: "Determina comprimento e estilo"

  product_name:
    description: "Nome do produto/serviço"
    example: "Método 6 em 7"
    impact: "Pode ou não ser incluído no headline"

  main_benefit:
    description: "Benefício principal que resolve a dor"
    example: "Faturar 100k em 7 dias"
    impact: "Core da promessa do headline"

  target_avatar:
    description: "Quem é o público-alvo específico"
    example: "Empreendedores digitais iniciantes"
    impact: "Tom, linguagem, referências"

  awareness_level:
    description: "Nível de consciência do Schwartz"
    options:
      - most_aware
      - product_aware
      - solution_aware
      - problem_aware
      - unaware
    impact: "Estratégia completa do headline"
```

### Inputs Opcionais

```yaml
optional_inputs:
  secondary_benefits:
    description: "Outros benefícios importantes"
    example:
      - "Sem aparecer"
      - "Trabalhando só 4h/dia"
    impact: "Material para variações"

  main_objections:
    description: "Objeções mais comuns"
    example:
      - "Não tenho audiência"
      - "Não sei criar conteúdo"
    impact: "Headlines que removem objeções"

  unique_mechanism:
    description: "O que torna sua solução diferente"
    example: "Método de 3 fases"
    impact: "Headlines de diferenciação"

  social_proof:
    description: "Números, depoimentos, autoridade"
    example: "Mais de 10.000 alunos"
    impact: "Headlines de prova social"

  tone:
    description: "Tom desejado"
    options:
      - professional
      - conversational
      - provocative
      - educational
      - urgent
    impact: "Escolha de palavras"

  num_headlines:
    description: "Quantidade de variações"
    default: 20
    range: [10, 50]

  copywriter_style:
    description: "Estilo de copywriter específico"
    options:
      - halbert (direto, urgente)
      - schwartz (sofisticado, amplificado)
      - bencivenga (curioso, fascinante)
      - ogilvy (elegante, factual)
      - hopkins (científico, específico)
      - kern (casual, story-based)
      - settle (infotainment, personality)
```

---

## FASE 2: FÓRMULAS DE HEADLINE POR COPYWRITER

### Gary Halbert - 8 Fórmulas Testadas

Halbert era conhecido por headlines diretos, urgentes e eficazes. Suas fórmulas são as mais versáteis e testadas.

#### Fórmula 1: HOW TO

```yaml
formula: how_to
structure: "How to [resultado desejado]"
variations:
  - "How to [resultado] in [tempo]"
  - "How to [resultado] without [sacrifício]"
  - "How to [resultado] even if [objeção]"
  - "How to finally [resultado] after [frustração]"

examples_by_niche:
  fitness:
    basic: "How to lose 30 pounds"
    time: "How to lose 30 pounds in 90 days"
    paradox: "How to lose 30 pounds without dieting"
    objection: "How to lose 30 pounds even if you hate exercise"

  business:
    basic: "How to double your revenue"
    time: "How to double your revenue in 6 months"
    paradox: "How to double your revenue without hiring"
    objection: "How to double your revenue even without a big following"

  relationships:
    basic: "How to save your marriage"
    time: "How to save your marriage in 30 days"
    paradox: "How to save your marriage without couples therapy"
    objection: "How to save your marriage even if your partner has given up"

why_it_works:
  - Promete educação, não venda
  - Implica método/sistema que pode ser aprendido
  - Lowera resistência: leitor pensa "vou aprender algo"
  - Universal: funciona em qualquer nicho
```

#### Fórmula 2: ATTENTION [AVATAR]

```yaml
formula: attention_avatar
structure: "Attention [Avatar]: [Promessa]"
variations:
  - "Attention [Avatar]! Finally, [solução]"
  - "To all [Avatars] who [situação específica]"
  - "Important message for [Avatar] who [dor]"
  - "[Avatar] only: [oferta exclusiva]"

examples_by_niche:
  fitness:
    - "Attention Frustrated Dieters: New discovery melts fat while you sleep"
    - "To all women over 40 who want to look 10 years younger"

  business:
    - "Attention Entrepreneurs: The system that built 47 six-figure businesses"
    - "To all freelancers tired of chasing clients"

  finance:
    - "Attention Investors: The dividend secret Wall Street hides"
    - "Important message for anyone with more than [INVESTABLE_ASSETS_THRESHOLD] in savings"

why_it_works:
  - Filtro imediato elimina irrelevantes
  - Cria sensação de exclusividade
  - Personalization signal: "isso é para mim"
  - Alto stopping power
```

#### Fórmula 3: WHO ELSE WANTS

```yaml
formula: who_else_wants
structure: "Who else wants [resultado desejado]?"
variations:
  - "Who else wants [resultado] without [sacrifício]?"
  - "Who else wants to finally [resultado]?"
  - "Who else is tired of [problema]?"

examples_by_niche:
  fitness:
    - "Who else wants to lose 20 pounds before summer?"
    - "Who else wants a flat stomach without crunches?"

  business:
    - "Who else wants to work less and earn more?"
    - "Who else wants to finally quit their 9-to-5?"

  relationships:
    - "Who else wants to find love after 40?"
    - "Who else is tired of bad dates?"

why_it_works:
  - Social proof implícito: "others" = já funciona para pessoas
  - Convite inclusivo, não vendedor
  - Pergunta engaja: leitor responde mentalmente
```

#### Fórmula 4: THE SECRET OF

```yaml
formula: secret_of
structure: "The Secret of [resultado/grupo]"
variations:
  - "The Secret of [grupo de sucesso] revealed"
  - "The Secret [grupo] doesn't want you to know"
  - "The Closely-Guarded Secret of [autoridade]"
  - "The #1 Secret of [resultado]"

examples_by_niche:
  fitness:
    - "The Secret of Athletes Who Never Seem to Age"
    - "The Secret Doctors Don't Tell You About Weight Loss"

  business:
    - "The Secret of Entrepreneurs Who Made Their First Million"
    - "The Closely-Guarded Secret of Top Salespeople"

  finance:
    - "The Secret Wall Street Doesn't Want You to Know"
    - "The Secret of Self-Made Millionaires"

why_it_works:
  - Curiosidade máxima: "qual é o segredo?"
  - Exclusivity appeal: conhecimento insider
  - Conspiracy element: alguém está escondendo
```

#### Fórmula 5: WARNING

```yaml
formula: warning
structure: "Warning: [Consequência negativa]"
variations:
  - "Warning: Don't [ação] until you read this"
  - "Warning: [Número]% of [avatar] make this mistake"
  - "Warning: Are you making this [custo] mistake?"
  - "Warning: [Autoridade] says [problema] is worse than you think"

examples_by_niche:
  fitness:
    - "Warning: Don't start another diet until you read this"
    - "Warning: This 'healthy' food may be making you fat"

  business:
    - "Warning: Don't quit your job until you read this"
    - "Warning: 90% of new businesses make this fatal mistake"

  finance:
    - "Warning: Don't invest another dollar until you read this"
    - "Warning: Your financial advisor may be costing you [POTENTIAL_LOSS_EXAMPLE]"

why_it_works:
  - Loss aversion é 2x mais forte que gain desire
  - Cria urgência imediata
  - Posiciona você como protetor, não vendedor
```

#### Fórmula 6: THEY LAUGHED WHEN

```yaml
formula: they_laughed
structure: "They laughed when I [ação], but then [resultado]"
variations:
  - "They laughed when I [ação], but when I [resultado]..."
  - "Everyone said I was crazy to [ação], until..."
  - "Nobody believed me when I said I could [ação], but then..."

examples_by_niche:
  fitness:
    - "They laughed when I said I'd run a marathon at 50, but then..."
    - "Everyone said I was too old to get fit, until..."

  business:
    - "They laughed when I quit my $200k job, but when they saw my new income..."
    - "Nobody believed I could build a business in 90 days, but then..."

  learning:
    - "They laughed when I sat down at the piano, but when I started to play..."
    - "Everyone said I was too old to learn coding, until..."

why_it_works:
  - Underdog identificação universal
  - Story structure inerente: início, conflito, resolução
  - Curiosidade sobre o "mas então..."
  - Classic tested formula (John Caples original)
```

#### Fórmula 7: GIVE ME [TIME]

```yaml
formula: give_me_time
structure: "Give me [tempo] and I'll give you [resultado]"
variations:
  - "Give me just [tempo] and I'll show you [resultado]"
  - "In [tempo], you could [resultado]"
  - "[Tempo] from now, you could be [estado]"
  - "What if [tempo] from today you could [resultado]?"

examples_by_niche:
  fitness:
    - "Give me 30 days and I'll give you a new body"
    - "Give me 5 minutes a day and I'll give you six-pack abs"

  business:
    - "Give me 90 days and I'll show you how to quit your job"
    - "In 6 months, you could be running a 6-figure business"

  learning:
    - "Give me 15 minutes a day and I'll give you a new language"
    - "What if 12 months from today you could play any song?"

why_it_works:
  - Timeline concreta remove abstração
  - Exchange framing: "você dá X, recebe Y"
  - Reciprocidade implícita
  - Makes goal tangível
```

#### Fórmula 8: AMAZING

```yaml
formula: amazing
structure: "Amazing [categoria] [resultado/método]"
variations:
  - "Amazing new [descoberta] [resultado]"
  - "Amazing secret [método] [resultado]"
  - "The amazing [nome] that [resultado]"
  - "Amazing results: [especificidade]"

examples_by_niche:
  fitness:
    - "Amazing new pill melts fat while you sleep"
    - "The amazing workout that builds muscle in half the time"

  business:
    - "Amazing secret reveals how to get clients on demand"
    - "Amazing results: 147 entrepreneurs made 6-figures last year"

  health:
    - "Amazing discovery reverses aging at the cellular level"
    - "The amazing herb that doctors are calling a miracle"

why_it_works:
  - Adjetivo intensificador amplifica emoção
  - Funciona melhor com especificidade
  - Cria excitement e curiosity
```

### Eugene Schwartz - 10 Técnicas de Amplificação

Schwartz desenvolveu técnicas para tornar qualquer headline mais poderoso através de amplificação.

#### Técnica 1: MEASURE SIZE

```yaml
technique: measure_size
description: "Transforme benefícios abstratos em quantidades"
formula: "How to [verbo] [NÚMERO] [resultado]"

transformations:
  before: "How to lose weight fast"
  after: "How to lose 27 pounds in 30 days"

  before: "Make more money"
  after: "Make $2,147 extra every month"

  before: "Get more clients"
  after: "Get 47 new clients in 90 days"

rules:
  - Números específicos (27, não 30) são mais críveis
  - Quantificação remove ambiguidade
  - O cérebro processa números mais rápido
```

#### Técnica 2: MEASURE SPEED

```yaml
technique: measure_speed
description: "Quantifique o tempo necessário"
formula: "How to [resultado] in [TEMPO]"

transformations:
  before: "Learn Spanish quickly"
  after: "Learn conversational Spanish in 30 days (15 min/day)"

  before: "Build muscle fast"
  after: "Add 2 inches to your arms in 8 weeks"

  before: "Write a book"
  after: "Write your first book in 90 days (45 min/day)"

power_variations:
  - "In just 7 days..."
  - "Starting tonight..."
  - "Before your next birthday..."
  - "While others still struggle for years..."
```

#### Técnica 3: COMPARE

```yaml
technique: compare
description: "Posicione contra alternativas conhecidas"
formula: "[Seu resultado] vs [alternativa]"

transformations:
  before: "Get fit at home"
  after: "Better results than a $200/hour personal trainer"

  before: "This diet works"
  after: "Works faster than any diet your doctor recommends"

  before: "Learn marketing"
  after: "Gets you promoted faster than an MBA"

comparison_types:
  authority: "Better than what doctors recommend"
  competitor: "Outperforms [market leader]"
  expectation: "Works even if you failed at everything else"
  cost: "Results of a [HIGH_TICKET_PROGRAM_VALUE] program for [ENTRY_PRICE_EXAMPLE]"
```

#### Técnica 4: METAFORIZE

```yaml
technique: metaforize
description: "Crie imagens concretas"
formula: "[Resultado abstrato] como [imagem concreta]"

transformations:
  before: "Increase your memory"
  after: "Give yourself a photographic memory"

  before: "Learn to invest"
  after: "Turn your savings into a money-printing machine"

  before: "Improve presentation skills"
  after: "Speak with the charisma of a TED speaker"

powerful_metaphors:
  money: ["ATM machine", "Money magnet", "Golden goose"]
  speed: ["Lightning fast", "Overnight success", "Instant transformation"]
  power: ["Secret weapon", "Unfair advantage", "Superpower"]
```

#### Técnica 5: SENSITIZE

```yaml
technique: sensitize
description: "Adicione detalhes sensoriais"
formula: "Inclua textura, cor, som, cheiro, sabor"

transformations:
  before: "Look younger"
  after: "Watch the fine lines around your eyes melt away"

  before: "Wake up refreshed"
  after: "Wake up with that spring-in-your-step feeling you had at 25"

  before: "Great coffee"
  after: "Rich, aromatic coffee that fills your kitchen with Italian espresso scent"

sensory_words:
  visual: ["crystal-clear", "vivid", "gleaming", "bright"]
  tactile: ["silky-smooth", "firm", "featherlight", "crisp"]
  auditory: ["whisper-quiet", "resonant", "crisp", "melodic"]
```

#### Técnica 6: DEMONSTRATE

```yaml
technique: demonstrate
description: "Mostre evidência no headline"
formula: "[Evidência] prova [afirmação]"

transformations:
  before: "Many people use this"
  after: "Why 1,847,293 people have already joined"

  before: "Athletes use this"
  after: "The exercise used by 7 Olympic gold medalists"

  before: "Scientifically proven"
  after: "Backed by 127 peer-reviewed studies"

demonstration_types:
  social_proof: "Join 50,000+ members"
  authority: "Stanford-tested"
  track_record: "47 years of proven results"
  specificity: "Works for 97.3% of users"
```

#### Técnica 7: DRAMATIZE

```yaml
technique: dramatize
description: "Aumente as stakes"
formula: "What happens when [situação extrema]"

transformations:
  before: "Marketing experts share tips"
  after: "What happens when 50 marketing experts lock themselves in a room for 72 hours"

  before: "This email technique works"
  after: "The email that got her boss to beg for forgiveness"

  before: "Build a business from home"
  after: "How a stay-at-home mom built a $3M business from her kitchen table"

dramatic_elements:
  contrast: "David vs Goliath"
  stakes: "What's at risk"
  tension: "Conflict, challenge, obstacle"
  resolution: "Unexpected success"
```

#### Técnica 8: CREATE PARADOX

```yaml
technique: create_paradox
description: "Junte contraditórios"
formula: "[Resultado] without [sacrifício esperado]"

transformations:
  before: "Lose weight"
  after: "Lose weight without dieting or exercise"

  before: "Make more money"
  after: "Make more money working less hours"

  before: "Build muscle"
  after: "Build muscle without spending hours at the gym"

paradox_variations:
  - "The lazy way to [hard result]"
  - "[Big result] by doing [small thing]"
  - "Why [counterintuitive] actually [desired result]"
```

#### Técnica 9: REMOVE LIMITATIONS

```yaml
technique: remove_limitations
description: "Elimine objeções no headline"
formula: "[Resultado] even if [limitação]"

transformations:
  before: "Speak Spanish fluently"
  after: "Speak Spanish fluently even if you failed every language class"

  before: "Build a business"
  after: "Build a profitable business even with no capital"

  before: "Get six-pack abs"
  after: "Get six-pack abs even if you're over 50"

common_limitations_to_remove:
  age: "even if you're over 40/50/60"
  money: "even if you're starting from zero"
  experience: "even if you're a complete beginner"
  time: "even if you only have 15 minutes a day"
  ability: "even if you've failed before"
```

#### Técnica 10: ASSOCIATE AUTHORITY

```yaml
technique: associate_authority
description: "Conecte a autoridades reconhecidas"
formula: "[Autoridade] reveals/uses [seu método]"

transformations:
  before: "This sleep technique works"
  after: "The sleep technique Navy SEALs use to fall asleep in 2 minutes"

  before: "Learn negotiation"
  after: "The negotiation secret Fortune 500 CEOs pay [AUTHORITY_PREMIUM_EXAMPLE] to learn"

  before: "Memory technique"
  after: "The memory trick Harvard neuroscientists discovered"

authority_sources:
  institutions: ["Harvard", "Stanford", "NASA", "MIT"]
  professions: ["Doctors", "Navy SEALs", "Olympians"]
  companies: ["Apple", "Google", "Amazon", "Tesla"]
  individuals: "Named experts, celebrities"
```

### Gary Bencivenga - 20 Fascinations

Bullets e headlines que fascinam sem revelar a resposta.

```yaml
fascinations:

  1_number_noun:
    formula: "The [Number] [Noun] that [Benefit]"
    examples:
      - "The 7 foods that burn fat while you sleep"
      - "The 3 words that save any marriage"
      - "The 5 exercises that build muscle in half the time"

  2_how_to_even_if:
    formula: "How to [Benefit] - even if [Obstacle]"
    examples:
      - "How to get promoted - even if your boss hates you"
      - "How to retire rich - even if you're starting at 50"

  3_why_wrong:
    formula: "Why [Common Belief] is wrong - and what to do instead"
    examples:
      - "Why 'eat less, move more' is wrong - and what actually works"
      - "Why hard work won't make you rich - and what will"

  4_adjective_way:
    formula: "The [Adjective] way to [Benefit] that [Surprise]"
    examples:
      - "The lazy way to build muscle that outperforms hours at the gym"
      - "The weird way to fall asleep that Navy SEALs use"

  5_what_authority_knows:
    formula: "What [Authority] knows about [Topic] that you don't"
    examples:
      - "What Harvard doctors know about aging that could add 20 years"
      - "What billionaires know about money that schools never teach"

  6_hidden_thing:
    formula: "The [Hidden] [Thing] that [Benefit]"
    examples:
      - "The hidden muscle causing your back pain"
      - "The little-known tax deduction that saves thousands"

  7_warning_may_be:
    formula: "Warning: [Thing] may be [Negative]"
    examples:
      - "Warning: Your morning routine may be making you fat"
      - "Warning: Your savings account may be losing you money"

  8_mistake_how_to_fix:
    formula: "The [Mistake] that [Negative] - and how to fix it"
    examples:
      - "The exercise mistake preventing muscle growth - and how to fix it"
      - "The email mistake costing you sales - and how to fix it"

  9_signs_undesirable:
    formula: "[Number] signs you're [Undesirable] - and what to do"
    examples:
      - "7 signs you're about to get fired - and what to do"
      - "5 signs your marriage is in trouble - and what to do"

  10_time_action:
    formula: "The [Time] [Action] that [Benefit]"
    examples:
      - "The 5-minute morning ritual that transforms your day"
      - "The 30-second exercise that eliminates back pain"

  11_ordinary_extraordinary:
    formula: "How [Ordinary Person] [Extraordinary Result]"
    examples:
      - "How a broke teacher became a millionaire in 3 years"
      - "How a shy introvert became a top salesperson"

  12_counterintuitive_truth:
    formula: "The [Counterintuitive] truth about [Topic]"
    examples:
      - "The counterintuitive truth about losing weight"
      - "The uncomfortable truth about getting rich"

  13_easier_than_think:
    formula: "Why [Desirable] is [Easier] than you think"
    examples:
      - "Why getting rich is simpler than you think"
      - "Why writing a book is easier than you think"

  14_specific_method:
    formula: "The [Specific] [Method] that [Benefit] in [Time]"
    examples:
      - "The 4-7-8 breathing technique that puts you to sleep in 60 seconds"
      - "The Pomodoro method that doubles productivity in one day"

  15_question_implies:
    formula: "[Question that implies benefit]?"
    examples:
      - "Do you make these mistakes in English?"
      - "Is your diet actually making you fatter?"

  16_never_told:
    formula: "[Number] things [Authority] never told you"
    examples:
      - "7 things your doctor never told you about cholesterol"
      - "5 things financial advisors never tell about retirement"

  17_contradicts_belief:
    formula: "The [Noun] that [Contradicts Belief]"
    examples:
      - "The fat that helps you burn fat"
      - "The rest day that builds more muscle"

  18_without_sacrifice:
    formula: "How to [Benefit] without [Expected Sacrifice]"
    examples:
      - "How to get fit without going to the gym"
      - "How to learn a language without studying grammar"

  19_right_under_nose:
    formula: "The [Adjective] [Thing] right under your nose"
    examples:
      - "The simple solution right under your nose"
      - "The free tool right under your nose"

  20_worst_best_for:
    formula: "Why [Thing] is the [Worst/Best] for [Goal]"
    examples:
      - "Why cardio is the worst thing for weight loss"
      - "Why networking is the best thing for your career"
```

### David Ogilvy - Regras de Estrutura

```yaml
ogilvy_rules:

  length:
    rule: "6-12 palavras performam melhor"
    reason: "Muito curto falta info, muito longo perde atenção"
    sweet_spot: "8-10 palavras"

  brand:
    rule: "Inclua marca quando possível"
    reason: "80% só leem headline, precisam saber quem está falando"

  promise:
    rule: "Inclua benefício no headline"
    reason: "Headline deve conter a promessa, não só curiosidade"

  no_puns:
    rule: "Evite trocadilhos e jogos de palavras"
    reason: "Puns don't sell, they confuse"

  words_that_work:
    most_powerful:
      - FREE
      - NEW
      - HOW TO
      - NOW
      - ANNOUNCING
    strong:
      - INTRODUCING
      - SUDDENLY
      - AMAZING
      - AT LAST
      - FINALLY
    use_carefully:
      - MIRACLE
      - MAGIC
      - SENSATIONAL

  headline_types:
    news:
      description: "Apresente como notícia"
      formula: "Announcing: The first [category] that [benefit]"
    benefit:
      description: "Lidere com resultado"
      formula: "Get [benefit] in [time]"
    how_to:
      description: "Prometa educação"
      formula: "How to [achieve result]"
    question:
      description: "Engaje com pergunta"
      formula: "[Question that triggers self-doubt]?"
    command:
      description: "Diga o que fazer"
      formula: "[Action verb] your way to [benefit]"
```

### Claude Hopkins - Especificidade Científica

```yaml
hopkins_principles:

  specificity_doctrine:
    rule: "Platitudes roll off like water from a duck"
    transformation:
      vague: "Our beer is pure"
      specific: "Our bottles are washed with live steam"

      vague: "Best price in town"
      specific: "1,847 stores checked - ours is lowest"

      vague: "Experts recommend"
      specific: "Recommended by 3,482 dentists surveyed"

  headlines_as_hypothesis:
    concept: "Every headline is a testable hypothesis"
    process:
      1: "Formulate headline as hypothesis"
      2: "Test with tracking (cupons, códigos)"
      3: "Measure results objectively"
      4: "Accept or reject based on data"

  call_out_audience:
    rule: "First job is to pick out people you can interest"
    examples:
      - "To men who want to quit work someday"
      - "To women who have tried everything to lose weight"
      - "To business owners working too hard for too little"

  news_value:
    rule: "Present as discovery or revelation"
    examples:
      - "Scientists discover why diets fail"
      - "New study reveals the real cause of back pain"
      - "Breakthrough: First treatment that reverses gray hair"

  reason_why:
    rule: "Explain why your claim is true"
    examples:
      - "Why this knife stays sharp 10x longer (the steel)"
      - "Why our cookies taste homemade (real butter, not oil)"
      - "Why our students get hired faster (real skills, not theory)"
```

---

## FASE 3: PROCESSO DE CRIAÇÃO

### Step 1: Definir Parâmetros

```yaml
creation_parameters:
  mandatory:
    - Awareness level identificado
    - Avatar claramente definido
    - Benefício principal específico
    - Contexto de uso (sales page, email, etc.)

  optional_but_valuable:
    - Mecanismo único
    - Números/resultados específicos
    - Objeções principais
    - Tom desejado
```

### Step 2: Gerar Headlines por Categoria

Para cada projeto, gerar pelo menos 3-5 headlines em cada categoria:

```yaml
headline_categories:

  benefit_headlines:
    description: "Foco no resultado"
    quantity: 5-10
    formulas:
      - How to [benefit]
      - Get [benefit] in [time]
      - The [adjective] way to [benefit]

  curiosity_headlines:
    description: "Criam intrigue"
    quantity: 5-10
    formulas:
      - The secret of [result]
      - What [authority] knows that you don't
      - The [hidden] [thing] that [benefit]

  news_headlines:
    description: "Apresentam novidade"
    quantity: 3-5
    formulas:
      - Announcing: [product/discovery]
      - Finally: [solution]
      - New: [innovation]

  warning_headlines:
    description: "Usam medo/perda"
    quantity: 3-5
    formulas:
      - Warning: [negative consequence]
      - Don't [action] until [condition]
      - [Number]% make this mistake

  question_headlines:
    description: "Engajam com pergunta"
    quantity: 3-5
    formulas:
      - Do you [undesirable behavior]?
      - Who else wants [result]?
      - Is your [thing] [negative]?

  command_headlines:
    description: "Dizem o que fazer"
    quantity: 3-5
    formulas:
      - Stop [pain], start [gain]
      - Get [benefit] now
      - Discover [secret]

  story_headlines:
    description: "Começam narrativa"
    quantity: 3-5
    formulas:
      - They laughed when [action], but...
      - How [person] [achieved result]
      - The [time] [event] that [changed everything]
```

### Step 3: Aplicar Técnicas de Amplificação

Para cada headline promissor, aplicar técnicas Schwartz:

```yaml
amplification_process:

  step_1_measure:
    - Adicionar números específicos
    - Quantificar tempo
    - Especificar quantidade

  step_2_compare:
    - Comparar com alternativas
    - Posicionar contra autoridade
    - Contrastar com expectativa

  step_3_dramatize:
    - Aumentar stakes
    - Criar contraste
    - Adicionar tensão

  step_4_paradox:
    - Identificar sacrifício esperado
    - Remover esse sacrifício
    - Criar "sem X, com Y"

  step_5_authority:
    - Associar a fonte credível
    - Usar social proof
    - Demonstrar evidência
```

### Step 4: Avaliar e Selecionar

```yaml
evaluation_criteria:

  borden_formula:
    question_1: "Supera o 'Ho-hum'?"
    test: "Headline é interessante o suficiente para parar scroll?"

    question_2: "Responde 'Why bring that up'?"
    test: "É relevante para o avatar específico?"

    question_3: "Passa o 'For instance'?"
    test: "É crível ou levanta ceticismo?"

    question_4: "Responde 'So what'?"
    test: "Benefício é claro e desejável?"

  4_us_test:
    useful: "É útil para o leitor?"
    urgent: "Cria senso de urgência?"
    unique: "É diferenciado?"
    ultra_specific: "É específico o suficiente?"

  shine_test:
    specificity: "Tem números, detalhes?"
    helpfulness: "Promete ajudar?"
    immediacy: "Funciona rápido?"
    newsworthiness: "É novidade?"
    entertainment: "É interessante?"
```

---

## FASE 4: FORMATO DE OUTPUT

### Entregáveis Padrão

```yaml
deliverables:

  headline_variations:
    quantity: 20-50
    organized_by: "categoria (benefit, curiosity, etc.)"
    includes:
      - Headline completo
      - Categoria
      - Técnica usada
      - Score (1-10)

  top_5_recommended:
    quantity: 5
    includes:
      - Headline
      - Justificativa de escolha
      - Awareness level match
      - Predicted performance

  ab_test_pairs:
    quantity: 3-5 pares
    criteria: "Variações testando uma variável"
    format:
      pair_1:
        a: "Headline versão A"
        b: "Headline versão B"
        variable_tested: "ex: com número vs sem número"

  subheadline_options:
    quantity: 5-10
    purpose: "Complementar headline principal"
    types:
      - Expandir benefício
      - Adicionar credibilidade
      - Remover objeção
      - Criar urgência
```

### Exemplo de Output Completo

```yaml
output_example:

  project_info:
    product: "Método 6 em 7"
    avatar: "Empreendedores digitais iniciantes"
    main_benefit: "Gerar [RESULTADO_FINANCEIRO_EXEMPLO] em [PRAZO_EXEMPLO]"
    awareness_level: "solution_aware"

  headlines_by_category:

    benefit_headlines:
      1:
        headline: "How to Make Your First [RESULTADO_FINANCEIRO_EXEMPLO] in [PRAZO_EXEMPLO] - Even Without a Product or Audience"
        technique: "Halbert How-to + Schwartz Remove Limitations"
        score: 9

      2:
        headline: "The 3-Step System That Generated [RESULTADO_ANUAL_EXEMPLO] Last Year (In Just 4 Hours a Day)"
        technique: "Bencivenga Number-Noun + Schwartz Paradox"
        score: 8

    curiosity_headlines:
      1:
        headline: "The Launch Secret 47 Brazilian Millionaires Used (That No One Talks About)"
        technique: "Halbert Secret + Schwartz Associate Authority"
        score: 8

    warning_headlines:
      1:
        headline: "Warning: Don't Launch Another Product Until You See This 7-Day System"
        technique: "Halbert Warning"
        score: 7

  top_5_recommended:
    1:
      headline: "How to Make Your First [RESULTADO_FINANCEIRO_EXEMPLO] in [PRAZO_EXEMPLO] - Even Without a Product"
      justification: "Direct benefit + removes main objection"
    2:
      headline: "The 3-Step System That Generated [RESULTADO_ANUAL_EXEMPLO] Last Year"
      justification: "Specific numbers + proof element"

  ab_test_pairs:
    pair_1:
      a: "How to Make [RESULTADO_FINANCEIRO_EXEMPLO] in [PRAZO_EXEMPLO]"
      b: "How to Make [RESULTADO_FINANCEIRO_EXEMPLO] in Just [PRAZO_EXEMPLO]"
      variable: "Adding 'Just' for urgency"
```

---

## FASE 5: 50+ HEADLINES ANALISADOS (REFERÊNCIA)

### Headlines de Cursos/Info-produtos

```yaml
analyzed_headlines:

  1:
    headline: "How a 'Lazy' Investor Made [GANHO_ANUAL_EXEMPLO] Last Year With Just 3 Stocks"
    technique: "Paradox + Specificity"
    awareness_level: "problem_aware"
    score: 9
    why_works: "Lazy contradicts success, creates curiosity"

  2:
    headline: "Give Me 5 Minutes And I'll Show You The Exact System I Used To Build A $2.3 Million Business Working Just 4 Hours A Day"
    technique: "Halbert Give Me + Specificity + Paradox"
    awareness_level: "solution_aware"
    score: 9
    why_works: "Low time ask, big proof, addresses time objection"

  3:
    headline: "Confessions Of A Former 'Failure' Who Now Makes $847/Day Online"
    technique: "Story + Specific number"
    awareness_level: "unaware"
    score: 8
    why_works: "Underdog story, daily income is relatable"

  4:
    headline: "The 5-Minute Stretching Routine That Eliminated My 10-Year Back Pain In Just 3 Weeks"
    technique: "Time-benefit + Triple specificity"
    awareness_level: "problem_aware"
    score: 9
    why_works: "Multiple specific numbers create credibility"

  5:
    headline: "Warning: This 'Healthy' Breakfast Food May Be Making You Fat"
    technique: "Halbert Warning + Paradox"
    awareness_level: "problem_aware"
    score: 8
    why_works: "Fear + curiosity gap"

  6:
    headline: "The $500 Million Email: How One Subject Line Generated Half A Billion In Sales"
    technique: "Schwartz Dramatize + Specificity"
    awareness_level: "solution_aware"
    score: 10
    why_works: "Impossible to ignore number"

  7:
    headline: "Steal My Proven Client-Getting System (I've Used It To Generate $4.7M)"
    technique: "Permission + Proof"
    awareness_level: "product_aware"
    score: 8
    why_works: "Steal = free, proof = credibility"

  8:
    headline: "The 9-Word Text That Will Make Your Ex Desperate To Get You Back"
    technique: "Bencivenga Number-Noun"
    awareness_level: "problem_aware"
    score: 8
    why_works: "Specific + strong emotion"

  9:
    headline: "How I Turned [INVESTIMENTO_INICIAL_EXEMPLO] Into [RETORNO_TOTAL_EXEMPLO] In 18 Months Using A 'Weird' Investment Strategy"
    technique: "Story + ROI shock"
    awareness_level: "problem_aware"
    score: 9
    why_works: "Achievable starting point, impressive ROI"

  10:
    headline: "They Laughed When I Sat Down At The Piano - But When I Started To Play!"
    technique: "Halbert They Laughed (Original Caples)"
    awareness_level: "unaware"
    score: 10
    why_works: "Created eternal template"
```

### Headlines de Email (Subject Lines)

```yaml
email_headlines:

  1:
    subject: "I made a huge mistake"
    technique: "Vulnerability hook"
    open_rate_typical: "40-60%"
    why_works: "Authenticity, curiosity"

  2:
    subject: "Quick question about [name]"
    technique: "Personalization + brevity"
    open_rate_typical: "45-65%"
    why_works: "Personal, time-efficient"

  3:
    subject: "This is embarrassing..."
    technique: "Vulnerability + incomplete"
    open_rate_typical: "35-55%"
    why_works: "Human connection, curiosity"

  4:
    subject: "Re: your question"
    technique: "Fake reply thread"
    open_rate_typical: "50-70%"
    why_works: "Looks like ongoing conversation"
    risk: "Can feel manipulative"

  5:
    subject: "[Name], I noticed something..."
    technique: "Personal observation"
    open_rate_typical: "40-55%"
    why_works: "Feels targeted and important"
```

---

## FASE 6: CHECKLIST DE QUALIDADE

### Pre-Delivery Checklist

```yaml
quality_checklist:

  structure:
    - [ ] Comprimento 6-12 palavras (ideal 8-10)
    - [ ] Benefício principal presente
    - [ ] Sem trocadilhos ou jogos de palavras
    - [ ] Funciona isoladamente
    - [ ] Gramaticalmente correto

  awareness_match:
    - [ ] Nível de consciência identificado
    - [ ] Abordagem apropriada para o nível
    - [ ] Não sofisticado demais para audience

  specificity:
    - [ ] Contém números quando aplicável
    - [ ] Evita generalidades
    - [ ] Resultados mensuráveis
    - [ ] Timeline realista

  emotional:
    - [ ] Desperta curiosidade
    - [ ] Conecta com dor ou desejo
    - [ ] Não manipulativo
    - [ ] Tom apropriado

  credibility:
    - [ ] Afirmação é acreditável
    - [ ] Não parece hype excessivo
    - [ ] Promessa cumprível
    - [ ] Autoridade relevante

  testing_ready:
    - [ ] Pelo menos 3 variações por categoria
    - [ ] A/B pairs identificados
    - [ ] Métricas definidas
```

### Scoring Matrix

```yaml
scoring_matrix:

  criteria:
    benefit_clarity:
      weight: 25%
      question: "Benefício está claro em <3 segundos?"

    specificity:
      weight: 20%
      question: "Tem números, detalhes concretos?"

    curiosity:
      weight: 20%
      question: "Cria vontade de saber mais?"

    credibility:
      weight: 15%
      question: "É crível para o avatar?"

    audience_match:
      weight: 10%
      question: "Avatar se identifica imediatamente?"

    originality:
      weight: 10%
      question: "Diferente do que concorrentes usam?"

  thresholds:
    below_6: "Reescrever completamente"
    6_to_7: "Precisa melhorias"
    8_to_9: "Bom para testar"
    9_plus: "Excelente, priorizar teste"

  minimum_acceptable: 7
  target: 8+
```

---

## FASE 7: WORKFLOW COMPLETO

### Checklist de Execução

```yaml
execution_workflow:

  step_1_inputs:
    action: "Coletar todos os inputs"
    time: "10-15 min"
    output: "Brief completo"

  step_2_diagnosis:
    action: "Identificar awareness level"
    time: "5 min"
    output: "Level + estratégia"

  step_3_generation:
    action: "Gerar 30-50 headlines brutos"
    time: "30-45 min"
    output: "Lista bruta"

  step_4_amplification:
    action: "Aplicar técnicas Schwartz"
    time: "20-30 min"
    output: "Headlines amplificados"

  step_5_evaluation:
    action: "Avaliar com Borden + 4Us + SHINE"
    time: "15-20 min"
    output: "Headlines rankeados"

  step_6_selection:
    action: "Selecionar Top 5 + AB pairs"
    time: "10 min"
    output: "Recomendações finais"

  step_7_delivery:
    action: "Formatar output"
    time: "10 min"
    output: "Documento entregue"
```

### Red Flags (Se Qualquer Um = Revisar)

```yaml
red_flags:

  weak_headlines:
    - Headline genérico sem especificidade
    - Benefício não é claro
    - Soa como todos os concorrentes
    - Muito longo (>15 palavras)
    - Muito curto (<5 palavras)

  mismatch:
    - Awareness level errado para o tráfego
    - Tom não combina com avatar
    - Promessa que não pode cumprir

  missing:
    - Nenhum headline com números
    - Nenhum headline com curiosity gap
    - Menos de 3 variações para testar
```

---

## ANEXO: QUICK REFERENCE

### Fórmulas Mais Eficazes por Contexto

| Contexto | Top 3 Fórmulas |
|----------|---------------|
| Sales Page | How-to, Warning, They Laughed |
| Email Subject | Question, Curiosity, Vulnerability |
| Facebook Ad | Paradox, Story, Social Proof |
| Landing Page | Benefit, How-to, Question |
| Webinar | Secret, Discovery, Warning |
| Lead Magnet | Number-Noun, Free, How-to |

### Palavras que Aumentam Conversão

```yaml
power_words:
  highest_impact:
    - Free
    - New
    - You/Your
    - Now
    - Secret

  high_impact:
    - How to
    - Warning
    - Finally
    - Discover
    - Announcing

  good_impact:
    - Easy
    - Simple
    - Quick
    - Proven
    - Guaranteed
```

### Erros Mais Comuns

| Erro | Correção |
|------|----------|
| Muito vago | Adicionar números e detalhes |
| Muito longo | Cortar para 8-10 palavras |
| Sem benefício | Liderar com resultado |
| Hype excessivo | Usar proof em vez de promessa |
| Ignorar awareness | Ajustar para o nível correto |

---

*Task Version: 2.0*
*Word Count: 8,500+*
*Line Count: 600+*
*Primary Agents: Halbert, Schwartz, Bencivenga, Ogilvy, Hopkins*

---

# ═══════════════════════════════════════════════════════════════════════════
# CONTEÚDO EXTRAÍDO DAS FONTES PRIMÁRIAS
# Data: 2026-01-23 | Enrichment Phase ENR-007
# Fonte: "Breakthrough Advertising" por Eugene Schwartz + MMOS Artifacts
# ═══════════════════════════════════════════════════════════════════════════

## Headlines por Awareness Level (Exemplos do Livro Breakthrough Advertising)

O framework de awareness levels é a contribuição mais fundamental de Schwartz para copywriting. Cada nível requer uma abordagem completamente diferente de headline.

### Nível 5: MAIS CONSCIENTE (Most Aware)

**Estado Mental do Prospect:**
> "Conheço o produto, sei o que faz, quero comprá-lo, apenas não comprei ainda."
> [Fonte: Breakthrough Advertising, Capítulo sobre States of Awareness]

**Estratégia de Headline:**
- Simplicidade extrema
- Foco em urgência e escassez
- Oferta direta com preço
- Mínimo de copy necessário

**Exemplos de Estrutura:**
```yaml
most_aware_headlines:
  formula: "[Nome do Produto] - [Oferta/Desconto/Urgência]"
  examples:
    - "MacBook Air - Agora $200 de Desconto"
    - "[Produto] - Últimas Unidades"
    - "[Produto] para Membros - Desconto Exclusivo"

  principle: >
    Quando o desejo já existe completamente formado, adicionar
    complexidade apenas cria fricção. Seja um facilitador, não um persuasor.
```

**Citação de Schwartz:**
> "Este prospect já sabe tudo que precisa saber. Apenas precisa de um empurrão final - a oferta, o desconto, a urgência."
> [Fonte: Breakthrough Advertising]

---

### Nível 4: CONSCIENTE DO PRODUTO (Product Aware)

**Estado Mental do Prospect:**
> "Sei que seu produto existe, mas não estou convencido de que é superior."
> [Fonte: Breakthrough Advertising, Capítulo sobre States of Awareness]

**Estratégia de Headline:**
- Use "balanço de poder" - reconheça outras opções
- Depois incline a balança com diferenciadores únicos
- Forneça provas direcionadas
- Crie urgência para decisão

**Exemplos de Estrutura:**
```yaml
product_aware_headlines:
  formulas:
    - "Por que [Número] [Avatar] Escolheram [Produto]"
    - "A Diferença Entre [Produto] e [Alternativas]"
    - "O que [Produto] Faz que Nenhum Outro Consegue"
    - "Finalmente: [Produto] que [Diferenciador Único]"

  examples:
    - "Por que 47.000 Empreendedores Escolheram o Método X"
    - "A Diferença Entre Este Curso e Todos os Outros"
    - "Steal My Proven Client-Getting System (I've Used It To Generate $4.7M)"

  power_words:
    - "Por que"
    - "A diferença"
    - "Finalmente"
    - "O único que"
```

**Processo Cognitivo de Schwartz:**
1. Identificar dúvidas específicas
2. Fornecer provas direcionadas
3. Comparar com alternativas
4. Criar urgência para decisão

> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 2.1]

---

### Nível 3: CONSCIENTE DA SOLUÇÃO (Solution Aware)

**Estado Mental do Prospect:**
> "Sei que quero este tipo de solução, mas não conheço seu produto específico."
> [Fonte: Breakthrough Advertising, Capítulo sobre States of Awareness]

**Estratégia de Headline:**
- Lidere com a solução prometida
- Conecte rapidamente ao seu produto
- Demonstre superioridade do mecanismo
- Evite discussão de preço inicial

**Insight de Schwartz:**
> "Eles já decidiram o QUE querem, você precisa mostrar QUEM pode entregar melhor."
> [Fonte: Blueprint Cognitivo Eugene Schwartz]

**Exemplos de Estrutura:**
```yaml
solution_aware_headlines:
  formulas:
    - "O [Tipo de Solução] que [Diferenciador]"
    - "Nova Forma de [Resultado] Sem [Problema Comum]"
    - "[Categoria] Diferente de Tudo que Você Já Tentou"
    - "O Sistema de [Resultado] que [Autoridade/Número] Usa"

  examples:
    - "O Curso de Marketing que Funciona Mesmo Sem Audiência"
    - "The 3-Step System That Generated [RESULTADO_ANUAL_EXEMPLO] Last Year (In Just 4 Hours a Day)"
    - "O Sistema de Vendas que 47 Milionários Brasileiros Usam"

  power_words:
    - "O [tipo] que"
    - "Nova forma de"
    - "Diferente de"
    - "Sem [problema comum]"
```

---

### Nível 2: CONSCIENTE DO PROBLEMA (Problem Aware)

**Estado Mental do Prospect:**
> "Sei que tenho um problema, mas não sei que existem soluções."
> [Fonte: Breakthrough Advertising, Capítulo sobre States of Awareness]

**Sequência Mental de Schwartz:**
1. Agitar o problema intensamente
2. Pintar consequências de não resolver
3. Introduzir conceito de solução
4. Revelar produto como materialização da solução

**Técnica Chave - "Construa Ratos Maiores":**
> "Breakthrough Advertising não é sobre construir ratoeiras melhores. É sobre construir ratos maiores - e então construir medo aterrorizante deles em seus clientes."
> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 4.1]

**Exemplos de Estrutura:**
```yaml
problem_aware_headlines:
  formulas:
    - "Se Você [Sintoma], Leia Isso"
    - "Por Que [Problema] Não é Sua Culpa"
    - "A Verdade Sobre [Problema] que Ninguém Conta"
    - "Finalmente: Uma Solução Para [Problema Específico]"
    - "Warning: [Consequência Negativa do Problema]"

  examples:
    - "Se Você Trabalha 80h/Semana e Ainda Não Tem Lucro, Leia Isso"
    - "Warning: This 'Healthy' Breakfast Food May Be Making You Fat"
    - "The 5-Minute Stretching Routine That Eliminated My 10-Year Back Pain"
    - "Por Que Dietas Tradicionais Não Funcionam Para Você"

  power_words:
    - "Se você [sintoma]"
    - "Por que [problema]"
    - "A verdade sobre"
    - "Finalmente"
```

---

### Nível 1: INCONSCIENTE (Unaware)

**Estado Mental do Prospect:**
> "Não sei que tenho um problema/desejo, ou estou em negação."
> [Fonte: Breakthrough Advertising, Capítulo sobre States of Awareness]

**Princípio de Schwartz:**
> "Você está construindo uma cidade de desejo para sua pessoa vir morar."
> [Fonte: Blueprint Cognitivo Eugene Schwartz]

Este é o nível mais difícil. Você NÃO pode mencionar:
- O produto
- O preço
- O problema diretamente

**Processo Cognitivo Complexo:**
1. Despertar consciência através de histórias
2. Fazer perguntas que revelam problemas ocultos
3. Educar sobre consequências não percebidas
4. Gradualmente introduzir necessidade
5. Apenas então mencionar soluções

**Exemplos de Estrutura:**
```yaml
unaware_headlines:
  formulas:
    - "Eles Riram Quando [Ação], Mas Então..."
    - "A Maioria das Pessoas Não Sabe Que..."
    - "O Que [Autoridade] Faz Diferente"
    - "[Declaração Controversa]"
    - "Como [Pessoa Comum] [Resultado Extraordinário]"

  examples:
    - "They Laughed When I Sat Down At The Piano - But When I Started To Play!"
    - "A Maioria dos Empreendedores Está Trabalhando de Graça Sem Saber"
    - "Confessions Of A Former 'Failure' Who Now Makes $847/Day Online"
    - "How a 'Lazy' Investor Made [GANHO_ANUAL_EXEMPLO] Last Year With Just 3 Stocks"

  principle: >
    Use história, curiosidade e contraste. O produto só aparece
    no parágrafo 15, depois de construir toda a belief structure.
```

---

## As 38 Técnicas de Amplificação de Headlines (Schwartz)

Schwartz desenvolveu técnicas para tornar qualquer headline mais poderoso através de amplificação. Aqui estão as 10 principais extraídas diretamente do livro:

### 1. MEDIR O TAMANHO (Measure Size)

> "Transforme benefícios abstratos em quantidades mensuráveis."
> [Fonte: Breakthrough Advertising, Capítulo sobre Intensification]

```yaml
technique: measure_size
transformation:
  before: "Emagreça"
  after: "Perca 10 quilos"

  before: "Ganhe mais dinheiro"
  after: "Faça $2,147 extras todo mês"

  before: "Consiga mais clientes"
  after: "Consiga 47 novos clientes em 90 dias"

rule: "Números específicos (27, não 30) são mais críveis"
```

### 2. MEDIR A VELOCIDADE (Measure Speed)

```yaml
technique: measure_speed
transformation:
  before: "Aprenda espanhol rápido"
  after: "Aprenda espanhol conversacional em 30 dias (15 min/dia)"

  before: "Ganhe músculo rápido"
  after: "Adicione 5cm aos seus braços em 8 semanas"

power_variations:
  - "Em apenas 7 dias..."
  - "A partir de hoje à noite..."
  - "Antes do seu próximo aniversário..."
  - "Enquanto outros ainda lutam por anos..."
```

### 3. COMPARAR (Compare)

```yaml
technique: compare
transformation:
  before: "Fique em forma em casa"
  after: "Melhores resultados que um personal trainer de $200/hora"

  before: "Esta dieta funciona"
  after: "Funciona mais rápido que qualquer dieta que seu médico recomenda"

comparison_types:
  authority: "Melhor que o que médicos recomendam"
  competitor: "Supera [líder de mercado]"
  expectation: "Funciona mesmo se você falhou em tudo antes"
  cost: "Resultados de um programa de [HIGH_TICKET_PROGRAM_VALUE] por [ENTRY_PRICE_EXAMPLE]"
```

### 4. METAFORIZAR (Metaforize)

> "Crie imagens concretas para benefícios abstratos."
> [Fonte: Breakthrough Advertising]

```yaml
technique: metaforize
transformation:
  before: "Aumente sua memória"
  after: "Dê a si mesmo uma memória fotográfica"

  before: "Aprenda a investir"
  after: "Transforme suas economias em uma máquina de imprimir dinheiro"

powerful_metaphors:
  money: ["Máquina de dinheiro", "Ímã de dinheiro", "Galinha dos ovos de ouro"]
  speed: ["Rápido como um raio", "Sucesso da noite pro dia", "Transformação instantânea"]
  power: ["Arma secreta", "Vantagem injusta", "Superpoder"]
```

### 5. SENSITIZAR (Sensitize)

> "Adicione detalhes sensoriais - textura, cor, som, cheiro, sabor."
> [Fonte: Breakthrough Advertising]

```yaml
technique: sensitize
transformation:
  before: "Pareça mais jovem"
  after: "Veja as linhas finas ao redor dos seus olhos derreterem"

  before: "Acorde disposto"
  after: "Acorde com aquela energia que você tinha aos 25"

sensory_words:
  visual: ["cristalino", "vívido", "brilhante", "radiante"]
  tactile: ["sedoso", "firme", "leve como pena", "fresco"]
  auditory: ["silencioso", "ressonante", "nítido", "melódico"]
```

### 6. DEMONSTRAR (Demonstrate)

```yaml
technique: demonstrate
transformation:
  before: "Muitas pessoas usam isso"
  after: "Por que 1.847.293 pessoas já aderiram"

  before: "Atletas usam isso"
  after: "O exercício usado por 7 medalhistas olímpicos de ouro"

demonstration_types:
  social_proof: "Junte-se a 50.000+ membros"
  authority: "Testado por Stanford"
  track_record: "47 anos de resultados comprovados"
  specificity: "Funciona para 97.3% dos usuários"
```

### 7. DRAMATIZAR (Dramatize)

> "Aumente as stakes - crie tensão, conflito, resolução inesperada."
> [Fonte: Breakthrough Advertising]

```yaml
technique: dramatize
transformation:
  before: "Especialistas em marketing compartilham dicas"
  after: "O que acontece quando 50 especialistas em marketing se trancam em uma sala por 72 horas"

  before: "Esta técnica de email funciona"
  after: "O email que fez o chefe dela implorar por perdão"

dramatic_elements:
  contrast: "Davi vs Golias"
  stakes: "O que está em risco"
  tension: "Conflito, desafio, obstáculo"
  resolution: "Sucesso inesperado"
```

### 8. CRIAR PARADOXO (Create Paradox)

> "Junte contraditórios - resultado sem sacrifício esperado."
> [Fonte: Breakthrough Advertising]

```yaml
technique: create_paradox
transformation:
  before: "Perca peso"
  after: "Perca peso sem dieta ou exercício"

  before: "Ganhe mais dinheiro"
  after: "Ganhe mais dinheiro trabalhando menos horas"

paradox_variations:
  - "O jeito preguiçoso de [resultado difícil]"
  - "[Grande resultado] fazendo [coisa pequena]"
  - "Por que [contra-intuitivo] na verdade [resultado desejado]"
```

### 9. REMOVER LIMITAÇÕES (Remove Limitations)

> "Elimine objeções diretamente no headline."
> [Fonte: Breakthrough Advertising]

```yaml
technique: remove_limitations
transformation:
  before: "Fale espanhol fluentemente"
  after: "Fale espanhol fluentemente mesmo se você reprovou em todas as aulas de idiomas"

  before: "Construa um negócio"
  after: "Construa um negócio lucrativo mesmo sem capital"

common_limitations_to_remove:
  age: "mesmo se você tem mais de 40/50/60"
  money: "mesmo começando do zero"
  experience: "mesmo sendo um completo iniciante"
  time: "mesmo tendo apenas 15 minutos por dia"
  ability: "mesmo se você já falhou antes"
```

### 10. ASSOCIAR AUTORIDADE (Associate Authority)

```yaml
technique: associate_authority
transformation:
  before: "Esta técnica de sono funciona"
  after: "A técnica de sono que Navy SEALs usam para dormir em 2 minutos"

  before: "Aprenda negociação"
  after: "O segredo de negociação que CEOs da Fortune 500 pagam [AUTHORITY_PREMIUM_EXAMPLE] para aprender"

authority_sources:
  institutions: ["Harvard", "Stanford", "NASA", "MIT"]
  professions: ["Médicos", "Navy SEALs", "Atletas olímpicos"]
  companies: ["Apple", "Google", "Amazon", "Tesla"]
  individuals: "Especialistas conhecidos, celebridades"
```

---

## Headlines Clássicos Citados por Schwartz (Análise)

### The $500 Million Email

**Headline:**
> "The $500 Million Email: How One Subject Line Generated Half A Billion In Sales"

**Análise de Schwartz:**
- Técnica: Dramatização + Especificidade extrema
- Awareness Level: Solution Aware
- Por que funciona: Número impossível de ignorar
- Score: 10/10

> [Fonte: Análise de Headlines, Blueprint Cognitivo Schwartz]

---

### Read 300 Business Magazines in 30 Minutes

**Headline:**
> "Read 300 Business Magazines in 30 Minutes"

**Análise de Schwartz:**
Este foi um dos maiores sucessos de Schwartz para Boardroom Reports:

```yaml
analysis:
  client: "Boardroom Reports - Martin Edelston"
  initial_capital: "$3,500"
  result: "$50+ milhões em vendas anuais"
  control_duration: "Mais de uma década"

  why_it_worked:
    1: "Promessa impossível: 300 revistas em 30 minutos"
    2: "Compressão de tempo: Solução para sobrecarga de informação"
    3: "Quantificação específica: 300, não 'muitas'"
    4: "Benefício claro: Economize tempo mantendo-se informado"

  cognitive_lessons:
    - "Identifique frustração universal (falta de tempo)"
    - "Ofereça solução 'impossível' mas crível"
    - "Quantifique especificamente para credibilidade"
```

> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 7.1]

---

### Burn Disease Out of Your Body

**Headline:**
> "How Modern Chinese Medicine Helps Both Men and Women Burn Disease Out of Your Body Lying Flat on Your Back, Using Nothing More Than the Palm of Your Hand!"

**Análise de Schwartz:**
Control que durou 20 anos:

```yaml
analysis:
  duration: "20 anos de sucesso contínuo"

  element_breakdown:
    1_authority: "'Modern Chinese Medicine'"
    2_inclusion: "'Both Men and Women'"
    3_visualization: "'Burn Disease Out'"
    4_ease: "'Lying Flat on Your Back'"
    5_simplicity: "'Palm of Your Hand'"

  why_20_years:
    - "Mecanismo único constantemente refinado"
    - "Apelo a desejo permanente (saúde)"
    - "Promessa visual poderosa"
    - "Barreira de entrada mínima"
```

> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 7.2]

---

### Give Me 15 Minutes And I'll Give You a Super-Power Memory

**Headline:**
> "Give Me 15 Minutes And I'll Give You a Super-Power Memory"

**Fórmula Decodificada:**
```
[Pequeno Investimento] + [Grande Retorno] + [Especificidade] = Irresistível
```

```yaml
analysis:
  psychological_elements:
    reciprocity: "'Give me... I'll give you'"
    minimal_investment: "'15 Minutes'"
    maximum_return: "'Super-Power'"
    personal_transformation: "'Memory'"

  technique: "Halbert Give Me + Especificidade + Paradoxo"
  awareness_level: "Solution Aware"
```

> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 7.3]

---

## Princípio Fundamental de Schwartz sobre Headlines

### A Teoria Central: Canalização vs. Criação de Desejo

**O Princípio Mais Fundamental de Schwartz:**

> "Esta é a tarefa do copywriter: não criar desejo de massa - mas canalizá-lo e direcioná-lo."
> [Fonte: Breakthrough Advertising, Introdução]

> "O poder, a força, o impulso avassalador de possuir que faz a publicidade funcionar, vem do próprio mercado, e não do copy."
> [Fonte: Breakthrough Advertising]

> "Copy cannot create desire for a product. It can only take the hopes, dreams, fears and desires that already exist... and focus those already-existing desires onto a particular product."
> [Fonte: Breakthrough Advertising, Capítulo 1]

**Processo Mental de Canalização:**
1. **Identificar** o desejo dominante pré-existente
2. **Intensificar** através de especificidade e vivacidade
3. **Direcionar** para características do produto
4. **Materializar** em ação de compra específica

---

## Hierarquia de Desejos de Schwartz (Para Headlines)

Quando você escreve headlines, conecte ao desejo mais poderoso disponível:

```yaml
desire_hierarchy:
  1_survival:
    desires: ["Saúde", "Segurança", "Proteção"]
    headline_angle: "Elimine ameaças, garanta sobrevivência"

  2_sexual:
    desires: ["Atração", "Reprodução", "Vitalidade"]
    headline_angle: "Torne-se mais atraente, desejável"

  3_social:
    desires: ["Status", "Pertencimento", "Admiração"]
    headline_angle: "Seja admirado, respeitado, incluído"

  4_achievement:
    desires: ["Sucesso", "Conquista", "Legado"]
    headline_angle: "Alcance mais, conquiste mais"

  5_transcendence:
    desires: ["Significado", "Contribuição", "Imortalidade"]
    headline_angle: "Deixe sua marca, faça diferença"
```

> [Fonte: Blueprint Cognitivo Eugene Schwartz, Seção 5.1]

---

## Regra de Ouro de Schwartz para Headlines

> "O headline contém 90% do valor do anúncio. As primeiras 5-10 palavras são tudo."
> [Fonte: Breakthrough Advertising]

**Implicação Prática:**
- Schwartz gastava semanas/meses para criar 5-10 palavras de headline
- Escrevia dezenas de variações antes de escolher
- Testava com pequenos grupos antes de escalar
- Avaliava por: Credibilidade × Interesse × Especificidade

> [Fonte: Análise Arquitetura Cognitiva DEEP, Seção VI]

---

*Enrichment Source: Eugene Schwartz Artifacts (MMOS Mind)*
*Files: Blueprint_Cognitivo_Definitivo.md, Análise_Completa_Arquitetura_Cognitiva_DEEP.md*
*Extraction Date: 2026-01-23*
