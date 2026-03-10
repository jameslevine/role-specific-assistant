import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useDeleteDocument, useDocuments, useUploadDocument } from "../hooks/useDocuments";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { ROLE_BRANDS } from "../constants";
import { useAuth } from "../hooks/useAuth";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getStatusColor = (status: string): "success" | "warning" | "error" => {
  switch (status) {
    case "ready":
      return "success";
    case "processing":
      return "warning";
    case "failed":
      return "error";
    default:
      return "warning";
  }
};

const DocumentsPage = () => {
  const { roleSlug = "" } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const brand = ROLE_BRANDS[roleSlug] || { name: "TradeAssist", icon: "🏗️", color: "#2563EB" };

  const { data: documentsData, isLoading } = useDocuments(roleSlug);
  const uploadDocument = useUploadDocument(roleSlug);
  const deleteDocument = useDeleteDocument(roleSlug);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
      setUploadError(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadError(null);

    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        description: description || undefined,
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDescription("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument.mutateAsync(documentId);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(`/${roleSlug}/chat`)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {brand.icon} {brand.name} — Documents
          </Typography>
          <Button size="small" onClick={logout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Usage Info */}
        {documentsData?.usage && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  Document Storage
                </Typography>
                <Chip
                  label={`${documentsData.usage.tier.toUpperCase()} tier`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  (documentsData.usage.documentsUsed / documentsData.usage.documentsLimit) * 100
                }
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {documentsData.usage.documentsUsed} / {documentsData.usage.documentsLimit} documents
                used
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Your Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ bgcolor: brand.color, "&:hover": { bgcolor: brand.color, opacity: 0.9 } }}
          >
            Upload Document
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.txt,.docx"
            onChange={handleFileSelect}
          />
        </Box>

        {/* Documents List */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : documentsData?.documents?.length === 0 ? (
          <Card sx={{ textAlign: "center", py: 6 }}>
            <CardContent>
              <DescriptionIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No documents yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload PDFs, text files, or Word documents to get personalised AI assistance
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Your First Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {documentsData?.documents?.map((doc) => (
              <Card key={doc.documentId}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DescriptionIcon sx={{ fontSize: 36, color: brand.color }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {doc.fileName}
                    </Typography>
                    {doc.description && (
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      <Chip label={formatFileSize(doc.fileSize)} size="small" variant="outlined" />
                      <Chip label={doc.status} size="small" color={getStatusColor(doc.status)} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ alignSelf: "center" }}
                      >
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(doc.documentId)}
                    disabled={deleteDocument.isPending}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}
          {selectedFile && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown type"}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Description (optional)"
            placeholder="e.g., Customer invoice for Smith residence"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploadDocument.isPending}
            sx={{ bgcolor: brand.color }}
          >
            {uploadDocument.isPending ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;
