interface Props {
  children: React.ReactNode;
  title?: string;
}

/**
 * Etiqueta discreta para advertir del nivel real del dato
 * («Dato municipal», «Estación meteorológica más cercana»...).
 */
export default function Chip({ children, title }: Props) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-xs text-ink-soft ring-1 ring-line"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3 shrink-0 fill-current">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 10.5h-1.5V7h1.5v4.5Zm0-6h-1.5V4h1.5v1.5Z" />
      </svg>
      {children}
    </span>
  );
}
