import type { Zone } from '~/lib/indicators/types';

export const huesca: Zone = {
  id: 'huesca',
  name: 'Huesca',
  municipality: 'Huesca',
  province: 'Huesca',
  region: 'Aragón',
  level: 'municipal',
  type: 'urbana',
  population: 53500,
  areaKm2: 161,
  center: [42.1401, -0.4089],
  aliases: ['Coso Alto', 'Perpetuo Socorro', 'Santo Domingo', 'Parque Miguel Servet', '22001', '22004'],
  blurb:
    'Capital de provincia de tamaño medio: servicios completos, criminalidad muy por debajo de la media y buena esperanza de vida.',
  values: {
    seguridad: { value: 38.4 },
    inundacion: { value: 'fuera' },
    sismico: { value: 'bajo' },
    incendios: { value: 'media' },
    hospitales: { value: 0.9, extra: { centrosEn10km: 2 } },
    educacion: { value: 0.42, extra: { centrosEn2km: 14 } },
    renta: { value: 14200 },
    'esperanza-vida': { value: 84.2 },
    'zonas-verdes': { value: 8.9 },
    viento: { value: 11.8, note: 'Huesca-Monflorite (9898)' },
    densidad: { value: 332 },
    demografia: {
      value: 44.8,
      extra: { menores16: 13.9, mayores65: 22.1, tamanoHogar: 2.41 },
    },
  },
};
