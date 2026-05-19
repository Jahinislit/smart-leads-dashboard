import { Download, Search } from "lucide-react";
import type { LeadFilters as LeadFiltersType, LeadSource, LeadStatus } from "../types";
import { leadSources, leadStatuses } from "../types";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onChange<K extends keyof LeadFiltersType>(key: K, value: LeadFiltersType[K]): void;
  onExport(): void;
}

export const LeadFilters = ({ filters, onChange, onExport }: LeadFiltersProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_140px_auto]">
      <label className="relative block">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          placeholder="Search name or email"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
      </label>
      <select className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={filters.status} onChange={(event) => onChange("status", event.target.value as "" | LeadStatus)}>
        <option value="">All statuses</option>
        {leadStatuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <select className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={filters.source} onChange={(event) => onChange("source", event.target.value as "" | LeadSource)}>
        <option value="">All sources</option>
        {leadSources.map((source) => (
          <option key={source}>{source}</option>
        ))}
      </select>
      <select className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={filters.sort} onChange={(event) => onChange("sort", event.target.value as "latest" | "oldest")}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
      <button onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
        <Download size={16} /> CSV
      </button>
    </div>
  </div>
);
