import type { Zone } from '~/lib/indicators/types';

/** Quita acentos y pasa a minúsculas para comparar textos escritos a mano. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface Indexed {
  zone: Zone;
  haystack: string[];
}

function buildIndex(zones: Zone[]): Indexed[] {
  return zones.map((zone) => ({
    zone,
    haystack: [zone.name, zone.municipality, zone.province, ...zone.aliases].map(normalize),
  }));
}

export interface SearchResult {
  zone: Zone;
  /** Término que ha provocado la coincidencia, para explicarla en la interfaz. */
  matchedOn: string;
  score: number;
}

/**
 * Búsqueda por texto sobre el catálogo de zonas: nombre, municipio, provincia y
 * alias (calles, barrios y códigos postales). Todo en local, sin geocodificador
 * externo: en la demo el usuario escribe una dirección y la resolvemos contra
 * las zonas disponibles.
 */
export function searchZones(zones: Zone[], query: string, limit = 6): SearchResult[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results: SearchResult[] = [];
  for (const { zone, haystack } of buildIndex(zones)) {
    let best = 0;
    let matchedOn = '';
    const labels = [zone.name, zone.municipality, zone.province, ...zone.aliases];

    haystack.forEach((field, i) => {
      let score = 0;
      if (field === q) score = 100;
      else if (field.startsWith(q)) score = 80;
      else if (field.includes(q)) score = 60;
      else if (q.includes(field) && field.length > 3) score = 50;

      // El nombre de la zona y el municipio pesan más que un alias suelto.
      if (score > 0) {
        if (i === 0) score += 12;
        else if (i === 1) score += 6;
        if (score > best) {
          best = score;
          matchedOn = labels[i]!;
        }
      }
    });

    if (best > 0) results.push({ zone, matchedOn, score: best });
  }

  return results.sort((a, b) => b.score - a.score || a.zone.name.localeCompare(b.zone.name)).slice(0, limit);
}
