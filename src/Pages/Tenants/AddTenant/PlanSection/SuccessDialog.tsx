import { Box, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import Button from "Components/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router";
import { SuccessDialogStyle } from "./SuccessDialogStyle";

interface SuccessDialogProps {
  isDialogOpen: boolean;
  onNavigateToTenant: () => void;
  title?: string;
  content?: string;
}

const SuccessDialog = ({
  isDialogOpen,
  onNavigateToTenant,
  title,
  content,
}: SuccessDialogProps) => {
  const navigate = useNavigate();

  const handleNavigate = (nav: string) => {
    navigate(nav);
  };

  return (
    <Dialog
      open={isDialogOpen}
      maxWidth="xs"
      fullWidth
      sx={SuccessDialogStyle.dialog}
      data-testid="success-typography"
    >
      <DialogContent sx={SuccessDialogStyle.dialogContent}>
        <CheckCircleIcon sx={SuccessDialogStyle.circleIcon} />
        <Typography variant="h6" sx={SuccessDialogStyle.outerTypography}>
          {title ?? "Success"}
        </Typography>
        <Box sx={SuccessDialogStyle.box}>
          <Typography sx={SuccessDialogStyle.typography}>
            {content ??
              "The process to add tenant has been initiated successfully."}
          </Typography>
        </Box>
        <Stack spacing={2.5} sx={SuccessDialogStyle.stack}>
          <Button
            onClick={onNavigateToTenant}
            variant="contained"
            sx={SuccessDialogStyle.createTenantButton}
          >
            Add more tenants
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleNavigate("/tenants")}
            sx={SuccessDialogStyle.tenantButton}
          >
            Go to Tenants
          </Button>
          <Button
            onClick={() => handleNavigate("/dashboard")}
            sx={SuccessDialogStyle.dashboardButton}
          >
            Go to Dashboard
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
