import type { CompareMode } from '~/components/kpi/CompareCard';
import { SERIES, SeriesMarker, type SeriesId } from '~/components/ui/series';
import type { Zone } from '~/lib/indicators/types';

interface Props {
  mode: CompareMode;
  onChange: (mode: CompareMode) => void;
  zones: [Zone, Zone];
}

/** Alterna entre comparar las dos zonas entre sí o cada una con la media nacional. */
export default function CompareToggle({ mode, onChange, zones }: Props) {
  const options: { id: CompareMode; label: string; hint: string }[] = [
    {
      id: 'zonas',
      label: 'Entre las dos zonas',
      hint: `${zones[0].name} frente a ${zones[1].name}`,
    },
    {
      id: 'nacional',
      label: 'Con la media nacional',
      hint: 'Cada zona medida contra el 100 de España',
    },
  ];

  return (
    <div className="card p-3">
      {/* Leyenda: deja explícito qué color y qué forma es cada zona, para que en
          las tarjetas de abajo el color signifique sólo «de quién es el dato». */}
      <div className="flex flex-wrap items-center gap-2 px-1 pb-3">
        {(['a', 'b'] as SeriesId[]).map((id, i) => (
          <span
            key={id}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${SERIES[id].soft} ${SERIES[id].text}`}
          >
            <SeriesMarker series={id} />
            {zones[i]!.name}
          </span>
        ))}
      </div>

      <p className="px-1 pb-2 text-sm font-semibold">Modo de comparación</p>
      <div role="tablist" aria-label="Modo de comparación" className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = mode === option.id;
          return (
            <button
              key={option.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(option.id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                active ? 'border-brand bg-brand text-white' : 'border-line bg-white hover:bg-surface'
              }`}
            >
              <span className="block font-semibold">{option.label}</span>
              <span className={`block text-xs ${active ? 'text-white/85' : 'text-ink-soft'}`}>
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
