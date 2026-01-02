"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

type Expense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // fetch expenses
  const loadExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // add expense
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/api/expenses", {
      name,
      amount: Number(amount),
      category,
      description,
    });

    setName("");
    setAmount("");
    setCategory("");
    setDescription("");

    await loadExpenses();
  };

  // delete expense
  const confirmDelete = async () => {
    if (!deleteId) return;

    await api.delete(`/api/expenses/${deleteId}`);
    setDeleteId(null);
    await loadExpenses();
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Expenses</h1>

        {/* Add expense */}
        <form
          onSubmit={addExpense}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>

        {/* Expense list */}
        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-semibold">
                    {e.name} — {e.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    {e.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold">
                    £{e.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setDeleteId(e.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Delete confirmation dialog */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <p className="mb-4">
                Are you sure you want to delete this expense?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
