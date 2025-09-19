import { Button, CircularProgress, styled } from "@mui/material";
import { colors } from "Providers/theme/colors";

export const AuthButton = styled(Button)<{ isLoading?: boolean }>(
  ({ theme }) => ({
    width: "80%",
    padding: "1rem 2rem",
    borderRadius: "3.125rem",
    fontSize: "1.125rem",
    fontWeight: 600,
    textTransform: "none",
    backgroundColor: colors.primary,
    color: colors.surfaceLight,
    transition: "all 200ms ease-in-out",
    position: "relative",
    "&:hover": {
      backgroundColor: colors.primary200,
      transform: "scale(1.02)",
      boxShadow: theme.shadows[8],
    },
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 0.25rem ${colors.primaryOpacity30}`,
    },
    "&:disabled": {
      opacity: 0.75,
      cursor: "not-allowed",
      backgroundColor: colors.primary,
    },

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
    },
  })
);

export const LoadingSpinner = styled(CircularProgress)({
  color: colors.surfaceLight,
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: "-0.75rem",
  marginLeft: "-0.75rem",
});
