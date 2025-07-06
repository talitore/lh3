import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), RubyPlugin(), tailwindcss()],
});
