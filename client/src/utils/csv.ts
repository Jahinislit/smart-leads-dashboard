import { api } from "../api/client";
import type { LeadFilters } from "../types";

export const exportLeadsCsv = async (filters: LeadFilters): Promise<void> => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  params.set("sort", filters.sort);

  const response = await api.get(`/leads/export?${params.toString()}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = "leads.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};
