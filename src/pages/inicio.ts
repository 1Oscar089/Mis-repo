import { PAGINAS } from '../registro';
import type { Pagina } from './tipos';

export const pagina: Pagina = {
  id: 'inicio',
  titulo: 'Mis herramientas web',
  descripcion: '',
  icono: '🏠',

  estilos: `
    .inicio { max-width: 1000px; margin: 0 auto; padding: 0 20px 48px; }
    .inicio__cabecera { text-align: center; padding: 48px 0 8px; }
    .inicio__cabecera h1 { margin: 0 0 6px; }
    .inicio__cabecera p { margin: 0 0 24px; color: var(--apagado); }

    .inicio__buscador {
      display: block;
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      padding: 14px 18px;
      border-radius: 999px;
      border: 1px solid var(--borde);
      background: var(--panel);
      color: var(--texto);
      font-size: 1rem;
      outline: none;
    }
    .inicio__buscador:focus { border-color: var(--acento); }

    .inicio__rejilla {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .tarjeta {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      background: var(--panel);
      border: 1px solid var(--borde);
      border-radius: var(--radio);
      padding: 18px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .tarjeta:hover { transform: translateY(-3px); border-color: var(--acento); }
    .tarjeta__icono { font-size: 2rem; line-height: 1; }
    .tarjeta h2 { font-size: 1.05rem; margin: 0 0 6px; }
    .tarjeta p { margin: 0 0 10px; color: var(--apagado); font-size: 0.9rem; }
    .tarjeta__etiqueta {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--acento);
      background: rgba(56, 189, 248, 0.1);
      padding: 3px 8px;
      border-radius: 999px;
    }
    .inicio__vacio { grid-column: 1 / -1; }

    .inicio__pie { text-align: center; color: var(--apagado); font-size: 0.85rem; padding: 24px 0; }
  `,

  renderizar(contenedor: HTMLElement): void {
    contenedor.innerHTML = `
      <div class="inicio">
        <header class="inicio__cabecera">
          <h1>🧰 Mis herramientas</h1>
          <p>Mini-aplicaciones funcionales: una tarjeta, una herramienta.</p>
          <input
            class="inicio__buscador"
            type="search"
            placeholder="Buscar: minecraft, qr, pdf…"
            autocomplete="off"
            aria-label="Buscar herramienta"
          />
        </header>
        <section class="inicio__rejilla" aria-live="polite"></section>
        <footer class="inicio__pie">
          Hecho con Vite + TypeScript · <span class="inicio__contador"></span>
        </footer>
      </div>
    `;

    const rejilla = contenedor.querySelector<HTMLElement>('.inicio__rejilla');
    const buscador = contenedor.querySelector<HTMLInputElement>('.inicio__buscador');
    const contador = contenedor.querySelector<HTMLElement>('.inicio__contador');
    if (!rejilla || !buscador || !contador) throw new Error('Faltan elementos en la vista de inicio');

    // minúsculas + sin acentos, para que "míne" encuentre "mine"
    const normalizar = (t: string): string =>
      t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const pintar = (lista: typeof PAGINAS): void => {
      rejilla.replaceChildren();

      if (lista.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'vacio inicio__vacio';
        vacio.textContent = '🤷 Sin resultados. Prueba con otra palabra.';
        rejilla.append(vacio);
        return;
      }

      for (const p of lista) {
        const a = document.createElement('a');
        a.className = 'tarjeta';
        a.href = `#/${p.id}`;
        if (p.cat && p.sub) a.dataset.categoria = `${p.cat}/${p.sub}`;

        // innerHTML es seguro aquí: solo hay texto escrito por ti, nunca datos del usuario
        a.innerHTML = `
          <span class="tarjeta__icono">${p.icono}</span>
          <div>
            <h2>${p.titulo}</h2>
            <p>${p.descripcion}</p>
            ${p.cat && p.sub ? `<span class="tarjeta__etiqueta">${p.cat} › ${p.sub}</span>` : ''}
          </div>
        `;
        rejilla.append(a);
      }
    };

    buscador.addEventListener('input', () => {
      const q = normalizar(buscador.value.trim());
      pintar(
        q === ''
          ? PAGINAS
          : PAGINAS.filter((p) =>
              normalizar(`${p.titulo} ${p.descripcion} ${p.cat ?? ''} ${p.sub ?? ''}`).includes(q)
            )
      );
    });

    contador.textContent = `${PAGINAS.length} herramienta(s)`;
    pintar(PAGINAS);
  },
};