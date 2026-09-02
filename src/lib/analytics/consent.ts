import { legal } from '~/config/legal';
import { HOUSEHOLD_OPTIONS, PRIORITY_LABELS, SETTING_OPTIONS, type Profile } from '~/lib/affinity/profile';
import { num } from '~/lib/format';

/**
 * Consentimiento del usuario sobre el formulario de preferencias.
 *
 * Se guardan por separado dos decisiones distintas, como exige el RGPD:
 * `terms` es obligatorio para usar el formulario, y `analytics` es un
 * consentimiento libre y específico para el análisis agregado con fines
 * comerciales. Marcar el primero no implica el segundo.
 */
export interface Consent {
  terms: boolean;
  analytics: boolean;
  /** Momento en que se otorgó, en ISO 8601. */
  acceptedAt: string;
  /** Versión de la política aceptada, para poder acreditar qué se aceptó. */
  policyVersion: string;
}

export const EMPTY_CONSENT: Pick<Consent, 'terms' | 'analytics'> = {
  terms: false,
  analytics: false,
};

const STORAGE_KEY = 'zonia.consent';

export function saveConsent(consent: Consent): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Modo privado o almacenamiento bloqueado: la demo funciona igual.
  }
}

export function loadConsent(): Consent | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function buildConsent(terms: boolean, analytics: boolean): Consent {
  return {
    terms,
    analytics,
    acceptedAt: new Date().toISOString(),
    policyVersion: legal.policyVersion,
  };
}

/**
 * Tramos de renta.
 *
 * Al agregar no se envía la cifra exacta que ha escrito la persona sino su
 * tramo: es el mínimo dato necesario para el análisis de mercado y reduce
 * mucho el riesgo de reidentificación.
 */
export const INCOME_BRACKETS: { max: number; label: string }[] = [
  { max: 20000, label: 'Menos de 20.000 €' },
  { max: 30000, label: '20.000 – 30.000 €' },
  { max: 45000, label: '30.000 – 45.000 €' },
  { max: 60000, label: '45.000 – 60.000 €' },
  { max: 90000, label: '60.000 – 90.000 €' },
  { max: Infinity, label: 'Más de 90.000 €' },
];

export function incomeBracket(income: number): string {
  return INCOME_BRACKETS.find((bracket) => income < bracket.max)?.label ?? INCOME_BRACKETS.at(-1)!.label;
}

export interface AggregateField {
  label: string;
  value: string;
  /** Qué se hace con este campo o de dónde saldría. */
  note?: string;
}

/**
 * Registro anónimo que se enviaría si la persona da su consentimiento para el
 * análisis agregado. Se expone en la interfaz tal cual: enseñar exactamente
 * qué se envía es más honesto que describirlo con palabras.
 */
export function buildAggregatePayload(profile: Profile): AggregateField[] {
  const household = HOUSEHOLD_OPTIONS.find((h) => h.id === profile.household)?.label ?? profile.household;
  const setting = SETTING_OPTIONS.find((s) => s.id === profile.setting)?.label ?? profile.setting;

  return [
    {
      label: 'Tramo de renta',
      value: incomeBracket(profile.income),
      note: `No se envía tu cifra exacta (${num(profile.income)} €), sólo el tramo.`,
    },
    { label: 'Situación', value: household },
    { label: 'Entorno preferido', value: setting },
    {
      label: 'Prioridades ordenadas',
      value: profile.priorities.length
        ? profile.priorities.map((p, i) => `${i + 1}. ${PRIORITY_LABELS[p]}`).join(' · ')
        : 'Sin orden indicado',
    },
    {
      label: 'Zona aproximada',
      value: 'Se inferiría en el servidor a partir de tu IP',
      note: 'La IP se usaría sólo en memoria para deducir provincia o municipio y no se almacenaría.',
    },
    {
      label: 'Identificadores personales',
      value: 'Ninguno',
      note: 'No se envía nombre, correo, IP ni identificador de dispositivo.',
    },
  ];
}
