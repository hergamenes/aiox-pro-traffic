---
task: Avatar Research - Pesquisa Profunda de Persona
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Analysis
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
Domain: Strategic
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

# Avatar Research - Pesquisa Profunda de Persona

## Metadata
```yaml
task_id: avatar-research
version: 2.0.0
category: research
tier: TOOL
difficulty: advanced
estimated_time: 4-8 hours
elicit: true
dependencies:
  - checklists/avatar-research-checklist.md
  - templates/avatar-research-template.md
  - docs/research/avatar-research-methodology-research.md
outputs:
  - Documento completo de pesquisa de avatar
  - Empathy Map preenchido
  - Jobs-to-be-Done mapeados
  - Arquitetura da linguagem
  - Crenças aplicáveis para copy
  - Persona document final
methodology:
  - Robert Collier "Enter the Conversation"
  - Empathy Mapping (XPLANE/NNg)
  - Jobs-to-be-Done (Christensen)
  - Voice of Customer (VoC)
  - Psychographic Segmentation
```

---

## Objetivo

Conduzir uma pesquisa profunda de avatar/persona que vai além do demográfico superficial, capturando:

- **Linguagem exata** que o avatar usa (Robert Collier)
- **Jobs funcionais, emocionais e sociais** (JTBD)
- **Dores ocultas** nas entrelinhas (Empathy Mapping)
- **Forças de mudança** (Push/Pull/Anxiety/Habit)
- **Padrões linguísticos** para copy de alta conversão
- **Crenças** que sustentam ou bloqueiam decisões

> "Always enter the conversation already taking place in the customer's mind."
> — Robert Collier

---

## PRÉ-REQUISITOS

### Checklist de Preparação

```markdown
## Antes de Iniciar

### Fontes de Dados Necessárias
- [ ] Acesso a entrevistas/transcrições (mínimo 5-10)
- [ ] Reviews de produto/serviço (mínimo 50)
- [ ] Comentários em redes sociais
- [ ] Tickets de suporte/FAQ
- [ ] Emails de clientes
- [ ] Pesquisas de satisfação anteriores

### Ferramentas
- [ ] Planilha para organizar citações
- [ ] Template de entrevista preparado
- [ ] Gravador/transcritor (se for entrevistar)
- [ ] Template de Empathy Map

### Contexto
- [ ] Produto/serviço definido
- [ ] Categoria/nicho identificado
- [ ] Concorrentes mapeados
```

---

## FASE 1: COLETA DE DADOS

### Step 1.1: Inventário de Fontes

```
elicit: true
question: "Quais fontes de dados você tem disponíveis?"
options:
  - Entrevistas/transcrições de clientes
  - Formulários de onboarding
  - Pesquisas de satisfação (NPS, CSAT)
  - Comentários em redes sociais
  - Mensagens de WhatsApp/Telegram
  - Emails de clientes
  - Transcrições de calls de vendas
  - Reviews de produto (próprio ou concorrentes)
  - Comentários em anúncios
  - Tickets de suporte
  - Fóruns/comunidades do nicho
  - Comentários em vídeos do YouTube
```

### Step 1.2: Matriz de Qualidade de Fontes

| Tipo de Fonte | Espontaneidade | Profundidade | Volume | Prioridade |
|---------------|----------------|--------------|--------|------------|
| Entrevistas 1:1 | Média | Alta | Baixo | ⭐⭐⭐ |
| Reviews espontâneos | Alta | Média | Alto | ⭐⭐⭐ |
| Tickets de suporte | Alta | Média | Alto | ⭐⭐ |
| Pesquisas estruturadas | Baixa | Alta | Médio | ⭐⭐ |
| Comentários sociais | Alta | Baixa | Alto | ⭐ |

**Regra:** Priorize fontes ESPONTÂNEAS sobre SOLICITADAS.

### Step 1.3: Template de Extração de Citações

Para CADA fonte, use este template:

```markdown
## Extração: [Nome da Fonte]

### Metadata
- **Fonte:** [tipo]
- **Data:** [quando coletado]
- **Volume:** [N itens analisados]

### Citações Literais

| # | Citação Exata | Categoria | Emoção | Frequência |
|---|---------------|-----------|--------|------------|
| 1 | "[copiar exatamente como escreveu]" | [dor/desejo/objeção/gatilho] | [emoção identificada] | [Nx similar] |
| 2 | "[copiar exatamente como escreveu]" | [categoria] | [emoção] | [frequência] |

### Padrões Linguísticos Notáveis
- Termo recorrente: "[termo]" (Nx)
- Frase típica: "[frase]"
- Metáfora usada: "[metáfora]"

### Insights Preliminares
1. [insight]
2. [insight]
```

**IMPORTANTE:** Copie LITERALMENTE. Preserve:
- Erros de ortografia
- Pontuação original
- Ênfases (caps, !!!, etc.)
- Emojis se usados

---

## FASE 2: DADOS DEMOGRÁFICOS

### Step 2.1: Coleta Demográfica

| Dado | Como Coletar | Formato de Output |
|------|--------------|-------------------|
| Faixa etária | Formulário/análise | % por faixa (18-24, 25-34, etc.) |
| Gênero | Formulário | % por gênero |
| Estado civil | Formulário | % por estado |
| Filhos | Formulário | % com/sem, idades |
| Profissão | Aberta + categorização | Top 10 ocupações |
| Localização | Formulário | Top 5 regiões/estados |
| Escolaridade | Formulário | % por nível |
| Faixa de renda | Formulário (faixas) | % por faixa |

### Step 2.2: Análise Demográfica

```markdown
## Perfil Demográfico

### Distribuição Etária
| Faixa | % | Observação |
|-------|---|------------|
| 25-34 | 42% | Maioria |
| 35-44 | 31% | Segundo maior |
| 45-54 | 18% | |
| Outros | 9% | |

### Gênero
- Feminino: X%
- Masculino: X%
- Não binário/outro: X%

### Profissões Mais Comuns
1. [profissão] - X%
2. [profissão] - X%
3. [profissão] - X%

### Padrão Demográfico Dominante
"[Descrição do perfil típico em 1-2 frases]"

Exemplo: "Mulher, 28-38 anos, profissional de marketing ou empreendedora,
renda [FAIXA_DE_RENDA_EXEMPLO], sem filhos ou 1 filho pequeno, mora em capitais."
```

### Step 2.3: Dados Faltantes

Liste dados demográficos que ainda precisa coletar:

```markdown
## Dados Pendentes

| Dado | Por que Importante | Como Coletar |
|------|-------------------|--------------|
| [dado] | [justificativa] | [método] |
| [dado] | [justificativa] | [método] |
```

---

## FASE 3: EMPATHY MAPPING

### Step 3.1: Framework Empathy Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                           [NOME DO AVATAR]                          │
│                    "[Quote representativa]"                         │
├─────────────────────────────┬───────────────────────────────────────┤
│          O QUE DIZ          │           O QUE PENSA                 │
│                             │                                       │
│ Citações públicas:          │ Preocupações internas:                │
│ • "[citação 1]"             │ • "[pensamento 1]"                    │
│ • "[citação 2]"             │ • "[pensamento 2]"                    │
│ • "[citação 3]"             │ • "[pensamento 3]"                    │
│                             │                                       │
│ Linguagem típica:           │ Medos não ditos:                      │
│ • [termo/expressão]         │ • [medo 1]                            │
│ • [termo/expressão]         │ • [medo 2]                            │
│                             │                                       │
├─────────────────────────────┼───────────────────────────────────────┤
│          O QUE FAZ          │           O QUE SENTE                 │
│                             │                                       │
│ Comportamentos observados:  │ Frustrações:                          │
│ • [comportamento 1]         │ • [frustração 1]                      │
│ • [comportamento 2]         │ • [frustração 2]                      │
│                             │                                       │
│ Rotinas/Hábitos:            │ Desejos profundos:                    │
│ • [rotina 1]                │ • [desejo 1]                          │
│ • [rotina 2]                │ • [desejo 2]                          │
│                             │                                       │
│ Soluções já tentadas:       │ Emoções dominantes:                   │
│ • [solução 1]               │ • [emoção 1]                          │
│ • [solução 2]               │ • [emoção 2]                          │
└─────────────────────────────┴───────────────────────────────────────┘
```

### Step 3.2: Coleta por Quadrante

#### 3.2.1: O QUE DIZ (Says)

```markdown
## Quadrante: DIZ

### Fontes
- Reviews públicos
- Comentários em redes sociais
- Respostas em pesquisas
- Mensagens para suporte

### Perguntas Guia
- O que dizem para amigos sobre [problema]?
- Como descrevem sua situação?
- Que linguagem usam publicamente?

### Citações Coletadas

| Citação | Fonte | Frequência |
|---------|-------|------------|
| "[citação literal]" | [fonte] | [Nx similar] |
| "[citação literal]" | [fonte] | [Nx similar] |

### Padrões de Linguagem
- Verbo mais usado: [verbo]
- Adjetivo mais usado: [adjetivo]
- Frase recorrente: "[frase]"
```

#### 3.2.2: O QUE PENSA (Thinks)

```markdown
## Quadrante: PENSA

### Fontes
- Entrevistas em profundidade
- Perguntas projetivas ("se um amigo...")
- Análise de buscas Google (autocomplete)
- Diários/journaling compartilhados

### Perguntas Guia
- O que passa pela cabeça às 3h da manhã?
- Quais preocupações não verbaliza?
- O que tem medo de admitir?

### Pensamentos Identificados

| Pensamento | Evidência | Frequência |
|------------|-----------|------------|
| "[pensamento inferido]" | "[citação que evidencia]" | [comum/raro] |
| "[pensamento inferido]" | "[citação que evidencia]" | [comum/raro] |

### Medos Não Verbalizados
1. [medo] - evidência: "[citação]"
2. [medo] - evidência: "[citação]"

### Aspirações Secretas
1. [aspiração] - evidência: "[citação]"
2. [aspiração] - evidência: "[citação]"
```

#### 3.2.3: O QUE FAZ (Does)

```markdown
## Quadrante: FAZ

### Fontes
- Dados comportamentais (analytics)
- Observação etnográfica
- Perguntas sobre rotina em entrevistas
- Histórico de compras/uso

### Perguntas Guia
- O que fazem quando enfrentam [problema]?
- Que workarounds criaram?
- Como é a rotina diária?

### Comportamentos Observados

| Comportamento | Contexto | Frequência |
|---------------|----------|------------|
| [ação específica] | [quando fazem] | [diário/semanal/etc.] |
| [ação específica] | [quando fazem] | [frequência] |

### Soluções Já Tentadas
| Solução | Resultado | Por que Abandonou |
|---------|-----------|-------------------|
| [solução] | [funcionou/não] | "[motivo literal]" |
| [solução] | [funcionou/não] | "[motivo literal]" |

### Rotinas Relevantes
- Manhã: [rotina]
- Trabalho: [rotina]
- Noite: [rotina]
```

#### 3.2.4: O QUE SENTE (Feels)

```markdown
## Quadrante: SENTE

### Fontes
- Linguagem emocional em citações
- Perguntas diretas sobre emoções
- Análise de tom em mensagens
- Momentos de vulnerabilidade em entrevistas

### Perguntas Guia
- Como se sente quando [situação]?
- Qual emoção domina no dia a dia?
- O que te frustra mais?

### Mapa Emocional

| Situação | Emoção | Citação Evidência |
|----------|--------|-------------------|
| [contexto] | [emoção] | "[citação]" |
| [contexto] | [emoção] | "[citação]" |

### Frustrações Principais
1. **[Frustração]** (Xx menções)
   - Citação: "[citação]"
   - Gatilho: [o que causa]

2. **[Frustração]** (Xx menções)
   - Citação: "[citação]"
   - Gatilho: [o que causa]

### Desejos Emocionais
1. Quer sentir: [emoção desejada]
2. Quer evitar sentir: [emoção a evitar]
```

### Step 3.3: Síntese do Empathy Map

```markdown
## Síntese: Empathy Map

### Contradições Identificadas
[O que DIZ vs. o que FAZ]
- Diz: "[citação]"
- Mas faz: [comportamento contraditório]
- Insight: [o que isso revela]

### Tensões Internas
[O que PENSA vs. o que SENTE]
- Pensa: "[pensamento]"
- Mas sente: [emoção contraditória]
- Insight: [o que isso revela]

### Oportunidades de Copy
1. [Oportunidade baseada em contradição]
2. [Oportunidade baseada em tensão]
3. [Oportunidade baseada em gap]
```

---

## FASE 4: JOBS-TO-BE-DONE (JTBD)

### Step 4.1: Mapeamento de Jobs

#### 4.1.1: Jobs Funcionais

```markdown
## Jobs Funcionais

### Pergunta-Chave
"Que tarefa prática você está tentando completar?"

### Formato de Documentação

**Job Statement:**
When I [situação/contexto]
I want to [motivação/ação]
So I can [resultado esperado]

### Jobs Identificados

**Job #1: [Nome descritivo]**
```
When I: [situação]
I want to: [ação]
So I can: [resultado]
```
- Frequência: [diário/semanal/mensal/eventual]
- Importância: [alta/média/baixa]
- Satisfação atual: [1-10]
- Citação: "[citação que evidencia]"

**Job #2: [Nome descritivo]**
```
When I: [situação]
I want to: [ação]
So I can: [resultado]
```
- Frequência: [frequência]
- Importância: [nível]
- Satisfação atual: [1-10]
- Citação: "[citação]"

[Continuar para todos os jobs funcionais identificados]
```

#### 4.1.2: Jobs Emocionais

```markdown
## Jobs Emocionais

### Pergunta-Chave
"Como você quer se SENTIR ao fazer [tarefa]?"

### Jobs Identificados

**Job Emocional #1: [Nome]**
- Emoção desejada: [emoção]
- Estado atual: [como se sente hoje]
- Gap: [distância entre atual e desejado]
- Citação: "[citação]"

**Job Emocional #2: [Nome]**
- Emoção desejada: [emoção]
- Estado atual: [como se sente hoje]
- Gap: [distância]
- Citação: "[citação]"

### Emoções a EVITAR
| Emoção | Situação Gatilho | Citação |
|--------|------------------|---------|
| [emoção] | [quando acontece] | "[citação]" |
```

#### 4.1.3: Jobs Sociais

```markdown
## Jobs Sociais

### Pergunta-Chave
"Como você quer ser PERCEBIDO pelos outros?"

### Jobs Identificados

**Job Social #1: [Nome]**
- Percepção desejada: [como quer ser visto]
- Audiência: [quem importa - chefe, pares, família, etc.]
- Status atual: [como é percebido hoje]
- Citação: "[citação]"

**Job Social #2: [Nome]**
- Percepção desejada: [percepção]
- Audiência: [quem]
- Status atual: [atual]
- Citação: "[citação]"

### Medo de Julgamento
| Medo | De Quem | Impacto na Decisão |
|------|---------|-------------------|
| [medo] | [audiência] | [como afeta] |
```

### Step 4.2: Forças de Progresso

```markdown
## 4 Forças de Progresso

### PUSH (Empurra PARA a mudança)
Problemas com situação atual que motivam buscar novo:

| Força Push | Intensidade | Citação |
|------------|-------------|---------|
| [problema atual] | [alta/média/baixa] | "[citação]" |
| [limitação atual] | [intensidade] | "[citação]" |

### PULL (Puxa PARA o novo)
Magnetismo da nova solução:

| Força Pull | Intensidade | Citação |
|------------|-------------|---------|
| [promessa atrativa] | [alta/média/baixa] | "[citação]" |
| [benefício desejado] | [intensidade] | "[citação]" |

### ANXIETY (Medo do novo)
Preocupações que travam a mudança:

| Ansiedade | Intensidade | Citação |
|-----------|-------------|---------|
| [medo sobre solução] | [alta/média/baixa] | "[citação]" |
| [risco percebido] | [intensidade] | "[citação]" |

### HABIT (Inércia do atual)
Conforto com status quo:

| Hábito/Inércia | Intensidade | Citação |
|----------------|-------------|---------|
| [o que já funciona] | [alta/média/baixa] | "[citação]" |
| [custo de mudar] | [intensidade] | "[citação]" |

### Cálculo de Forças
```
Para mudar: (Push + Pull) > (Anxiety + Habit)

Sua situação:
- Push + Pull = [soma]
- Anxiety + Habit = [soma]
- Status: [favorável/desfavorável à mudança]
```

### Implicações para Copy
- Amplificar Push: [como mostrar mais a dor atual]
- Criar Pull: [como tornar solução mais atrativa]
- Reduzir Anxiety: [garantias/provas necessárias]
- Quebrar Habit: [como mostrar custo de não mudar]
```

### Step 4.3: Timeline de Compra (Switch Interview)

```markdown
## Timeline de Decisão

### Primeiro Pensamento
- **Quando:** [há quanto tempo]
- **Gatilho:** [o que desencadeou]
- **Citação:** "[citação]"

### Pesquisa Passiva
- **Duração:** [quanto tempo nessa fase]
- **O que fez:** [ações]
- **Citação:** "[citação]"

### Pesquisa Ativa
- **Gatilho para agir:** [o que mudou]
- **Onde pesquisou:** [fontes]
- **O que comparou:** [critérios]
- **Citação:** "[citação]"

### Decisão
- **Fator decisivo:** [o que pesou mais]
- **Quase desistiu por:** [obstáculo]
- **O que convenceu:** [elemento final]
- **Citação:** "[citação]"

### Pós-Compra
- **Primeira impressão:** [experiência]
- **Validação:** [o que confirmou a decisão]
- **Citação:** "[citação]"
```

---

## FASE 5: DORES E DESEJOS PROFUNDOS

### Step 5.1: Dores Explícitas

```markdown
## Dores Explícitas (Declaradas)

### Pergunta-Chave
"Qual sua maior dificuldade/frustração com [tema]?"

### Dores Funcionais

| # | Dor | Frequência | Citação Representativa |
|---|-----|------------|------------------------|
| 1 | [dor funcional] | Xx menções | "[citação]" |
| 2 | [dor funcional] | Xx menções | "[citação]" |

### Dores Emocionais

| # | Dor | Frequência | Citação Representativa |
|---|-----|------------|------------------------|
| 1 | [dor emocional] | Xx menções | "[citação]" |
| 2 | [dor emocional] | Xx menções | "[citação]" |

### Dores Sociais

| # | Dor | Frequência | Citação Representativa |
|---|-----|------------|------------------------|
| 1 | [dor social] | Xx menções | "[citação]" |
| 2 | [dor social] | Xx menções | "[citação]" |
```

### Step 5.2: Dores Ocultas (Entrelinhas)

```markdown
## Dores Ocultas (Inferidas)

### Técnica: Leitura nas Entrelinhas
Identificar o que NÃO dizem diretamente, mas fica implícito.

### Template de Análise

| Citação Original | Dor Oculta Inferida | Evidência |
|------------------|---------------------|-----------|
| "[citação com **destaque** no padrão]" | [o que realmente está por trás] | [como chegou a essa conclusão] |

### Dores Ocultas Identificadas

**Dor Oculta #1: [Nome]**
- O que dizem: "[citação superficial]"
- O que realmente sentem: [dor profunda]
- Por que não verbalizam: [razão]
- Frequência: [comum/incomum]

**Dor Oculta #2: [Nome]**
- O que dizem: "[citação]"
- O que realmente sentem: [dor]
- Por que não verbalizam: [razão]
- Frequência: [frequência]

### Síntese das Dores Ocultas
1. A grande dor oculta é [insight]
2. Eles não verbalizam porque [razão]
3. Por trás de [sintoma], está [causa real]
```

### Step 5.3: Desejos e Aspirações

```markdown
## Desejos e Aspirações

### Pergunta-Chave
"Se você pudesse realizar qualquer desejo relacionado a [tema], qual seria?"

### Desejos por Categoria

| Categoria | Menções | Padrão Linguístico |
|-----------|---------|-------------------|
| Liberdade/Autonomia | Xx | "independência", "sem depender de" |
| Reconhecimento | Xx | "ser visto como", "autoridade" |
| Segurança | Xx | "previsível", "estável", "garantia" |
| Crescimento | Xx | "evoluir", "aprender", "dominar" |
| Impacto | Xx | "ajudar pessoas", "legado", "diferença" |

### Top 5 Desejos (por frequência)

**Desejo #1: [Descrição]** (Xx menções)
- Citação representativa: "[citação]"
- Tipo: [funcional/emocional/social]
- Intensidade: [alta/média]

**Desejo #2: [Descrição]** (Xx menções)
- Citação representativa: "[citação]"
- Tipo: [tipo]
- Intensidade: [intensidade]

[Continuar para top 5]

### Transformação Desejada
```
DE: [estado atual em palavras do avatar]
PARA: [estado desejado em palavras do avatar]

Citação que resume: "[citação]"
```
```

### Step 5.4: Pior Cenário vs. Melhor Cenário

```markdown
## Cenários Extremos

### Pior Cenário (O que mais temem)
"Se nada mudar, o que acontece?"

| Medo | Citação | Frequência |
|------|---------|------------|
| [consequência temida] | "[citação]" | Xx |
| [consequência temida] | "[citação]" | Xx |

### Melhor Cenário (Sonho realizado)
"Se tudo der certo, como será?"

| Aspiração | Citação | Frequência |
|-----------|---------|------------|
| [resultado sonhado] | "[citação]" | Xx |
| [resultado sonhado] | "[citação]" | Xx |

### Gap Atual
- Distância percebida: [perto/longe do ideal]
- Principal obstáculo: [o que impede]
- Citação: "[citação]"
```

---

## FASE 6: CRENÇAS E OBJEÇÕES

### Step 6.1: Mapeamento de Crenças

```markdown
## Crenças do Avatar

### Pergunta-Chave
"O que você acredita sobre [tema]? O que defende ou repudia?"

### Categorias de Crenças

#### Crenças sobre Si Mesmo
| Crença | Citação | Impacto |
|--------|---------|---------|
| "[crença]" | "[citação]" | [como afeta decisões] |

#### Crenças sobre o Problema
| Crença | Citação | Impacto |
|--------|---------|---------|
| "[crença]" | "[citação]" | [como afeta] |

#### Crenças sobre Soluções
| Crença | Citação | Impacto |
|--------|---------|---------|
| "[crença]" | "[citação]" | [como afeta] |

#### Crenças sobre o Mercado/Outros
| Crença | Citação | Impacto |
|--------|---------|---------|
| "[crença]" | "[citação]" | [como afeta] |
```

### Step 6.2: Crenças → Aplicação em Copy

```markdown
## Crenças Aplicadas a Copy

### Template de Aplicação

**Crença #1:** "[citação literal da crença]"

**Tipo:** [sobre si/problema/solução/mercado]

**Aplicação em Copy:**
"[Reformulação como gancho/argumento de copy]"

**Exemplo de Uso:**
```
[Parágrafo ou headline usando a crença]
```

---

### Exemplo Completo

**Crença #1:** "Não consigo ser consistente porque minha rotina é caótica"

**Tipo:** Crença sobre si mesmo (limitante)

**Aplicação em Copy:**
Validar a crença primeiro, depois reframe

**Exemplo de Uso:**
```
Se sua rotina é caótica, consistência parece impossível.

Você acorda com uma coisa na cabeça, mas até meio-dia já mudou tudo.
Eu entendo. Minha rotina também era assim.

Mas aprendi que consistência não é sobre rotina perfeita.
É sobre sistemas que funcionam NO CAOS.

[Mecanismo que funciona mesmo com rotina caótica]
```
```

### Step 6.3: Objeções Mapeadas

```markdown
## Objeções de Compra

### Objeções Explícitas (Declaradas)

| Objeção | Frequência | Citação |
|---------|------------|---------|
| "[objeção]" | Xx | "[citação]" |

### Objeções Implícitas (Nas Entrelinhas)

| Objeção | Evidência | Citação |
|---------|-----------|---------|
| "[objeção inferida]" | [como identificou] | "[citação que evidencia]" |

### Framework de Resposta

**Objeção #1:** "[objeção]"

**Categoria:** [preço/tempo/confiança/adequação/timing]

**Resposta Empática:**
```
1. VALIDAR: "[frase que valida a preocupação]"
2. REFRAME: "[nova perspectiva]"
3. PROVA: "[evidência que supera]"
4. AÇÃO: "[próximo passo suave]"
```

**Exemplo de Copy:**
```
[Resposta completa usando linguagem do avatar]
```
```

---

## FASE 7: PSICOGRAFIA

### Step 7.1: Como se Enxergam

```markdown
## Auto-Percepção

### Pergunta-Chave
"Como você se descreve? Quais suas qualidades e defeitos?"

### Padrões de Auto-Descrição

| Citação com **destaque** nos padrões | Categoria |
|-------------------------------------|-----------|
| "Eu me considero bem **esquecido** e algumas vezes **perco o foco**..." | Auto-crítica |
| "Sempre senti que poderia **criar algo inovador**, mas **não consigo sozinho**..." | Potencial frustrado |

### Identidade Percebida
- Se veem como: [descrição]
- Qualidades que valorizam: [lista]
- Defeitos que admitem: [lista]
- Gap identidade atual vs. desejada: [descrição]

### Síntese
1. Se consideram [característica positiva], mas...
2. Sentem que [percepção/frustração]
3. Querem ser vistos como [identidade aspiracional]
```

### Step 7.2: Valores e Prioridades

```markdown
## Valores Core

### Pergunta-Chave
"O que é mais importante para você na vida? Pelo que você luta?"

### Valores Identificados (por frequência)

| Valor | Menções | Citação Representativa |
|-------|---------|------------------------|
| [valor] | Xx | "[citação]" |
| [valor] | Xx | "[citação]" |

### Hierarquia de Valores
1. [valor #1] - inegociável
2. [valor #2] - muito importante
3. [valor #3] - importante
4. [valor #4] - desejável
5. [valor #5] - nice to have

### Conflitos de Valores
| Valor A | vs. | Valor B | Tensão |
|---------|-----|---------|--------|
| [valor] | ↔ | [valor] | [como a tensão se manifesta] |
```

### Step 7.3: Estilo de Vida e Interesses

```markdown
## Estilo de Vida

### Tempo Livre
| Atividade | % | Insight |
|-----------|---|---------|
| [atividade] | X% | [o que revela] |
| [atividade] | X% | [o que revela] |

### Consumo de Conteúdo
| Tipo | Exemplos | Frequência |
|------|----------|------------|
| Livros | [títulos/gêneros] | [frequência] |
| Podcasts | [nomes] | [frequência] |
| YouTube | [canais/temas] | [frequência] |
| Redes | [quais/como usa] | [frequência] |

### Influenciadores/Referências
| Nome | Por que Admira | Citação |
|------|----------------|---------|
| [pessoa] | [razão] | "[citação]" |

### Insight-Chave
"Não é apenas um interesse, [atividade/tema] é um estilo de vida para eles!"
```

---

## FASE 8: ARQUITETURA DA LINGUAGEM

### Step 8.1: Nuvem de Palavras

```markdown
## Análise de Frequência

### Top 30 Termos (por frequência)

| # | Termo | Menções | Contexto Típico |
|---|-------|---------|-----------------|
| 1 | [termo] | 108x | [onde/como usa] |
| 2 | [termo] | 96x | [contexto] |
| 3 | [termo] | 86x | [contexto] |
[continuar até 30]

### Observações
- Termos dominantes indicam: [insight]
- Ausências notáveis: [termos esperados que não aparecem]
```

### Step 8.2: Análise de Radicais

```markdown
## Agrupamento por Radicais

| Radical | Palavras Derivadas | Menções Totais |
|---------|-------------------|----------------|
| Cria- | criar (86), criação (33), criativo (3), criatividade (4) | 126 |
| Organiz- | organizar (41), organizado (5), organização (23) | 69 |
| Ideia | ideia (12), ideias (67) | 79 |
| [radical] | [palavras] | [total] |

### Insight
"O campo semântico de [radical] domina o vocabulário, sugerindo que [interpretação]"
```

### Step 8.3: Análise de Intencionalidade

```markdown
## Análise Profunda por Termo

### [TERMO 1] (Xx menções)

**Se relaciona com:** [palavras que aparecem junto]

**Variações mais usadas:**
- "[frase exata]" (Xx)
- "[frase exata]" (Xx)
- "[frase exata]" (Xx)

**Padrões descobertos:**
- Sempre usam [termo] quando falam de [contexto]
- NUNCA usam [termo] → insight negativo
- Preferem [termo A] sobre [termo B]

**Pergunta-chave:** O que isso revela sobre o avatar?

**Resposta:** [insight profundo]

---

### [TERMO 2] (Xx menções)

[Repetir estrutura]
```

### Step 8.4: Preferências Linguísticas

```markdown
## Guia de Voz do Avatar

### Termos Preferidos vs. Evitados

| ✅ USE | ❌ EVITE | Razão |
|--------|---------|-------|
| "criação de conteúdo" | "produção de conteúdo" | Mais orgânico |
| "organizar" | "estruturar" | Menos formal |
| "fascinado" | "interessado" | Mais emocional |
| [termo] | [termo] | [razão] |

### Estruturas de Frase Típicas
1. "Eu sempre quis [desejo], mas [obstáculo]"
2. "Se pelo menos eu pudesse [ação]"
3. "O problema é que [dor]"
4. "Meu maior medo é [medo]"
5. "[termo]" + "[termo]" (combinações frequentes)

### Tom de Voz
- **Formalidade:** [casual/formal/técnico]
- **Emocionalidade:** [contido/expressivo]
- **Velocidade:** [direto/explicativo]
- **Humor:** [usa/não usa/sarcástico]

### Metáforas Recorrentes
| Metáfora | Contexto | Frequência |
|----------|----------|------------|
| "[metáfora]" | [quando usa] | Xx |
| "[metáfora]" | [quando usa] | Xx |
```

---

## FASE 9: PERGUNTAS DE ENTREVISTA

### Step 9.1: Roteiro de Entrevista Completo

```markdown
## Roteiro de Entrevista Avatar (60 min)

### WARMUP (5 min)
- Agradecer, explicar confidencialidade, pedir gravação
- "Me conta um pouco sobre você e o que você faz"

### CONTEXTO (10 min)
1. "Como é um dia típico na sua vida?"
2. "Quais são suas principais responsabilidades?"
3. "O que ocupa mais seu tempo/energia?"

### PROBLEMA (15 min)
4. "Qual o maior desafio que você enfrenta com [tema]?"
5. "Quando foi a última vez que isso aconteceu? Me conta em detalhes"
6. "Como você se sentiu naquele momento?"
7. "O que você fez para resolver?"
8. "Funcionou? Por que sim/não?"

### SOLUÇÕES ATUAIS (10 min)
9. "O que você usa hoje para [job]?"
10. "O que funciona bem? O que não funciona?"
11. "Já tentou outras soluções? Quais?"
12. "Por que mudou/não mudou?"

### IDEAL (10 min)
13. "Se você pudesse resolver [problema] magicamente, como seria?"
14. "O que mudaria na sua vida se isso acontecesse?"
15. "Quanto você pagaria para ter isso resolvido?"
16. "O que te impede de ter isso hoje?"

### DEEP DIVE (8 min)
- Aplicar 5 Whys em ponto interessante
- Explorar contradições notadas
- Clarificar linguagem específica

### WRAP UP (2 min)
17. "Tem algo que eu deveria ter perguntado mas não perguntei?"
18. "Posso entrar em contato se tiver mais perguntas?"
```

### Step 9.2: Perguntas por Objetivo

```markdown
## Banco de Perguntas

### Para Descobrir DORES
- "O que toma mais tempo do que deveria no seu dia?"
- "Que tarefa você mais procrastina? Por quê?"
- "O que te deixa mais frustrado sobre [área]?"
- "Quando você se sente sobrecarregado?"
- "O que você não conta para as pessoas sobre [problema]?"

### Para Descobrir DESEJOS
- "Se você tivesse 10 horas extras por semana, o que faria?"
- "Que habilidade você gostaria de ter amanhã?"
- "Como você quer se sentir no final do dia?"
- "Como você quer ser visto pelos outros?"
- "Quem você admira e por quê?"

### Para Descobrir GATILHOS
- "O que fez você finalmente decidir buscar uma solução?"
- "Houve um 'estopim' ou foi gradual?"
- "O que você pesquisou antes de comprar?"
- "Em quem você confiou para pedir opinião?"

### Para Descobrir OBJEÇÕES
- "O que quase te fez desistir?"
- "O que te faria devolver/cancelar?"
- "Quais garantias são importantes para você?"
- "O que provaria que funciona?"

### Para Descobrir LINGUAGEM
- "Complete a frase: 'Se pelo menos eu conseguisse...' "
- "O que passa pela sua cabeça às 3h da manhã?"
- "Como você explicaria [problema] para um amigo?"
```

### Step 9.3: Técnicas de Aprofundamento

```markdown
## Técnicas Durante Entrevista

### Eco
Repetir a última palavra como pergunta:
```
Avatar: "Eu fico muito ansioso antes de reuniões"
Você: "Ansioso?"
Avatar: "Sim, meu coração acelera, minhas mãos suam..."
```

### Silêncio
- Fazer pergunta
- Esperar resposta
- NÃO FALAR por 5-10 segundos
- Avatar frequentemente aprofunda sozinho

### "Me Conte Mais"
- "Interessante. Me conte mais sobre isso."
- "Como assim?"
- "O que você quer dizer com [termo]?"
- "Pode dar um exemplo?"

### Contraste
```
"Você disse que [A]. Mas também mencionou [B].
Me ajude a entender como essas duas coisas se conectam."
```

### 5 Whys
```
P1: Por que você quer [solução]?
R1: Para [razão]
→ Por quê?
R2: Porque [razão mais profunda]
→ Por quê?
[Continuar até causa raiz]
```

### Projeção
- "Se um amigo seu tivesse esse problema, o que você aconselharia?"
- "Por que você acha que as pessoas [comportamento]?"
```

---

## FASE 10: SÍNTESE FINAL

### Step 10.1: Persona Document

```markdown
# PERSONA: [NOME]

## Quote Representativa
> "[Citação que resume a essência do avatar]"

---

## IDENTIFICAÇÃO

| Campo | Valor |
|-------|-------|
| Nome | [Nome fictício representativo] |
| Arquétipo | [Descrição em 1 frase] |
| Idade | [faixa típica] |
| Gênero | [distribuição] |
| Profissão | [ocupações comuns] |
| Localização | [regiões] |
| Renda | [faixa] |

---

## JOBS-TO-BE-DONE

### Funcionais
1. [Job funcional principal]
2. [Job funcional secundário]

### Emocionais
1. [Job emocional principal]
2. [Job emocional secundário]

### Sociais
1. [Job social principal]

---

## DORES

### Explícitas (Top 5)
1. **[Dor]** - "[citação]"
2. **[Dor]** - "[citação]"
3. **[Dor]** - "[citação]"
4. **[Dor]** - "[citação]"
5. **[Dor]** - "[citação]"

### Ocultas
1. **[Dor oculta]** - evidência: "[citação]"
2. **[Dor oculta]** - evidência: "[citação]"

---

## DESEJOS

### Declarados
1. [Desejo] - "[citação]"
2. [Desejo] - "[citação]"

### Transformação Final
DE: [estado atual]
PARA: [estado desejado]

---

## CRENÇAS

### Sobre si mesmo
- "[crença]"

### Sobre o problema
- "[crença]"

### Sobre soluções
- "[crença]"

---

## OBJEÇÕES

| Objeção | Resposta |
|---------|----------|
| [objeção 1] | [resposta empática] |
| [objeção 2] | [resposta empática] |

---

## GATILHOS DE COMPRA

1. [Gatilho principal]
2. [Gatilho secundário]
3. [Gatilho terciário]

---

## ARQUITETURA DA LINGUAGEM

### Use Estes Termos
- [termo 1]
- [termo 2]
- [termo 3]

### Evite Estes Termos
- [termo 1]
- [termo 2]

### Frases Típicas
- "[frase 1]"
- "[frase 2]"
- "[frase 3]"

### Tom de Voz
[descrição do tom ideal]

---

## APLICAÇÃO EM COPY

### Headlines Testáveis
1. [headline baseado em dor]
2. [headline baseado em desejo]
3. [headline baseado em curiosidade]

### Hooks para Lead
1. [hook que entra na conversa]
2. [hook com citação literal]

### Bullets
1. [bullet baseado em job]
2. [bullet baseado em medo]
3. [bullet baseado em transformação]
```

### Step 10.2: Checklist de Validação

```markdown
## Checklist Final

### Completude
- [ ] Mínimo 10 entrevistas/fontes analisadas
- [ ] 100+ citações coletadas
- [ ] Todos os quadrantes do Empathy Map preenchidos
- [ ] 3+ Jobs funcionais documentados
- [ ] 2+ Jobs emocionais documentados
- [ ] 1+ Job social documentado
- [ ] 5+ dores explícitas com citações
- [ ] 2+ dores ocultas identificadas
- [ ] 5+ desejos documentados
- [ ] 3+ objeções mapeadas com respostas
- [ ] Gatilhos de compra identificados

### Arquitetura da Linguagem
- [ ] Top 20 palavras-chave mapeadas
- [ ] Frases típicas documentadas
- [ ] Metáforas identificadas
- [ ] Tom de voz definido
- [ ] Guia de termos (use/evite)

### Aplicabilidade
- [ ] 3+ headlines gerados
- [ ] 2+ hooks para lead criados
- [ ] Crenças com aplicação em copy
- [ ] Respostas a objeções prontas

### Validação
- [ ] Persona revisada com dados reais
- [ ] Contradições explicadas
- [ ] Próximos passos definidos
```

---

## OUTPUT FINAL

Ao completar todas as fases, você terá:

1. **Empathy Map Completo** - 4 quadrantes preenchidos com citações
2. **Jobs-to-be-Done** - Funcionais, emocionais, sociais mapeados
3. **Forças de Progresso** - Push, Pull, Anxiety, Habit quantificados
4. **Dores Profundas** - Explícitas e ocultas com frequência
5. **Desejos Categorizados** - Funcionais, emocionais, sociais
6. **Crenças Aplicadas** - Com exemplos de uso em copy
7. **Objeções com Respostas** - Framework empático pronto
8. **Arquitetura da Linguagem** - Vocabulário, frases, tom
9. **Persona Document** - Síntese acionável
10. **Copy Elements** - Headlines, hooks, bullets prontos

---

## TEMPLATES E CHECKLISTS

### Dependências
- **Checklist:** `checklists/avatar-research-checklist.md`
- **Template:** `templates/avatar-research-template.md`
- **Pesquisa:** `docs/research/avatar-research-methodology-research.md`

### Ferramentas Recomendadas
- Planilha de citações (Google Sheets/Airtable)
- Template Empathy Map (Miro/FigJam)
- Gravador de entrevistas (Otter.ai/Fireflies)
- Análise de frequência (WordCloud)

---

## ANTI-PATTERNS

### ❌ Erros Comuns

1. **Parafrasear citações**
   - ERRADO: "Clientes querem mais tempo"
   - CERTO: "Não tenho tempo nem pra respirar" (citação literal)

2. **Pular para soluções**
   - ERRADO: Já pensando em features durante pesquisa
   - CERTO: Foco 100% em entender o problema primeiro

3. **Viés de confirmação**
   - ERRADO: Buscar dados que confirmam hipótese
   - CERTO: Registrar TUDO, inclusive contradições

4. **Amostra enviesada**
   - ERRADO: Só entrevistar clientes satisfeitos
   - CERTO: Incluir insatisfeitos, ex-clientes, não-clientes

5. **Demográficos sem psicográficos**
   - ERRADO: "Mulher, 35 anos, renda X"
   - CERTO: + valores, medos, desejos, linguagem

6. **Pesquisa única**
   - ERRADO: Fazer uma vez e nunca atualizar
   - CERTO: Processo contínuo de coleta e validação

---

## EXEMPLO DE OUTPUT

### Persona: Marina (Criadora de Conteúdo)

**Quote:** "Tenho mil ideias na cabeça, mas não consigo colocar nenhuma em prática"

**Arquétipo:** Criativa sobrecarregada buscando clareza e consistência

**Job Principal:** "When I tenho uma ideia para conteúdo, I want to transformar em post rapidamente, So I can manter consistência sem passar horas"

**Dor #1:** "Passo mais tempo pensando do que fazendo" (47x)

**Desejo #1:** "Quero ter um sistema que funcione mesmo nos dias caóticos" (38x)

**Crença:** "Não sou organizada por natureza" → Copy: "Você não precisa ser organizada. Precisa de um sistema que organize por você."

**Objeção:** "Já tentei mil ferramentas" → Resposta: "Ferramentas não são o problema. Processo é. Aqui está a diferença..."

**Vocabulário:** criar > produzir, organizar > estruturar, ideias > conceitos

---

**Total de Linhas: 1200+**
**Metodologias Integradas: 5** (Collier, Empathy, JTBD, VoC, Psychographics)
**Templates Incluídos: 15+**
**Perguntas de Entrevista: 50+**
