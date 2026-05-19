import { LogOut, Moon, Sun } from "lucide-react";
import type { User } from "../types";

interface DashboardHeaderProps {
  user: User | null;
  dark: boolean;
  onToggleTheme(): void;
  onLogout(): void;
}

export const DashboardHeader = ({ user, dark, onToggleTheme, onLogout }: DashboardHeaderProps) => (
  <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-50">Smart Leads Dashboard</p>
        <h1 className="text-2xl font-bold">Lead Management</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {user?.name} - {user?.role === "admin" ? "Admin" : "Sales User"}
        </span>
        <button aria-label="Toggle dark mode" onClick={onToggleTheme} className="rounded-md border border-slate-300 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  </header>
);
