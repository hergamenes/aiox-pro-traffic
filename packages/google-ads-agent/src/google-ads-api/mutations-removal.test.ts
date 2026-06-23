import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture every GAQL string passed to customer.query so we can assert
// the queries are valid GAQL (no unsupported constants/subqueries).
const queries: string[] = [];

// Programmable responses keyed by a substring match on the query.
type Responder = (q: string) => unknown[];
let responder: Responder = () => [];

const fakeCustomer = {
  query: vi.fn(async (q: string) => {
    queries.push(q);
    return responder(q);
  }),
  mutateResources: vi.fn(async (_operations?: unknown) => ({})),
};

vi.mock('./client.js', () => ({
  getCustomer: () => fakeCustomer,
}));

import {
  readCampaignRemovalSnapshot,
  removeCampaign,
  removeKeyword,
  removeAdGroup,
} from './mutations.js';

const fakeClient = {} as unknown as Parameters<typeof readCampaignRemovalSnapshot>[0];

beforeEach(() => {
  queries.length = 0;
  responder = () => [];
  fakeCustomer.query.mockClear();
  fakeCustomer.mutateResources.mockClear();
});

describe('readCampaignRemovalSnapshot — GAQL validity', () => {
  it('never uses unsupported LAST_24_HOURS or LAST_90_DAYS constants', async () => {
    responder = (q) => {
      if (q.includes('FROM campaign') && q.includes('campaign.name')) {
        return [
          {
            campaign: { id: 123, name: 'Test', status: 2, bidding_strategy_type: 6 },
            campaign_budget: { amount_micros: 50000000 },
            customer: { currency_code: 'BRL' },
          },
        ];
      }
      return [];
    };

    await readCampaignRemovalSnapshot(fakeClient, 'rt', '111-222-3333', '123', undefined);

    const all = queries.join('\n');
    expect(all).not.toContain('LAST_24_HOURS');
    expect(all).not.toContain('LAST_90_DAYS');
    expect(all).not.toContain('DURING LAST_');
    // Spend windows must use BETWEEN ranges.
    expect(all).toMatch(/segments\.date BETWEEN '\d{4}-\d{2}-\d{2}' AND '\d{4}-\d{2}-\d{2}'/);
  });

  it('counts ads without a GAQL subquery (literal IN list)', async () => {
    responder = (q) => {
      if (q.includes('campaign.name')) {
        return [
          {
            campaign: { id: 123, name: 'Test', status: 2, bidding_strategy_type: 6 },
            campaign_budget: { amount_micros: 1 },
            customer: { currency_code: 'BRL' },
          },
        ];
      }
      if (q.includes('FROM ad_group') && q.includes('ad_group.id')) {
        return [{ ad_group: { id: 10 } }, { ad_group: { id: 20 } }];
      }
      if (q.includes('FROM ad_group_ad')) {
        return [{}, {}, {}]; // 3 ads
      }
      return [];
    };

    const snap = await readCampaignRemovalSnapshot(
      fakeClient,
      'rt',
      '111-222-3333',
      '123',
      undefined,
    );

    expect(snap.adGroupCount).toBe(2);
    expect(snap.adCount).toBe(3);

    const adQuery = queries.find((q) => q.includes('FROM ad_group_ad'));
    expect(adQuery).toBeDefined();
    // Must NOT contain a subquery
    expect(adQuery).not.toMatch(/IN\s*\(\s*SELECT/i);
    // Must contain a literal IN list with the ad_group resource names
    expect(adQuery).toContain("'customers/1112223333/adGroups/10'");
    expect(adQuery).toContain("'customers/1112223333/adGroups/20'");
  });

  it('returns 0 spend gracefully when a window query throws', async () => {
    responder = (q) => {
      if (q.includes('campaign.name')) {
        return [
          {
            campaign: { id: 123, name: 'T', status: 2, bidding_strategy_type: 6 },
            campaign_budget: { amount_micros: 1 },
            customer: { currency_code: 'BRL' },
          },
        ];
      }
      if (q.includes('cost_micros')) {
        throw new Error('boom');
      }
      return [];
    };

    const snap = await readCampaignRemovalSnapshot(
      fakeClient,
      'rt',
      '111-222-3333',
      '123',
      undefined,
    );
    expect(snap.spend90dMicros).toBe(0);
    expect(snap.spend7dMicros).toBe(0);
    expect(snap.spend24hMicros).toBe(0);
  });
});

describe('removeCampaign — real cascade counts', () => {
  it('populates cascade from live ad_group/ad counts (not hardcoded 0,0)', async () => {
    responder = (q) => {
      if (q.includes('FROM ad_group') && q.includes('ad_group.id')) {
        return [{ ad_group: { id: 10 } }];
      }
      if (q.includes('FROM ad_group_ad')) {
        return [{}, {}];
      }
      return [];
    };

    const result = await removeCampaign(fakeClient, '111-222-3333', '123', 'rt');

    expect(result.cascade.adGroupCount).toBe(1);
    expect(result.cascade.adCount).toBe(2);
    expect(fakeCustomer.mutateResources).toHaveBeenCalledTimes(1);

    const all = queries.join('\n');
    expect(all).not.toMatch(/IN\s*\(\s*SELECT/i);
  });

  it('falls back to 0 counts if count queries fail (removal still proceeds)', async () => {
    responder = () => {
      throw new Error('count failed');
    };

    const result = await removeCampaign(fakeClient, '111-222-3333', '123', 'rt');
    expect(result.cascade).toEqual({ adGroupCount: 0, adCount: 0 });
    expect(fakeCustomer.mutateResources).toHaveBeenCalledTimes(1);
  });
});

// Regression guard for RESOURCE_NAME_MALFORMED ('[object Object]').
// The google-ads-api lib maps a `remove` operation's `resource` straight into
// the protobuf `remove` field, which MUST be the resource_name string. Passing
// an object ({ resource_name }) serialized to "[object Object]" and the API
// rejected it. These tests assert the operation carries a bare string.
describe('remove operations — resource must be a bare resource_name string', () => {
  function firstOpResource() {
    const ops = fakeCustomer.mutateResources.mock.calls[0]?.[0] as Array<{
      operation: string;
      resource: unknown;
    }>;
    expect(Array.isArray(ops)).toBe(true);
    expect(ops[0].operation).toBe('remove');
    return ops[0].resource;
  }

  it('removeKeyword passes the criterion resource_name as a string (not an object)', async () => {
    await removeKeyword(fakeClient, '111-222-3333', '456', '789', 'rt');
    const resource = firstOpResource();
    expect(typeof resource).toBe('string');
    expect(resource).toBe('customers/1112223333/adGroupCriteria/456~789');
  });

  it('removeCampaign passes the campaign resource_name as a string (not an object)', async () => {
    await removeCampaign(fakeClient, '111-222-3333', '123', 'rt');
    const resource = firstOpResource();
    expect(typeof resource).toBe('string');
    expect(resource).toMatch(/^customers\/1112223333\/campaigns\/123$/);
  });

  it('removeAdGroup passes the ad_group resource_name as a string (not an object)', async () => {
    await removeAdGroup(fakeClient, '111-222-3333', '10', 'rt');
    const resource = firstOpResource();
    expect(typeof resource).toBe('string');
    expect(resource).toBe('customers/1112223333/adGroups/10');
  });
});
