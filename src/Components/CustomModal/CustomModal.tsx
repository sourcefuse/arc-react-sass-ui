import { Box, Modal, ModalProps as MUIProps } from "@mui/material";
import { ReactElement } from "react";

interface IModalProps extends MUIProps {
  handleClose?: (event: React.SyntheticEvent) => void;
  modalWidth?: number | string;
  padding?: number;
  children: ReactElement;
}

const CustomModal: React.FC<IModalProps> = ({
  open,
  handleClose,
  modalWidth = 400,
  padding = 2,
  children,
  ...rest
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...rest}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: padding,
          width: modalWidth,
          maxWidth: "90%", // Ensure the modal doesn't overflow on small screens
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
