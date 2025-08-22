import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StatusChip from "Components/StatusChip/StatusChip";
import { statusChipViewStyle } from "./StatusChipSection.styles";
import { colors } from "Providers/theme/colors";
import { SelectNode } from "Components/Input/Input";

interface IStatusChipSectionProps {
  title: string;
  data?: string[];
  clickableChipData?: SelectNode[];
  handleOnClick?: (item: SelectNode) => void;
  chipColor?: string;
  isLowerCase?: boolean;
}
const StatusChipSection: React.FC<IStatusChipSectionProps> = ({
  title,
  data,
  clickableChipData,
  handleOnClick,
  chipColor = colors.primary100,
  isLowerCase,
}) => {
  return (
    <Stack sx={statusChipViewStyle.featuresContainer}>
      <Typography sx={statusChipViewStyle.featuresTitle}>{title}</Typography>
      <Stack sx={statusChipViewStyle.featuresChipContainer}>
        {data?.map((item) => (
          <StatusChip
            key={item}
            label={item}
            color={chipColor}
            isLowerCase={isLowerCase}
          />
        ))}
        {clickableChipData?.map((item) => (
          <StatusChip
            key={item.value}
            label={item.label}
            value={item.value}
            color={chipColor}
            handleClick={handleOnClick}
            isLowerCase={isLowerCase}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default StatusChipSection;
