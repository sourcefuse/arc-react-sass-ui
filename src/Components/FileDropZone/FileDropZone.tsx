import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography } from "@mui/material";
import { MAX_FILE_SIZE, MAX_FILES } from "Helpers/utils";
import {
  Accept,
  DropEvent,
  FileRejection,
  DropzoneOptions,
  useDropzone,
  FileError,
} from "react-dropzone";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

interface IFileDropZoneProps {
  onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  accept?: Accept;
  dropzoneProps?: DropzoneOptions;
  files: File[];
}
const formatFileSize = (bytes: number) =>
  (bytes / (1024 * 1024)).toFixed(2) + " MB";

const getErrorMessage = (error: FileError, maxFiles: number): string => {
  if (error.code === "file-too-large") {
    return `File is larger than ${formatFileSize(MAX_FILE_SIZE)}`;
  }
  if (error.code === "too-many-files") {
    return `File limit exceeded only ${maxFiles} files can be uploaded at once`;
  }
  return error.message;
};

const processFileRejections = (
  fileRejections: FileRejection[],
  maxFiles: number
): string[] => {
  const errorMap = new Map<string, string[]>();

  fileRejections.forEach(({ errors, file }) => {
    errors.forEach((error) => {
      const errorMessage = getErrorMessage(error, maxFiles);
      if (!errorMap.has(errorMessage)) {
        errorMap.set(errorMessage, []);
      }
      errorMap.get(errorMessage)!.push(file.name);
    });
  });

  return Array.from(errorMap.entries()).map(([errorMsg, files]) => {
    return errorMsg === `File is larger than ${formatFileSize(MAX_FILE_SIZE)}`
      ? `${errorMsg} for ${files.length} files`
      : `${errorMsg}`;
  });
};

const DropZoneContent: React.FC<{ isDragActive: boolean }> = ({
  isDragActive,
}) => {
  if (isDragActive) {
    return (
      <Typography
        sx={{ color: "secondary.main", fontWeight: 700 }}
        data-testid="drop-zone"
      >
        Drop the files here.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
      }}
    >
      <CloudUploadIcon sx={{ fontSize: "3rem", color: "primary.p100" }} />
      <Typography sx={{ color: "secondary.main", fontWeight: 700 }}>
        Drag & drop files here
      </Typography>
      <Typography sx={{ color: "secondary.linkBreadcrumb" }}>or</Typography>
      <Typography sx={{ color: "primary.p200", fontWeight: "500" }}>
        Browse files
      </Typography>
    </Box>
  );
};

const ErrorMessages: React.FC<{ messages: string[] }> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <Box mt={2}>
      {messages.map((error) => (
        <Typography
          key={error}
          sx={{ color: "error.main", fontSize: "0.875rem" }}
        >
          {error}
        </Typography>
      ))}
    </Box>
  );
};

const FileDropZone: React.FC<IFileDropZoneProps> = ({
  onDrop,
  accept,
  dropzoneProps,
  files,
}) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const {
    maxSize = MAX_FILE_SIZE,
    maxFiles = MAX_FILES,
    multiple = true,
    ...otherDropzoneProps
  } = dropzoneProps ?? {};

  const handleDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    const newErrorMessages = processFileRejections(fileRejections, maxFiles);
    setErrorMessages(newErrorMessages);
    onDrop(acceptedFiles, fileRejections, event);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!multiple && files.length >= 1) {
      event.preventDefault();
      enqueueSnackbar(
        `Only ${maxFiles} file${
          maxFiles > 1 ? "s" : ""
        } can be uploaded at once.`,
        { variant: "error" }
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles,
    disabled: !multiple && files.length >= 1,
    ...otherDropzoneProps,
  });

  const baseRootProps = getRootProps();
  const rootProps = {
    ...baseRootProps,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      handleClick(event);
      baseRootProps.onClick?.(event);
    },
  };

  return (
    <Box
      flex={1}
      p={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: "background.secondaryDark",
      }}
      border="0.125rem dashed "
      borderColor="secondary.border"
      {...rootProps}
      data-testid="file-drop-zone"
    >
      <input {...getInputProps()} data-testid="file-drop-zone-input" />
      <DropZoneContent isDragActive={isDragActive} />
      <ErrorMessages messages={errorMessages} />
    </Box>
  );
};

export default FileDropZone;
