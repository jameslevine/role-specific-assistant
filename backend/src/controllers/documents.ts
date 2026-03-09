import { HTTP_STATUS, TIER_LIMITS } from "../constants";
import { Request, Response } from "express";
import {
  createDbDocument,
  deleteDbDocument,
  getDbDocumentById,
  getDbDocumentCountByUserId,
  getDbDocumentsByUserId,
} from "../adapters/documents";
import { createDbUser, getDbUserByUserId } from "../adapters/users";
import {
  deleteS3Object,
  generateDownloadPresignedUrl,
  generateUploadPresignedUrl,
  getS3KeyForDocument,
} from "../lib/s3";

import { SubscriptionTier } from "../types";
import dayjs from "dayjs";

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { roleSlug } = req.params;
    const { fileName, fileType, fileSize, description } = req.body;
    const userId = req.user.sub;

    // Get user and check tier limits
    let user = await getDbUserByUserId(userId);
    if (!user) {
      user = await createDbUser(req.user.email, userId);
    }

    const tier = user.tier || SubscriptionTier.FREE;
    const tierLimits = TIER_LIMITS[tier];

    // Check file size limit
    if (fileSize > tierLimits.maxFileSizeBytes) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `File size exceeds limit for ${tier} tier (max ${tierLimits.maxFileSizeBytes / (1024 * 1024)}MB)`,
        code: "VALIDATION_ERROR",
      });
    }

    // Check document count limit
    const docCount = await getDbDocumentCountByUserId(userId);
    if (docCount >= tierLimits.documentsTotal) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: `Document limit reached for ${tier} tier (max ${tierLimits.documentsTotal} documents)`,
        code: "FORBIDDEN",
      });
    }

    // Create document record
    const s3Key = getS3KeyForDocument(userId, `doc_temp`, fileName);
    const document = await createDbDocument(
      userId,
      roleSlug,
      fileName,
      fileType,
      fileSize,
      s3Key,
      description,
    );

    // Generate presigned upload URL
    const uploadUrl = await generateUploadPresignedUrl(
      userId,
      document.documentId,
      fileName,
      fileType,
    );

    // Update s3Key with actual documentId
    const actualS3Key = getS3KeyForDocument(
      userId,
      document.documentId,
      fileName,
    );

    res.status(HTTP_STATUS.OK).json({
      documentId: document.documentId,
      uploadUrl,
      expiresAt: dayjs().add(1, "hour").toISOString(),
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error uploading document" });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { roleSlug } = req.params;
    const { limit, lastEvaluatedKey, status } = req.query;
    const userId = req.user.sub;

    const parsedKey = lastEvaluatedKey
      ? JSON.parse(Buffer.from(lastEvaluatedKey as string, "base64").toString())
      : undefined;

    const result = await getDbDocumentsByUserId(
      userId,
      roleSlug,
      Number(limit) || 20,
      parsedKey,
      status as string | undefined,
    );

    // Get user for tier info
    const user = await getDbUserByUserId(userId);
    const tier = user?.tier || SubscriptionTier.FREE;
    const tierLimits = TIER_LIMITS[tier];
    const docCount = await getDbDocumentCountByUserId(userId);

    res.status(HTTP_STATUS.OK).json({
      documents: result.items,
      lastEvaluatedKey: result.lastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString(
            "base64",
          )
        : undefined,
      usage: {
        documentsUsed: docCount,
        documentsLimit: tierLimits.documentsTotal,
        tier,
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching documents" });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { documentId } = req.params;
    const userId = req.user.sub;

    const document = await getDbDocumentById(documentId);
    if (!document || document.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Document not found" });
    }

    const downloadUrl = await generateDownloadPresignedUrl(document.s3Key);

    res.status(HTTP_STATUS.OK).json({
      ...document,
      downloadUrl,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching document" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { documentId } = req.params;
    const userId = req.user.sub;

    const document = await getDbDocumentById(documentId);
    if (!document || document.userId !== userId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Document not found" });
    }

    // Delete from S3
    await deleteS3Object(document.s3Key);

    // Delete from DynamoDB
    await deleteDbDocument(documentId);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting document:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting document" });
  }
};
