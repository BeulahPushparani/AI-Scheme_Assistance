import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    schemeId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["started", "applied", "approved", "rejected"],
      default: "started",
    },
    appliedAt: { type: Date, default: null },
    notes: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

// One application per user per scheme
applicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);