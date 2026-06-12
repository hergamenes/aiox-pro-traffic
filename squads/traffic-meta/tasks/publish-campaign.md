# Task: Publish Campaign

## Metadata
- **Agent:** Campaign Publisher
- **Tipo:** Workflow interativo com execução CLI
- **Elicit:** true
- **ATENÇÃO:** Esta task cria campanhas REAIS com custo REAL

## Objetivo
Guiar o usuário para criar e publicar uma campanha na Meta Ads usando o CLI `meta-ads`.

## Inputs
- **Plano de campanha aprovado** pelo Campaign Launcher (`campaign-plan.md`)
- **Tipo de campanha** (um dos 8 objetivos suportados — ver tabela abaixo)
- **Nome, orçamento diário, título, texto, descrição** + campos específicos do objetivo
- **Autenticação Meta Ads** ativa (`meta-ads auth status` = OK)
- **Conta de anúncios padrão** configurada
- **Confirmação explícita do usuário** (custos reais envolvidos)

## Objetivos Suportados (CLI meta-ads — 8 tipos)

| Tipo | Objetivo Meta | Campo de destino exigido |
|------|---------------|--------------------------|
| `sales` | Vendas | `--url` (site) |
| `leads` | Leads (landing page) | `--url` (landing page) |
| `awareness` | Reconhecimento | `--url` |
| `traffic` | Tráfego | `--url` |
| `engagement` | Engajamento | `--url` |
| `whatsapp` | Click-to-WhatsApp | `--whatsapp {número com DDI}` |
| `leadform` | Lead Ads (formulário nativo) | `--privacy-url` (ou `--form-id`) |
| `app` | Promoção de App | `--app-id` + `--store-url` |

Todos aceitam `--plataforma instagram\|facebook\|all` para controlar placements.

## Veto Conditions
NÃO publicar se:
- ❌ `meta-ads auth status` retornar expirado ou não configurado
- ❌ Conta de anúncios padrão não estiver definida
- ❌ Usuário não confirmar explicitamente o resumo (Step 3)
- ❌ Plano de campanha não tiver passado pelo Campaign Launcher
- ❌ Orçamento ou texto principal estiverem vazios
- ❌ Tipo de campanha não for um dos 8 objetivos suportados (sales, leads, awareness, traffic, engagement, whatsapp, leadform, app)
- ❌ Campo de destino específico do objetivo estiver ausente (ex.: `whatsapp` sem número, `app` sem app-id/store-url, `leadform` sem privacy-url/form-id)

## Fluxo

### Step 1: Verificar Autenticação
Executar no terminal:
```bash
meta-ads auth status
```

- Se **autenticado** → Continuar
- Se **expirado** ou **não configurado** → Guiar para setup:
  ```bash
  meta-ads auth setup
  meta-ads config set-default
  ```

### Step 2: Coletar Informações
Perguntar ao usuário:

1. **Tipo de campanha:** um dos 8 — sales, leads, awareness, traffic, engagement, whatsapp, leadform, app
2. **Nome da campanha:** Como quer chamar? (ex: "Lançamento Curso Python")
3. **Orçamento diário:** Quanto por dia em R$? (ex: 50)
4. **Destino (depende do tipo):**
   - sales/awareness/traffic/engagement → URL do site
   - leads → URL da landing page
   - **whatsapp → número de WhatsApp com DDI** (ex: 5511999998888)
   - leadform → URL da política de privacidade (ou ID de formulário existente)
   - app → ID do aplicativo + URL da loja (App Store/Google Play)
5. **Título do anúncio:** Texto curto que aparece no topo
6. **Texto principal:** Texto do corpo do anúncio
7. **Descrição:** Texto complementar (aparece abaixo do link)
8. **Placement (opcional):** automático (padrão), só Instagram ou só Facebook (`--plataforma`)

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
Executar o comando CLI conforme o tipo. Adicionar `--plataforma {instagram|facebook|all}` quando o usuário escolher um placement específico.

**Objetivos com URL (sales, leads, awareness, traffic, engagement):**
```bash
meta-ads create {type} "{name}" --budget {budget} --url "{url}" --headline "{title}" --text "{text}" --description "{desc}" --quiet
```

**Click-to-WhatsApp (whatsapp):**
```bash
meta-ads create whatsapp "{name}" --budget {budget} --whatsapp {numero_ddi} --headline "{title}" --text "{text}" --description "{desc}" --quiet
```

**Lead Ads / formulário nativo (leadform):**
```bash
meta-ads create leadform "{name}" --budget {budget} --privacy-url "{privacy_url}" --headline "{title}" --text "{text}" --description "{desc}" --quiet
```

**Promoção de App (app):**
```bash
meta-ads create app "{name}" --budget {budget} --app-id {app_id} --store-url "{store_url}" --headline "{title}" --text "{text}" --description "{desc}" --quiet
```

**Ou via comando único (qualquer tipo):**
```bash
meta-ads up {type} "{name}" --budget {budget} [--url|--whatsapp|...] --quiet
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

## Output
- ID da campanha criada (`campaign_id`)
- ID do conjunto de anúncios (`adset_id`)
- ID do anúncio (`ad_id`)
- Link direto para o Ads Manager
- Mensagem de confirmação com resumo do publicado
- Entrada em histórico (`meta-ads history`)

## Acceptance Criteria
- [ ] Autenticação verificada com sucesso (Step 1)
- [ ] 7 campos do briefing coletados (Step 2)
- [ ] Resumo apresentado e usuário confirmou explicitamente "sim" (Step 3)
- [ ] Comando `meta-ads create {type}` executado sem erro (Step 4)
- [ ] IDs e link do Ads Manager retornados ao usuário (Step 5)
- [ ] Campanha registrada no histórico (`meta-ads history`)

## Handoff
- **Próximo agente:** Campaign Optimizer (após 3-5 dias de dados) via `*optimize`
- **Artefato passado:** `campaign_id` + status inicial da campanha
