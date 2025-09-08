import { Box, Container, Paper, Stack } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import routes from "Components/Breadcrumb/routes";
import Form from "Components/Forms/Form";
import StepperTab from "Components/StepperTab/StepperTab";
import UploadDocuments from "Components/UploadDocument";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTiersQuery,
  useLazyGetTenantByIdQuery,
  useLazyGetTenantsQuery,
  useUpdateTenantByIdMutation,
} from "redux/app/tenantManagementApiSlice";
import {
  addTenantValidationSchema,
  countryCodes,
  FormAddTenant,
  PlanSelectedType,
  steps,
} from "../AddTenant/addTenantsUtils";
import ChoosePlan from "../AddTenant/PlanSection/ChoosePlan";
import RenderButton from "../AddTenant/RenderButton";
import BackdropLoader from "Components/BackdropLoader";
import { PlanType } from "redux/app/types";
import { MAX_FILE_SIZE, MAX_FILES } from "Helpers/utils";
import AddTenantDetails from "../AddTenant/AddTenantDetail";
import { IFile, TenantDataType } from "type/tenant.type";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "Constants/helper";
import useConfig from "Hooks/useConfig";
import { isEqual } from "underscore";

const useFileAndPlanManager = (tenantData: TenantDataType | undefined) => {
  const [files, setFiles] = useState<File[]>([]);
  const [cluster, setCluster] = useState("");
  const [overAllPlans, setOverAllPlans] = useState<PlanSelectedType[]>([]);
  const [customSelectedPlan, setCustomSelectedPlan] = useState<PlanType>();
  const [selectedFiles, setSelectedFiles] = useState<IFile[]>([]);

  // File handlers
  const onFileUpload = (uploadedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const onRemoveFile = (updatedFiles: File[]) => {
    setFiles(updatedFiles);
  };

  // Plan handlers
  const onChangeCluster = (clusterValue: string) => {
    setCluster(clusterValue);
  };

  const onHandlePlan = (plans: PlanSelectedType[]) => {
    setOverAllPlans(plans);
  };

  const onHandleCustomPlan = (plan?: PlanType) => {
    setCustomSelectedPlan(plan);
  };

  const resetState = () => {
    setFiles([]);
    setCluster("");
    setOverAllPlans([]);
    setCustomSelectedPlan(undefined);
  };

  // Initialize data from tenantData
  useEffect(() => {
    if (tenantData?.files) {
      setSelectedFiles(tenantData.files);
    }
  }, [tenantData?.files]);

  useEffect(() => {
    const subscription = tenantData?.subscriptions?.[0];
    if (subscription?.plan?.cluster?.clusterTypeId) {
      setCluster(subscription?.plan?.cluster?.clusterTypeId);
    }
    if (tenantData?.subscriptions?.length) {
      const customPlanSubscription = tenantData?.subscriptions?.find(
        (sub) => sub.plan.isCustomPlan
      );
      if (customPlanSubscription) {
        setCustomSelectedPlan({
          ...customPlanSubscription.plan,
          tagId: "customPlan",
        } as unknown as PlanType);
      }
      const plans = tenantData?.subscriptions?.map((sub) => ({
        tagId: sub.plan.isCustomPlan ? "customPlan" : sub.tagId,
        name: sub.plan?.name,
        planId: sub.planId,
        duration: sub.plan?.billingCycle?.cycleName,
        amount: sub?.plan?.amount,
        billingCycleId: sub?.plan?.billingCycleId,
      }));

      onHandlePlan(plans);
    }
  }, [tenantData]);

  return {
    files,
    cluster,
    overAllPlans,
    customSelectedPlan,
    selectedFiles,
    onFileUpload,
    onRemoveFile,
    onChangeCluster,
    onHandlePlan,
    onHandleCustomPlan,
    setSelectedFiles,
    resetState,
  };
};

const useEditFormHandler = ({
  files,
  resetState,
  selectedFiles,
  initialAddTenantValues,
  tenantId,
}: {
  resetState: () => void;
  files: File[];
  selectedFiles: IFile[];
  initialAddTenantValues: FormAddTenant;
  tenantId: string | undefined;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [updateTenant, { isLoading }] = useUpdateTenantByIdMutation();
  const [getTenants] = useLazyGetTenantsQuery();
  const navigate = useNavigate();

  const prepareFormData = (values: FormAddTenant): FormData => {
    const formData = new FormData();
    formData.append("tierId", values.tier.value);
    if (values.selectedPlans) {
      formData.append("selectedPlans", JSON.stringify(values.selectedPlans));
    }
    files.forEach((file) => {
      formData.append("selectedFiles", file);
    });
    formData.append("existingFiles", JSON.stringify(selectedFiles));
    formData.append("key", values.key);
    return formData;
  };

  const onNavigateToTenantList = () => {
    getTenants({ limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET });
    resetState();
    navigate("/tenants");
  };

  const handleFormSubmit = async (
    values: FormAddTenant,
    actions: { resetForm: (values: { values: FormAddTenant }) => void }
  ) => {
    const isPlansChanged = !isEqual(
      values.selectedPlans,
      initialAddTenantValues.selectedPlans
    );
    const isFilesAdded = files.length > 0;

    if (!isPlansChanged && !isFilesAdded) {
      enqueueSnackbar("No changes were made.", { variant: "info" });
      return;
    }

    try {
      const formData = prepareFormData(values);
      await updateTenant({ body: formData, id: tenantId as string }).unwrap();
      actions.resetForm({ values: initialAddTenantValues });
      enqueueSnackbar("Tenant updated successfully!", { variant: "success" });
      onNavigateToTenantList();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  return { handleFormSubmit, isLoading };
};

const EditTenantPage = () => {
  const params = useParams();
  const tenantId = params.id;
  const navigate = useNavigate();
  const defaultTierId = useConfig().config.defaultTierId;

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [nextButtonState, setNextButtonState] = useState(false);

  // API hooks
  const [getTenantById, { isFetching, data: tenantData }] =
    useLazyGetTenantByIdQuery();
  const initialAddTenantValues = useInitialFormValues({
    defaultTierId,
    tenantData,
  });

  const {
    files,
    cluster,
    overAllPlans,
    customSelectedPlan,
    selectedFiles,
    onFileUpload,
    onRemoveFile,
    onChangeCluster,
    onHandlePlan,
    onHandleCustomPlan,
    setSelectedFiles,
    resetState,
  } = useFileAndPlanManager(tenantData);

  const { handleFormSubmit, isLoading } = useEditFormHandler({
    resetState,
    files,
    selectedFiles,
    initialAddTenantValues,
    tenantId,
  });

  useEffect(() => {
    if (tenantId) getTenantById(tenantId);
  }, [getTenantById, tenantId]);

  // Navigation handlers
  const handleNext = () => setActiveStep((current) => current + 1);

  const handleBack = () => {
    setActiveStep((current) => {
      const newStep = current - 1;
      if (newStep === 1) setNextButtonState(false);
      if (newStep === 2 && overAllPlans.length) setNextButtonState(false);
      return newStep;
    });
  };

  const handleNextButton = useCallback((state: boolean) => {
    setNextButtonState(state);
  }, []);

  const stepComponents = {
    0: <AddTenantDetails isEdit={true} />,
    1: (
      <ChoosePlan
        handleNextButton={handleNextButton}
        onChangeCluster={onChangeCluster}
        cluster={cluster}
        overAllPlans={overAllPlans}
        onHandlePlan={onHandlePlan}
        customSelectedPlan={customSelectedPlan}
        onHandleCustomPlan={onHandleCustomPlan}
        isEdit={true}
      />
    ),
    2: (
      <UploadDocuments
        onUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
        files={files}
        dropzoneProps={{
          maxFiles: MAX_FILES,
          maxSize: MAX_FILE_SIZE,
          multiple: true,
        }}
        existingFiles={selectedFiles}
        onRemoveExistingFile={setSelectedFiles}
      />
    ),
  };

  const renderStepContent = (step: number) =>
    stepComponents[step as keyof typeof stepComponents] || null;

  const handleCancel = () => {
    // Navigate to /tenants page
    navigate("/tenants");
  };

  return (
    <Box sx={{ paddingInline: 2, borderRadius: 2 }} data-testid="AddTenantPage">
      <Stack spacing={2}>
        <Breadcrumb routes={routes} />
      </Stack>

      <Container sx={{ my: 4 }} maxWidth={activeStep === 1 ? "xl" : "lg"}>
        <Container maxWidth="md">
          <StepperTab
            sx={{ mb: 4 }}
            activeStep={activeStep}
            steps={steps}
          ></StepperTab>
        </Container>
        <Form
          initialValues={initialAddTenantValues}
          enableReinitialize
          validationSchema={addTenantValidationSchema}
          onSubmit={handleFormSubmit}
        >
          {isFetching ? (
            <BackdropLoader />
          ) : (
            <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
              {renderStepContent(activeStep)}
              <RenderButton
                handleBack={handleBack}
                handleNext={handleNext}
                handleCancel={handleCancel}
                activeStep={activeStep}
                nextButtonState={nextButtonState}
                isAddTenantLoader={isLoading}
                isFileUploaded={files.length > 0 || selectedFiles.length > 0}
                isEdit={true}
              />
            </Paper>
          )}
        </Form>
      </Container>
    </Box>
  );
};

export default EditTenantPage;

const useInitialFormValues = ({
  defaultTierId,
  tenantData,
}: {
  defaultTierId: string | undefined;
  tenantData: TenantDataType | undefined;
}) => {
  const { data } = useGetTiersQuery({ id: defaultTierId });

  return useMemo<FormAddTenant>(() => {
    const tier = data?.[0] ?? { label: "", value: "" };
    const primaryContact = tenantData?.contacts?.find(
      (contact) => contact.isPrimary
    );
    const countryCode = countryCodes.find(
      (country) => country.code === primaryContact?.countryCode
    );
    const subscriptions = tenantData?.subscriptions;
    return {
      firstName: primaryContact?.firstName ?? "",
      lastName: primaryContact?.lastName ?? "",
      company: tenantData?.tenantName ?? "",
      designation: primaryContact?.designation ?? "",
      email: primaryContact?.email ?? "",
      key: tenantData?.key ?? "",
      countryCode: countryCode ?? { code: "+91", label: "India" },
      mobileNumber: primaryContact?.phoneNumber ?? "",
      language: tenantData?.lang ?? "English",
      billingCycle: "Monthly",
      tier,
      clusterId: subscriptions?.[0]?.plan?.clusterId ?? "",
      selectedPlans:
        subscriptions?.map((sub) => ({
          tagId: sub.tagId,
          name: sub.plan.name,
          planId: sub.planId,
          duration: sub.plan.billingCycle.cycleName,
          amount: sub.plan.amount,
          billingCycleId: sub.plan.billingCycleId,
        })) ?? [],
      files: [],
    };
  }, [tenantData, data]);
};
