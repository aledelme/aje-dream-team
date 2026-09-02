import Badge from '~/components/ui/Badge';
import Chip from '~/components/ui/Chip';
import SourceDetails from './SourceDetails';
import { SERIES, SeriesMarker, type SeriesId } from '~/components/ui/series';
import {
  displayIndex,
  indexFormula,
  isDescriptive,
  isIndex,
  isRisk,
  levelChip,
  percentile,
  relativeDifference,
  resolveRiskLevel,
} from '~/lib/indicators/compute';
import { num, signed } from '~/lib/format';
import type { IndicatorDef, Zone } from '~/lib/indicators/types';

export type CompareMode = 'zonas' | 'nacional';

interface Props {
  indicator: IndicatorDef;
  zones: [Zone, Zone];
  mode: CompareMode;
}

/**
 * Fila de comparación de un indicador entre dos zonas.
 *
 * - modo «nacional»: cada zona se mide contra la media nacional (100).
 * - modo «zonas»: las dos zonas se miden entre sí, tomando la mejor como 100 %.
 *
 * Los indicadores categóricos y descriptivos no cambian de forma con el modo:
 * forzarles un porcentaje sería inventar una precisión que el dato no tiene.
 */
export default function CompareCard({ indicator, zones, mode }: Props) {
  const [a, b] = zones;
  const decimals = indicator.decimals ?? 1;

  return (
    <article className="card p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{indicator.label}</h3>
          <p className="text-xs text-ink-soft">
            {indicator.unit}
            {isIndex(indicator) ? ` · ${indicator.directionLabel}` : ''}
          </p>
        </div>
        {isDescriptive(indicator) && <Chip>Sin dirección buena o mala</Chip>}
      </header>

      <div className="mt-3 space-y-3">
        {zones.map((zone, i) => (
          <Row
            key={zone.id}
            indicator={indicator}
            zone={zone}
            other={i === 0 ? b : a}
            mode={mode}
            decimals={decimals}
            series={i === 0 ? 'a' : 'b'}
          />
        ))}
      </div>

      {isRisk(indicator) && mode === 'zonas' && (
        <p className="mt-3 rounded-md bg-surface p-2 text-xs text-ink-soft">
          Dato categórico: se compara nivel contra nivel, no en porcentaje.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {zones.map((zone) => {
          const chip = levelChip(indicator, zone, zone.values[indicator.id]);
          return chip ? <Chip key={zone.id}>{`${zone.name}: ${chip}`}</Chip> : null;
        })}
      </div>

      <SourceDetails
        indicator={indicator}
        context={`${a.name} y ${b.name}`}
        formula={
          isIndex(indicator)
            ? zones
                .filter((zone) => typeof zone.values[indicator.id]?.value === 'number')
                .map(
                  (zone) =>
                    `${zone.name}: ${indexFormula(indicator, zone.values[indicator.id]!.value as number)}`,
                )
                .join('\n') || null
            : null
        }
      />
    </article>
  );
}

function Row({
  indicator,
  zone,
  other,
  mode,
  decimals,
  series,
}: {
  indicator: IndicatorDef;
  zone: Zone;
  other: Zone;
  mode: CompareMode;
  decimals: number;
  series: SeriesId;
}) {
  const value = zone.values[indicator.id]?.value;
  const otherValue = other.values[indicator.id]?.value;
  const label = (
    <span className="flex items-center gap-2 text-sm">
      <SeriesMarker series={series} />
      {zone.name}
    </span>
  );

  if (value === undefined) {
    return (
      <div className="flex items-center justify-between gap-3">
        {label}
        <Badge tone="neutral" size="sm">
          No disponible
        </Badge>
      </div>
    );
  }

  if (isRisk(indicator)) {
    const level = resolveRiskLevel(indicator, value);
    return (
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label}
        <Badge tone={level.tone} size="sm" title={level.description}>
          {level.label}
        </Badge>
      </div>
    );
  }

  if (typeof value !== 'number') return null;

  // Índices comparables
  if (isIndex(indicator)) {
    const index = displayIndex(indicator, value);

    let width: number;
    let caption: string;
    if (mode === 'nacional') {
      width = Math.min(100, Math.max(2, ((index - 60) / 80) * 100));
      caption = `Índice ${num(Math.round(index))} · media nacional 100`;
    } else {
      const otherIndex =
        typeof otherValue === 'number' ? displayIndex(indicator, otherValue) : index;
      const max = Math.max(index, otherIndex) || 1;
      width = Math.max(2, (index / max) * 100);
      const diff = relativeDifference(index, otherIndex);
      caption =
        Math.abs(diff) < 0.5
          ? `Prácticamente igual que ${other.name}`
          : `${signed(diff, 0, ' %')} que ${other.name}`;
    }

    return (
      <div>
        <div className="flex items-baseline justify-between gap-3">
          {label}
          <span className="tabular-nums text-sm">
            <strong className="text-base">{num(value, decimals)}</strong>
          </span>
        </div>
        {/* La barra va en el color de la zona, no en verde/rojo: aquí el color
            responde a «de quién es este dato», y si el valor es bueno o malo lo
            dice el índice y su posición respecto a la marca del 100. */}
        <div className="relative mt-1 h-2 w-full rounded-full bg-neutral-soft">
          <div
            className={`h-2 rounded-full ${SERIES[series].bg}`}
            style={{ width: `${width}%` }}
          />
          {mode === 'nacional' && (
            <span
              className="absolute inset-y-[-3px] w-0.5 bg-ink/45"
              style={{ left: '50%' }}
              title="Media nacional (100)"
              aria-hidden="true"
            />
          )}
        </div>
        <p className="mt-1 text-xs text-ink-soft">{caption}</p>
      </div>
    );
  }

  // Descriptivo: sin color ni ganador, sólo el dato y su posición nacional.
  const p = isDescriptive(indicator) ? percentile(indicator, value) : undefined;
  const facets = isDescriptive(indicator) ? indicator.facets : undefined;
  const extra = zone.values[indicator.id]?.extra;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        {label}
        <span className="tabular-nums">
          <strong className="text-base">{num(value, decimals)}</strong>
          {p !== undefined && <span className="ml-2 text-xs text-ink-soft">percentil {p}</span>}
        </span>
      </div>
      {facets && extra && (
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-soft">
          {facets.map((facet) => (
            <li key={facet.id}>
              {facet.label}: <strong className="text-ink">{num(extra[facet.id] ?? 0, facet.decimals ?? 1)}</strong>{' '}
              {facet.unit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
