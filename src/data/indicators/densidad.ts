import type { DescriptiveIndicator } from '~/lib/indicators/types';

/**
 * Dato descriptivo: vivir en alta o baja densidad no es bueno ni malo, depende
 * de lo que busque cada persona. No se colorea como bueno/malo.
 */
export const densidad: DescriptiveIndicator = {
  id: 'densidad',
  kind: 'descriptive',
  label: 'Densidad demográfica',
  group: 'contexto',
  unit: 'hab./km²',
  decimals: 0,
  summary: 'Habitantes por kilómetro cuadrado de la zona.',
  source: {
    organism: 'INE',
    dataset: 'Padrón Continuo + superficie de la sección censal',
    url: 'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177012',
    period: '2024',
  },
  aggregation: 'seccion-censal',
  method:
    'Población empadronada en la zona dividida entre su superficie en km². Se muestra el valor absoluto y el percentil respecto a la distribución nacional de secciones censales (ponderada por población); no se marca como bueno ni malo.',
  nationalAverage: 4850,
  // Deciles de la distribución nacional (P0…P100) usados para calcular el percentil.
  distribution: [10, 90, 700, 2100, 3600, 5200, 7400, 10500, 14800, 22000, 48000],
};
