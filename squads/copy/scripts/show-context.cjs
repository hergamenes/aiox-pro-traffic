#!/usr/bin/env node

const yaml = require('js-yaml');
const { buildOutput } = require('./load-context.cjs');

function main() {
  const output = buildOutput({
    task: 'copy-chief',
    format: 'json',
  });
  process.stdout.write(yaml.dump(output, { lineWidth: 120, noRefs: true, sortKeys: false }));
}

if (require.main === module) {
  main();
}
