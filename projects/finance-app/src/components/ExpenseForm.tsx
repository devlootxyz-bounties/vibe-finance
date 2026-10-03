import { useState, useEffect, type FormEvent } from 'react';
import type { Expense, ExpenseCategory } from '../types/expense';
import { EXPENSE_CATEGORIES } from '../types/expense';
import { createExpense, updateExpense } from '../services/expenseService';

interface ExpenseFormProps {
  expense?: Expense;
  onSaved: (expense: Expense) => void;
  onCancel?: () => void;
}

interface FormErrors {
  amount?: string;
  date?: string;
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

function formatToday(): string {
  return new Date().toISOString().split('T')[0];
}

export default function ExpenseForm({ expense, onSaved, onCancel }: ExpenseFormProps) {
  const isEdit = !!expense;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatToday());
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setCategory(expense.category);
      setDescription(expense.description);
      setDate(expense.date);
    }
  }, [expense]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      next.amount = 'Enter a positive amount';
    }
    if (!date) {
      next.date = 'Date is required';
    }
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const data = {
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date,
    };

    if (isEdit && expense) {
      const updated = updateExpense(expense.id, data);
      if (updated) onSaved(updated);
    } else {
      const created = createExpense(data);
      onSaved(created);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>

      <div>
        <label htmlFor="expense-amount">Amount ($)</label>
        <input
          id="expense-amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <span id="amount-error" role="alert" className="error-msg">{errors.amount}</span>
        )}
      </div>

      <div>
        <label htmlFor="expense-category">Category</label>
        <select
          id="expense-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        >
          {EXPENSE_CATEGORIES.map((cat: ExpenseCategory) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="expense-description">Description</label>
        <textarea
          id="expense-description"
          placeholder="What did you spend on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={formatToday()}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <span id="date-error" role="alert" className="error-msg">{errors.date}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit">
          {isEdit ? 'Save Changes' : 'Add Expense'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
