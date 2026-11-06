/** Toda vista de la app (incluido el inicio) implementa esta interfaz. */
export interface Pagina {
    id: string;           // ruta sin '#/', ej: 'nether-portal'
    titulo: string;       // título de la pestaña
    descripcion: string;  // texto de su tarjeta en el inicio
    icono: string;        // emoji de la tarjeta
    cat?: string;         // clave de CATEGORIAS (opcional: el inicio no la tiene)
    sub?: string;         // subcategoría de CATEGORIAS
    estilos: string;      // CSS de la página, inyectado al navegar
    renderizar(contenedor: HTMLElement): void;
  }