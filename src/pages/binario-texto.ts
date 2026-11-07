import type { Pagina } from './tipos';

const tieneSoloBits = (texto: string): boolean => !/[^01]/.test(texto);

export const pagina: Pagina = {
  id: 'binario-texto',
  titulo: 'Conversor Binario ⇄ Texto · Mis herramientas',
  descripcion: 'Convierte texto a binario UTF-8 y binario a texto, con validación y copia al portapapeles.',
  icono: '💾',
  cat: 'conversores',
  sub: 'binario',

  estilos: `
    .bt { max-width: 640px; margin: 0 auto 60px; padding: 0 20px; }
    .bt h1 { text-align: center; margin: 16px 0 8px; }
    .bt__intro { text-align: center; color: var(--apagado); margin: 0 0 24px; }

    .bt__panel {
      background: var(--panel);
      border: 1px solid var(--borde);
      border-radius: 12px;
      padding: 16px;
      display: grid;
      gap: 10px;
      margin-bottom: 16px;
    }
    .bt__etiqueta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: var(--apagado);
    }
    .bt textarea {
      width: 100%;
      min-height: 110px;
      resize: vertical;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--borde);
      background: #1a1a20;
      color: var(--texto);
      font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
      font-size: 0.95rem;
    }
    .bt textarea:focus { outline: none; border-color: var(--acento); }

    .bt__acciones { display: flex; gap: 10px; flex-wrap: wrap; }
    .bt__boton {
      background: var(--acento);
      color: #0f172a;
      font-weight: 700;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .bt__boton:hover { filter: brightness(1.1); }
    .bt__boton--secundario {
      background: transparent;
      color: var(--texto);
      border: 1px solid var(--borde);
      font-weight: 400;
    }
    .bt__boton--secundario:hover { border-color: var(--acento); }

    .bt__aviso { color: #f8b84e; font-size: 0.9rem; margin: 0 0 8px; }
    .bt__ejemplo { color: var(--apagado); font-size: 0.85rem; text-align: center; }
    .bt__ejemplo code {
      color: var(--texto);
      background: var(--panel);
      padding: 2px 6px;
      border-radius: 6px;
    }
  `,

  renderizar(contenedor: HTMLElement): void {
    contenedor.innerHTML = `
      <a class="volver" href="#/">← Volver al inicio</a>
      <main class="bt">
        <h1>💾 Binario ⇄ Texto</h1>
        <p class="bt__intro">Cada letra se guarda como bytes UTF-8; aquí los ves en crudo, en grupos de 8 bits. Las tildes y los emoji ocupan varios bytes.</p>

        <p class="bt__aviso" hidden></p>

        <section class="bt__panel">
          <div class="bt__etiqueta">
            <strong>Texto</strong>
            <span class="bt__info-texto">0 caracteres</span>
          </div>
          <textarea id="bt-texto" placeholder="Escribe aquí tu texto…"></textarea>
          <div class="bt__acciones">
            <button class="bt__boton" data-accion="texto-a-binario">Convertir a binario →</button>
            <button class="bt__boton bt__boton--secundario" data-accion="copiar-texto">Copiar texto</button>
            <button class="bt__boton bt__boton--secundario" data-accion="limpiar-texto">Limpiar</button>
          </div>
        </section>

        <section class="bt__panel">
          <div class="bt__etiqueta">
            <strong>Binario (UTF-8, grupos de 8 bits)</strong>
            <span class="bt__info-binario">0 bytes</span>
          </div>
          <textarea id="bt-binario" placeholder="ej. 01001000 01101111 01101100 01100001"></textarea>
          <div class="bt__acciones">
            <button class="bt__boton" data-accion="binario-a-texto">← Convertir a texto</button>
            <button class="bt__boton bt__boton--secundario" data-accion="copiar-binario">Copiar binario</button>
            <button class="bt__boton bt__boton--secundario" data-accion="limpiar-binario">Limpiar</button>
          </div>
        </section>

        <p class="bt__ejemplo">Ejemplo: <code>Hola</code> → <code>01001000 01101111 01101100 01100001</code></p>
      </main>
    `;

    // ── Referencias ──
    const taTexto = contenedor.querySelector<HTMLTextAreaElement>('#bt-texto');
    const taBinario = contenedor.querySelector<HTMLTextAreaElement>('#bt-binario');
    const aviso = contenedor.querySelector<HTMLElement>('.bt__aviso');
    const infoTexto = contenedor.querySelector<HTMLElement>('.bt__info-texto');
    const infoBinario = contenedor.querySelector<HTMLElement>('.bt__info-binario');
    if (!taTexto || !taBinario || !aviso || !infoTexto || !infoBinario) {
      throw new Error('Faltan elementos en el conversor binario ⇄ texto');
    }

    const decir = (mensaje: string): void => {
      aviso.textContent = mensaje;
      aviso.hidden = mensaje === '';
    };

    const actualizarInfo = (): void => {
      infoTexto.textContent = `${taTexto.value.length} caracteres`;
      const bits = taBinario.value.replace(/\s+/g, '');
      infoBinario.textContent = bits === '' ? '0 bytes' : `${bits.length / 8} bytes`;
    };

    async function copiar(campo: HTMLTextAreaElement): Promise<void> {
      if (campo.value === '') {
        decir('⚠️ No hay nada que copiar.');
        return;
      }
      await navigator.clipboard.writeText(campo.value);
      decir('✔ Copiado al portapapeles.');
    }

    function textoABinario(): void {
      const texto = taTexto!.value;
      if (texto === '') {
        decir('⚠️ Escribe algún texto primero.');
        return;
      }
      const bytes = new TextEncoder().encode(texto); // UTF-8
      taBinario!.value = Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join(' ');
      decir('');
      actualizarInfo();
    }

    function binarioATexto(): void {
      const crudo = taBinario!.value.trim();
      if (crudo === '') {
        decir('⚠️ Pega algún binario primero.');
        return;
      }

      const limpio = crudo.replace(/\s+/g, ''); // admite espacios y saltos de línea como separadores
      if (!tieneSoloBits(limpio)) {
        decir('⚠️ Solo se admiten 0, 1 y separadores (espacios o saltos de línea).');
        return;
      }
      if (limpio.length % 8 !== 0) {
        decir(`⚠️ Deben ser grupos de 8 bits: tienes ${limpio.length} dígitos (${limpio.length % 8} de sobra).`);
        return;
      }

      const bytes = Uint8Array.from(limpio.match(/.{8}/g)!, (grupo) => parseInt(grupo, 2));

      try {
        // fatal: true lanza error si los bytes no son UTF-8 válido
        taTexto!.value = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        decir('');
        actualizarInfo();
      } catch {
        decir('⚠️ Esos bytes no forman un texto UTF-8 válido. ¿Falta algún bit o el binario no era texto?');
      }
    }

    const acciones: Record<string, () => void | Promise<void>> = {
      'texto-a-binario': textoABinario,
      'binario-a-texto': binarioATexto,
      'copiar-texto': () => copiar(taTexto),
      'copiar-binario': () => copiar(taBinario),
      'limpiar-texto': () => {
        taTexto.value = '';
        actualizarInfo();
        decir('');
      },
      'limpiar-binario': () => {
        taBinario.value = '';
        actualizarInfo();
        decir('');
      },
    };

    contenedor.querySelectorAll<HTMLButtonElement>('[data-accion]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const accion = btn.dataset.accion;
        if (accion && acciones[accion]) void acciones[accion]();
      });
    });

    taTexto.addEventListener('input', actualizarInfo);
    taBinario.addEventListener('input', actualizarInfo);
    actualizarInfo();
  },
};