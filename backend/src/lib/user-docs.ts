import { AWS_REGION, USER_DOCS_BUCKET } from "../constants";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getDbDocumentsByUserId } from "../adapters/documents";
import mammoth from "mammoth";

const s3Client = new S3Client({ region: AWS_REGION });

// File types we can read as text directly
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

const isPDF = (fileType: string, fileName: string): boolean => {
  return (
    fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")
  );
};

const isDOCX = (fileType: string, fileName: string): boolean => {
  return (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.toLowerCase().endsWith(".docx")
  );
};

const getFileFromS3 = async (
  s3Key: string,
): Promise<{ buffer: Buffer; text?: string }> => {
  const command = new GetObjectCommand({
    Bucket: USER_DOCS_BUCKET,
    Key: s3Key,
  });

  const response = await s3Client.send(command);
  const byteArray = await response.Body?.transformToByteArray();

  if (!byteArray) {
    throw new Error("Empty response from S3");
  }

  const buffer = Buffer.from(byteArray);
  return { buffer };
};

const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse(buffer);
    await parser.load();
    const text = await parser.getText();
    return text || "";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return "[PDF could not be parsed]";
  }
};

const extractTextFromDOCX = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    return "[DOCX could not be parsed]";
  }
};

export const getUserDocumentContext = async (
  userId: string,
  roleSlug: string,
  maxDocs: number = 5,
): Promise<string> => {
  try {
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
        let content = "";

        console.log(
          `Processing document: ${doc.fileName} (${doc.fileType}) from S3 key: ${doc.s3Key}`,
        );

        if (isTextReadable(doc.fileType, doc.fileName)) {
          // Read text files directly
          const { buffer } = await getFileFromS3(doc.s3Key);
          content = buffer.toString("utf-8");
        } else if (isPDF(doc.fileType, doc.fileName)) {
          // Extract text from PDF
          console.log(`Extracting text from PDF: ${doc.fileName}`);
          const { buffer } = await getFileFromS3(doc.s3Key);
          content = await extractTextFromPDF(buffer);
        } else if (isDOCX(doc.fileType, doc.fileName)) {
          // Extract text from DOCX
          console.log(`Extracting text from DOCX: ${doc.fileName}`);
          const { buffer } = await getFileFromS3(doc.s3Key);
          content = await extractTextFromDOCX(buffer);
        } else {
          // Unsupported format — include metadata only
          docContents.push(
            `--- User Document: "${doc.fileName}" (${doc.fileType}) ---\n[Unsupported format. The user uploaded this file${doc.description ? `: ${doc.description}` : "."}]\n--- End ---`,
          );
          continue;
        }

        if (content && content.trim().length > 0) {
          const truncated =
            content.length > 6000
              ? content.substring(0, 6000) + "\n... [document truncated]"
              : content;
          docContents.push(
            `--- User Document: "${doc.fileName}" ---\n${truncated}\n--- End of "${doc.fileName}" ---`,
          );
          console.log(
            `Successfully extracted ${content.length} chars from ${doc.fileName}`,
          );
        } else {
          docContents.push(
            `--- User Document: "${doc.fileName}" ---\n[Document was empty or text could not be extracted]\n--- End ---`,
          );
        }
      } catch (err: any) {
        console.error(
          `Error processing document ${doc.documentId} (${doc.fileName}):`,
          err.message || err,
        );
        docContents.push(
          `--- User Document: "${doc.fileName}" ---\n[Error reading document: ${err.message || "unknown error"}]\n--- End ---`,
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
