import Badge from '~/components/ui/Badge';
import Chip from '~/components/ui/Chip';
import IndexBar from './IndexBar';
import SourceDetails from './SourceDetails';
import {
  INDEX_CAP,
  displayIndex,
  indexFormula,
  isCapped,
  isDescriptive,
  isIndex,
  isRisk,
  levelChip,
  percentile,
  resolveRiskLevel,
  toneForIndex,
} from '~/lib/indicators/compute';
import { num } from '~/lib/format';
import type { IndicatorDef, Zone } from '~/lib/indicators/types';

interface Props {
  indicator: IndicatorDef;
  zone: Zone;
}

/**
 * Tarjeta de un indicador para una zona. La forma de presentarlo la decide el
 * propio indicador: índice comparable, badge de riesgo o dato descriptivo.
 * Siempre se muestra el valor absoluto y el acceso a fuente y método.
 */
export default function KpiCard({ indicator, zone }: Props) {
  const value = zone.values[indicator.id];
  const unavailable = zone.unavailable?.[indicator.id];
  const chip = levelChip(indicator, zone, value);
  const decimals = indicator.decimals ?? 1;

  if (!value) {
    return (
      <article className="card p-4">
        <header className="flex items-start justify-between gap-3">
          <h3 className="font-semibold">{indicator.label}</h3>
          <Badge tone="neutral" size="sm">
            No disponible
          </Badge>
        </header>
        <p className="mt-2 text-sm text-ink-soft">
          {unavailable ?? 'La fuente no publica este dato para esta zona.'}
        </p>
        <SourceDetails indicator={indicator} />
      </article>
    );
  }

  return (
    <article className="card p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{indicator.label}</h3>
          {isIndex(indicator) && indicator.originalLabel && (
            <p className="text-xs text-ink-soft">
              Calculado a partir de: {indicator.originalLabel}
            </p>
          )}
        </div>
        {renderHeadline(indicator, value.value)}
      </header>

      {renderBody(indicator, zone, value.value, decimals)}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {chip && <Chip>{chip}</Chip>}
        {isIndex(indicator) && <Chip title={indicator.directionLabel}>{indicator.directionLabel}</Chip>}
        {isDescriptive(indicator) && <Chip>Dato descriptivo, sin dirección buena o mala</Chip>}
      </div>

      <SourceDetails
        indicator={indicator}
        formula={
          isIndex(indicator) && typeof value.value === 'number'
            ? indexFormula(indicator, value.value)
            : null
        }
        notes={[
          value.note && indicator.aggregation !== 'estacion-meteo'
            ? value.note
            : null,
        ]}
      />
    </article>
  );
}

function renderHeadline(indicator: IndicatorDef, raw: number | string) {
  if (isIndex(indicator) && typeof raw === 'number') {
    const index = displayIndex(indicator, raw);
    const capped = isCapped(indicator, raw);
    return (
      <Badge
        tone={toneForIndex(index)}
        title={
          capped
            ? `100 = media nacional. El índice real supera ${INDEX_CAP} y se muestra limitado.`
            : '100 = media nacional'
        }
      >
        {num(Math.round(index))}
        {capped ? '+' : ''}
      </Badge>
    );
  }
  if (isRisk(indicator)) {
    const level = resolveRiskLevel(indicator, raw);
    return (
      <Badge tone={level.tone} title={level.description}>
        {level.label}
      </Badge>
    );
  }
  return null;
}

function renderBody(indicator: IndicatorDef, zone: Zone, raw: number | string, decimals: number) {
  if (isRisk(indicator)) {
    const level = resolveRiskLevel(indicator, raw);
    return <p className="mt-2 text-sm text-ink-soft">{level.description}</p>;
  }

  if (typeof raw !== 'number') return null;
  const extra = zone.values[indicator.id]?.extra;

  if (isIndex(indicator)) {
    const index = displayIndex(indicator, raw);
    return (
      <>
        <p className="mt-2 text-2xl font-bold tabular-nums">
          {num(raw, decimals)}{' '}
          <span className="text-sm font-normal text-ink-soft">{indicator.unit}</span>
        </p>
        <IndexBar index={index} tone={toneForIndex(index)} />
        {extra && <ExtraList extra={extra} indicatorId={indicator.id} />}
      </>
    );
  }

  // Descriptivo
  const p = isDescriptive(indicator) ? percentile(indicator, raw) : undefined;
  return (
    <>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {num(raw, decimals)} <span className="text-sm font-normal text-ink-soft">{indicator.unit}</span>
      </p>
      {p !== undefined && (
        <p className="mt-1 text-sm text-ink-soft">
          Percentil <strong className="text-ink">{p}</strong> de España · media nacional{' '}
          {num(isDescriptive(indicator) ? indicator.nationalAverage : 0, decimals)} {indicator.unit}
        </p>
      )}
      {isDescriptive(indicator) && indicator.facets && extra && (
        <ul className="mt-3 space-y-1 text-sm">
          {indicator.facets.map((facet) => (
            <li key={facet.id} className="flex justify-between gap-3 border-t border-line pt-1">
              <span className="text-ink-soft">{facet.label}</span>
              <span className="tabular-nums">
                <strong>{num(extra[facet.id] ?? 0, facet.decimals ?? 1)}</strong> {facet.unit}
                <span className="text-ink-soft">
                  {' '}
                  (España {num(facet.nationalAverage, facet.decimals ?? 1)})
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const EXTRA_LABELS: Record<string, string> = {
  centrosEn10km: 'Hospitales en 10 km',
  centrosEn2km: 'Centros educativos en 2 km',
};

function ExtraList({ extra, indicatorId }: { extra: Record<string, number>; indicatorId: string }) {
  const entries = Object.entries(extra).filter(([key]) => EXTRA_LABELS[key]);
  if (entries.length === 0) return null;
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {entries.map(([key, val]) => (
        <li key={`${indicatorId}-${key}`} className="flex justify-between gap-3">
          <span className="text-ink-soft">{EXTRA_LABELS[key]}</span>
          <strong className="tabular-nums">{num(val)}</strong>
        </li>
      ))}
    </ul>
  );
}
