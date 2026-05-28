#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const runtimePaths = require('./runtime-paths.cjs');
const { resolveSquadWorkspaceReadiness } = require('../../../workspace/scripts/resolve-squad-workspace-readiness.cjs');
function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {
    business: null,
    product: null,
    campaignSlug: null,
    task: null,
    format: 'json',
  };

  for (const raw of argv) {
    if (raw.startsWith('--business=')) {
      args.business = raw.slice('--business='.length).trim() || null;
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
    if (raw.startsWith('--task=')) {
      args.task = raw.slice('--task='.length).trim() || null;
      continue;
    }
    if (raw.startsWith('--format=')) {
      args.format = raw.slice('--format='.length).trim() || 'json';
    }
  }

  return args;
}

function readSessionContext() {
  const sessionPath = runtimePaths.getCopySessionContextPath();
  if (!fs.existsSync(sessionPath)) {
    fail(`Copy session context not found: ${runtimePaths.toWorkspaceRelative(sessionPath)}. Run node squads/copy/scripts/set-active-context.cjs --business=<slug> --product=<slug>.`);
  }

  const payload = yaml.load(fs.readFileSync(sessionPath, 'utf8')) || {};
  const active = payload.active_context || {};
  if (!active.business_slug || !active.product_slug) {
    fail(`Invalid copy session context: missing active_context.business_slug or active_context.product_slug in ${runtimePaths.toWorkspaceRelative(sessionPath)}`);
  }

  return {
    sessionPath,
    businessSlug: String(active.business_slug).trim(),
    productSlug: String(active.product_slug).trim(),
    campaignSlug: typeof active.campaign_slug === 'string' && active.campaign_slug.trim() !== '' ? active.campaign_slug.trim() : null,
    assetType: typeof active.asset_type === 'string' && active.asset_type.trim() !== '' ? active.asset_type.trim() : null,
  };
}

function workspacePath(...parts) {
  return path.join(runtimePaths.WORKSPACE_ROOT, ...parts);
}

function getCampaignArtifacts(business, campaignSlug) {
  if (!campaignSlug) {
    return {
      status: 'not_set',
      root: null,
      files: [],
      missing_required: [],
    };
  }

  // ADR-012 Layout C — Canonical L4-operational path with hybrid layout:
  //   root cross-squad contracts: campaign-brief.yaml, message-architecture.yaml
  //   copy squad subdir: copy/creative-brief.yaml, copy/assets/*.yaml
  const campaignRoot = workspacePath('workspace', 'businesses', business, 'L4-operational', 'campaigns', campaignSlug);
  const copySubdir = path.join(campaignRoot, 'copy');

  const rootCandidates = [
    'campaign-brief.yaml',
    'message-architecture.yaml',
  ];
  const copyCandidates = [
    'creative-brief.yaml',
  ];

  const files = [];
  for (const file of rootCandidates) {
    const full = path.join(campaignRoot, file);
    if (fs.existsSync(full)) files.push(runtimePaths.toWorkspaceRelative(full));
  }
  for (const file of copyCandidates) {
    const full = path.join(copySubdir, file);
    if (fs.existsSync(full)) files.push(runtimePaths.toWorkspaceRelative(full));
  }

  const assetsRoot = path.join(copySubdir, 'assets');
  if (fs.existsSync(assetsRoot) && fs.statSync(assetsRoot).isDirectory()) {
    const assetFiles = fs.readdirSync(assetsRoot)
      .filter((entry) => entry.endsWith('.yaml') || entry.endsWith('.yml'))
      .sort()
      .map((entry) => runtimePaths.toWorkspaceRelative(path.join(assetsRoot, entry)));
    files.push(...assetFiles);
  }

  const requiredCampaignBrief = path.join(campaignRoot, 'campaign-brief.yaml');
  return {
    status: fs.existsSync(requiredCampaignBrief) ? 'ready' : 'missing_campaign_brief',
    root: runtimePaths.toWorkspaceRelative(campaignRoot),
    files,
    missing_required: fs.existsSync(requiredCampaignBrief)
      ? []
      : [runtimePaths.toWorkspaceRelative(requiredCampaignBrief)],
  };
}

function deriveOperationalBriefStatus(productReadiness, campaignArtifacts, campaignSlug) {
  if (productReadiness.status !== 'ready') {
    return {
      status: productReadiness.status,
      final_allowed: false,
      notes: productReadiness.reasons || [],
    };
  }

  if (!campaignSlug) {
    return {
      status: 'product_ready_draft_only',
      final_allowed: false,
      notes: ['Product context is ready, but campaign context is not set. FINAL promotion remains blocked.'],
    };
  }

  if (campaignArtifacts.status !== 'ready') {
    return {
      status: 'campaign_context_incomplete',
      final_allowed: false,
      notes: ['Campaign slug is set, but campaign-brief.yaml is missing. FINAL promotion remains blocked.'],
    };
  }

  return {
    status: 'ready_for_campaign_execution',
    final_allowed: true,
    notes: ['Product and campaign context are ready. FINAL promotion may proceed after review gates.'],
  };
}

function buildOutput(args) {
  const session = readSessionContext();
  const business = args.business || session.businessSlug;
  const product = args.product || session.productSlug;
  const campaignSlug = args.campaignSlug || session.campaignSlug;
  const readiness = resolveSquadWorkspaceReadiness({
    squad: 'copy',
    business,
    product,
    contextType: 'product',
  });
  const campaignArtifacts = getCampaignArtifacts(business, campaignSlug);
  const operationalBrief = deriveOperationalBriefStatus(
    { status: readiness.status, reasons: [readiness.reason || ''] },
    campaignArtifacts,
    campaignSlug
  );

  return {
    task: args.task || null,
    consumer: 'copy',
    business_slug: business,
    product_slug: product,
    campaign_slug: campaignSlug,
    asset_type: session.assetType,
    readiness: {
      status: readiness.status,
      reason: readiness.reason,
      missing_required: readiness.missing_required_sources.map((item) => ({
        id: item.id,
        path: item.path,
      })),
      canonical_config_paths: readiness.canonical_config_paths,
      required_sources_loaded: readiness.required_sources_loaded,
      delegated_resolver: readiness.delegated_resolver,
      compliance_audit: readiness.readiness_payload?.compliance_audit || null,
    },
    operational_brief: {
      status: operationalBrief.status,
      final_allowed: operationalBrief.final_allowed,
      notes: operationalBrief.notes,
    },
    campaign_context: {
      status: campaignArtifacts.status,
      root: campaignArtifacts.root,
      missing_required: campaignArtifacts.missing_required,
      promotion_rule: 'Strategic or FINAL work requires persisted campaign artifacts.',
    },
    session_context_path: runtimePaths.toWorkspaceRelative(session.sessionPath),
    resolved_paths: {
      required_sources: readiness.required_sources_loaded.map((item) => item.path),
      missing_required_sources: readiness.missing_required_sources.map((item) => item.path),
      business_root: readiness.readiness_payload?.business_root || null,
      product_root: readiness.readiness_payload?.product_root || null,
      company_narrative_files: readiness.readiness_payload?.narrative_files?.company || [],
      product_narrative_files: readiness.readiness_payload?.narrative_files?.product || [],
      campaign_files: campaignArtifacts.files,
    },
  };
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
  const output = buildOutput(args);
  printOutput(output, args.format);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildOutput,
};
