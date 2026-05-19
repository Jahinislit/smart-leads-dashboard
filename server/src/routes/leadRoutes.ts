import { Router } from "express";
import { createLead, deleteLead, exportLeadsCsv, getLead, listLeads, updateLead } from "../controllers/leadController";
import { asyncHandler } from "../middleware/asyncHandler";
import { authorize, protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { leadIdValidator, leadQueryValidator, leadValidator, updateLeadValidator } from "../validators/leadValidators";

export const leadRoutes = Router();

leadRoutes.use(protect);
leadRoutes.get("/", leadQueryValidator, validate, asyncHandler(listLeads));
leadRoutes.get("/export", leadQueryValidator, validate, asyncHandler(exportLeadsCsv));
leadRoutes.post("/", authorize("admin", "sales"), leadValidator, validate, asyncHandler(createLead));
leadRoutes.get("/:id", leadIdValidator, validate, asyncHandler(getLead));
leadRoutes.patch("/:id", authorize("admin", "sales"), leadIdValidator, updateLeadValidator, validate, asyncHandler(updateLead));
leadRoutes.delete("/:id", authorize("admin"), leadIdValidator, validate, asyncHandler(deleteLead));
