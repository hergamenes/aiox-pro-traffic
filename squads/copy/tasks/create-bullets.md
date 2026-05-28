---
task: Create Bullets Task
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

# Create Bullets Task

## Purpose

Criar bullets (fascinations) de alta conversão usando as metodologias comprovadas de Clayton Makepeace (21 Fascination Types), Parris Lampropoulos (Bullet Mastery), Gary Bencivenga (Persuasion Bullets), e Eugene Schwartz (Fascination Principles). Bullets são mini-headlines que vendem benefícios de forma irresistível, gerando curiosidade e desejo que compele à ação.

## When to Use

- Criando página de vendas ou landing page
- Descrevendo módulos de curso ou conteúdo
- Listando benefícios de produto/serviço
- Criando emails de vendas
- Headlines para ads ou subject lines
- Descrevendo bônus em ofertas
- Value stacking em webinars/VSLs
- Conteúdo de lead magnets

## Core Frameworks

Esta task integra quatro frameworks principais:

1. **Makepeace 21 Fascinations** - Os 21 tipos de bullets que funcionam
2. **Lampropoulos Bullet Mastery** - Técnicas do mestre dos bullets
3. **Bencivenga Persuasion Rules** - 8 regras para bullets poderosos
4. **Schwartz Fascination Principles** - Fundamentos de curiosidade

---

## Phase 0: Tier 0 Diagnostic Questions

**MANDATORY: Before creating ANY bullets, complete this diagnosis.**

### Block A: Product Understanding

```yaml
questions:
  A1_product_core:
    question: "O que é o produto/serviço exatamente?"
    details:
      - "Formato (curso, serviço, software, físico)?"
      - "Quantidade de componentes (módulos, seções, features)?"
      - "Quanto conteúdo (horas, páginas, itens)?"

  A2_features_list:
    question: "Liste TODAS as features do produto"
    format: |
      Feature 1: [nome] - [descrição]
      Feature 2: [nome] - [descrição]
      ...
    minimum: "Mínimo 10 features para bullets efetivos"

  A3_unique_mechanisms:
    question: "Quais são os mecanismos/métodos únicos?"
    examples:
      - "Tem sistema ou framework proprietário?"
      - "Tem técnicas com nomes específicos?"
      - "Tem processos passo-a-passo diferenciados?"
```

### Block B: Avatar & Market

```yaml
questions:
  B1_target_avatar:
    question: "Quem é o cliente ideal?"
    details:
      - "Situação atual (before state)"
      - "Desejo principal (after state)"
      - "Nível de consciência sobre o problema"
      - "O que já tentou que não funcionou"

  B2_market_sophistication:
    question: "Qual é o nível de sofisticação do mercado?"
    levels:
      - "1: Mercado virgem (primeira solução)"
      - "2: Mercado ciente (concorrentes existem)"
      - "3: Mercado saturado (muitas opções)"
      - "4: Mercado cínico (descrentes)"
      - "5: Mercado exausto (todos prometem)"

  B3_language_patterns:
    question: "Como seu avatar FALA sobre o problema?"
    collect:
      - "Frases exatas usadas em reviews"
      - "Perguntas frequentes"
      - "Objeções comuns"
      - "Linguagem emocional"
```

### Block C: Results & Proof

```yaml
questions:
  C1_results_achieved:
    question: "Quais resultados específicos foram alcançados?"
    format:
      - "Resultado 1: [quem] alcançou [o quê] em [tempo]"
      - "Resultado 2: [quem] alcançou [o quê] em [tempo]"
    important: "Números específicos são CRÍTICOS para bullets"

  C2_testimonials:
    question: "Quais depoimentos você tem?"
    collect:
      - "Citações com resultados específicos"
      - "Antes/depois documentados"
      - "Transformações emocionais"

  C3_authority_proof:
    question: "Quais provas de autoridade existem?"
    elements:
      - "Número de clientes/usuários"
      - "Anos de experiência"
      - "Mídia/reconhecimento"
      - "Credenciais"
```

### Block D: Context & Constraints

```yaml
questions:
  D1_bullet_context:
    question: "Onde os bullets serão usados?"
    options:
      - "Página de vendas (seção What You Get)"
      - "Email de vendas"
      - "Descrição de módulos/conteúdo"
      - "Value stack em webinar"
      - "Ad copy"
      - "Landing page"

  D2_bullet_quantity:
    question: "Quantos bullets são necessários?"
    guidelines:
      - "Página de vendas: 20-50 bullets"
      - "Email: 5-10 bullets"
      - "Landing page: 10-15 bullets"
      - "Ad: 3-5 bullets"

  D3_tone_style:
    question: "Qual é o tom desejado?"
    options:
      - "Agressivo/urgente (Dan Kennedy style)"
      - "Elegante/premium (Ogilvy style)"
      - "Conversacional/amigável (Kern style)"
      - "Científico/autoridade (Schwartz style)"
      - "Emocional/story (Halbert style)"

  D4_forbidden_claims:
    question: "Quais promessas NÃO podem ser feitas?"
    examples:
      - "Limitações regulatórias"
      - "Promessas de resultado específico"
      - "Termos proibidos pelo nicho"
```

### Diagnostic Output

```yaml
diagnosis_summary:
  product_complexity: [low|medium|high]
  feature_count: [N]
  market_sophistication: [1-5]
  avatar_awareness: [unaware|problem_aware|solution_aware|product_aware|most_aware]
  proof_strength: [weak|moderate|strong]
  bullet_type_recommendation: |
    Based on market sophistication and awareness level...
```

---

## Phase 1: Feature-to-Fascination Transformation

### The Benefit Ladder

Para CADA feature, escalar através de todos os níveis:

```yaml
benefit_ladder:
  level_1_feature:
    description: "O que É o produto/componente"
    example: "12 módulos de vídeo"

  level_2_advantage:
    description: "O que FAZ"
    example: "Ensina copywriting completo"

  level_3_benefit:
    description: "O que o cliente GANHA"
    example: "Escreve copy que vende sem parecer vendedor"

  level_4_emotional_benefit:
    description: "Como o cliente SE SENTE"
    example: "Confiança de que pode vender qualquer coisa"

  level_5_identity_benefit:
    description: "Quem o cliente SE TORNA"
    example: "Copywriter respeitado que cobra premium"

  transformation_template: |
    FEATURE: [nome da feature]
    ↓
    VANTAGEM: [o que faz]
    ↓
    BENEFÍCIO: [o que cliente ganha]
    ↓
    EMOÇÃO: [como se sente]
    ↓
    IDENTIDADE: [quem se torna]
    ↓
    FASCINATION: [bullet final com curiosidade]
```

### Fascination Formula

**Estrutura de um Bullet Perfeito:**

```
[Hook + Specificity]: [Named Mechanism] que [Benefit Promise] — [Proof Element] ([Curiosity Amplifier])
```

**Componentes:**
1. **Hook** - O que prende atenção
2. **Specificity** - Números, página, tempo específico
3. **Named Mechanism** - Técnica/sistema com nome
4. **Benefit Promise** - O que o cliente ganha
5. **Proof Element** - Por que acreditar
6. **Curiosity Amplifier** - O que fica sem resposta

**Exemplo Completo:**
"Page 47: The 'Invisible Close' technique that makes prospects sell themselves on your offer — used by top 1% of closers, never taught in sales training (and why it feels completely natural)"

---

## Phase 2: Clayton Makepeace's 21 Fascination Types

### Type 1: The "How To" Bullet
```yaml
formula: "Como [alcançar resultado desejado] [sem/mesmo que + objeção]"

examples:
  - "Como dobrar suas vendas sem trabalhar mais horas"
  - "Como perder peso sem abrir mão dos carboidratos"
  - "Como fechar vendas high-ticket mesmo que você seja introvertido"

templates:
  - "Como [resultado] sem [sacrifício]"
  - "Como [resultado] mesmo que [objeção]"
  - "Como [resultado] em [tempo curto]"
  - "Como [resultado] enquanto [faz outra coisa]"

when_to_use: "Quando o avatar quer um resultado mas tem medo/objeção específica"
```

### Type 2: The "Secret To" Bullet
```yaml
formula: "O segredo de/para [resultado] que [grupo elite] usa/não compartilha"

examples:
  - "O segredo dos vendedores top 1% que nunca é ensinado em treinamentos"
  - "O segredo de celebridades para manter a pele jovem (custa menos que um café por dia)"
  - "O segredo que bilionários usam para trabalhar menos e ganhar mais"

templates:
  - "O segredo de [resultado] que [grupo] esconde"
  - "O segredo [adjective] que [pessoa/grupo] usa para [resultado]"
  - "O segredo por trás de [resultado impressionante]"

when_to_use: "Quando quer criar sensação de informação privilegiada/insider"
```

### Type 3: The "Why" Bullet
```yaml
formula: "Por que [crença comum/prática] está [causando problema]"

examples:
  - "Por que economizar dinheiro está te deixando mais pobre"
  - "Por que trabalhar mais está destruindo seus resultados"
  - "Por que seguir sua paixão é o pior conselho de carreira"

templates:
  - "Por que [prática comum] é o pior conselho para [avatar]"
  - "Por que [crença] está te impedindo de [resultado]"
  - "Por que [ação que parece certa] está destruindo [objetivo]"

when_to_use: "Quando quer criar dissonância cognitiva e desafiar crenças"
```

### Type 4: The "What" Bullet
```yaml
formula: "O que [grupo de sucesso] faz/sabe para [alcançar resultado]"

examples:
  - "O que os top 1% fazem nas primeiras 2 horas do dia"
  - "O que atletas olímpicos comem antes de competir (não é o que você pensa)"
  - "O que a Amazon sabe sobre vendas que você não sabe"

templates:
  - "O que [grupo] faz diferente para [resultado]"
  - "O que [autoridade] usa para [resultado]"
  - "O que [empresa/pessoa de sucesso] sabe que você não sabe"

when_to_use: "Quando quer revelar estratégias de sucesso modeláveis"
```

### Type 5: The "What NEVER" Bullet
```yaml
formula: "O que você NUNCA deve [fazer/dizer] quando [situação]"

examples:
  - "O que você NUNCA deve dizer quando o cliente diz 'vou pensar'"
  - "O que NUNCA comer depois das 18h se quer emagrecer"
  - "A única palavra que você NUNCA deve usar em emails de vendas"

templates:
  - "O que NUNCA [fazer] quando [situação]"
  - "O [elemento] que você NUNCA deve [ação]"
  - "Por que você NUNCA deve [ação aparentemente correta]"

when_to_use: "Quando quer ativar medo de cometer erros custosos"
```

### Type 6: The "Plus" Bullet
```yaml
formula: "PLUS [benefício adicional] que [amplifica valor]"

examples:
  - "PLUS uma brecha fiscal pouco conhecida que pode economizar milhares"
  - "PLUS os scripts exatos para usar palavra por palavra"
  - "PLUS acesso vitalício à nossa comunidade privada"

templates:
  - "PLUS [benefício] que [como ajuda]"
  - "E mais: [benefício extra] (valor de $X)"
  - "Incluindo também [bônus] que [resolve problema específico]"

when_to_use: "Depois de listar benefícios principais para adicionar mais valor"
```

### Type 7: The "Number" Bullet
```yaml
formula: "[Número] [maneiras/segredos/erros/razões] para [resultado]"

examples:
  - "7 maneiras de dobrar sua conversão overnight"
  - "12 segredos que a indústria de dietas não quer que você saiba"
  - "Os 3 maiores erros que matam 90% das startups"

templates:
  - "[N] maneiras de [resultado]"
  - "[N] segredos de [área]"
  - "Os [N] erros que [causam problema]"
  - "[N] técnicas para [resultado]"

when_to_use: "Quando quer prometer conteúdo completo e organizado"
```

### Type 8: The "Right... WRONG!" Bullet
```yaml
formula: "Acha que [suposição comum]? ERRADO! Eis por que..."

examples:
  - "Acha que precisa de dinheiro para fazer dinheiro? ERRADO!"
  - "Acha que precisa ser jovem para empreender? ERRADO!"
  - "Acha que cardio é a melhor forma de queimar gordura? ERRADO!"

templates:
  - "Acha que [crença]? ERRADO! Eis por que..."
  - "Se você pensa que [crença], está completamente errado"
  - "[Crença comum]? Pense de novo..."

when_to_use: "Quando quer corrigir uma misconception comum"
```

### Type 9: The "WARNING" Bullet
```yaml
formula: "AVISO: [prática/produto] pode [consequência negativa]"

examples:
  - "AVISO: Esta vitamina comum pode estar destruindo seu fígado"
  - "AVISO: Se você está fazendo isso, está perdendo 67% dos clientes"
  - "AVISO: Esses alimentos 'saudáveis' estão te deixando doente"

templates:
  - "AVISO: [prática] pode [consequência]"
  - "CUIDADO: [erro] está [causando problema]"
  - "ALERTA: [situação] pode [resultado negativo]"

when_to_use: "Quando quer ativar instinto de auto-preservação"
```

### Type 10: The "Are You...?" Bullet
```yaml
formula: "Você está [fazendo erro/tendo sintoma]? Veja [o que significa/como corrigir]"

examples:
  - "Você trabalha 60+ horas e ainda luta financeiramente? Veja por que..."
  - "Você está cometendo esses 5 erros no currículo?"
  - "Você está jogando fora milhares em impostos que poderia manter?"

templates:
  - "Você está [situação negativa]? Veja [solução]"
  - "Você [faz erro]? Aqui está [correção]"
  - "Você é um dos [X%] que [faz erro]?"

when_to_use: "Quando quer criar auto-identificação e relevância"
```

### Type 11: The "Gimmick" Bullet
```yaml
formula: "O/A '[nome criativo]' que [alcança resultado]"

examples:
  - "A 'técnica do guardanapo' que fecha vendas na hora"
  - "O 'aperto de mão invisível' que cria rapport instantâneo"
  - "A 'regra dos 3 segundos' que elimina procrastinação"

templates:
  - "A '[nome]' que [resultado]"
  - "O método '[nome]' para [resultado]"
  - "A técnica '[nome criativo]' que [benefício]"

when_to_use: "Quando tem um método proprietário ou quer criar um"
```

### Type 12: The "Sneaky" Bullet
```yaml
formula: "Uma maneira [sorrateira/esperta] mas [ética] de [alcançar resultado]"

examples:
  - "Uma maneira sorrateira (mas legal) de pagar quase zero impostos"
  - "Um truque esperto para fazer clientes ligarem PARA você"
  - "A frase 'esperta' que faz objeções desaparecerem"

templates:
  - "Uma maneira sorrateira (mas [qualificador]) de [resultado]"
  - "O truque esperto que [resultado] sem [consequência negativa]"
  - "A técnica 'dissimulada' para [resultado]"

when_to_use: "Quando quer sugerir vantagem injusta que é ética"
```

### Type 13: The "Testimonial" Bullet
```yaml
formula: "'[Citação de resultado]' — [Nome], [Local/Credencial]"

examples:
  - "'Gerei [RESULTADO_INICIAL_EXEMPLO] no primeiro mês usando esse sistema' — João D., São Paulo"
  - "'Isso mudou meu casamento completamente' — Maria S."
  - "'O melhor investimento que já fiz' — CEO da Fortune 500"

templates:
  - "'[Resultado específico]' — [Nome, Local]"
  - "'[Citação emocional]' — [Nome, Credencial]"
  - "[Nome] [alcançou resultado]: '[citação]'"

when_to_use: "Quando tem prova social forte com resultados específicos"
```

### Type 14: The "If/When... Then" Bullet
```yaml
formula: "Quando [situação], faça [isto] para [resultado]"

examples:
  - "Quando o cliente diz 'preciso pensar', diga isso..."
  - "Se você tem mais de 50, faça esse exercício para proteger as articulações"
  - "Quando sua campanha para de converter, faça esse único ajuste"

templates:
  - "Quando [situação], [faça isto] para [resultado]"
  - "Se você [condição], [ação] é essencial"
  - "No momento em que [trigger], use [solução]"

when_to_use: "Quando quer dar conselho situacional imediatamente aplicável"
```

### Type 15: The "Better Than" Bullet
```yaml
formula: "Melhor que [solução conhecida] — [nova solução] que [benefício]"

examples:
  - "Melhor que cold calling — o método de introdução quente com 80% de resposta"
  - "Melhor que dieta — o reset metabólico que derrete gordura permanentemente"
  - "Melhor que contratar agência — o sistema DIY que economiza 90%"

templates:
  - "Melhor que [alternativa conhecida] — [sua solução]"
  - "Supera [solução comum] porque [razão]"
  - "Faz [alternativa] parecer [obsoleta/lenta/cara]"

when_to_use: "Quando quer posicionar contra alternativas conhecidas"
```

### Type 16: The "Truth About" Bullet
```yaml
formula: "A verdade sobre [tópico] que [autoridade] não quer que você saiba"

examples:
  - "A verdade sobre suplementos que a Big Pharma esconde"
  - "A verdade sobre LinkedIn que os 'gurus' não contam"
  - "A verdade chocante sobre investimento imobiliário"

templates:
  - "A verdade sobre [tópico] que [quem] esconde"
  - "O que [autoridade] não quer que você saiba sobre [tópico]"
  - "A verdade [adjetivo] sobre [tópico]"

when_to_use: "Quando quer revelar 'segredos' da indústria"
```

### Type 17: The "Single" Bullet
```yaml
formula: "O único/A única [coisa] mais importante para [resultado]"

examples:
  - "A única métrica que importa para qualquer negócio"
  - "O único fator que determina sucesso em perda de peso"
  - "A única frase que fecha mais vendas que qualquer outra"

templates:
  - "O(A) único(a) [coisa] mais importante para [resultado]"
  - "A única coisa que [grupo de sucesso] faz diferente"
  - "O único [elemento] que separa [sucesso] de [fracasso]"

when_to_use: "Quando quer simplificar e apontar o essencial"
```

### Type 18: The "You'll Discover" Bullet
```yaml
formula: "Você vai descobrir/aprender/receber [benefício específico]"

examples:
  - "Você vai descobrir exatamente por que alguns conseguem e outros falham"
  - "Você vai receber os scripts exatos que usei para fechar [VOLUME_DE_VENDAS_EXEMPLO]"
  - "Você vai aprender o sistema de 3 passos que me tirou da falência"

templates:
  - "Você vai descobrir [revelação]"
  - "Você vai aprender [habilidade/conhecimento]"
  - "Você vai receber [item tangível]"

when_to_use: "Quando quer fazer promessa direta e pessoal"
```

### Type 19: The "Quick" Bullet
```yaml
formula: "[Resultado] em [tempo curto] — mesmo que [objeção]"

examples:
  - "Escreva copy killer em 10 minutos — mesmo que tenha reprovado em português"
  - "Monte um funil 6 dígitos em um fim de semana — sem conhecimento técnico"
  - "Veja resultados visíveis em 7 dias — sem passar fome"

templates:
  - "[Resultado] em [tempo] — mesmo que [objeção]"
  - "[Resultado] em menos de [tempo] — sem [sacrifício]"
  - "De [zero] a [resultado] em [tempo curto]"

when_to_use: "Quando quer enfatizar velocidade e superar objeções"
```

### Type 20: The "Simple" Bullet
```yaml
formula: "Um(a) simples [método/ajuste] que [resultado impressionante]"

examples:
  - "Um simples ajuste no email que dobrou minhas taxas de abertura"
  - "Uma rotina matinal simples que transformou minha produtividade"
  - "Uma frase simples que para objeções antes de começarem"

templates:
  - "Um(a) simples [coisa] que [resultado impressionante]"
  - "O [ajuste/mudança] simples que [resultado]"
  - "Uma técnica simples de [área] que [benefício]"

when_to_use: "Quando quer enfatizar facilidade de implementação"
```

### Type 21: The "Exposed" Bullet
```yaml
formula: "[Indústria/Prática] expostos — [o que realmente acontece]"

examples:
  - "Wall Street exposta — como manipulam investidores pequenos"
  - "A indústria de coaching exposta — o que realmente vendem"
  - "Agências de SEO expostas — por que a maioria é desperdício de dinheiro"

templates:
  - "[Indústria] exposta — [revelação]"
  - "A verdade que [indústria] não quer que você saiba"
  - "[Prática] desmascarada — [o que realmente é]"

when_to_use: "Quando quer criar exposé de indústria/prática"
```

---

## Phase 3: Lampropoulos Bullet Techniques

### Technique 1: Extreme Specificity

```yaml
principle: "Números específicos vencem generalidades"

transformation:
  vague: "Perca peso rápido"
  specific: "Perca 11.3kg em 21 dias comendo 2.100 calorias por dia"

  vague: "Ganhe mais dinheiro"
  specific: "Adicione [RENDA_MENSAL_EXEMPLO] à sua renda mensal trabalhando 47 minutos por dia"

specificity_elements:
  - numbers: "23, não 'muitos'"
  - time: "21 dias, não 'rapidamente'"
  - percentages: "67%, não 'a maioria'"
  - currency: "[VALOR_EXATO_EXEMPLO], não 'milhares'"
  - pages: "Página 47, não 'inside'"
  - people: "47.293 pessoas, não 'milhares'"
```

### Technique 2: The Curiosity Multiplier

```yaml
principle: "Combine múltiplos gatilhos de curiosidade em um bullet"

single_trigger: "Uma forma de perder peso"

multiplied_trigger: |
  A 'troca matinal de 2 minutos' que ajudou uma avó de 58 anos
  de Ohio a perder 18.5kg em 6 semanas — e manter por 3 anos

elements_combined:
  - named_mechanism: "'troca matinal de 2 minutos'"
  - specific_person: "avó de 58 anos de Ohio"
  - specific_result: "18.5kg"
  - time_frame: "6 semanas"
  - proof_of_permanence: "manter por 3 anos"
```

### Technique 3: The Misdirection Technique

```yaml
principle: "Aponte em direção inesperada, depois revele verdade diferente"

examples:
  - "O 'alimento saudável' que está causando sua gordura abdominal (está na maioria das cozinhas)"
  - "O hábito 'produtivo' que está destruindo seus resultados"
  - "O conselho 'de especialista' que mantém você pobre"

how_it_works: |
  O leitor espera uma coisa, a revelação é surpreendente.
  Cria necessidade de descobrir o que é.
```

### Technique 4: Call It Something Else

```yaml
principle: "Dê nomes extraordinários a conceitos ordinários"

transformations:
  ordinary_1:
    before: "Uma rotina matinal"
    after: "O Protocolo Milagroso das 7AM"

  ordinary_2:
    before: "Uma técnica de vendas"
    after: "O Fechamento Invisível"

  ordinary_3:
    before: "Uma tática de negociação"
    after: "A Manobra Columbo"

  ordinary_4:
    before: "Um método de precificação"
    after: "O Efeito Ancoragem de Premium"

naming_formulas:
  - "O [Adjetivo] [Substantivo] de [Resultado]"
  - "A Técnica/Método/Sistema [Nome Próprio]"
  - "O Protocolo [Nome] de [Número] Passos"
  - "A Fórmula [Adjetivo] de [Resultado]"
```

### Technique 5: The Gradualization Technique

```yaml
principle: "Mostre progressão que torna a promessa acreditável"

less_believable: "Ganhe [RENDA_MENSAL_EXEMPLO] por mês"

more_believable: |
  Como fui de [PONTO_DE_PARTIDA] para [RESULTADO_MÊS_1] no mês 1,
  [RESULTADO_MÊS_2] no mês 2 e [RESULTADO_MÊS_3] no mês 3
  (e mantive desde então)

structure: |
  De [ponto inicial] para [marco 1] em [tempo 1],
  depois [marco 2] em [tempo 2],
  finalmente [resultado final] em [tempo 3]
```

### Technique 6: The Forehead-Slapper Test

```yaml
principle: "Cada bullet deve fazer o leitor pensar:"

reactions_to_achieve:
  - "Eu não sabia disso!"
  - "Preciso saber mais!"
  - "Por que ninguém me contou antes?"
  - "Isso muda tudo!"

test_questions:
  - "Esse bullet me faria parar de scrollar?"
  - "Eu pagaria para saber o que vem depois?"
  - "Isso é genuinamente surpreendente/valioso?"
  - "Isso criaria arrependimento se eu não soubesse?"
```

---

## Phase 4: Bencivenga Persuasion Rules

### Rule 1: Every Bullet Is a Mini-Headline

```yaml
principle: "Trate cada bullet como headline de um anúncio"

requirements:
  - stop_reader: "Deve interromper o scroll"
  - create_curiosity: "Deve gerar 'preciso saber'"
  - promise_benefit: "Deve prometer algo valioso"
  - compel_action: "Deve impulsionar leitura/compra"

test: |
  Cada bullet, isoladamente, funcionaria como
  headline de um anúncio? Se não, reescreva.
```

### Rule 2: Tease, Don't Tell

```yaml
principle: "Provoque, não revele"

bad_tells:
  - "Você vai aprender sobre juros compostos"
  - "Inclui técnicas de negociação"
  - "Ensina sobre headlines"

good_teases:
  - "A 'oitava maravilha do mundo' que pode transformar [CAPITAL_INICIAL_EXEMPLO] em [RETORNO_TOTAL_EXEMPLO] (Einstein chamou de força mais poderosa do universo)"
  - "A técnica de negociação que fez Trump pagar 50% menos em um acordo de [ACORDO_DE_GRANDE_PORTE]"
  - "Por que sua headline está matando suas conversões — e o ajuste de 3 segundos que pode dobrar seus resultados"
```

### Rule 3: Specificity = Believability

```yaml
principle: "Números específicos aumentam credibilidade"

weak_claims:
  - "Muitas pessoas usam isso"
  - "Funciona rápido"
  - "Economize dinheiro"

strong_claims:
  - "Usado por 47.293 empreendedores em 127 países desde 2019"
  - "Resultados visíveis em 72 horas ou menos"
  - "Economize [ECONOMIA_ANUAL_EXEMPLO] por ano (média dos nossos clientes)"
```

### Rule 4: Use Power Words

```yaml
power_word_categories:
  curiosity:
    - Secreto, Escondido, Revelado
    - Pouco conhecido, Insider, Underground
    - Proibido, Controverso, Banido
    - Censurado, Vazado, Confidencial

  benefit:
    - Garantido, Comprovado, Testado
    - Científico, Certificado, Oficial
    - Research-backed, Aprovado, Premiado
    - Best-seller, Líder, Top-rated

  speed:
    - Instantâneo, Imediato, Rápido
    - Overnight, Hoje, Agora
    - Em minutos, Expresso, Turbo
    - Breakthrough, Acelerado

  ease:
    - Simples, Fácil, Automático
    - Done-for-you, Plug-and-play
    - Passo-a-passo, Infalível
    - Turnkey, Pronto, Template

  exclusivity:
    - Elite, Exclusivo, VIP
    - Privado, Membros-only
    - Inner-circle, Privilegiado
    - Limitado, Raro, Primeiro
```

### Rule 5: Address Objections Pre-emptively

```yaml
principle: "Incorpore handling de objeções no próprio bullet"

without_objection_handling:
  - "Como perder 9kg"

with_objection_handling:
  - "Como perder 9kg sem abrir mão de carboidratos, fazer cardio, ou passar fome"

objection_connectors:
  - "sem [sacrifício]"
  - "mesmo que [objeção]"
  - "ainda que [limitação]"
  - "independente de [circunstância]"
  - "não importa se [condição]"
```

### Rule 6: Create "Information Debt"

```yaml
principle: "O leitor deve sentir que PRECISA saber"

example: |
  "O único alimento que você come todo dia que está
  secretamente envenenando seu metabolismo (e o que
  comer no lugar)"

information_debt_created:
  - "Qual é o alimento?"
  - "Estou comendo isso?"
  - "O que devo comer em vez?"

result: "O leitor PRECISA resolver essa incerteza"
```

### Rule 7: Make Each Bullet Stand Alone

```yaml
principle: "Cada bullet deve funcionar independentemente"

test: |
  Se você remover todos os outros bullets,
  esse único bullet ainda criaria desejo?

checklist:
  - "[ ] Faz sentido sem contexto anterior?"
  - "[ ] Promete benefício completo?"
  - "[ ] Cria curiosidade própria?"
  - "[ ] Seria clicável como headline de ad?"
```

### Rule 8: Layer Your Bullets

```yaml
principle: "Organize bullets para máximo impacto"

structure:
  opening: "Bullets mais fortes (hook)"
  middle_early: "Bullets de curiosidade (engagement)"
  middle: "Bullets de benefício (valor)"
  middle_late: "Bullets de prova (credibilidade)"
  closing: "Bullets fortes novamente (fechamento)"

ratio_suggestion:
  power_bullets: "20% (início e fim)"
  curiosity_bullets: "25% (espalhados)"
  benefit_bullets: "35% (corpo principal)"
  proof_bullets: "20% (intercalados)"
```

---

## Phase 5: Blind vs. Naked Bullets

### Blind Bullets (Teasing)

```yaml
definition: "Provoca o benefício SEM revelar COMO conseguir"

examples:
  - "O único alimento que você nunca deve comer depois das 18h..."
  - "Uma frase de 3 palavras que cria rapport instantâneo..."
  - "O maior erro que mata conversões..."

when_to_use:
  - "Lead magnets (revelação após opt-in)"
  - "Descrições de produto (revelação dentro)"
  - "Criar curiosidade irresistível"

structure: "[Benefit tease]... [incomplete]"
```

### Naked/Giveaway Bullets (Revealing)

```yaml
definition: "Revela a informação real"

examples:
  - "Use a técnica de 'pattern interrupt' no início de cada ligação"
  - "Envie seu email de follow-up exatamente 47 horas após a reunião"
  - "Substitua 'eu' por 'você' em toda sua copy"

when_to_use:
  - "Construir confiança através de valor"
  - "Content marketing"
  - "Quando tem TANTO conteúdo que dar um pouco cria desejo por mais"

structure: "[Complete information/tip]"
```

### Half-Blind Bullets (Best of Both)

```yaml
definition: "Dá informação parcial que cria MAIS curiosidade"

examples:
  - "Use a técnica de 'pattern interrupt' — mas apenas NESTE momento específico da conversa..."
  - "A regra das 47 horas para follow-ups (e o subject line específico que gera 73% de abertura)"
  - "Substitua 'eu' por 'você' — mas há UMA exceção que muda tudo..."

when_to_use:
  - "Equilibrar valor com curiosidade"
  - "Demonstrar expertise enquanto vende"
  - "Criar 'vontade de saber mais'"

structure: "[Partial reveal] — mas/e [curiosity hook]..."
```

---

## Phase 6: Bullet Categories by Purpose

### Category 1: Power Bullets
```yaml
purpose: "Máximo impacto para abrir e fechar"
placement: "Início e fim da lista"
percentage: "20% do total"

characteristics:
  - "Benefício mais forte"
  - "Prova mais específica"
  - "Maior gatilho de curiosidade"

example: |
  "O sistema exato de 5 passos que me levou de [PONTO_DE_PARTIDA] a [RESULTADO_TOTAL_EXEMPLO]
  em 18 meses — incluindo os scripts palavra por palavra, templates
  de email, e o único erro que quase custou tudo (página 23)"
```

### Category 2: Curiosity Bullets
```yaml
purpose: "Manter engajamento no meio da lista"
placement: "Espalhados pelo meio"
percentage: "25% do total"

characteristics:
  - "Cria 'PRECISO saber'"
  - "Deixa perguntas sem resposta"
  - "Promete revelações surpreendentes"

example: |
  "Por que o 'trabalhador mais esforçado' quase nunca é
  o maior ganhador — e a verdade contraintuitiva que
  top performers sabem (não é o que você pensa)"
```

### Category 3: Benefit Bullets
```yaml
purpose: "Demonstrar valor concreto"
placement: "Corpo principal da lista"
percentage: "35% do total"

characteristics:
  - "Benefícios tangíveis"
  - "Resultados específicos"
  - "Transformações claras"

example: |
  "Como criar headlines que convertem 3x mais — usando
  a fórmula de 4 elementos que funciona em qualquer nicho"
```

### Category 4: Proof Bullets
```yaml
purpose: "Construir credibilidade"
placement: "Intercalados para sustentar promessas"
percentage: "20% do total"

characteristics:
  - "Números específicos"
  - "Testemunhos/resultados"
  - "Indicadores de autoridade"

example: |
  "Validado por 14.293 usuários em 47 países com 94%
  de taxa de sucesso (e o que os outros 6% fizeram diferente)"
```

---

## Phase 7: Bullet Writing Process

### The 7-Step System

```yaml
step_1_research_deep:
  action: "Colete toda informação sobre o produto"
  collect:
    - "Todas as features"
    - "Todos os benefícios"
    - "Todos os resultados documentados"
    - "Todos os testemunhos"
    - "Todos os elementos únicos"
  minimum: "100+ pontos de informação"

step_2_benefit_ladder:
  action: "Escale cada feature até identidade"
  format: |
    Feature → Vantagem → Benefício → Emoção → Identidade
  for_each: "Cada uma das features coletadas"

step_3_write_raw_bullets:
  action: "Produza volume máximo"
  target: "200+ bullets crus"
  rules:
    - "Não edite enquanto escreve"
    - "Priorize quantidade"
    - "Use todas as fórmulas"

step_4_apply_formulas:
  action: "Passe cada benefício por múltiplas fórmulas"
  formulas_to_try:
    - "How-to bullet"
    - "Secret bullet"
    - "Warning bullet"
    - "Number bullet"
    - "Single bullet"
    - "Quick bullet"
    - "Simple bullet"

step_5_add_specificity:
  action: "Enriqueça cada bullet"
  add:
    - "Números específicos"
    - "Time frames"
    - "Named mechanisms"
    - "Page references"
    - "Testimonial proof"

step_6_test_curiosity:
  action: "Avalie cada bullet"
  questions:
    - "Cria 'PRECISO saber'?"
    - "Pararia meu scroll?"
    - "Passa no 'forehead slapper test'?"

step_7_organize_and_refine:
  action: "Selecione e organize"
  select: "20-50 melhores bullets"
  arrange: "Por categoria (power, curiosity, benefit, proof)"
  position: "Strongest no início e fim"
```

---

## Phase 8: Quality Checklist

### The SPICE Test

```yaml
S_specific:
  questions:
    - "Contém números, datas ou figuras exatas?"
    - "Inclui mecanismo ou técnica nomeada?"
    - "Referencia página, capítulo ou seção específica?"

P_powerful:
  questions:
    - "Usa power words?"
    - "Cria resposta emocional?"
    - "Promete benefício significativo?"

I_intriguing:
  questions:
    - "Cria curiosity gap?"
    - "Faz leitor PRECISAR saber mais?"
    - "Passa no 'forehead slapper test'?"

C_credible:
  questions:
    - "Promessa é acreditável?"
    - "Inclui elemento de prova?"
    - "Endereça potencial ceticismo?"

E_easy_to_read:
  questions:
    - "Escaneável em 3 segundos?"
    - "Sem jargão ou complexidade?"
    - "Benefício visível imediatamente?"
```

### Complete Bullet Audit

```yaml
audit_checklist:
  structure:
    - "[ ] Tem hook que prende atenção"
    - "[ ] Tem specificity (números, páginas)"
    - "[ ] Tem named mechanism (se aplicável)"
    - "[ ] Tem benefit promise clara"
    - "[ ] Tem proof element"
    - "[ ] Tem curiosity amplifier"

  content:
    - "[ ] Fala com dor ou desejo do avatar"
    - "[ ] Usa linguagem do avatar"
    - "[ ] Promessa é realista mas desejável"
    - "[ ] Diferencia de concorrentes"

  style:
    - "[ ] Tom consistente com marca"
    - "[ ] Power words presentes"
    - "[ ] Objeções antecipadas"
    - "[ ] Stand-alone (funciona sozinho)"

  overall:
    - "[ ] Passaria como headline de ad?"
    - "[ ] Criaria 'information debt'?"
    - "[ ] Forehead slapper test?"
```

---

## Phase 9: Copywriter Style Applications

### Gary Bencivenga Style (Fascination Master)
```yaml
characteristics:
  - "Extreme specificity"
  - "Curiosity multiplication"
  - "Page/chapter references"
  - "Mathematical precision"

example_bullets:
  - "O segredo do 'efeito ancoragem' que faz clientes pagarem 3x mais pelo mesmo produto — sem reclamar (página 47)"
  - "Por que 97% dos empreendedores estão precificando errado — e a correção de 5 minutos que pode dobrar sua margem"
  - "A técnica do 'sim escondido' que os melhores negociadores usam para fechar deals 'impossíveis'"

when_to_use: "Alto volume de bullets para sales pages longas"
```

### Eugene Schwartz Style (Sophistication)
```yaml
characteristics:
  - "Historical references"
  - "Discovery framing"
  - "Unique mechanisms"
  - "Elevation of ordinary"

example_bullets:
  - "A descoberta de 1963 que transformou vendedores comuns em fechadores de elite — agora revelada pela primeira vez em português"
  - "Como um contador desconhecido de Ohio descobriu a 'fórmula do preço psicológico' e passou a cobrar 847% a mais"
  - "O único ajuste no seu pitch que instantaneamente separa você de 99% dos concorrentes"

when_to_use: "Mercados sofisticados, posicionamento premium"
```

### Gary Halbert Style (Emotional/Story)
```yaml
characteristics:
  - "Personal story hooks"
  - "Emotional resonance"
  - "Conversational tone"
  - "Before/after drama"

example_bullets:
  - "Como meu pai, um imigrante com 47 dólares no bolso, descobriu uma verdade sobre vendas que mudou nossa família para sempre..."
  - "A carta de 2 páginas que me fez ganhar [RESULTADO_MENSAL_EXEMPLO] em um único mês — e você pode copiar palavra por palavra"
  - "O momento exato em que percebi que estava vendendo do jeito errado por 7 anos — e o que mudou tudo em 48 horas"

when_to_use: "Storytelling, conexão emocional profunda"
```

### Dan Kennedy Style (Urgency)
```yaml
characteristics:
  - "Fear-based triggers"
  - "Deadline urgency"
  - "Direct/aggressive tone"
  - "Loss aversion"

example_bullets:
  - "3 gatilhos de urgência que você DEVE usar antes de fechar qualquer negociação — ignore e perca 67% das vendas"
  - "A razão #1 pela qual prospects dizem 'vou pensar' — e o script de 12 palavras que elimina essa objeção HOJE"
  - "Por que esperar 'o momento certo' está custando [CUSTO_DA_INAÇÃO_EXEMPLO] por mês — e como parar de sangrar dinheiro agora"

when_to_use: "Direct response, deadline-driven offers"
```

### Parris Lampropoulos Style (Bullet Master)
```yaml
characteristics:
  - "Extreme specificity"
  - "Named mechanisms"
  - "Curiosity multipliers"
  - "Misdirection"

example_bullets:
  - "A 'regra dos 3 segundos' que uma dona de casa de 58 anos de Curitiba usou para perder 23kg em 47 dias — comendo pizza toda sexta"
  - "O 'erro invisível' que 94% dos copywriters cometem (e por que corrigi-lo adicionou [RESULTADO_DE_CAMPANHA_EXEMPLO] à minha última campanha)"
  - "Por que o exercício 'mais saudável' está sabotando sua perda de peso — e a alternativa de 4 minutos que funciona 3x melhor"

when_to_use: "Maximum curiosity, health/fitness, long-form sales letters"
```

---

## Phase 10: Output Templates

### Sales Page Bullet Section

```markdown
## Veja Exatamente O Que Você Vai Descobrir Dentro:

### Módulo 1: [Nome do Módulo]

✓ [Power bullet 1 - mais forte]
✓ [Benefit bullet 1]
✓ [Curiosity bullet 1]
✓ [Proof bullet 1]
✓ [Benefit bullet 2]

### Módulo 2: [Nome do Módulo]

✓ [Power bullet 2]
✓ [Benefit bullet 3]
✓ [Benefit bullet 4]
✓ [Curiosity bullet 2]
✓ [Testimonial bullet 1]

[Continue para cada módulo...]

### PLUS Você Também Recebe:

✓ [Bonus bullet 1]
✓ [Bonus bullet 2]
✓ [Bonus bullet 3]
```

### Email Bullets

```markdown
Dentro você vai descobrir:

• [Strong curiosity bullet]
• [Benefit bullet]
• [Proof bullet]
• [Quick win bullet]
• [Power bullet - closes strong]
```

### Value Stack Bullets

```markdown
VOCÊ RECEBE:

☑ [Core product] — Valor: [VALOR_CORE_PRODUCT]
   ✓ [Bullet 1 - o que inclui]
   ✓ [Bullet 2 - o que inclui]

☑ [Bônus 1] — Valor: [VALOR_BÔNUS_1]
   ✓ [O que resolve]

☑ [Bônus 2] — Valor: [VALOR_BÔNUS_2]
   ✓ [O que resolve]

VALOR TOTAL: [VALOR_TOTAL]
HOJE APENAS: [PREÇO_ATUAL]
```

---

## Output Format

```yaml
final_deliverables:
  document_1_raw_bullets:
    name: "Raw Bullets Collection"
    content: "200+ bullets crus antes de seleção"

  document_2_tiered_bullets:
    name: "Tiered Bullet Selection"
    content: |
      TIER 1 (Power): 5-10 bullets
      TIER 2 (Curiosity): 10-15 bullets
      TIER 3 (Benefit): 15-20 bullets
      TIER 4 (Proof): 5-10 bullets

  document_3_formatted_bullets:
    name: "Ready-to-Use Bullets"
    content: "Bullets formatados por seção/módulo"

  document_4_variations:
    name: "Bullet Variations"
    content: "3 versões de cada top bullet"

  document_5_audit:
    name: "Quality Audit Report"
    content: "SPICE test results + recommendations"
```

---

## Quick Reference: Bullet Formulas

```
HOW-TO:      "Como [fazer X] sem [dor Y]"
SECRET:      "O segredo de [resultado] que [grupo] esconde"
WHY:         "Por que [crença] está te impedindo de [resultado]"
NUMBER:      "[X] maneiras/segredos de [resultado]"
WHAT:        "O que [grupo de sucesso] faz para [resultado]"
WHAT NEVER:  "O que NUNCA [fazer] quando [situação]"
MISTAKE:     "O erro que [X%] cometem ao [ação]"
WARNING:     "AVISO: [prática] pode [consequência]"
PROOF:       "[Número] [resultado] em [tempo]"
CURIOSITY:   "A única coisa que separa [você] de [resultado]"
STORY:       "Como [pessoa] [alcançou resultado]"
SPECIFIC:    "Página [X]: [benefício específico]"
TRANSFORM:   "De [atual] para [desejado] em [tempo]"
SINGLE:      "O único [fator] que determina [resultado]"
QUICK:       "[Resultado] em [tempo curto] — mesmo que [objeção]"
SIMPLE:      "Um(a) simples [ajuste] que [resultado impressionante]"
```

---

## Copywriter Recommendations

| Contexto | Copywriter Ideal | Por quê |
|----------|------------------|---------|
| Bullets para vendas (volume) | Gary Bencivenga | Mestre absoluto em fascinations |
| Bullets com curiosidade | Eugene Schwartz | Breakthrough Advertising, níveis de consciência |
| Bullets emocionais/story | Gary Halbert | Conecta feature com emoção |
| Bullets para curso/info | Joe Sugarman | Demonstração lógica de valor |
| Bullets premium/sofisticados | David Ogilvy | Elegância e prova |
| Bullets com urgência | Dan Kennedy | Escassez e ação imediata |
| Bullets para VSL/vídeo | Jon Benson | Formato conversacional |
| Maximum curiosity | Parris Lampropoulos | Bullet mastery, 12-year controls |
| 21 formulas system | Clayton Makepeace | Formulas proven at large scale |

---

*Task Version: 2.0*
*Primary Frameworks: Clayton Makepeace 21 Fascinations, Parris Lampropoulos Bullet Mastery, Gary Bencivenga 8 Rules, Eugene Schwartz Principles*
*Lines: 1400+*
*Research Base: 20+ sources, 40+ bullet formulas documented*
