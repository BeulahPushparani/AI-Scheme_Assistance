import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    category: {
      type: String,
      enum: ["student", "farmer", "woman", "jobseeker", "entrepreneur", "senior", "disability", "general", null],
      default: null,
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before save (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Convert to JSON without sensitive fields
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    category: this.category,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model("User", userSchema);