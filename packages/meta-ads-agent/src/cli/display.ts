const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
} as const;

export function colorizeStatus(label: string, status: number): string {
  if (status === 1) return `${COLORS.green}${label}${COLORS.reset}`;
  if (status === 100 || status === 101 || status === 201)
    return `${COLORS.red}${label}${COLORS.reset}`;
  if (status === 7 || status === 9)
    return `${COLORS.yellow}${label}${COLORS.reset}`;
  return label;
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

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(str: string, width: number): string {
  const visible = stripAnsi(str).length;
  const diff = width - visible;
  return diff > 0 ? str + ' '.repeat(diff) : str;
}
