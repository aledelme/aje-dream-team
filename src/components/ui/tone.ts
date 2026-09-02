export type Tone = 'good' | 'mid' | 'bad' | 'neutral' | 'brand';

/**
 * Clases por tono semántico. Centralizadas para que verde/ámbar/rojo signifiquen
 * lo mismo en toda la aplicación (índices, badges de riesgo y barras).
 */
export const TONE_CLASSES: Record<Tone, { text: string; bg: string; border: string; bar: string }> = {
  good: { text: 'text-good', bg: 'bg-good-soft', border: 'border-good/30', bar: 'bg-good' },
  mid: { text: 'text-mid', bg: 'bg-mid-soft', border: 'border-mid/30', bar: 'bg-mid' },
  bad: { text: 'text-bad', bg: 'bg-bad-soft', border: 'border-bad/30', bar: 'bg-bad' },
  neutral: {
    text: 'text-neutral',
    bg: 'bg-neutral-soft',
    border: 'border-line',
    bar: 'bg-neutral',
  },
  brand: {
    text: 'text-brand-ink',
    bg: 'bg-brand-soft',
    border: 'border-brand/30',
    bar: 'bg-brand',
  },
};
