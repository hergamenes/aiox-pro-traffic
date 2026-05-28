# KPI Thresholds — Valores de Referência

## Instruções
Estes são valores padrão de referência. Cada cliente/campanha pode ter metas específicas que substituem estes valores.

---

## Thresholds por Objetivo

### Vendas (E-commerce)

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **ROAS** | > 3.0 | 2.0 - 3.0 | 1.0 - 2.0 | < 1.0 |
| **CPA** | < R$ meta | R$ meta - 1.5x | 1.5x - 2x meta | > 2x meta |
| **CTR (link)** | > 2.0% | 1.0% - 2.0% | 0.5% - 1.0% | < 0.5% |
| **CPC** | < R$ 1.50 | R$ 1.50 - 3.00 | R$ 3.00 - 5.00 | > R$ 5.00 |
| **Frequência** | < 2.0 | 2.0 - 3.0 | 3.0 - 4.0 | > 4.0 |

### Geração de Leads

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **CPL** | < R$ meta | R$ meta - 1.5x | 1.5x - 2x meta | > 2x meta |
| **CTR (link)** | > 1.5% | 0.8% - 1.5% | 0.5% - 0.8% | < 0.5% |
| **Taxa LP→Lead** | > 20% | 10% - 20% | 5% - 10% | < 5% |
| **CPC** | < R$ 2.00 | R$ 2.00 - 4.00 | R$ 4.00 - 7.00 | > R$ 7.00 |
| **Frequência** | < 2.5 | 2.5 - 3.5 | 3.5 - 4.5 | > 4.5 |

### Tráfego (Awareness)

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **CPC** | < R$ 0.50 | R$ 0.50 - 1.00 | R$ 1.00 - 2.00 | > R$ 2.00 |
| **CTR** | > 3.0% | 1.5% - 3.0% | 0.8% - 1.5% | < 0.8% |
| **CPM** | < R$ 15 | R$ 15 - 30 | R$ 30 - 50 | > R$ 50 |
| **Frequência** | < 2.0 | 2.0 - 3.0 | 3.0 - 4.0 | > 4.0 |

### Reconhecimento (Awareness puro)

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **CPM** | < R$ 12 | R$ 12 - 25 | R$ 25 - 40 | > R$ 40 |
| **Alcance** | crescente | estável | em queda | estagnado |
| **Frequência** | < 2.0 | 2.0 - 3.0 | 3.0 - 4.0 | > 4.0 |

### WhatsApp (Click-to-WhatsApp / Conversas)

> Objetivo `whatsapp`. A "conversão" aqui é a **conversa iniciada** no WhatsApp — a CLI reporta 0 compras/leads por design (o evento é a conversa). O KPI principal é **custo por conversa iniciada**.

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **Custo por conversa iniciada** | < R$ meta | R$ meta - 1.5x | 1.5x - 2x meta | > 2x meta |
| **Custo por lead qualificado** | < R$ meta | R$ meta - 1.5x | 1.5x - 2x meta | > 2x meta |
| **CTR (link/CTWA)** | > 1.5% | 0.8% - 1.5% | 0.5% - 0.8% | < 0.5% |
| **Taxa Clique→Conversa** | > 60% | 40% - 60% | 20% - 40% | < 20% |
| **Frequência** | < 2.5 | 2.5 - 3.5 | 3.5 - 4.5 | > 4.5 |

> Nota: "lead qualificado" e taxa de qualificação dependem do atendimento humano no WhatsApp — informe a meta do cliente. A CLI lê eventos de mensageria no relatório (`meta-ads report`).

### Engajamento

| KPI | Bom | Aceitável | Ruim | Crítico |
|-----|-----|-----------|------|---------|
| **Custo por engajamento** | < R$ 0.20 | R$ 0.20 - 0.50 | R$ 0.50 - 1.00 | > R$ 1.00 |
| **Taxa de engajamento** | > 5% | 2% - 5% | 1% - 2% | < 1% |
| **Frequência** | < 2.5 | 2.5 - 3.5 | 3.5 - 4.5 | > 4.5 |

---

## Regras de Decisão

### Quando Escalar
- KPI principal na zona "Bom" por **3+ dias consecutivos**
- Volume de conversões **estável ou crescente**
- Frequência na zona "Bom" ou "Aceitável"
- Incremento recomendado: **20-30% do budget**

### Quando Pausar
- KPI principal na zona "Crítico" por **3+ dias**
- OU Frequência na zona "Crítico"
- OU CTR na zona "Crítico" por **5+ dias**

### Quando Ajustar
- KPI principal na zona "Ruim" por **3+ dias**
- Opções: trocar criativo, ajustar público, reduzir budget, testar copy
- Reavaliar em **3-5 dias** após ajuste

### Quando Manter
- KPI principal na zona "Aceitável"
- Sem tendência clara
- Reavaliar em **5-7 dias**

---

## Notas
- Valores em BRL (Real Brasileiro)
- Thresholds de CPC e CPL variam muito por nicho — ajustar conforme cliente
- Mínimo de **1.000 impressões** e **50 cliques** para considerar dados significativos
- Mínimo de **5 conversões** para decidir escalar/pausar
