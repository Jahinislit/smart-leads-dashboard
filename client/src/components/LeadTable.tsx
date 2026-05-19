import { Trash2 } from "lucide-react";
import type { Lead, User } from "../types";
import { StatusBadge } from "./StatusBadge";

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  user: User | null;
  onView(lead: Lead): void;
  onEdit(lead: Lead): void;
  onDelete(lead: Lead): void;
}

export const LeadTable = ({ leads, loading, user, onView, onEdit, onDelete }: LeadTableProps) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    {loading ? (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading leads...</div>
    ) : leads.length === 0 ? (
      <div className="p-8 text-center">
        <h2 className="font-semibold">No leads found</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a lead or change the active filters.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-4 py-3">
                  <button onClick={() => onView(lead)} className="text-left font-semibold text-slate-950 hover:text-brand-600 dark:text-white dark:hover:text-brand-50">
                    {lead.name}
                  </button>
                  <div className="text-slate-500 dark:text-slate-400">{lead.email}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">{lead.source}</td>
                <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onView(lead)} className="mr-2 rounded-md border border-slate-300 px-3 py-1.5 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    View
                  </button>
                  <button onClick={() => onEdit(lead)} className="mr-2 rounded-md border border-slate-300 px-3 py-1.5 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    Edit
                  </button>
                  {user?.role === "admin" && (
                    <button onClick={() => onDelete(lead)} className="inline-flex items-center rounded-md border border-rose-200 px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-500/10" aria-label={`Delete ${lead.name}`}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
