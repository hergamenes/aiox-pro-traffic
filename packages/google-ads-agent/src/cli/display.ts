const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
} as const;

export function colorize(label: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${label}${COLORS.reset}`;
}

export function formatTable(headers: string[], rows: string[][]): string {
  if (rows.length === 0) {
    return `${COLORS.dim}Nenhum resultado encontrado.${COLORS.reset}`;
  }

  const colWidths = headers.map((h, i) => {
    const maxRow = rows.reduce(
      (max, row) => Math.max(max, stripAnsi(row[i] ?? '').length),
      0,
    );
    return Math.max(stripAnsi(h).length, maxRow);
  });

  const headerLine = headers
    .map((h, i) => `${COLORS.bold}${pad(h, colWidths[i])}${COLORS.reset}`)
    .join('  ');

  const separator = colWidths.map((w) => '─'.repeat(w)).join('──');

  const dataLines = rows.map((row) =>
    row.map((cell, i) => pad(cell, colWidths[i])).join('  '),
  );

  return [headerLine, separator, ...dataLines].join('\n');
}

export function mask(value: string, visibleChars = 8): string {
  if (!value) return '(empty)';
  if (value.length <= visibleChars) return '***';
  return `${value.slice(0, visibleChars)}...`;
}

interface TreeRow {
  customerId: string;
  name?: string;
  currencyCode?: string;
  status?: string;
  level: number;
  isManager: boolean;
}

/**
 * Renders a flat array of tree nodes as an indented multi-line table.
 * Indentation is driven by the `level` field (0 = root, 1 = first
 * descendants, etc.). Uses box-drawing characters for visual hierarchy.
 *
 * Determining whether each node is the LAST sibling at its level
 * requires looking ahead in the array — the algorithm groups by
 * (parentId, level) and renders `└──` for the last child of a group
 * and `├──` for intermediate ones.
 */
export function formatTree(nodes: TreeRow[]): string {
  if (nodes.length === 0) {
    return `${COLORS.dim}Nenhuma conta encontrada.${COLORS.reset}`;
  }

  const headers = ['ID', 'Nome', 'Moeda', 'Status', 'Manager?'];

  // First pass: build display rows (indented identifier + other columns)
  type DisplayRow = { id: string; name: string; currency: string; status: string; manager: string };
  const displayRows: DisplayRow[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = isLastAtLevel(nodes, i);
    const prefix = buildTreePrefix(node.level, isLast);

    displayRows.push({
      id: `${prefix}${node.customerId}`,
      name: node.name ?? '—',
      currency: node.currencyCode ?? '—',
      status: node.status ?? '—',
      manager: node.isManager ? '✓' : '—',
    });
  }

  const colWidths = [
    Math.max(headers[0].length, ...displayRows.map((r) => r.id.length)),
    Math.max(headers[1].length, ...displayRows.map((r) => r.name.length)),
    Math.max(headers[2].length, ...displayRows.map((r) => r.currency.length)),
    Math.max(headers[3].length, ...displayRows.map((r) => r.status.length)),
    Math.max(headers[4].length, ...displayRows.map((r) => r.manager.length)),
  ];

  const headerLine = headers
    .map((h, i) => `${COLORS.bold}${pad(h, colWidths[i])}${COLORS.reset}`)
    .join('  ');
  const separator = colWidths.map((w) => '─'.repeat(w)).join('──');
  const dataLines = displayRows.map(
    (r) =>
      `${pad(r.id, colWidths[0])}  ${pad(r.name, colWidths[1])}  ${pad(r.currency, colWidths[2])}  ${pad(r.status, colWidths[3])}  ${pad(r.manager, colWidths[4])}`,
  );

  return [headerLine, separator, ...dataLines].join('\n');
}

function buildTreePrefix(level: number, isLast: boolean): string {
  if (level === 0) return '';
  const indent = '  '.repeat(Math.max(0, level - 1));
  const branch = isLast ? '└── ' : '├── ';
  return indent + branch;
}

function isLastAtLevel(nodes: TreeRow[], index: number): boolean {
  const node = nodes[index];
  if (node.level === 0) return true;
  // Search forward for any node at the SAME level. If found, this is
  // not the last. We stop searching when we encounter a node at a
  // LOWER level (i.e. we left the current sibling group).
  for (let j = index + 1; j < nodes.length; j++) {
    if (nodes[j].level < node.level) break;
    if (nodes[j].level === node.level) return false;
  }
  return true;
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(str: string, width: number): string {
  const visible = stripAnsi(str).length;
  const diff = width - visible;
  return diff > 0 ? str + ' '.repeat(diff) : str;
}

export { COLORS };
