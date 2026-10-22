import mongoose from "mongoose";

// Sub-schemas per category — only relevant fields stored
const studentSchema = new mongoose.Schema({
  educationLevel: { type: String, enum: ["school", "12th_pass", "ug_ongoing", "ug_done", "pg_ongoing", "pg_done", "other"], default: null },
  institution: { type: String, trim: true, maxlength: 200, default: null },
  course: { type: String, trim: true, maxlength: 120, default: null },
  yearOfStudy: { type: String, trim: true, maxlength: 30, default: null },
  tenthPercentage: { type: Number, min: 0, max: 100, default: null },
  twelfthPercentage: { type: Number, min: 0, max: 100, default: null },
}, { _id: false });

const farmerSchema = new mongoose.Schema({
  farmerType: { type: String, enum: ["landowner", "tenant", "sharecropper", "agricultural_labourer", "other"], default: null },
  landSizeAcres: { type: Number, min: 0, max: 10000, default: null },
  crops: { type: [String], default: [] },
  irrigationType: { type: String, enum: ["rainfed", "canal", "borewell", "tank", "mixed", "other"], default: null },
}, { _id: false });

const womanSchema = new mongoose.Schema({
  maritalStatus: { type: String, enum: ["single", "married", "widowed", "divorced", "other"], default: null },
  employmentStatus: { type: String, enum: ["unemployed", "employed", "self_employed", "student", "homemaker", "other"], default: null },
  isHeadOfHousehold: { type: Boolean, default: null },
}, { _id: false });

const jobSeekerSchema = new mongoose.Schema({
  employmentStatus: { type: String, enum: ["unemployed", "part_time", "full_time", "student", "other"], default: null },
  skills: { type: [String], default: [] },
  highestEducation: { type: String, trim: true, maxlength: 120, default: null },
}, { _id: false });

const entrepreneurSchema = new mongoose.Schema({
  businessType: { type: String, trim: true, maxlength: 120, default: null },
  businessStage: { type: String, enum: ["idea", "pre_launch", "early", "growth", "established"], default: null },
  sector: { type: String, trim: true, maxlength: 120, default: null },
  isRegistered: { type: Boolean, default: null },
  fundingNeed: { type: String, enum: ["none", "under_1L", "1L_to_10L", "10L_to_50L", "above_50L"], default: null },
}, { _id: false });

const seniorSchema = new mongoose.Schema({
  pensionStatus: { type: String, enum: ["none", "state", "central", "both"], default: null },
}, { _id: false });

const disabilitySchema = new mongoose.Schema({
  disabilityType: { type: String, trim: true, maxlength: 120, default: null },
  disabilityPercentage: { type: Number, min: 0, max: 100, default: null },
}, { _id: false });

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["student", "farmer", "woman", "jobseeker", "entrepreneur", "senior", "disability", "general"],
    },

    // -------- Common fields --------
    fullName: { type: String, trim: true, maxlength: 100, default: null },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say", null], default: null },
    state: { type: String, trim: true, default: "Tamil Nadu" },
    district: { type: String, trim: true, default: null },
    country: { type: String, trim: true, default: "India" },

    // -------- Income & community (asked only when relevant) --------
    annualFamilyIncome: { type: Number, min: 0, default: null },
    community: { type: String, enum: ["general", "bc", "mbc", "sc", "st", "other", null], default: null },

    // -------- Category-specific sub-docs --------
    student: { type: studentSchema, default: () => ({}) },
    farmer: { type: farmerSchema, default: () => ({}) },
    woman: { type: womanSchema, default: () => ({}) },
    jobSeeker: { type: jobSeekerSchema, default: () => ({}) },
    entrepreneur: { type: entrepreneurSchema, default: () => ({}) },
    senior: { type: seniorSchema, default: () => ({}) },
    disability: { type: disabilitySchema, default: () => ({}) },

    // -------- Wizard state --------
    currentStep: { type: Number, default: 1, min: 1, max: 5 },
    status: { type: String, enum: ["draft", "confirmed"], default: "draft" },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);