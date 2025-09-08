import { Tooltip, Typography } from "@mui/material";
import StatusChip from "Components/StatusChip/StatusChip";
import { colors } from "Providers/theme/colors";

interface InfoItemProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}

export function DataItem({
  label,
  value,
  highlight = false,
  color = "black",
}: Readonly<InfoItemProps>) {
  return (
    <>
      <Typography
        sx={{
          color: colors.linkBreadcrumb,
          fontSize: "0.75rem",
          textAlign: "left",
        }}
      >
        {label}
      </Typography>

      <Tooltip
        title={value.toString()}
        placement="bottom"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: { offset: [0, -14] },
              },
            ],
          },
        }}
      >
        {highlight ? (
          <StatusChip label={`${value}`} color={color} />
        ) : (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              textAlign: "left",
              color: color || "black",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "100%",
              display: "block",
            }}
          >
            {value}
          </Typography>
        )}
      </Tooltip>
    </>
  );
}
