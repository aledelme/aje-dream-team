import type { Zone } from '~/lib/indicators/types';

export const zaragozaActur: Zone = {
  id: 'zgz-actur',
  name: 'Actur–Rey Fernando',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-17-009',
  type: 'urbana',
  population: 14600,
  areaKm2: 1.35,
  center: [41.6725, -0.8925],
  aliases: [
    'Parque Goya',
    'Avenida Ranillas',
    'Expo',
    'Puente del Tercer Milenio',
    'Rey Fernando',
    '50018',
  ],
  blurb:
    'Ensanche moderno en la margen izquierda del Ebro: trama amplia, mucho verde y población más joven que la media urbana.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'periodo-500' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 2.6, extra: { centrosEn10km: 5 } },
    educacion: { value: 0.35, extra: { centrosEn2km: 18 } },
    renta: { value: 14100 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 9.8 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 10815 },
    demografia: {
      value: 42.4,
      extra: { menores16: 15.2, mayores65: 17.1, tamanoHogar: 2.55 },
    },
  },
};
