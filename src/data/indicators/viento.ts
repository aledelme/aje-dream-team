import type { IndexIndicator } from '~/lib/indicators/types';

/**
 * Dato original: días al año con rachas de viento por encima de 70 km/h
 * (malo si sube), invertido y presentado como estabilidad ante el viento.
 */
export const viento: IndexIndicator = {
  id: 'viento',
  kind: 'index',
  label: 'Estabilidad ante viento',
  originalLabel: 'Días al año con rachas extremas',
  group: 'entorno',
  unit: 'días/año con rachas > 70 km/h',
  decimals: 1,
  summary:
    'Días al año en los que la estación meteorológica más cercana supera los 70 km/h de racha máxima.',
  source: {
    organism: 'AEMET',
    dataset: 'AEMET OpenData — valores climatológicos diarios (racha máxima)',
    url: 'https://opendata.aemet.es/',
    period: 'Media 2014-2024',
  },
  aggregation: 'estacion-meteo',
  levelNote:
    'El valor procede de la estación meteorológica más cercana, no de la zona concreta.',
  method:
    'Se cuentan los días al año en que la estación supera el umbral de 70 km/h de racha máxima y se invierte respecto a la media nacional ponderada: índice = media nacional ÷ días de la zona × 100. Menos episodios extremos, índice más alto.',
  inverted: true,
  nationalAverage: 9.4,
  directionLabel: 'Más alto = menos rachas extremas',
  affinity: { category: 'clima', weight: 1 },
};
