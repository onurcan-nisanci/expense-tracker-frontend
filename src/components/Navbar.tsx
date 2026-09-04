"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const navBtn =
    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-base shadow-sm">
            £
          </span>
          <span className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
            Expense Tracker
          </span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => router.push("/expenses")}
                className={`${navBtn} ${
                  pathname === "/expenses"
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={logout}
                className={`${navBtn} text-danger hover:bg-danger-soft`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className={`${navBtn} text-muted hover:bg-surface-muted hover:text-foreground`}
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className={`${navBtn} bg-primary text-white hover:bg-primary-hover shadow-sm`}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
