import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli/index.ts', 'bin/meta-ads.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
  target: 'node22',
  outDir: 'dist',
  splitting: false,
  dts: false,
});
