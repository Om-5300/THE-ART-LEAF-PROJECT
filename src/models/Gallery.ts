import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

