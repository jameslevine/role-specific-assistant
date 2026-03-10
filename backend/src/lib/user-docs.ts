import { AWS_REGION, USER_DOCS_BUCKET } from "../constants";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getDbDocumentsByUserId } from "../adapters/documents";

const s3Client = new S3Client({ region: AWS_REGION });

export const getUserDocumentContext = async (
  userId: string,
  roleSlug: string,
  maxDocs: number = 3,
): Promise<string> => {
  try {
    // Get user's documents from DynamoDB
    const docsResult = await getDbDocumentsByUserId(userId, roleSlug, maxDocs);

    if (!docsResult.items || docsResult.items.length === 0) {
      return "";
    }

    const docContents: string[] = [];

    for (const doc of docsResult.items) {
      try {
        // Only read text-based documents
        if (
          doc.fileType === "text/plain" ||
          doc.fileName.endsWith(".txt")
        ) {
          const command = new GetObjectCommand({
            Bucket: USER_DOCS_BUCKET,
            Key: doc.s3Key,
          });

          const response = await s3Client.send(command);
          const content = await response.Body?.transformToString();

          if (content) {
            // Limit each document to 2000 chars to avoid token limits
            const truncated =
              content.length > 2000
                ? content.substring(0, 2000) + "... [truncated]"
                : content;
            docContents.push(
              `--- Document: ${doc.fileName} ---\n${truncated}\n--- End of ${doc.fileName} ---`,
            );
          }
        }
      } catch (err) {
        console.error(`Error reading document ${doc.documentId}:`, err);
        // Skip documents that can't be read
      }
    }

    if (docContents.length === 0) {
      return "";
    }

    return `\n\nThe user has uploaded the following personal documents. Use them to provide personalised answers when relevant:\n\n${docContents.join("\n\n")}`;
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return "";
  }
};
