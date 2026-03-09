import {
  AWS_REGION,
  PRESIGNED_URL_EXPIRY,
  USER_DOCS_BUCKET,
} from "../constants";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: AWS_REGION });

export const generateUploadPresignedUrl = async (
  userId: string,
  documentId: string,
  fileName: string,
  fileType: string,
): Promise<string> => {
  const s3Key = `${userId}/${documentId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: USER_DOCS_BUCKET,
    Key: s3Key,
    ContentType: fileType,
    Metadata: {
      userId,
      documentId,
    },
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return url;
};

export const generateDownloadPresignedUrl = async (
  s3Key: string,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: USER_DOCS_BUCKET,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return url;
};

export const deleteS3Object = async (s3Key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: USER_DOCS_BUCKET,
    Key: s3Key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    throw error;
  }
};

export const getS3KeyForDocument = (
  userId: string,
  documentId: string,
  fileName: string,
): string => {
  return `${userId}/${documentId}/${fileName}`;
};
