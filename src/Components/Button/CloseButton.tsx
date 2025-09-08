import { ButtonProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "Assets/close-icon.png";
import React from "react";

interface CloseBtnProps extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export const CloseButton: React.FC<CloseBtnProps> = ({ onClick, ...rest }) => {
  return (
    <IconButton
      edge="end"
      color="inherit"
      onClick={onClick}
      disableTouchRipple
      {...rest}
      data-testid="close-btn"
    >
      <img src={CloseIcon} alt="X" />
    </IconButton>
  );
};
