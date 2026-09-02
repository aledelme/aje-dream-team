import type { Zone } from '~/lib/indicators/types';

export const zaragozaLasFuentes: Zone = {
  id: 'zgz-las-fuentes',
  name: 'Las Fuentes',
  municipality: 'Zaragoza',
  province: 'Zaragoza',
  region: 'Aragón',
  level: 'seccion-censal',
  censusSection: '50-297-06-018',
  type: 'urbana',
  population: 13200,
  areaKm2: 0.66,
  center: [41.6469, -0.8613],
  aliases: ['Compromiso de Caspe', 'Miguel Servet', 'Camino de las Torres', 'Cesáreo Alierta', '50002'],
  blurb:
    'Barrio residencial consolidado junto al Huerva, con la población más envejecida del conjunto y parte del ámbito en zona inundable.',
  values: {
    seguridad: { value: 51.8 },
    inundacion: { value: 'periodo-100' },
    sismico: { value: 'bajo' },
    incendios: { value: 'baja' },
    hospitales: { value: 2.2, extra: { centrosEn10km: 6 } },
    educacion: { value: 0.31, extra: { centrosEn2km: 17 } },
    renta: { value: 10100 },
    'esperanza-vida': { value: 83.9 },
    'zonas-verdes': { value: 3.6 },
    viento: { value: 14.2, note: 'Zaragoza Aeropuerto (9434)' },
    densidad: { value: 20000 },
    demografia: {
      value: 46.3,
      extra: { menores16: 12.4, mayores65: 25.1, tamanoHogar: 2.36 },
    },
  },
};
