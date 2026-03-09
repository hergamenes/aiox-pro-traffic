import { describe, it, expect } from 'vitest';
import { program } from '../../../src/cli/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../../../package.json') as { version: string };

describe('CLI', () => {
  it('should display version from package.json', () => {
    expect(program.version()).toBe(pkg.version);
  });

  it('should display help text with program name meta-ads', () => {
    const helpText = program.helpInformation();
    expect(helpText).toContain('meta-ads');
    expect(helpText).toContain('Usage');
  });
});
