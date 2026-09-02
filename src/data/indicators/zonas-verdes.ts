import type { IndexIndicator } from '~/lib/indicators/types';

export const zonasVerdes: IndexIndicator = {
  id: 'zonas-verdes',
  kind: 'index',
  label: 'Zonas verdes',
  group: 'entorno',
  unit: '% de superficie de la sección',
  decimals: 1,
  summary: 'Porcentaje de la superficie de la zona clasificado como zona verde urbana.',
  source: {
    organism: 'IGN',
    dataset: 'SIOSE — clase «zona verde urbana»',
    url: 'https://www.siose.es/',
    period: '2023',
  },
  aggregation: 'seccion-censal',
  method:
    'No viene precalculado: se intersecan geográficamente los polígonos SIOSE de zona verde urbana con el polígono de la sección censal y se divide la superficie verde resultante entre la superficie total de la sección. Después se compara con la media nacional ponderada por población.',
  inverted: false,
  nationalAverage: 6.2,
  directionLabel: 'Más alto = más superficie verde',
  affinity: { category: 'calidad-vida', weight: 1 },
};
