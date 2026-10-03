import { listExpenses } from '../services/expenseService';
import { exportExpensesCsv } from '../utils/exportExpensesCsv';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Expense } from '../types/expense';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function downloadCsv() {
    const blob = new Blob([exportExpensesCsv(listExpenses())], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'expenses.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleEdit(expense: Expense) {
    setEditing(expense);
  }

  function handleSaved() {
    setEditing(null);
    setRefreshKey((k) => k + 1);
  }

  function handleCancel() {
    setEditing(null);
  }

  return (
    <div>
      {editing ? (
        <ExpenseForm expense={editing} onSaved={handleSaved} onCancel={handleCancel} />
      ) : (
        <>
          <ExpenseList onEdit={handleEdit} refreshKey={refreshKey} />
          <button type="button" onClick={downloadCsv}>Export all expenses as CSV</button>
          <button className="primary" onClick={() => navigate('/add')} style={{ marginTop: 16 }}>
            + Add Expense
          </button>
        </>
      )}
    </div>
  );
}
