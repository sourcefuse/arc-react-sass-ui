import Box from "@mui/material/Box";
import { settingsStyle } from "./settings.style";
import PageHeader from "Components/PageHeader";
import SettingsForm from "./SettingsForm";
import Form from "Components/Forms/Form";
import { Paper } from "@mui/material";
import {
  IFormAdminSettings,
  initialSettingValues,
  settingsValidationSchema,
  useConfigAndDomain,
} from "./settings.utils";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "redux/app/adminSettingsApiSlice";
import { useEffect, useMemo, useState } from "react";
import { FormikHelpers } from "formik";
import BackdropLoader from "Components/BackdropLoader";
import { useSnackbar } from "notistack";

const SettingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: adminSettings,
    isFetching,
    refetch,
  } = useGetAdminSettingsQuery();

  const [updateAdminSettings, { isLoading }] = useUpdateAdminSettingsMutation();

  const [initialValues, setInitialValues] =
    useState<IFormAdminSettings>(initialSettingValues);

  const { config, domain } = useConfigAndDomain();

  const validationSchema = useMemo(() => {
    if (!config || !domain) return null;
    return settingsValidationSchema(config, domain);
  }, [config, domain]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setInitialValues(adminSettings ?? initialSettingValues);
  }, [adminSettings]);

  const formSubmit = async (
    values: IFormAdminSettings,
    actions: FormikHelpers<IFormAdminSettings>
  ) => {
    try {
      await updateAdminSettings({
        id: values.id,
        settings: { ...values, leadAutoClose: Number(values.leadAutoClose) },
      }).unwrap();
      await refetch();
      actions.resetForm({ values: adminSettings });
      enqueueSnackbar("Settings updated Successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update settings", { variant: "error" });
    }
  };

  if (isFetching || !validationSchema) return <BackdropLoader />;

  return (
    <Box sx={settingsStyle.mainContainer}>
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={formSubmit}
        enableReinitialize
      >
        <PageHeader pageName="Settings" />
        <Paper sx={settingsStyle.backgroundContainer}>
          <SettingsForm isSubmitting={isLoading} />
        </Paper>
      </Form>
    </Box>
  );
};

export default SettingsPage;
