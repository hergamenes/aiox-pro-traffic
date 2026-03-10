import { describe, it, expect } from 'vitest';
import { generateCampaignName } from '../../../src/campaign/naming.js';

describe('generateCampaignName', () => {
  const fixedDate = new Date(2026, 2, 9); // March 9, 2026

  it('should generate correct name for sales type', () => {
    const result = generateCampaignName('sales', 'BlackFriday', fixedDate);
    expect(result).toBe('PPT_VENDAS_COMPRA_09-03-26_BlackFriday');
  });

  it('should generate correct name for leads type', () => {
    const result = generateCampaignName('leads', 'Webinar', fixedDate);
    expect(result).toBe('PPT_LEADS_LP_09-03-26_Webinar');
  });

  it('should handle special characters by stripping accents', () => {
    const result = generateCampaignName('sales', 'Promoção Especial', fixedDate);
    expect(result).toBe('PPT_VENDAS_COMPRA_09-03-26_Promocao_Especial');
  });

  it('should replace spaces with underscores', () => {
    const result = generateCampaignName('sales', 'My Campaign', fixedDate);
    expect(result).toBe('PPT_VENDAS_COMPRA_09-03-26_My_Campaign');
  });

  it('should remove non-alphanumeric characters', () => {
    const result = generateCampaignName('sales', 'Test@#$Name', fixedDate);
    expect(result).toBe('PPT_VENDAS_COMPRA_09-03-26_TestName');
  });
});
