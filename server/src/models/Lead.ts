import { Schema, model, type Document, type Model, type Types } from "mongoose";

export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = ILead & Document;

const leadSchema = new Schema<LeadDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: leadStatuses, required: true, default: "New" },
    source: { type: String, enum: leadSources, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead: Model<LeadDocument> = model<LeadDocument>("Lead", leadSchema);
