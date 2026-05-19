import { body, param, query } from "express-validator";
import { leadSources, leadStatuses } from "../models/Lead";

export const leadIdValidator = [param("id").isMongoId().withMessage("Invalid lead id")];

export const leadValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("status").isIn(leadStatuses).withMessage("Invalid lead status"),
  body("source").isIn(leadSources).withMessage("Invalid lead source")
];

export const updateLeadValidator = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("status").optional().isIn(leadStatuses).withMessage("Invalid lead status"),
  body("source").optional().isIn(leadSources).withMessage("Invalid lead source")
];

export const leadQueryValidator = [
  query("status").optional().isIn(leadStatuses).withMessage("Invalid lead status"),
  query("source").optional().isIn(leadSources).withMessage("Invalid lead source"),
  query("search").optional().trim().isLength({ max: 80 }).withMessage("Search must be 80 characters or less"),
  query("sort").optional().isIn(["latest", "oldest"]).withMessage("Sort must be latest or oldest"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer")
];
