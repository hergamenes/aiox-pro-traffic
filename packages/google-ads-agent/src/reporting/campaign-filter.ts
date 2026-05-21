import type { ParsedMetrics } from '../types/insights.js';

/**
 * Case-insensitive substring filter on row name.
 *
 * Mirrors meta-ads-agent campaign-filter behavior so squad consumers
 * get the same semantics when using `--tag`.
 */
export function filterByTag(rows: ParsedMetrics[], tag: string | undefined): ParsedMetrics[] {
  if (!tag) return rows;
  const needle = tag.toLowerCase();
  return rows.filter((r) => r.name.toLowerCase().includes(needle));
}
