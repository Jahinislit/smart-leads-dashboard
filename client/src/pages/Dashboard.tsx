import { useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import { DashboardHeader } from "../components/DashboardHeader";
import { LeadDetailsModal } from "../components/LeadDetailsModal";
import { LeadFilters } from "../components/LeadFilters";
import { LeadForm } from "../components/LeadForm";
import { LeadTable } from "../components/LeadTable";
import { Pagination } from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import type { ApiResponse, Lead, LeadFilters as LeadFiltersType, LeadSource, LeadStatus, PaginationMeta } from "../types";
import { exportLeadsCsv } from "../utils/csv";

const initialFilters: LeadFiltersType = { status: "", source: "", search: "", sort: "latest", page: 1 };

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFiltersType>(initialFilters);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("smart_leads_theme") === "dark");
  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("smart_leads_theme", dark ? "dark" : "light");
  }, [dark]);

  const query = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.status) params.set("status", query.status);
      if (query.source) params.set("source", query.source);
      if (query.search) params.set("search", query.search);
      params.set("sort", query.sort);
      params.set("page", String(query.page));
      const { data } = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
      setLeads(data.data);
      setMeta(data.meta ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads();
  }, [query.status, query.source, query.search, query.sort, query.page]);

  const updateFilter = <K extends keyof LeadFiltersType>(key: K, value: LeadFiltersType[K]) => {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? Number(value) : 1 }));
  };

  const saveLead = async (input: { name: string; email: string; status: LeadStatus; source: LeadSource }) => {
    setSaving(true);
    setError("");
    try {
      if (selectedLead) await api.patch(`/leads/${selectedLead._id}`, input);
      else await api.post("/leads", input);
      setSelectedLead(null);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (lead: Lead) => {
    if (!window.confirm(`Delete ${lead.name}?`)) return;
    setError("");
    try {
      await api.delete(`/leads/${lead._id}`);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const viewLead = async (lead: Lead) => {
    setDetailLead(lead);
    setDetailLoading(true);
    setDetailError("");
    try {
      const { data } = await api.get<ApiResponse<Lead>>(`/leads/${lead._id}`);
      setDetailLead(data.data);
    } catch (err) {
      setDetailError(getErrorMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const editFromDetails = (lead: Lead) => {
    setDetailLead(null);
    setSelectedLead(lead);
  };

  const handleExport = async () => {
    try {
      await exportLeadsCsv(query);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <DashboardHeader user={user} dark={dark} onToggleTheme={() => setDark((value) => !value)} onLogout={logout} />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <LeadForm selectedLead={selectedLead} isSaving={saving} onSubmit={saveLead} onCancelEdit={() => setSelectedLead(null)} />

        <section className="space-y-4">
          <LeadFilters filters={filters} onChange={updateFilter} onExport={handleExport} />

          {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

          <LeadTable leads={leads} loading={loading} user={user} onView={viewLead} onEdit={setSelectedLead} onDelete={deleteLead} />

          {meta && <Pagination meta={meta} page={filters.page} onChange={updateFilter} />}
        </section>
      </div>

      <LeadDetailsModal lead={detailLead} loading={detailLoading} error={detailError} onClose={() => setDetailLead(null)} onEdit={editFromDetails} />
    </main>
  );
};
