"use client";

import { useState } from "react";
import api from "@/lib/api"; // Axios instance pointing to your backend
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { username, password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.title || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft";

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm animate-fade-in"
      >
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-white shadow-sm">
            £
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted">
            Start tracking your expenses today.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-lg px-3 py-2 text-sm text-success" style={{ background: "#e7f6f0" }}>
            Account created! Redirecting to sign in…
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
