import { BLOCKS, type ZoneAffinity } from '~/lib/affinity/score';
import { PRIORITY_LABELS, type Profile } from '~/lib/affinity/profile';
import { buildAggregatePayload } from '~/lib/analytics/consent';
import { legal } from '~/config/legal';
import { ZONE_TYPE_LABELS } from '~/lib/indicators/types';
import { num } from '~/lib/format';

interface Props {
  results: ZoneAffinity[];
  profile: Profile;
  /** Si la persona ha consentido el análisis agregado con fines comerciales. */
  analyticsConsent: boolean;
  onEdit: () => void;
}

function scoreTone(score: number): string {
  if (score >= 75) return 'bg-good';
  if (score >= 55) return 'bg-brand';
  if (score >= 40) return 'bg-mid';
  return 'bg-neutral';
}

/** Ranking de zonas por afinidad, con el desglose de por qué encaja cada una. */
export default function ResultsList({ results, profile, analyticsConsent, onEdit }: Props) {
  if (results.length === 0) return null;

  const priorities = profile.priorities.length
    ? profile.priorities.map((p) => PRIORITY_LABELS[p]).join(' › ')
    : 'sin orden de prioridad';

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Zonas más afines a tu perfil</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {num(profile.income)} € al año · {profile.household} · {profile.setting} · {priorities}
          </p>
        </div>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-brand-ink underline">
          Cambiar respuestas
        </button>
      </div>

      <ol className="mt-5 space-y-3">
        {results.map((result, i) => (
          <li key={result.zone.id}>
            <article className="card overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface font-bold">
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold">
                    {result.zone.name}
                    {result.zone.name !== result.zone.municipality && (
                      <span className="font-normal text-ink-soft"> · {result.zone.municipality}</span>
                    )}
                  </h3>
                  <p className="text-sm text-ink-soft">
                    {ZONE_TYPE_LABELS[result.zone.type]} · {num(result.zone.population)} habitantes
                    {result.zone.censusSection ? ` · Sección ${result.zone.censusSection}` : ''}
                  </p>
                </div>

                <div className="w-full sm:w-56">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-soft">Afinidad</span>
                    <span className="text-2xl font-black tabular-nums">{result.score} %</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-neutral-soft">
                    <div
                      className={`h-2.5 rounded-full ${scoreTone(result.score)}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-line bg-surface/60 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-good">
                    Por qué encaja
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {result.positives.length > 0 ? (
                      result.positives.map((c) => (
                        <li key={c.id}>
                          <strong>{c.label}</strong>: {c.detail}{' '}
                          <span className="text-ink-soft">
                            (+{num(c.points, 1)} pts de {num(c.max, 1)})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-ink-soft">Ningún factor destaca claramente al alza.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-bad">
                    Qué le resta
                  </p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {result.negatives.length > 0 ? (
                      result.negatives.map((c) => (
                        <li key={c.id}>
                          <strong>{c.label}</strong>: {c.detail}{' '}
                          <span className="text-ink-soft">
                            ({c.points < 0 ? '' : '+'}
                            {num(c.points, 1)} pts
                            {c.max > 0 ? ` de ${num(c.max, 1)}` : ''})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-ink-soft">Sin puntos débiles relevantes.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-line p-4 text-sm font-semibold">
                <a href={`/analizar?zona=${result.zone.id}`} className="text-brand-ink underline">
                  Ver todos los datos de {result.zone.name}
                </a>
                {results[i + 1] && (
                  <a
                    href={`/analizar?zona=${result.zone.id}&comparar=${results[i + 1]!.zone.id}`}
                    className="text-brand-ink underline"
                  >
                    Comparar con {results[i + 1]!.zone.name}
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>

      {analyticsConsent && <AggregatePreview profile={profile} />}

      <details className="card mt-6 p-4 text-sm">
        <summary className="cursor-pointer font-semibold text-brand-ink">
          Cómo se calcula el porcentaje de afinidad
        </summary>
        <div className="mt-3 space-y-2 text-ink-soft">
          <p>
            Cada zona parte de 100 puntos repartidos en tres bloques y pierde puntos por los riesgos
            declarados:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>{BLOCKS.priorities} puntos</strong> por los indicadores comparables, ponderados
              según el orden en el que has colocado tus prioridades (1.ª ×1, 2.ª ×0,75, 3.ª ×0,5,
              4.ª ×0,3) y ajustados a tu situación vital: una familia valora más los colegios y una
              persona jubilada, el hospital.
            </li>
            <li>
              <strong>{BLOCKS.income} puntos</strong> por el encaje entre tu renta y la renta media
              de la zona. Ni muy por encima ni muy por debajo: buscamos que encaje.
            </li>
            <li>
              <strong>{BLOCKS.setting} puntos</strong> por el encaje con el entorno que buscas,
              medido como cercanía al percentil de densidad de población típico de ciudad o de área
              rural.
            </li>
            <li>
              <strong>Penalizaciones</strong> por zona inundable, riesgo sísmico alto o frecuencia
              alta de incendios, escaladas según la importancia que hayas dado a esa categoría.
            </li>
          </ul>
          <p>
            Cuando una fuente no publica un dato para una zona (por ejemplo, la criminalidad en
            municipios de menos de 20.000 habitantes), ese indicador puntúa como la media nacional:
            ni premia ni penaliza.
          </p>
        </div>
      </details>
    </section>
  );
}

/**
 * Muestra literalmente el registro que se enviaría con el consentimiento de
 * análisis agregado. Describir el dato con palabras es fácil; enseñarlo tal
 * cual es lo que hace verificable la promesa de que no se envía nada personal.
 */
function AggregatePreview({ profile }: { profile: Profile }) {
  const fields = buildAggregatePayload(profile);

  return (
    <details className="card mt-6 p-4 text-sm">
      <summary className="cursor-pointer font-semibold text-brand-ink">
        Qué se enviaría con tu consentimiento
      </summary>

      <p className="mt-3 text-ink-soft">
        Has aceptado que tus respuestas se usen de forma agregada. Esto es exactamente el registro
        que se enviaría cuando el servicio esté operativo; en esta demo no se envía nada.
      </p>

      <dl className="mt-3 divide-y divide-line">
        {fields.map((field) => (
          <div key={field.label} className="grid gap-1 py-2 sm:grid-cols-[12rem_1fr] sm:gap-4">
            <dt className="font-semibold">{field.label}</dt>
            <dd>
              {field.value}
              {field.note && <span className="mt-0.5 block text-xs text-ink-soft">{field.note}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-ink-soft">
        Ninguna estadística se publicaría hasta reunir al menos {legal.aggregationThreshold}{' '}
        respuestas de la misma zona, para que un dato agregado no permita deducir la respuesta de una
        persona concreta. Puedes retirar este consentimiento en cualquier momento desde la{' '}
        <a href="/privacidad" className="text-brand-ink underline">
          política de privacidad
        </a>
        .
      </p>
    </details>
  );
}
