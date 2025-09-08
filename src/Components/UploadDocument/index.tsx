import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import FileDropZone from "Components/FileDropZone";
import FileViewCard from "Components/FileViewCard";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import { fileExtensionsToUpload, handleDownload } from "Helpers/utils";
import { useSnackbar } from "notistack";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DropzoneOptions } from "react-dropzone/.";
import { IFile } from "type/tenant.type";

interface IProps {
  primaryText?: string;
  onUpload: (files: File[]) => void;
  onRemoveFile: (files: File[]) => void;
  files?: File[];
  dropzoneProps?: DropzoneOptions;
  enableReinitialize?: boolean;
  existingFiles?: IFile[];
  onRemoveExistingFile?: Dispatch<SetStateAction<IFile[]>>;
  notRenderCancelBtn?: boolean;
  renderFileUpload?: boolean;
  cancelPermissions?: PermissionsEnum[];
  fileUploadPermissions?: PermissionsEnum[];
}

const UploadDocuments: React.FC<IProps> = (props) => {
  const {
    primaryText = "1. Please upload a signed copy to further the process.",
    onRemoveFile,
    onUpload,
    files,
    dropzoneProps,
    enableReinitialize,
    existingFiles,
    onRemoveExistingFile,
    cancelPermissions,
    fileUploadPermissions,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>(files || []);

  useEffect(() => {
    if (enableReinitialize && files?.[0]?.name) {
      setAcceptedFiles(files);
    } else if (!files?.length && enableReinitialize) {
      setAcceptedFiles([]);
    } else {
      // do nothing
    }
  }, [enableReinitialize, files]);

  const handleFileDrop = useCallback(
    (filesArg: File[]) => {
      const maxFiles = dropzoneProps?.maxFiles;
      if (maxFiles !== undefined) {
        const totalFiles = acceptedFiles.length + filesArg.length;
        if (totalFiles > maxFiles) {
          enqueueSnackbar(`You can only upload up to ${maxFiles} files.`, {
            variant: "error",
          });
          return;
        }
      }
      setAcceptedFiles((prev) => [...prev, ...filesArg]);
      onUpload(filesArg);
    },
    [dropzoneProps?.maxFiles, onUpload, acceptedFiles, enqueueSnackbar]
  );

  const handleFileRemove = (fileName: string, index: number) => {
    const newFiles = [...acceptedFiles];
    newFiles.splice(index, 1);
    setAcceptedFiles(newFiles);
    onRemoveFile(newFiles);
  };
  const handleExistingFileRemove = (index: number) => {
    if (existingFiles && onRemoveExistingFile) {
      const newFiles = [...existingFiles];
      newFiles.splice(index, 1);
      onRemoveExistingFile(newFiles);
    }
  };

  return (
    <Box p={1}>
      <Paper
        sx={{
          display: "flex",
          borderRadius: 4,
          p: 1,
          width: "100%",
          backgroundColor: "background.secondary",
          minHeight: "20rem",
        }}
      >
        <Box flex={1} p={2}>
          <List sx={{ color: "secondary.linkBreadcrumb" }}>
            <ListItem>
              <ListItemText primary={primaryText} />
            </ListItem>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "12rem",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            >
              {acceptedFiles.map((file, index) => (
                <ListItem key={file.name}>
                  <FileViewCard
                    fileDetail={file}
                    handleRemoveFile={() => handleFileRemove(file.name, index)}
                  />
                </ListItem>
              ))}
              {existingFiles?.map((file, index) => (
                <ListItem key={file.id ?? file.originalName ?? index}>
                  <FileViewCard
                    fileDetail={file}
                    cancelPermissions={cancelPermissions}
                    handleRemoveFile={() => {
                      handleExistingFileRemove(index);
                    }}
                    handleDownload={() => {
                      handleDownload(file.url, file.originalName, "_blank");
                    }}
                  />
                </ListItem>
              ))}
            </Box>
          </List>
        </Box>

        <PermissionWrapper requiredPermissions={fileUploadPermissions}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "50%",
              padding: "1rem",
            }}
          >
            <FileDropZone
              onDrop={handleFileDrop}
              accept={fileExtensionsToUpload}
              dropzoneProps={dropzoneProps}
              files={acceptedFiles ?? []}
            />
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                color: "secondary.linkBreadcrumb",
              }}
            >
              Accepted format: pdf
            </Typography>
          </Box>
        </PermissionWrapper>
      </Paper>
    </Box>
  );
};

export default UploadDocuments;
