import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Simule un navigateur web
    globals: true,        // Permet d'utiliser describe/it/expect sans les importer à chaque fois
  }
});
