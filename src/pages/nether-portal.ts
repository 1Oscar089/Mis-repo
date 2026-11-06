import type { Pagina } from './tipos';

const FACTOR = 8;
const Y_NETHER_MIN = 1;
const Y_NETHER_MAX = 127;

const tieneDecimales = (n: number): boolean => n % 1 !== 0;

export const pagina: Pagina = {
  id: 'nether-portal',
  titulo: 'Calculadora de Portales del Nether · Mis herramientas',
  descripcion: 'Convierte coordenadas del Overworld al Nether (y viceversa) para conectar portales.',
  icono: '🧱',
  cat: 'juegos',
  sub: 'minecraft',

  estilos: `
    .np { max-width: 560px; margin: 0 auto 60px; padding: 0 20px; }
    .np h1 { text-align: center; margin: 16px 0 8px; }
    .np__intro { text-align: center; color: var(--apagado); margin: 0 0 24px; }

    .np__panel {
      background: var(--panel);
      border: 1px solid var(--borde);
      border-radius: 12px;
      padding: 20px;
      display: grid;
      gap: 16px;
      
    }
    .np label { display: grid; gap: 6px; font-size: 0.85rem; color: var(--apagado); }
    .np select, .np input {
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--borde);
      background: #1a1a20;
      color: var(--texto);
      font-size: 1rem;
      max-width: 60%;
    }
    
    .np select:focus, .np input:focus { outline: none; border-color: #8fd14f; }

    .np__coords { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

    .np__calcular {
      background: #5b8731;
      color: #fff;
      font-weight: 700;
      width: 60%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .np__calcular:hover { background: #8fd14f; color: #1c1c21; }

    .np__aviso { color: #f8b84e; font-size: 0.9rem; margin: 16px 0 0; }

    .np__resultado {
      margin-top: 16px;
      background: rgba(91, 135, 49, 0.12);
      border: 1px solid #5b8731;
      border-radius: 12px;
      padding: 20px;
    }
    .np__resultado h2 { margin: 0 0 12px; font-size: 1.05rem; }
    .np__lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 1.05rem; }
    .np__copiar {
      background: #33333d;
      color: var(--texto);
      border: 1px solid var(--borde);
      border-radius: 6px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 0.8rem;
      margin-left: 8px;
    }
    .np__copiar:hover { border-color: #8fd14f; }

    .np__ayuda { margin-top: 24px; color: var(--apagado); font-size: 0.9rem; }
    .np__ayuda summary { cursor: pointer; color: var(--texto); margin-bottom: 8px; }
  `,

  renderizar(contenedor: HTMLElement): void {
    contenedor.innerHTML = `
      <a class="volver" href="#/">← Volver al inicio</a>
      <main class="np">
        <h1>🧱 Portales del Nether</h1>
        <p class="np__intro">1 bloque del Nether = 8 del Overworld. Introduce tus coordenadas y te digo dónde construir el portal gemelo.</p>

        <section class="np__panel">
          <label>
            Dirección
            <select id="np-direccion">
              <option value="ow-nether">Overworld → Nether (÷8)</option>
              <option value="nether-ow">Nether → Overworld (×8)</option>
            </select>
          </label>

          <div class="np__coords">
            <label>X <input id="np-x" type="number" step="1" placeholder="ej. 120" /></label>
            <label>Y <input id="np-y" type="number" step="1" placeholder="ej. 64" /></label>
            <label>Z <input id="np-z" type="number" step="1" placeholder="ej. -340" /></label>
          </div>

          <button class="np__calcular" type="button">Calcular coordenadas</button>
        </section>

        <p class="np__aviso" hidden></p>

        <section class="np__resultado" hidden>
          <h2></h2>
          <ul class="np__lista">
            <li>X: <strong data-salida="x"></strong> <button class="np__copiar" data-copiar="x">Copiar</button></li>
            <li>Y: <strong data-salida="y"></strong> <button class="np__copiar" data-copiar="y">Copiar</button></li>
            <li>Z: <strong data-salida="z"></strong> <button class="np__copiar" data-copiar="z">Copiar</button></li>
          </ul>
        </section>

        <details class="np__ayuda">
          <summary>¿Cómo funciona el enlace de portales?</summary>
          <ul>
            <li>X y Z se dividen (o multiplican) entre 8; la Y no cambia.</li>
            <li>Construye el portal gemelo justo en las coordenadas calculadas para un enlace 1:1.</li>
            <li>Si hay otro portal a menos de 128 bloques en el destino, el juego te llevará a ese: rompe los sobrantes.</li>
            <li>En el Nether la Y útil va de 1 a 127 (techo de bedrock).</li>
          </ul>
        </details>
      </main>
    `;

    // ── Referencias (dentro del contenedor de la página) ──
    const selDireccion = contenedor.querySelector<HTMLSelectElement>('#np-direccion');
    const inpX = contenedor.querySelector<HTMLInputElement>('#np-x');
    const inpY = contenedor.querySelector<HTMLInputElement>('#np-y');
    const inpZ = contenedor.querySelector<HTMLInputElement>('#np-z');
    const btnCalcular = contenedor.querySelector<HTMLButtonElement>('.np__calcular');
    const boxAviso = contenedor.querySelector<HTMLElement>('.np__aviso');
    const boxResultado = contenedor.querySelector<HTMLElement>('.np__resultado');
    const titResultado = contenedor.querySelector<HTMLElement>('.np__resultado h2');
    const salidas: Record<'x' | 'y' | 'z', HTMLElement | null> = {
      x: contenedor.querySelector('[data-salida="x"]'),
      y: contenedor.querySelector('[data-salida="y"]'),
      z: contenedor.querySelector('[data-salida="z"]'),
    };
    if (!selDireccion || !inpX || !inpY || !inpZ || !btnCalcular || !boxAviso || !boxResultado || !titResultado) {
      throw new Error('Faltan elementos en la calculadora de portales');
    }

    const calcular = (): void => {
      const x = Number(inpX.value);
      const y = Number(inpY.value);
      const z = Number(inpZ.value);

      if (inpX.value === '' || inpY.value === '' || inpZ.value === '' || [x, y, z].some(Number.isNaN)) {
        boxAviso.textContent = '⚠️ Rellena X, Y y Z con números válidos.';
        boxAviso.hidden = false;
        boxResultado.hidden = true;
        return;
      }

      const alNether = selDireccion.value === 'ow-nether';

      const res = alNether
        ? {
            titulo: '⛏️ Construye tu portal del Nether en:',
            x: Math.floor(x / FACTOR),
            y: Math.min(Math.max(Math.round(y), Y_NETHER_MIN), Y_NETHER_MAX),
            z: Math.floor(z / FACTOR),
          }
        : {
            titulo: '🌍 Construye tu portal del Overworld en:',
            x: x * FACTOR,
            y: Math.round(y),
            z: z * FACTOR,
          };

      titResultado.textContent = res.titulo;
      salidas.x!.textContent = String(res.x);
      salidas.y!.textContent = String(res.y);
      salidas.z!.textContent = String(res.z);

      const notas: string[] = [];
      if (alNether && (tieneDecimales(x / FACTOR) || tieneDecimales(z / FACTOR))) {
        notas.push('La división da decimales: con construir en el bloque entero calculado es suficiente.');
      }
      notas.push('Si en el destino ya hay otro portal a menos de 128 bloques, el juego enlazará con ese: rompe los sobrantes.');

      boxAviso.textContent = notas.join(' ');
      boxAviso.hidden = false;
      boxResultado.hidden = false;
    };

    btnCalcular.addEventListener('click', calcular);
    [inpX, inpY, inpZ].forEach((inp) =>
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calcular();
      })
    );

    contenedor.querySelectorAll<HTMLButtonElement>('.np__copiar').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const clave = btn.dataset.copiar as 'x' | 'y' | 'z';
        await navigator.clipboard.writeText(salidas[clave]!.textContent ?? '');
        const original = btn.textContent ?? 'Copiar';
        btn.textContent = '✔ Copiado';
        setTimeout(() => (btn.textContent = original), 1200);
      });
    });
  },
};