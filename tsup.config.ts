import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // your file
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});