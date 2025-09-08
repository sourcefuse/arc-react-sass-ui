import { Box, Container, Paper, Stack } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import routes from "Components/Breadcrumb/routes";
import Form from "Components/Forms/Form";
import StepperTab from "Components/StepperTab/StepperTab";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BackdropLoader from "Components/BackdropLoader";
import { useAddTenantState } from "./hooks/useAddTenantState";
import { useAddTenantForm } from "./hooks/useAddTenantForm";
import { useAddTenantSteps } from "./hooks/useAddTenantSteps";
import { addTenantValidationSchema, steps } from "./addTenantsUtils";
import SuccessDialog from "./PlanSection/SuccessDialog";
import RenderButton from "./RenderButton";

const AddTenantPage = () => {
  const navigate = useNavigate();

  const {
    activeStep,
    handleNext,
    handleBack,
    handleNextButton,
    files,
    cluster,
    overAllPlans,
    customSelectedPlan,
    isDialogOpen,
    setFiles,
    setCluster,
    setOverAllPlans,
    setCustomSelectedPlan,
    onNavigateToTenant,
    setIsDialogOpen,
    setActiveStep,
    nextButtonState,
  } = useAddTenantState();

  const { initialValues, formSubmit, isLoading, isFetching } = useAddTenantForm(
    {
      files,
      setDialogOpen: setIsDialogOpen,
      setActiveStep,
    }
  );

  const { renderStepContent } = useAddTenantSteps({
    handleNextButton,
    onChangeCluster: setCluster,
    cluster,
    overAllPlans,
    onHandlePlan: setOverAllPlans,
    customSelectedPlan,
    onHandleCustomPlan: setCustomSelectedPlan,
    files,
    onFileUpload: (uploadedFiles: File[]) =>
      setFiles([...files, ...uploadedFiles]),
    onRemoveFile: setFiles,
  });

  const handleCancel = useCallback(() => {
    navigate("/tenants");
  }, [navigate]);

  return (
    <Box sx={{ paddingInline: 2, borderRadius: 2 }} data-testid="AddTenantPage">
      <Stack spacing={2}>
        <Breadcrumb routes={routes} />
      </Stack>
      <Container sx={{ my: 4 }} maxWidth={activeStep === 1 ? "xl" : "lg"}>
        <Container maxWidth="md">
          <StepperTab sx={{ mb: 4 }} activeStep={activeStep} steps={steps} />
        </Container>
        <Form
          initialValues={initialValues}
          enableReinitialize
          validationSchema={addTenantValidationSchema}
          onSubmit={formSubmit}
        >
          {isFetching || isLoading ? <BackdropLoader /> : null}
          <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
            {renderStepContent(activeStep)}
            <SuccessDialog
              isDialogOpen={isDialogOpen}
              onNavigateToTenant={onNavigateToTenant}
            />
            <RenderButton
              handleBack={handleBack}
              handleNext={handleNext}
              handleCancel={handleCancel}
              activeStep={activeStep}
              nextButtonState={nextButtonState}
              isAddTenantLoader={isLoading}
              isFileUploaded={files.length > 0}
            />
          </Paper>
        </Form>
      </Container>
    </Box>
  );
};

export default AddTenantPage;
