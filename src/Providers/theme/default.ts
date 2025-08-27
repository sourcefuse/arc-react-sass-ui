import { ThemeOptions } from "@mui/material";
import { colors } from "./colors";

export const paletteConfig = {
  light: {
    background: {
      paper: colors.surfaceLight,
      default: colors.backgroundLight,
      secondary: colors.backgroundLightSecondary,
      secondaryDark: colors.backgroundDarkSecondary,
      backgroundGrey: colors.backgroundLightGrey,
    },
    primary: {
      main: colors.primary,
      p200: colors.primary200,
      p100: colors.primary100,
      p50: colors.primary50,
      border: colors.border,
      iconDefault: colors.iconDefault,
      inputLabel: colors.inputLabel,
      inputField: colors.inputField,
      stepperLine: colors.stepperLine,
      stepperText: colors.stepperText,
      stepperActiveText: colors.stepperActiveText,
      stepperCompletedText: colors.stepperCompletedText,
      stepperCompletedIcon: colors.stepperCompletedIcon,
      stepperIcon: colors.stepperIcon,
      gridBackground: colors.standard,
      checkedRadioSelected: colors.checkedRadioSelected,
      checkedRadio: colors.checkedRadio,
      switchBG: colors.switchBG,
      switchBorder: colors.switchBorder,
    },
    secondary: {
      main: colors.secondary,
      icon: colors.iconSideBar,
      linkBreadcrumb: colors.linkBreadcrumb,
      border: colors.borderFileZone,
      gridBackground: colors.plus,
    },
    status: {
      success: colors.success,
      successPale: colors.successPale,
      warning: colors.warning,
      warningPale: colors.warningPale,
      destructive: colors.destructive,
      destructivePale: colors.destructivePale,
      inactiveGray: colors.inactiveGray,
      default: colors.default,
      defaultPale: colors.defaultPale,
    },
    error: {
      main: colors.destructive,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    customText: {
      column: colors.columnHeaderText,
      header: colors.headerText,
    },
  },
  dark: {
    background: {
      paper: colors.surfaceDark,
      default: colors.backgroundDark,
    },
  },
};

export const commonConfig: ThemeOptions = {
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "3.125rem",
          textTransform: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiDrawer-paper": {
            margin: "1%",
            top: "10%",
            borderRadius: "0.625rem",
            height: "85%",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: `0 0 0 0.063rem ${colors.shadow}, 0 0.063rem 0.188rem ${colors.shadow}`,
        },
      },
    },
  },
};
