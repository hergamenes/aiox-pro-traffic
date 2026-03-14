# Task: Publish Campaign

## Metadata
- **Agent:** Campaign Publisher
- **Tipo:** Workflow interativo com execução CLI
- **Elicit:** true
- **ATENÇÃO:** Esta task cria campanhas REAIS com custo REAL

## Objetivo
Guiar o usuário para criar e publicar uma campanha na Meta Ads usando o CLI `meta-ads`.

## Fluxo

### Step 1: Verificar Autenticação
Executar no terminal:
```bash
cd packages/meta-ads-agent && node dist/bin/meta-ads.js auth status
```

- Se **autenticado** → Continuar
- Se **expirado** ou **não configurado** → Guiar para setup:
  ```bash
  cd packages/meta-ads-agent && node dist/bin/meta-ads.js auth setup
  cd packages/meta-ads-agent && node dist/bin/meta-ads.js config set-default
  ```

### Step 2: Coletar Informações
Perguntar ao usuário:

1. **Tipo de campanha:** Vendas (sales) ou Leads (leads)?
2. **Nome da campanha:** Como quer chamar? (ex: "Lançamento Curso Python")
3. **Orçamento diário:** Quanto por dia em R$? (ex: 50)
4. **URL:** Link do site (sales) ou landing page (leads)
5. **Título do anúncio:** Texto curto que aparece no topo
6. **Texto principal:** Texto do corpo do anúncio
7. **Descrição:** Texto complementar (aparece abaixo do link)

### Step 3: Resumo e Confirmação
Mostrar resumo completo antes de criar:

```
📋 RESUMO DA CAMPANHA
━━━━━━━━━━━━━━━━━━━━
Tipo:       {type}
Nome:       {name}
Orçamento:  R$ {budget}/dia
URL:        {url}
Título:     {title}
Texto:      {text}
Descrição:  {description}

⚠️  Isso vai criar uma campanha REAL na sua conta Meta Ads.
    O orçamento será cobrado a partir da publicação.

Confirma? (sim/não)
```

- Se **sim** → Continuar para Step 4
- Se **não** → Voltar para Step 2 para ajustar

### Step 4: Criar Campanha
Executar o comando CLI:

**Para Sales:**
```bash
cd packages/meta-ads-agent && node dist/bin/meta-ads.js create sales "{name}" --quiet
```
(E fornecer os prompts interativos: budget, url, título, texto, descrição)

**Para Leads:**
```bash
cd packages/meta-ads-agent && node dist/bin/meta-ads.js create leads "{name}" --quiet
```

**Ou via comando único (se todos os dados disponíveis):**
```bash
cd packages/meta-ads-agent && node dist/bin/meta-ads.js up {type} "{name}" --budget {budget} --url "{url}" --quiet
```

### Step 5: Resultado
Mostrar ao usuário:
- ✅ Campanha criada com sucesso
- ID da Campanha
- ID do Conjunto de Anúncios
- ID do Anúncio
- Link para o Gerenciador de Anúncios
- Orçamento diário configurado
- Status da campanha

### Step 6: Próximos Passos
Sugerir:
1. Acompanhar a campanha no Gerenciador de Anúncios
2. Esperar 3-5 dias para dados significativos
3. Usar ⚡ Campaign Optimizer (`*optimize`) para otimizar
4. Usar 📊 Performance Analyst (`*report`) para relatório

## Regras
- SEMPRE confirmar com o usuário antes de executar (Step 3)
- NUNCA pular a verificação de autenticação (Step 1)
- Se qualquer comando falhar → Mostrar erro claro e sugerir solução
