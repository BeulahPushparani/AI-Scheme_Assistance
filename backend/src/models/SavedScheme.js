import mongoose from "mongoose";

const savedSchemeSchema = new mongoose.Schema(
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
    note: { type: String, default: "" },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One user can save a scheme only once
savedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const SavedScheme = mongoose.model("SavedScheme", savedSchemeSchema);