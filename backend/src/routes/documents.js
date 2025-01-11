import express from "express";
import { DocumentService } from "../services/documentService.js";
import { authenticateToken } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorize("editor"),
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

export default router;
