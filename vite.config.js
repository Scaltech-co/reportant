import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,

    rollupOptions: {
      external: (id) => id === 'jquery' || id.startsWith('jquery/'),
      output: {
        globals: {
          jquery: 'jQuery',
        },
      },
    },
  },
});
