# Template: Order Bumps (Book Funnel)

Templates para Order Bumps no checkout do Book Funnel.
**Russell Brunson: "Order bumps bem feitos convertem 30-50% e pagam seu custo de aquisição."**

## Metadata

```yaml
template_id: order-bump
version: "1.0"
agent: "@russell-brunson"
position: "Checkout popup"
conversion_target: "30-50%"
```

---

## O QUE É UM ORDER BUMP?

Order bump é uma oferta adicional que aparece NO MOMENTO DO CHECKOUT,
antes do cliente finalizar a compra. É um checkbox com uma oferta complementar.

**Características:**
- Aparece na página de checkout (não é uma página separada)
- Preço baixo ([FAIXA_PREÇO_LOW_TICKET])
- Complementa o produto principal
- Não exige decisão complexa (checkbox simples)
- Entrega geralmente digital (sem custo adicional de envio)

---

## ORDER BUMP #1: AUDIOBOOK

### Copy do Order Bump

```markdown
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Audiobook por apenas {{OB1_PRICE}}           │
│                                                                 │
│ [IMAGEM: Mockup de fones + waveform]                           │
│                                                                 │
│ Quer consumir o conteúdo enquanto dirige, treina ou faz        │
│ tarefas? Adicione a versão em áudio narrada por {{AUTHOR_NAME}}│
│ (ou narrador profissional) e tenha acesso IMEDIATO ao          │
│ conteúdo enquanto seu livro físico está a caminho.             │
│                                                                 │
│ ✅ Acesso imediato (começa a ouvir em 5 minutos)              │
│ ✅ 7+ horas de conteúdo                                        │
│ ✅ Ouça em qualquer dispositivo                                │
│ ✅ Download para ouvir offline                                 │
│                                                                 │
│ Valor normal: {{OB1_ORIGINAL_PRICE}}                           │
│ Hoje apenas: {{OB1_PRICE}}                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Exemplo Preenchido (A Medicina da Venda)

```markdown
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Audiobook por apenas {{OB1_PRICE}}           │
│                                                                 │
│ [IMAGEM: Fones + carro + academia]                             │
│                                                                 │
│ Quer dominar as técnicas de vendas enquanto dirige para        │
│ reuniões ou treina na academia? Adicione a versão em áudio     │
│ narrada pelo próprio Matheus Marcondes e tenha acesso          │
│ IMEDIATO ao conteúdo enquanto seu livro está a caminho.        │
│                                                                 │
│ ✅ Acesso imediato (começa a ouvir em 5 minutos)              │
│ ✅ 6h45min de conteúdo prático                                │
│ ✅ Narrado pelo autor com exemplos extras                      │
│ ✅ Download para ouvir offline (Spotify, etc.)                │
│                                                                 │
│ Valor normal: {{OB1_ORIGINAL_PRICE}} | Hoje apenas: {{OB1_PRICE}} │
└─────────────────────────────────────────────────────────────────┘
```

### Por que funciona?

1. **Complementar:** Não substitui o livro, agrega
2. **Imediato:** Entrega instantânea vs. esperar o frete
3. **Prático:** Soluciona problema real (consumir em movimento)
4. **Preço baixo:** {{OB1_PRICE}} não exige grande decisão

---

## ORDER BUMP #2: WORKSHOP/MASTERCLASS GRAVADA

### Copy do Order Bump

```markdown
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Workshop Implementação por apenas {{OB2_PRICE}} │
│                                                                 │
│ [IMAGEM: Screenshot do workshop + relógio "3h"]                │
│                                                                 │
│ OFERTA ESPECIAL APENAS PARA NOVOS LEITORES                     │
│                                                                 │
│ Assista {{AUTHOR_NAME}} aplicando os conceitos do livro em     │
│ tempo real. Este workshop de 3 horas mostra exatamente como    │
│ implementar tudo que você vai aprender.                        │
│                                                                 │
│ ✅ 3 horas de aplicação prática                                │
│ ✅ Casos reais analisados ao vivo                              │
│ ✅ Templates e frameworks prontos                              │
│ ✅ Sessão de Q&A gravada                                       │
│                                                                 │
│ Valor normal: {{OB2_ORIGINAL_PRICE}}                           │
│ Hoje apenas: {{OB2_PRICE}} (economia de {{OB2_SAVINGS_LABEL}}) │
└─────────────────────────────────────────────────────────────────┘
```

### Exemplo Preenchido (A Medicina da Venda)

```markdown
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Adicione o Workshop "Diagnóstico de Vendas" - {{OB2_PRICE}} │
│                                                                 │
│ [IMAGEM: Matheus em chamada de vendas + slides]                │
│                                                                 │
│ OFERTA ESPECIAL APENAS PARA NOVOS LEITORES                     │
│                                                                 │
│ Assista Matheus Marcondes conduzindo 3 diagnósticos de vendas  │
│ REAIS com clientes diferentes. Você vai ver exatamente como    │
│ aplicar cada técnica do livro em situações reais.              │
│                                                                 │
│ ✅ 3 diagnósticos completos gravados (2h30)                   │
│ ✅ Análise frame-a-frame do que funcionou                      │
│ ✅ Scripts de follow-up que foram usados                       │
│ ✅ Resultado: 2 de 3 fecharam na hora                          │
│                                                                 │
│ Valor normal: {{OB2_ORIGINAL_PRICE}} | Hoje: {{OB2_PRICE}}     │
└─────────────────────────────────────────────────────────────────┘
```

### Por que funciona?

1. **Mostra aplicação:** Sai da teoria para prática
2. **Reduz fricção:** "Me mostra como fazer"
3. **Prova social implícita:** Se funciona em casos reais, funciona pra mim
4. **Exclusividade:** "Apenas para novos leitores"

---

## ORDER BUMP #3: ACESSO VIP / COMUNIDADE

### Copy do Order Bump

```markdown
┌─────────────────────────────────────────────────────────────────┐
│ ☐ SIM! Quero 3 meses de Acesso VIP por apenas {{OB3_PRICE}}    │
│                                                                 │
│ [IMAGEM: Screenshots do grupo + membros]                       │
│                                                                 │
│ Conecte-se com outros {{AVATAR_WHO}} que estão implementando   │
│ os conceitos do livro. Tire dúvidas diretamente com a equipe   │
│ do {{AUTHOR_NAME}} e participe de encontros semanais.          │
│                                                                 │
│ ✅ Grupo exclusivo de leitores                                 │
│ ✅ Sessões semanais de dúvidas                                 │
│ ✅ Networking com pessoas do seu nicho                         │
│ ✅ 3 meses de acesso (depois {{OB3_RECURRING_PRICE}} se quiser continuar) │
│                                                                 │
│ Valor: {{OB3_BUNDLE_VALUE}} (3x {{OB3_PRICE}})                 │
│ Hoje: {{OB3_PRICE}} pelo pacote de 3 meses                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## VARIÁVEIS DO TEMPLATE

```yaml
# Order Bump #1 (Audiobook)
{{OB1_TITLE}}: "Audiobook"
{{OB1_PRICE}}: "[PREÇO_OB1]"
{{OB1_ORIGINAL_PRICE}}: "[PREÇO_CHEIO_OB1]"
{{OB1_DURATION}}: "X horas"
{{OB1_NARRATOR}}: "Autor ou narrador profissional"

# Order Bump #2 (Workshop)
{{OB2_TITLE}}: "Nome do Workshop"
{{OB2_PRICE}}: "[PREÇO_OB2]"
{{OB2_ORIGINAL_PRICE}}: "[PREÇO_CHEIO_OB2]"
{{OB2_SAVINGS_LABEL}}: "[ECONOMIA_OB2]"
{{OB2_DURATION}}: "X horas"
{{OB2_CONTENTS}}: "O que inclui"

# Order Bump #3 (Comunidade)
{{OB3_TITLE}}: "Acesso VIP"
{{OB3_PRICE}}: "[PREÇO_OB3]"
{{OB3_RECURRING_PRICE}}: "[PREÇO_RECORRENTE_OB3]"
{{OB3_BUNDLE_VALUE}}: "[VALOR_PACOTE_OB3]"
{{OB3_PERIOD}}: "3 meses"
{{OB3_FEATURES}}: "Benefícios do grupo"
{{BOOK_SHIPPING_PRICE}}: "[FRETE_LIVRO]"
{{CHECKOUT_TOTAL_LABEL}}: "[TOTAL_CHECKOUT]"
```

---

## DESIGN & UX GUIDELINES

### Posicionamento na Página
```
┌─────────────────────────────────────────────┐
│ CHECKOUT PAGE                               │
├─────────────────────────────────────────────┤
│ [Resumo do Pedido]                          │
│ Livro: GRÁTIS                               │
│ Frete: {{BOOK_SHIPPING_PRICE}}              │
├─────────────────────────────────────────────┤
│ [SEUS DADOS]                                │
│ Nome: _____________                         │
│ Email: ____________                         │
│ Endereço: _________                         │
├─────────────────────────────────────────────┤
│ ╔═══════════════════════════════════════╗  │
│ ║ ☐ ORDER BUMP #1 - Audiobook {{OB1_PRICE}} ║  │ ← DESTAQUE
│ ║ [Descrição breve...]                  ║  │
│ ╚═══════════════════════════════════════╝  │
├─────────────────────────────────────────────┤
│ ╔═══════════════════════════════════════╗  │
│ ║ ☐ ORDER BUMP #2 - Workshop {{OB2_PRICE}} ║  │ ← DESTAQUE
│ ║ [Descrição breve...]                  ║  │
│ ╚═══════════════════════════════════════╝  │
├─────────────────────────────────────────────┤
│ [PAGAMENTO]                                 │
│ Cartão: ____                                │
├─────────────────────────────────────────────┤
│ [TOTAL: {{CHECKOUT_TOTAL_LABEL}} + bumps selecionados] │
│                                             │
│ [===== FINALIZAR COMPRA =====]             │
└─────────────────────────────────────────────┘
```

### Cores e Visual
- **Borda:** Destaque (amarelo, laranja, ou cor de marca)
- **Background:** Diferente do resto da página (levemente destacado)
- **Checkbox:** Grande e clicável
- **Preço:** Bem visível com desconto riscado

---

## COPY FORMULAS PARA ORDER BUMPS

### Fórmula 1: Complemento Lógico
```
"Quer [benefício adicional]? Adicione [produto] por apenas [preço]."
```

### Fórmula 2: Problema-Solução Rápida
```
"[Problema comum]? Este [produto] resolve exatamente isso por [preço]."
```

### Fórmula 3: Exclusividade
```
"APENAS PARA NOVOS LEITORES: [oferta] que normalmente custa [preço cheio] por apenas [preço promocional]."
```

### Fórmula 4: Acelerador
```
"Quer implementar mais rápido? Este [produto] mostra exatamente como por [preço]."
```

---

## MÉTRICAS ESPERADAS

| Order Bump | Conversão Target | Conversão Excelente |
|------------|------------------|---------------------|
| Audiobook ({{OB1_PRICE}}) | 25% | 40%+ |
| Workshop ({{OB2_PRICE}}) | 15% | 25%+ |
| Comunidade ({{OB3_PRICE}}) | 30% | 50%+ |

### Cálculo de Impacto

**Sem order bumps:**
- 1000 livros vendidos
- Receita: [RECEITA_FRETE_EXEMPLO]

**Com order bumps (conversões médias):**
- 1000 livros vendidos
- Audiobook (25%): [UNIDADES_OB1_EXEMPLO] x {{OB1_PRICE}} = [RECEITA_OB1_EXEMPLO]
- Workshop (15%): [UNIDADES_OB2_EXEMPLO] x {{OB2_PRICE}} = [RECEITA_OB2_EXEMPLO]
- **Receita total: [RECEITA_TOTAL_EXEMPLO]** ([MULTIPLICADOR_EXEMPLO]x mais)

---

## CHECKLIST ANTES DE PUBLICAR

- [ ] Checkbox funciona corretamente
- [ ] Preço original e promocional visíveis
- [ ] Descrição curta e clara (máx. 50 palavras)
- [ ] Imagem relevante (se possível)
- [ ] Benefícios em bullets
- [ ] Entrega clara (digital = imediato)
- [ ] Não confunde o checkout (não complica)
- [ ] Testado em mobile

---

*Template Version: 1.0*
*Agent: @russell-brunson*
*Position: Checkout page*
*Target: 30-50% conversion*
