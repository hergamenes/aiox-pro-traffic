# Template: Upsell Pages (OTO - One Time Offers)

Templates para páginas de Upsell após a compra do livro.
**Russell Brunson: "Upsells bem estruturados podem multiplicar por 3-5x sua receita por cliente."**

## Metadata

```yaml
template_id: upsell-oto
version: "1.0"
agent: "@russell-brunson"
position: "Post-checkout"
conversion_target: "10-20% OTO1, 5-10% OTO2"
```

---

## ESTRUTURA DO FUNIL DE UPSELLS

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHECKOUT COMPLETO                         │
│                     (Livro + Order Bumps)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OTO #1 (Upsell)                          │
│                      [FAIXA_OTO_1]                               │
│               "Oferta complementar ao livro"                     │
├─────────────────────────────────────────────────────────────────┤
│         [ACEITAR {{PREÇO_OTO1}}]     [NÃO, OBRIGADO]           │
└─────────────────────────────────────────────────────────────────┘
        │                               │
        ▼                               ▼
┌───────────────────┐     ┌───────────────────────────────────────┐
│     OTO #2        │     │           DOWNSELL #1                  │
│ [FAIXA_OTO_2]     │     │  Versão menor/parcelada - [PREÇO_DOWNSELL] │
│   "Próximo nível" │     │  "Entendo! Que tal só [X] por [Y]?"   │
└───────────────────┘     └───────────────────────────────────────┘
        │                               │
        │                               ▼
        │                 ┌───────────────────────────────────────┐
        │                 │         THANK YOU PAGE                 │
        │                 └───────────────────────────────────────┘
        │                               ▲
        └───────────────────────────────┘
```

---

## OTO #1: IMPLEMENTAÇÃO / MASTERCLASS

### Estrutura da Página

```markdown
# 🎉 PARABÉNS! Seu pedido foi confirmado.

Seu livro "{{BOOK_TITLE}}" está a caminho!

Mas antes de você ir... tenho uma **oferta especial** que só aparece AGORA.

---

## ESPERA! Esta oferta exclusiva desaparece quando você sair desta página.

[VÍDEO: 3-5 minutos explicando a oferta]

---

## O Livro Te Dá o MAPA...
## Este Programa Te Dá o CARRO.

Você acabou de garantir o livro que vai te ensinar **como {{TRANSFORMAÇÃO}}**.

Mas deixa eu te fazer uma pergunta:

**Você prefere descobrir tudo sozinho... ou ter um atalho?**

O livro tem tudo que você precisa. Mas implementar sozinho pode levar meses.

É por isso que criei o **{{PROGRAMA_NOME}}**.

---

## O Que É o {{PROGRAMA_NOME}}?

É um programa de {{DURAÇÃO}} que pega os conceitos do livro e te mostra
**exatamente como implementar**, passo a passo.

Enquanto o livro te dá a TEORIA, este programa te dá:

📌 **{{BENEFÍCIO_1}}**
{{DESCRIÇÃO_BENEFÍCIO_1}}

📌 **{{BENEFÍCIO_2}}**
{{DESCRIÇÃO_BENEFÍCIO_2}}

📌 **{{BENEFÍCIO_3}}**
{{DESCRIÇÃO_BENEFÍCIO_3}}

---

## O Que Você Vai Receber:

✅ **Módulo 1:** {{MÓDULO_1}}
*(Valor: R${{VALOR_M1}})*

✅ **Módulo 2:** {{MÓDULO_2}}
*(Valor: R${{VALOR_M2}})*

✅ **Módulo 3:** {{MÓDULO_3}}
*(Valor: R${{VALOR_M3}})*

✅ **Bônus Especial:** {{BÔNUS_OTO}}
*(Valor: R${{VALOR_BONUS}})*

| **VALOR TOTAL:** | **R${{VALOR_TOTAL}}** |

---

## Apenas Para Quem Acabou de Pegar o Livro:

**De R${{PREÇO_CHEIO}}**
**Por apenas R${{PREÇO_OTO}}**

(ou {{PARCELAS}}x de R${{VALOR_PARCELA}} sem juros)

---

## 🔴 ATENÇÃO: Esta oferta desaparece quando você sair desta página.

Se você fechar esta janela, pagará o preço cheio de R${{PREÇO_CHEIO}}
se quiser entrar depois.

---

[═══════ SIM! QUERO O {{PROGRAMA_NOME}} POR R${{PREÇO_OTO}} ═══════]

[Não, obrigado. Quero descobrir sozinho por enquanto.]
```

---

## EXEMPLO COMPLETO: A MEDICINA DA VENDA - OTO #1

```markdown
# 🎉 PARABÉNS! Seu pedido foi confirmado.

Seu livro "A Medicina da Venda" está a caminho!

Mas antes de você ir... tenho uma **oferta especial** que só aparece AGORA.

---

## ESPERA! Esta oferta exclusiva desaparece quando você sair desta página.

[VÍDEO: Matheus Marcondes - 4 minutos]

"Você acabou de tomar a melhor decisão para sua carreira de vendas.
Agora deixa eu te mostrar como ACELERAR seus resultados em 10x..."

---

## O Livro Te Dá o DIAGNÓSTICO...
## Este Programa Te Dá o TRATAMENTO COMPLETO.

Você acabou de garantir o livro que vai te ensinar como diagnosticar
e curar qualquer objeção do cliente.

Mas deixa eu te fazer uma pergunta:

**Você prefere praticar sozinho... ou ter um mentor te corrigindo?**

O livro tem tudo que você precisa. Mas praticar sozinho pode significar
meses de tentativa e erro.

É por isso que criei o **Residência em Vendas**.

---

## O Que É a Residência em Vendas?

É um programa de 6 semanas que pega os conceitos do livro e te mostra
**exatamente como aplicar em cada tipo de cliente**.

Enquanto o livro te dá a TEORIA, a Residência te dá:

📌 **PRÁTICA SUPERVISIONADA**
Você vai simular diagnósticos de vendas e receber feedback em tempo real.

📌 **SCRIPTS PERSONALIZADOS**
Adapto as técnicas para SEU mercado, SEU produto, SEU cliente.

📌 **CORREÇÃO DE ROTA**
Se algo não funcionar, ajustamos na hora. Zero desperdício de tempo.

---

## O Que Você Vai Receber:

✅ **Módulo 1:** Masterclass Anamnese Avançada (3h de vídeo)
*Como fazer as perguntas certas para cada tipo de cliente*
*(Valor: [VALOR_M1_EXEMPLO])*

✅ **Módulo 2:** Laboratório de Diagnóstico (6 simulações gravadas)
*Veja diagnósticos reais e aprenda com os erros e acertos*
*(Valor: [VALOR_M2_EXEMPLO])*

✅ **Módulo 3:** Protocolos de Tratamento (templates prontos)
*Scripts personalizáveis para as 7 objeções mais comuns*
*(Valor: [VALOR_M3_EXEMPLO])*

✅ **BÔNUS:** 2 Sessões de Consultoria em Grupo (ao vivo)
*Tire suas dúvidas diretamente comigo*
*(Valor: [VALOR_BONUS_EXEMPLO])*

| **VALOR TOTAL:** | **[VALOR_TOTAL_OTO1_EXEMPLO]** |

---

## Apenas Para Quem Acabou de Pegar o Livro:

~~De [PREÇO_CHEIO_OTO1_EXEMPLO]~~
**Por apenas [PREÇO_OTO1_EXEMPLO]**

(ou 12x de [PARCELA_OTO1_EXEMPLO] sem juros)

💡 **Economia de [ECONOMIA_OTO1_EXEMPLO]** ([DESCONTO_OTO1_EXEMPLO] de desconto)

---

## 🔴 ATENÇÃO: Esta oferta desaparece quando você sair desta página.

Se você fechar esta janela, pagará [PREÇO_PÓS_OTO1_EXEMPLO] para entrar na próxima turma.
Esta é sua ÚNICA chance de pagar [PREÇO_OTO1_EXEMPLO].

---

[═══════ SIM! QUERO A RESIDÊNCIA EM VENDAS POR [PREÇO_OTO1_EXEMPLO] ═══════]

[Não, obrigado. Prefiro aplicar o livro sozinho por enquanto.]
```

---

## DOWNSELL #1 (Se recusar OTO #1)

### Estrutura da Página

```markdown
# Eu entendo completamente.

R${{PREÇO_OTO}} pode parecer muito agora.

Mas eu não quero que você saia sem pelo menos ter
acesso ao **{{PRODUTO_DOWNSELL}}**.

---

## Que Tal Isso Ao Invés?

Ao invés do programa completo, você pode ter acesso ao
**{{PRODUTO_DOWNSELL}}** por apenas **R${{PREÇO_DOWNSELL}}**.

Isso inclui:
✅ {{ITEM_1}}
✅ {{ITEM_2}}
✅ {{ITEM_3}}

Não tem o suporte do programa completo, mas já vai te ajudar a
implementar o que está no livro muito mais rápido.

---

**Apenas R${{PREÇO_DOWNSELL}}** (ou {{PARCELAS}}x de R${{VALOR_PARCELA}})

---

[═══════ SIM! QUERO O {{PRODUTO_DOWNSELL}} POR R${{PREÇO_DOWNSELL}} ═══════]

[Não, obrigado. Só quero o livro mesmo.]
```

### Exemplo: Downsell da Residência em Vendas

```markdown
# Eu entendo completamente.

[PREÇO_OTO1_EXEMPLO] pode parecer muito agora, especialmente se você ainda não leu o livro.

Mas eu não quero que você saia sem pelo menos ter acesso aos
**Scripts de Diagnóstico Prontos**.

---

## Que Tal Isso Ao Invés?

Ao invés do programa completo de 6 semanas, você pode ter acesso ao
**Pack de Scripts de Diagnóstico** por apenas **[PREÇO_DOWNSELL_EXEMPLO]**.

Isso inclui:
✅ 21 perguntas de anamnese prontas para usar
✅ 7 scripts de follow-up para WhatsApp
✅ Checklist de diagnóstico (PDF imprimível)
✅ 3 vídeos curtos explicando como usar

Não tem as simulações e consultoria do programa completo, mas já vai
te ajudar a aplicar as técnicas do livro muito mais rápido.

---

**Apenas [PREÇO_DOWNSELL_EXEMPLO]** (ou 3x de [PARCELA_DOWNSELL_EXEMPLO] sem juros)

---

[═══════ SIM! QUERO OS SCRIPTS POR [PREÇO_DOWNSELL_EXEMPLO] ═══════]

[Não, obrigado. Só quero o livro mesmo.]
```

---

## OTO #2: PROGRAMA AVANÇADO / HIGH-TICKET

### Estrutura da Página

*(Aparece apenas para quem ACEITOU o OTO #1)*

```markdown
# 🚀 INCRÍVEL! Você está no caminho certo.

Você acabou de garantir:
✅ Livro "{{BOOK_TITLE}}"
✅ {{PROGRAMA_OTO1}}

Agora, para você que está REALMENTE comprometido...

---

## O PRÓXIMO NÍVEL: {{PROGRAMA_OTO2}}

Se você quer acelerar seus resultados ao MÁXIMO, existe um caminho ainda mais rápido.

O **{{PROGRAMA_OTO2}}** é para quem:
- Já decidiu que vai dominar {{HABILIDADE}}
- Quer acompanhamento mais próximo
- Prefere implementar com suporte direto

---

## O Que Está Incluído:

✅ **Tudo do {{PROGRAMA_OTO1}}** (que você acabou de adquirir)

**PLUS:**

🔥 **{{BENEFÍCIO_EXCLUSIVO_1}}**
{{DESCRIÇÃO}}

🔥 **{{BENEFÍCIO_EXCLUSIVO_2}}**
{{DESCRIÇÃO}}

🔥 **{{BENEFÍCIO_EXCLUSIVO_3}}**
{{DESCRIÇÃO}}

---

## Investimento:

**De R${{PREÇO_CHEIO_OTO2}}**
**Por apenas R${{PREÇO_OTO2}}**

(ou {{PARCELAS}}x de R${{VALOR_PARCELA}})

---

[═══════ SIM! QUERO O {{PROGRAMA_OTO2}} ═══════]

[Não, obrigado. O {{PROGRAMA_OTO1}} já é suficiente para mim.]
```

### Exemplo: OTO #2 - Mentoria Individual

```markdown
# 🚀 INCRÍVEL! Você está no caminho certo.

Você acabou de garantir:
✅ Livro "A Medicina da Venda"
✅ Residência em Vendas (6 semanas)

Agora, para você que está REALMENTE comprometido...

---

## O PRÓXIMO NÍVEL: Mentoria VIP (3 meses)

Se você quer acelerar seus resultados ao MÁXIMO, existe um caminho ainda mais rápido.

A **Mentoria VIP** é para quem:
- Já decidiu que vai se tornar um vendedor de elite
- Quer acompanhamento individual (não em grupo)
- Prefere implementar com feedback personalizado

---

## O Que Está Incluído:

✅ **Tudo da Residência em Vendas** (que você acabou de adquirir)

**PLUS:**

🔥 **4 Sessões Individuais de 1h** (uma por mês)
Eu e você, 1:1. Analiso suas calls reais e te dou feedback específico.

🔥 **Acesso Direto via WhatsApp** (3 meses)
Dúvida surgiu? Me manda mensagem. Respondo em até 24h.

🔥 **Diagnóstico Personalizado do Seu Negócio**
Analiso seu processo de vendas atual e crio um plano de ação específico.

🔥 **Script Customizado Para Seu Produto**
Não é template genérico. É script escrito PRA VOCÊ, pro SEU cliente.

---

## Investimento:

~~De [PREÇO_CHEIO_OTO2_EXEMPLO]~~
**Por apenas [PREÇO_OTO2_EXEMPLO]**

(ou 12x de [PARCELA_OTO2_EXEMPLO] sem juros)

💡 **Economia de [ECONOMIA_OTO2_EXEMPLO]** ([DESCONTO_OTO2_EXEMPLO] de desconto)

---

## 🔴 Esta oferta só está disponível AGORA, nesta página.

Normalmente a Mentoria VIP custa [PREÇO_CHEIO_OTO2_EXEMPLO] e só abro 5 vagas por mês.
Mas como você acabou de entrar na Residência, você pode garantir
a vaga por [PREÇO_OTO2_EXEMPLO].

---

[═══════ SIM! QUERO A MENTORIA VIP POR [PREÇO_OTO2_EXEMPLO] ═══════]

[Não, obrigado. A Residência já é suficiente para mim.]
```

---

## ELEMENTOS ESSENCIAIS DE COPY PARA UPSELLS

### 1. Reconhecimento da Compra
```markdown
"🎉 PARABÉNS! Seu pedido foi confirmado."
"Você tomou uma excelente decisão."
"Seu [produto] está a caminho!"
```

### 2. Transição Suave
```markdown
"Mas antes de você ir..."
"Tenho algo especial para você..."
"Uma oferta exclusiva que só aparece agora..."
```

### 3. Complementaridade
```markdown
"O livro te dá o MAPA, este programa te dá o CARRO."
"O livro te dá a TEORIA, este programa te dá a PRÁTICA."
"O livro te dá o QUÊ, este programa te dá o COMO."
```

### 4. Urgência Real
```markdown
"Esta oferta desaparece quando você sair desta página."
"Só está disponível para quem acabou de comprar."
"Depois, o preço volta para R$[PREÇO CHEIO]."
```

### 5. CTA Claro
```markdown
[═══════ SIM! QUERO [OFERTA] POR R$[PREÇO] ═══════]
[Não, obrigado. Prefiro [alternativa] por enquanto.]
```

---

## VARIÁVEIS DO TEMPLATE

```yaml
# OTO #1
{{PROGRAMA_OTO1}}: "Nome do programa"
{{PREÇO_CHEIO_OTO1}}: "R$X.XXX"
{{PREÇO_OTO1}}: "R$XXX"
{{DURAÇÃO_OTO1}}: "X semanas/meses"
{{BENEFÍCIOS_OTO1}}: "Lista de benefícios"

# Downsell #1
{{PRODUTO_DOWNSELL}}: "Nome do produto menor"
{{PREÇO_DOWNSELL}}: "R$XX"
{{ITENS_DOWNSELL}}: "O que inclui"

# OTO #2
{{PROGRAMA_OTO2}}: "Nome do programa premium"
{{PREÇO_CHEIO_OTO2}}: "R$X.XXX"
{{PREÇO_OTO2}}: "R$XXX"
{{BENEFÍCIOS_EXCLUSIVOS}}: "O que tem de diferente"
```

---

## MÉTRICAS ESPERADAS

| Página | Conversão Target | Conversão Excelente |
|--------|------------------|---------------------|
| OTO #1 | 10% | 20%+ |
| Downsell #1 | 15% | 30%+ |
| OTO #2 | 5% | 10%+ |

### Cálculo de Impacto (1000 compradores de livro)

**Cenário com conversões médias:**
- OTO #1 ([PREÇO_OTO1_EXEMPLO]): 10% = [CLIENTES_OTO1_EXEMPLO] x [PREÇO_OTO1_EXEMPLO] = [RECEITA_OTO1_EXEMPLO]
- Downsell #1 ([PREÇO_DOWNSELL_EXEMPLO]): 15% dos 900 = [CLIENTES_DOWNSELL_EXEMPLO] x [PREÇO_DOWNSELL_EXEMPLO] = [RECEITA_DOWNSELL_EXEMPLO]
- OTO #2 ([PREÇO_OTO2_EXEMPLO]): 5% dos 100 = [CLIENTES_OTO2_EXEMPLO] x [PREÇO_OTO2_EXEMPLO] = [RECEITA_OTO2_EXEMPLO]

**Total adicional: [RECEITA_ADICIONAL_TOTAL_EXEMPLO]**
**Por cliente: ~[RECEITA_POR_CLIENTE_EXEMPLO] adicional (média)**

---

## CHECKLIST ANTES DE PUBLICAR

### UX/Design
- [ ] Vídeo carrega rápido (< 3 segundos)
- [ ] Botões grandes e clicáveis
- [ ] Timer de urgência (se aplicável)
- [ ] Mobile-friendly
- [ ] Link "não obrigado" funciona

### Copy
- [ ] Reconhece a compra anterior
- [ ] Explica por que isso complementa
- [ ] Value stack claro
- [ ] Preço com desconto visível
- [ ] Urgência real (não falsa)
- [ ] CTA claro e direto

### Técnico
- [ ] Pagamento funciona
- [ ] Produto entregue automaticamente
- [ ] Email de confirmação configurado
- [ ] Redirect correto após cada ação

---

*Template Version: 1.0*
*Agent: @russell-brunson*
*Position: Post-checkout sequence*
*Target: 10-20% OTO1, 5-10% OTO2*
