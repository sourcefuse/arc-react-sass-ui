import Chip from "@mui/material/Chip";
import { colors } from "Providers/theme/colors";
import type { IAutoCompleteOptions } from "./AutoCompleteInput";
import { AutocompleteRenderGetTagProps } from "@mui/material";

const chipStyles = (isNewValue: boolean) => ({
  backgroundColor: `${colors.primaryOpacity30}`,
  color: "secondary.main",
  fontWeight: 450,
  textTransform: "uppercase",
  height: "1.6rem",
  borderRadius: 2,
  "& .MuiChip-deleteIcon": {
    color: `${colors.destructive}`,
    height: "1rem",
    display: isNewValue ? "block" : "none",
  },
});
interface IAutoCompleteChipProps {
  option: IAutoCompleteOptions;
  getTagProps: AutocompleteRenderGetTagProps;
  index: number;
}

export const AutoCompleteChip: React.FC<IAutoCompleteChipProps> = ({
  option,
  getTagProps,
  index,
}) => {
  const isNewValue = option.value === option.label;
  return (
    <Chip
      data-testid="autocomplete-chip"
      {...getTagProps({ index })}
      label={option.label}
      sx={chipStyles(isNewValue)}
    />
  );
};
