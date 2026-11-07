import type { Pagina } from './pages/tipos';
import { pagina as netherPortal } from './pages/nether-portal';
import { pagina as binarioTexto } from './pages/binario-texto';

/** Añade aquí una línea por cada herramienta nueva. */
export const PAGINAS: Pagina[] = [
  netherPortal,
  binarioTexto,
];