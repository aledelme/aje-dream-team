import { useEffect, useId, useRef, useState } from 'react';
import { AGGREGATION_LABELS, type IndicatorDef } from '~/lib/indicators/types';

interface Props {
  indicator: IndicatorDef;
  /** Fórmula ya resuelta con los números de la zona, si el indicador la tiene. */
  formula?: string | null;
  /** Notas específicas de la zona (estación usada, dato no disponible...). */
  notes?: (string | null | undefined)[];
  /** Contexto para el título del modal, p. ej. el nombre de la zona. */
  context?: string;
}

/**
 * Transparencia de un indicador: fuente, nivel de agregación real y forma de
 * calcularlo.
 *
 * Se abre en un modal ligero en lugar de desplegarse dentro de la tarjeta: al
 * expandirse empujaba el resto de la rejilla y descolocaba las tarjetas vecinas
 * justo cuando el usuario estaba comparando. Usa <dialog> nativo, que ya trae
 * cierre con Escape, retención del foco y fondo inerte.
 */
export default function SourceDetails({ indicator, formula, notes = [], context }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const visibleNotes = [indicator.levelNote, ...notes].filter(Boolean) as string[];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // El fondo no debe poder desplazarse mientras el modal está abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 text-sm font-medium text-brand-ink hover:underline"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 10.5h-1.5V7h1.5v4.5Zm0-6h-1.5V4h1.5v1.5Z" />
        </svg>
        Fuente y cálculo
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        // Clic en el fondo: el objetivo sólo es el propio <dialog> cuando se
        // pulsa fuera del panel interior.
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="modal"
      >
        <div className="modal-panel">
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-bold">
                {indicator.label}
              </h2>
              <p className="text-sm text-ink-soft">
                {context ? `${context} · ` : ''}
                {indicator.unit}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-ink"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M15.3 5.7 14 4.4 10 8.4 6 4.4 4.7 5.7l4 4-4 4L6 15l4-4 4 4 1.3-1.3-4-4z" />
              </svg>
            </button>
          </header>

          <dl className="space-y-4 overflow-y-auto px-5 py-4 text-sm text-ink-soft">
            <div>
              <dt className="font-semibold text-ink">Qué mide</dt>
              <dd>{indicator.summary}</dd>
            </div>

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
                <dd className="mt-1 whitespace-pre-line rounded-lg bg-surface p-2.5 font-mono text-xs text-ink">
                  {formula}
                </dd>
              </div>
            )}

            {visibleNotes.length > 0 && (
              <div>
                <dt className="font-semibold text-ink">A tener en cuenta</dt>
                <dd>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {visibleNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          <footer className="border-t border-line px-5 py-3 text-right">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-secondary btn-sm">
              Cerrar
            </button>
          </footer>
        </div>
      </dialog>
    </>
  );
}
