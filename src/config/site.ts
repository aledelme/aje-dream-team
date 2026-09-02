/**
 * Configuración de marca y textos globales.
 *
 * Es el único sitio donde vive el nombre del producto: cambiarlo aquí lo cambia
 * en cabecera, pie, títulos de página y metadatos.
 */
export const site = {
  name: 'Zonia',
  claim: 'Datos reales de cada zona para decidir dónde vivir',
  poweredBy: 'Un servicio de Ibercaja',
  description:
    'Analiza y compara zonas de España con datos públicos de seguridad, renta, servicios, entorno y riesgos naturales antes de comprar tu vivienda.',
  /** Aviso permanente: los datos de la demo son simulados. */
  demoNotice:
    'Demo: los valores mostrados son datos simulados con fines de demostración. Las fuentes indicadas son las que alimentarían la versión real.',
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/perfil', label: 'Encuentra tu zona' },
    { href: '/analizar', label: 'Analizar y comparar' },
    { href: '/metodologia', label: 'Metodología' },
  ],
} as const;
