const dialog = {
  "& .MuiDialog-paper": {
    borderRadius: "1rem",
  },
  my: 2,
};

const dialogContent = {
  textAlign: "center",
  p: 4,
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const circleIcon = {
  fontSize: "4.375rem",
  mb: 1,
  color: "primary.stepperCompletedIcon",
};

const outerTypography = {
  color: "secondary.main",
  fontWeight: "700",
  fontSize: "1.375rem",
};

const typography = {
  mt: 1,
  whiteSpace: "normal",
  maxWidth: "80%",
  wordBreak: "break-word",
  color: "primary.stepperCompletedText",
  fontSize: "1.125rem",
};

const box = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  textAlign: "center",
};

const stack = { mt: 5, alignItems: "center", width: "100%" };

const primaryColor = "primary.main";

const createTenantButton = {
  width: "60%",
  fontWeight: 700,
  height: "3.75rem",
  fill: primaryColor,
};

const tenantButton = {
  width: "60%",
  fontWeight: 700,
  height: "3.75rem",
  borderColor: primaryColor,
};

const dashboardButton = {
  color: primaryColor,
  fontWeight: 700,
  textTransform: "none",
};
export const SuccessDialogStyle = {
  dialog,
  dialogContent,
  circleIcon,
  outerTypography,
  box,
  typography,
  stack,
  createTenantButton,
  tenantButton,
  dashboardButton,
};
