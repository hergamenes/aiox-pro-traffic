# Changelog

All notable changes to `@aiox/google-ads-agent` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-06-23

### Fixed
- **`remove` mutations now pass the resource_name as a bare string** (#4).
  `removeKeyword`, `removeCampaign` and `removeAdGroup` were sending
  `{ resource_name }` objects where the Google Ads API expects a string for
  the `remove` operation. The object serialized to `"[object Object]"`,
  causing every removal to fail with `RESOURCE_NAME_MALFORMED`.
  `removeKeyword` was the reported bug; the other two were latent (same defect).

### Tests
- Added regression tests asserting `remove` operations carry a bare
  resource_name string (the prior mock returned `{}` without inspecting args,
  so it never caught the bug).
