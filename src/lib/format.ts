const cache = new Map<string, Intl.NumberFormat>();

function formatter(decimals: number): Intl.NumberFormat {
  const key = String(decimals);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    cache.set(key, f);
  }
  return f;
}

/** Número en formato español (coma decimal, punto de millares). */
export function num(value: number, decimals = 0): string {
  return formatter(decimals).format(value);
}

/** Valor absoluto con su unidad, p. ej. «38,4 infracciones penales / 1.000 hab.». */
export function withUnit(value: number, unit: string, decimals = 0): string {
  return `${num(value, decimals)} ${unit}`;
}

export function euros(value: number): string {
  return `${num(Math.round(value))} €`;
}

/** Índice respecto a la media nacional, siempre entero. */
export function indexValue(value: number): string {
  return num(Math.round(value));
}

/** Diferencia con signo, p. ej. «+12 %». */
export function signed(value: number, decimals = 0, suffix = ''): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${num(Math.abs(value), decimals)}${suffix}`;
}

export function percent(value: number, decimals = 0): string {
  return `${num(value, decimals)} %`;
}

/** Ordinal corto en femenino/masculino neutro: 1.ª, 2.ª… usado en las prioridades. */
export function ordinal(position: number): string {
  return `${position}.ª`;
}
