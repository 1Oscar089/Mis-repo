import { defineConfig } from 'vite';

// Cambia '/mi-repo/' por el nombre real de tu repositorio de GitHub
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/mi-repo/' : '/',
});