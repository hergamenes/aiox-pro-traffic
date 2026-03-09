import { describe, it, expect } from 'vitest';
import { formatTable } from '../../../src/cli/display.js';

describe('display', () => {
  describe('formatTable', () => {
    it('should align columns correctly', () => {
      const headers = ['ID', 'Nome', 'Status'];
      const rows = [
        ['123', 'Conta A', 'Ativa'],
        ['456789', 'Conta B Longa', 'Suspensa'],
      ];

      const output = formatTable(headers, rows);
      const lines = output.split('\n');

      expect(lines.length).toBe(4); // header + separator + 2 rows
      expect(lines[1]).toMatch(/^─+$/); // separator line
    });

    it('should handle empty data', () => {
      const output = formatTable(['ID', 'Nome'], []);
      expect(output).toContain('Nenhum resultado encontrado');
    });

    it('should handle single row', () => {
      const headers = ['ID', 'Nome'];
      const rows = [['1', 'Teste']];

      const output = formatTable(headers, rows);
      const lines = output.split('\n');

      expect(lines.length).toBe(3); // header + separator + 1 row
    });
  });
});
