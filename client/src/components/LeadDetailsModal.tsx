import { X } from "lucide-react";
import type { Lead } from "../types";
import { StatusBadge } from "./StatusBadge";

interface LeadDetailsModalProps {
  lead: Lead | null;
  loading: boolean;
  error: string;
  onClose(): void;
  onEdit(lead: Lead): void;
}

export const LeadDetailsModal = ({ lead, loading, error, onClose, onEdit }: LeadDetailsModalProps) => {
  if (!lead && !loading && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold">Lead details</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close details">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading lead details...</p>
          ) : error ? (
            <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>
          ) : lead ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</p>
                <p className="text-xl font-semibold">{lead.name}</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
                  <dd className="font-medium">{lead.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={lead.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Source</dt>
                  <dd className="font-medium">{lead.source}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Created</dt>
                  <dd className="font-medium">{new Date(lead.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
              <button onClick={() => onEdit(lead)} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                Edit lead
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
