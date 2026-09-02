import type { Zone } from '~/lib/indicators/types';

export const utebo: Zone = {
  id: 'utebo',
  name: 'Utebo',
  municipality: 'Utebo',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'municipal',
  type: 'periurbana',
  population: 20400,
  areaKm2: 18.6,
  center: [41.7089, -1.0006],
  aliases: ['Malpica', 'Ribera Alta del Ebro', 'Avenida de Zaragoza', '50180'],
  blurb:
    'Municipio del área metropolitana de Zaragoza: población joven, criminalidad baja y dependencia de los hospitales de la capital.',
  values: {
    seguridad: { value: 33.1 },
    inundacion: { value: 'periodo-100' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 8.4, extra: { centrosEn10km: 5 } },
    educacion: { value: 0.44, extra: { centrosEn2km: 6 } },
    renta: { value: 13800 },
    'esperanza-vida': { value: 83.7 },
    'zonas-verdes': { value: 7.6 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 1097 },
    demografia: {
      value: 41.6,
      extra: { menores16: 17.4, mayores65: 14.8, tamanoHogar: 2.72 },
    },
  },
};
