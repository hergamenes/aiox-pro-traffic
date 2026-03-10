import { describe, it, expect, vi } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
  number: vi.fn(),
}));

import {
  promptCampaignType,
  promptAdName,
  promptBudget,
  promptWebsiteUrl,
  promptLandingPageUrl,
  promptAdTexts,
} from '../../../src/cli/prompts.js';
import { input, select, number } from '@inquirer/prompts';

const mockInput = vi.mocked(input);
const mockSelect = vi.mocked(select);
const mockNumber = vi.mocked(number);

describe('prompts', () => {
  it('promptCampaignType should return selected campaign type', async () => {
    mockSelect.mockResolvedValue('sales');

    const result = await promptCampaignType();

    expect(result).toBe('sales');
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Tipo de campanha:' }),
    );
  });

  it('promptCampaignType should return leads when selected', async () => {
    mockSelect.mockResolvedValue('leads');

    const result = await promptCampaignType();

    expect(result).toBe('leads');
  });

  it('promptAdName should return text input', async () => {
    mockInput.mockResolvedValue('BlackFriday');

    const result = await promptAdName();

    expect(result).toBe('BlackFriday');
    expect(mockInput).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Nome do anúncio:' }),
    );
  });

  it('promptBudget should return positive number', async () => {
    mockNumber.mockResolvedValue(50);

    const result = await promptBudget();

    expect(result).toBe(50);
    expect(mockNumber).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Orçamento diário (R$):' }),
    );
  });

  it('promptWebsiteUrl should return URL string', async () => {
    mockInput.mockResolvedValue('https://example.com');

    const result = await promptWebsiteUrl();

    expect(result).toBe('https://example.com');
    expect(mockInput).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'URL do site:' }),
    );
  });

  it('promptLandingPageUrl should return URL string', async () => {
    mockInput.mockResolvedValue('https://minha-lp.com');

    const result = await promptLandingPageUrl();

    expect(result).toBe('https://minha-lp.com');
    expect(mockInput).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'URL da landing page:' }),
    );
  });

  it('promptAdTexts should return headline, primaryText, description', async () => {
    mockInput
      .mockResolvedValueOnce('Oferta Especial')
      .mockResolvedValueOnce('Compre agora com desconto')
      .mockResolvedValueOnce('Promoção limitada');

    const result = await promptAdTexts();

    expect(result).toEqual({
      headline: 'Oferta Especial',
      primaryText: 'Compre agora com desconto',
      description: 'Promoção limitada',
    });
  });
});
