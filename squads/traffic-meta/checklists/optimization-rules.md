# Regras de Otimização — Framework de Decisão

## Instruções
Usar este checklist durante cada ciclo de otimização para garantir que as decisões seguem os frameworks pré-definidos.

---

## Pré-Requisitos
- [ ] Dados de pelo menos 3 dias disponíveis
- [ ] KPIs alvo definidos (CPA meta, ROAS meta)
- [ ] Thresholds carregados de `data/kpi-thresholds.md`

## Análise por Item

Para cada campanha/conjunto, verificar:

### Métricas de Volume
- [ ] Impressões suficientes para significância (mín. 1.000)
- [ ] Cliques suficientes para análise (mín. 50)
- [ ] Conversões suficientes para decisão (mín. 5)

### Classificação (aplicar UMA por item)

#### 🟢 Escalar — TODOS devem ser verdade:
- [ ] ROAS > meta por 3+ dias consecutivos
- [ ] CPA < meta por 3+ dias consecutivos
- [ ] Volume de conversões estável ou crescente
- [ ] Frequência < 3.0
- [ ] Ação: Aumentar budget 20-30% por vez

#### 🔴 Pausar — QUALQUER UM verdade:
- [ ] CPA > 2x meta por 3+ dias
- [ ] ROAS < 50% da meta por 3+ dias
- [ ] CTR < 0.5% (link click) por 3+ dias
- [ ] Frequência > 4.0
- [ ] Ação: Pausar imediatamente

#### 🟡 Ajustar — cenário intermediário:
- [ ] CPA entre 1x e 2x da meta
- [ ] ROAS entre 50% e 100% da meta
- [ ] Ações possíveis: trocar criativo, ajustar público, reduzir budget, testar copy

#### ⚪ Manter — tudo dentro da meta:
- [ ] Métricas dentro da meta (±10%)
- [ ] Sem tendência clara de melhora ou piora
- [ ] Ação: Monitorar, reavaliar em 3-5 dias

## Regras de Redistribuição de Budget
- [ ] Nunca redistribuir mais de 30% do budget total de uma vez
- [ ] Priorizar conjuntos com ROAS comprovado
- [ ] Manter pelo menos 2 conjuntos ativos por campanha
- [ ] Documentar toda redistribuição no log

## Validação Final
- [ ] Todas as decisões registradas no log de otimização
- [ ] Justificativa documentada para cada ação
- [ ] Próxima data de revisão definida
