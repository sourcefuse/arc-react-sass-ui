export const StepperTabStyles = {
  stepper: {
    "& .MuiStepConnector-line": {
      borderColor: "primary.stepperLine",
      borderWidth: "0.2rem",
      top: "50%",
    },
    "& .MuiStepIcon-root": {
      width: "1.75rem",
      height: "1.75rem", // Increase the height of the circle
      borderRadius: "50%",
      color: "primary.stepperIcon",
      // fill: 'primary.stepperIcon',
      "&.Mui-active": {
        color: "primary.main",
        fill: "primary.main",
      },
      "&.Mui-completed": {
        color: "primary.stepperCompletedIcon",
        fill: "primary.stepperCompletedIcon",
      },
    },
    "& .MuiStepIcon-text": {
      fontSize: "14px",
      color: "primary.stepperIcon",
    },
    "& .MuiStepLabel-label": {
      color: "primary.stepperText",
      fontSize: "15px",
      "&.Mui-active": {
        color: "primary.stepperActiveText", // Active step text color
      },
      "&.Mui-completed": {
        color: "primary.stepperCompletedText", // Completed step text color
      },
    },
  },
};
