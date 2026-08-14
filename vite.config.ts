import { defineConfig } from 'vite';

// GitHub Pages serves the project at /<repo>/. Override with BASE_PATH when
// deploying elsewhere (custom domain, root hosting, local preview).
const base = process.env.BASE_PATH ?? '/paratext-demo/';

export default defineConfig({
  base,
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    assetsInlineLimit: 2048,
  },
});
