import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";

import {
  closeSnackbar,
  MaterialDesignContent,
  SnackbarProvider,
} from "notistack";
import { CloseButton } from "../Components/Button";
import { colors } from "./theme/colors";

const TIME_DELAY = 3500;
const commonStyles = {
  root: {
    borderRadius: "3.75rem",
    backgroundColor: colors.primary50,
    boxShadow: "none",
    color: colors.snackBarText,
    fontSize: "0.75rem",
    fontWeight: 400,
  },
  icon: {
    width: "1.25rem !important",
    height: "1.25rem !important",
  },
};
const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-default": {
    ...commonStyles.root,
    paddingInline: "3rem",
  },
  "&.notistack-MuiContent-success": {
    ...commonStyles.root,
    flexWrap: "nowrap !important",
    svg: {
      ...commonStyles.icon,
      color: colors.success,
    },
  },
  "&.notistack-MuiContent-error": {
    ...commonStyles.root,
    flexWrap: "nowrap !important",
    svg: {
      ...commonStyles.icon,
      color: colors.destructive,
    },
  },
  "&.notistack-MuiContent-warning": {
    ...commonStyles.root,
    svg: {
      ...commonStyles.icon,
      color: colors.warning,
    },
  },
  "&.notistack-MuiContent-info": {
    ...commonStyles.root,
    svg: {
      ...commonStyles.icon,
      color: colors.inactiveGray,
    },
  },
}));
const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <SnackbarProvider
      TransitionComponent={Slide}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      autoHideDuration={TIME_DELAY}
      Components={{
        default: StyledMaterialDesignContent,
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
      action={(snackbarId) => (
        <CloseButton
          onClick={() => closeSnackbar(snackbarId)}
          sx={{ paddingInline: 4 }}
          disableRipple
        />
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
