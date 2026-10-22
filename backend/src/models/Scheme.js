import mongoose from "mongoose";

const CATEGORIES = ["student", "farmer", "woman", "jobseeker", "entrepreneur", "senior", "disability", "general"];
const STATUSES = ["active", "closed", "rolling"];

const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      // e.g. "TN-SCH-001", "GOI-AGR-002"
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      index: true,
    },
    targetBeneficiaries: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 400,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    benefits: {
      type: [String],
      default: [],
    },

    // -------- Structured eligibility rules (used by rule engine) --------
    eligibilityRules: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // Structure documented in Section 3 above
    },

    // -------- Raw official eligibility text (used by RAG) --------
    eligibilityText: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    requiredDocuments: { type: [String], default: [] },
    applicationSteps: { type: [String], default: [] },

    officialLink: { type: String, required: true, trim: true },
    officialSource: { type: String, required: true, trim: true },

    lastVerifiedDate: { type: Date, required: true },
    applicationDeadline: { type: Date, default: null },
    status: { type: String, enum: STATUSES, default: "active", index: true },

    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Text search index for future full-text queries
schemeSchema.index({ name: "text", shortDescription: "text", tags: "text" });

export const Scheme = mongoose.model("Scheme", schemeSchema);
export { CATEGORIES, STATUSES };