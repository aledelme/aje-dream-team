import { INDICATORS } from '~/data/indicators';
import {
  INDEX_CAP,
  displayIndex,
  isIndex,
  isRisk,
  percentile,
  resolveRiskLevel,
} from '~/lib/indicators/compute';
import type { DescriptiveIndicator, PriorityCategory, Zone } from '~/lib/indicators/types';
import { densidad } from '~/data/indicators/densidad';
import { HOUSEHOLD_OPTIONS, PRIORITY_LABELS, type Household, type Profile } from './profile';

/**
 * Algoritmo de afinidad de la demo.
 *
 * Es deliberadamente simple y, sobre todo, explicable: cada zona recibe puntos
 * de tres bloques y pierde puntos por los riesgos declarados. Todos los
 * componentes se devuelven en `contributions` para poder enseñar al usuario por
 * qué una zona encaja con su perfil.
 */

/** Reparto de la puntuación máxima entre bloques (suma 100). */
export const BLOCKS = {
  priorities: 65,
  income: 20,
  setting: 15,
} as const;

/** Peso según la posición en la que el usuario coloca cada prioridad. */
const POSITION_WEIGHTS = [1, 0.75, 0.5, 0.3];
/** Peso de una categoría que el usuario no ha ordenado. */
const UNRANKED_WEIGHT = 0.25;

/** Penalización máxima acumulable por riesgos, para que no anule el resto. */
const MAX_RISK_PENALTY = 25;

/**
 * Ajustes por situación vital: multiplican el peso del indicador dentro de su
 * categoría. Un jubilado valora más el hospital; una familia, el colegio.
 */
const HOUSEHOLD_MODIFIERS: Record<Household, Record<string, number>> = {
  soltero: { educacion: 0.5, hospitales: 0.9, renta: 1.2, 'zonas-verdes': 0.9 },
  pareja: {},
  familia: { educacion: 1.5, 'zonas-verdes': 1.3, seguridad: 1.2, hospitales: 1.1 },
  jubilado: { hospitales: 1.6, 'esperanza-vida': 1.4, seguridad: 1.2, educacion: 0.3 },
};

/** Percentil de densidad que se considera ideal según el entorno preferido. */
const DENSITY_TARGET_PERCENTILE: Record<Profile['setting'], number> = {
  ciudad: 82,
  rural: 22,
};

export interface Contribution {
  id: string;
  label: string;
  /** Puntos aportados (positivos) o restados (negativos) al total. */
  points: number;
  /** Puntos máximos que podía aportar este componente. */
  max: number;
  detail: string;
  /**
   * El índice ha llegado al tope y no distingue entre zonas buenas: sirve para
   * explicar, pero no para diferenciar una zona de otra.
   */
  saturated?: boolean;
}

export interface ZoneAffinity {
  zone: Zone;
  score: number;
  contributions: Contribution[];
  positives: Contribution[];
  negatives: Contribution[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Convierte un índice (100 = media nacional) en una nota de 0 a 100.
 * Índice 100 → 50 puntos; índice 140 → 100; índice 60 → 0.
 */
export function indexToScore(index: number): number {
  return clamp(50 + (index - 100) * 1.25, 0, 100);
}

/** Renta neta por persona equivalente del usuario, comparable con la de la zona. */
export function personalIncome(profile: Profile): number {
  const household = HOUSEHOLD_OPTIONS.find((h) => h.id === profile.household);
  const equivalence = household?.equivalence ?? 1;
  // ~75 % de la renta bruta llega neta al hogar, repartida entre personas equivalentes.
  return (profile.income * 0.75) / equivalence;
}

/** Encaje de renta: 100 cuando la renta de la zona coincide con la del usuario. */
export function incomeFit(profile: Profile, zoneIncome: number): number {
  const mine = personalIncome(profile);
  if (mine <= 0 || zoneIncome <= 0) return 50;
  const gap = Math.abs(Math.log(zoneIncome / mine));
  return clamp(100 * Math.exp(-gap / 0.8), 0, 100);
}

/** Encaje de entorno: cercanía al percentil de densidad buscado. */
export function settingFit(profile: Profile, zone: Zone): { score: number; zonePercentile: number } {
  const raw = zone.values[densidad.id]?.value;
  const value = typeof raw === 'number' ? raw : 0;
  const zonePercentile = percentile(densidad as DescriptiveIndicator, value) ?? 50;
  const target = DENSITY_TARGET_PERCENTILE[profile.setting];
  const score = clamp(100 - Math.abs(zonePercentile - target) * 1.4, 0, 100);
  return { score, zonePercentile };
}

function categoryWeights(profile: Profile): Record<PriorityCategory, number> {
  const weights = {
    seguridad: UNRANKED_WEIGHT,
    servicios: UNRANKED_WEIGHT,
    clima: UNRANKED_WEIGHT,
    'calidad-vida': UNRANKED_WEIGHT,
  } as Record<PriorityCategory, number>;

  profile.priorities.forEach((category, position) => {
    weights[category] = POSITION_WEIGHTS[position] ?? UNRANKED_WEIGHT;
  });
  return weights;
}

export function scoreZone(zone: Zone, profile: Profile): ZoneAffinity {
  const weights = categoryWeights(profile);
  const modifiers = HOUSEHOLD_MODIFIERS[profile.household] ?? {};
  const contributions: Contribution[] = [];

  // --- Bloque 1: indicadores comparables, ponderados por las prioridades ---
  const weighted = INDICATORS.filter(isIndex).map((indicator) => {
    const weight =
      weights[indicator.affinity.category] *
      indicator.affinity.weight *
      (modifiers[indicator.id] ?? 1);
    const raw = zone.values[indicator.id]?.value;
    const available = typeof raw === 'number';
    // Un dato que la fuente no publica no premia ni castiga: puntúa como la media.
    const index = available ? displayIndex(indicator, raw) : 100;
    const score = indexToScore(index);
    return { indicator, weight, score, index, available };
  });

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0) || 1;
  for (const item of weighted) {
    const max = (BLOCKS.priorities * item.weight) / totalWeight;
    const points = (max * item.score) / 100;
    contributions.push({
      id: item.indicator.id,
      label: item.indicator.label,
      points,
      max,
      saturated: item.index >= INDEX_CAP,
      detail: item.available
        ? `índice ${Math.round(item.index)} (media nacional = 100) · prioridad «${PRIORITY_LABELS[item.indicator.affinity.category]}»`
        : 'dato no disponible en la fuente: puntúa como la media nacional',
    });
  }

  // --- Bloque 2: encaje de renta ---
  const zoneIncome = zone.values['renta']?.value;
  const fit = incomeFit(profile, typeof zoneIncome === 'number' ? zoneIncome : 0);
  contributions.push({
    id: 'encaje-renta',
    label: 'Encaje con tu renta',
    points: (BLOCKS.income * fit) / 100,
    max: BLOCKS.income,
    detail: `renta de la zona ${Math.round(Number(zoneIncome) || 0).toLocaleString('es-ES')} € frente a tu renta equivalente de ${Math.round(personalIncome(profile)).toLocaleString('es-ES')} € por persona`,
  });

  // --- Bloque 3: encaje con el entorno (ciudad / rural) ---
  const setting = settingFit(profile, zone);
  contributions.push({
    id: 'encaje-entorno',
    label: profile.setting === 'ciudad' ? 'Encaje con vida urbana' : 'Encaje con entorno rural',
    points: (BLOCKS.setting * setting.score) / 100,
    max: BLOCKS.setting,
    detail: `densidad en el percentil ${setting.zonePercentile} de España; buscas el entorno de percentil ${DENSITY_TARGET_PERCENTILE[profile.setting]}`,
  });

  // --- Penalizaciones por riesgos declarados ---
  let penalty = 0;
  for (const indicator of INDICATORS.filter(isRisk)) {
    const raw = zone.values[indicator.id]?.value;
    if (raw === undefined) continue;
    const level = resolveRiskLevel(indicator, raw);
    if (level.penalty === 0) continue;
    const scaled = level.penalty * weights[indicator.affinity.category];
    penalty += scaled;
    contributions.push({
      id: `riesgo-${indicator.id}`,
      label: indicator.label,
      points: -scaled,
      max: 0,
      detail: `${level.label} · penalización ajustada a la importancia que das a «${PRIORITY_LABELS[indicator.affinity.category]}»`,
    });
  }

  const cappedPenalty = Math.min(penalty, MAX_RISK_PENALTY);
  const gross = contributions.reduce((sum, c) => sum + Math.max(c.points, 0), 0);
  const score = clamp(Math.round(gross - cappedPenalty), 0, 100);

  return {
    zone,
    score,
    contributions,
    positives: pickPositives(contributions),
    negatives: contributions
      .filter((c) => c.points < 0 || (c.max > 0 && c.points / c.max < 0.4))
      .sort((a, b) => a.points / (a.max || 1) - b.points / (b.max || 1))
      .slice(0, 2),
  };
}

/**
 * Elige los tres factores que mejor explican el resultado.
 *
 * Se miden contra su propio máximo (así no gana siempre el indicador con más
 * peso) y se admite como mucho un indicador saturado: si media docena de zonas
 * tienen el hospital al lado, decirlo tres veces no explica nada; lo que
 * distingue a esta zona está en los demás factores.
 */
function pickPositives(contributions: Contribution[]): Contribution[] {
  const candidates = contributions
    .filter((c) => c.points > 0 && c.max > 0 && c.points / c.max >= 0.55)
    .sort((a, b) => b.points / b.max - a.points / a.max);

  const picked: Contribution[] = [];
  let saturatedUsed = false;
  for (const candidate of candidates) {
    if (candidate.saturated) {
      if (saturatedUsed) continue;
      saturatedUsed = true;
    }
    picked.push(candidate);
    if (picked.length === 3) break;
  }
  return picked;
}

/** Ranking de zonas ordenado por afinidad descendente. */
export function rankZones(zones: Zone[], profile: Profile): ZoneAffinity[] {
  return zones
    .map((zone) => scoreZone(zone, profile))
    .sort((a, b) => b.score - a.score || a.zone.name.localeCompare(b.zone.name));
}
