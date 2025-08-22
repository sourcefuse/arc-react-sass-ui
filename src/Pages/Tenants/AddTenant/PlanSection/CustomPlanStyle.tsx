const getBaseStyle = (options?: { focused?: boolean; value?: any }) => {
  const { focused, value } = options || {};
  return {
    alignItems: "center",
    transition: "top 0.2s, font-size 0.2s, left 0.2s",
    paddingLeft: "0.5rem",
    zIndex: 1,
    color: "primary.inputLabel",
    top: focused || value ? "0.5em" : "50%",
    transform: focused || value ? "none" : "translateY(-50%)",
    fontSize: focused || value ? "0.85rem" : "1rem",
  };
};

const labelStyle = (options?: { focused?: boolean; value?: any }) => {
  const { focused, value } = options || {};
  const baseStyle = getBaseStyle({ focused, value });
  return {
    ...baseStyle,
    display: "flex",
    left: "0.5rem",
  };
};

const BORDER_WIDTH = "0.0625rem !important";

const getBaseInputStyle = (options?: { isError?: boolean }) => {
  const { isError = false } = options || {};
  return {
    borderRadius: "10px",
    paddingBottom: "0.3rem",
    paddingLeft: "0.2rem",
    height: "3.5rem",
    color: "primary.inputField",
    "& .Mui-disabled": {
      color: "primary.inputField",
      opacity: 1, // Prevent default MUI opacity reduction
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: BORDER_WIDTH,
      borderColor: isError ? "error.main" : "primary.stepperText",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderWidth: BORDER_WIDTH,
      borderColor: isError ? "error.main" : "primary.stepperText",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: BORDER_WIDTH,
      borderColor: "primary.main",
    },
    legend: {
      display: "none",
    },
  };
};

const paper = {
  p: 3,
  mt: 2,
  borderRadius: 2,
  backgroundColor: "background.backgroundGrey",
};

const inputStyles = (options?: { isError?: boolean }) => {
  const { isError = false } = options || {};
  const baseStyle = getBaseInputStyle({ isError });
  return {
    ...baseStyle,
    paddingTop: "1.2rem",
    legend: {
      display: "none",
    },
  };
};

const chipList = { display: "inline", mr: "0.5rem" };

const typographyHeader = {
  fontWeight: 700,
  color: "customText.header",
};

const cardHeader = {
  color: "customText.column",
  fontWeight: 600,
};

export const typographyDetails = {
  color: "secondary.main",
  fontWeight: 500,
};

const planItem = {
  ...typographyDetails,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

export const CustomPlanStyle = {
  labelStyle,
  inputStyles,
  typographyHeader,
  cardHeader,
  typographyDetails,
  paper,
  planItem,
  chipList,
};
