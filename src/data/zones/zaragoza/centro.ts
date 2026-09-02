import type { Zone } from '~/lib/indicators/types';

export const zaragozaCentro: Zone = {
  id: 'zgz-centro',
  name: 'Centro',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-02-014',
  type: 'urbana',
  population: 8900,
  areaKm2: 0.42,
  center: [41.6485, -0.8891],
  aliases: [
    'Paseo Independencia',
    'Plaza España',
    'Gran Vía',
    'Sagasta',
    'Plaza de los Sitios',
    '50004',
    '50005',
    '50008',
  ],
  blurb:
    'El eje comercial y administrativo de la ciudad: máxima accesibilidad a servicios, poca superficie verde y hogares pequeños.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 0.9, extra: { centrosEn10km: 7 } },
    educacion: { value: 0.25, extra: { centrosEn2km: 34 } },
    renta: { value: 16800 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 3.1 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 21190 },
    demografia: {
      value: 45.8,
      extra: { menores16: 12.1, mayores65: 23.4, tamanoHogar: 2.05 },
    },
  },
};
