import { TONE_CLASSES, type Tone } from './tone';

interface Props {
  children: React.ReactNode;
  tone?: Tone;
  size?: 'sm' | 'md';
  title?: string;
}

export default function Badge({ children, tone = 'neutral', size = 'md', title }: Props) {
  const c = TONE_CLASSES[tone];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${pad} ${c.bg} ${c.text} ${c.border}`}
    >
      {children}
    </span>
  );
}
