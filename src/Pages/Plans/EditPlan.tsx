import { Box, Container, Paper } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import Form from "Components/Forms/Form";
import { RouteConstant } from "Constants/routeConstant";
import RenderButton from "Pages/Configuration/PlanItems/RenderButton";
import CreatePlanForm from "./CreatePlanForm";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import {
  editPlanRoutes,
  initialValues,
  planValidationSchema,
  transformToUpdatePlanFormValues,
  UpdatePlanFormValues,
  getPlansByIdFilter,
} from "./utils";
import {
  useLazyGetPlanByIdQuery,
  useUpdatePlanAsCustomMutation,
} from "redux/app/plansApiSlice";
import { useEffect, useMemo } from "react";
import EditPlanPageLoader from "./EditPlanPageLoader";

const EditPlan = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const params = useParams();
  const planId = params.id!;
  const [getPlan, { data: planData, isLoading, isFetching }] =
    useLazyGetPlanByIdQuery();
  const [updatePlan] = useUpdatePlanAsCustomMutation();

  const initPlanValues = useMemo(() => {
    if (!planData) return initialValues;
    return transformToUpdatePlanFormValues(planData);
  }, [planData]);

  const formSubmit = async (values: UpdatePlanFormValues, helpers: any) => {
    try {
      await updatePlan({ id: values.id }).unwrap();
      helpers.resetForm({ values: initialValues });
      enqueueSnackbar("Plan Updated Successfully", { variant: "success" });
      navigate(RouteConstant.CONFIGURATION_PLANS);
    } catch (error) {}
  };

  const handleCancel = () => {
    navigate(RouteConstant.CONFIGURATION_PLANS);
  };
  useEffect(() => {
    getPlan({ id: planId, filter: getPlansByIdFilter });
  }, [getPlan, planId]);

  if (isLoading || isFetching) {
    return <EditPlanPageLoader />;
  }
  return (
    <Box mx={2} data-testid="edit-plan">
      <Breadcrumb routes={editPlanRoutes} />
      <Container sx={{ my: 4 }} maxWidth={"md"}>
        <Form
          initialValues={initPlanValues}
          validationSchema={planValidationSchema}
          onSubmit={formSubmit}
          enableReinitialize
        >
          <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
            <CreatePlanForm isEdit={true} />
            <RenderButton handleCancel={handleCancel} />
          </Paper>
        </Form>
      </Container>
    </Box>
  );
};

export default EditPlan;
