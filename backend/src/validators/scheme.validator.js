import { z } from "zod";

const categories = ["student", "farmer", "woman", "jobseeker", "entrepreneur", "senior", "disability", "general"];

export const createSchemeSchema = z.object({
  schemeId: z.string().trim().min(3).max(50),
  name: z.string().trim().min(3).max(250),
  category: z.enum(categories),
  targetBeneficiaries: z.array(z.string()).optional(),
  shortDescription: z.string().trim().min(10).max(400),
  description: z.string().trim().min(20).max(5000),
  benefits: z.array(z.string()).optional(),
  eligibilityRules: z.record(z.string(), z.any()),   // free-form object
  eligibilityText: z.string().max(5000).optional(),
  requiredDocuments: z.array(z.string()).optional(),
  applicationSteps: z.array(z.string()).optional(),
  officialLink: z.string().url(),
  officialSource: z.string().url(),
  lastVerifiedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  applicationDeadline: z.string().datetime().nullable().optional(),
  status: z.enum(["active", "closed", "rolling"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateSchemeSchema = createSchemeSchema.partial();

export const listSchemesQuerySchema = z.object({
  category: z.enum(categories).optional(),
  status: z.enum(["active", "closed", "rolling"]).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});