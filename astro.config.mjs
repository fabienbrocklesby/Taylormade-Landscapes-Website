import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://taylormadelandscapes.nz',
  output: 'static',
  trailingSlash: 'never',
  build: {
    assets: 'assets',
  },
  integrations: [tailwind()],
});
