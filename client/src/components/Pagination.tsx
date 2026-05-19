import type { LeadFilters, PaginationMeta } from "../types";

interface PaginationProps {
  meta: PaginationMeta;
  page: number;
  onChange<K extends keyof LeadFilters>(key: K, value: LeadFilters[K]): void;
}

export const Pagination = ({ meta, page, onChange }: PaginationProps) => (
  <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
    <span className="text-slate-500 dark:text-slate-400">
      Page {meta.page} of {Math.max(meta.totalPages, 1)} - {meta.total} total leads
    </span>
    <div className="flex gap-2">
      <button disabled={!meta.hasPreviousPage} onClick={() => onChange("page", page - 1)} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700">
        Previous
      </button>
      <button disabled={!meta.hasNextPage} onClick={() => onChange("page", page + 1)} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700">
        Next
      </button>
    </div>
  </div>
);
