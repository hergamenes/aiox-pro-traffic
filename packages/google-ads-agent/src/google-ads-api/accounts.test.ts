import { describe, it, expect } from 'vitest';
import { stripCustomersPrefix, buildCustomerClientGaql } from './accounts.js';

describe('stripCustomersPrefix', () => {
  it('strips "customers/" prefix when present', () => {
    expect(stripCustomersPrefix('customers/1234567890')).toBe('1234567890');
  });

  it('returns input unchanged when no prefix', () => {
    expect(stripCustomersPrefix('1234567890')).toBe('1234567890');
  });

  it('handles empty string', () => {
    expect(stripCustomersPrefix('')).toBe('');
  });

  it('handles nested resource paths and extracts only the customer id', () => {
    expect(stripCustomersPrefix('customers/1234567890/campaigns/555')).toBe('1234567890');
  });

  it('does not match if customers segment has non-digit chars', () => {
    expect(stripCustomersPrefix('customers/abc')).toBe('customers/abc');
  });
});

describe('buildCustomerClientGaql', () => {
  const gaql = buildCustomerClientGaql();

  it('selects FROM customer_client', () => {
    expect(gaql).toContain('FROM customer_client');
  });

  it('includes the 7 required attributes', () => {
    const expectedFields = [
      'customer_client.id',
      'customer_client.descriptive_name',
      'customer_client.level',
      'customer_client.manager',
      'customer_client.currency_code',
      'customer_client.status',
      'customer_client.client_customer',
    ];
    for (const field of expectedFields) {
      expect(gaql).toContain(field);
    }
  });

  it('does not include WHERE/LIMIT (returns whole MCC tree)', () => {
    expect(gaql).not.toMatch(/\bWHERE\b/i);
    expect(gaql).not.toMatch(/\bLIMIT\b/i);
  });

  it('is a SELECT query', () => {
    expect(gaql.trim()).toMatch(/^SELECT/i);
  });
});
