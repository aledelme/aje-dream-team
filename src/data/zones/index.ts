import type { Zone } from '~/lib/indicators/types';
import { INDICATORS } from '~/data/indicators';
import { isRisk } from '~/lib/indicators/compute';

import { zaragozaCentro } from './zaragoza/centro';
import { zaragozaCascoHistorico } from './zaragoza/casco-historico';
import { zaragozaDelicias } from './zaragoza/delicias';
import { zaragozaActur } from './zaragoza/actur';
import { zaragozaUniversidad } from './zaragoza/universidad';
import { zaragozaLasFuentes } from './zaragoza/las-fuentes';
import { zaragozaCasablanca } from './zaragoza/casablanca';
import { zaragozaValdespartera } from './zaragoza/valdespartera';

import { huesca } from './aragon/huesca';
import { teruel } from './aragon/teruel';
import { jaca } from './aragon/jaca';
import { calatayud } from './aragon/calatayud';
import { alcaniz } from './aragon/alcaniz';
import { utebo } from './aragon/utebo';

/**
 * Catálogo de zonas de la demo.
 *
 * PARA AÑADIR UNA ZONA NUEVA:
 *   1. crea el fichero en `zaragoza/`, `aragon/` o una carpeta nueva por provincia;
 *   2. impórtalo y añádelo a esta lista.
 * La validación de abajo se ejecuta en el build y falla si a la zona le falta
 * algún indicador o si declara un nivel de riesgo inexistente.
 */
export const ZONES: Zone[] = [
  zaragozaCentro,
  zaragozaCascoHistorico,
  zaragozaDelicias,
  zaragozaActur,
  zaragozaUniversidad,
  zaragozaLasFuentes,
  zaragozaCasablanca,
  zaragozaValdespartera,
  huesca,
  teruel,
  jaca,
  calatayud,
  alcaniz,
  utebo,
];

function validate(zones: Zone[]): void {
  const seen = new Set<string>();
  for (const zone of zones) {
    if (seen.has(zone.id)) throw new Error(`Zona duplicada: "${zone.id}"`);
    seen.add(zone.id);

    for (const indicator of INDICATORS) {
      const value = zone.values[indicator.id];
      const reason = zone.unavailable?.[indicator.id];

      if (!value && !reason) {
        throw new Error(
          `La zona "${zone.id}" no declara el indicador "${indicator.id}". ` +
            'Añade su valor en `values` o justifica su ausencia en `unavailable`.',
        );
      }
      if (!value) continue;

      if (isRisk(indicator)) {
        const ok = indicator.levels.some((level) => level.id === value.value);
        if (!ok) {
          throw new Error(
            `La zona "${zone.id}" declara el nivel "${String(value.value)}" para "${indicator.id}", ` +
              `que no existe. Niveles válidos: ${indicator.levels.map((l) => l.id).join(', ')}.`,
          );
        }
      } else if (typeof value.value !== 'number' || !Number.isFinite(value.value)) {
        throw new Error(
          `La zona "${zone.id}" debe declarar un número para el indicador "${indicator.id}".`,
        );
      }
    }
  }
}

validate(ZONES);

const byId = new Map(ZONES.map((z) => [z.id, z]));

export function getZone(id: string): Zone | undefined {
  return byId.get(id);
}

export function requireZone(id: string): Zone {
  const zone = byId.get(id);
  if (!zone) throw new Error(`Zona desconocida: "${id}"`);
  return zone;
}

/** Zonas agrupadas por municipio, para listados y desplegables. */
export function zonesByMunicipality(): { municipality: string; zones: Zone[] }[] {
  const groups = new Map<string, Zone[]>();
  for (const zone of ZONES) {
    const list = groups.get(zone.municipality) ?? [];
    list.push(zone);
    groups.set(zone.municipality, list);
  }
  return [...groups.entries()].map(([municipality, zones]) => ({ municipality, zones }));
}
