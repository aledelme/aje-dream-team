import type { IndexIndicator } from '~/lib/indicators/types';

export const esperanzaVida: IndexIndicator = {
  id: 'esperanza-vida',
  kind: 'index',
  label: 'Esperanza de vida',
  group: 'entorno',
  unit: 'años',
  decimals: 1,
  summary: 'Esperanza de vida al nacer en el municipio.',
  source: {
    organism: 'INE',
    dataset: 'Indicadores de Mortalidad. Esperanza de vida por municipio',
    url: 'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177004',
    period: '2023',
  },
  aggregation: 'municipal',
  levelNote:
    'La esperanza de vida se publica a nivel municipal: el valor corresponde al municipio completo, no a esta sección concreta.',
  method:
    'Esperanza de vida al nacer del municipio frente a la media nacional ponderada por población: índice = valor de la zona ÷ media nacional × 100. Al ser un indicador muy estable, diferencias de 2-3 puntos de índice ya son relevantes.',
  inverted: false,
  nationalAverage: 83.1,
  directionLabel: 'Más alto = mayor esperanza de vida',
  affinity: { category: 'calidad-vida', weight: 0.8 },
};
