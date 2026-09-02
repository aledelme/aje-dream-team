import type { DescriptiveIndicator } from '~/lib/indicators/types';

/**
 * Dato descriptivo multi-valor: edad media como valor principal y estructura de
 * población y hogar como facetas. Sin dirección buena/mala.
 */
export const demografia: DescriptiveIndicator = {
  id: 'demografia',
  kind: 'descriptive',
  label: 'Demografía',
  group: 'contexto',
  unit: 'años (edad media)',
  decimals: 1,
  summary: 'Edad media, estructura por edades y tamaño medio del hogar.',
  source: {
    organism: 'INE',
    dataset: 'Padrón Continuo — población por sexo, edad y hogares',
    url: 'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177012',
    period: '2024',
  },
  aggregation: 'seccion-censal',
  method:
    'Se agregan los datos del Padrón por sección censal: edad media, porcentaje de menores de 16 años, porcentaje de mayores de 65 y número medio de personas por hogar. Es un dato de contexto: no existe un valor "bueno", depende del perfil de cada persona.',
  nationalAverage: 44.1,
  distribution: [32, 37.5, 40, 41.8, 43.2, 44.1, 45.4, 47.1, 49.3, 52.6, 62],
  facets: [
    { id: 'menores16', label: 'Menores de 16 años', unit: '%', decimals: 1, nationalAverage: 13.6 },
    { id: 'mayores65', label: 'Mayores de 65 años', unit: '%', decimals: 1, nationalAverage: 20.4 },
    {
      id: 'tamanoHogar',
      label: 'Tamaño medio del hogar',
      unit: 'personas',
      decimals: 2,
      nationalAverage: 2.49,
    },
  ],
};
