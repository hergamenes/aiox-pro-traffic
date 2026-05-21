import type { ParsedMetrics } from '../types/insights.js';
import { formatTable } from '../cli/display.js';

function fmtCurrency(value: number, currency?: string): string {
  const symbol = currency === 'USD' ? '$' : currency === 'BRL' ? 'R$' : '';
  return `${symbol} ${value.toFixed(2)}`;
}

function fmtNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

function fmtPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatTable_(metrics: ParsedMetrics[]): string {
  if (metrics.length === 0) {
    return 'Nenhum resultado encontrado.';
  }
  const currency = metrics[0]?.currencyCode;
  const headers = [
    'ID',
    'Nome',
    'Gasto',
    'Impr.',
    'Cliques',
    'CTR',
    'CPC',
    'Conv.',
    'CPA',
    'ROAS',
  ];
  const rows = metrics.map((m) => [
    m.id,
    truncate(m.name, 40),
    fmtCurrency(m.spend, currency),
    fmtNumber(m.impressions),
    fmtNumber(m.clicks),
    fmtPercent(m.ctr),
    fmtCurrency(m.cpc, currency),
    fmtNumber(m.conversions),
    m.cpa !== undefined ? fmtCurrency(m.cpa, currency) : '—',
    m.roas !== undefined ? m.roas.toFixed(2) : '—',
  ]);
  return formatTable(headers, rows);
}

export { formatTable_ as formatTableReport };

export function formatJson(metrics: ParsedMetrics[]): string {
  return JSON.stringify(metrics, null, 2);
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}
