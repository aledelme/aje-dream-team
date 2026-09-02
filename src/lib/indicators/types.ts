/**
 * Contratos del registro de indicadores.
 *
 * Toda la interfaz se genera a partir de estas declaraciones: si añades un
 * indicador nuevo en `src/data/indicators/` y su valor en cada zona, aparece
 * automáticamente en la ficha, en el comparador y en la metodología.
 */

/** Categorías de prioridad que el usuario ordena en el formulario. */
export type PriorityCategory = 'seguridad' | 'servicios' | 'clima' | 'calidad-vida';

/** Bloques en los que se agrupan los KPIs dentro de la ficha de zona. */
export type GroupId = 'seguridad-riesgos' | 'servicios' | 'entorno' | 'contexto';

export const GROUPS: Record<GroupId, { label: string; description: string }> = {
  'seguridad-riesgos': {
    label: 'Seguridad y riesgos',
    description: 'Criminalidad registrada y exposición a riesgos naturales.',
  },
  servicios: {
    label: 'Servicios',
    description: 'Cercanía de equipamientos sanitarios y educativos.',
  },
  entorno: {
    label: 'Entorno y calidad de vida',
    description: 'Renta, salud, zonas verdes y estabilidad climática.',
  },
  contexto: {
    label: 'Contexto demográfico',
    description: 'Datos descriptivos: no son ni buenos ni malos, dependen de lo que busques.',
  },
};

/** Nivel real al que existe el dato en la fuente original. */
export type AggregationLevel =
  | 'seccion-censal'
  | 'municipal'
  | 'parcela'
  | 'estacion-meteo';

export const AGGREGATION_LABELS: Record<AggregationLevel, string> = {
  'seccion-censal': 'Sección censal',
  municipal: 'Municipal',
  parcela: 'Parcela',
  'estacion-meteo': 'Estación meteorológica',
};

export interface SourceRef {
  /** Organismo responsable. */
  organism: string;
  /** Nombre del conjunto de datos concreto. */
  dataset: string;
  url: string;
  /** Año o periodo de referencia del dato. */
  period: string;
}

interface IndicatorBase {
  id: string;
  /** Nombre tal y como se muestra al usuario (siempre en positivo). */
  label: string;
  group: GroupId;
  /** Unidad del valor absoluto. */
  unit: string;
  /** Una línea explicando qué mide. */
  summary: string;
  source: SourceRef;
  aggregation: AggregationLevel;
  /**
   * Aviso obligatorio cuando el dato se muestra sobre un nivel más fino que el
   * suyo (p. ej. dato municipal presentado en una sección censal).
   */
  levelNote?: string;
  /** Cómo se calcula, en lenguaje llano. Se muestra en el panel de detalle. */
  method: string;
  /** Decimales al formatear el valor absoluto. */
  decimals?: number;
}

/**
 * Indicador comparable: se expresa como % respecto a la media nacional
 * ponderada por población (100 = España).
 */
export interface IndexIndicator extends IndicatorBase {
  kind: 'index';
  /**
   * true cuando el dato original es "malo si sube" y se invierte para que en la
   * interfaz más alto sea siempre mejor.
   */
  inverted: boolean;
  /** Nombre del dato original antes de invertirlo (p. ej. «Tasa de criminalidad»). */
  originalLabel?: string;
  /** Media nacional ponderada por población, en unidades absolutas del dato original. */
  nationalAverage: number;
  /** Texto de dirección, p. ej. «Más alto = más seguro». */
  directionLabel: string;
  /** Peso del indicador dentro de su categoría de afinidad. */
  affinity: { category: PriorityCategory; weight: number };
}

export type RiskTone = 'good' | 'mid' | 'bad';

export interface RiskLevel {
  /** Clave usada en los datos de zona. */
  id: string;
  label: string;
  tone: RiskTone;
  description: string;
  /** Puntos de penalización en el cálculo de afinidad. */
  penalty: number;
}

/** Indicador categórico o binario: badge de nivel de riesgo, nunca un %. */
export interface RiskIndicator extends IndicatorBase {
  kind: 'risk';
  levels: RiskLevel[];
  affinity: { category: PriorityCategory };
}

export interface Facet {
  id: string;
  label: string;
  unit: string;
  decimals?: number;
  nationalAverage: number;
}

/** Indicador descriptivo: sin dirección buena/mala. */
export interface DescriptiveIndicator extends IndicatorBase {
  kind: 'descriptive';
  nationalAverage: number;
  /**
   * Deciles de la distribución nacional (11 valores, de P0 a P100) usados para
   * situar la zona en un percentil de forma transparente.
   */
  distribution?: number[];
  /** Valores adicionales que acompañan al principal (p. ej. estructura de edad). */
  facets?: Facet[];
}

export type IndicatorDef = IndexIndicator | RiskIndicator | DescriptiveIndicator;

/** Valor de un indicador en una zona concreta. */
export interface ZoneValue {
  /** Número para `index`/`descriptive`; clave de nivel para `risk`. */
  value: number | string;
  /** Métricas secundarias (facetas, nº de equipamientos, estación usada...). */
  extra?: Record<string, number>;
  /** Nota específica de esta zona (p. ej. nombre de la estación AEMET). */
  note?: string;
}

export type ZoneType = 'urbana' | 'periurbana' | 'rural';

export const ZONE_TYPE_LABELS: Record<ZoneType, string> = {
  urbana: 'Urbana',
  periurbana: 'Periurbana',
  rural: 'Rural / semirrural',
};

export interface Zone {
  id: string;
  /** Nombre de la zona (barrio, distrito o municipio). */
  name: string;
  municipality: string;
  province: string;
  region: string;
  /** Nivel al que se define la zona en la demo. */
  level: 'seccion-censal' | 'municipal';
  /** Código de sección censal cuando aplica. */
  censusSection?: string;
  type: ZoneType;
  population: number;
  /** Superficie en km², usada para contextualizar la densidad. */
  areaKm2: number;
  center: [number, number];
  /** Términos alternativos para el buscador: calles, códigos postales, alias. */
  aliases: string[];
  /** Frase corta de contexto mostrada en la ficha. */
  blurb: string;
  values: Record<string, ZoneValue>;
  /**
   * Indicadores que la fuente no publica para esta zona, con el motivo.
   * Se muestran igualmente en la ficha, marcados como no disponibles: ocultar
   * una ausencia sería tan opaco como inventar el dato.
   */
  unavailable?: Record<string, string>;
}
