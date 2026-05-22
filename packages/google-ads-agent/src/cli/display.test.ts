import { describe, it, expect } from 'vitest';
import { formatTree, mask } from './display.js';

interface TestNode {
  customerId: string;
  name?: string;
  currencyCode?: string;
  status?: string;
  level: number;
  isManager: boolean;
}

function node(id: string, level: number, isManager: boolean, name?: string): TestNode {
  return {
    customerId: id,
    level,
    isManager,
    ...(name ? { name } : {}),
    currencyCode: 'BRL',
    status: 'ENABLED',
  };
}

// Strip ANSI codes for assertions (formatTree adds colors to headers)
function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

describe('formatTree', () => {
  it('returns "Nenhuma conta encontrada." when empty', () => {
    expect(stripAnsi(formatTree([]))).toContain('Nenhuma conta encontrada.');
  });

  it('renders single root node without tree characters', () => {
    const out = stripAnsi(formatTree([node('111', 0, false, 'Solo')]));
    expect(out).toContain('111');
    expect(out).toContain('Solo');
    expect(out).not.toContain('├──');
    expect(out).not.toContain('└──');
  });

  it('renders MCC + 2 children with proper branch chars', () => {
    const tree = [
      node('100', 0, true, 'MCC'),
      node('101', 1, false, 'Child A'),
      node('102', 1, false, 'Child B'),
    ];
    const out = stripAnsi(formatTree(tree));
    expect(out).toContain('├── 101'); // first child not last
    expect(out).toContain('└── 102'); // second child IS last at level 1
  });

  it('marks manager column with ✓ for managers, — for others', () => {
    const out = stripAnsi(
      formatTree([
        node('100', 0, true, 'MCC'),
        node('101', 1, false, 'Client'),
      ]),
    );
    expect(out).toContain('✓');
    expect(out).toContain('—');
  });

  it('handles 3-level nesting (MCC → MCC-child → leaf)', () => {
    const tree = [
      node('100', 0, true, 'Top MCC'),
      node('101', 1, true, 'Sub MCC'),
      node('102', 2, false, 'Leaf'),
    ];
    const out = stripAnsi(formatTree(tree));
    // Both intermediate level-1 sub-MCC and level-2 leaf should render
    expect(out).toMatch(/Sub MCC/);
    expect(out).toMatch(/Leaf/);
  });

  it('uses "—" placeholder for missing name/currency/status', () => {
    const tree = [
      { customerId: '111', level: 0, isManager: false },
    ];
    const out = stripAnsi(formatTree(tree));
    // 3 dash placeholders expected: name, currency, status (plus manager = "—")
    const dashMatches = out.match(/—/g) ?? [];
    expect(dashMatches.length).toBeGreaterThanOrEqual(3);
  });

  it('emits header row with the 5 expected columns', () => {
    const out = stripAnsi(formatTree([node('111', 0, false, 'X')]));
    expect(out).toContain('ID');
    expect(out).toContain('Nome');
    expect(out).toContain('Moeda');
    expect(out).toContain('Status');
    expect(out).toContain('Manager?');
  });
});

describe('mask (existing helper — sanity check)', () => {
  it('returns "(empty)" for empty string', () => {
    expect(mask('')).toBe('(empty)');
  });

  it('returns *** for short strings', () => {
    expect(mask('abc')).toBe('***');
  });

  it('shows first 8 chars + ... for long strings', () => {
    expect(mask('1234567890abcdef')).toBe('12345678...');
  });
});
