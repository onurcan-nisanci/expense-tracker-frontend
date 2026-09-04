"use client";

import { useEffect, useMemo, useState } from "react";
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

type Category = {
  id: number;
  name: string;
};

// Fallback used only if the categories endpoint can't be reached.
const FALLBACK_CATEGORIES = [
  "Food",
  "Groceries",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
];

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

// Deterministic accent color per category name.
const CATEGORY_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function categoryColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // category filter ("all" = no filter)
  const [filter, setFilter] = useState<string>("all");

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

  // fetch selectable categories
  const loadCategories = async () => {
    try {
      const res = await api.get<Category[]>("/api/categories");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data.map((c) => c.name));
      }
    } catch (err) {
      console.error(err);
      // keep FALLBACK_CATEGORIES
    }
  };

  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, []);

  // categories that actually appear in the current expenses (for filter chips)
  const usedCategories = useMemo(
    () => Array.from(new Set(expenses.map((e) => e.category))).sort(),
    [expenses]
  );

  // reset the filter if the active category no longer exists
  useEffect(() => {
    if (filter !== "all" && !usedCategories.includes(filter)) {
      setFilter("all");
    }
  }, [filter, usedCategories]);

  const visibleExpenses = useMemo(
    () =>
      filter === "all"
        ? expenses
        : expenses.filter((e) => e.category === filter),
    [expenses, filter]
  );

  const summary = useMemo(() => {
    const total = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categories = new Set(visibleExpenses.map((e) => e.category)).size;
    return { total, count: visibleExpenses.length, categories };
  }, [visibleExpenses]);

  // add expense
  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // delete expense
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/expenses/${deleteId}`);
      setDeleteId(null);
      await loadExpenses();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft";

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted">
            Add, review and manage what you spend.
          </p>
        </header>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-primary p-5 text-white shadow-sm">
            <p className="text-sm text-white/80">
              {filter === "all" ? "Total spent" : `Spent on ${filter}`}
            </p>
            <p className="mt-1 text-2xl font-bold">
              {currency.format(summary.total)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Expenses</p>
            <p className="mt-1 text-2xl font-bold">{summary.count}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Categories</p>
            <p className="mt-1 text-2xl font-bold">{summary.categories}</p>
          </div>
        </div>

        {/* Add expense */}
        <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Add an expense</h2>
          <form
            onSubmit={addExpense}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} ${
                category ? "" : "text-muted"
              }`}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="text-foreground">
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={submitting}
              className="col-span-full rounded-lg bg-primary py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Adding…" : "+ Add Expense"}
            </button>
          </form>
        </div>

        {/* Filter by category */}
        {!loading && expenses.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-medium text-muted">Filter:</span>
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border bg-surface text-muted hover:bg-surface-muted"
              }`}
            >
              All
            </button>
            {usedCategories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  filter === c
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-surface text-muted hover:bg-surface-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Expense list */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[68px] animate-pulse rounded-xl border border-border bg-surface-muted"
              />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="text-4xl">🧾</div>
            <p className="mt-3 font-semibold">No expenses yet</p>
            <p className="mt-1 text-sm text-muted">
              Add your first expense using the form above.
            </p>
          </div>
        ) : visibleExpenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-3 font-semibold">No expenses in “{filter}”</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleExpenses.map((e) => (
              <li
                key={e.id}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold truncate">{e.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor(
                        e.category
                      )}`}
                    >
                      {e.category}
                    </span>
                  </div>
                  {e.description && (
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {e.description}
                    </p>
                  )}
                  {e.date && (
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDate(e.date)}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-bold tabular-nums">
                    {currency.format(e.amount)}
                  </span>
                  <button
                    onClick={() => setDeleteId(e.id)}
                    aria-label={`Delete ${e.name}`}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 5v6m4-6v6" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Delete confirmation dialog */}
        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => !deleting && setDeleteId(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl animate-pop-in"
              onClick={(ev) => ev.stopPropagation()}
            >
              <h3 className="text-lg font-semibold">Delete expense?</h3>
              <p className="mt-2 text-sm text-muted">
                This action can’t be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-hover disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
