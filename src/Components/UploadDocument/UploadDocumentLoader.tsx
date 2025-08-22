import { Box, Paper, Skeleton, Stack } from "@mui/material";
import React from "react";
import { uploadDocumentLoaderStyles as styles } from "./uploadDocumentLoader.styles";

const UploadDocumentLoader = () => {
  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper} data-testid="upload-document-loader">
        <Box sx={styles.contentContainer}>
          <Skeleton variant="text" sx={styles.titleSkeleton} />

          <Stack spacing={2}>
            {[...Array(3)].map((_, idx) => {
              const uniqueKey = `skeleton-item-${idx}}`;
              return (
                <Box key={uniqueKey} sx={styles.itemContainer}>
                  <Skeleton variant="text" sx={styles.itemSkeleton} />
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Box sx={styles.previewContainer}>
          <Skeleton variant="rectangular" sx={styles.previewSkeleton} />
          <Skeleton variant="text" sx={styles.footerSkeleton} />
        </Box>
      </Paper>
    </Box>
  );
};

export default UploadDocumentLoader;
