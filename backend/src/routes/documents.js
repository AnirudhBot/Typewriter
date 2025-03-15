import express from "express";
import { DocumentService } from "../services/documentService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  async (req, res, next) => {
    try {
      const document = await DocumentService.createDocument(
        req.user._id,
        req.body.title
      );
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const document = await DocumentService.getDocument(
      req.params.id,
      req.user._id
    );
    res.json(document);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/share", authenticateToken, async (req, res, next) => {
  try {
    const document = await DocumentService.shareDocument(req.params.id, req.body.email, req.body.role);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const documents = await DocumentService.getAllDocuments(req.user._id);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/content", authenticateToken, async (req, res, next) => {
  try {
    const document = await DocumentService.updateDocumentContent(req.params.id, req.body.content);
    res.json(document);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/title", authenticateToken, async (req, res, next) => {
  try {
    const document = await DocumentService.updateDocumentTitle(req.params.id, req.body.title);
    res.json(document);
  } catch (error) {
    next(error);
  }
});


export default router;
