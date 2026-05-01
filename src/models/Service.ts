import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, default: "General" },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

