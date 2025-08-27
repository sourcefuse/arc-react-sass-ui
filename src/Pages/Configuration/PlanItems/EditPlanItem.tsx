import { Box, Container, Paper } from "@mui/material";
import Breadcrumb from "Components/Breadcrumb/Breadcrumb";
import Form from "Components/Forms/Form";
import { RouteConstant } from "Constants/routeConstant";
import React, { useMemo } from "react";
import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import RenderButton from "./RenderButton";
import PlanItemForm from "./PlanItemForm";
import { apiSlice } from "redux/apiSlice";
import {
  planItemByIdProvisionTag,
  useGetPlanItemByIdQuery,
  useUpdatePlanItemMutation,
} from "redux/app/planItemsApiSlice";

import { FormikHelpers } from "formik";
import { PlanItemFormValues } from "./types";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import {
  createPlanItemValidationSchema,
  initialCreatePlanItemValues,
} from "./utils";
import EditPlanItemLoader from "./EditPlanItemLoader";
import { store } from "redux/store";

const routes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: null },
  { path: RouteConstant.CONFIGURATION_PLAN_ITEMS, breadcrumb: "Plan Items" },
  {
    path: RouteConstant.CONFIGURATION_PLAN_ITEMS_EDIT,
    breadcrumb: "Edit Plan Items",
  },
];

const EditPlanItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const params = useParams();
  const planItemId = params.id!;

  const {
    data: planItemNode,
    isLoading,
    isFetching,
  } = useGetPlanItemByIdQuery(planItemId);
  const [updatePlanItemById] = useUpdatePlanItemMutation();

  const initPlanValues = useMemo(() => {
    if (!planItemNode) return initialCreatePlanItemValues;
    const features = Array.from(
      planItemNode.planValue.reduce((acc, node) => {
        acc.add(node.featureName);
        return acc;
      }, new Set<string>()) ?? []
    );

    return {
      planName: planItemNode.name,
      description: planItemNode.description,
      features,
    };
  }, [planItemNode]);

  const formSubmit = async (
    values: PlanItemFormValues,
    helpers: FormikHelpers<PlanItemFormValues>
  ) => {
    const payload = {
      name: values.planName,
      description: values.description,
      planValue: { features: values.features ?? [] },
      planItemType: 0,
      id: planItemId,
    };

    try {
      await updatePlanItemById(payload).unwrap();
      helpers.resetForm({ values: initialCreatePlanItemValues });
      enqueueSnackbar("Plan Item Updated Successfully", { variant: "success" });

      navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS);

      // invalidating data with a timeout so the next api call don't happen immediately
      setTimeout(
        () =>
          store.dispatch(
            apiSlice.util.invalidateTags(planItemByIdProvisionTag(planItemId))
          ),
        2000
      );
    } catch (error) {}
  };

  const handleCancel = () => {
    navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS);
  };

  if (isLoading || isFetching) {
    return <EditPlanItemLoader />;
  }

  return (
    <Box mx={2}>
      <Breadcrumb routes={routes} />

      <Container sx={{ my: 4 }} maxWidth={"md"}>
        <Form
          initialValues={initPlanValues}
          validationSchema={createPlanItemValidationSchema}
          onSubmit={formSubmit}
          enableReinitialize
        >
          <Paper elevation={6} sx={{ mb: 2, borderRadius: 4, p: 3 }}>
            <PlanItemForm />
            <RenderButton handleCancel={handleCancel} />
          </Paper>
        </Form>
      </Container>
    </Box>
  );
};

export default EditPlanItem;
