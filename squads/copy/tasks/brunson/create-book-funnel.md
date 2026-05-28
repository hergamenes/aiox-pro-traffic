---
task: Create Book Funnel Task
responsável: @copy-chief
responsavel_type: Agente
atomic_layer: Strategy
Entrada: |
  - briefing do livro, da oferta e do objetivo comercial do funnel
  - contexto de avatar, value ladder, ativos existentes e restrições operacionais
  - provas, métricas, materiais de apoio e referências relevantes para o lançamento
Saída: |
  - estrutura de book funnel alinhada ao framework descrito na task
  - premissas, lacunas de contexto, dependências e próximos passos para execução
Checklist:
  - [ ] Confirmou inputs mínimos antes de executar
  - [ ] Aplicou o framework descrito na task sem inventar contexto
  - [ ] Registrou entregável, riscos, lacunas e handoff de forma explícita
---

# Task: Create Book Funnel (Free + Shipping)

Sistema validado por Russell Brunson com documentação de escala massiva em vendas com 3 livros.

## Metadata

```yaml
task_id: create-book-funnel
version: "1.0"
agent: "@russell-brunson"
elicit: true
output_type: "funnel_structure"
```

## Objetivo

Criar um Book Funnel completo usando a estratégia Free + Shipping, com order bumps, upsells, e follow-up sequence.

## Filosofia

> "O livro NÃO é o produto. O livro é o FUNIL. O objetivo não é lucrar no livro - é adquirir o cliente." - Russell Brunson

## Input Necessário (Elicit)

Antes de criar o funil, preciso das seguintes informações:

### 1. Sobre o Livro
- **Título do livro:**
- **Subtítulo:**
- **Tema principal:**
- **Transformação que o livro promete:**
- **Número de páginas:**
- **Formato:** (físico, digital, ambos)

### 2. Sobre o Autor
- **Nome:**
- **Background/Credenciais:**
- **História de origem:** (como chegou a esse conhecimento)
- **Resultados próprios ou de clientes:**

### 3. Sobre o Avatar
- **Quem é o leitor ideal:**
- **Maior dor/problema:**
- **Maior desejo:**
- **Nível de consciência:** (Schwartz)

### 4. Sobre a Value Ladder
- **O que vem DEPOIS do livro?** (curso, coaching, mastermind, etc.)
- **Preço do próximo nível:**
- **Preço do nível máximo:**

### 5. Sobre Recursos
- **Tem audiobook?** (sim/não)
- **Tem workshop/treinamento gravado?** (sim/não)
- **Tem curso relacionado?** (sim/não)
- **Tem comunidade/grupo?** (sim/não)

---

## Estrutura do Book Funnel

### PÁGINA 1: Sales Page (Free + Shipping)

#### Estrutura Hook, Story, Offer

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOOK SECTION                             │
├─────────────────────────────────────────────────────────────────┤
│ • Headline principal (promessa + curiosidade)                    │
│ • Subheadline (especificar para quem é)                         │
│ • Imagem do livro (3D mockup)                                   │
│ • Badge: "GRÁTIS - Só pague o frete"                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         STORY SECTION                            │
├─────────────────────────────────────────────────────────────────┤
│ • VSL ou carta de vendas                                        │
│   - Problema que você enfrentava                                │
│   - A descoberta/virada                                         │
│   - Resultados que conseguiu                                    │
│   - Por que escreveu o livro                                    │
│ • Epiphany Bridge: sua transformação                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       VALUE STACK SECTION                        │
├─────────────────────────────────────────────────────────────────┤
│ • O que está incluído no livro:                                 │
│   - Capítulo X: [benefício] (Valor: [VALOR_CAPÍTULO_X])         │
│   - Capítulo Y: [benefício] (Valor: [VALOR_CAPÍTULO_Y])         │
│   - Bônus digital: [nome] (Valor: [VALOR_BÔNUS_1])              │
│   - Bônus digital: [nome] (Valor: [VALOR_BÔNUS_2])              │
│ • VALOR TOTAL: [VALOR_TOTAL_PERCEBIDO]                          │
│ • VOCÊ PAGA: [OFERTA_DO_LIVRO] + [FRETE_EXEMPLO]                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     SOCIAL PROOF SECTION                         │
├─────────────────────────────────────────────────────────────────┤
│ • 3-5 testimonials de leitores                                  │
│ • Números: "X cópias vendidas", "Y países"                      │
│ • Logos de mídia/autoridade (se aplicável)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         OFFER SECTION                            │
├─────────────────────────────────────────────────────────────────┤
│ • Resumo da oferta                                              │
│ • Garantia (30 dias, sem perguntas)                             │
│ • CTA: "QUERO MEU LIVRO GRÁTIS"                                 │
│ • Escassez (se aplicável): "Apenas X cópias nessa tiragem"      │
└─────────────────────────────────────────────────────────────────┘
```

#### Preços Recomendados
| Item | Brasil | USA | Internacional |
|------|--------|-----|---------------|
| Livro | Grátis | Free | Free |
| Frete | [FAIXA_FRETE_BR] | [FAIXA_FRETE_US] | [FAIXA_FRETE_INTL] |

---

### CHECKOUT POPUP: Order Bumps

#### Order Bump #1: Audiobook
```
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Audiobook por apenas +[PREÇO_AUDIOBOOK]       │
├─────────────────────────────────────────────────────────────────┤
│ Quer consumir o conteúdo enquanto dirige, treina ou cozinha?    │
│ Adicione a versão em áudio narrada pelo autor.                  │
│                                                                  │
│ • Duração: X horas                                              │
│ • Download imediato                                             │
│ • Bônus: Capítulo extra exclusivo do áudio                      │
│                                                                  │
│ Valor normal: [VALOR_NORMAL_AUDIOBOOK] → Hoje: [PREÇO_AUDIOBOOK] │
└─────────────────────────────────────────────────────────────────┘
```

#### Order Bump #2: Workshop/Training
```
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Workshop [Nome] por apenas +[PREÇO_WORKSHOP]  │
├─────────────────────────────────────────────────────────────────┤
│ Quer implementar ainda mais rápido?                             │
│ Assista ao workshop onde eu aplico os conceitos do livro        │
│ em casos reais, passo a passo.                                  │
│                                                                  │
│ • X horas de treinamento gravado                                │
│ • Templates e ferramentas                                       │
│ • Acesso vitalício                                              │
│                                                                  │
│ Valor normal: [VALOR_NORMAL_WORKSHOP] → Hoje: [PREÇO_WORKSHOP]  │
└─────────────────────────────────────────────────────────────────┘
```

**Conversion target:** 30-50% em order bumps combinados

---

### PÁGINA 2: Upsell #1 (OTO)

```
┌─────────────────────────────────────────────────────────────────┐
│              ESPERA! Oferta Exclusiva Para Novos Leitores        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [Vídeo curto: 3-5 minutos]                                      │
│                                                                  │
│ Parabéns por garantir seu livro!                                │
│                                                                  │
│ Como você acabou de demonstrar que leva [tema] a sério,         │
│ quero te fazer uma oferta que só aparece UMA VEZ.               │
│                                                                  │
│ OFERTA: [Nome do produto complementar]                          │
│                                                                  │
│ Inclui:                                                         │
│ • [Componente 1]                                                │
│ • [Componente 2]                                                │
│ • [Componente 3]                                                │
│ • BÔNUS: [Extra]                                                │
│                                                                  │
│ Valor total: [VALOR_TOTAL_OTO]                                  │
│ Seu investimento AGORA: [PREÇO_OTO]                             │
│                                                                  │
│ [SIM! Adicionar ao meu pedido]   [Não, obrigado]                │
│                                                                  │
│ ⚠️ Esta oferta não será mostrada novamente.                     │
└─────────────────────────────────────────────────────────────────┘
```

**Conversion target:** 10-20%

---

### DOWNSELL #1 (Se recusar OTO #1)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tudo bem! Entendo completamente               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Que tal apenas [versão menor/parcelada]?                        │
│                                                                  │
│ Por apenas [PREÇO_CONTINUIDADE] (ou [PARCELAMENTO_CONTINUIDADE]) │
│                                                                  │
│ [SIM! Quero essa opção]   [Não, só quero o livro]               │
└─────────────────────────────────────────────────────────────────┘
```

---

### PÁGINA 3: Upsell #2 (OTO)

```
┌─────────────────────────────────────────────────────────────────┐
│           Último Passo Para Acelerar Seus Resultados             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [Vídeo: 5-7 minutos]                                            │
│                                                                  │
│ Você está no caminho certo!                                     │
│                                                                  │
│ Para quem quer resultados ainda mais rápidos,                   │
│ temos o [Programa/Curso Principal].                             │
│                                                                  │
│ Este é nosso programa completo de X semanas onde você:          │
│ • [Resultado 1]                                                 │
│ • [Resultado 2]                                                 │
│ • [Resultado 3]                                                 │
│                                                                  │
│ Normalmente: [VALOR_NORMAL_MEMBERSHIP]                          │
│ Para novos leitores: [PREÇO_MEMBERSHIP] (ou [PARCELAMENTO_MEMBERSHIP]) │
│                                                                  │
│ [SIM! Quero acelerar]   [Não, obrigado]                         │
└─────────────────────────────────────────────────────────────────┘
```

**Conversion target:** 5-10%

---

### PÁGINA 4: Thank You Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎉 Parabéns! Pedido Confirmado                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Seu livro está a caminho!                                       │
│                                                                  │
│ RESUMO DO PEDIDO:                                               │
│ • [Livro] - Grátis                                              │
│ • Frete - [FRETE_CHECKOUT]                                      │
│ • [Order bump, se adicionou]                                    │
│ • [Upsell, se adicionou]                                        │
│ ─────────────────────────                                       │
│ TOTAL: [TOTAL_CHECKOUT]                                         │
│                                                                  │
│ PRÓXIMOS PASSOS:                                                │
│ 1. Verifique seu email para confirmação                         │
│ 2. Enquanto espera, acesse [bônus digital]                      │
│ 3. Entre no nosso grupo de leitores: [link]                     │
│                                                                  │
│ Prazo de entrega: X-Y dias úteis                                │
│                                                                  │
│ Dúvidas? suporte@[dominio].com                                  │
│                                                                  │
│ [Compartilhar nas redes] [Indicar um amigo]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Follow-up Email Sequence

### Sequência de 14 Dias

| Dia | Email | Objetivo |
|-----|-------|----------|
| 0 | Confirmação + Boas-vindas | Confirmação e expectativas |
| 1 | Seu livro está a caminho + Dica #1 | Valor enquanto espera |
| 3 | Conteúdo exclusivo | Engajamento |
| 5 | Case study de sucesso | Prova social |
| 7 | Seu livro chegou? + Como usar | Onboarding |
| 9 | Dica #2 do livro | Valor contínuo |
| 11 | Testimonial + Pergunta | Engajamento |
| 14 | Próximo passo (oferta) | Conversão para high-ticket |

### Sequência Dia 14-30 (Oferta High-Ticket)

| Dia | Email | Objetivo |
|-----|-------|----------|
| 14 | Apresentação do programa | Introduzir oferta maior |
| 16 | Case study detalhado | Prova de resultados |
| 18 | FAQ e objeções | Remover fricção |
| 20 | Última chance | Urgência (se aplicável) |
| 21-30 | Nurturing | Relacionamento contínuo |

---

## Checklist de Validação

### Sales Page
- [ ] Headline com hook forte
- [ ] Subheadline específica para o avatar
- [ ] VSL ou carta de vendas completa
- [ ] Stack de valor claro
- [ ] Testimonials relevantes
- [ ] Garantia explícita
- [ ] CTA claro e repetido
- [ ] Preço e frete claros

### Order Bumps
- [ ] Order bump #1 configurado (audiobook ou similar)
- [ ] Order bump #2 configurado (workshop ou similar)
- [ ] Copy persuasivo para cada bump
- [ ] Preços com âncora de valor

### Upsells
- [ ] OTO #1 criado com vídeo
- [ ] Downsell #1 criado
- [ ] OTO #2 criado (opcional)
- [ ] Urgência "só aparece uma vez"

### Tech
- [ ] Integração de pagamento testada
- [ ] Automação de emails configurada
- [ ] Fulfillment do livro configurado
- [ ] Thank you page funcional

### Follow-up
- [ ] Sequência de 14 emails criada
- [ ] Sequência de conversão (14-30 dias) criada
- [ ] Emails testados e funcionando

---

## Output Esperado

Após executar esta task, você terá:

1. **Documento de Sales Page** com toda a copy
2. **Order Bumps** (2) com copy completo
3. **Upsell Pages** (2-4) com scripts de vídeo
4. **Thank You Page** estruturada
5. **14-30 emails** de follow-up
6. **Checklist** de implementação

---

*Task Version: 1.0*
*Agent: @russell-brunson*
*Validation: documented large-scale revenue*
