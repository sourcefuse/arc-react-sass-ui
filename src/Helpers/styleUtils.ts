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

const labelStyleAdornment = (options?: { focused?: boolean; value?: any }) => {
  const { focused, value } = options || {};
  const baseStyle = getBaseStyle({ focused, value });
  return {
    ...baseStyle,
    display: focused || value ? "none" : "flex",
    left: "5.5rem",
  };
};

const BORDER_WIDTH = "1px !important";

const getBaseInputStyle = (options?: { isError?: boolean }) => {
  const { isError = false } = options || {};
  return {
    borderRadius: "10px",
    paddingBottom: "0.3rem",
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

const inputAdornment = {
  maxHeight: "100%", // Ensures full height
  height: "100%",
  display: "flex",
  alignItems: "center",
  borderRight: "1px solid #ccc",
  paddingRight: "4px",
  paddingLeft: "3px",
};

const selectBox = {
  minWidth: "4em",
  height: "100%", // Match height of TextField
  display: "flex",
  alignItems: "center",
  paddingLeft: "0.5em",
};

export const StyleUtils = {
  labelStyle,
  labelStyleAdornment,
  getBaseInputStyle,
  inputStyles,
  inputAdornment,
  selectBox,
};
