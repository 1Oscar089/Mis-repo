import { defineConfig } from 'vite';

export default defineConfig({
  // Solo afecta al build de GitHub Pages; déjalo como lo tengas en tu repo.
  base: process.env.GITHUB_PAGES === 'true' ? '/Mis-repo/' : '/',
});