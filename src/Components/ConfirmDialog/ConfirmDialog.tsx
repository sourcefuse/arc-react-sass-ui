import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { colors } from "Providers/theme/colors";

interface ConfirmDialogProps {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: "center", p: 3 }}>
        <IconButton
          sx={{
            backgroundColor: colors.surfaceLight,
            color: colors.DialogActionButton,
            mb: 1.5,
            "&:hover": { backgroundColor: colors.surfaceLight },
          }}
          disableRipple
        >
          <InfoOutlinedIcon fontSize="large" />
        </IconButton>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.125rem", p: 0 }}>
          {title}
        </DialogTitle>
        <Typography sx={{ color: "gray", mt: 1 }}>{description}</Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: colors.DialogActionButton,
            color: colors.DialogActionButton,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onConfirm?.();
          }}
          variant="contained"
          sx={{
            backgroundColor: colors.DialogActionButton,
            "&:hover": { backgroundColor: colors.DialogActionButtonHover },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
