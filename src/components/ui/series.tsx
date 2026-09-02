/**
 * Series de comparación.
 *
 * Cuando se comparan dos zonas, el color tiene que responder a una única
 * pregunta: «¿de qué zona es este dato?». El juicio de si el valor es bueno o
 * malo lo llevan el índice, la barra respecto a la media y los badges de
 * riesgo, que ya tienen su propia escala verde/ámbar/rojo. Mezclar ambos
 * lenguajes en la misma fila es lo que hacía ilegible el comparador.
 *
 * Por eso estos dos tonos no se usan en ningún otro punto de la interfaz, y
 * cada serie lleva además una forma propia: el color nunca es el único indicio.
 */

export type SeriesId = 'a' | 'b';

export interface SeriesStyle {
  /** Nombre corto de la serie, para leyendas y textos de apoyo. */
  label: string;
  text: string;
  bg: string;
  soft: string;
  border: string;
  ring: string;
  shape: 'circle' | 'diamond';
}

export const SERIES: Record<SeriesId, SeriesStyle> = {
  a: {
    label: 'Zona A',
    text: 'text-series-a',
    bg: 'bg-series-a',
    soft: 'bg-series-a-soft',
    border: 'border-series-a',
    ring: 'focus-within:border-series-a',
    shape: 'circle',
  },
  b: {
    label: 'Zona B',
    text: 'text-series-b',
    bg: 'bg-series-b',
    soft: 'bg-series-b-soft',
    border: 'border-series-b',
    ring: 'focus-within:border-series-b',
    shape: 'diamond',
  },
};

/** Valores en crudo para Leaflet, que no entiende clases de Tailwind.
 *  Deben coincidir con --color-series-* de `src/styles/global.css`. */
export const SERIES_HEX: Record<SeriesId, string> = {
  a: '#1d4ed8',
  b: '#7e22ce',
};

interface MarkerProps {
  series: SeriesId;
  className?: string;
}

/**
 * Distintivo de serie: círculo para la zona A, rombo para la zona B.
 * La forma hace que las dos series sigan siendo distinguibles sin depender del
 * color, que es lo que falla en daltonismo rojo-verde y en impresión en gris.
 */
export function SeriesMarker({ series, className = '' }: MarkerProps) {
  const style = SERIES[series];
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-3 w-3 shrink-0 ${style.text} ${className}`}
    >
      {style.shape === 'circle' ? (
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      ) : (
        <path d="M6 0.6 11.4 6 6 11.4 0.6 6Z" fill="currentColor" />
      )}
    </svg>
  );
}
