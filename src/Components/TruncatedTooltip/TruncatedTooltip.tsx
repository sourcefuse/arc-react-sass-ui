import React from "react";
import { Tooltip } from "@mui/material";

interface TruncatedTooltipTextProps {
  text?: string;
  maxWidth?: number;
  children?: React.ReactNode;
}

export const TruncatedTooltipText: React.FC<TruncatedTooltipTextProps> = ({
  text,
  maxWidth = 16,
  children,
}) => {
  return (
    <Tooltip
      title={text || children}
      placement="bottom"
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, -14] },
          },
        ],
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          maxWidth: `${maxWidth}rem`,
        }}
      >
        {children ?? text}
      </span>
    </Tooltip>
  );
};
