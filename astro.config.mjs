import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://taylormadelandscapes.nz',
  output: 'static',
  trailingSlash: 'never',
  build: {
    assets: 'assets',
  },
});
