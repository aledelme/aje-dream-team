import { AGGREGATION_LABELS, type IndicatorDef } from '~/lib/indicators/types';

interface Props {
  indicator: IndicatorDef;
  /** Fórmula ya resuelta con los números de la zona, si el indicador la tiene. */
  formula?: string | null;
  /** Notas específicas de la zona (estación usada, dato no disponible...). */
  notes?: (string | null | undefined)[];
}

/**
 * Panel de transparencia de un indicador: fuente, nivel de agregación real y
 * forma de calcularlo. Usa <details> nativo, así que funciona sin JavaScript.
 */
export default function SourceDetails({ indicator, formula, notes = [] }: Props) {
  const visibleNotes = [indicator.levelNote, ...notes].filter(Boolean) as string[];

  return (
    <details className="group mt-3 border-t border-line pt-2 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 font-medium text-brand-ink hover:underline">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 10.5h-1.5V7h1.5v4.5Zm0-6h-1.5V4h1.5v1.5Z" />
        </svg>
        Fuente y cálculo
      </summary>

      <dl className="mt-2 space-y-2 text-ink-soft">
        <div>
          <dt className="font-semibold text-ink">Fuente</dt>
          <dd>
            {indicator.source.organism} — {indicator.source.dataset} ({indicator.source.period}).{' '}
            <a
              href={indicator.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-ink underline"
            >
              Ver origen
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-ink">Nivel de agregación</dt>
          <dd>{AGGREGATION_LABELS[indicator.aggregation]}</dd>
        </div>

        <div>
          <dt className="font-semibold text-ink">Cómo se calcula</dt>
          <dd>{indicator.method}</dd>
        </div>

        {formula && (
          <div>
            <dt className="font-semibold text-ink">Cálculo aplicado a esta zona</dt>
            <dd className="font-mono text-xs">{formula}</dd>
          </div>
        )}

        {visibleNotes.length > 0 && (
          <div>
            <dt className="font-semibold text-ink">A tener en cuenta</dt>
            <dd>
              <ul className="list-disc space-y-1 pl-4">
                {visibleNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </details>
  );
}
