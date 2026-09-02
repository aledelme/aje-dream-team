import type { PriorityCategory } from '~/lib/indicators/types';

export type Household = 'soltero' | 'pareja' | 'familia' | 'jubilado';
export type Setting = 'ciudad' | 'rural';

export interface Profile {
  /** Renta anual bruta del hogar, en euros. */
  income: number;
  household: Household;
  setting: Setting;
  /** Categorías ordenadas de mayor a menor prioridad. */
  priorities: PriorityCategory[];
}

export const HOUSEHOLD_OPTIONS: {
  id: Household;
  label: string;
  hint: string;
  /** Personas equivalentes del hogar, para convertir la renta a renta por persona. */
  equivalence: number;
}[] = [
  { id: 'soltero', label: 'Soltero/a', hint: 'Vivo solo/a', equivalence: 1 },
  { id: 'pareja', label: 'Con pareja', hint: 'Dos personas sin hijos', equivalence: 1.5 },
  { id: 'familia', label: 'Familia con hijos', hint: 'Con menores a cargo', equivalence: 2.1 },
  { id: 'jubilado', label: 'Jubilado/a', hint: 'Ya no trabajo', equivalence: 1.3 },
];

export const SETTING_OPTIONS: { id: Setting; label: string; hint: string }[] = [
  { id: 'ciudad', label: 'Ciudad', hint: 'Servicios a mano y vida urbana' },
  { id: 'rural', label: 'Área rural', hint: 'Menos densidad y más naturaleza' },
];

export const PRIORITY_OPTIONS: {
  id: PriorityCategory;
  label: string;
  hint: string;
}[] = [
  { id: 'seguridad', label: 'Seguridad', hint: 'Criminalidad baja y sin riesgos naturales' },
  { id: 'servicios', label: 'Servicios', hint: 'Hospitales y centros educativos cerca' },
  { id: 'clima', label: 'Clima', hint: 'Pocos episodios extremos de viento e incendios' },
  {
    id: 'calidad-vida',
    label: 'Calidad de vida',
    hint: 'Zonas verdes, salud y nivel de renta del entorno',
  },
];

export const PRIORITY_LABELS: Record<PriorityCategory, string> = {
  seguridad: 'Seguridad',
  servicios: 'Servicios',
  clima: 'Clima',
  'calidad-vida': 'Calidad de vida',
};

export const DEFAULT_PROFILE: Profile = {
  income: 32000,
  household: 'pareja',
  setting: 'ciudad',
  priorities: [],
};

const STORAGE_KEY = 'zonia.profile';

export function saveProfile(profile: Profile): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Modo privado o almacenamiento bloqueado: la demo funciona igual sin persistencia.
  }
}

export function loadProfile(): Profile | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}
