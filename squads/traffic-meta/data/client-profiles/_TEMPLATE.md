# Perfil do Cliente — {{NOME_CLIENTE}}

> **O que é este arquivo:** a "régua" do cliente. Define nicho, objetivo e metas de KPI. O relatório usa isto para classificar cada métrica como 🟢 boa / 🟡 aceitável / 🔴 ruim — em vez de thresholds genéricos.
>
> **Onde criar o perfil (convenção por projeto — Story 8.3):** copie este template para **`reports/{cliente-plataforma-id}/client-profile.md`** no projeto do cliente (ex.: `reports/{cliente}-meta-{accountId}/client-profile.md`) e preencha os `{{placeholders}}`. **NUNCA** salve perfis de cliente real dentro de `squads/` — squads são copiados entre projetos e dados de cliente não podem vazar (isolamento por construção).

## Identificação
| Campo | Valor |
|-------|-------|
| Cliente | {{NOME_CLIENTE}} |
| Conta Meta | `{{ID_CONTA}}` |
| Nicho | {{NICHO}} |
| Ticket / modelo | {{TICKET_OU_MODELO_DE_NEGOCIO}} |
| Objetivo primário | **{{OBJETIVO_PRIMARIO}}** |
| Objetivo secundário | {{OBJETIVO_SECUNDARIO_OU_—}} |
| Moeda | BRL (R$) |

## Metas e réguas (KPI-alvo)
> Preencha **apenas as linhas dos objetivos que este cliente usa**. Apague as demais. O KPI-mestre (em **negrito**) é o que decide escalar/pausar. `{{meta}}` = valor-alvo combinado com o cliente.

### Se o objetivo é Vendas (e-commerce)
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **ROAS** | ≥ {{roas_bom}} | {{roas_acc}} | < {{roas_ruim}} | {{origem}} |
| **CPA** | ≤ R$ {{cpa_meta}} | até 1,5× | > 1,5× | {{origem}} |
| CTR (link) | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |

### Se o objetivo é Geração de Leads
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **CPL** | ≤ R$ {{cpl_meta}} | até 1,5× | > 1,5× | {{origem}} |
| Taxa LP→Lead | ≥ {{conv_bom}}% | {{conv_acc}}% | < {{conv_ruim}}% | {{origem}} |
| CTR (link) | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |

### Se o objetivo é Mensagens / Click-to-WhatsApp
> Não há CPA/ROAS — o negócio fecha por conversa no WhatsApp. KPI-mestre = **custo por conversa iniciada**.
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **Custo por conversa (WhatsApp)** | ≤ R$ {{conv_meta}} | {{conv_acc}} | > {{conv_ruim}} | {{origem}} |
| Taxa Clique→Conversa | ≥ {{taxa_bom}}% | {{taxa_acc}}% | < {{taxa_ruim}}% | {{origem}} |
| CTR (CTWA) | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |

### Se o objetivo é Tráfego
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **Custo por clique (CPC)** | ≤ R$ {{cpc_bom}} | {{cpc_acc}} | > {{cpc_ruim}} | {{origem}} |
| CTR | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |

### Se o objetivo é Reconhecimento (Awareness)
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **CPM** | ≤ R$ {{cpm_bom}} | {{cpm_acc}} | > {{cpm_ruim}} | {{origem}} |
| Frequência (7d) | ≤ {{freq_bom}} | {{freq_acc}} | > {{freq_ruim}} | Padrão Meta (fadiga) |

## Referência interna (campanha-modelo)
- **{{CAMPANHA_PADRAO_OURO}}** é o padrão-ouro da conta: {{KPI_MESTRE}} **R$ {{VALOR_PADRAO}}**, criativo campeão **{{AD_CAMPEAO}}**. Toda otimização busca replicar este padrão. (É a base do cálculo de desperdício em `../../../traffic-shared/data/action-prioritization.md`.)

## Observações de contexto (ISOLAMENTO — não cruzar com outras contas)
- Esta régua vale **somente** para a conta `{{ID_CONTA}}`. Nunca usar o custo/régua de outro cliente ou nicho como referência aqui.
- {{OBSERVACAO_1}}
- {{OBSERVACAO_2}}

## Pendências de medição
- [ ] {{PENDENCIA_1}}
- [ ] {{PENDENCIA_2}}

---
*Template de perfil de cliente · v1.0 · squad traffic-meta*
