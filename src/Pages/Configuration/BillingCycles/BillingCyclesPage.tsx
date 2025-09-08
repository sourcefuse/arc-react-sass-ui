import { Box, Paper } from "@mui/material";
import PageHeader from "Components/PageHeader";
import Form from "Components/Forms/Form";
import BillingCyclesForm from "./BillingCyclesForm";
import RenderButton from "./BillingCyclesRenderButton";
import {
  useCreateBillingCyclesMutation,
  useGetBillingCyclesQuery,
  useUpdateBillingCyclesMutation,
} from "redux/app/tenantManagementApiSlice";
import {
  billingCycleValidationSchema,
  initialValues,
} from "./billingCycles.utils";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { clustersStyle } from "../Clusters/clusters.styles";

const BillingCyclesPage = () => {
  const {
    data: billingCycleData,
    isLoading: isBillingCycleLoading,
    refetch,
  } = useGetBillingCyclesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  const [createBillingCycle] = useCreateBillingCyclesMutation();
  const [updateBillingCycle] = useUpdateBillingCyclesMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    const { duration } = values;
    try {
      if (values.id) {
        await updateBillingCycle({
          ...values,
          duration: Number(duration),
          durationUnit: "MONTHLY",
        }).unwrap();
        enqueueSnackbar("Billing Cycle Updated Successfully", {
          variant: "success",
        });
      } else {
        const { id, ...createPayload } = values;
        await createBillingCycle({
          ...createPayload,
          duration: Number(duration),
          durationUnit: "MONTHLY",
        }).unwrap();
        enqueueSnackbar("Billing Cycle Created Successfully", {
          variant: "success",
        });
      }
      await refetch();
      resetForm();
    } catch {}
  };

  return (
    <Box sx={clustersStyle.mainContainer} data-testid="billing-cycles-page">
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={billingCycleValidationSchema}
      >
        <PageHeader pageName="Billing Cycles" />
        <Paper sx={clustersStyle.backgroundContainer}>
          <BillingCyclesForm
            billingCycleData={billingCycleData}
            isBillingCycleLoading={isBillingCycleLoading}
          />
          <RenderButton handleCancel={handleCancel} refetch={refetch} />
        </Paper>
      </Form>
    </Box>
  );
};

export default BillingCyclesPage;
