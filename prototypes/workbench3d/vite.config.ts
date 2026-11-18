// Isolated prototype: its own entry and port; nothing in the live site imports from here.
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: {port: 3031, strictPort: true},
});
