import type { Expense } from '../types/expense';

function cell(value: string): string {
  const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function exportExpensesCsv(expenses: Expense[]): string {
  const rows = expenses.map((expense) => [expense.date, expense.category, expense.amount.toFixed(2), expense.description].map(cell).join(','));
  return ['date,category,amount,description', ...rows].join('\r\n') + '\r\n';
}
