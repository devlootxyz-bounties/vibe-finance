import { useState, useMemo } from 'react';
import type { Expense, ExpenseCategory } from '../types/expense';
import { EXPENSE_CATEGORIES } from '../types/expense';
import { listExpenses, deleteExpense } from '../services/expenseService';

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
  refreshKey?: number;
}

interface ExpenseFilters {
  category: ExpenseCategory | '';
  startDate: string;
  endDate: string;
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food',
  transport: 'Transport',
  housing: 'Housing',
  utilities: 'Bills',
  entertainment: 'Entertainment',
  health: 'Health',
  shopping: 'Shopping',
  education: 'Education',
  other: 'Other',
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#f85149',
  transport: '#58a6ff',
  housing: '#bc8cff',
  utilities: '#d29922',
  entertainment: '#f778ba',
  health: '#3fb950',
  shopping: '#d29922',
  education: '#39d2c0',
  other: '#8b949e',
};

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function ExpenseList({ onEdit, refreshKey }: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({ category: '', startDate: '', endDate: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const expenses = useMemo(() => {
    return listExpenses({
      category: filters.category || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    });
  }, [filters, refreshKey]);

  function handleDelete(id: string) {
    deleteExpense(id);
    setDeleteId(null);
  }

  const hasFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <div>
      <h2>Expenses</h2>

      <div className="filters" role="search" aria-label="Filter expenses">
        <div>
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value as ExpenseCategory | '' }))}
          >
            <option value="">All</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-start">From</label>
          <input id="filter-start" type="date" value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="filter-end">To</label>
          <input id="filter-end" type="date" value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))} />
        </div>
        {hasFilters && (
          <button type="button" onClick={() => setFilters({ category: '', startDate: '', endDate: '' })}>
            Clear
          </button>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          {hasFilters ? 'No expenses match your filters.' : 'No expenses yet. Add one to get started.'}
        </div>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-info">
                <span className="category-badge" style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}>
                  {CATEGORY_LABELS[expense.category]}
                </span>
                <div className="expense-meta">
                  <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                  {expense.description && <span className="expense-desc">{expense.description}</span>}
                </div>
              </div>
              <div className="expense-actions">
                <button onClick={() => onEdit(expense)} aria-label={`Edit expense`}>Edit</button>
                {deleteId === expense.id ? (
                  <>
                    <button className="danger" onClick={() => handleDelete(expense.id)}>Confirm</button>
                    <button onClick={() => setDeleteId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="danger" onClick={() => setDeleteId(expense.id)} aria-label={`Delete expense`}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
