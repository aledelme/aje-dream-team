import type { Zone } from '~/lib/indicators/types';

export const zaragozaCascoHistorico: Zone = {
  id: 'zgz-casco-historico',
  name: 'Casco Histórico',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-01-006',
  type: 'urbana',
  population: 12400,
  areaKm2: 0.98,
  center: [41.6561, -0.8773],
  aliases: [
    'El Tubo',
    'Plaza del Pilar',
    'San Pablo',
    'Magdalena',
    'La Seo',
    'Coso Bajo',
    '50001',
    '50003',
  ],
  blurb:
    'Casco antiguo junto al Ebro: servicios a pie de calle, renta por debajo de la media y parte del ámbito con riesgo de avenida.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'periodo-500' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 1.4, extra: { centrosEn10km: 7 } },
    educacion: { value: 0.3, extra: { centrosEn2km: 28 } },
    renta: { value: 11200 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 4.4 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 12653 },
    demografia: {
      value: 43.2,
      extra: { menores16: 13.8, mayores65: 21.0, tamanoHogar: 2.28 },
    },
  },
};
