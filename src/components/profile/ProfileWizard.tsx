import { useMemo, useState } from 'react';
import type { PriorityCategory, Zone } from '~/lib/indicators/types';
import {
  DEFAULT_PROFILE,
  HOUSEHOLD_OPTIONS,
  PRIORITY_OPTIONS,
  SETTING_OPTIONS,
  saveProfile,
  type Household,
  type Profile,
  type Setting,
} from '~/lib/affinity/profile';
import { rankZones } from '~/lib/affinity/score';
import { num } from '~/lib/format';
import ResultsList from './ResultsList';

interface Props {
  zones: Zone[];
}

const STEPS = ['Renta', 'Situación', 'Entorno', 'Prioridades'] as const;

/**
 * Formulario de perfil en cuatro pasos. Al terminar calcula el ranking de
 * afinidad en el navegador (los datos ya vienen en el bundle) y lo muestra
 * debajo, sin recargar la página.
 */
export default function ProfileWizard({ zones }: Props) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(
    () => (submitted ? rankZones(zones, profile) : []),
    [submitted, profile, zones],
  );

  const canContinue = step < 3 || profile.priorities.length > 0;

  function togglePriority(id: PriorityCategory) {
    setProfile((p) => ({
      ...p,
      priorities: p.priorities.includes(id)
        ? p.priorities.filter((x) => x !== id)
        : [...p.priorities, id],
    }));
  }

  function submit() {
    saveProfile(profile);
    setSubmitted(true);
    requestAnimationFrame(() => {
      document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <>
      <div className="card p-5 md:p-7">
        {/* Progreso */}
        <ol className="mb-6 flex gap-2" aria-label="Progreso del formulario">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${i <= step ? 'bg-brand' : 'bg-neutral-soft'}`}
                aria-hidden="true"
              />
              <span
                className={`mt-1.5 block text-xs ${i === step ? 'font-semibold text-brand' : 'text-ink-soft'}`}
              >
                {i + 1}. {label}
              </span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset>
            <legend className="text-xl font-bold">¿Cuál es tu renta anual?</legend>
            <p className="mt-1 text-sm text-ink-soft">
              Ingresos brutos anuales de tu hogar. La usamos para buscar zonas cuyo nivel de renta
              encaje con el tuyo, no para descartarte de ninguna.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <input
                id="renta"
                type="number"
                min={6000}
                max={200000}
                step={1000}
                value={profile.income}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, income: Number(e.target.value) || 0 }))
                }
                className="w-44 rounded-lg border border-line px-3 py-2 text-lg font-semibold tabular-nums"
                aria-label="Renta anual bruta del hogar en euros"
              />
              <span className="text-lg font-semibold">€ / año</span>
            </div>

            <input
              type="range"
              min={10000}
              max={120000}
              step={1000}
              value={Math.min(120000, Math.max(10000, profile.income))}
              onChange={(e) => setProfile((p) => ({ ...p, income: Number(e.target.value) }))}
              className="mt-5 w-full accent-brand"
              aria-label="Ajustar renta anual"
            />
            <div className="flex justify-between text-xs text-ink-soft">
              <span>{num(10000)} €</span>
              <span>{num(120000)} €</span>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-xl font-bold">¿Cuál es tu situación?</legend>
            <p className="mt-1 text-sm text-ink-soft">Selecciona una opción.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {HOUSEHOLD_OPTIONS.map((option) => (
                <OptionButton
                  key={option.id}
                  selected={profile.household === option.id}
                  label={option.label}
                  hint={option.hint}
                  onClick={() => setProfile((p) => ({ ...p, household: option.id as Household }))}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-xl font-bold">¿Ciudad o área rural?</legend>
            <p className="mt-1 text-sm text-ink-soft">
              Lo usamos para buscar la densidad de población que encaja contigo.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SETTING_OPTIONS.map((option) => (
                <OptionButton
                  key={option.id}
                  selected={profile.setting === option.id}
                  label={option.label}
                  hint={option.hint}
                  onClick={() => setProfile((p) => ({ ...p, setting: option.id as Setting }))}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-xl font-bold">Ordena lo que más te importa</legend>
            <p className="mt-1 text-sm text-ink-soft">
              Pulsa en el orden que prefieras: la primera que elijas será la más importante. Puedes
              elegir sólo las que te interesen.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PRIORITY_OPTIONS.map((option) => {
                const position = profile.priorities.indexOf(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => togglePriority(option.id)}
                    aria-pressed={position >= 0}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                      position >= 0
                        ? 'border-brand bg-brand-soft'
                        : 'border-line bg-white hover:bg-surface'
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        position >= 0 ? 'bg-brand text-white' : 'bg-neutral-soft text-ink-soft'
                      }`}
                    >
                      {position >= 0 ? position + 1 : '·'}
                    </span>
                    <span>
                      <span className="block font-semibold">{option.label}</span>
                      <span className="block text-sm text-ink-soft">{option.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {profile.priorities.length > 0 && (
              <button
                type="button"
                onClick={() => setProfile((p) => ({ ...p, priorities: [] }))}
                className="mt-3 text-sm text-brand underline"
              >
                Empezar el orden de nuevo
              </button>
            )}
          </fieldset>
        )}

        {/* Navegación */}
        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg border border-line px-4 py-2.5 font-semibold disabled:opacity-40"
          >
            Atrás
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canContinue}
              className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-dark disabled:opacity-40"
            >
              Ver zonas afines
            </button>
          )}
        </div>
      </div>

      <div id="resultados" className="scroll-mt-24">
        {submitted && <ResultsList results={results} profile={profile} onEdit={() => setStep(0)} />}
      </div>
    </>
  );
}

function OptionButton({
  selected,
  label,
  hint,
  onClick,
}: {
  selected: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border p-4 text-left transition-colors ${
        selected ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:bg-surface'
      }`}
    >
      <span className="block font-semibold">{label}</span>
      <span className="block text-sm text-ink-soft">{hint}</span>
    </button>
  );
}
