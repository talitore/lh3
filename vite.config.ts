import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [RubyPlugin(), react()],
  // Example: Changing the output directory to be rails-friendly.
  // build: {
  //   outDir: '../../public/vite-production',
  // },
});
