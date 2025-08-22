const container = { py: 4 };

const girdContainer = { mb: 3, spacing: 2 };

const headerLeftBox = { display: "flex", flexWrap: "wrap", gap: 0.5 };

const headerLeftTypography = {
  ml: 1,
  fontWeight: 700,
  fontSize: { xs: "0.875rem", sm: "1rem" },
  color: "secondary.main",
  "& .MuiTypography-root": { fontWeight: 700 },
};

const headerLeftSelect = {
  color: "primary.inputLabel",
  "& .MuiSvgIcon-root": { fontSize: 28 },
  "&.Mui-checked": { color: "primary.main" },
};

const gridToggle = {
  display: "flex",
  justifyContent: { xs: "flex-start", sm: "flex-end" },
  alignItems: "center",
};

const boxToggle = { display: "flex", gap: 1, alignItems: "center" };

const loaderContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

const commonStyles = {
  borderLeft: "1px solid",
  borderBottom: "1px solid",
  borderColor: "divider",
};

const standardGrid = {
  bgcolor: "primary.gridBackground",
  ...commonStyles,
};

const plusGrid = {
  bgcolor: "secondary.gridBackground",
  ...commonStyles,
};

const overflow = {
  overflow: "hidden",
};

const typography = (billingCycle: string, type: "monthly" | "yearly") => {
  return {
    color:
      billingCycle === type ? "secondary.main" : "primary.stepperCompletedText",
    fontWeight: 700,
  };
};

const pointer = { cursor: "pointer" };

export const ChoosePlanStyle = {
  container,
  girdContainer,
  headerLeftBox,
  headerLeftTypography,
  gridToggle,
  boxToggle,
  standardGrid,
  plusGrid,
  typography,
  overflow,
  pointer,
  headerLeftSelect,
  loaderContainer,
};
