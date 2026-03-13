import { AWS_REGION, USER_DOCS_BUCKET } from "../constants";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getDbDocumentsByUserId } from "../adapters/documents";

const s3Client = new S3Client({ region: AWS_REGION });

// File types we can read as text
const TEXT_READABLE_TYPES = [
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
];

const TEXT_READABLE_EXTENSIONS = [".txt", ".csv", ".md", ".json", ".log"];

const isTextReadable = (fileType: string, fileName: string): boolean => {
  if (TEXT_READABLE_TYPES.includes(fileType)) return true;
  return TEXT_READABLE_EXTENSIONS.some((ext) =>
    fileName.toLowerCase().endsWith(ext),
  );
};

export const getUserDocumentContext = async (
  userId: string,
  roleSlug: string,
  maxDocs: number = 5,
): Promise<string> => {
  try {
    // Get user's documents from DynamoDB
    const docsResult = await getDbDocumentsByUserId(userId, roleSlug, maxDocs);

    if (!docsResult.items || docsResult.items.length === 0) {
      return "";
    }

    console.log(
      `Found ${docsResult.items.length} documents for user ${userId} in role ${roleSlug}`,
    );

    const docContents: string[] = [];

    for (const doc of docsResult.items) {
      try {
        if (isTextReadable(doc.fileType, doc.fileName)) {
          console.log(
            `Reading document: ${doc.fileName} (${doc.fileType}) from S3 key: ${doc.s3Key}`,
          );

          const command = new GetObjectCommand({
            Bucket: USER_DOCS_BUCKET,
            Key: doc.s3Key,
          });

          const response = await s3Client.send(command);
          const content = await response.Body?.transformToString();

          if (content) {
            // Allow up to 4000 chars per document for better context
            const truncated =
              content.length > 4000
                ? content.substring(0, 4000) + "\n... [document truncated]"
                : content;
            docContents.push(
              `--- User Document: "${doc.fileName}" ---\n${truncated}\n--- End of "${doc.fileName}" ---`,
            );
            console.log(
              `Successfully read ${content.length} chars from ${doc.fileName}`,
            );
          }
        } else {
          // For non-text files (PDF, DOCX), include metadata only
          docContents.push(
            `--- User Document: "${doc.fileName}" (${doc.fileType}, ${Math.round(doc.fileSize / 1024)}KB) ---\n[This document is in ${doc.fileType} format. Text extraction for this format is not yet supported. The user uploaded this file${doc.description ? `: ${doc.description}` : "."}]\n--- End of "${doc.fileName}" ---`,
          );
        }
      } catch (err: any) {
        console.error(
          `Error reading document ${doc.documentId} (${doc.fileName}):`,
          err.message || err,
        );
        // Include a note that the document exists but couldn't be read
        docContents.push(
          `--- User Document: "${doc.fileName}" ---\n[Document exists but could not be read from storage. S3 Key: ${doc.s3Key}]\n--- End of "${doc.fileName}" ---`,
        );
      }
    }

    if (docContents.length === 0) {
      return "";
    }

    return `\n\n=== USER'S PERSONAL DOCUMENTS ===\nThe user has uploaded the following personal documents. You MUST use information from these documents to answer questions when relevant. Reference the document name when citing information from them.\n\n${docContents.join("\n\n")}\n=== END OF USER'S DOCUMENTS ===`;
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return "";
  }
};
