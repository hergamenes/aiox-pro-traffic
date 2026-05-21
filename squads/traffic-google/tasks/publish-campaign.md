# Task: Publish Campaign (MVP — coordenação manual)

## Metadata
- **Agent:** Campaign Publisher
- **Tipo:** Workflow interativo com validação CLI + publicação manual no Google Ads UI
- **Elicit:** true
- **ATENÇÃO:** Esta task envolve campanhas REAIS com custo REAL

## Objetivo
Coordenar a publicação de uma campanha no Google Ads via Google Ads UI (MVP — CLI ainda não suporta `create`/`upload`; Phase 2 inclui automação). O agent valida pré-condições via CLI, apresenta o plano, redireciona para o UI, e captura IDs pós-publicação.

## Inputs
- **Plano de campanha aprovado** pelo Campaign Launcher (`campaign-plan.md`)
- **Tipo de campanha** (Search, Display, Performance Max, YouTube)
- **Nome, orçamento diário, URL, palavras-chave (Search), criativos, copies**
- **Autenticação Google Ads** ativa (`google-ads auth status` = OK)
- **Conta de anúncios padrão** configurada e **NÃO sendo MCC** (manager account)
- **Confirmação explícita do usuário** (custos reais envolvidos)
- **Acesso ao Google Ads UI** (https://ads.google.com)

## Veto Conditions
NÃO prosseguir se:
- ❌ `google-ads auth status` retornar expirado/não-configurado
- ❌ Conta de anúncios padrão não estiver definida
- ❌ Conta padrão for MCC (Google rejeita métricas em MCC; usar conta cliente)
- ❌ Usuário não confirmar explicitamente o resumo (Step 4)
- ❌ Plano de campanha não tiver passado pelo Campaign Launcher
- ❌ Orçamento, URL ou texto principal estiverem vazios
- ❌ Tipo de campanha não declarado entre Search/Display/PMax/YouTube

## Fluxo

### Step 1: Verificar Autenticação
```bash
node packages/google-ads-agent/dist/bin/google-ads.js auth status
```

- Se autenticado → Continuar
- Se expirado/não-configurado → Guiar para `google-ads auth setup`

### Step 2: Verificar Conta Padrão (não pode ser MCC)
```bash
node packages/google-ads-agent/dist/bin/google-ads.js config get-default
node packages/google-ads-agent/dist/bin/google-ads.js accounts
```

- Se conta padrão não definida → Guiar para `google-ads config set-default`
- Se conta padrão for MCC → BLOQUEAR e pedir conta cliente
- Smoke rápido: `google-ads report --period 7d --level account --format json` deve retornar dados (não REQUESTED_METRICS_FOR_MANAGER)

### Step 3: Coletar Plano e Apresentar Resumo
Receber do Campaign Launcher (ou solicitar ao usuário):

1. **Tipo de campanha:** Search / Display / Performance Max / YouTube
2. **Nome da campanha:** (ex: "Black Friday — Vendas — 2026-Q4")
3. **Orçamento diário:** Quanto por dia em R$ (ex: 50)
4. **URL de destino:** Site/landing/produto
5. **Palavras-chave (Search):** Lista de keywords
6. **Criativos:** Imagens/vídeos/responsive search ads
7. **Copies:** Títulos, descrições, CTAs

### Step 4: Resumo e Confirmação
Mostrar resumo completo antes de redirecionar ao UI:

```
📋 RESUMO DA CAMPANHA — Google Ads
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo:           {Search|Display|PMax|YouTube}
Conta:          {customer-id} ({nome})
Nome:           {name}
Orçamento:      R$ {budget}/dia
URL:            {url}
Keywords:       {list}  (se Search)
Criativos:      {n} imagens, {n} vídeos
Copies:         {titles} / {descriptions}
UTMs:           validados pelo Launcher

⚠️  Você vai criar uma campanha REAL no Google Ads.
    O orçamento será cobrado a partir da publicação.

Confirma e procede para o Google Ads UI? (sim/não)
```

- Se **sim** → Continuar para Step 5
- Se **não** → Voltar para Step 3 (ajustar plano)

### Step 5: Guiar Publicação no Google Ads UI

```
1. Abra: https://ads.google.com
2. Confirme que está na conta correta: {customer-id} ({nome})
3. Clique "+ Nova campanha"
4. Selecione tipo: {Search/Display/PMax/YouTube}
5. Configure conforme o plano:
   - Nome, orçamento diário, público, lances
   - Adicione palavras-chave (Search), audiência (Display/PMax)
   - Suba criativos e cole copies
6. Confirme UTMs nos URLs finais
7. Revise e publique
8. Após publicação, copie:
   - Customer ID (formato 123-456-7890, no canto superior direito)
   - Campaign ID (na URL do detalhe da campanha)
```

### Step 6: Capturar IDs Pós-Publicação

Solicitar ao usuário:

1. **Customer ID** (já deve estar no `config get-default`, confirmar)
2. **Campaign ID** (string numérica do URL)

Validar via CLI:

```bash
node packages/google-ads-agent/dist/bin/google-ads.js report \
  --customer-id {customer-id} \
  --campaign-id {campaign-id} \
  --period 7d --format json
```

- Se retornar dados (mesmo array vazio) → ✅ campanha rastreada
- Se erro → investigar (auth, customer-id correto, propagação da Google ~30min)

### Step 7: Persistir Log + Próximos Passos
- Anotar em log local: timestamp, nome, tipo, budget, customer_id, campaign_id, url do UI
- Sugerir:
  1. Aguardar 72h+ para dados estatisticamente relevantes
  2. Após 72h: usar Campaign Optimizer (`*optimize`) para ciclo de otimização
  3. Para relatório consolidado: Performance Analyst (`*report`)

## Regras
- SEMPRE confirmar com o usuário antes de redirecionar ao UI (Step 4)
- NUNCA pular a verificação de autenticação + conta cliente (Steps 1-2)
- NUNCA prometer criação automática via CLI no MVP — Phase 2 ainda não chegou
- Se qualquer comando CLI falhar → Mostrar erro claro e sugerir solução

## Output
- Customer ID + Campaign ID capturados
- Link direto para o Ads Manager da campanha
- Mensagem de confirmação com resumo do publicado
- Log local de publish (timestamp + ids)

## Acceptance Criteria
- [ ] Autenticação verificada com sucesso (Step 1)
- [ ] Conta padrão NÃO é MCC (Step 2)
- [ ] Plano apresentado com 7+ campos (Step 3)
- [ ] Resumo apresentado e usuário confirmou explicitamente "sim" (Step 4)
- [ ] Usuário redirecionado ao Google Ads UI e completou criação (Step 5)
- [ ] Customer ID + Campaign ID capturados (Step 6)
- [ ] Validação via `google-ads report --campaign-id` retorna sem erro (Step 6)
- [ ] Log local de publish persistido (Step 7)

## Handoff
- **Próximo agente:** Campaign Optimizer (após 72h+ de dados) via `*optimize`
- **Artefato passado:** `campaign_id` + status inicial + customer_id
