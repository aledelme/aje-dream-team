import type { Zone } from '~/lib/indicators/types';

export const teruel: Zone = {
  id: 'teruel',
  name: 'Teruel',
  municipality: 'Teruel',
  province: 'Teruel',
  region: 'Aragón',
  level: 'municipal',
  type: 'urbana',
  population: 36200,
  areaKm2: 440,
  center: [40.3456, -1.1065],
  aliases: ['Plaza del Torico', 'Ensanche', 'San Julián', 'Los Planos', '44001', '44002'],
  blurb:
    'La capital más tranquila del conjunto: la criminalidad más baja, densidad muy reducida y población envejecida.',
  values: {
    seguridad: { value: 30.9 },
    inundacion: { value: 'periodo-500' },
    sismico: { value: 'bajo' },
    incendios: { value: 'media' },
    hospitales: { value: 1.2, extra: { centrosEn10km: 1 } },
    educacion: { value: 0.5, extra: { centrosEn2km: 9 } },
    renta: { value: 13100 },
    'esperanza-vida': { value: 84.0 },
    'zonas-verdes': { value: 7.1 },
    viento: { value: 12.6, note: 'Teruel (8368U)' },
    densidad: { value: 82 },
    demografia: {
      value: 45.9,
      extra: { menores16: 13.1, mayores65: 23.8, tamanoHogar: 2.38 },
    },
  },
};
