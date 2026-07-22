import type { ParsedMetrics, InsightsLevel } from '../types/insights.js';

function formatMoney(value: number): string {
  if (value === 0) return '—';
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  if (value === 0) return '—';
  return `${(value * 100).toFixed(2)}%`;
}

function formatNumber(value: number): string {
  if (value === 0) return '—';
  return value.toLocaleString('pt-BR');
}

function formatDecimal(value: number): string {
  if (value === 0) return '—';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getEntityName(metrics: ParsedMetrics, level: InsightsLevel): string {
  switch (level) {
    case 'campaign':
      return metrics.campaignName ?? metrics.campaignId ?? '—';
    case 'adset':
      return metrics.adsetName ?? metrics.adsetId ?? '—';
    case 'ad':
      return metrics.adName ?? metrics.adId ?? '—';
    default:
      return 'Conta';
  }
}

function getLevelLabel(level: InsightsLevel): string {
  const labels: Record<InsightsLevel, string> = {
    account: 'Conta',
    campaign: 'Campanha',
    adset: 'Conjunto',
    ad: 'Anúncio',
  };
  return labels[level];
}

function pad(str: string, width: number): string {
  return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

function padLeft(str: string, width: number): string {
  return str.length >= width ? str : ' '.repeat(width - str.length) + str;
}

export function formatTable(metrics: ParsedMetrics[], level: InsightsLevel): string {
  if (metrics.length === 0) {
    return 'Nenhum dado encontrado para o período selecionado.';
  }

  const lines: string[] = [];
  const levelLabel = getLevelLabel(level);

  for (const m of metrics) {
    const name = getEntityName(m, level);
    lines.push('');
    lines.push(`━━━ ${levelLabel}: ${name} ━━━`);
    lines.push('');

    const rows: [string, string][] = [
      ['Valor Gasto', formatMoney(m.spend)],
      ['Orçamento', m.budget !== null ? formatMoney(m.budget) : '—'],
      ['Impressões', formatNumber(m.impressions)],
      ['CPM', formatMoney(m.cpm)],
      ['Frequência', formatDecimal(m.frequency)],
      ['', ''],
      ['Cliques no Link', formatNumber(m.linkClicks)],
      ['CPC Link', formatMoney(m.cpcLink)],
      ['CTR no Link', formatPercent(m.ctrLink / 100)],
      ['', ''],
      ['Visualiz. Página Destino', formatNumber(m.landingPageViews)],
      ['Custo por Visualiz.', formatMoney(m.costPerLandingPageView)],
      ['Taxa Visualiz./Cliques', formatPercent(m.landingPageViewRate)],
      ['', ''],
      ['Conversões (Total)', formatNumber(m.conversions)],
      ['Custo por Conversão', formatMoney(m.costPerConversion)],
      ['', ''],
      ['Finaliz. de Compra', formatNumber(m.initiateCheckout)],
      ['Custo por Finaliz.', formatMoney(m.costPerInitiateCheckout)],
      ['Compras', formatNumber(m.purchases)],
      ['Custo por Compra', formatMoney(m.costPerPurchase)],
      ['Faturamento', m.revenue > 0 ? formatMoney(m.revenue) : '—'],
      ['ROAS', m.roas > 0 ? formatDecimal(m.roas) : '—'],
      ['', ''],
      ['Leads', formatNumber(m.leads)],
      ['Custo por Lead', formatMoney(m.costPerLead)],
      ['', ''],
      ['Conversas WhatsApp', formatNumber(m.messagingConversationsStarted)],
      ['Custo por Conversa', formatMoney(m.costPerMessagingConversation)],
      ['Primeiras Respostas', formatNumber(m.messagingFirstReplies)],
      ['Conexões de Mensagem', formatNumber(m.totalMessagingConnections)],
      ['', ''],
      ['Resultado', formatNumber(m.results)],
      ['Custo por Resultado', formatMoney(m.costPerResult)],
      ['', ''],
      ['Taxa Compras/Cliques', formatPercent(m.purchaseRateByClicks)],
      ['Taxa Compras/Visualiz.', formatPercent(m.purchaseRateByLandingPageViews)],
    ];

    const maxLabel = Math.max(...rows.filter(([l]) => l).map(([l]) => l.length));

    for (const [label, value] of rows) {
      if (!label) {
        lines.push('');
        continue;
      }
      lines.push(`  ${pad(label, maxLabel)}  ${padLeft(value, 16)}`);
    }
  }

  return lines.join('\n');
}

export function formatJson(metrics: ParsedMetrics[]): string {
  return JSON.stringify(metrics, null, 2);
}
