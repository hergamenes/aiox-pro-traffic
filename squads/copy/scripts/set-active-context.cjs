#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const runtimePaths = require('./runtime-paths.cjs');
const { resolveSquadWorkspaceReadiness } = require('../../../workspace/scripts/resolve-squad-workspace-readiness.cjs');
const { discoverBusinesses, discoverProducts } = require('./discover-context.cjs');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {
    business: '',
    product: null,
    campaignSlug: null,
    assetType: null,
    reason: 'manual',
    format: 'json',
  };

  for (const raw of argv) {
    if (raw.startsWith('--business=')) {
      args.business = raw.slice('--business='.length).trim() || '';
      continue;
    }
    if (raw.startsWith('--product=')) {
      args.product = raw.slice('--product='.length).trim() || null;
      continue;
    }
    if (raw.startsWith('--campaign-slug=')) {
      args.campaignSlug = raw.slice('--campaign-slug='.length).trim() || null;
      continue;
    }
    if (raw.startsWith('--campaign=')) {
      args.campaignSlug = raw.slice('--campaign='.length).trim() || null;
      continue;
    }
    if (raw.startsWith('--asset-type=')) {
      args.assetType = raw.slice('--asset-type='.length).trim() || null;
      continue;
    }
    if (raw.startsWith('--reason=')) {
      args.reason = raw.slice('--reason='.length).trim() || 'manual';
      continue;
    }
    if (raw.startsWith('--format=')) {
      args.format = raw.slice('--format='.length).trim() || 'json';
    }
  }

  return args;
}

function writeYaml(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: 120, noRefs: true, sortKeys: false }), 'utf8');
}

function printOutput(output, format) {
  if (format === 'yaml') {
    process.stdout.write(yaml.dump(output, { lineWidth: 120, noRefs: true, sortKeys: false }));
    return;
  }
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  // Auto-select if only one business exists
  if (!args.business) {
    const businesses = discoverBusinesses();
    if (businesses.length === 1) {
      args.business = businesses[0];
      console.error(`Auto-selected business: ${args.business}`);
    } else if (businesses.length === 0) {
      fail('No businesses found in workspace/businesses/. Run *bootstrap first.');
    } else {
      fail(`Multiple businesses found: ${businesses.join(', ')}. Provide --business=<slug>`);
    }
  }

  // Auto-select if only one product exists
  if (!args.product) {
    const products = discoverProducts(args.business);
    if (products.length === 1) {
      args.product = products[0];
      console.error(`Auto-selected product: ${args.product}`);
    } else if (products.length === 0) {
      fail(`No products found in workspace/businesses/${args.business}/L3-product/.`);
    } else {
      fail(`Multiple products found: ${products.join(', ')}. Provide --product=<slug>`);
    }
  }

  const readiness = resolveSquadWorkspaceReadiness({
    squad: 'copy',
    business: args.business,
    product: args.product,
    contextType: 'product',
  });

  if (['blocked', 'not_applicable'].includes(readiness.status)) {
    fail(`Cannot activate copy context for ${args.business}/${args.product}: ${readiness.reason}`);
  }

  const sessionPath = runtimePaths.getCopySessionContextPath();
  const payload = {
    active_context: {
      business_slug: args.business,
      product_slug: args.product,
      campaign_slug: args.campaignSlug,
      asset_type: args.assetType,
      readiness_status: readiness.status,
      updated_at: new Date().toISOString(),
      reason: args.reason,
    },
  };

  writeYaml(sessionPath, payload);
  printOutput(
    {
      session_context_path: runtimePaths.toWorkspaceRelative(sessionPath),
      ...payload,
    },
    args.format
  );
}

if (require.main === module) {
  main();
}
