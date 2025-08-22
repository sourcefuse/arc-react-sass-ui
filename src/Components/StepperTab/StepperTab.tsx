import { Step, StepLabel, Stepper, StepperProps } from "@mui/material";
import React, { memo } from "react";
import { StepperTabStyles } from "./StepperTabStyles";

export interface StepperTabProps {
  activeStep: number;
  steps: Array<string>;
  orientation?: StepperProps["orientation"];
  sx?: object; // Support for external styling
}

const StepperTab: React.FC<StepperTabProps> = ({
  steps = [],
  activeStep,
  sx,
}) => {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        ...StepperTabStyles.stepper,
        ...sx, // Merge additional styles passed via the `sx` prop
      }}
      alternativeLabel
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default memo(StepperTab);
