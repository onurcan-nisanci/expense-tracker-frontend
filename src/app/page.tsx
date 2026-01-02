"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg text-center p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>

        <p className="text-gray-600 mb-6">
          Track your daily expenses, manage categories, and stay on top of your
          budget with ease.
        </p>

        {isLoggedIn ? (
          <button
            onClick={() => router.push("/expenses")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Expenses
          </button>
        ) : (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="border border-blue-500 text-blue-500 px-6 py-2 rounded hover:bg-blue-50"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
