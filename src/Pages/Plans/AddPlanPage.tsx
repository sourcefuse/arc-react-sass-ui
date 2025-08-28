import { Box, Container, Paper } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import Form from "Components/Forms/Form";
import { RouteConstant } from "Constants/routeConstant";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import RenderButton from "Pages/Configuration/PlanItems/RenderButton";
import CreatePlanForm from "./CreatePlanForm";
import {
  addPlanRoutes,
  CreatePlanFormValues,
  initialValues,
  planValidationSchema,
} from "./utils";
import { useCreatePlanMutation } from "redux/app/plansApiSlice";
import { useLazyGetCurrencyQuery } from "redux/app/currenciesApiSlice";
import { CurrencyCode } from "Helpers/utils";

const AddPlanPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [createPlan, { isLoading }] = useCreatePlanMutation();
  const [getCurrency] = useLazyGetCurrencyQuery();

  const formSubmit = async (values: CreatePlanFormValues, helpers: any) => {
    const currencyData = await getCurrency().unwrap();
    const usdCurrency = currencyData?.find(
      (curr) => curr.currencyCode === CurrencyCode.USD
    );

    const payload = {
      name: values.name.trim(),
      isCustomPlan: values.isCustomPlan === "true",
      billingCycleId: values.billingCycleId.toString(),
      amount: Number(values.amount),
      clusterId: values.clusterId.toString(),
      planItemIds: values.planItemIds.map(({ value }) => value),
      tierId: values.tierId.toString(),
      currencyId: usdCurrency ? usdCurrency.id : "",
      planTagIds: values.planTagIds,
    };
    try {
      await createPlan(payload).unwrap();
      helpers.resetForm({ values: initialValues });
      enqueueSnackbar("Plan Created Successfully", { variant: "success" });
      navigate(RouteConstant.CONFIGURATION_PLANS);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const handleCancel = () => {
    navigate(RouteConstant.CONFIGURATION_PLANS);
  };

  return (
    <Box mx={2} data-testid="add-plan">
      <Breadcrumb routes={addPlanRoutes} />
      <Container sx={{ my: 4 }} maxWidth={"md"}>
        <Form
          initialValues={initialValues}
          validationSchema={planValidationSchema}
          onSubmit={formSubmit}
        >
          <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
            <CreatePlanForm />
            <RenderButton
              handleCancel={handleCancel}
              showButtonLoader={isLoading}
            />
          </Paper>
        </Form>
      </Container>
    </Box>
  );
};

export default AddPlanPage;
