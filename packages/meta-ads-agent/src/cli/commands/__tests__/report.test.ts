import { describe, it, expect } from 'vitest';
import { reportCommand } from '../report.js';

describe('reportCommand', () => {
  it('is registered with name "report"', () => {
    expect(reportCommand.name()).toBe('report');
  });

  it('has description in Portuguese', () => {
    expect(reportCommand.description()).toContain('performance');
  });

  it('has --period option with default 7d', () => {
    const periodOption = reportCommand.options.find((o) => o.long === '--period');
    expect(periodOption).toBeDefined();
    expect(periodOption?.defaultValue).toBe('7d');
  });

  it('has --from and --to options', () => {
    const fromOption = reportCommand.options.find((o) => o.long === '--from');
    const toOption = reportCommand.options.find((o) => o.long === '--to');
    expect(fromOption).toBeDefined();
    expect(toOption).toBeDefined();
  });

  it('has --level option', () => {
    const levelOption = reportCommand.options.find((o) => o.long === '--level');
    expect(levelOption).toBeDefined();
  });

  it('has --format option with default table', () => {
    const formatOption = reportCommand.options.find((o) => o.long === '--format');
    expect(formatOption).toBeDefined();
    expect(formatOption?.defaultValue).toBe('table');
  });

  it('has --campaign-id option', () => {
    const campaignIdOption = reportCommand.options.find((o) => o.long === '--campaign-id');
    expect(campaignIdOption).toBeDefined();
  });

  it('has --tag option', () => {
    const tagOption = reportCommand.options.find((o) => o.long === '--tag');
    expect(tagOption).toBeDefined();
  });

  it('accepts optional ad-account-id argument', () => {
    const args = reportCommand.registeredArguments;
    expect(args).toHaveLength(1);
    expect(args[0].name()).toBe('ad-account-id');
    expect(args[0].required).toBe(false);
  });
});
