import type { LeadStatus } from "../types";

const styles: Record<LeadStatus, string> = {
  New: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
  Contacted: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  Qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>
);
