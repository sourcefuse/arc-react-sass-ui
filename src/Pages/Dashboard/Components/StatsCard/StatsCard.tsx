import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { ReactElement } from "react";
import { statsCardStyles } from "./styles";

interface IStatsCardProps {
  dataValue: string;
  dataLabel: string;
  icon: ReactElement;
  iconBgColor: string;
  handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  isLoading?: boolean;
}
const StatsCard: React.FC<IStatsCardProps> = ({
  dataValue,
  dataLabel,
  icon,
  iconBgColor,
  handleClick,
  isLoading = false,
}) => {
  return (
    <Box sx={statsCardStyles.mainContainer} onClick={handleClick}>
      <Stack sx={statsCardStyles.dataTextContainer}>
        {isLoading ? (
          <Skeleton
            variant="rounded"
            width={60}
            height={40}
            data-testid="loader"
          />
        ) : (
          <Typography sx={statsCardStyles.dataText}>{dataValue}</Typography>
        )}

        <Typography sx={statsCardStyles.dataLabelText}>{dataLabel}</Typography>
      </Stack>
      <Stack sx={statsCardStyles.iconContainer(iconBgColor)}>{icon}</Stack>
    </Box>
  );
};

export default StatsCard;
