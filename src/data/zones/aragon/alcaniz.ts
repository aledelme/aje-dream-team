import type { Zone } from '~/lib/indicators/types';

export const alcaniz: Zone = {
  id: 'alcaniz',
  name: 'Alcañiz',
  municipality: 'Alcañiz',
  province: 'Teruel',
  region: 'Aragón',
  level: 'municipal',
  type: 'rural',
  population: 16100,
  areaKm2: 472,
  center: [41.0503, -0.1383],
  aliases: ['Bajo Aragón', 'Motorland', 'Río Guadalope', 'Plaza de España', '44600'],
  blurb:
    'Capital del Bajo Aragón: hospital comarcal propio y renta media, con la frecuencia de incendios forestales más alta junto a Jaca.',
  values: {
    inundacion: { value: 'periodo-500' },
    sismico: { value: 'bajo' },
    incendios: { value: 'alta' },
    hospitales: { value: 0.7, extra: { centrosEn10km: 1 } },
    educacion: { value: 0.58, extra: { centrosEn2km: 5 } },
    renta: { value: 12400 },
    'esperanza-vida': { value: 83.3 },
    'zonas-verdes': { value: 6.8 },
    viento: { value: 15.2, note: 'Alcañiz (9563X)' },
    densidad: { value: 34 },
    demografia: {
      value: 45.2,
      extra: { menores16: 14.2, mayores65: 23.0, tamanoHogar: 2.45 },
    },
  },
  unavailable: {
    seguridad:
      'El Ministerio del Interior sólo publica el balance de criminalidad para municipios de más de 20.000 habitantes; Alcañiz tiene 16.100 empadronados.',
  },
};
