# Task: Publish Campaign (Autonomous executor — pós-Epic 6)

## Metadata
- **Agent:** Campaign Publisher
- **Tipo:** Workflow autônomo de execução via CLI (sem UI manual)
- **Elicit:** true (confirmação explícita do operador antes de ativar)
- **ATENÇÃO:** Esta task cria campanhas REAIS com custo REAL — execução end-to-end via CLI

## Objetivo
Publicar uma campanha no Google Ads de forma **autônoma**, executando toda a cadeia de criação (upload de assets → campaign → ad-group → keywords → ads → enable) via comandos `google-ads ...` da CLI em produção (Epic 6 completo: Stories 6.2 a 6.5). O agente cria a campanha em estado PAUSED, mostra snapshot e só ativa após confirmação explícita do operador.

## Inputs
- **Plano de campanha aprovado** pelo Campaign Launcher (`campaign-plan.md`)
- **Tipo de campanha** (Search, Display, Performance Max)
- **Nome, orçamento diário, URL final, keywords (Search), criativos, copies**
- **Autenticação Google Ads** ativa (`google-ads auth status` = OK)
- **Conta de anúncios padrão** configurada e **NÃO sendo MCC** (manager account)
- **Confirmação explícita do operador** (custos reais envolvidos)

## Veto Conditions
NÃO prosseguir se:
- `google-ads auth status` retornar expirado/não-configurado
- Conta de anúncios padrão não estiver definida
- Conta padrão for MCC (Google rejeita métricas em MCC; usar conta cliente)
- Operador não confirmar explicitamente o resumo (Step 5)
- Plano de campanha não tiver passado pelo Campaign Launcher
- Orçamento, URL final ou copies estiverem vazios
- Tipo de campanha não declarado entre Search/Display/PMax
- Qualquer comando CLI da cadeia falhar (abortar imediatamente, NÃO ativar)

## Fluxo Autônomo

### Step 1: Verificar Autenticação
```bash
google-ads auth status
```
- Se OK → continuar
- Se falhar → abortar e direcionar para `google-ads auth setup`

### Step 2: Verificar Conta Padrão (não pode ser MCC) + Árvore
```bash
google-ads accounts --tree
google-ads config get-default
```
- Confirmar que a conta padrão NÃO é MCC (flag `is_manager` deve ser false na árvore)
- Se MCC ou indefinida → BLOQUEAR e pedir `google-ads config set-default {customer-id-cliente}`

### Step 3: Receber Plano Validado do Campaign Launcher
Receber `campaign-plan.md` com:
1. Tipo de campanha: Search / Display / Performance Max
2. Nome da campanha
3. Orçamento diário (R$)
4. URL final + UTMs validados
5. Keywords (Search) com match types e CPC bids
6. Assets (imagens, vídeos, headlines, descriptions) — paths locais
7. Targeting (locations, languages, audiences)

### Step 4: Upload de Assets (se RDA/PMax/Display)
Para cada asset necessário, executar e **capturar o asset ID**:
```bash
google-ads upload image {path/to/image.png}
google-ads upload video {path/to/video.mp4}
google-ads upload text "{headline ou description}"
```
- Persistir lista `{tipo, path, asset_id}` para uso nos próximos steps
- Se algum upload falhar → abortar a task inteira

### Step 5: Apresentar Resumo + Confirmação Explícita
Mostrar resumo completo antes de criar qualquer entidade:
```
RESUMO DA CAMPANHA — Google Ads (execução autônoma)
----------------------------------------------------
Tipo:           {Search|Display|PMax}
Conta:          {customer-id} ({nome}) [não-MCC OK]
Nome:           {name}
Orçamento:      R$ {budget}/dia
URL final:      {url}
Keywords:       {N} keywords (Search)
Assets:         {N} imagens, {N} vídeos, {N} textos (IDs capturados)
Copies:         {N} headlines, {N} descriptions

Esta operação vai criar campanha REAL no Google Ads (estado PAUSED inicialmente).
O orçamento só será cobrado após o passo de ativação explícita (Step 11).

Confirma execução da cadeia completa? (s/N)
```
- Se **s** → continuar para Step 6
- Se **N** → abortar e devolver controle ao operador

### Step 6: Criar Campanha (PAUSED)
Executar conforme o tipo (Stories 6.3a/b/c):
```bash
# Search
google-ads create campaign-search --name "{name}" --budget {budget} --status PAUSED

# Display
google-ads create campaign-display --name "{name}" --budget {budget} --status PAUSED

# Performance Max
google-ads create campaign-pmax --name "{name}" --budget {budget} --status PAUSED
```
- Capturar `campaign_id` retornado
- Se falhar → abortar (não há entidades órfãs a limpar ainda)

### Step 7: Criar Ad Group (Search/Display)
Apenas se Search ou Display (PMax usa Asset Groups, gerenciados no Step 6):
```bash
google-ads create ad-group {campaign-id} --name "{ad-group-name}" --cpc-bid {default-bid}
```
- Capturar `ad_group_id`
- Se falhar → reportar erro e pausar a cadeia (campanha ficará PAUSED, sem ad group)

### Step 8: Adicionar Keywords (apenas Search)
Para cada keyword do plano:
```bash
google-ads keyword add {ad-group-id} "{keyword}" --match BROAD|PHRASE|EXACT --cpc-bid {bid}
```
- Executar em sequência, capturando erros individuais
- Se >20% das keywords falharem → abortar e reportar (campanha fica PAUSED)

### Step 9: Criar Ads (RSA/RDA)
```bash
# Search → Responsive Search Ad
google-ads create ad rsa {ad-group-id} --headlines "h1|h2|h3|..." --descriptions "d1|d2|..." --final-url {url}

# Display → Responsive Display Ad (usa asset IDs capturados no Step 4)
google-ads create ad rda {ad-group-id} --image-asset-ids "{id1},{id2}" --headlines "..." --descriptions "..." --final-url {url}
```
- Capturar `ad_id`
- Se falhar → reportar mas NÃO abortar (campanha + ad group + keywords já existem; operador pode investigar)

### Step 10: Snapshot Pré-Ativação
```bash
google-ads report --campaign-id {campaign-id} --period 1d --level campaign --format json
```
Mostrar ao operador a estrutura completa:
- Campanha (status PAUSED, budget, tipo)
- Ad Group (CPC default)
- Keywords (lista + match types)
- Ads (headlines/descriptions visíveis)

### Step 11: Ativação Explícita (gate final)
Perguntar ao operador:
```
Estrutura criada com sucesso (estado PAUSED). Revisar acima.

Ativar campanha agora? Após ativação, o orçamento começa a ser consumido. (s/N)
```
- Se **s**:
  ```bash
  google-ads enable campaign {campaign-id}
  ```
- Se **N**: deixar PAUSED e instruir operador sobre `google-ads enable campaign {id}` ou `google-ads pause campaign {id}` (emergency stop) quando quiser

### Step 12: Persistir Audit Log
O `mutation-log` (Story 6.x) já registra automaticamente cada mutação executada. Confirmar que o log contém:
- timestamp + comando + customer-id + entity-ids criados
- Resultado (success/error) de cada step
Sugerir próximos passos:
1. Aguardar 72h+ para dados estatisticamente relevantes
2. Após 72h → Campaign Optimizer (`*optimize`)
3. Relatório consolidado → Performance Analyst (`*report`)

## Regras
- SEMPRE criar a campanha em PAUSED no Step 6 — ativação é gate humano explícito (Step 11)
- NUNCA pular Step 1-2 (auth + não-MCC)
- NUNCA usar Google Ads UI — toda a cadeia é via CLI autônoma
- Se qualquer comando da cadeia falhar antes do Step 11 → abortar e reportar; a campanha fica PAUSED (sem custo) até operador decidir
- `google-ads pause campaign {id}` é o emergency stop disponível a qualquer momento pós-ativação
- `google-ads remove campaign {id} --confirm-delete` é IRREVERSÍVEL e só executar sob ordem explícita

## Output
- `campaign_id` + `ad_group_id` + lista de `keyword_ids` + lista de `ad_ids`
- Status final (PAUSED ou ENABLED conforme Step 11)
- Snapshot JSON da campanha (Step 10)
- Audit log entries persistidos (Step 12)

## Acceptance Criteria
- [ ] Autenticação verificada com sucesso (Step 1)
- [ ] Conta padrão NÃO é MCC e árvore exibida (Step 2)
- [ ] Plano recebido do Campaign Launcher com 7+ campos (Step 3)
- [ ] Assets uploadados e IDs capturados quando aplicável (Step 4)
- [ ] Resumo apresentado e operador confirmou "s" explicitamente (Step 5)
- [ ] Campanha criada em estado PAUSED (Step 6)
- [ ] Ad group criado para Search/Display (Step 7)
- [ ] Keywords adicionadas para Search (Step 8)
- [ ] Ads (RSA/RDA) criados e populando o ad group (Step 9)
- [ ] Snapshot pré-ativação exibido (Step 10)
- [ ] Ativação só ocorreu após confirmação explícita "s" (Step 11)
- [ ] Audit log persistido com toda a cadeia (Step 12)

## Handoff
- **Próximo agente:** Campaign Optimizer (após 72h+ de dados) via `*optimize`
- **Artefato passado:** `campaign_id` + `ad_group_id` + status final + customer_id + audit log reference
