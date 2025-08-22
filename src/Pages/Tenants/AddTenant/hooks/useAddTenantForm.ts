import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  useCreateTenantMutation,
  useLazyGetLeadByIdQuery,
  useUpdateLeadAsClosedMutation,
  useGetTiersQuery,
} from "redux/app/tenantManagementApiSlice";
import {
  FormAddTenant,
  initialAddTenantValues,
  TenantCreationStepType,
} from "../addTenantsUtils";
import { getErrorMessage } from "Helpers/utils";
import useConfig from "Hooks/useConfig";
import { FormikValues } from "formik";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface FormActions {
  resetForm: (values: { values: FormAddTenant }) => void;
  setErrors: (errors: Partial<FormikValues>) => void;
}

interface UseAddTenantFormProps {
  files: File[];
  setDialogOpen: (open: boolean) => void;
  setActiveStep: (step: TenantCreationStepType) => void;
}

interface UseAddTenantFormReturn {
  initialValues: FormAddTenant;
  formSubmit: (values: FormAddTenant, actions: FormActions) => Promise<void>;
  isLoading: boolean;
  isFetching: boolean;
}

export const useAddTenantForm = ({
  files,
  setDialogOpen,
  setActiveStep,
}: UseAddTenantFormProps): UseAddTenantFormReturn => {
  const { id: leadId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const defaultTierId = useConfig().config.defaultTierId;

  const [createTenant, { isLoading }] = useCreateTenantMutation();
  const [updateLead] = useUpdateLeadAsClosedMutation();
  const [getLeadById, { data: leadData, isFetching }] =
    useLazyGetLeadByIdQuery();
  const { data, isError } = useGetTiersQuery(
    { id: defaultTierId },
    { refetchOnMountOrArgChange: true }
  );
  const [initialValues, setInitialValues] = useState<FormAddTenant>(
    initialAddTenantValues
  );

  useEffect(() => {
    const tier = data?.[0] ?? initialAddTenantValues.tier;
    setInitialValues((prev) => ({
      ...initialAddTenantValues,
      ...(leadData && { ...leadData }),
      tier,
    }));
  }, [data, leadData]);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Failed to get Tiers", { variant: "error" });
    }
  }, [isError, enqueueSnackbar]);

  useEffect(() => {
    if (leadId) getLeadById({ leadId });
  }, [getLeadById, leadId]);

  const formSubmit = async (
    values: FormAddTenant,
    actions: FormActions
  ): Promise<void> => {
    const formData = createFormData(values, files);

    try {
      await createTenant(formData).unwrap();
      if (leadData && leadId) {
        await updateLead({ leadId });
      }
      actions.resetForm({ values: initialValues });
      setDialogOpen(true);
    } catch (error) {
      handleFormError(error, actions, setActiveStep);
    }
  };

  return {
    initialValues,
    formSubmit,
    isLoading,
    isFetching,
  };
};

const createFormData = (values: FormAddTenant, files: File[]): FormData => {
  const formData = new FormData();
  formData.append("name", values.company);
  formData.append("lang", values.language);
  formData.append("tierId", values.tier.value);

  if (values.selectedPlans) {
    formData.append("selectedPlans", JSON.stringify(values.selectedPlans));
  }

  formData.append(
    "contact",
    JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      isPrimary: true,
      email: values.email,
      phoneNumber: values.mobileNumber,
      countryCode: values.countryCode.code,
      designation: values.designation,
    })
  );

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("key", values.key);
  return formData;
};

const handleFormError = (
  error: unknown,
  actions: FormActions,
  setActiveStep: (step: TenantCreationStepType) => void
): void => {
  const errorMessage = getErrorMessage(error as FetchBaseQueryError);
  if (errorMessage.includes("Subdomain")) {
    setActiveStep(0);
    actions.setErrors({ key: errorMessage });
  } else if (errorMessage.includes("email")) {
    setActiveStep(0);
    actions.setErrors({ email: errorMessage });
  } else if (errorMessage.includes("Duplicate feature")) {
    setActiveStep(1);
  }
};
