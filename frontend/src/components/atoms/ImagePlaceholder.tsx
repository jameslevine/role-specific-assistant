import { Box, Typography } from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";

interface ImagePlaceholderProps {
  height?: number | string;
  width?: string;
  label?: string;
  borderRadius?: number;
}

const ImagePlaceholder = ({
  height = 300,
  width = "100%",
  label = "Image Placeholder",
  borderRadius = 2,
}: ImagePlaceholderProps) => {
  return (
    <Box
      sx={{
        height,
        width,
        bgcolor: "grey.100",
        borderRadius,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed",
        borderColor: "grey.300",
        gap: 1,
      }}
    >
      <ImageIcon sx={{ fontSize: 40, color: "grey.400" }} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

export default ImagePlaceholder;
