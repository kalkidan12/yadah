import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, index: true },
    emailAddress: { type: String, unique: true },
    dateOfBirth: { type: Date, index: true },
    gender: { type: String, enum: ["Male", "Female"], index: true },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      index: true,
    },
    numberOfChildren: { type: Number, default: 0 },
    residentialAddress: String,
    workAddress: String,
    educationalBackground: String,
    occupation: { type: String, index: true },
    skills: [String],
    localChurchName: String,
    localChurchAddress: String,
    roleInLocalChurch: [String],
    roleInYadahMinistry: [String],
    batchInYadahMinistry: Number,
  },
  { timestamps: true }
);

userSchema.index({
  fullName: "text",
  phoneNumber: "text",
});

export default mongoose.models.User || mongoose.model("User", userSchema);
