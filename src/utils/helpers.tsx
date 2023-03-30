/**
 * Random helper functions
 */

export function numberFormatter(num: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 4,
  }).format(num);
}
