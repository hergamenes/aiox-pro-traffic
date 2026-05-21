# Guia do Usuário — Squad de Tráfego Pago

## Para que serve este squad?

Este squad automatiza as 3 operações principais de um gestor de tráfego:

1. **Lançar campanhas** com validação completa antes de publicar
2. **Otimizar campanhas** com regras claras de decisão (escalar, pausar, ajustar)
3. **Gerar relatórios** consolidados com recomendações acionáveis

## Quando usar cada agente?

### 🚀 Campaign Launcher — "Vou subir uma campanha"
Use ANTES de publicar qualquer campanha. Ele vai:
- Pedir as informações do briefing
- Montar a estrutura (campanha → conjuntos → anúncios)
- Validar UTMs, segmentação, criativos e budget
- Executar checklist obrigatório
- Gerar o plano final

**Comando:** `/trafficMeta:agents:campaign-launcher` depois `*launch`

### ⚡ Campaign Optimizer — "Preciso otimizar minhas campanhas"
Use quando tiver dados de performance (mínimo 3 dias). Ele vai:
- Receber seus dados (cole CSV, texto ou descreva as métricas)
- Comparar contra thresholds definidos
- Classificar cada item (escalar, pausar, ajustar, manter)
- Sugerir redistribuição de budget
- Registrar tudo no log de otimização

**Comando:** `/trafficMeta:agents:campaign-optimizer` depois `*optimize`

### 📊 Performance Analyst — "Preciso de um relatório"
Use para consolidar dados e gerar relatórios. Ele vai:
- Unificar dados de múltiplas plataformas
- Calcular todas as métricas
- Analisar funil de conversão
- Comparar com período anterior
- Entregar recomendações acionáveis

**Comando:** `/trafficMeta:agents:performance-analyst` depois `*report`

## Fluxo típico de trabalho

```
1. Receber briefing do cliente
2. 🚀 *launch → Estruturar e validar campanha
3. Publicar campanha na plataforma
4. Esperar 3-7 dias de dados
5. ⚡ *optimize → Analisar e otimizar
6. Repetir otimização semanalmente
7. 📊 *report → Gerar relatório para o cliente
```

## Dicas

- **Sempre valide antes de subir** — O checklist pré-lançamento evita erros caros
- **Mínimo 3 dias de dados** — Decisões com menos dados são arriscadas
- **Documente tudo** — O log de otimização é seu histórico de decisões
- **Ajuste os thresholds** — Os valores padrão servem como base, ajuste por cliente
