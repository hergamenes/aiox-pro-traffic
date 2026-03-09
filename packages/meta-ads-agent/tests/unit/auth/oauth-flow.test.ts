import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/cli/logger.js', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { buildAuthorizationUrl } from '../../../src/auth/oauth-flow.js';

describe('oauth-flow', () => {
  describe('buildAuthorizationUrl', () => {
    it('should build correct authorization URL with all params', () => {
      const url = buildAuthorizationUrl(
        '123456',
        'http://localhost:3000/callback',
        'random-state',
      );

      expect(url).toContain('facebook.com/v21.0/dialog/oauth');
      expect(url).toContain('client_id=123456');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
      expect(url).toContain('scope=ads_management%2Cads_read%2Cpages_read_engagement');
      expect(url).toContain('state=random-state');
      expect(url).toContain('response_type=code');
    });

    it('should include correct Meta API version', () => {
      const url = buildAuthorizationUrl('app-id', 'http://localhost:3000/callback', 'state');
      expect(url).toContain('v21.0');
    });
  });
});
