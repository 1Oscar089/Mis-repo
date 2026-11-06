import { ESTILOS_GLOBALES } from './estilos';
import { PAGINAS } from './registro';
import { pagina as inicio } from './pages/inicio';
import type { Pagina } from './pages/tipos';
import { CATEGORIAS } from './datos/categorias';

// CSS global (una vez) + hoja intercambiable para la vista actual
const hojaGlobal = new CSSStyleSheet();
hojaGlobal.replaceSync(ESTILOS_GLOBALES);
const hojaPagina = new CSSStyleSheet();
document.adoptedStyleSheets = [hojaGlobal, hojaPagina];

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Falta <main id="app"> en index.html');

function mostrar(pagina: Pagina): void {
  document.title = pagina.titulo;
  hojaPagina.replaceSync(pagina.estilos);
  app.replaceChildren();
  pagina.renderizar(app);
  window.scrollTo(0, 0);
}

function vista404(ruta: string): void {
  document.title = 'Página no encontrada';
  hojaPagina.replaceSync('');
  app.replaceChildren();
  app.innerHTML = `
    <a class="volver" href="#/">← Volver al inicio</a>
    <p class="vacio">🤷 No existe la ruta <code>#/${ruta}</code></p>
  `;
}

function navegar(): void {
  const ruta = location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (ruta === '') {
    mostrar(inicio);
    return;
  }
  const pagina = PAGINAS.find((p) => p.id === ruta);
  if (!pagina) {
    vista404(ruta);
    return;
  }
  mostrar(pagina);
}

// Toda herramienta debe tener cat/sub válidos y un id único
function validarDatos(): void {
  const ids = new Set<string>();
  for (const p of PAGINAS) {
    if (ids.has(p.id)) throw new Error(`id duplicado: ${p.id}`);
    ids.add(p.id);
    if (!p.cat) continue; // páginas sin categoría (solo el inicio) se saltan esto
    const subs = CATEGORIAS[p.cat];
    if (!subs) throw new Error(`Categoría desconocida "${p.cat}" (${p.id})`);
    if (p.sub && !subs.includes(p.sub)) throw new Error(`Subcategoría desconocida "${p.cat}/${p.sub}" (${p.id})`);
  }
}

validarDatos();
window.addEventListener('hashchange', navegar);
navegar();