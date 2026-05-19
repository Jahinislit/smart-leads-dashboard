import { useEffect, useState } from "react";
import type { Lead, LeadSource, LeadStatus } from "../types";
import { leadSources, leadStatuses } from "../types";

interface LeadFormState {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

interface LeadFormProps {
  selectedLead: Lead | null;
  isSaving: boolean;
  onSubmit(input: LeadFormState): Promise<void>;
  onCancelEdit(): void;
}

const initialState: LeadFormState = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

export const LeadForm = ({ selectedLead, isSaving, onSubmit, onCancelEdit }: LeadFormProps) => {
  const [form, setForm] = useState<LeadFormState>(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedLead) {
      setForm({
        name: selectedLead.name,
        email: selectedLead.email,
        status: selectedLead.status,
        source: selectedLead.source
      });
    }
  }, [selectedLead]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{selectedLead ? "Update lead" : "Create lead"}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Capture the prospect details and keep status current.</p>
      </div>

      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Name
        <input
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Rahul Sharma"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Email
        <input
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="rahul@example.com"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Status
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as LeadStatus }))}
          >
            {leadStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Source
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            value={form.source}
            onChange={(event) => setForm((current) => ({ ...current, source: event.target.value as LeadSource }))}
          >
            {leadSources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-2">
        <button disabled={isSaving} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? "Saving..." : selectedLead ? "Save changes" : "Add lead"}
        </button>
        {selectedLead && (
          <button type="button" onClick={onCancelEdit} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
