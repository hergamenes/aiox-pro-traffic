---
task: Create Sales Page Task
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

# Create Sales Page Task

## Metadata

```yaml
task:
  name: Create Sales Page
  id: create-sales-page
  version: "2.0"
  category: copy_creation
  difficulty: advanced
  estimated_phases: 8
  min_output_words: 3000
  primary_agents:
    - eugene-schwartz (TIER 0 - Diagnóstico OBRIGATÓRIO)
    - gary-halbert (Estrutura e Execução)
  supporting_agents:
    - claude-hopkins (Testing Framework)
    - clayton-makepeace (Intensificação)
  research_doc: docs/research/sales-page-methodology-research.md
  dependencies:
    - diagnose-awareness-level.md
    - diagnose-market-sophistication.md
    - create-headlines.md
  checklists:
    - hopkins-audit-checklist.md
    - copy-quality-checklist.md
  templates:
    - sales-page-tmpl.yaml
```

---

## Overview

Esta task guia a criação de sales pages de alta conversão usando metodologias comprovadas de Gary Halbert, Eugene Schwartz e Claude Hopkins.

**CRÍTICO:** O diagnóstico Schwartz (Tier 0) é OBRIGATÓRIO antes de qualquer escrita. Sales pages criadas sem diagnóstico de awareness level têm taxa de falha de 90%+.

---

## PHASE 0: PRE-FLIGHT CHECK

### 0.1 Validação de Inputs Obrigatórios

```yaml
inputs_obrigatorios:
  produto:
    - product_name: "Nome do produto/serviço"
    - product_description: "O que é e o que faz (detalhado)"
    - unique_mechanism: "Como funciona diferentemente"
    - price_point: "Preço e modelo de cobrança"
    - delivery_method: "Como é entregue"

  mercado:
    - target_avatar: "Quem é o cliente ideal (específico)"
    - main_problem: "Problema principal que resolve"
    - awareness_level: "Nível de consciência (1-5)"
    - sophistication_stage: "Estágio de sofisticação (1-5)"
    - competing_solutions: "O que eles já tentaram"

  prova:
    - testimonials: "Depoimentos disponíveis"
    - case_studies: "Casos de sucesso documentados"
    - statistics: "Dados/números comprováveis"
    - credentials: "Autoridade/credenciais"

  oferta:
    - guarantee: "Tipo de garantia oferecida"
    - bonuses: "Bônus inclusos"
    - urgency_reason: "Razão genuína para agir agora"
    - scarcity_element: "Limitação real (se houver)"

inputs_opcionais:
  - tone_preference: "Tom desejado (agressivo, elegante, casual)"
  - copywriter_style: "Estilo de copywriter preferido"
  - page_format: "Long-form, VSL, Híbrido"
  - existing_assets: "Copy ou materiais existentes"
```

### 0.2 Perguntas de Elicitação

Se inputs não foram fornecidos, fazer estas perguntas em ordem:

```yaml
elicitacao_fase_1_produto:
  q1: "Qual é o nome do produto/serviço?"
  q2: "O que exatamente ele faz/entrega? (seja específico)"
  q3: "Qual é o preço e modelo de cobrança?"
  q4: "Como ele funciona DIFERENTEMENTE de outras soluções?"

elicitacao_fase_2_mercado:
  q5: "Quem é o cliente ideal? (idade, profissão, situação)"
  q6: "Qual o problema #1 que ele resolve?"
  q7: "O que seu cliente já TENTOU antes que não funcionou?"
  q8: "Quantos competidores fazem promessas similares?"

elicitacao_fase_3_prova:
  q9: "Tem depoimentos/casos de sucesso disponíveis?"
  q10: "Que números/estatísticas pode citar?"
  q11: "Que credenciais/autoridade você tem?"

elicitacao_fase_4_oferta:
  q12: "Qual a garantia oferecida?"
  q13: "Que bônus estão inclusos?"
  q14: "Há urgência genuína? (deadline, quantidade limitada)"
```

---

## PHASE 1: DIAGNÓSTICO SCHWARTZ (TIER 0 - OBRIGATÓRIO)

### 1.1 Análise de Awareness Level

**EXECUTE:** task diagnose-awareness-level.md

Identifique em qual dos 5 níveis seu mercado está:

```yaml
awareness_diagnostic:
  nivel_5_most_aware:
    sinais:
      - "Já conhecem seu produto especificamente"
      - "Procuram por nome/marca"
      - "Já decidiram comprar, buscam oferta"
    validacao: "Eles pesquisam '[seu produto]' no Google?"

  nivel_4_product_aware:
    sinais:
      - "Conhecem seu produto mas não compraram"
      - "Comparando com alternativas"
      - "Precisam de diferenciação"
    validacao: "Eles já viram seu produto mas não converteram?"

  nivel_3_solution_aware:
    sinais:
      - "Sabem que tipo de solução precisam"
      - "Não conhecem seu produto específico"
      - "Buscando 'melhor [categoria]'"
    validacao: "Eles pesquisam '[tipo de solução]' genérico?"

  nivel_2_problem_aware:
    sinais:
      - "Sentem a dor claramente"
      - "Não sabem que existem soluções"
      - "Reclamam mas não buscam"
    validacao: "Eles falam do problema mas não de soluções?"

  nivel_1_unaware:
    sinais:
      - "Não reconhecem ter um problema"
      - "Em negação ou ignorância"
      - "Não buscam nada relacionado"
    validacao: "Eles nem sabem que precisam de algo?"

awareness_determination:
  resultado: "[IDENTIFICAR NÍVEL 1-5]"
  implicacoes_estrutura: |
    - Nível 5: Copy curta (500-1000 palavras), oferta direta
    - Nível 4: Copy média (1500-3000 palavras), diferenciação
    - Nível 3: Copy longa (3000-5000 palavras), demonstração
    - Nível 2: Copy muito longa (5000-8000 palavras), educação
    - Nível 1: Copy extremamente longa (8000-15000 palavras), storytelling
```

### 1.2 Análise de Market Sophistication

**EXECUTE:** task diagnose-market-sophistication.md

Identifique em qual estágio competitivo o mercado está:

```yaml
sophistication_diagnostic:
  estagio_1_virgin:
    sinais:
      - "Você é o primeiro a oferecer isso"
      - "Nenhum competidor fazendo promessas"
      - "Mercado ainda não explorado"
    estrategia: "Promessa simples e direta"
    headline_style: "Benefício puro"

  estagio_2_second:
    sinais:
      - "Competição inicial surgindo"
      - "Outros fazem promessas similares"
      - "Ainda há espaço para claims diretos"
    estrategia: "Amplie a promessa, quantifique"
    headline_style: "Benefício + especificidade"

  estagio_3_mechanism:
    sinais:
      - "Promessas saturadas"
      - "Mercado cético de claims"
      - "Todos prometem a mesma coisa"
    estrategia: "Introduza MECANISMO ÚNICO"
    headline_style: "COMO funciona (não O QUE)"

  estagio_4_elaborated:
    sinais:
      - "Mecanismos também saturados"
      - "Vários 'como' já apresentados"
      - "Ceticismo alto"
    estrategia: "Elabore o mecanismo (mais rápido, específico)"
    headline_style: "Mecanismo elaborado + credibilização"

  estagio_5_identification:
    sinais:
      - "Mercado exausto"
      - "Já ouviram tudo"
      - "Imunes a promessas e mecanismos"
    estrategia: "Mude para IDENTIFICAÇÃO"
    headline_style: "QUEM usa (não o que faz)"

sophistication_determination:
  resultado: "[IDENTIFICAR ESTÁGIO 1-5]"
  implicacao_headline: "[ESTRATÉGIA DE HEADLINE]"
```

### 1.3 Mapeamento de Desejo Dominante

```yaml
desire_mapping:
  instrucoes: |
    Identifique o desejo pré-existente mais forte no mercado.
    Lembre: você CANALIZA desejo, não CRIA.

  desejos_permanentes:
    - atracao_sexual: "Beleza, desejabilidade, magnetismo"
    - status_social: "Admiração, respeito, inveja dos outros"
    - seguranca_financeira: "Riqueza, independência, liberdade"
    - saude_vitalidade: "Longevidade, energia, juventude"
    - protecao_familia: "Segurança dos filhos, legado"
    - realizacao_pessoal: "Sucesso, conquista, significado"

  formula_poder: |
    Poder do Desejo = Intensidade × Frequência × Universalidade
    - Intensidade: Quão forte é a dor/prazer? (1-10)
    - Frequência: Quantas vezes por dia pensam nisso?
    - Universalidade: Que % do mercado compartilha?

  desejo_dominante_identificado: "[DESEJO PRINCIPAL]"
  conexao_produto: "[COMO SEU PRODUTO SATISFAZ ESSE DESEJO]"
```

### 1.4 Compilação do Diagnóstico

```yaml
diagnostico_completo:
  awareness_level: "[1-5]"
  sophistication_stage: "[1-5]"
  desejo_dominante: "[IDENTIFICADO]"

  implicacoes_estruturais:
    comprimento_recomendado: "[BASEADO EM AWARENESS]"
    headline_strategy: "[BASEADA EM SOPHISTICATION]"
    abertura_tipo: "[BASEADA EM AWARENESS]"
    proof_necessario: "[NÍVEL DE PROVA REQUERIDO]"
```

---

## PHASE 2: PESQUISA E COLETA (80% do trabalho)

### 2.1 Confidential Fact Sheet (Halbert)

```yaml
fact_sheet:
  instrucao: |
    "Nunca escreva copy até saber MAIS sobre o produto que qualquer outra pessoa."
    - Gary Halbert

    Liste TODOS os fatos sobre o produto, sem julgamento.

  secoes:
    sobre_produto:
      - "O que é exatamente?"
      - "Como foi criado/desenvolvido?"
      - "Quem criou e por quê?"
      - "Como funciona passo a passo?"
      - "Quanto tempo leva para funcionar?"
      - "Que resultados específicos produz?"
      - "O que o torna diferente?"
      - "Que problemas pode causar se mal usado?"

    sobre_mercado:
      - "Quem já comprou e por quê?"
      - "Por que outros não compraram?"
      - "O que eles tentaram antes?"
      - "Quanto gastaram em soluções que falharam?"
      - "Que objeções eles têm?"
      - "Que medos os impedem de agir?"
      - "O que eles ganham se funcionar?"
      - "O que eles perdem se não agir?"

    sobre_concorrencia:
      - "Quem mais oferece solução similar?"
      - "Que promessas eles fazem?"
      - "Onde eles falham?"
      - "Por que seu produto é superior?"
      - "Qual o gap que ninguém preenche?"
```

### 2.2 Coleta de Proof Stack

```yaml
proof_collection:
  autoridade:
    lista:
      - "[Credencial 1]"
      - "[Credencial 2]"
      - "[Endosso 1]"
      - "[Menção mídia]"

  demonstracao:
    lista:
      - "[Estudo/pesquisa]"
      - "[Estatística específica]"
      - "[Comparativo mensurável]"

  social:
    lista:
      - "[Testemunho 1 com detalhes]"
      - "[Testemunho 2 com detalhes]"
      - "[Caso de sucesso]"
      - "[Número de clientes]"

  logica:
    lista:
      - "[Explicação do mecanismo]"
      - "[Por que faz sentido]"
      - "[Raciocínio científico]"
```

### 2.3 Mapeamento de Graduação de Crenças

```yaml
graduation_mapping:
  instrucao: |
    "Graduação é construir uma ponte de crenças até a compra inevitável.
    Cada frase deve tornar a próxima inevitável."
    - Eugene Schwartz

    Liste 10 crenças que seu prospect precisa aceitar para comprar.
    Organize em ordem lógica progressiva.

  crencas:
    crenca_1:
      afirmacao: "[Crença atual que já aceitam]"
      tipo: "Ponto de partida"

    crenca_2:
      afirmacao: "[Extensão lógica da crença 1]"
      tipo: "Expansão"

    crenca_3:
      afirmacao: "[Nova perspectiva baseada em 2]"
      tipo: "Reframe"

    crenca_4:
      afirmacao: "[Possibilidade que emerge de 3]"
      tipo: "Abertura"

    crenca_5:
      afirmacao: "[Evidência que suporta 4]"
      tipo: "Prova"

    crenca_6:
      afirmacao: "[Solução como consequência de 5]"
      tipo: "Solução"

    crenca_7:
      afirmacao: "[Seu produto como melhor opção]"
      tipo: "Produto"

    crenca_8:
      afirmacao: "[Urgência de agir agora]"
      tipo: "Timing"

    crenca_9:
      afirmacao: "[Risco de não agir]"
      tipo: "Consequência"

    crenca_10:
      afirmacao: "[Compra como decisão lógica]"
      tipo: "Conclusão inevitável"
```

---

## PHASE 3: ESTRUTURAÇÃO (Halbert Framework)

### 3.1 Seleção de Formato

```yaml
formato_selection:
  baseado_em_awareness:
    nivel_5:
      formato: "Direct Offer Page"
      comprimento: "500-1000 palavras"
      elementos: "Headline, Oferta, CTA, Garantia"

    nivel_4:
      formato: "Comparison Landing"
      comprimento: "1500-3000 palavras"
      elementos: "+ Diferenciação, Prova Social"

    nivel_3:
      formato: "Solution Demo Page"
      comprimento: "3000-5000 palavras"
      elementos: "+ Demonstração do Mecanismo"

    nivel_2:
      formato: "Long-Form Sales Letter"
      comprimento: "5000-8000 palavras"
      elementos: "+ Agitação de Problema Extensa"

    nivel_1:
      formato: "Editorial Sales Letter"
      comprimento: "8000-15000 palavras"
      elementos: "+ Storytelling Educacional"

  formato_selecionado: "[BASEADO NO AWARENESS DIAGNOSTICADO]"
```

### 3.2 Estrutura Halbert Completa

```yaml
estrutura_halbert:
  secao_1_headline:
    objetivo: "PARAR o leitor imediatamente"
    peso: "80% do sucesso"
    tempo_dedicado: "Até uma semana se necessário"
    elementos:
      - headline_principal: "[HEADLINE]"
      - pre_headline: "[PRE-HEADLINE opcional]"
      - subheadline: "[SUBHEADLINE que expande]"

  secao_2_opening_hook:
    objetivo: "Criar o 'greased slide'"
    tecnicas_por_awareness:
      unaware: "História fascinante"
      problem_aware: "Agitação da dor"
      solution_aware: "Promessa da solução"
      product_aware: "Diferenciação imediata"
      most_aware: "Oferta direta"
    tamanho: "2-4 parágrafos"

  secao_3_problem_agitation:
    objetivo: "Build bigger rats before selling rat traps"
    elementos:
      - dor_descrita: "[Descreva a dor vividamente]"
      - consequencias: "[O que acontece se não resolver]"
      - identificacao: "[Mostre que você entende]"
      - twist_knife: "[Intensifique a dor]"
    tamanho: "Varia por awareness (maior para níveis baixos)"

  secao_4_solution_bridge:
    objetivo: "Transição natural para a solução"
    elementos:
      - esperanca: "[Introduza possibilidade]"
      - descoberta: "[Como você encontrou/criou]"
      - diferenciacao: "[Por que é diferente]"

  secao_5_product_presentation:
    objetivo: "Apresentar o produto como herói"
    elementos:
      - nome_produto: "[Nome]"
      - o_que_e: "[Descrição clara]"
      - como_funciona: "[Mecanismo]"
      - para_quem: "[Avatar ideal]"

  secao_6_benefits_intensification:
    objetivo: "Fazer SENTIR a transformação"
    niveis:
      - primarios: "[Benefícios principais]"
      - secundarios: "[Benefícios adicionais]"
      - terciarios: "[Status, admiração]"
    tecnica: "Processo de 7 passos Schwartz"

  secao_7_proof_stack:
    objetivo: "Eliminar todo ceticismo"
    ordem:
      - autoridade: "[Credenciais, endossos]"
      - demonstracao: "[Estudos, dados]"
      - social: "[Testemunhos, casos]"
      - logica: "[Explicação do mecanismo]"

  secao_8_offer:
    objetivo: "Fazer irresistível"
    elementos:
      - produto_principal: "[Valor: $X]"
      - bonus_1: "[Descrição] - Valor: $Y"
      - bonus_2: "[Descrição] - Valor: $Z"
      - bonus_3: "[Descrição] - Valor: $W"
      - valor_total: "$[SOMA]"
      - preco_hoje: "$[PREÇO]"
      - economia: "$[DIFERENÇA]"

  secao_9_guarantee:
    objetivo: "Remover todo risco"
    tipo: "[30/60/90 dias | Resultado ou reembolso | Dobro de volta]"
    copy: "[Texto da garantia]"

  secao_10_urgency:
    objetivo: "Forçar decisão AGORA"
    tipo: "[Tempo | Quantidade | Bônus expirando]"
    razao_genuina: "[Por que o limite existe]"
    deadline: "[Data/quantidade específica]"

  secao_11_cta:
    objetivo: "Dizer EXATAMENTE o que fazer"
    elementos:
      - instrucao_clara: "[Clique no botão abaixo para...]"
      - botao_texto: "[TEXTO DO BOTÃO]"
      - micro_commitment: "[Próximo passo único]"

  secao_12_ps:
    objetivo: "Segunda chance de venda"
    ps_1: "[Restate benefício principal]"
    ps_2: "[Urgência/escassez]"
    ps_3: "[Bônus surpresa ou garantia reforçada]"
```

---

## PHASE 4: HEADLINE CREATION

### 4.1 Geração de Headlines por Sophistication Stage

```yaml
headline_generation:
  estagio_1_virgem:
    formula: "Promessa direta"
    exemplos:
      - "[Benefício Principal]!"
      - "[Resultado] Garantido"

  estagio_2_segundo:
    formula: "Promessa quantificada"
    exemplos:
      - "[Resultado] em [Tempo]"
      - "[Número]x [Benefício]"

  estagio_3_mecanismo:
    formula: "Novo mecanismo"
    exemplos:
      - "O [Mecanismo] Que [Resultado]"
      - "Como [Mecanismo Único] [Benefício]"

  estagio_4_elaborado:
    formula: "Mecanismo elaborado"
    exemplos:
      - "[Mecanismo] + [Especificidade] + [Credencial]"
      - "O Sistema [Nome] de [X] Passos Que [Resultado] em [Tempo]"

  estagio_5_identificacao:
    formula: "Identificação com avatar"
    exemplos:
      - "Para [Avatar Específico] Que [Situação/Desejo]"
      - "[Avatar]: [Pergunta/Afirmação Identitária]"
```

### 4.2 Fórmulas Halbert de Headline

```yaml
formulas_halbert:
  how_to:
    formula: "How to [RESULTADO] in [TEMPO] even if [OBJEÇÃO]"
    variacao_1: "[GERAR]"
    variacao_2: "[GERAR]"
    variacao_3: "[GERAR]"

  attention:
    formula: "Attention [AVATAR]: [PROMESSA ESPECÍFICA]"
    variacao_1: "[GERAR]"
    variacao_2: "[GERAR]"
    variacao_3: "[GERAR]"

  who_else:
    formula: "Who Else Wants [BENEFÍCIO]?"
    variacao_1: "[GERAR]"
    variacao_2: "[GERAR]"
    variacao_3: "[GERAR]"

  secret:
    formula: "The Secret of [RESULTADO INVEJÁVEL]"
    variacao_1: "[GERAR]"
    variacao_2: "[GERAR]"
    variacao_3: "[GERAR]"

  warning:
    formula: "Warning: Don't [AÇÃO] Until You Read This"
    variacao_1: "[GERAR]"
    variacao_2: "[GERAR]"
    variacao_3: "[GERAR]"
```

### 4.3 Seleção de Headline Principal

```yaml
headline_selection:
  criterios_halbert_test:
    - "Faria EU parar para ler?"
    - "É específico o suficiente?"
    - "Promete benefício claro?"
    - "Fala direto com self-interest?"
    - "É credível?"

  headline_vencedor: "[HEADLINE SELECIONADO]"
  subheadline: "[SUBHEADLINE DE SUPORTE]"
  headline_reserva_1: "[PARA A/B TEST]"
  headline_reserva_2: "[PARA A/B TEST]"
```

---

## PHASE 5: COPY WRITING

### 5.1 Opening Hook

```yaml
opening_hook:
  tipo_selecionado: "[BASEADO EM AWARENESS]"

  templates_por_tipo:
    story_hook:
      estrutura: |
        [Momento específico no tempo]
        [Situação relatável]
        [Tensão/problema]
        [Promessa de resolução]

    question_hook:
      estrutura: |
        [Pergunta que acerta na dor]
        [Expansão da dor]
        [Promessa de resposta]

    shocking_fact_hook:
      estrutura: |
        [Estatística/fato surpreendente]
        [Implicação pessoal]
        [Promessa de solução]

    pain_agitation_hook:
      estrutura: |
        [Descrição vívida da dor]
        [Identificação: "Você sabe como é"]
        [Promessa de alívio]

  hook_escrito: |
    [ESCREVER HOOK COMPLETO]
```

### 5.2 Problem Agitation (The Twist)

```yaml
problem_agitation:
  principio: "Build bigger rats before selling rat traps"

  elementos:
    dor_atual:
      descricao: |
        [Descreva a dor que sentem AGORA]
        [Use detalhes sensoriais]
        [Faça-os SENTIR, não só entender]

    consequencias_futuras:
      descricao: |
        [O que acontece se não resolver]
        [Pinte o cenário negativo]
        [Mostre a progressão da dor]

    tentativas_falhadas:
      descricao: |
        [O que eles já tentaram]
        [Por que não funcionou]
        [Validate a frustração]

    identificacao:
      descricao: |
        [Mostre que você entende]
        [Compartilhe experiência similar]
        [Crie conexão empática]

  agitation_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.3 Solution Bridge

```yaml
solution_bridge:
  transicao: |
    [De problema para esperança]
    [Introduza a possibilidade]
    [Crie curiosidade sobre a solução]

  descoberta: |
    [Como você encontrou/criou a solução]
    [A jornada até chegar aqui]
    [Por que é diferente de tudo que tentaram]

  bridge_escrito: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.4 Product Presentation

```yaml
product_presentation:
  introducao: |
    [Apresente o produto como o herói]
    [Nome e o que é]
    [Para quem foi criado]

  mecanismo: |
    [COMO funciona (especialmente para Estágio 3+)]
    [Por que esse mecanismo é superior]
    [Prova do mecanismo]

  presentation_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.5 Benefits Intensification (7 Steps Schwartz)

```yaml
benefits_intensification:
  passo_1_core_benefit: |
    [Benefício central apresentado]

  passo_2_dramatize: |
    [Mostre funcionando na vida real]
    [Detalhes vívidos e específicos]

  passo_3_proof: |
    [Evidência que suporta]
    [Números, testemunhos, estudos]

  passo_4_expand: |
    [Benefícios secundários que emergem]
    [Consequências positivas não óbvias]

  passo_5_universalize: |
    [Mostre que funciona para todos]
    [Variedade de situações]

  passo_6_escalate: |
    [Aumente os stakes]
    [Por que é mais importante do que parece]

  passo_7_immediate: |
    [Crie urgência temporal]
    [Por que agir agora]

  intensification_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.6 Proof Stack

```yaml
proof_stack_writing:
  autoridade:
    formato: |
      [Credencial/endosso]
      [Por que isso importa]
      [Citação se disponível]

  demonstracao:
    formato: |
      [Estudo/estatística]
      [Contexto e fonte]
      [Implicação para o leitor]

  social:
    formato: |
      [Testemunho com nome e detalhes]
      [Situação antes]
      [Resultado depois]
      [Aspas diretas]

  logica:
    formato: |
      [Explicação do mecanismo]
      [Por que faz sentido cientificamente]
      [Eliminação de alternativas]

  proof_stack_escrito: |
    [ESCREVER SEÇÃO COMPLETA COM TODOS OS TIPOS]
```

### 5.7 Offer Stack

```yaml
offer_stack_writing:
  introducao: |
    [Transição para a oferta]
    [Contextualize o valor]

  produto_principal:
    nome: "[NOME]"
    descricao: "[O que inclui]"
    valor: "$[VALOR PERCEBIDO]"

  bonus_stack:
    bonus_1:
      nome: "[NOME DO BÔNUS]"
      descricao: "[O que é e por que é valioso]"
      valor: "$[VALOR]"
      conexao: "[Como complementa o produto principal]"

    bonus_2:
      nome: "[NOME DO BÔNUS]"
      descricao: "[O que é e por que é valioso]"
      valor: "$[VALOR]"
      conexao: "[Como resolve problema secundário]"

    bonus_3:
      nome: "[NOME DO BÔNUS]"
      descricao: "[O que é e por que é valioso]"
      valor: "$[VALOR]"
      conexao: "[Como acelera resultados]"

  value_summary:
    valor_total: "$[SOMA]"
    preco_normal: "$[PREÇO CHEIO se aplicável]"
    preco_hoje: "$[PREÇO ATUAL]"
    economia: "$[DIFERENÇA]"

  offer_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.8 Guarantee

```yaml
guarantee_writing:
  tipo_garantia: "[SELECIONADO]"

  templates:
    dinheiro_de_volta:
      copy: |
        [X] Dias de Garantia Incondicional

        Experimente [PRODUTO] por [X] dias completos.
        Se por qualquer razão você não ficar 100% satisfeito,
        basta enviar um email e devolveremos cada centavo.
        Sem perguntas, sem burocracia.

    resultado_ou_reembolso:
      copy: |
        Garantia de Resultado

        Se você [APLICAR O MÉTODO] e não conseguir [RESULTADO],
        devolveremos 100% do seu investimento.
        Simples assim.

    dobro_de_volta:
      copy: |
        Garantia Dobrada

        Estamos tão confiantes que [PRODUTO] vai funcionar
        que se não funcionar para você, devolvemos o DOBRO
        do que você pagou.

  guarantee_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.9 Urgency/Scarcity

```yaml
urgency_writing:
  tipo_urgencia: "[TEMPO | QUANTIDADE | BÔNUS]"
  razao_genuina: "[POR QUE O LIMITE EXISTE]"

  templates:
    tempo:
      copy: |
        Esta oferta especial está disponível apenas até [DATA].
        Depois disso, [CONSEQUÊNCIA: preço sobe / oferta muda].
        [RAZÃO GENUÍNA para o deadline]

    quantidade:
      copy: |
        Apenas [X] vagas disponíveis nesta turma.
        Já são [Y] inscritos.
        Quando atingirmos o limite, a inscrição fecha automaticamente.
        [RAZÃO: qualidade, suporte, capacidade]

    bonus_expirando:
      copy: |
        Os bônus [NOME DOS BÔNUS] estão disponíveis
        apenas para os [X] primeiros que se inscreverem.
        Depois disso, apenas o programa principal será oferecido.

  urgency_escrita: |
    [ESCREVER SEÇÃO COMPLETA]
```

### 5.10 Call to Action

```yaml
cta_writing:
  instrucao_clara: |
    [O que fazer EXATAMENTE]
    [Passo único e simples]

  botao_texto: "[TEXTO DO BOTÃO - Action-oriented]"

  reforco: |
    [Lembre o benefício principal]
    [Reforce a garantia]
    [Minimize percepção de risco]

  cta_escrito: |
    [ESCREVER CTA COMPLETO]
```

### 5.11 P.S. Section

```yaml
ps_writing:
  ps_1:
    foco: "Restate benefício principal"
    copy: |
      P.S. - Lembre-se: [BENEFÍCIO PRINCIPAL em uma frase]

  ps_2:
    foco: "Urgência/escassez"
    copy: |
      P.P.S. - [URGÊNCIA: deadline ou quantidade]

  ps_3:
    foco: "Bônus surpresa ou garantia"
    copy: |
      P.P.P.S. - [BÔNUS ADICIONAL ou reforço de garantia]
```

---

## PHASE 6: BULLETS E FASCINATIONS

### 6.1 Geração de Bullets

```yaml
bullets_generation:
  formulas:
    curiosity_gap:
      formula: "[Benefício surpreendente]... (página X)"
      bullets:
        - "[GERAR]"
        - "[GERAR]"
        - "[GERAR]"

    forbidden_fruit:
      formula: "O [coisa] 'proibido' que [autoridades] não querem que você saiba"
      bullets:
        - "[GERAR]"
        - "[GERAR]"

    benefit_ease:
      formula: "Como [grande benefício] com apenas [pequeno esforço]"
      bullets:
        - "[GERAR]"
        - "[GERAR]"
        - "[GERAR]"

    negative_reversal:
      formula: "Como parar de [coisa ruim]"
      bullets:
        - "[GERAR]"
        - "[GERAR]"

    specific_number:
      formula: "[Número específico] [coisas] que [resultado]"
      bullets:
        - "[GERAR]"
        - "[GERAR]"
        - "[GERAR]"

    how_to_without:
      formula: "Como [resultado desejado] sem [obstáculo comum]"
      bullets:
        - "[GERAR]"
        - "[GERAR]"
        - "[GERAR]"

  bullets_finais: |
    [LISTA DE 15-25 BULLETS SELECIONADOS]
```

---

## PHASE 7: REVISÃO (Halbert Test)

### 7.1 Aplicar Halbert Test Completo

```yaml
halbert_test:
  1_simplicidade:
    pergunta: "É SIMPLES? (nível de 5ª série)"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  2_clareza:
    pergunta: "É CLARO? (uma ideia por frase)"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  3_headline:
    pergunta: "O headline PRENDE?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  4_beneficios:
    pergunta: "Os benefícios são ÓBVIOS?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  5_oferta:
    pergunta: "A oferta é IRRESISTÍVEL?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  6_urgencia:
    pergunta: "Há URGÊNCIA real?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  7_cta:
    pergunta: "O CTA é CLARO?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  8_fluxo:
    pergunta: "FLUI como escorregador de graxa?"
    resultado: "[PASS/FAIL]"
    ajustes: "[SE NECESSÁRIO]"

  resultado_geral: "[X/8 PASS]"
```

### 7.2 Read Aloud Test

```yaml
read_aloud_test:
  instrucao: |
    Leia toda a sales page em voz alta.
    Marque onde você:
    - Tropeçou nas palavras
    - Perdeu o fôlego
    - Ficou confuso
    - Parou naturalmente

  pontos_problematicos:
    - "[LOCAL 1]: [PROBLEMA]"
    - "[LOCAL 2]: [PROBLEMA]"

  ajustes_realizados:
    - "[AJUSTE 1]"
    - "[AJUSTE 2]"
```

---

## PHASE 8: PREPARAÇÃO PARA TESTE (Hopkins)

### 8.1 Variantes para A/B Test

```yaml
ab_test_preparation:
  headlines:
    control: "[HEADLINE PRINCIPAL]"
    challenger_1: "[VARIANTE 1]"
    challenger_2: "[VARIANTE 2]"

  leads:
    control: "[OPENING HOOK PRINCIPAL]"
    challenger_1: "[VARIANTE]"

  ctas:
    control: "[CTA PRINCIPAL]"
    challenger_1: "[VARIANTE]"

  metricas_a_medir:
    - "Click-through rate (headline)"
    - "Scroll depth"
    - "Time on page"
    - "Conversion rate"
    - "Revenue per visitor"
```

### 8.2 Testing Calendar

```yaml
testing_calendar:
  semana_1:
    teste: "Headlines A/B"
    metricas: "CTR, Scroll depth"
    duracao: "7 dias ou 1000 visitors"

  semana_2:
    teste: "Leads A/B (com headline vencedor)"
    metricas: "Time on page, Scroll depth"
    duracao: "7 dias ou 1000 visitors"

  semana_3:
    teste: "CTAs A/B"
    metricas: "Conversion rate"
    duracao: "7 dias ou significância estatística"

  ongoing:
    processo: "Beat the control constantemente"
    frequencia: "Novo teste a cada 2-4 semanas"
```

---

## OUTPUT FORMAT

### Estrutura de Entrega

```yaml
output:
  formato: markdown

  secoes_obrigatorias:
    1_diagnostico:
      - awareness_level
      - sophistication_stage
      - desejo_dominante

    2_headline_variations:
      - headline_principal
      - subheadline
      - 3_alternativas_para_teste

    3_sales_page_completa:
      - todas_as_secoes_escritas
      - estrutura_halbert_completa

    4_lead_variations:
      - lead_principal
      - 2_alternativas

    5_cta_variations:
      - cta_principal
      - 2_alternativas

    6_bullets:
      - 15-25_bullets_finais

    7_copywriter_notes:
      - justificativa_das_escolhas
      - pontos_de_atencao
      - recomendacoes_de_teste
```

---

## QUALITY CHECKLIST

### Final Quality Gate

```yaml
quality_checklist:
  diagnostico:
    - [ ] Awareness level identificado e documentado
    - [ ] Sophistication stage identificado
    - [ ] Desejo dominante mapeado
    - [ ] Estrutura adequada ao awareness

  headline:
    - [ ] Passa no Halbert Test
    - [ ] Específico (não genérico)
    - [ ] Promete benefício claro
    - [ ] 3+ variantes para teste

  estrutura:
    - [ ] Todas as 12 seções presentes
    - [ ] Graduação de crenças lógica
    - [ ] Fluxo como "greased slide"

  prova:
    - [ ] 4 tipos de prova presentes
    - [ ] Específico > genérico
    - [ ] Testemunhos com detalhes

  oferta:
    - [ ] Value stack completo
    - [ ] Garantia clara
    - [ ] Urgência genuína

  cta:
    - [ ] Instrução clara e única
    - [ ] Botão action-oriented
    - [ ] Mínima fricção

  teste:
    - [ ] Variantes preparadas
    - [ ] Métricas definidas
    - [ ] Calendar de teste planejado
```

---

## AGENT RECOMMENDATIONS BY CONTEXT

### Quando Usar Cada Agente

```yaml
agent_recommendations:
  sempre_primeiro:
    agente: "eugene-schwartz"
    motivo: "Diagnóstico OBRIGATÓRIO de awareness e sophistication"
    comando: "*awareness + *sophistication"

  execucao_principal:
    agente: "gary-halbert"
    motivo: "Estrutura e escrita de sales letter"
    comando: "*sales-page"

  mercado_saturado:
    agente: "clayton-makepeace"
    motivo: "Intensificação visceral para mercados céticos"
    comando: "*intensify"

  teste_e_otimizacao:
    agente: "claude-hopkins"
    motivo: "Framework científico de teste"
    comando: "*audit-copy-hopkins"

  bullets_e_fascinations:
    agente: "gary-bencivenga ou parris-lampropoulos"
    motivo: "Especialistas em bullets de alta conversão"
```

---

*Task Version: 2.0*
*Primary Agents: Eugene Schwartz (Diagnóstico), Gary Halbert (Execução)*
*Supporting: Claude Hopkins (Testing), Clayton Makepeace (Intensification)*
*Min Output: 3000 words*
*Research Doc: sales-page-methodology-research.md*

---

# ═══════════════════════════════════════════════════════════════════════════
# CONTEÚDO EXTRAÍDO DAS FONTES PRIMÁRIAS - HALBERT SWIPE FILE ANALYSIS
# Data: 2026-01-23 | Enrichment Phase ENR-006
# Fonte: outputs/minds/gary_halbert/sources/swipe/PDF/ (90+ sales letters)
# Fonte: outputs/minds/gary_halbert/sources/gary_halbert_knowledge_extract.md
# ═══════════════════════════════════════════════════════════════════════════

## Exemplos Reais de Sales Letters (Halbert Swipe)

### Análise de 5 Cartas Icônicas do Halbert Swipe File

A coleção de swipe files do Gary Halbert contém 90+ sales letters reais que geraram milhões de dólares em vendas. Abaixo está a análise estrutural das cartas mais famosas.

---

### 1. The Coat of Arms Letter (A mais famosa)

**Fonte:** `Coat of Arms Letter by Gary Halbert » Swipe File Archive.pdf`

**Contexto:** Carta de direct mail que vendeu mais de 7 milhões de dólares em pesquisas de brasões de família.

**Estrutura Identificada:**

```yaml
headline:
  tipo: "Personalização extrema"
  copy_exata: |
    "An Important Message For The [SOBRENOME] Family"
  tecnica: "Usa o nome do prospect no envelope e na carta"

opening_hook:
  tipo: "Curiosity + Identificação"
  estrutura: |
    [Menção direta ao sobrenome do leitor]
    [História do brasão da família]
    [Conexão com nobreza/herança]
    [Promessa de descoberta]
  principio: "Apela ao desejo de identidade e pertencimento"

body:
  elementos_chave:
    - "História fascinante da origem dos sobrenomes"
    - "Conexão do sobrenome específico com nobreza"
    - "Descrição visual do brasão"
    - "Senso de exclusividade e raridade"

proof:
  tipo: "Autoridade genealógica"
  elementos:
    - "Pesquisa de registros históricos"
    - "Referências a documentos antigos"
    - "Autenticidade do brasão"

offer:
  estrutura:
    - "Pesquisa completa da história do sobrenome"
    - "Brasão autêntico em moldura"
    - "Certificado de autenticidade"
    - "Preço acessível ([PREÇO_DE_ENTRADA_EXEMPLO])"

close:
  tipo: "Urgência por escassez percebida"
  copy: |
    "Esta oferta está disponível apenas para famílias [SOBRENOME]
    que respondem a esta carta."

ps:
  foco: "Reforço do benefício emocional"
  copy: |
    "P.S. - Imagine a reação da sua família quando virem
    o brasão [SOBRENOME] pendurado na parede..."
```

**Lições Extraídas:**
1. Personalização EXTREMA aumenta response rate dramaticamente
2. Apelar para IDENTIDADE é mais forte que benefícios funcionais
3. História/storytelling vende melhor que features
4. Preço baixo + alto valor percebido = conversão

**[Fonte: Coat of Arms Letter by Gary Halbert, Swipe File Archive]**

---

### 2. The Famous Dollar Letter

**Fonte:** `Famous Dollar Letter by Gary Halbert » Swipe File Archive.pdf`

**Contexto:** Uma das cartas mais copiadas da história do direct mail. Usava uma nota de $1 colada ao topo.

**Estrutura Identificada:**

```yaml
attention_device:
  tipo: "Grabber físico"
  elemento: "Nota de $1 dólar colada no topo da carta"
  principio: |
    "Você não pode jogar fora uma carta com dinheiro
    sem pelo menos ler para descobrir por que está lá."

headline:
  tipo: "Curiosidade + Explicação do grabber"
  copy_exata: |
    "As you can see, I've attached a nice, crisp one dollar bill
    to the top of this letter."

opening_hook:
  tipo: "Pattern interrupt + Explicação"
  estrutura: |
    [Reconhecer o elemento incomum (o dólar)]
    [Explicar por que está ali]
    [Criar curiosidade sobre o resto]
  copy_modelo: |
    "There's a reason for this...
    You see, I'm about to reveal something to you
    that could be worth a LOT more than one dollar."

body:
  transicoes_chave:
    - "De 'por que o dólar' para 'o que você ganha'"
    - "De problema para solução"
    - "De ceticismo para prova"

close:
  tipo: "Reciprocidade + CTA claro"
  principio: |
    "Você me deu o favor de ler. Eu te dei um dólar.
    Agora, deixe-me mostrar como você pode ganhar muito mais..."
```

**Lições Extraídas:**
1. GRABBERS físicos aumentam open rate de 2% para 90%+
2. Explicar o "por quê" do elemento incomum cria confiança
3. Reciprocidade funciona (dei algo, agora você lê)
4. Transição suave do grabber para a oferta é crítica

**[Fonte: Famous Dollar Letter by Gary Halbert, Swipe File Archive]**

---

### 3. Double The Size of Your Business Letter

**Fonte:** `Double The Size of Your Business Letter by Gary Halbert » Swipe File Archive.pdf`

**Contexto:** Carta B2B que vendia consultoria de marketing para empresários.

**Estrutura Identificada:**

```yaml
headline:
  tipo: "Promessa quantificada + Avatar específico"
  copy_modelo: |
    "How To Double The Size Of Your Business
    In The Next 12 Months Or Less"

opening_hook:
  tipo: "Identificação com dor do empresário"
  estrutura: |
    [Descrever a frustração do empresário]
    [Listar o que já tentaram]
    [Validar que não é culpa deles]
    [Prometer nova perspectiva]

body_structure:
  secao_1_problema:
    titulo: "O problema real (que ninguém te conta)"
    elementos:
      - "Por que marketing tradicional falha"
      - "O erro que 99% dos empresários cometem"
      - "O custo oculto de não saber isso"

  secao_2_solucao:
    titulo: "A descoberta que mudou tudo"
    elementos:
      - "Como descobri este sistema"
      - "Por que funciona quando outros falham"
      - "Resultados de clientes reais"

  secao_3_mecanismo:
    titulo: "O Sistema de [X] Passos"
    elementos:
      - "Passo 1: [Ação específica]"
      - "Passo 2: [Ação específica]"
      - "Passo 3: [Ação específica]"
      - "Por que a ordem importa"

proof_stack:
  ordem:
    - "Caso de sucesso 1 (com números)"
    - "Caso de sucesso 2 (diferente indústria)"
    - "Caso de sucesso 3 (similar ao prospect)"
    - "Credenciais do autor"
    - "Garantia de resultado"

close:
  tipo: "Escolha binária"
  copy_modelo: |
    "Você tem duas escolhas agora:
    1. Continuar fazendo o mesmo e esperando resultados diferentes
    2. Pegar o telefone, ligar para [NÚMERO] e descobrir
       exatamente como dobrar seu negócio este ano"
```

**Lições Extraídas:**
1. B2B copy precisa validar que o prospect não é "burro"
2. Mecanismo em "passos" aumenta credibilidade
3. Múltiplos casos de sucesso > um testemunho forte
4. "Escolha binária" no close força decisão

**[Fonte: Double The Size of Your Business Letter by Gary Halbert, Swipe File Archive]**

---

### 4. The "Brink of Suicide" Letter

**Fonte:** `Brink of Suicide Letter by Gary Halbert » Swipe File Archive.pdf`

**Contexto:** Carta extremamente emocional que vendia programa de recuperação financeira.

**Estrutura Identificada:**

```yaml
headline:
  tipo: "Drama + Identificação extrema"
  principio: |
    "Começa com o ponto mais baixo possível
    para criar contraste máximo com a transformação"

opening_hook:
  tipo: "Confissão vulnerável"
  estrutura: |
    [Admitir momento de desespero]
    [Detalhes específicos e vívidos]
    [Ponto de virada]
    [Promessa de que existe saída]
  nota: |
    "Halbert frequentemente começava com vulnerabilidade extrema
    para criar conexão emocional imediata"

body_emotional_journey:
  fase_1_fundo_do_poço:
    elementos:
      - "Descrição vívida do desespero"
      - "Pensamentos específicos da época"
      - "O que quase fez (mas não fez)"

  fase_2_ponto_de_virada:
    elementos:
      - "O momento exato que tudo mudou"
      - "A descoberta inesperada"
      - "O primeiro raio de esperança"

  fase_3_transformacao:
    elementos:
      - "Primeiros resultados"
      - "Crescimento gradual"
      - "Situação atual (contraste extremo)"

  fase_4_universalizacao:
    elementos:
      - "Outros que passaram pelo mesmo"
      - "Por que funciona para qualquer um"
      - "O convite para a jornada"

close:
  tipo: "Mão estendida"
  copy_modelo: |
    "Se você está onde eu estava...
    eu ENTENDO.
    E eu quero te mostrar a mesma saída que encontrei."
```

**Lições Extraídas:**
1. Vulnerabilidade EXTREMA cria conexão impossível de ignorar
2. Jornada do herói funciona em sales letters
3. Contraste "antes/depois" precisa ser dramático
4. "Eu estive lá" é mais poderoso que "eu posso ajudar"

**[Fonte: Brink of Suicide Letter by Gary Halbert, Swipe File Archive]**

---

### 5. The Beverly Hills Formula Letter

**Fonte:** `Beverly Hills Formula Ad by Gary Halbert » Swipe File Archive.pdf`

**Contexto:** Carta que vendia produto de clareamento dental, usando aspiração de status.

**Estrutura Identificada:**

```yaml
headline:
  tipo: "Aspiração + Localização de status"
  copy_modelo: |
    "The Beverly Hills Secret To A
    Million-Dollar Smile"
  tecnica: |
    "Associar produto com local aspiracional (Beverly Hills)
    transforma commodity em item de luxo acessível"

opening_hook:
  tipo: "Insider secret"
  estrutura: |
    [O que celebridades fazem que você não sabe]
    [Por que seus dentes parecem perfeitos]
    [O segredo que custava $3,000 até agora]
    [Como você pode ter acesso por uma fração]

body_status_appeal:
  secao_1:
    titulo: "O que Hollywood sabe"
    elementos:
      - "Nomes de celebridades (sem endosso direto)"
      - "Descrição do que fazem"
      - "Por que era inacessível"

  secao_2:
    titulo: "A fórmula que eles usam"
    elementos:
      - "Ingredientes específicos"
      - "Como funciona (simplificado)"
      - "Por que é diferente de tudo que você tentou"

  secao_3:
    titulo: "Agora disponível para você"
    elementos:
      - "Como conseguimos acesso"
      - "Por que estamos oferecendo"
      - "O que vai mudar para você"

proof:
  tipos_usados:
    - "Fotos antes/depois"
    - "Testemunhos de 'pessoas normais'"
    - "Comparativo de preço com tratamento profissional"
    - "Garantia de satisfação"

close:
  tipo: "Aspiração + Urgência"
  copy_modelo: |
    "Imagine entrar em uma sala e todos notarem
    seu sorriso antes de qualquer outra coisa.
    É isso que um sorriso de Beverly Hills faz.
    E você pode ter o seu em [X] semanas."
```

**Lições Extraídas:**
1. Associação com LOCAL de status vende mais que benefício puro
2. "Segredo de [grupo aspiracional]" é fórmula poderosa
3. Transformar commodity em "acesso exclusivo" aumenta valor percebido
4. Visualização do resultado social (admiração) > resultado funcional

**[Fonte: Beverly Hills Formula Ad by Gary Halbert, Swipe File Archive]**

---

## Estrutura Comum Identificada nas Sales Letters (Halbert Pattern)

### Outline Universal Extraído de 90+ Letters

```yaml
estrutura_halbert_padrao:
  fase_1_pre_headline:
    opcional: true
    funcao: "Qualificar leitor ou criar curiosidade"
    exemplos:
      - "ATTENTION: [Avatar específico]"
      - "READ THIS ONLY IF..."
      - "[Data] - [Local]"

  fase_2_headline:
    obrigatorio: true
    caracteristicas:
      - "Benefício específico e quantificável"
      - "Ou curiosidade irresistível"
      - "Nunca genérico"
    tempo_dedicado: "Até 50% do tempo total de escrita"

  fase_3_opening_hook:
    tamanho: "2-4 parágrafos"
    funcao: "Criar o 'greased slide'"
    tipos_mais_usados:
      - "História pessoal"
      - "Fato surpreendente"
      - "Pergunta provocativa"
      - "Declaração controversa"

  fase_4_problema:
    nome_halbert: "Build bigger rats before selling rat traps"
    elementos:
      - "Descrição vívida da dor"
      - "Consequências de não resolver"
      - "Validação ('não é sua culpa')"
      - "O 'twist the knife'"

  fase_5_transicao:
    funcao: "Ponte entre problema e solução"
    frases_tipicas:
      - "Mas então algo mudou..."
      - "Foi quando eu descobri..."
      - "Existe uma forma diferente..."

  fase_6_solucao:
    elementos:
      - "Apresentação do produto/serviço"
      - "Como funciona (mecanismo)"
      - "Por que é diferente"
      - "Para quem é (e para quem NÃO é)"

  fase_7_beneficios:
    formato: "Bullets ou parágrafos curtos"
    niveis:
      - "Primários (funcionais)"
      - "Secundários (emocionais)"
      - "Terciários (status/admiração)"

  fase_8_proof:
    ordem_preferida:
      - "Testemunhos com detalhes específicos"
      - "Estudos/dados (se disponíveis)"
      - "Credenciais do autor"
      - "Explicação lógica do mecanismo"

  fase_9_oferta:
    elementos:
      - "Produto principal + valor"
      - "Bônus 1, 2, 3 + valores"
      - "Valor total vs. preço hoje"
      - "Ancoragem de preço"

  fase_10_garantia:
    tipos_usados:
      - "30/60/90 dias sem risco"
      - "Dobro do dinheiro de volta"
      - "Resultado ou reembolso"
    posicao: "Logo após o preço"

  fase_11_urgencia:
    tipos:
      - "Tempo limitado"
      - "Quantidade limitada"
      - "Bônus expirando"
    regra: "SEMPRE ter razão genuína"

  fase_12_cta:
    caracteristicas:
      - "Instrução EXATA do que fazer"
      - "Uma ação única e clara"
      - "Repetido 2-3 vezes na carta"

  fase_13_ps:
    funcao: "Segunda chance de venda (muito lido)"
    estrutura_tipica:
      - "P.S. - Restate benefício principal"
      - "P.P.S. - Urgência/escassez"
      - "P.P.P.S. - Bônus surpresa ou garantia"
```

**[Fonte: Análise de estrutura comum em outputs/minds/gary_halbert/sources/swipe/PDF/]**

---

## Opening Hooks Extraídos dos Swipes (Padrões)

### 8 Tipos de Opening Hooks Identificados

```yaml
opening_hooks_halbert:
  tipo_1_historia_pessoal:
    quando_usar: "Awareness níveis 1-2"
    estrutura: |
      [Momento específico no tempo]
      [Eu estava [situação relatável]]
      [Então [algo inesperado aconteceu]]
      [O que descobri mudou tudo...]
    exemplo_swipe: "Brink of Suicide Letter"

  tipo_2_fato_surpreendente:
    quando_usar: "Awareness nível 3"
    estrutura: |
      [Estatística chocante ou fato pouco conhecido]
      [Por que isso importa para VOCÊ]
      [O que isso significa para [sua situação]]
    exemplo_swipe: "Beverly Hills Formula"

  tipo_3_pergunta_provocativa:
    quando_usar: "Awareness níveis 2-3"
    estrutura: |
      [Pergunta que acerta na dor]
      [Expansão da pergunta]
      [Promessa de que há resposta]
    swipe_files:
      - "Amazing Diet Secrets"
      - "How To Live To Be 110"

  tipo_4_confissao:
    quando_usar: "Quando credibilidade é questionada"
    estrutura: |
      [Admissão de algo inesperado]
      [Por que estou te contando isso]
      [O que isso significa para você]
    exemplo_swipe: "Marketing Genius Who Is Afraid To Fly"

  tipo_5_insider_secret:
    quando_usar: "Mercados saturados (Sophistication 3+)"
    estrutura: |
      [O que [grupo exclusivo] sabe]
      [Por que não é público]
      [Como você pode ter acesso]
    swipe_files:
      - "Beverly Hills Formula"
      - "Donna Mills Little-Known Secrets"

  tipo_6_pattern_interrupt:
    quando_usar: "Quando precisar de atenção imediata"
    estrutura: |
      [Elemento físico ou visual incomum]
      [Explicação de por que está ali]
      [Transição para a mensagem]
    exemplo_swipe: "Famous Dollar Letter"

  tipo_7_identificacao_direta:
    quando_usar: "Avatar muito específico"
    estrutura: |
      [Se você é [avatar específico]...]
      [E você [situação específica]...]
      [Então esta carta foi escrita para VOCÊ]
    swipe_files:
      - "Coat of Arms Letter"
      - "Attention: Veterans"

  tipo_8_promessa_direta:
    quando_usar: "Awareness níveis 4-5"
    estrutura: |
      [Promessa clara e específica]
      [Em [timeframe] você vai [resultado]]
      [E aqui está como...]
    exemplo_swipe: "Double The Size of Your Business"
```

**[Fonte: Análise de padrões em gary_halbert_knowledge_extract.md, seção "Frameworks & Techniques"]**

---

## Closes e CTAs Reais Extraídos (Padrões)

### 6 Tipos de Closes Identificados

```yaml
closes_halbert:
  tipo_1_escolha_binaria:
    estrutura: |
      "Você tem duas escolhas agora:
      1. [Opção de inação com consequência negativa]
      2. [Ação com benefício claro]
      A escolha é sua."
    quando_usar: "Prospects indecisos"

  tipo_2_mao_estendida:
    estrutura: |
      "Eu estive exatamente onde você está.
      Eu sei como é.
      E eu quero te ajudar a [resultado].
      Tudo que você precisa fazer é [ação simples]."
    quando_usar: "Produtos de transformação pessoal"

  tipo_3_escassez_genuina:
    estrutura: |
      "[Número específico] pessoas já responderam.
      Quando atingirmos [limite], esta oferta fecha.
      [Razão genuína para o limite]
      Não quero que você perca esta oportunidade."
    quando_usar: "Ofertas com limite real"

  tipo_4_reciprocidade:
    estrutura: |
      "Eu te dei [algo de valor] nesta carta.
      Agora, tudo que peço é que você [ação mínima].
      Se funcionar para você como funcionou para [outros],
      você vai me agradecer."
    quando_usar: "Após dar valor gratuito"

  tipo_5_visualizacao_futura:
    estrutura: |
      "Imagine daqui a [tempo]:
      [Descrição vívida da vida transformada]
      [Contraste com a situação atual]
      [O único passo entre você e essa realidade]"
    quando_usar: "Produtos aspiracionais"

  tipo_6_garantia_reversa:
    estrutura: |
      "Você não arrisca NADA.
      Eu assumo TODO o risco.
      Se não funcionar, você recebe [garantia].
      O único risco é NÃO tentar."
    quando_usar: "Sempre, especialmente para céticos"
```

### P.S. Sections - Padrões Extraídos

```yaml
ps_patterns:
  ps_1_beneficio:
    funcao: "Restate o benefício principal"
    formato: |
      "P.S. - Lembre-se: [benefício em uma frase].
      [Reforço emocional]."

  ps_2_urgencia:
    funcao: "Criar pressão temporal"
    formato: |
      "P.P.S. - Esta oferta expira em [data/prazo].
      Depois disso, [consequência]."

  ps_3_bonus_surpresa:
    funcao: "Adicionar valor inesperado"
    formato: |
      "P.P.P.S. - Quase esqueci! Se você [ação] hoje,
      também vou incluir [bônus] absolutamente grátis."

  ps_4_prova_social:
    funcao: "Eliminar ceticismo final"
    formato: |
      "P.S. - [Nome] de [Local] disse:
      '[Testemunho curto e poderoso]'"
```

**[Fonte: Padrões identificados em gary_halbert_knowledge_extract.md e análise de títulos do swipe file]**

---

## Transitions Entre Seções (Conectores Halbert)

### Frases de Transição Extraídas

```yaml
transicoes_problema_para_solucao:
  frases:
    - "Mas então algo mudou..."
    - "Foi quando eu descobri..."
    - "E é aí que fica interessante..."
    - "Mas aqui está a boa notícia..."
    - "Felizmente, existe uma forma diferente..."
    - "O que eu vou te contar agora mudou tudo para mim..."

transicoes_solucao_para_oferta:
  frases:
    - "E é por isso que criei..."
    - "Apresento a você..."
    - "Agora, pela primeira vez..."
    - "E aqui está como você pode ter acesso..."

transicoes_prova_para_cta:
  frases:
    - "Então a pergunta é simples..."
    - "Agora você tem uma escolha..."
    - "O próximo passo é seu..."
    - "Tudo que você precisa fazer é..."

transicoes_objecao_para_garantia:
  frases:
    - "Eu sei o que você está pensando..."
    - "Você pode estar se perguntando..."
    - "E se não funcionar para mim?"
    - "É por isso que ofereço..."
```

**[Fonte: Padrões de conectores em gary_halbert_knowledge_extract.md, seção "Communication Style Analysis"]**

---

## Templates Baseados em Letters Reais Analisadas

### Template 1: Estilo Coat of Arms (Personalização + Identidade)

```markdown
# TEMPLATE: Personalização Extrema (Estilo Coat of Arms)

## Pré-Headline
Uma Mensagem Importante Para [NOME/GRUPO ESPECÍFICO]

## Headline
O [ITEM] da [Família/Grupo] [NOME] Finalmente Disponível

## Opening Hook (Identificação)
Querido(a) [NOME],

Você sabia que [fato fascinante sobre a identidade do prospect]?

[Expansão da história/conexão]

[Por que isso importa para VOCÊ especificamente]

## Body (História + Prova)
[História do item/serviço]
[Por que é especial para este grupo]
[Prova de autenticidade]

## Oferta
Por apenas $[PREÇO], você recebe:
- [Item principal]
- [Certificação/autenticidade]
- [Personalização]

## Close (Exclusividade)
Esta oferta está disponível APENAS para [GRUPO ESPECÍFICO]
que receberam esta carta.

## P.S. (Visualização)
P.S. - Imagine [resultado emocional]...

---
**Baseado em:** Coat of Arms Letter by Gary Halbert
**Melhor para:** Produtos que apelam para identidade, herança, pertencimento
```

### Template 2: Estilo Dollar Letter (Grabber + Reciprocidade)

```markdown
# TEMPLATE: Grabber Físico (Estilo Dollar Letter)

## Elemento Físico
[Algo de valor colado/anexado - pode ser metafórico em digital]

## Headline (Explicação do Grabber)
Como você pode ver, eu [descreva o elemento incomum]...

## Opening Hook (Explicação)
Existe uma razão para isso...

Você vê, eu estou prestes a revelar algo que vale
MUITO mais do que [o elemento].

## Body (Transição para valor)
[Explicação de por que fez isso]
[O que você vai ganhar lendo]
[Prova do valor que vai receber]

## Close (Reciprocidade)
Eu te dei [elemento]. Você me deu sua atenção.
Agora, deixe-me mostrar como [resultado maior]...

## P.S.
P.S. - O [elemento] é seu, independente do que decidir.
Mas se você [ação], vai descobrir que valeu muito mais
do que imaginava.

---
**Baseado em:** Famous Dollar Letter by Gary Halbert
**Melhor para:** Cold outreach, quando precisa de atenção imediata
```

### Template 3: Estilo Transformação (Vulnerabilidade + Jornada)

```markdown
# TEMPLATE: Jornada de Transformação (Estilo Brink of Suicide)

## Headline (Drama + Esperança)
De [Situação Terrível] Para [Resultado Incrível]:
A História Que [Avatar] Precisa Ouvir

## Opening Hook (Confissão Vulnerável)
Eu preciso te contar algo que nunca contei publicamente...

[Momento específico de desespero]
[Detalhes vívidos e específicos]
[O que quase aconteceu]

## Ponto de Virada
Mas então, em [data/momento específico], algo mudou...

[A descoberta inesperada]
[O primeiro raio de esperança]

## Transformação
Hoje, [tempo depois], minha vida é completamente diferente:

[Resultado 1]
[Resultado 2]
[Resultado 3]

## Universalização
E a melhor parte? Não sou especial.

[Exemplos de outros que fizeram o mesmo]
[Por que funciona para qualquer um]

## Oferta (Mão Estendida)
Se você está onde eu estava...
Eu ENTENDO.
E eu quero te mostrar a mesma saída.

[Descrição do produto/serviço]

## Close
Você não precisa continuar sofrendo.
A saída existe. Eu sou a prova viva.
[CTA]

## P.S.
P.S. - Eu queria que alguém tivesse me mostrado isso
[X tempo] atrás. Teria economizado [consequência].
Não deixe isso acontecer com você.

---
**Baseado em:** Brink of Suicide Letter by Gary Halbert
**Melhor para:** Produtos de transformação pessoal, recuperação, superação
```

### Template 4: Estilo Insider (Status + Segredo)

```markdown
# TEMPLATE: Insider Secret (Estilo Beverly Hills)

## Pre-headline
O Que [Grupo Aspiracional] Não Quer Que Você Saiba

## Headline
O Segredo de [Local/Grupo de Status] Para [Resultado Desejado]

## Opening Hook (Insider)
Você já se perguntou por que [grupo aspiracional]
sempre parece ter [característica invejável]?

Não é genética. Não é sorte.
É um segredo que custava $[preço alto] até agora.

## Body (Revelação)
[O que o grupo faz]
[Por que funciona]
[Por que era inacessível]

## Democratização
Pela primeira vez, você pode ter acesso ao mesmo
[método/produto] que [grupo] usa...

Por uma fração do preço.

## Oferta
[Produto] - O Mesmo [Método] de [Local de Status]

Antes: $[preço alto] em [local exclusivo]
Agora: $[seu preço] no conforto da sua casa

## Close (Aspiração)
Imagine [visualização do resultado social]...
É isso que [método de status] faz.
E você pode ter o seu em [timeframe].

## P.S.
P.S. - [Celebridade/figura] não nasceu com isso.
Eles simplesmente sabiam o segredo antes de você.
Agora você também sabe.

---
**Baseado em:** Beverly Hills Formula by Gary Halbert
**Melhor para:** Produtos de beleza, saúde, lifestyle, status
```

---

## Lista Completa de Swipe Files Disponíveis (90+ Letters)

### Para Referência e Estudo Futuro

```yaml
swipe_files_disponiveis:
  path: "outputs/minds/gary_halbert/sources/swipe/PDF/"
  total: "68 arquivos PDF"

  categorias:
    dinheiro_negocios:
      - "Amazing Money Making Secrets Ad"
      - "Box-Tops Into Gold Ad"
      - "Double The Size of Your Business Letter"
      - "Key West College of Millionaires Ad"
      - "Lost Money Secret Ad"
      - "Make Money With Your Credit Cards Ad"

    saude_beleza:
      - "57 Year-Old Swimsuit Model Ad"
      - "Amazing Diet Secrets Ad"
      - "Berry Trim Ad"
      - "Beverly Hills Formula Ad"
      - "China Health Secret Ad"
      - "Colon Cleanse Salesletter"
      - "Cure Baldness Ad"
      - "Face-Lift-In-A-Jar Ad"
      - "High-Speed Diet Formula Ad"
      - "High-Speed Diet Pill Ad"
      - "How To Live To Be 110 Ad"
      - "Million Dollar Smile Ad"
      - "Rid of Aches & Pain Without A Prescription Ad"
      - "Serious Back Pain Ad"
      - "Youth Returns Instantly Ad"

    relacionamentos:
      - "Attractive Women in Miami Ad"
      - "Better Sex Ad"
      - "Desperate Housewife Scared of Losing Her Husband Ad"
      - "Generous, Creative Businessman Wants To Find A Hot, Sexy Woman Ad"

    investimentos:
      - "320 Secret Way To Get Back Tax Dollars Ad"
      - "Halley's Comet Silver Eagle Ad"
      - "Hottest Investment of The Last 5 Years Ad"
      - "How To Keep Your Money from Being Murdered Ad"
      - "How To Pay Zero Taxes Letter"

    marketing_copywriting:
      - "Free Seminar Of The Century Tapes Sales Letter"
      - "Marketing Genius Who Is Afraid To Fly Ad"
      - "Marketing Miracles Ad"
      - "The Gary Halbert Letter"
      - "The Stand In Line Sales Letter"

    ofertas_gerais:
      - "$2,855 Bribe Letter"
      - "Coat of Arms Letter"
      - "Famous Dollar Letter"
      - "Free Gift Letter"
      - "Brink of Suicide Letter"
      - "Lead Gen Ad"
      - "Nerd From Ohio Ad"
      - "Perfect Counterfeit Diamond Ad"

    governo_beneficios:
      - "Collect $1,000s In Veteran Benefits Ad"
      - "Government Owes You Ad"
      - "Social Security Ad"

  nota: |
    Cada arquivo é um PDF do Swipe File Archive contendo
    a carta original com análise e contexto.
    Usar como referência para estrutura e técnicas específicas.
```

**[Fonte: Listagem de outputs/minds/gary_halbert/sources/swipe/PDF/]**

---

## Como Usar Esta Seção

### Workflow Recomendado

```yaml
uso_pratico:
  passo_1_diagnostico:
    acao: "Determine awareness level e sophistication stage"
    ferramenta: "PHASE 1 deste documento"

  passo_2_selecao_template:
    acao: "Escolha template baseado no contexto"
    opcoes:
      - "Coat of Arms → Identidade/Pertencimento"
      - "Dollar Letter → Cold outreach/Atenção"
      - "Transformação → Produtos de superação"
      - "Insider → Status/Aspiração"

  passo_3_estudo_swipe:
    acao: "Consulte swipe file similar ao seu produto"
    metodo: "Ler a carta original para absorver ritmo e tom"

  passo_4_adaptacao:
    acao: "Adapte estrutura mantendo princípios"
    regra: "Estrutura é fixa, copy é adaptada ao contexto"

  passo_5_revisao:
    acao: "Aplique Halbert Test (PHASE 7)"
    checklist: "8 perguntas de qualidade"
```

---

*Seção adicionada: 2026-01-23*
*Fonte primária: outputs/minds/gary_halbert/sources/swipe/PDF/ (90+ letters)*
*Fonte secundária: outputs/minds/gary_halbert/sources/gary_halbert_knowledge_extract.md*
*Enrichment: ENR-006 - Copy Framework v2.0*
