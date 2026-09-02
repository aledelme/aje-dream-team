import Chip from '~/components/ui/Chip';
import { num } from '~/lib/format';
import { ZONE_TYPE_LABELS, type Zone } from '~/lib/indicators/types';

interface Props {
  zone: Zone;
  accent: 'brand' | 'accent';
}

/** Cabecera de una zona: identidad, tamaño y nivel al que se define el ámbito. */
export default function ZoneHeader({ zone, accent }: Props) {
  const bar = accent === 'brand' ? 'bg-brand' : 'bg-accent';

  return (
    <article className="card overflow-hidden">
      <div className={`h-1.5 ${bar}`} />
      <div className="p-4">
        <h2 className="text-xl font-bold">{zone.name}</h2>
        <p className="text-sm text-ink-soft">
          {zone.municipality}, {zone.province} · {zone.region}
        </p>
        <p className="mt-2 text-sm">{zone.blurb}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-ink-soft">Población</dt>
            <dd className="tabular-nums font-semibold">{num(zone.population)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-soft">Superficie</dt>
            <dd className="tabular-nums font-semibold">{num(zone.areaKm2, 1)} km²</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-soft">Entorno</dt>
            <dd className="font-semibold">{ZONE_TYPE_LABELS[zone.type]}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-soft">Ámbito</dt>
            <dd className="font-semibold">
              {zone.level === 'seccion-censal' ? 'Sección censal' : 'Municipio'}
            </dd>
          </div>
        </dl>

        {zone.censusSection && (
          <div className="mt-3">
            <Chip>Sección censal {zone.censusSection}</Chip>
          </div>
        )}
      </div>
    </article>
  );
}
