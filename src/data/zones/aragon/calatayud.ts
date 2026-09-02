import type { Zone } from '~/lib/indicators/types';

export const calatayud: Zone = {
  id: 'calatayud',
  name: 'Calatayud',
  municipality: 'Calatayud',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'municipal',
  type: 'rural',
  population: 19800,
  areaKm2: 155,
  center: [41.3536, -1.6428],
  aliases: ['Puerta de Terrer', 'Río Jalón', 'Mesones', 'Sierra de Vicort', '50300'],
  blurb:
    'Nudo de comunicaciones del Jalón: vivienda asequible y servicios propios, pero con parte del casco en zona inundable de periodo de retorno de 100 años.',
  values: {
    inundacion: { value: 'periodo-100' },
    sismico: { value: 'bajo' },
    incendios: { value: 'media' },
    hospitales: { value: 1.1, extra: { centrosEn10km: 1 } },
    educacion: { value: 0.55, extra: { centrosEn2km: 7 } },
    renta: { value: 11300 },
    'esperanza-vida': { value: 82.8 },
    'zonas-verdes': { value: 5.4 },
    viento: { value: 13.4, note: 'Calatayud (9394X)' },
    densidad: { value: 128 },
    demografia: {
      value: 46.8,
      extra: { menores16: 13.4, mayores65: 25.6, tamanoHogar: 2.47 },
    },
  },
  unavailable: {
    seguridad:
      'El Ministerio del Interior sólo publica el balance de criminalidad para municipios de más de 20.000 habitantes; Calatayud tiene 19.800 empadronados.',
  },
};
