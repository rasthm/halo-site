import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
import {defineConfig} from 'vite';

// Two entries: the home page (the approved motion design, plain TypeScript) and the template every other
// page is pre-rendered into (React).
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {input: {home: resolve(__dirname, 'index.html'), page: resolve(__dirname, 'page.html')}},
  },
});
