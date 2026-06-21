import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: false,
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.js',
      external: (id) => id === 'jquery' || id.startsWith('jquery/'),
      output: {
        entryFileNames: 'app.js',
        format: 'iife',
        name: 'ReportantApp',
        globals: {
          jquery: 'jQuery',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'bundle.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
