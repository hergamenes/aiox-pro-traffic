#!/usr/bin/env node

/**
 * check-copy-gate.cjs — Deterministic gate for copy creation commands.
 *
 * Validates that campaign context is set before allowing any copy creation.
 * Must be called before *ads, *sales-page, *vsl, *email-sequence, etc.
 *
 * Usage:
 *   node squads/copy/scripts/check-copy-gate.cjs
 *   node squads/copy/scripts/check-copy-gate.cjs --command=ads
 *
 * Exit codes:
 *   0 = ALLOWED (campaign set, product ready)
 *   1 = BLOCKED (missing campaign or product context)
 *
 * Output: Structured verdict with progress checklist.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const runtimePaths = require('./runtime-paths.cjs');
const { resolveSquadWorkspaceReadiness } = require('../../../workspace/scripts/resolve-squad-workspace-readiness.cjs');

const CREATION_COMMANDS = [
  '*sales-page', '*email-sequence', '*ads', '*headlines', '*lead-magnet',
  '*webinar', '*vsl', '*upsell', '*landing',
  '*launch-plan', '*plc-sequence', '*sideways-letter', '*launch-emails',
  '*seed-launch', '*jv-launch', '*live-launch', '*evergreen-launch',
  '*launch-stack', '*open-cart', '*paid-traffic',
];

function parseArgs(argv) {
  const args = { command: null };
  for (const raw of argv) {
    if (raw.startsWith('--command=')) {
      args.command = raw.slice('--command='.length).trim();
      if (!args.command.startsWith('*')) args.command = `*${args.command}`;
    }
  }
  return args;
}

function readSessionContext() {
  const sessionPath = runtimePaths.getCopySessionContextPath();
  if (!fs.existsSync(sessionPath)) {
    return { exists: false, sessionPath };
  }
  const payload = yaml.load(fs.readFileSync(sessionPath, 'utf8')) || {};
  const active = payload.active_context || {};
  return {
    exists: true,
    sessionPath,
    businessSlug: (active.business_slug || '').trim() || null,
    productSlug: (active.product_slug || '').trim() || null,
    campaignSlug: (active.campaign_slug || '').trim() || null,
  };
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function buildProgressChecklist(session, readiness) {
  const items = [
    { id: 'session', label: 'Session context', ok: session.exists },
    { id: 'business', label: 'Business set', ok: !!session.businessSlug },
    { id: 'product', label: 'Product set', ok: !!session.productSlug },
  ];

  if (readiness) {
    for (const item of readiness.required_sources_loaded || []) {
      items.push({
        id: item.id,
        label: `${item.id} (${item.path})`,
        ok: true,
      });
    }

    for (const item of readiness.missing_required_sources || []) {
      items.push({
        id: item.id,
        label: `${item.id} (${item.path})`,
        ok: false,
      });
    }
  }

  items.push({
    id: 'campaign_slug',
    label: 'Campaign slug',
    ok: !!session.campaignSlug,
  });

  // ADR-012 canonical path
  const campaignBriefPath = session.businessSlug && session.campaignSlug
    ? path.join(
        runtimePaths.WORKSPACE_ROOT,
        'workspace',
        'businesses',
        session.businessSlug,
        'L4-operational',
        'campaigns',
        session.campaignSlug,
        'campaign-brief.yaml'
      )
    : null;

  items.push({
    id: 'campaign_brief',
    label: 'Campaign brief file',
    ok: campaignBriefPath ? fileExists(campaignBriefPath) : false,
  });

  return items;
}

function formatChecklist(items) {
  const done = items.filter((i) => i.ok).length;
  const total = items.length;
  const lines = [
    `### Progress Checklist (${done}/${total})`,
    '',
  ];

  for (const item of items) {
    const mark = item.ok ? '[x]' : '[ ]';
    const suffix = !item.ok ? ' **← MISSING**' : '';
    lines.push(`- ${mark} ${item.label}${suffix}`);
  }

  return lines.join('\n');
}

function checkGate(args) {
  const session = readSessionContext();

  // Gate 1: Session context must exist
  if (!session.exists) {
    return {
      verdict: 'BLOCKED',
      reason: 'No session context found. Run set-active-context.cjs first.',
      checklist: buildProgressChecklist(session, null),
      next_steps: [
        'node squads/copy/scripts/set-active-context.cjs --business=<business> --product=<product> --campaign-slug=<slug>',
      ],
    };
  }

  // Gate 2: Business and product must be set
  if (!session.businessSlug || !session.productSlug) {
    return {
      verdict: 'BLOCKED',
      reason: 'Business or product not set in session context.',
      checklist: buildProgressChecklist(session, null),
      next_steps: [
        'node squads/copy/scripts/set-active-context.cjs --business=<business> --product=<product> --campaign-slug=<slug>',
      ],
    };
  }

  const readiness = resolveSquadWorkspaceReadiness({
    squad: 'copy',
    business: session.businessSlug,
    product: session.productSlug,
    contextType: 'product',
  });
  const checklist = buildProgressChecklist(session, readiness);

  if (['blocked', 'not_applicable'].includes(readiness.status)) {
    return {
      verdict: 'BLOCKED',
      reason: readiness.reason || 'Product context is not ready for copy creation.',
      business: session.businessSlug,
      product: session.productSlug,
      campaign: session.campaignSlug,
      checklist,
      next_steps: [
        '*workspace-context',
        'Corrigir as fontes canônicas faltantes no workspace',
      ],
    };
  }

  // Gate 3: Campaign must be set for creation commands
  if (!session.campaignSlug) {
    return {
      verdict: 'BLOCKED',
      reason: 'Campaign context is NOT SET. Copy creation is blocked until a campaign brief is defined.',
      business: session.businessSlug,
      product: session.productSlug,
      campaign: null,
      checklist,
      next_steps: [
        `*create-campaign-brief --business=${session.businessSlug} --product=${session.productSlug}`,
        `node squads/copy/scripts/set-active-context.cjs --business=${session.businessSlug} --product=${session.productSlug} --campaign-slug=<slug>`,
        '*diagnose — run Tier 0 diagnosis while preparing the brief',
      ],
      blocked_commands: CREATION_COMMANDS,
      allowed_commands: [
        '*help', '*show-context', '*workspace-context',
        '*diagnose', '*diagnose-awareness', '*diagnose-sophistication',
        '*briefing', '*recommend', '*create-campaign-brief',
        '*audit-copy', '*sugarman-check', '*review',
      ],
    };
  }

  // Gate 4: Check campaign-brief.yaml exists (ADR-012 canonical path)
  const campaignBriefPath = path.join(
    runtimePaths.WORKSPACE_ROOT,
    'workspace', 'businesses', session.businessSlug,
    'L4-operational', 'campaigns', session.campaignSlug, 'campaign-brief.yaml'
  );

  if (!fs.existsSync(campaignBriefPath)) {
    return {
      verdict: 'BLOCKED',
      reason: `Campaign slug "${session.campaignSlug}" is set but campaign-brief.yaml does not exist.`,
      business: session.businessSlug,
      product: session.productSlug,
      campaign: session.campaignSlug,
      missing_file: runtimePaths.toWorkspaceRelative(campaignBriefPath),
      checklist,
      next_steps: [
        `*create-campaign-brief --business=${session.businessSlug} --product=${session.productSlug} --campaign=${session.campaignSlug}`,
        `Create the file manually: ${runtimePaths.toWorkspaceRelative(campaignBriefPath)}`,
      ],
    };
  }

  // All gates passed
  return {
    verdict: 'ALLOWED',
    reason: 'Product and campaign context are set. Copy creation may proceed.',
    business: session.businessSlug,
    product: session.productSlug,
    campaign: session.campaignSlug,
    campaign_brief: runtimePaths.toWorkspaceRelative(campaignBriefPath),
    checklist,
    command: args.command || '(any creation command)',
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = checkGate(args);

  // Always show checklist first
  if (result.checklist) {
    console.log(formatChecklist(result.checklist));
    console.log('');
  }

  if (result.verdict === 'BLOCKED') {
    console.log(`## COPY GATE: ${result.verdict}\n`);
    console.log(`**Reason:** ${result.reason}\n`);
    if (result.next_steps) {
      console.log('### Next Steps\n');
      result.next_steps.forEach((step, i) => console.log(`${i + 1}. \`${step}\``));
    }
    if (result.blocked_commands) {
      console.log('\n### Blocked Commands\n');
      console.log(result.blocked_commands.map((c) => `- \`${c}\``).join('\n'));
    }
    if (result.allowed_commands) {
      console.log('\n### Available Commands\n');
      console.log(result.allowed_commands.map((c) => `- \`${c}\``).join('\n'));
    }
    process.exit(1);
  }

  console.log(`## COPY GATE: ${result.verdict}\n`);
  console.log(`- Business: \`${result.business}\``);
  console.log(`- Product: \`${result.product}\``);
  console.log(`- Campaign: \`${result.campaign}\``);
  console.log(`- Brief: \`${result.campaign_brief}\``);
  console.log(`\nCopy creation is authorized. Proceed with \`${result.command}\`.`);
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { checkGate };
