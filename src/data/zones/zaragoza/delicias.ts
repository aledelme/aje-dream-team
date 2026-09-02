import type { Zone } from '~/lib/indicators/types';

export const zaragozaDelicias: Zone = {
  id: 'zgz-delicias',
  name: 'Delicias',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-07-021',
  type: 'urbana',
  population: 17800,
  areaKm2: 0.71,
  center: [41.6531, -0.9083],
  aliases: [
    'Avenida Navarra',
    'Duquesa Villahermosa',
    'Estación Delicias',
    'Ciudad Jardín',
    '50010',
    '50017',
  ],
  blurb:
    'Barrio muy poblado y bien comunicado, con la densidad más alta del conjunto y poca superficie verde.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 1.8, extra: { centrosEn10km: 6 } },
    educacion: { value: 0.28, extra: { centrosEn2km: 26 } },
    renta: { value: 10400 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 2.2 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 25070 },
    demografia: {
      value: 45.1,
      extra: { menores16: 13.1, mayores65: 22.6, tamanoHogar: 2.42 },
    },
  },
};
