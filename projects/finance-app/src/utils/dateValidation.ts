export function dateError(value: string): string | undefined {
  if (!value) return 'Date is required';
  return undefined;
}
