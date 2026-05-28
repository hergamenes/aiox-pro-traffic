#!/usr/bin/env node

const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..');
const DEFAULT_RUNTIME_ROOT = path.join(WORKSPACE_ROOT, '.aiox', 'squad-runtime');

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function toWorkspaceRelative(targetPath) {
  const relative = path.relative(WORKSPACE_ROOT, targetPath);
  if (!relative) return '.';
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return toPosix(path.resolve(targetPath));
  }
  return toPosix(relative);
}

function resolveRuntimeRoot() {
  const override = (process.env.AIOX_RUNTIME_ROOT || '').trim();
  if (!override) return DEFAULT_RUNTIME_ROOT;
  if (path.isAbsolute(override)) return override;
  return path.resolve(WORKSPACE_ROOT, override);
}

function getCopyRuntimeRoot() {
  return path.join(resolveRuntimeRoot(), 'copy', 'copy-chief');
}

function getCopySessionContextPath() {
  return path.join(getCopyRuntimeRoot(), 'session-context.yaml');
}

module.exports = {
  DEFAULT_RUNTIME_ROOT,
  WORKSPACE_ROOT,
  getCopyRuntimeRoot,
  getCopySessionContextPath,
  resolveRuntimeRoot,
  toPosix,
  toWorkspaceRelative,
};
