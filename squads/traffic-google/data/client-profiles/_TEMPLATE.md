# Perfil do Cliente — {{NOME_CLIENTE}}

> **O que é este arquivo:** a "régua" do cliente. Define nicho, objetivo e metas de KPI. O relatório usa isto para classificar cada métrica como 🟢 boa / 🟡 aceitável / 🔴 ruim — em vez de thresholds genéricos. Copie este template para `squads/traffic-google/data/client-profiles/{{slug-do-cliente}}.md` e preencha os `{{placeholders}}`. Para ancorar números por nicho, consulte `data/industry-benchmarks.md`.

## Identificação
| Campo | Valor |
|-------|-------|
| Cliente | {{NOME_CLIENTE}} |
| Conta Google Ads | `{{ID_CONTA}}` |
| MCC / login-customer-id | `{{ID_MCC_OU_—}}` |
| Nicho | {{NICHO}} |
| Ticket / modelo | {{TICKET_OU_MODELO_DE_NEGOCIO}} |
| Objetivo primário | **{{OBJETIVO_PRIMARIO}}** |
| Tipo(s) de campanha | {{SEARCH_PMAX_DISPLAY_VIDEO_SHOPPING}} |
| Moeda | BRL (R$) |

## Metas e réguas (KPI-alvo)
> Preencha **apenas as linhas dos objetivos que este cliente usa**. Apague as demais. O KPI-mestre (em **negrito**) é o que decide escalar/pausar. `{{meta}}` = valor-alvo combinado com o cliente. **Impression Share** só se aplica a Search.

### Se o objetivo é Vendas (e-commerce / Shopping / PMax)
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **ROAS** | ≥ {{roas_bom}} | {{roas_acc}} | < {{roas_ruim}} | {{origem}} |
| **CPA** | ≤ R$ {{cpa_meta}} | até 1,5× | > 1,5× | {{origem}} |
| CTR | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |
| Impression Share (Search) | ≥ {{is_bom}}% | {{is_acc}}% | < {{is_ruim}}% | {{origem}} |

### Se o objetivo é Geração de Leads (Search)
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **CPL** | ≤ R$ {{cpl_meta}} | até 1,5× | > 1,5× | {{origem}} |
| Taxa de conversão | ≥ {{conv_bom}}% | {{conv_acc}}% | < {{conv_ruim}}% | {{origem}} |
| CTR | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |
| **Impression Share (Search)** | ≥ {{is_bom}}% | {{is_acc}}% | < {{is_ruim}}% | {{origem}} |

### Se o objetivo é Tráfego
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **Custo por clique (CPC)** | ≤ R$ {{cpc_bom}} | {{cpc_acc}} | > {{cpc_ruim}} | {{origem}} |
| CTR | ≥ {{ctr_bom}}% | {{ctr_acc}}% | < {{ctr_ruim}}% | {{origem}} |

### Se o objetivo é Reconhecimento (Display / YouTube / Awareness)
| KPI | 🟢 Bom | 🟡 Aceitável | 🔴 Ruim | Origem da régua |
|-----|--------|--------------|---------|-----------------|
| **CPM** | ≤ R$ {{cpm_bom}} | {{cpm_acc}} | > {{cpm_ruim}} | {{origem}} |
| CPV (vídeo) | ≤ R$ {{cpv_bom}} | {{cpv_acc}} | > {{cpv_ruim}} | {{origem}} |
| Frequência (Display/YT) | ≤ {{freq_bom}} | {{freq_acc}} | > {{freq_ruim}} | Padrão (fadiga) |

## Referência interna (campanha-modelo)
- **{{CAMPANHA_PADRAO_OURO}}** é o padrão-ouro da conta: {{KPI_MESTRE}} **R$ {{VALOR_PADRAO}}**. Toda otimização busca replicar este padrão. (É a base do cálculo de desperdício em `../../../traffic-shared/data/action-prioritization.md`.)

## Observações de contexto (ISOLAMENTO — não cruzar com outras contas)
- Esta régua vale **somente** para a conta `{{ID_CONTA}}`. Nunca usar o custo/régua de outro cliente ou nicho como referência aqui.
- Se rodar sob MCC, lembrar de `--login-customer-id {{ID_MCC}}` nas chamadas da CLI.
- {{OBSERVACAO_1}}

## Pendências de medição
- [ ] {{PENDENCIA_1}}
- [ ] {{PENDENCIA_2}}

---
*Template de perfil de cliente · v1.0 · squad traffic-google*
