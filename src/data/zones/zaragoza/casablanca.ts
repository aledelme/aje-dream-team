import type { Zone } from '~/lib/indicators/types';

export const zaragozaCasablanca: Zone = {
  id: 'zgz-casablanca',
  name: 'Casablanca',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-14-004',
  type: 'periurbana',
  population: 9400,
  areaKm2: 1.9,
  center: [41.6237, -0.9046],
  aliases: ['Parque Venecia', 'Vía Hispanidad', 'Montecanal', 'Rosales del Canal', '50009', '50019'],
  blurb:
    'Distrito residencial de baja densidad al sur de la ciudad: la renta más alta del conjunto y mucha zona verde.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 3.4, extra: { centrosEn10km: 4 } },
    educacion: { value: 0.48, extra: { centrosEn2km: 11 } },
    renta: { value: 17900 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 11.2 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 4947 },
    demografia: {
      value: 43.0,
      extra: { menores16: 16.1, mayores65: 16.4, tamanoHogar: 2.71 },
    },
  },
};
