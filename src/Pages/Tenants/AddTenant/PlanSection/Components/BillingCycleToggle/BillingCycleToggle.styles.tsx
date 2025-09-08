import { styled } from "@mui/material/styles";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { colors } from "../../../../../../Providers/theme/colors";

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(
  ({ theme }) => ({
    [`&.${toggleButtonGroupClasses.root}`]: {
      border: `solid ${colors.border} 0.081rem`,
      borderRadius: "5.75rem",
    },
    [`& .${toggleButtonGroupClasses.grouped}`]: {
      margin: theme.spacing(0.5),
      border: "0",
      borderRadius: "5.75rem",
      color: theme.palette.secondary.main,
      textTransform: "none",
      fontWeight: 400,
      fontSize: "0.875rem",
      width: "5rem",
      height: "2rem",
      "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
      },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
      {
        marginLeft: -1,
        borderLeft: "0.125rem solid transparent",
      },
  })
);
