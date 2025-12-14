"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/expenses")
      .then(res => setExpenses(res.data))
      .catch(console.error);
  }, []);

  return (
    <ProtectedRoute>
      <h1>Expenses</h1>
      <ul>
        {expenses.map((e: any) => (
          <li key={e.id}>{e.category}: {e.amount}</li>
        ))}
      </ul>
    </ProtectedRoute>
  );
}
