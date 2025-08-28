import { Box, Container, Paper } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import Form from "Components/Forms/Form";
import { RouteConstant } from "Constants/routeConstant";
import React from "react";
import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import RenderButton from "./RenderButton";
import PlanItemForm from "./PlanItemForm";
import { useCreatePlanItemsMutation } from "redux/app/planItemsApiSlice";
import { FormikHelpers } from "formik";
import { PlanItemFormValues } from "./types";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import {
  createPlanItemValidationSchema,
  initialCreatePlanItemValues,
} from "./utils";

const routes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: null },
  { path: RouteConstant.CONFIGURATION_PLAN_ITEMS, breadcrumb: "Plan Items" },
  {
    path: RouteConstant.CONFIGURATION_PLAN_ITEMS_CREATE,
    breadcrumb: "Add Plan Items",
  },
];

const CreatePlanItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [createPlanItem, { isLoading }] = useCreatePlanItemsMutation();

  const formSubmit = async (
    values: PlanItemFormValues,
    helpers: FormikHelpers<PlanItemFormValues>
  ) => {
    const payload = {
      name: values.planName.trim(),
      description: values.description,
      planValue: { features: values.features ?? [] },
      planItemType: 0,
    };

    try {
      await createPlanItem(payload).unwrap();
      helpers.resetForm({ values: initialCreatePlanItemValues });
      enqueueSnackbar("Plan Item Created Successfully", { variant: "success" });
      navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const handleCancel = () => {
    navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS);
  };

  return (
    <Box mx={2}>
      <Breadcrumb routes={routes} />

      <Container sx={{ my: 4 }} maxWidth={"md"}>
        <Form
          initialValues={initialCreatePlanItemValues}
          validationSchema={createPlanItemValidationSchema}
          onSubmit={formSubmit}
        >
          <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
            <PlanItemForm />
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

export default CreatePlanItem;
