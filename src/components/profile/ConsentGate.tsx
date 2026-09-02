import { legal } from '~/config/legal';

interface Props {
  terms: boolean;
  analytics: boolean;
  onChange: (next: { terms: boolean; analytics: boolean }) => void;
}

/**
 * Consentimiento previo al envío del formulario.
 *
 * Dos decisiones separadas a propósito: aceptar los términos es obligatorio
 * para usar la herramienta, y ceder las respuestas para el análisis agregado
 * con fines comerciales es libre. Empaquetarlas en un único check haría que el
 * segundo consentimiento no fuese válido.
 */
export default function ConsentGate({ terms, analytics, onChange }: Props) {
  return (
    <div className="mt-7 rounded-xl border border-line bg-surface p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => onChange({ terms: e.target.checked, analytics })}
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
          aria-describedby="consent-terms-hint"
        />
        <span className="text-sm">
          <strong>
            He leído y acepto los términos de uso y la política de privacidad.
            <span className="text-accent" aria-hidden="true">
              {' '}
              *
            </span>
          </strong>
          <span id="consent-terms-hint" className="mt-0.5 block text-ink-soft">
            Puedes{' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-ink underline"
            >
              leer la política completa
            </a>{' '}
            en otra pestaña sin perder tus respuestas.
          </span>
        </span>
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-line pt-4">
        <input
          type="checkbox"
          checked={analytics}
          onChange={(e) => onChange({ terms, analytics: e.target.checked })}
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
          aria-describedby="consent-analytics-hint"
        />
        <span className="text-sm">
          <strong>
            Acepto que mis respuestas y la zona aproximada de mi conexión se usen, de forma agregada
            y anónima, para elaborar y comercializar estadísticas de mercado.
          </strong>
          <span id="consent-analytics-hint" className="mt-0.5 block text-ink-soft">
            Opcional: la herramienta funciona exactamente igual si no lo marcas. No se guarda tu IP,
            sólo se usaría para deducir la provincia. Ninguna estadística se publica hasta reunir al
            menos {legal.aggregationThreshold} respuestas de esa zona.
          </span>
        </span>
      </label>

      <p className="mt-4 text-xs text-ink-soft">
        <span className="text-accent" aria-hidden="true">
          *
        </span>{' '}
        Obligatorio para continuar. En esta demo nada de esto se envía: el cálculo ocurre entero en
        tu navegador.
      </p>
    </div>
  );
}
