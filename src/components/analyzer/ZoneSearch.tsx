import { useEffect, useMemo, useRef, useState } from 'react';
import { searchZones } from '~/lib/search/zone-search';
import type { Zone } from '~/lib/indicators/types';

interface Props {
  zones: Zone[];
  selected: Zone | null;
  onSelect: (zone: Zone | null) => void;
  label: string;
  placeholder?: string;
  accent?: 'brand' | 'accent';
}

/**
 * Buscador de dirección con autocompletado sobre el catálogo de zonas: nombre,
 * municipio, provincia, calles y códigos postales de referencia.
 */
export default function ZoneSearch({
  zones,
  selected,
  onSelect,
  label,
  placeholder = 'Escribe una dirección, barrio o municipio…',
  accent = 'brand',
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchZones(zones, query), [zones, query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function choose(zone: Zone) {
    onSelect(zone);
    setQuery('');
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const pick = results[highlight] ?? results[0];
      if (pick) choose(pick.zone);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const ring = accent === 'brand' ? 'focus-within:border-brand' : 'focus-within:border-accent';
  const dot = accent === 'brand' ? 'bg-brand' : 'bg-accent';

  if (selected) {
    return (
      <div>
        <p className="mb-1.5 text-sm font-semibold">{label}</p>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate font-semibold">{selected.name}</span>
              <span className="block truncate text-sm text-ink-soft">
                {selected.municipality}, {selected.province}
              </span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="shrink-0 text-sm font-semibold text-brand-ink underline"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-1.5 block text-sm font-semibold" htmlFor={`search-${label}`}>
        {label}
      </label>
      <div className={`field flex items-center gap-2.5 ${ring}`}>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-soft">
          <path d="M8.5 3a5.5 5.5 0 1 0 3.4 9.8l3.6 3.7 1.4-1.4-3.6-3.6A5.5 5.5 0 0 0 8.5 3Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
        </svg>
        <input
          id={`search-${label}`}
          type="search"
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent outline-none"
          role="combobox"
          aria-expanded={open}
          aria-controls={`results-${label}`}
        />
      </div>

      {open && query.length >= 2 && (
        <ul
          id={`results-${label}`}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-2xl border border-line bg-white py-1 shadow-lg"
        >
          {results.length === 0 && (
            <li className="p-3 text-sm text-ink-soft">
              No hay ninguna zona con ese nombre en la demo. Prueba con «Delicias», «Actur»,
              «Huesca» o un código postal como «50018».
            </li>
          )}
          {results.map((result, i) => (
            <li key={result.zone.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => choose(result.zone)}
                className={`flex w-full flex-col items-start px-3 py-2.5 text-left ${
                  i === highlight ? 'bg-brand-soft' : ''
                }`}
              >
                <span className="font-semibold">{result.zone.name}</span>
                <span className="text-sm text-ink-soft">
                  {result.zone.municipality}, {result.zone.province}
                  {result.matchedOn !== result.zone.name && ` · coincide con «${result.matchedOn}»`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
