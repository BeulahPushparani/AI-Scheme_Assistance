import { z } from "zod";

const categories = ["student", "farmer", "woman", "jobseeker", "entrepreneur", "senior", "disability", "general"];

export const upsertProfileSchema = z.object({
  category: z.enum(categories),

  // common
  fullName: z.string().trim().max(100).optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional().nullable(),
  state: z.string().trim().max(60).optional(),
  district: z.string().trim().max(60).optional().nullable(),
  country: z.string().trim().max(60).optional(),
  annualFamilyIncome: z.number().min(0).optional().nullable(),
  community: z.enum(["general", "bc", "mbc", "sc", "st", "other"]).optional().nullable(),

  // student
  student: z.object({
    educationLevel: z.string().optional().nullable(),
    institution: z.string().trim().max(200).optional().nullable(),
    course: z.string().trim().max(120).optional().nullable(),
    yearOfStudy: z.string().trim().max(30).optional().nullable(),
    tenthPercentage: z.number().min(0).max(100).optional().nullable(),
    twelfthPercentage: z.number().min(0).max(100).optional().nullable(),
  }).optional(),

  // farmer
  farmer: z.object({
    farmerType: z.string().optional().nullable(),
    landSizeAcres: z.number().min(0).optional().nullable(),
    crops: z.array(z.string()).optional(),
    irrigationType: z.string().optional().nullable(),
  }).optional(),

  // woman
  woman: z.object({
    maritalStatus: z.string().optional().nullable(),
    employmentStatus: z.string().optional().nullable(),
    isHeadOfHousehold: z.boolean().optional().nullable(),
  }).optional(),

  // jobSeeker
  jobSeeker: z.object({
    employmentStatus: z.string().optional().nullable(),
    skills: z.array(z.string()).optional(),
    highestEducation: z.string().trim().max(120).optional().nullable(),
  }).optional(),

  // entrepreneur
  entrepreneur: z.object({
    businessType: z.string().trim().max(120).optional().nullable(),
    businessStage: z.string().optional().nullable(),
    sector: z.string().trim().max(120).optional().nullable(),
    isRegistered: z.boolean().optional().nullable(),
    fundingNeed: z.string().optional().nullable(),
  }).optional(),

  // senior
  senior: z.object({
    pensionStatus: z.string().optional().nullable(),
  }).optional(),

  // disability
  disability: z.object({
    disabilityType: z.string().trim().max(120).optional().nullable(),
    disabilityPercentage: z.number().min(0).max(100).optional().nullable(),
  }).optional(),

  // wizard state
  currentStep: z.number().min(1).max(5).optional(),
});