import type { RawInsightRow } from '../types/insights.js';

export function filterByTag(rows: RawInsightRow[], tag: string): RawInsightRow[] {
  const tagLower = tag.toLowerCase();
  return rows.filter((row) => {
    const name = row.campaign_name ?? '';
    return name.toLowerCase().includes(tagLower);
  });
}
