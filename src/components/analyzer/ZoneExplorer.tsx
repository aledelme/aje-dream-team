import { useEffect, useState } from 'react';
import ZoneSearch from './ZoneSearch';
import ZoneHeader from './ZoneHeader';
import CompareToggle from './CompareToggle';
import KpiCard from '~/components/kpi/KpiCard';
import CompareCard, { type CompareMode } from '~/components/kpi/CompareCard';
import ZoneMap from '~/components/map/ZoneMap';
import { INDICATORS, indicatorsByGroup } from '~/data/indicators';
import { GROUPS, type GroupId, type Zone } from '~/lib/indicators/types';
import { site } from '~/config/site';

interface Props {
  zones: Zone[];
}

const GROUP_IDS = Object.keys(GROUPS) as GroupId[];

/**
 * Analizador y comparador de zonas.
 *
 * Mantiene la selección sincronizada con la URL (?zona=&comparar=) para que el
 * ranking del formulario pueda enlazar directamente a una comparación.
 */
export default function ZoneExplorer({ zones }: Props) {
  const [primary, setPrimary] = useState<Zone | null>(null);
  const [secondary, setSecondary] = useState<Zone | null>(null);
  const [comparing, setComparing] = useState(false);
  const [mode, setMode] = useState<CompareMode>('zonas');
  const [ready, setReady] = useState(false);

  // Lectura inicial de la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = zones.find((z) => z.id === params.get('zona')) ?? null;
    const b = zones.find((z) => z.id === params.get('comparar')) ?? null;
    setPrimary(a);
    setSecondary(b);
    if (b) setComparing(true);
    setReady(true);
  }, [zones]);

  // Escritura en la URL (sin recargar) para poder compartir la comparación
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (primary) params.set('zona', primary.id);
    if (secondary) params.set('comparar', secondary.id);
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  }, [primary, secondary, ready]);

  function selectFromMap(zoneId: string) {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    if (!primary || (!comparing && primary.id !== zone.id)) setPrimary(zone);
    else if (comparing && primary.id !== zone.id) setSecondary(zone);
  }

  const bothSelected = Boolean(primary && secondary);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="order-2 lg:order-1">
        {/* Selección de zonas */}
        <div className="card p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ZoneSearch
              zones={zones}
              selected={primary}
              onSelect={(zone) => setPrimary(zone)}
              label="Zona a analizar"
            />
            {comparing ? (
              <ZoneSearch
                zones={zones.filter((z) => z.id !== primary?.id)}
                selected={secondary}
                onSelect={(zone) => setSecondary(zone)}
                label="Comparar con"
                accent="accent"
                placeholder="Segunda zona…"
              />
            ) : (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setComparing(true)}
                  disabled={!primary}
                  className="btn btn-ghost w-full"
                >
                  + Añadir zona a comparar
                </button>
              </div>
            )}
          </div>

          {comparing && (
            <button
              type="button"
              onClick={() => {
                setComparing(false);
                setSecondary(null);
              }}
              className="mt-3 text-sm text-brand-ink underline"
            >
              Quitar la comparación
            </button>
          )}
        </div>

        {!primary && (
          <div className="card mt-6 p-6">
            <h2 className="text-lg font-bold">Empieza escribiendo una dirección</h2>
            <p className="mt-2 text-ink-soft">
              En esta demo tenemos {zones.length} zonas cargadas. Puedes buscar por barrio, municipio,
              calle o código postal, o elegir una de estas:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setPrimary(zone)}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium hover:border-brand hover:text-brand-ink"
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {primary && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ZoneHeader zone={primary} accent="brand" />
              {secondary && <ZoneHeader zone={secondary} accent="accent" />}
            </div>

            {bothSelected && (
              <div className="mt-6">
                <CompareToggle mode={mode} onChange={setMode} zones={[primary!, secondary!]} />
              </div>
            )}

            {GROUP_IDS.map((groupId) => {
              const indicators = indicatorsByGroup(groupId);
              if (indicators.length === 0) return null;
              return (
                <section key={groupId} className="mt-8">
                  <h2 className="text-xl font-bold">{GROUPS[groupId].label}</h2>
                  <p className="text-sm text-ink-soft">{GROUPS[groupId].description}</p>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {indicators.map((indicator) =>
                      bothSelected ? (
                        <CompareCard
                          key={indicator.id}
                          indicator={indicator}
                          zones={[primary!, secondary!]}
                          mode={mode}
                        />
                      ) : (
                        <KpiCard key={indicator.id} indicator={indicator} zone={primary!} />
                      ),
                    )}
                  </div>
                </section>
              );
            })}

            <p className="mt-8 rounded-xl border border-accent/25 bg-accent-soft p-4 text-sm text-accent-dark">
              {site.demoNotice} Se muestran {INDICATORS.length} indicadores por zona.
            </p>
          </>
        )}
      </div>

      {/* Mapa: arriba en móvil, columna fija en escritorio */}
      <div className="order-1 lg:sticky lg:top-24 lg:order-2">
        <ZoneMap
          zones={zones}
          selected={[primary?.id ?? null, secondary?.id ?? null]}
          onSelect={selectFromMap}
          height={340}
        />
        <p className="mt-2 text-xs text-ink-soft">
          Pulsa un punto del mapa para seleccionarlo. Azul: zona analizada. Rojo: zona comparada.
        </p>
      </div>
    </div>
  );
}
