import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { getFileSize } from "./utils";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import { IFile } from "type/tenant.type";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { PermissionsEnum } from "Constants/enums";
import { PermissionWrapper } from "Components/PermissionWrapper";

interface IFileViewCardProps {
  fileDetail: File | IFile;
  handleRemoveFile?: (fileName: string) => void;
  handleDownload?: () => void;
  cancelPermissions?: PermissionsEnum[];
}

const FileViewCard: React.FC<IFileViewCardProps> = ({
  fileDetail,
  handleRemoveFile,
  handleDownload,
  cancelPermissions,
}) => {
  const fileName =
    (fileDetail as File).name ?? (fileDetail as IFile).originalName;
  const onFileRemove = () => {
    handleRemoveFile?.(fileName);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        width: "90%",
        backgroundColor: "background.secondaryDark",
        borderRadius: "0.625rem",
        padding: "0.125rem 1rem",
      }}
      data-testid="file-view-card"
    >
      <InsertDriveFileOutlinedIcon sx={{ fontSize: "2rem" }} />

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexGrow: 2,
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "1rem", color: "secondary.main" }}>
              <TruncatedTooltipText>{fileName}</TruncatedTooltipText>
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {getFileSize(fileDetail.size)}
            </Typography>
            {handleDownload && (
              <IconButton
                onClick={handleDownload}
                data-testid="file-download-btn"
              >
                <SaveAltIcon sx={{ color: "secondary.linkBreadcrumb" }} />
              </IconButton>
            )}
          </Box>

          <PermissionWrapper requiredPermissions={cancelPermissions}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              {handleRemoveFile && (
                <IconButton
                  onClick={onFileRemove}
                  data-testid="file-remove-btn"
                >
                  <CloseRoundedIcon
                    sx={{ color: "secondary.linkBreadcrumb" }}
                  />
                </IconButton>
              )}
            </Box>
          </PermissionWrapper>
        </Box>
        {!handleDownload && (
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
          />
        )}
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            mt: 0.5,
            alignSelf: "flex-start",
            px: 0.5,
          }}
        >
          {handleDownload ? "Selected" : "Completed"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FileViewCard;
