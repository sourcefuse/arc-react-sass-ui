// colors.ts
export const colors: { [key: string]: string } = {
  // Primary colors
  primary: "#ff0000",
  primary200: "#f15e5eff",
  primary100: "#f9b9b9ff",
  primary50: "#fce2e2ff",
  borderFileZone: "#CACACA",
  border: "#CBCBCB",
  primaryOpacity30: "#ff000030",
  // Secondary colorss
  secondary: "#5c0000",

  // Surface Colors
  surfaceLight: "#FFFFFF",
  surfaceDark: "#f4f2f2ff",

  // Background Colors
  backgroundLight: "#fcfafaff",
  backgroundDark: "#E2E2E2",
  backgroundLightSecondary: "#FBFBFB",
  backgroundDarkSecondary: "#f4f2f2ff",
  backgroundLightGrey: "#F8F8F8",

  // shadows
  shadow: "#443f3f0d",

  // Toast Status Colors
  success: "#00C851",
  successPale: "#ECF6F4",
  warning: "#FAC353",
  warningPale: "#FFF5E9",
  destructive: "#ED4337",
  destructivePale: "#FCEEED",
  inactiveGray: "#BFC1C2",
  default: "#404040",
  defaultPale: "#F2F3F4",

  toastCloseIcon: "#A7A9AC",

  // Status Colors
  // Tenant
  active: "#35D48430",
  pendingProvision: "#FF990030 ",
  provisioning: "#7B89E230",
  deProvisioning: "#7B89E830",
  inactive: "#FFD53830",
  provisioningFailed: "#ED433730",
  autoClosed: "#D2D2D230",

  // Payments
  paid: "#35D48430",
  pending: "#7B89E230",
  due: "#FAC35330",
  overdue: "#ED433730",
  defaultPayments: "#42508430",

  iconSideBar: "#8d4d4dff",
  iconDefault: "#B8B8B826",
  linkBreadcrumb: "#A2A2A2",
  inputLabel: "#b1afafff",
  inputField: "#211b1bff",

  // Stepper colors
  stepperLine: "#E9E9E9",
  stepperText: "#CACACA",
  stepperActiveText: "#5c0000ff",
  stepperCompletedText: "#ab8282ff",
  stepperIcon: "#C9C9C9",
  stepperCompletedIcon: "#d43535ff",

  // text colors
  columnHeaderText: "#A2A2A2",
  snackBarText: "#660f0fff",
  headerText: "#646464",

  // filter selection colors
  selectFilter: "#fa1010",
  filterText: "#532f2fff",
  filterBorder: "#ebe5e5ff",

  // Grid Background colors
  standard: "#fff2f2ff",
  plus: "#fff1f1ff",

  // Checkbox colors
  checkedRadioSelected: "#d52222ff",
  checkedRadio: "#EDEDED",

  // Switch BG colors
  switchBG: "#ff3333ff",
  switchBorder: "#E0E0E0",

  gray: "#7B7B7B",
  grayLight: "#D2D2D2",

  text: "#844242ff",

  // Plan
  planOne: "#fff5f5ff",
  planTwo: "#fff0f0ff",
  planThree: "#fffbe6",

  // Dashboard
  yellow: "#F6DF47",
  yellow40: "#F6DF4740",

  teal: "#5CC6D2",
  teal40: "#5CC6D240",
  DialogActionButton: "#ff0000ff",
  DialogActionButtonHover: "##005FCC",

  featuresChip: "#35D48460",
} as const;
