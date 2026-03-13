import {
  confirmUpload,
  deleteDocument,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from "../controllers/documents";
import {
  documentListQuerySchema,
  documentParamsSchema,
  documentUploadBodySchema,
} from "../models/document";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";

import { cognitoAuthMiddleware } from "../middleware/cognito-auth";
import express from "express";

export const router = express.Router({ mergeParams: true });

router.post(
  "/upload",
  cognitoAuthMiddleware,
  validateBody(documentUploadBodySchema),
  uploadDocument,
);

router.get(
  "/",
  cognitoAuthMiddleware,
  validateQuery(documentListQuerySchema),
  getDocuments,
);

router.get(
  "/:documentId",
  cognitoAuthMiddleware,
  validateParams(documentParamsSchema),
  getDocumentById,
);

router.post(
  "/:documentId/confirm",
  cognitoAuthMiddleware,
  confirmUpload,
);

router.delete(
  "/:documentId",
  cognitoAuthMiddleware,
  validateParams(documentParamsSchema),
  deleteDocument,
);
