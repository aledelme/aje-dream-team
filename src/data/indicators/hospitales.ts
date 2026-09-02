import type { IndexIndicator } from '~/lib/indicators/types';

/**
 * Dato original: distancia al hospital más cercano. Es "malo si sube", así que
 * se invierte y se presenta como accesibilidad hospitalaria.
 */
export const hospitales: IndexIndicator = {
  id: 'hospitales',
  kind: 'index',
  label: 'Hospitales cercanos',
  originalLabel: 'Distancia al hospital más cercano',
  group: 'servicios',
  unit: 'km al hospital más cercano',
  decimals: 1,
  summary: 'Distancia al hospital más próximo y número de hospitales en un radio de 10 km.',
  source: {
    organism: 'Ministerio de Sanidad',
    dataset: 'Catálogo Nacional de Hospitales (CNH)',
    url: 'https://www.sanidad.gob.es/ciudadanos/prestaciones/centrosServiciosSNS/hospitales/home.htm',
    period: '2024',
  },
  aggregation: 'seccion-censal',
  levelNote:
    'Los hospitales son puntos geolocalizados: la distancia se mide desde el centroide de la zona hasta el hospital más cercano.',
  method:
    'Se geolocalizan los hospitales del catálogo, se calcula la distancia desde el centroide de la zona al más cercano y se invierte respecto a la media nacional ponderada: índice = media nacional ÷ distancia de la zona × 100. Más cerca, índice más alto. El índice se limita a 200 al mostrarlo: por debajo de un kilómetro el cociente se dispara y estar «cuatro veces más cerca» ya no cambia nada en la práctica.',
  inverted: true,
  // Media ponderada por población: la mayoría de los españoles vive en ciudades
  // con hospital propio, así que la distancia media es baja pese al mundo rural.
  nationalAverage: 3.2,
  directionLabel: 'Más alto = hospital más cerca',
  affinity: { category: 'servicios', weight: 1 },
};
