#!/usr/bin/env node
/*
 * Copy Linter (S1/S2/S3)
 * Usage:
 *   node squads/copy/scripts/copy-linter.js --surface S1 <file-or-dir> [...]
 */

const fs = require('fs');
const path = require('path');

const SURFACE_DEFAULT = 'S2';
const THRESHOLDS = { S1: 20, S2: 24, S3: 32 };
const VALID_SURFACES = new Set(['S1', 'S2', 'S3']);
const CONTENT_EXTENSIONS = new Set(['.md', '.mdx', '.txt']);
const CONFIG_EXTENSIONS = new Set(['.yaml', '.yml', '.json']);

const VAGUE_CTA = [
  /\bclique aqui\b/i,
  /\bcontinuar\b/i,
  /\bprosseguir\b/i,
  /\bavancar\b/i,
  /\bavan\w+\b/i,
  /\bsubmit\b/i,
  /\bclick here\b/i,
  /\bcontinue\b/i,
  /\bproceed\b/i,
  /\blearn more\b/i,
];

const ERROR_WORDS = /\b(erro|error|falha|failure|invalido|inv[áa]lido|nao foi possivel|n[ãa]o foi poss[íi]vel|unable)\b/i;
const ACTION_WORDS = /\b(tente|tentar|retry|try again|verifique|check|contate|contact|corrija|fix|reenvie|submit again|atualize|update|proximo passo|pr[óo]ximo passo|next step)\b/i;
const PASSIVE_PT = /\b(foi|foram|sera|ser[aá]|serao|ser[ãa]o|est[aá] sendo|estavam sendo)\s+\w+(ado|ada|ados|adas|ido|ida|idos|idas)\b/i;
const PASSIVE_EN = /\b(was|were|is|are|been|be)\s+\w+ed\b/i;

const JARGON = [
  'sinergia', 'alavancar', 'robusto', 'paradigma', 'orquestracao', 'orquestração',
  'stakeholder', 'bandwidth', 'leverage', 'synergy', 'best-in-class', 'seamless',
  'world-class', 'pipeline', 'framework'
];

function parseArgs(argv) {
  const args = { surface: SURFACE_DEFAULT, format: 'text', failOn: 'error', includeConfig: false, targets: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--surface') {
      args.surface = (argv[++i] || SURFACE_DEFAULT).toUpperCase();
    } else if (token === '--format') {
      args.format = (argv[++i] || 'text').toLowerCase();
    } else if (token === '--fail-on') {
      args.failOn = (argv[++i] || 'error').toLowerCase();
    } else if (token === '--include-config') {
      args.includeConfig = true;
    } else {
      args.targets.push(token);
    }
  }

  if (!VALID_SURFACES.has(args.surface)) {
    throw new Error(`Invalid --surface '${args.surface}'. Use S1, S2, or S3.`);
  }
  if (!['text', 'json'].includes(args.format)) {
    throw new Error(`Invalid --format '${args.format}'. Use text or json.`);
  }
  if (!['error', 'warn'].includes(args.failOn)) {
    throw new Error(`Invalid --fail-on '${args.failOn}'. Use error or warn.`);
  }

  if (args.targets.length === 0) {
    args.targets = ['squads/copy/data'];
  }

  return args;
}

function isSupportedFile(inputPath, includeConfig) {
  const ext = path.extname(inputPath).toLowerCase();
  return CONTENT_EXTENSIONS.has(ext) || (includeConfig && CONFIG_EXTENSIONS.has(ext));
}

function walk(inputPath, files, includeConfig) {
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(inputPath)) {
      if (entry === 'node_modules' || entry === '.git') {
        continue;
      }
      walk(path.join(inputPath, entry), files, includeConfig);
    }
    return;
  }

  if (isSupportedFile(inputPath, includeConfig)) {
    files.push(inputPath);
  }
}

function tokenizeWords(text) {
  const words = text.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+/g);
  return words || [];
}

function addFinding(findings, file, line, rule, severity, message, snippet) {
  findings.push({ file, line, rule, severity, message, snippet: snippet.slice(0, 160) });
}

function lintLine(lineText, ctx, findings) {
  const text = lineText.trim();
  if (!text || text.length < 4) return;
  if (/^- \[[ xX]\]/.test(text)) return;
  if (/^(#{1,6}\s|```|---$|===+$)/.test(text)) return;
  if (/^\|.+\|$/.test(text)) return;
  if (/^[a-z0-9_.-]+\s*:\s*/i.test(text) && !text.includes('`')) return;

  const wordsInLine = tokenizeWords(text);
  const wordCount = wordsInLine.length;

  const threshold = THRESHOLDS[ctx.surface];
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  for (const sentence of sentences) {
    const count = tokenizeWords(sentence).length;
    if (count > threshold) {
      const severity = ctx.surface === 'S1' ? 'error' : 'warn';
      addFinding(
        findings,
        ctx.file,
        ctx.line,
        'sentence_length',
        severity,
        `Sentence has ${count} words (max ${threshold} for ${ctx.surface}).`,
        sentence
      );
    }

    const conjunctionHits = (sentence.match(/\b(e|mas|ou|por[ée]m|and|but|or|however)\b/gi) || []).length;
    if (count > 18 && conjunctionHits >= 3) {
      addFinding(
        findings,
        ctx.file,
        ctx.line,
        'multi_idea_sentence',
        'warn',
        'Sentence may contain multiple ideas. Split for faster scanning.',
        sentence
      );
    }
  }

  const isLikelyShortLabel = wordCount > 0 && wordCount <= 4 && !/[.:;!?]/.test(text);
  if (isLikelyShortLabel && VAGUE_CTA.some((pattern) => pattern.test(text))) {
    const severity = ctx.surface === 'S1' ? 'error' : 'warn';
    addFinding(
      findings,
      ctx.file,
      ctx.line,
      'vague_cta',
      severity,
      'CTA appears generic. Prefer explicit action verb.',
      text
    );
  }

  const likelyErrorMessage = /^(erro|error)\b/i.test(text.replace(/^["'`>\-\s]+/, ''));
  if (likelyErrorMessage && ERROR_WORDS.test(text) && !ACTION_WORDS.test(text)) {
    addFinding(
      findings,
      ctx.file,
      ctx.line,
      'error_without_next_step',
      'error',
      'Error message should include what to do next.',
      text
    );
  }

  if (PASSIVE_PT.test(text) || PASSIVE_EN.test(text)) {
    addFinding(
      findings,
      ctx.file,
      ctx.line,
      'passive_voice',
      'warn',
      'Passive voice detected. Prefer active voice when possible.',
      text
    );
  }

  const normalized = text.toLowerCase();
  for (const term of JARGON) {
    if (normalized.includes(term)) {
      const severity = ctx.surface === 'S3' ? 'info' : 'warn';
      if (!text.includes('(')) {
        addFinding(
          findings,
          ctx.file,
          ctx.line,
          'jargon_term',
          severity,
          `Jargon term '${term}' found without inline explanation.`,
          text
        );
      }
      break;
    }
  }
}

function lintFile(file, surface, findings) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    lintLine(lines[i], { file, line: i + 1, surface }, findings);
  }
}

function summarize(findings) {
  const summary = { error: 0, warn: 0, info: 0 };
  for (const f of findings) {
    summary[f.severity] += 1;
  }
  const score = Math.max(0, 100 - summary.error * 10 - summary.warn * 4 - summary.info);
  return { ...summary, score };
}

function printText(findings, summary, surface, filesCount) {
  console.log(`Copy Linter | surface=${surface} | files=${filesCount}`);
  console.log(`Findings: error=${summary.error} warn=${summary.warn} info=${summary.info} score=${summary.score}`);

  if (findings.length === 0) {
    console.log('No findings.');
    return;
  }

  for (const f of findings) {
    console.log(`[${f.severity.toUpperCase()}] ${f.rule} ${f.file}:${f.line}`);
    console.log(`  ${f.message}`);
    console.log(`  -> ${f.snippet}`);
  }
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }

  const files = [];
  for (const target of args.targets) {
    if (!fs.existsSync(target)) {
      console.error(`Target not found: ${target}`);
      process.exit(2);
    }
    walk(target, files, args.includeConfig);
  }

  const findings = [];
  for (const file of files) {
    lintFile(file, args.surface, findings);
  }

  const summary = summarize(findings);

  if (args.format === 'json') {
    console.log(JSON.stringify({ surface: args.surface, files_scanned: files.length, summary, findings }, null, 2));
  } else {
    printText(findings, summary, args.surface, files.length);
  }

  const failOnWarn = args.failOn === 'warn';
  const shouldFail = summary.error > 0 || (failOnWarn && summary.warn > 0);
  process.exit(shouldFail ? 1 : 0);
}

main();
