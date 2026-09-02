import type { Zone } from '~/lib/indicators/types';

export const jaca: Zone = {
  id: 'jaca',
  name: 'Jaca',
  municipality: 'Jaca',
  province: 'Huesca',
  region: 'Aragón',
  level: 'municipal',
  type: 'rural',
  population: 13100,
  areaKm2: 406,
  center: [42.5697, -0.5497],
  aliases: ['Ciudadela', 'Catedral de Jaca', 'Canfranc', 'Pirineo', 'Valle del Aragón', '22700'],
  blurb:
    'Municipio de montaña con la mayor esperanza de vida del conjunto, pero también el único con riesgo sísmico medio y viento intenso.',
  values: {
    seguridad: { value: 41.2 },
    inundacion: { value: 'periodo-500' },
    sismico: { value: 'medio' },
    incendios: { value: 'alta' },
    hospitales: { value: 0.8, extra: { centrosEn10km: 1 } },
    educacion: { value: 0.61, extra: { centrosEn2km: 6 } },
    renta: { value: 13600 },
    'esperanza-vida': { value: 84.6 },
    'zonas-verdes': { value: 12.4 },
    viento: { value: 18.9, note: 'Jaca (9491E)' },
    densidad: { value: 32 },
    demografia: {
      value: 44.2,
      extra: { menores16: 14.1, mayores65: 21.5, tamanoHogar: 2.44 },
    },
  },
};
