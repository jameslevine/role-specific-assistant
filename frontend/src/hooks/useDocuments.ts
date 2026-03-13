import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../services/apiClient";

interface UserDocument {
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  status: "processing" | "ready" | "failed";
  createdAt: string;
}

interface DocumentsResponse {
  documents: UserDocument[];
  lastEvaluatedKey?: string;
  usage: {
    documentsUsed: number;
    documentsLimit: number;
    tier: string;
  };
}

interface UploadResponse {
  documentId: string;
  uploadUrl: string;
  expiresAt: string;
}

const DOCUMENTS_KEY = "documents";

export const useDocuments = (roleSlug: string) => {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, roleSlug],
    queryFn: async () => {
      const response = await apiClient.get<DocumentsResponse>(`/${roleSlug}/documents`);
      return response;
    },
    enabled: !!roleSlug,
  });
};

export const useUploadDocument = (roleSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, description }: { file: File; description?: string }) => {
      // Step 1: Request presigned URL (creates doc record with "processing" status)
      const uploadResponse = await apiClient.post<UploadResponse>(`/${roleSlug}/documents/upload`, {
        fileName: file.name,
        fileType: file.type || "text/plain",
        fileSize: file.size,
        description,
      });

      // Step 2: Upload file directly to S3 using presigned URL
      const s3Response = await fetch(uploadResponse.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "text/plain",
        },
      });

      if (!s3Response.ok) {
        throw new Error(`S3 upload failed with status ${s3Response.status}`);
      }

      // Step 3: Confirm upload — verifies file in S3 and updates status to "ready"
      await apiClient.post(`/${roleSlug}/documents/${uploadResponse.documentId}/confirm`);

      return uploadResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY, roleSlug] });
    },
  });
};

export const useDeleteDocument = (roleSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      await apiClient.delete(`/${roleSlug}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY, roleSlug] });
    },
  });
};
