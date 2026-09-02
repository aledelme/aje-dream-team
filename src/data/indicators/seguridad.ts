import type { IndexIndicator } from '~/lib/indicators/types';

/**
 * Dato original: tasa de criminalidad (infracciones penales por 1.000 hab.).
 * Es "malo si sube", así que se invierte y se presenta en positivo como Seguridad.
 */
export const seguridad: IndexIndicator = {
  id: 'seguridad',
  kind: 'index',
  label: 'Seguridad',
  originalLabel: 'Tasa de criminalidad',
  group: 'seguridad-riesgos',
  unit: 'infracciones penales / 1.000 hab.',
  decimals: 1,
  summary: 'Infracciones penales registradas por cada 1.000 habitantes del municipio.',
  source: {
    organism: 'Ministerio del Interior',
    dataset: 'Sistema Estadístico de Criminalidad',
    url: 'https://estadisticasdecriminalidad.ses.mir.es/',
    period: '2024',
  },
  aggregation: 'municipal',
  levelNote:
    'El dato sólo existe para municipios de más de 20.000 habitantes: el valor corresponde al municipio completo, no a esta sección concreta.',
  method:
    'Se parte de la tasa municipal de infracciones penales por 1.000 habitantes y se invierte respecto a la media nacional ponderada por población: índice = media nacional ÷ valor de la zona × 100. Menos delitos, índice más alto.',
  inverted: true,
  nationalAverage: 46.1,
  directionLabel: 'Más alto = más seguro',
  affinity: { category: 'seguridad', weight: 1 },
};
