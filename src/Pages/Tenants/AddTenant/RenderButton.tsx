import { Grid } from "@mui/material";
import Button from "Components/Button";
import { FormikValues, useFormikContext } from "formik";
import { steps } from "./addTenantsUtils";

interface ButtonRenderProps {
  handleBack: () => void;
  handleNext: () => void;
  handleCancel: () => void;
  activeStep: number;
  nextButtonState?: boolean;
  isAddTenantLoader?: boolean;
  isFileUploaded?: boolean;
  isEdit?: boolean;
}

const RenderButton: React.FC<ButtonRenderProps> = (props) => {
  const { isValid, dirty, handleSubmit } = useFormikContext<FormikValues>(); // Accessing Formik context
  const {
    handleBack,
    handleNext,
    handleCancel,
    activeStep,
    nextButtonState = false,
    isFileUploaded = false,
    isAddTenantLoader = false,
    isEdit = false,
  } = props;
  const shouldDisableNext = isEdit
    ? nextButtonState
    : !dirty || !isValid || nextButtonState;
  return (
    <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
      <Grid item>
        <Button
          data-testid="cancel-button"
          variant="outlined"
          name="cancel"
          onClick={handleCancel}
          disabled={isAddTenantLoader}
          sx={{ width: "130px", height: "50px" }}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item sx={{ flexGrow: 1, textAlign: "right" }}>
        {activeStep !== 0 && (
          <Button
            data-testid="back-button"
            variant="outlined"
            onClick={handleBack}
            disabled={isAddTenantLoader}
            sx={{ width: "130px", height: "50px", mr: 2 }}
          >
            Back
          </Button>
        )}
        {activeStep !== steps.length - 1 && (
          <Button
            data-testid="next-button"
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ width: "130px", height: "50px" }}
            disabled={shouldDisableNext} // Uncomment to disable button based on form validity
          >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            data-testid="submit-button"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            isLoading={isAddTenantLoader}
            sx={{ width: "130px", height: "50px" }}
            disabled={!isFileUploaded}
          >
            {isEdit ? "Update Tenant" : "Add Tenant"}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default RenderButton;
