import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AuthSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "system-admin", "user"],
      default: "user",
    },
    resetOTP: String,
    resetOTPExpiry: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AuthSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Auth || mongoose.model("Auth", AuthSchema);
