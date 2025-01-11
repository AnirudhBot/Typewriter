import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: Object },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  permissions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["owner", "editor", "viewer"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Document = mongoose.model("Document", documentSchema);
