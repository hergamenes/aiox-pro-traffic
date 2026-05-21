/**
 * Internal types for the google-ads-api adapter port.
 *
 * BOUNDARY RULE: Only files in this directory may import from the
 * 'google-ads-api' npm package. All other modules consume the types
 * and functions exported from this directory.
 */

export interface GoogleAdsClientConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
}

export interface CustomerConfig {
  customerId: string;
  refreshToken: string;
  loginCustomerId?: string;
}

export interface AccessibleCustomersResult {
  customerIds: string[];
  count: number;
}
