import { num } from '~/lib/format';
import type {
  DescriptiveIndicator,
  IndexIndicator,
  IndicatorDef,
  RiskIndicator,
  RiskLevel,
  RiskTone,
  Zone,
  ZoneValue,
} from './types';

/**
 * Motor de cálculo compartido: convierte valores absolutos en índices
 * comparables (100 = media nacional ponderada por población) aplicando la
 * inversión cuando el dato original es "malo si sube".
 *
 * Es el mismo código para todos los indicadores, y la fórmula que aplica se
 * enseña al usuario en el panel de transparencia.
 */

export function getValue(zone: Zone, indicatorId: string): ZoneValue | undefined {
  return zone.values[indicatorId];
}

export function numericValue(zone: Zone, indicatorId: string): number | undefined {
  const raw = zone.values[indicatorId]?.value;
  return typeof raw === 'number' ? raw : undefined;
}

/**
 * Tope del índice mostrado.
 *
 * Los indicadores invertidos de distancia (hospitales, centros educativos)
 * generan cocientes enormes: un barrio con el hospital a 600 m frente a una
 * media nacional de 6,8 km daría 1.133. Ese número no significa "once veces
 * mejor" para quien busca vivienda, así que se limita a 200 (el doble de la
 * media) y se advierte de ello. El valor absoluto, que es el dato real, se
 * sigue mostrando siempre sin tocar.
 */
export const INDEX_CAP = 200;

/** Índice bruto donde 100 = media nacional y más alto es siempre mejor. */
export function computeIndex(indicator: IndexIndicator, value: number): number {
  if (value <= 0) return 0;
  return indicator.inverted
    ? (indicator.nationalAverage / value) * 100
    : (value / indicator.nationalAverage) * 100;
}

/** Índice limitado a `INDEX_CAP`: es el que se muestra y el que puntúa. */
export function displayIndex(indicator: IndexIndicator, value: number): number {
  return Math.min(computeIndex(indicator, value), INDEX_CAP);
}

export function isCapped(indicator: IndexIndicator, value: number): boolean {
  return computeIndex(indicator, value) > INDEX_CAP;
}

/** Fórmula aplicada, en texto, para el panel de transparencia. */
export function indexFormula(indicator: IndexIndicator, value: number): string {
  const decimals = indicator.decimals ?? 1;
  const raw = computeIndex(indicator, value);
  const base = indicator.inverted
    ? `${num(indicator.nationalAverage, decimals)} (media nacional) ÷ ${num(value, decimals)} (zona) × 100 = ${num(Math.round(raw))}`
    : `${num(value, decimals)} (zona) ÷ ${num(indicator.nationalAverage, decimals)} (media nacional) × 100 = ${num(Math.round(raw))}`;
  return raw > INDEX_CAP ? `${base}, limitado a ${INDEX_CAP} al mostrarlo` : base;
}

/**
 * Color semántico de un índice. Alrededor de la media se usa gris neutro: una
 * diferencia de pocos puntos con España no es ni buena ni mala noticia.
 */
export function toneForIndex(index: number): RiskTone | 'neutral' {
  if (index >= 108) return 'good';
  if (index <= 92) return 'bad';
  return 'neutral';
}

export function resolveRiskLevel(indicator: RiskIndicator, levelId: unknown): RiskLevel {
  const level = indicator.levels.find((l) => l.id === levelId);
  if (!level) {
    throw new Error(
      `Nivel de riesgo "${String(levelId)}" no declarado en el indicador "${indicator.id}"`,
    );
  }
  return level;
}

/**
 * Percentil nacional a partir de los deciles declarados en el indicador.
 * Interpolación lineal entre deciles: transparente y suficiente para la demo.
 */
export function percentile(indicator: DescriptiveIndicator, value: number): number | undefined {
  const dist = indicator.distribution;
  if (!dist || dist.length < 2) return undefined;
  if (value <= dist[0]!) return 0;
  const last = dist[dist.length - 1]!;
  if (value >= last) return 100;

  const step = 100 / (dist.length - 1);
  for (let i = 1; i < dist.length; i++) {
    const lower = dist[i - 1]!;
    const upper = dist[i]!;
    if (value <= upper) {
      const ratio = upper === lower ? 0 : (value - lower) / (upper - lower);
      return Math.round((i - 1) * step + ratio * step);
    }
  }
  return 100;
}

/** Diferencia relativa entre dos valores, en % (para el modo «entre zonas»). */
export function relativeDifference(a: number, b: number): number {
  if (b === 0) return 0;
  return ((a - b) / b) * 100;
}

export function isIndex(indicator: IndicatorDef): indicator is IndexIndicator {
  return indicator.kind === 'index';
}

export function isRisk(indicator: IndicatorDef): indicator is RiskIndicator {
  return indicator.kind === 'risk';
}

export function isDescriptive(indicator: IndicatorDef): indicator is DescriptiveIndicator {
  return indicator.kind === 'descriptive';
}

/**
 * Aviso de nivel que debe verse siempre que el dato no corresponda exactamente
 * a la zona mostrada (dato municipal, estación meteorológica, parcela...).
 */
export function levelChip(indicator: IndicatorDef, zone: Zone, value?: ZoneValue): string | null {
  if (indicator.aggregation === 'municipal' && zone.level === 'seccion-censal') {
    return `Dato municipal · ${zone.municipality}`;
  }
  if (indicator.aggregation === 'municipal') return 'Dato municipal';
  if (indicator.aggregation === 'seccion-censal' && zone.level === 'municipal') {
    return 'Media municipal (agregado de secciones)';
  }
  if (indicator.aggregation === 'estacion-meteo') {
    return value?.note ? `Estación: ${value.note}` : 'Estación meteorológica más cercana';
  }
  if (indicator.aggregation === 'parcela') return 'Nivel de parcela';
  return null;
}
