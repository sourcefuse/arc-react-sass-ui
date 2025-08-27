import React, { useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useUploadFeatureCsvMutation } from "redux/app/featuresApiSlice";
import { useSnackbar } from "notistack";
import BackdropLoader from "Components/BackdropLoader";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadState {
  selectedFile: File | null;
  isSubmitting: boolean;
}

const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    selectedFile: null,
    isSubmitting: false,
  });

  const updateState = (newState: Partial<FileUploadState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  return { state, updateState };
};

const FileInput: React.FC<{
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ fileInputRef, onFileSelect }) => (
  <input
    type="file"
    accept=".csv"
    onChange={onFileSelect}
    style={{ display: "none" }}
    ref={fileInputRef}
  />
);

const UploadButton: React.FC<{
  selectedFile: File | null;
  onClick: () => void;
}> = ({ selectedFile, onClick }) => (
  <Button
    variant={selectedFile ? "contained" : "outlined"}
    onClick={onClick}
    startIcon={<CloudUploadIcon />}
    sx={{
      borderRadius: 2,
      minWidth: 120,
      bgcolor: selectedFile ? "primary.main" : "transparent",
      "&:hover": {
        bgcolor: selectedFile ? "primary.dark" : "rgba(0, 0, 0, 0.04)",
      },
    }}
  >
    {selectedFile ? "Upload" : "Select CSV File"}
  </Button>
);

const SelectedFileInfo: React.FC<{ fileName: string }> = ({ fileName }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Selected file: {fileName}
    </Typography>
  </Box>
);

const FeatureCsvUpload: React.FC = () => {
  const { state, updateState } = useFileUpload();
  const { selectedFile, isSubmitting } = state;

  const [uploadFeatureCsv] = useUploadFeatureCsvMutation();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    updateState({ selectedFile: null });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || file.type !== "text/csv") {
      enqueueSnackbar("Please select a valid CSV file", { variant: "error" });
      resetFileInput();
      return;
    }

    updateState({ selectedFile: file });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    updateState({ isSubmitting: true });
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await uploadFeatureCsv(formData).unwrap();
      enqueueSnackbar("CSV file uploaded successfully!", {
        variant: "success",
      });
      resetFileInput();
    } catch (error) {
      enqueueSnackbar("Failed to upload CSV file. Please try again.", {
        variant: "error",
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  const handleButtonClick = () => {
    if (selectedFile) {
      handleUpload();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {isSubmitting && <BackdropLoader />}
      <FileInput fileInputRef={fileInputRef} onFileSelect={handleFileSelect} />
      <UploadButton selectedFile={selectedFile} onClick={handleButtonClick} />
      {selectedFile && <SelectedFileInfo fileName={selectedFile.name} />}
    </Box>
  );
};

export default FeatureCsvUpload;
