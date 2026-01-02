"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span
          onClick={() => router.push("/")}
          className="text-xl font-bold cursor-pointer"
        >
          Expense Tracker
        </span>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <button onClick={() => router.push("/expenses")}>
                Expenses
              </button>
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")}>
                Login
              </button>
              <button onClick={() => router.push("/register")}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
