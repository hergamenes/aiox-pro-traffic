#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { buildOutput } = require('./load-context.cjs');
const runtimePaths = require('./runtime-paths.cjs');

const ROOT = process.cwd();
const DEFAULT_CONFIG_PATH = path.join(ROOT, 'squads', 'copy', 'config.yaml');
const DEFAULT_AGENT_PATH = path.join(ROOT, 'squads', 'copy', 'agents', 'copy-chief.md');
const DEFAULT_SESSION_COMMAND = 'node squads/copy/scripts/set-active-context.cjs --business=<slug> --product=<slug>';

function loadYamlFile(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
}

function loadAgentDefinition(agentPath) {
  const content = fs.readFileSync(agentPath, 'utf8');
  const match = content.match(/```ya?ml\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error(`No YAML block found in ${path.relative(ROOT, agentPath)}`);
  }
  return yaml.load(match[1]) || {};
}

// Commands that require campaign context to be set (creation commands)
const CREATION_COMMANDS = new Set([
  '*sales-page', '*email-sequence', '*ads', '*headlines', '*lead-magnet',
  '*webinar', '*vsl', '*upsell', '*landing',
  '*launch-plan', '*plc-sequence', '*sideways-letter', '*launch-emails',
  '*seed-launch', '*jv-launch', '*live-launch', '*evergreen-launch',
  '*launch-stack', '*open-cart', '*paid-traffic',
]);

// Commands always available (diagnostic, navigation, quality)
const ALWAYS_AVAILABLE_COMMANDS = new Set([
  '*help', '*show-context', '*workspace-context',
  '*diagnose', '*diagnose-awareness', '*diagnose-sophistication',
  '*briefing', '*recommend',
  '*audit-copy', '*sugarman-check', '*review', '*evaluate-cpls',
  '*team', '*tier0', '*tier1', '*tier2', '*tier3',
  '*chat-mode', '*exit',
]);

function formatCommandList(commands, maxItems) {
  return (commands || []).slice(0, maxItems).map((item) => `- \`${item}\``).join('\n');
}

function formatFilteredCommandList(commands, maxItems, campaignSet) {
  if (campaignSet) {
    return formatCommandList(commands, maxItems);
  }
  const allowed = (commands || []).filter((cmd) => !CREATION_COMMANDS.has(cmd));
  return allowed.slice(0, maxItems).map((item) => `- \`${item}\``).join('\n');
}

function formatPathList(paths, maxItems) {
  return (paths || []).slice(0, maxItems).map((item) => `  - \`${item}\``).join('\n');
}

function buildContextSection(context, settings) {
  if (settings.activation?.show_context_report === false) {
    return '';
  }

  const lines = [
    '## Active Product Context',
    '',
    `- Business: \`${context.business_slug}\``,
    `- Product: \`${context.product_slug}\``,
    `- Campaign: \`${context.campaign_slug || 'not_set'}\``,
    `- Operational brief status: \`${context.operational_brief?.status || context.readiness.status}\``,
    `- FINAL allowed: \`${context.operational_brief?.final_allowed ? 'yes' : 'no'}\``,
  ];

  if ((context.readiness.reasons || []).length > 0) {
    lines.push(`- Product readiness: ${(context.readiness.reasons || []).join(' | ')}`);
  }

  if ((context.operational_brief?.notes || []).length > 0) {
    lines.push(`- Operational notes: ${(context.operational_brief.notes || []).join(' | ')}`);
  }

  if (settings.activation?.show_preload_report !== false) {
    lines.push('');
    lines.push('## Preloaded References');
    lines.push('');
    lines.push(`- Session context: \`${context.session_context_path}\``);
    if (context.company_offerbook_index) {
      lines.push(`- Company offerbook index: \`${context.company_offerbook_index}\``);
    }
    if ((context.resolved_paths.shared_files || []).length > 0) {
      lines.push('- Shared files:');
      lines.push(formatPathList(context.resolved_paths.shared_files, settings.preload?.max_shared_files || 4));
    }
    if ((context.resolved_paths.company_narrative_files || []).length > 0) {
      lines.push('- Legacy company narrative artifacts:');
      lines.push(formatPathList(context.resolved_paths.company_narrative_files, settings.preload?.max_shared_files || 4));
    }
    if ((context.resolved_paths.product_files || []).length > 0) {
      lines.push('- Product files:');
      lines.push(formatPathList(context.resolved_paths.product_files, settings.preload?.max_product_files || 6));
    }
    if ((context.resolved_paths.product_narrative_files || []).length > 0) {
      lines.push('- Product narrative artifacts:');
      lines.push(formatPathList(context.resolved_paths.product_narrative_files, settings.preload?.max_product_files || 6));
    }
    if ((context.resolved_paths.campaign_files || []).length > 0) {
      lines.push('- Campaign files:');
      lines.push(formatPathList(context.resolved_paths.campaign_files, settings.preload?.max_product_files || 6));
    }
  }

  const blockers = [
    ...(context.readiness.missing_required || []).map((item) => ({
      id: item.id,
      path: item.path || 'missing',
    })),
    ...((context.campaign_context?.missing_required || []).map((item) => ({
      id: 'campaign_brief',
      path: item,
    }))),
  ];

  if (blockers.length > 0) {
    lines.push('');
    lines.push('## Blockers');
    lines.push('');
    lines.push(...blockers.map((item) => `- \`${item.id}\`: \`${item.path}\``));
  }

  return lines.join('\n');
}

function buildCopyBlockedSection(context) {
  const business = context.business_slug;
  const product = context.product_slug;
  const campaign = context.campaign_slug;

  const lines = ['## COPY CREATION BLOCKED', ''];

  if (!campaign) {
    lines.push(
      'Campaign context is not set. All creation commands are hidden.',
      'You MUST set a campaign before creating any copy asset.',
      '',
      '### Next Steps',
      '',
      '1. Create a campaign brief:',
      `   \`*create-campaign-brief --business=${business} --product=${product}\``,
      '',
      '2. Or set an existing campaign:',
      `   \`node squads/copy/scripts/set-active-context.cjs --business=${business} --product=${product} --campaign-slug=<slug>\``,
    );
  } else {
    lines.push(
      `Campaign \`${campaign}\` is set but \`campaign-brief.yaml\` does not exist.`,
      'All creation commands are hidden until the brief is created.',
      '',
      '### Next Steps',
      '',
      '1. Create the campaign brief:',
      `   \`*create-campaign-brief --business=${business} --product=${product} --campaign=${campaign}\``,
    );
  }

  lines.push(
    '',
    '2. Or run diagnostics first:',
    '   `*diagnose` — Tier 0 diagnosis',
    '   `*diagnose-awareness` — Awareness level',
    '   `*diagnose-sophistication` — Market sophistication',
    '',
    'Once a valid campaign brief exists, creation commands will appear.',
  );

  return lines.join('\n');
}

function inferCopyNextAction(context) {
  if (!context) {
    return DEFAULT_SESSION_COMMAND;
  }

  const business = context.business_slug;
  const product = context.product_slug;
  const campaign = context.campaign_slug;
  const readinessStatus = context.readiness?.status;
  const operationalStatus = context.operational_brief?.status;
  const campaignStatus = context.campaign_context?.status;

  if (!campaign && operationalStatus === 'product_ready_draft_only') {
    return `*create-campaign-brief --business=${business} --product=${product}`;
  }

  if (campaign && campaignStatus === 'missing_campaign_brief') {
    return `*create-campaign-brief --business=${business} --product=${product} --campaign=${campaign}`;
  }

  if (readinessStatus !== 'ready') {
    return '*workspace-context';
  }

  if (context.operational_brief?.final_allowed) {
    return '*briefing';
  }

  return '*diagnose';
}

function buildCopyNextActionCallout(context) {
  const nextAction = inferCopyNextAction(context);
  return nextAction ? `**Next Action:** \`${nextAction}\`` : '';
}

function generateGreeting() {
  const config = loadYamlFile(DEFAULT_CONFIG_PATH);
  const agentDef = loadAgentDefinition(DEFAULT_AGENT_PATH);
  const settings = config.settings || {};
  const sessionPath = runtimePaths.getCopySessionContextPath();
  const context = fs.existsSync(sessionPath) ? buildOutput({ task: 'copy-chief', format: 'json' }) : null;

  const intro = context
    ? context.campaign_slug
      ? 'Copy Chief ativo. Contexto de produto e campanha carregado do runtime da sessao.'
      : 'Copy Chief ativo. Contexto de produto carregado do runtime da sessao.'
    : [
        'Copy Chief ativo. Nenhum contexto de produto foi inicializado nesta sessao.',
        '',
        '## Session Bootstrap',
        '',
        `- Inicialize com: \`${DEFAULT_SESSION_COMMAND}\``,
        '- Para trabalho estrategico ou FINAL, inclua `--campaign-slug=<slug>`.',
        '- Depois rode `*show-context` para conferir o preload canônico antes de escrever copy.',
        `- Runtime path: \`${runtimePaths.toWorkspaceRelative(sessionPath)}\``,
      ]
        .filter(Boolean)
        .join('\n');

  const campaignSet = !!(context && context.campaign_slug);
  const campaignReady = campaignSet && context.campaign_context?.status === 'ready';
  const copyBlocked = context && !campaignReady;

  const parts = [
    intro,
    context ? buildContextSection(context, settings) : null,
  ];

  if (copyBlocked) {
    parts.push(buildCopyBlockedSection(context));
  }

  const commandLimit = settings.activation?.quick_commands_limit || 6;
  if (copyBlocked) {
    parts.push('## Available Commands\n\n' + formatFilteredCommandList(agentDef.commands, commandLimit, false));
  } else {
    parts.push('## Starter Commands\n\n' + formatCommandList(agentDef.commands, commandLimit));
  }

  parts.push(buildCopyNextActionCallout(context));

  return `${parts.filter(Boolean).join('\n\n')}\n`;
}

function main() {
  process.stdout.write(generateGreeting());
}

if (require.main === module) {
  main();
}

module.exports = {
  buildCopyNextActionCallout,
  generateGreeting,
  inferCopyNextAction,
};
