/**
 * Formats a number into Pakistani Rupee (PKR) currency format.
 * Example: 24900 -> "PKR 24,900"
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount)) return 'PKR 0';
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `PKR ${formatted}`;
}

export function formatPKRCompact(amount: number): string {
  if (isNaN(amount)) return 'PKR 0';
  return `PKR ${amount.toLocaleString('en-PK')}`;
}
