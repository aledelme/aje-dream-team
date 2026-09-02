import type { IndicatorDef, GroupId } from '~/lib/indicators/types';
import { seguridad } from './seguridad';
import { renta } from './renta';
import { esperanzaVida } from './esperanza-vida';
import { zonasVerdes } from './zonas-verdes';
import { densidad } from './densidad';
import { hospitales } from './hospitales';
import { educacion } from './educacion';
import { inundacion } from './inundacion';
import { sismico } from './sismico';
import { incendios } from './incendios';
import { viento } from './viento';
import { demografia } from './demografia';

/**
 * Registro único de indicadores.
 *
 * PARA AÑADIR UN INDICADOR NUEVO:
 *   1. crea `src/data/indicators/mi-indicador.ts` exportando un IndicatorDef;
 *   2. impórtalo y añádelo a esta lista;
 *   3. añade su valor en cada zona de `src/data/zones/`.
 * La ficha, el comparador, el ranking y la página de metodología lo recogen solos.
 * El orden de esta lista es el orden de presentación dentro de cada bloque.
 */
export const INDICATORS: IndicatorDef[] = [
  seguridad,
  inundacion,
  sismico,
  incendios,
  hospitales,
  educacion,
  renta,
  esperanzaVida,
  zonasVerdes,
  viento,
  densidad,
  demografia,
];

export const INDICATOR_IDS = INDICATORS.map((i) => i.id);

const byId = new Map(INDICATORS.map((i) => [i.id, i]));

export function getIndicator(id: string): IndicatorDef {
  const indicator = byId.get(id);
  if (!indicator) throw new Error(`Indicador desconocido: "${id}"`);
  return indicator;
}

export function indicatorsByGroup(group: GroupId): IndicatorDef[] {
  return INDICATORS.filter((i) => i.group === group);
}
