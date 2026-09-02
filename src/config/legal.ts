/**
 * Datos legales del servicio.
 *
 * Fuente única para la política de privacidad y para los textos de
 * consentimiento del formulario: así no se desincronizan.
 *
 * PENDIENTE ANTES DE PUBLICAR CON RECOGIDA REAL: sustituir los marcadores
 * entre corchetes por los datos reales del responsable y pasar el documento
 * por revisión legal.
 */
export const legal = {
  /** Responsable del tratamiento. */
  controller: 'Equipo de Zonia',
  /** Marcadores pendientes de rellenar antes de una publicación real. */
  placeholders: {
    legalName: '[Razón social del responsable]',
    taxId: '[NIF / CIF]',
    address: '[Domicilio social]',
  },
  /** Correo para ejercer derechos. Marcador: aún no hay dominio propio. */
  contactEmail: 'privacidad@[dominio-por-definir]',

  /** Versión de la política, registrada junto al consentimiento del usuario. */
  policyVersion: '1.0',
  lastUpdated: '2 de septiembre de 2026',

  /**
   * Número mínimo de respuestas que debe reunir una zona antes de publicar o
   * comercializar cualquier estadística sobre ella. Impide que un dato agregado
   * permita deducir la respuesta de una persona concreta.
   */
  aggregationThreshold: 30,

  /** Meses que se conservaría cada respuesta individual antes de agregarla. */
  retentionMonths: 12,

  /** Autoridad de control competente. */
  authority: {
    name: 'Agencia Española de Protección de Datos (AEPD)',
    url: 'https://www.aepd.es/',
  },

  /**
   * En la demo no hay servidor: el formulario se resuelve entero en el
   * navegador y no se envía nada a ningún sitio.
   */
  demoNotice:
    'En esta demo no se recoge ni se envía ningún dato: el formulario se resuelve entero en tu navegador y las respuestas no salen de él. Lo que se describe a continuación es el tratamiento previsto para cuando el servicio esté operativo.',
} as const;
