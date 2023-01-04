import { defineConfig } from 'vitest/config';
import checker from 'vite-plugin-checker';
import clearVitest from './scripts/vite-plugin-clear-vitest';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import license from 'rollup-plugin-license';
const TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const DEV = !TEST;
const event = process.env.npm_lifecycle_event;
const WATCH_TEST = TEST && event === 'test';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  // When generating types, run in node environment
  test: {
    setupFiles: ['./setup.vitest.ts'],
    environment: 'node',
    globals: true,
    css: false,
    isolate: false,
    passWithNoTests: true,
    coverage: {
      enabled: false,
    },
  },
  plugins: [
    DEV &&
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint -c .eslintrc.json --cache --fix --ext ts,tsx src',
          dev: {
            logLevel: ['error'],
          },
        },
      }),
    // Clear terminal plugin for vitest
    WATCH_TEST && clearVitest(),
    license({
      thirdParty: {
        output: path.resolve(__dirname, './dist/assets/vendor.LICENSE.txt'),
      },
    }),
  ],
  esbuild: {
    footer: '/*! licenses: /assets/vendor.LICENSE.txt */',
    legalComments: 'none',
  },
  server: {
    watch: {
      ignored: ['/coverage'],
    },
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    brotliSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
        }),
      ],
    },
  },
  json: {
    stringify: true,
  },
}));
