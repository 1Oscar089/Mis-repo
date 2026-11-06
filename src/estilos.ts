/** CSS global de la aplicación, inyectado una sola vez desde TS. */
export const ESTILOS_GLOBALES = `
:root {
  --fondo: #0f172a;
  --panel: #1e293b;
  --texto: #e2e8f0;
  --apagado: #94a3b8;
  --acento: #38bdf8;
  --borde: #334155;
  --radio: 14px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--fondo);
  color: var(--texto);
}

a { color: var(--acento); }

.volver {
  display: inline-block;
  margin: 20px 0 0 20px;
  color: var(--apagado);
  text-decoration: none;
  font-size: 0.9rem;
}
.volver:hover { color: var(--texto); }

.vacio { text-align: center; color: var(--apagado); padding: 40px 20px; }
`;