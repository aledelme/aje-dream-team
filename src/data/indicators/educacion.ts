import type { IndexIndicator } from '~/lib/indicators/types';

/**
 * Dato original: distancia al centro educativo más cercano (malo si sube),
 * invertido y presentado como accesibilidad educativa.
 */
export const educacion: IndexIndicator = {
  id: 'educacion',
  kind: 'index',
  label: 'Centros educativos cercanos',
  originalLabel: 'Distancia al centro educativo más cercano',
  group: 'servicios',
  unit: 'km al centro más cercano',
  decimals: 2,
  summary:
    'Distancia al centro educativo más próximo y número de centros en un radio de 2 km.',
  source: {
    organism: 'Ministerio de Educación, Formación Profesional y Deportes',
    dataset: 'Directorio de centros docentes no universitarios',
    url: 'https://www.educacion.gob.es/centros/home.do',
    period: '2024',
  },
  aggregation: 'seccion-censal',
  levelNote:
    'Los centros son puntos geolocalizados: la distancia se mide desde el centroide de la zona hasta el centro más cercano.',
  method:
    'Se geolocalizan los centros del directorio, se calcula la distancia desde el centroide de la zona al más cercano y se invierte respecto a la media nacional ponderada: índice = media nacional ÷ distancia de la zona × 100. El índice se limita a 200 al mostrarlo: en distancias cortas el cociente se dispara y deja de ser informativo.',
  inverted: true,
  // Media ponderada por población: en trama urbana casi siempre hay un centro
  // educativo a menos de medio kilómetro.
  nationalAverage: 0.45,
  directionLabel: 'Más alto = centros más cerca',
  affinity: { category: 'servicios', weight: 1 },
};
