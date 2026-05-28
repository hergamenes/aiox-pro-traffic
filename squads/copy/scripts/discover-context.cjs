#!/usr/bin/env node

/**
 * discover-context.cjs — Workspace discovery for copy squad
 *
 * Lists available businesses, products, and campaigns from workspace.
 * Used by set-active-context.cjs as fallback when args are omitted.
 *
 * Usage:
 *   node squads/copy/scripts/discover-context.cjs
 *   node squads/copy/scripts/discover-context.cjs --business=<slug>
 *   node squads/copy/scripts/discover-context.cjs --business=<slug> --product=<slug>
 */

const fs = require('fs');
const path = require('path');

const runtimePaths = require('./runtime-paths.cjs');

const BUSINESSES_ROOT = path.join(runtimePaths.WORKSPACE_ROOT, 'workspace', 'businesses');

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function discoverBusinesses() {
  return listDirs(BUSINESSES_ROOT);
}

function discoverProducts(business) {
  const productsDir = path.join(BUSINESSES_ROOT, business, 'L3-product');
  return listDirs(productsDir);
}

function discoverCampaigns(business) {
  // ADR-012: campanhas vivem em L4-operational/campaigns/
  const campaignsDir = path.join(BUSINESSES_ROOT, business, 'L4-operational', 'campaigns');
  return listDirs(campaignsDir);
}

function assessProductReadiness(business, product) {
  const base = path.join(BUSINESSES_ROOT, business, 'L3-product', product);
  const required = ['offerbook.yaml', 'proof.yaml', 'testimonials.yaml'];
  const optional = ['curriculum.yaml', 'cities-map.yaml'];

  const found = required.filter(f => fileExists(path.join(base, f)));
  const missing = required.filter(f => !fileExists(path.join(base, f)));
  const extras = optional.filter(f => fileExists(path.join(base, f)));

  return {
    product,
    ready: missing.length === 0,
    found: found.length,
    total: required.length,
    missing,
    extras,
  };
}

function assessBusinessReadiness(business) {
  const base = path.join(BUSINESSES_ROOT, business);
  const sharedFiles = [
    { id: 'icp', path: 'L1-strategy/icp.yaml' },
    { id: 'brandbook', path: 'L2-tactical/brand/brandbook.yaml' },
  ];

  const found = sharedFiles.filter(f => fileExists(path.join(base, f.path)));
  const missing = sharedFiles.filter(f => !fileExists(path.join(base, f.path)));

  return {
    business,
    shared_ready: missing.length === 0,
    shared_found: found.map(f => f.id),
    shared_missing: missing.map(f => f.id),
  };
}

function discover(args) {
  const result = {};

  if (!args.business) {
    // Level 1: list all businesses
    const businesses = discoverBusinesses();
    result.businesses = businesses.map(b => ({
      slug: b,
      ...assessBusinessReadiness(b),
      products: discoverProducts(b).length,
      campaigns: discoverCampaigns(b).length,
    }));

    if (businesses.length === 1) {
      result.auto_select = { business: businesses[0] };
      result.hint = `Único business encontrado. Use: --business=${businesses[0]}`;
    } else if (businesses.length === 0) {
      result.hint = 'Nenhum business encontrado em workspace/businesses/. Execute *bootstrap primeiro.';
    } else {
      result.hint = `${businesses.length} businesses disponíveis. Especifique --business=<slug>.`;
    }
    return result;
  }

  if (!args.product) {
    // Level 2: list products for business
    const products = discoverProducts(args.business);
    const campaigns = discoverCampaigns(args.business);
    const businessStatus = assessBusinessReadiness(args.business);

    result.business = businessStatus;
    result.products = products.map(p => assessProductReadiness(args.business, p));
    result.campaigns = campaigns;

    if (products.length === 1) {
      result.auto_select = { business: args.business, product: products[0] };
      result.hint = `Único produto encontrado. Use: --product=${products[0]}`;
    } else if (products.length === 0) {
      result.hint = 'Nenhum produto encontrado. Verifique workspace/businesses/{business}/L3-product/.';
    } else {
      result.hint = `${products.length} produtos disponíveis. Especifique --product=<slug>.`;
    }
    return result;
  }

  // Level 3: show product + campaigns detail
  const businessStatus = assessBusinessReadiness(args.business);
  const productStatus = assessProductReadiness(args.business, args.product);
  const campaigns = discoverCampaigns(args.business);

  result.business = businessStatus;
  result.product = productStatus;
  result.campaigns = campaigns;

  if (campaigns.length > 0) {
    result.hint = `${campaigns.length} campanhas existentes: ${campaigns.join(', ')}. Use --campaign-slug=<slug> se aplicável.`;
  } else {
    result.hint = 'Nenhuma campanha existente. Trabalho será DRAFT até criar campaign-brief.';
  }

  return result;
}

function parseArgs(argv) {
  const args = { business: null, product: null, format: 'json' };
  for (const raw of argv) {
    if (raw.startsWith('--business=')) args.business = raw.slice('--business='.length).trim() || null;
    if (raw.startsWith('--product=')) args.product = raw.slice('--product='.length).trim() || null;
    if (raw.startsWith('--format=')) args.format = raw.slice('--format='.length).trim() || 'json';
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = discover(args);

  if (args.format === 'yaml') {
    const yaml = require('js-yaml');
    process.stdout.write(yaml.dump(result, { lineWidth: 120, noRefs: true, sortKeys: false }));
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { discover, discoverBusinesses, discoverProducts, discoverCampaigns };
