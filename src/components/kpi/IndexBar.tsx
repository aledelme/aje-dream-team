import { TONE_CLASSES, type Tone } from '~/components/ui/tone';

interface Props {
  index: number;
  tone: Tone;
  /** Escala visible: por defecto de 60 a 140, con la media nacional al centro. */
  min?: number;
  max?: number;
  label?: string;
}

/** Barra de un índice sobre la media nacional, con la referencia 100 marcada. */
export default function IndexBar({ index, tone, min = 60, max = 140, label }: Props) {
  const position = Math.min(100, Math.max(0, ((index - min) / (max - min)) * 100));
  const reference = ((100 - min) / (max - min)) * 100;

  return (
    <div className="mt-2">
      <div
        className="relative h-2.5 w-full rounded-full bg-neutral-soft"
        role="img"
        aria-label={label ?? `Índice ${Math.round(index)} sobre una media nacional de 100`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${TONE_CLASSES[tone].bar}`}
          style={{ width: `${position}%` }}
        />
        <div
          className="absolute inset-y-[-3px] w-0.5 bg-ink/50"
          style={{ left: `${reference}%` }}
          title="Media nacional (100)"
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-ink-soft">
        <span>{min}</span>
        <span>Media nacional 100</span>
        <span>{max}+</span>
      </div>
    </div>
  );
}
