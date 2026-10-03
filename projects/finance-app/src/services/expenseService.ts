import type {
  Expense,
  ExpenseCategory,
  ExpenseFilter,
  CategoryTotal,
} from '../types/expense';

const STORAGE_KEY = 'finance-app-expenses';

function generateId(): string {
  return crypto.randomUUID();
}

function readAll(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

function writeAll(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// ─── CRUD ────────────────────────────────────────────────────────

export function createExpense(
  input: Omit<Expense, 'id' | 'createdAt'>
): Expense {
  const expense: Expense = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(expense);
  writeAll(all);
  return expense;
}

export function getExpense(id: string): Expense | undefined {
  return readAll().find((e) => e.id === id);
}

export function listExpenses(filter?: ExpenseFilter): Expense[] {
  let result = readAll();

  if (filter?.category) {
    result = result.filter((e) => e.category === filter.category);
  }

  if (filter?.startDate) {
    result = result.filter((e) => e.date >= filter.startDate!);
  }

  if (filter?.endDate) {
    result = result.filter((e) => e.date <= filter.endDate!);
  }

  // Default sort: newest first
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
): Expense | undefined {
  const all = readAll();
  const index = all.findIndex((e) => e.id === id);
  if (index === -1) return undefined;

  const updated = { ...all[index], ...updates };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function deleteExpense(id: string): boolean {
  const all = readAll();
  const index = all.findIndex((e) => e.id === id);
  if (index === -1) return false;

  all.splice(index, 1);
  writeAll(all);
  return true;
}

// ─── Aggregation helpers ─────────────────────────────────────────

export function getExpensesByDateRange(
  startDate: string,
  endDate: string
): Expense[] {
  return listExpenses({ startDate, endDate });
}

export function getCategoryTotals(
  filter?: ExpenseFilter
): CategoryTotal[] {
  const expenses = listExpenses(filter);
  const map = new Map<ExpenseCategory, CategoryTotal>();

  for (const expense of expenses) {
    const existing = map.get(expense.category);
    if (existing) {
      existing.total = (Math.round(existing.total * 100) + Math.round(expense.amount * 100)) / 100;
      existing.count += 1;
    } else {
      map.set(expense.category, {
        category: expense.category,
        total: Math.round(expense.amount * 100) / 100,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function getTotalSpending(filter?: ExpenseFilter): number {
  return listExpenses(filter).reduce((sum, e) => sum + Math.round(e.amount * 100), 0) / 100;
}
