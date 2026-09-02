import type { IndexIndicator } from '~/lib/indicators/types';

export const renta: IndexIndicator = {
  id: 'renta',
  kind: 'index',
  label: 'Renta',
  group: 'entorno',
  unit: '€ netos / persona y año',
  decimals: 0,
  summary: 'Renta neta media anual por habitante de la sección censal.',
  source: {
    organism: 'INE',
    dataset: 'Atlas de Distribución de Renta de los Hogares (ADRH)',
    url: 'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177088',
    period: '2022',
  },
  aggregation: 'seccion-censal',
  method:
    'Renta neta media por persona de la sección censal comparada con la media nacional ponderada por población: índice = valor de la zona ÷ media nacional × 100.',
  inverted: false,
  nationalAverage: 12900,
  directionLabel: 'Más alto = mayor renta media',
  affinity: { category: 'calidad-vida', weight: 0.6 },
};
