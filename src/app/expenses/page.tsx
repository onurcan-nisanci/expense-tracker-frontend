"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && expenses.length === 0 && (
          <p>No expenses found.</p>
        )}

        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="border p-3 rounded flex justify-between"
            >
              <span>
                <strong>{expense.name}</strong> — {expense.category}
              </span>
              <span>${expense.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
