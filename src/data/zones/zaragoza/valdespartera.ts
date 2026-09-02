import type { Zone } from '~/lib/indicators/types';

export const zaragozaValdespartera: Zone = {
  id: 'zgz-valdespartera',
  name: 'Valdespartera',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-15-002',
  type: 'periurbana',
  population: 7800,
  areaKm2: 2.4,
  center: [41.6094, -0.9333],
  aliases: ['Arcosur', 'Avenida Casablanca', 'Vistabella', 'Ciudad del Transporte', '50019'],
  blurb:
    'Barrio nuevo de vivienda protegida: la población más joven y la mayor superficie verde, a cambio de más distancia a los hospitales.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 5.9, extra: { centrosEn10km: 3 } },
    educacion: { value: 0.55, extra: { centrosEn2km: 7 } },
    renta: { value: 15200 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 14.6 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 3250 },
    demografia: {
      value: 37.9,
      extra: { menores16: 21.3, mayores65: 7.2, tamanoHogar: 3.05 },
    },
  },
};
