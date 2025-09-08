import Chip from "@mui/material/Chip";
import { SelectNode } from "Components/Input/Input";
import React from "react";

interface IStatusChipProps {
  label: string;
  color?: string;
  minWidth?: string;
  value?: string;
  handleClick?: (item: SelectNode) => void;
  isLowerCase?: boolean;
}

const StatusChip: React.FC<IStatusChipProps> = ({
  label,
  color,
  minWidth,
  value,
  handleClick,
  isLowerCase,
}) => {
  return (
    <Chip
      data-testid="status-chip"
      label={label}
      sx={{
        backgroundColor: `${color}`,
        color: "secondary.main",
        padding: 0,
        fontSize: "0.7rem",
        textTransform: !isLowerCase ? "uppercase" : "none",
        height: "1.2rem",
        borderRadius: "0.4rem",
        fontWeight: 450,
        minWidth,
        ".MuiChip-label": {
          display: "flex",
          alignItems: "center",
          marginTop: "0.063rem",
        },
      }}
      onClick={
        handleClick
          ? () => handleClick({ value: value || "", label })
          : undefined
      }
    />
  );
};

export default StatusChip;
