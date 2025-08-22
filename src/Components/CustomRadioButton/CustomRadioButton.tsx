import CheckIcon from "@mui/icons-material/Check";
import { Box } from "@mui/material";
import React from "react";
import { CustomRadioButtonStyle } from "./CustomRadioButtonStyle";

interface CustomRadioButtonProps {
  checked: boolean;
  onChange: () => void;
  size?: number | { xs?: number; sm?: number; md?: number }; // Allow custom size
  checkedColor?: string; // Custom color when checked
  uncheckedColor?: string; // Custom color when unchecked
  iconSize?: number; // Custom size for the check icon
  className?: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  checked,
  onChange,
  size = { xs: 18, sm: 18, md: 24 }, // Default size
  checkedColor = "primary.checkedRadioSelected", // Default checked color
  uncheckedColor = "primary.checkedRadio", // Default unchecked color
  iconSize = 16, // Default icon size
  className,
}) => {
  // Handle size prop (can be a number or an object with breakpoints)
  const getSize = (breakpoint?: string) =>
    typeof size === "number"
      ? size
      : size[breakpoint as keyof typeof size] ?? size.xs;

  return (
    <Box
      data-testid="custom-radio"
      data-checked={checked}
      onClick={onChange}
      className={className}
      sx={CustomRadioButtonStyle.radioStyle({
        getSize,
        checked,
        checkedColor,
        uncheckedColor,
      })}
    >
      {checked && <CheckIcon sx={CustomRadioButtonStyle.checkIcon(iconSize)} />}
    </Box>
  );
};

export default CustomRadioButton;
