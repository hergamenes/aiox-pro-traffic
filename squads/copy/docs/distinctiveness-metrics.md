# Métricas de Distintividade - CopywriterOS

## Purpose

Este documento define métricas objetivas para avaliar o quão distintivo é o output de cada copywriter, garantindo que cada agente produza copy reconhecivelmente diferente dos demais.

## Why Distinctiveness Matters

Se dois copywriters produzem output muito similar, eles são redundantes. O valor do CopywriterOS está na **diversidade** de estilos disponíveis.

**Meta:** >50% de distintividade entre qualquer par de copywriters

---

## 1. Métricas Quantitativas

### 1.1 Sentence Length Average (SLA)

**O que mede:** Comprimento médio das sentenças em palavras.

**Como calcular:**
```
SLA = Total de palavras / Número de sentenças
```

**Baselines por copywriter:**

| Copywriter | SLA Target | Range Aceitável |
|------------|-----------|-----------------|
| Gary Halbert | 12-16 | Sentenças curtas, diretas |
| David Ogilvy | 18-24 | Sentenças elaboradas |
| Eugene Schwartz | 16-22 | Variação para ênfase |
| Claude Hopkins | 14-18 | Científico mas acessível |
| Dan Kennedy | 10-14 | Ultra direto, urgente |
| Gary Bencivenga | 8-12 | Bullets curtos |
| Joe Sugarman | 14-20 | Flow conversacional |
| Frank Kern | 10-15 | Casual, fragmentado |
| Jon Benson | 12-18 | Conversacional, emocional |

**Validação:** Se SLA do output está fora do range, copywriter está "out of character".

---

### 1.2 Vocabulary Richness (VR)

**O que mede:** Diversidade de palavras únicas usadas.

**Como calcular:**
```
VR = Palavras únicas / Total de palavras × 100
```

**Baselines:**

| Copywriter | VR Target | Razão |
|------------|----------|-------|
| Gary Halbert | 55-65% | Linguagem simples, repetição estratégica |
| David Ogilvy | 70-80% | Vocabulário sofisticado |
| Eugene Schwartz | 65-75% | Conceitos únicos, menos repetição |
| Claude Hopkins | 60-70% | Técnico mas acessível |
| Dan Kennedy | 50-60% | Repetição para urgência |
| Gary Bencivenga | 65-75% | Fascinations variadas |
| Joe Sugarman | 60-70% | Storytelling variado |
| Frank Kern | 55-65% | Casual, expressões repetidas |
| Jon Benson | 60-70% | Emocional, variado |

---

### 1.3 Power Words Ratio (PWR)

**O que mede:** Frequência de "power words" no copy.

**Power Words Categories:**
- **Urgência:** Agora, Imediato, Hoje, Rápido, Última chance
- **Exclusividade:** Segredo, Revelado, Descoberta, Escondido
- **Benefício:** Grátis, Garantido, Comprovado, Resultados
- **Emoção:** Incrível, Surpreendente, Transformador

**Como calcular:**
```
PWR = Power words / Total de palavras × 100
```

**Baselines:**

| Copywriter | PWR Target | Estilo |
|------------|-----------|--------|
| Gary Halbert | 8-12% | Alto uso para emoção |
| David Ogilvy | 4-6% | Moderado, elegante |
| Eugene Schwartz | 6-9% | Estratégico, big ideas |
| Claude Hopkins | 5-7% | Factual com punch |
| Dan Kennedy | 10-15% | Máximo para urgência |
| Gary Bencivenga | 8-12% | Fascinations potentes |
| Joe Sugarman | 6-9% | Integrado no story |
| Frank Kern | 5-8% | Natural, não forçado |
| Jon Benson | 7-10% | Emocional, curioso |

---

### 1.4 Question Frequency (QF)

**O que mede:** Quantas perguntas por 100 palavras.

**Como calcular:**
```
QF = Número de perguntas / (Total de palavras / 100)
```

**Baselines:**

| Copywriter | QF Target | Razão |
|------------|----------|-------|
| Gary Halbert | 2-4 | Retóricas para engajamento |
| David Ogilvy | 1-2 | Poucas, impactantes |
| Eugene Schwartz | 2-3 | Para níveis de consciência |
| Claude Hopkins | 1-2 | Científico, afirmativo |
| Dan Kennedy | 3-5 | Confrontacional |
| Gary Bencivenga | 1-3 | Em fascinations |
| Joe Sugarman | 2-4 | Conversacional |
| Frank Kern | 4-6 | Muito conversacional |
| Jon Benson | 3-5 | Curiosidade constante |

---

### 1.5 First Person Usage (FPU)

**O que mede:** Frequência de "eu/meu/minha" vs "você/seu/sua".

**Como calcular:**
```
FPU = Pronomes 1ª pessoa / Total de pronomes pessoais × 100
```

**Baselines:**

| Copywriter | FPU Target | Estilo |
|------------|-----------|--------|
| Gary Halbert | 40-50% | Histórias pessoais |
| David Ogilvy | 20-30% | Foco no leitor |
| Eugene Schwartz | 25-35% | Balanceado |
| Claude Hopkins | 15-25% | Científico, objetivo |
| Dan Kennedy | 30-40% | Expert assertivo |
| Gary Bencivenga | 25-35% | Fascinations sobre produto |
| Joe Sugarman | 35-45% | Storytelling pessoal |
| Frank Kern | 45-55% | Muito pessoal |
| Jon Benson | 40-50% | Vulnerabilidade estratégica |

---

## 2. Métricas Qualitativas

### 2.1 Signature Elements Checklist

Cada copywriter tem elementos únicos que DEVEM aparecer:

#### Gary Halbert
- [ ] Abertura "Caro amigo" ou similar
- [ ] História pessoal no lead
- [ ] Urgência natural (não forçada)
- [ ] Garantia ousada
- [ ] PS com hook

#### David Ogilvy
- [ ] Headline com benefício específico + número
- [ ] Provas factuais
- [ ] Tom sofisticado
- [ ] Credibilidade institucional
- [ ] Long-form informativo

#### Eugene Schwartz
- [ ] Big idea central identificável
- [ ] Adequação ao nível de consciência
- [ ] Intensificação gradual
- [ ] Conceito transformador
- [ ] Headline que canaliza desejo existente

#### Claude Hopkins
- [ ] Claim específico e mensurável
- [ ] Oferta clara
- [ ] Elemento testável
- [ ] Linguagem científica acessível
- [ ] Prova de teste

#### Dan Kennedy
- [ ] Deadline inviolável
- [ ] Escassez real
- [ ] Stack de valor explícito
- [ ] CTA agressivo
- [ ] Urgência desde a primeira linha

#### Gary Bencivenga
- [ ] Bullets hipnóticos (3+ por seção)
- [ ] Fascinations com curiosidade
- [ ] Especificidade extrema
- [ ] Edição implacável (zero fluff)
- [ ] Cada linha compra a próxima

#### Joe Sugarman
- [ ] Slippery slide (impossível parar)
- [ ] Trigger psicológico identificável
- [ ] Storytelling fluido
- [ ] Tom conversacional
- [ ] Primeira frase magnética

#### Frank Kern
- [ ] Tom casual/autêntico
- [ ] Storytelling pessoal
- [ ] Valor antes do pitch (70/30)
- [ ] Transição suave para oferta
- [ ] Voz de "amigo que manja"

#### Jon Benson
- [ ] Estrutura VSL (se aplicável)
- [ ] Curiosity loops
- [ ] Apelo ao interesse próprio (Selfish Gene)
- [ ] Vulnerabilidade estratégica
- [ ] Emoção antes de lógica

---

### 2.2 Distinctiveness Score Card

Para cada output, preencher:

```
DISTINCTIVENESS SCORECARD

Copywriter: _______________
Output Type: _______________
Date: _______________

QUANTITATIVE METRICS
┌─────────┬────────┬────────┬────────┐
│ Metric  │ Target │ Actual │ Pass?  │
├─────────┼────────┼────────┼────────┤
│ SLA     │        │        │ [ ]    │
│ VR      │        │        │ [ ]    │
│ PWR     │        │        │ [ ]    │
│ QF      │        │        │ [ ]    │
│ FPU     │        │        │ [ ]    │
└─────────┴────────┴────────┴────────┘

SIGNATURE ELEMENTS: ___/5 presentes

TOTAL SCORE: ___/10 métricas passando

DISTINCTIVENESS: ___% (precisa >50%)
```

---

## 3. Comparação Entre Pares

### Matriz de Distintividade Esperada

Distintividade mínima entre qualquer par de copywriters:

|              | Halbert | Ogilvy | Schwartz | Hopkins | Kennedy | Bencivenga | Sugarman | Kern | Benson |
|--------------|---------|--------|----------|---------|---------|------------|----------|------|--------|
| **Halbert**  | -       | 65%    | 55%      | 60%     | 50%     | 55%        | 45%      | 55%  | 50%    |
| **Ogilvy**   | 65%     | -      | 60%      | 55%     | 70%     | 60%        | 55%      | 65%  | 60%    |
| **Schwartz** | 55%     | 60%    | -        | 55%     | 55%     | 50%        | 50%      | 55%  | 55%    |
| **Hopkins**  | 60%     | 55%    | 55%      | -       | 55%     | 55%        | 50%      | 60%  | 55%    |
| **Kennedy**  | 50%     | 70%    | 55%      | 55%     | -       | 50%        | 55%      | 55%  | 55%    |
| **Bencivenga**| 55%    | 60%    | 50%      | 55%     | 50%     | -          | 45%      | 55%  | 50%    |
| **Sugarman** | 45%     | 55%    | 50%      | 50%     | 55%     | 45%        | -        | 50%  | 50%    |
| **Kern**     | 55%     | 65%    | 55%      | 60%     | 55%     | 55%        | 50%      | -    | 55%    |
| **Benson**   | 50%     | 60%    | 55%      | 55%     | 55%     | 50%        | 50%      | 55%  | -      |

**Pares mais similares (atenção extra):**
- Halbert ↔ Sugarman (45%) - ambos storytellers
- Bencivenga ↔ Sugarman (45%) - ambos long-form
- Halbert ↔ Kennedy (50%) - ambos direct response

**Pares mais distintos:**
- Ogilvy ↔ Kennedy (70%) - elegante vs urgente
- Ogilvy ↔ Kern (65%) - sofisticado vs casual

---

## 4. Processo de Validação

### 4.1 Para Novos Copywriters

Antes de adicionar um novo copywriter:

```
NOVO COPYWRITER VALIDATION CHECKLIST

1. [ ] Definir 5+ signature elements únicos
2. [ ] Estabelecer baselines para todas 5 métricas quantitativas
3. [ ] Calcular distintividade esperada vs todos existentes
4. [ ] Gerar 3 outputs de teste
5. [ ] Medir métricas reais vs targets
6. [ ] Verificar distintividade >50% vs todos existentes
7. [ ] Ajustar agent definition se necessário
8. [ ] Documentar no KB
```

### 4.2 Para Outputs Gerados

Após cada geração:

```
OUTPUT VALIDATION FLOW

1. Gerar copy com copywriter X
2. Calcular métricas quantitativas
3. Verificar signature elements presentes
4. Comparar com baseline do copywriter
5. Se <80% match → flag para revisão
6. Se >80% match → output válido
```

---

## 5. Métricas de Sistema

### 5.1 Overall Distinctiveness Health

```
SYSTEM HEALTH METRICS

Average Distinctiveness: >55% target
Lowest Pair Distinctiveness: >45% minimum
Signature Element Coverage: >80% per copywriter
Metric Compliance: >75% outputs within targets
```

### 5.2 Trending

Track mensalmente:
- Distinctiveness médio do sistema
- Copywriters com mais desvios
- Métricas mais violadas
- Pares com distintividade em queda

---

## 6. Exemplo de Análise Comparativa

### Output A (Gary Halbert) vs Output B (David Ogilvy)

**Mesmo briefing:** Curso de marketing, R$997

**Halbert Output:**
```
SLA: 14 (target: 12-16) ✅
VR: 58% (target: 55-65%) ✅
PWR: 9% (target: 8-12%) ✅
QF: 3.2 (target: 2-4) ✅
FPU: 45% (target: 40-50%) ✅

Signature Elements: 5/5 ✅
- "Caro amigo" opening ✅
- História pessoal ✅
- Urgência natural ✅
- Garantia ousada ✅
- PS com hook ✅
```

**Ogilvy Output:**
```
SLA: 21 (target: 18-24) ✅
VR: 74% (target: 70-80%) ✅
PWR: 5% (target: 4-6%) ✅
QF: 1.5 (target: 1-2) ✅
FPU: 25% (target: 20-30%) ✅

Signature Elements: 5/5 ✅
- Headline com número ✅
- Provas factuais ✅
- Tom sofisticado ✅
- Credibilidade ✅
- Long-form informativo ✅
```

**Distintividade Calculada:**
```
SLA difference: |14 - 21| / avg = 40%
VR difference: |58 - 74| / avg = 24%
PWR difference: |9 - 5| / avg = 57%
QF difference: |3.2 - 1.5| / avg = 72%
FPU difference: |45 - 25| / avg = 57%

Average Distinctiveness: 50% ✅
Signature Element Overlap: 0/5 (completely different)

TOTAL DISTINCTIVENESS: 65% ✅ (above 50% threshold)
```

---

## 7. Red Flags

### Quando Revisar Agent Definition

- [ ] Distintividade <45% com qualquer outro copywriter
- [ ] 3+ métricas consistentemente fora do range
- [ ] Signature elements ausentes em >20% outputs
- [ ] Feedback de usuários sobre "todos parecem iguais"

### Ações Corretivas

1. Revisar agent definition (voice guidelines)
2. Adicionar exemplos mais específicos ao KB
3. Ajustar baselines se necessário
4. Considerar split do copywriter (ex: "Early Ogilvy" vs "Late Ogilvy")

---

*Version: 1.0*
*CopywriterOS - Elite Copywriting Squad*
*Última atualização: 2026-01-15*
