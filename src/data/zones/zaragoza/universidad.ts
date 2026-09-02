import type { Zone } from '~/lib/indicators/types';

export const zaragozaUniversidad: Zone = {
  id: 'zgz-universidad',
  name: 'Universidad',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-04-011',
  type: 'urbana',
  population: 10900,
  areaKm2: 0.82,
  center: [41.6408, -0.8985],
  aliases: [
    'Campus San Francisco',
    'Gran Vía',
    'Fernando el Católico',
    'Hospital Clínico',
    'Romareda',
    '50009',
  ],
  blurb:
    'Zona universitaria y hospitalaria: la mejor accesibilidad sanitaria del conjunto y renta por encima de la media.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 0.6, extra: { centrosEn10km: 7 } },
    educacion: { value: 0.22, extra: { centrosEn2km: 30 } },
    renta: { value: 15600 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 7.4 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 13293 },
    demografia: {
      value: 44.6,
      extra: { menores16: 12.8, mayores65: 21.9, tamanoHogar: 2.18 },
    },
  },
};
