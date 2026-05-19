import type { FilterQuery } from "mongoose";
import type { Request, Response } from "express";
import { Lead, type LeadDocument, type LeadSource, type LeadStatus } from "../models/Lead";
import { AppError } from "../utils/AppError";
import { ok } from "../utils/apiResponse";

const PAGE_LIMIT = 10;

interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
}

const buildLeadFilter = (query: LeadQuery): FilterQuery<LeadDocument> => {
  const filter: FilterQuery<LeadDocument> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const search = query.search.trim();
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  return filter;
};

export const listLeads = async (req: Request, res: Response): Promise<void> => {
  const query = req.query as LeadQuery;
  const page = Number(query.page ?? 1);
  const filter = buildLeadFilter(query);
  const sort = { createdAt: query.sort === "oldest" ? 1 : -1 } as const;
  const skip = (page - 1) * PAGE_LIMIT;

  const [items, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(PAGE_LIMIT).populate("createdBy", "name email role"),
    Lead.countDocuments(filter)
  ]);

  res.json(
    ok(items, "Leads fetched", {
      page,
      limit: PAGE_LIMIT,
      total,
      totalPages: Math.ceil(total / PAGE_LIMIT),
      hasNextPage: page * PAGE_LIMIT < total,
      hasPreviousPage: page > 1
    })
  );
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate("createdBy", "name email role");
  if (!lead) throw new AppError("Lead not found", 404);
  res.json(ok(lead, "Lead fetched"));
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const lead = await Lead.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(ok(lead, "Lead created"));
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lead) throw new AppError("Lead not found", 404);
  res.json(ok(lead, "Lead updated"));
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError("Lead not found", 404);
  res.json(ok({ id: req.params.id }, "Lead deleted"));
};

export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  const filter = buildLeadFilter(req.query as LeadQuery);
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  const rows = leads.map((lead) =>
    [lead.name, lead.email, lead.status, lead.source, lead.createdAt.toISOString()]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = ["Name,Email,Status,Source,Created At", ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.status(200).send(csv);
};
