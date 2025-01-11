import { Document } from "../models/Document.js";
import { ApiError } from "../utils/errors.js";

export const DocumentService = {
  async createDocument(userId, title) {
    const document = new Document({
      title,
      createdBy: userId,
      permissions: [{ user: userId, role: "owner" }],
    });
    await document.save();
    return document;
  },

  async getDocument(documentId, userId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    const hasPermission = document.permissions.some(
      (p) => p.user.toString() === userId.toString()
    );
    if (!hasPermission) {
      throw new ApiError(403, "Access denied");
    }

    return document;
  },

  async updateDocumentContent(documentId, content) {
    const document = await Document.findByIdAndUpdate(
      documentId,
      { content, updatedAt: new Date() },
      { new: true }
    );
    return document;
  },
};
