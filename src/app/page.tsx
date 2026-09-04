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

  const features = [
    { icon: "📊", title: "Track spending", text: "Log expenses in seconds." },
    { icon: "🏷️", title: "Organize", text: "Group by category." },
    { icon: "🎯", title: "Stay on budget", text: "See totals at a glance." },
  ];

  return (
    <main className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
          Personal finance, simplified
        </span>

        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
          Take control of your{" "}
          <span className="text-primary">expenses</span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-muted text-lg">
          Track your daily expenses, manage categories, and stay on top of your
          budget with ease.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/expenses")}
              className="rounded-xl bg-primary px-7 py-3 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              Go to Expenses →
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="rounded-xl bg-primary px-7 py-3 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-xl border border-border bg-surface px-7 py-3 font-medium transition-colors hover:bg-surface-muted"
              >
                Create account
              </button>
            </>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-5 text-left shadow-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
