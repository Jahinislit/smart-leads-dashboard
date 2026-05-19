import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

export const AuthPage = ({ mode }: { mode: "login" | "register" }) => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" as Role });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-50">GigFlow</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage leads with role-aware access and fast filtering.</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
              <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required minLength={2} />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" required />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" required minLength={8} />
          </label>
          {mode === "register" && (
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Role
              <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}
          <button disabled={loading} className="w-full rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === "login" ? "Need an account? " : "Already registered? "}
          <Link className="font-semibold text-brand-600 dark:text-brand-50" to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </section>
    </main>
  );
};
