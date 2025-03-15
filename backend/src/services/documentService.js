import { Document } from "../models/Document.js";
import { ApiError } from "../utils/errors.js";
import { User } from "../models/User.js";
export const DocumentService = {
  async createDocument(userId, title) {
    const user = await User.findById(userId);
    const document = new Document({
      title,
      createdBy: { userId, email: user.email },
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

  async shareDocument(documentId, email, role) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    document.permissions.push({ user: user._id, role });
    await document.save();
    return document;
  },

  async getAllDocuments(userId) {
    const documents = await Document.find({
      permissions: { $elemMatch: { user: userId } },
    });
    return documents;
  },

  async updateDocumentContent(documentId, content) {
    const document = await Document.findByIdAndUpdate(
      documentId,
      { content, updatedAt: new Date() },
      { new: true }
    );
    return document;
  },

  async updateDocumentTitle(documentId, title) {
    const document = await Document.findByIdAndUpdate(
      documentId,
      { title },
      { new: true }
    );
    return document;
  },
};
