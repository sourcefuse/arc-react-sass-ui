import { Box, Grid, IconButton } from "@mui/material";
import { useFormikContext } from "formik";
import { StyleUtils } from "Helpers/styleUtils";
import FormCheckbox from "Components/Forms/FormCheckbox";
import FormInput from "Components/Forms/FormInput";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomModal from "Components/CustomModal";
import PlanItemsView from "./PlanItemsView";
import { FC, useEffect, useMemo, useState } from "react";
import {
  useGetBillingCyclesQuery,
  useGetTiersQuery,
  useGetClustersSelectQuery,
  useGetTagsQuery,
} from "redux/app/tenantManagementApiSlice";
import { CreatePlanFormValues, mapToLabelValue } from "./utils";
import useConfig from "Hooks/useConfig";
import EditPlanPageLoader from "./EditPlanPageLoader";

const filter = { limit: 10000, offset: 0 };
const CustomPlan = [{ label: "Custom Plan", value: "true" }];

const CreatePlanForm: FC<{ isEdit?: boolean }> = ({ isEdit }) => {
  const { values, handleBlur, setFieldValue } =
    useFormikContext<CreatePlanFormValues>();
  const { data: clusterData } = useGetClustersSelectQuery(filter);
  const defaultTierId = useConfig().config.defaultTierId;
  const { data: tierData, isLoading: isTierLoading } = useGetTiersQuery(
    { limit: 10, offset: 0, id: defaultTierId },
    { refetchOnMountOrArgChange: true }
  );
  const { data: billingData, isLoading: isBillingLoading } =
    useGetBillingCyclesQuery(filter);
  const { data: tagsData, isLoading: isTagsLoading } = useGetTagsQuery(filter);

  const subScriptionList = useMemo(
    () => mapToLabelValue(billingData, "cycleName", "id"),
    [billingData]
  );
  const tags = useMemo(
    () => mapToLabelValue(tagsData, "name", "id"),
    [tagsData]
  );

  const [isPlanItemOpen, setIsPlanItemOpen] = useState(false);
  const [existingPlanItems, setExistingPlanItems] = useState(
    values.planItemIds ?? []
  );

  const togglePlanItem = () => {
    setIsPlanItemOpen(!isPlanItemOpen);
  };

  const handleCloseBtn = () => {
    setFieldValue("planItemIds", existingPlanItems);
    setIsPlanItemOpen(false);
  };
  const handleSaveCloseBtn = () => {
    setExistingPlanItems(values.planItemIds);
    setIsPlanItemOpen(false);
  };

  // Remove this when multiple tiers are needed
  useEffect(() => {
    if (tierData?.length) setFieldValue("tierId", tierData?.[0]?.value);
  }, [setFieldValue, tierData, values]);

  if (isTierLoading || isBillingLoading || isTagsLoading) {
    return <EditPlanPageLoader />;
  }
  return (
    <>
      <Grid container spacing={4} rowSpacing={4}>
        <Grid item xs={12} sm={6}>
          <FormInput
            fullWidth
            id="name"
            name="name"
            label="Plan Name"
            required={true}
            onBlur={handleBlur}
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            readOnly={isEdit}
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ display: "flex", gap: 1 }}>
          <FormInput
            fullWidth
            id="billingCycleId"
            name="billingCycleId"
            label="Subscription Type"
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            MenuProps={{ sx: { height: "21.875rem" } }}
            required={true}
            onBlur={handleBlur}
            selectOptions={subScriptionList}
            renderSelect
            inputProps={{ "aria-label": "Subscription Type" }}
            readOnly={isEdit}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormInput
            fullWidth
            id="clusterId"
            name="clusterId"
            label="Cluster"
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            MenuProps={{ sx: { height: "21.875rem" } }}
            required={true}
            onBlur={handleBlur}
            selectOptions={clusterData ?? []}
            renderSelect
            inputProps={{ "aria-label": "Cluster" }}
            readOnly={isEdit}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FormInput
            id="amount"
            name="amount"
            label="Price"
            onBlur={handleBlur}
            required={true}
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            readOnly={isEdit}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
          <Box sx={{ width: "89%" }}>
            <FormInput
              id="planItemIds"
              name="planItemIds"
              label="Plan Item"
              onBlur={handleBlur}
              required={true}
              labelSx={StyleUtils.labelStyle}
              inputSx={StyleUtils.inputStyles}
              value={values.planItemIds.map((item) => item.label).join(", ")}
              onChange={togglePlanItem}
              readOnly={isEdit}
            />
          </Box>
          {!isEdit && (
            <IconButton
              onClick={togglePlanItem}
              sx={{
                position: "absolute",
                top: "2.4rem",
                right: 0,
                zIndex: 1,
              }}
            >
              <AddCircleOutlineIcon
                color="secondary"
                sx={{ cursor: "pointer" }}
              />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormInput
            fullWidth
            id="tierId"
            name="tierId"
            label="Tier"
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            MenuProps={{ sx: { height: "21.875rem" } }}
            onBlur={handleBlur}
            readOnly
            value={tierData?.[0]?.label}
            inputProps={{ "aria-label": "Tier" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormInput
            fullWidth
            id="planTagIds"
            name="planTagIds"
            label="Product Tags"
            labelSx={StyleUtils.labelStyle}
            inputSx={StyleUtils.inputStyles}
            MenuProps={{ sx: { height: "21.875rem" } }}
            required={true}
            onBlur={handleBlur}
            selectOptions={tags}
            renderSelect
            inputProps={{ "aria-label": "Tag" }}
            multiple
            readOnly={isEdit}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormCheckbox
            id="isCustomPlan"
            onBlur={handleBlur}
            required={false}
            options={CustomPlan}
            label="Custom Plan"
            singleSelect
          />
        </Grid>
      </Grid>
      <CustomModal
        open={isPlanItemOpen}
        onClose={handleCloseBtn}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        modalWidth={800}
        padding={1}
      >
        <PlanItemsView
          handleCloseModal={handleCloseBtn}
          handleSaveCloseBtn={handleSaveCloseBtn}
          isSaveCloseBtnDisabled={existingPlanItems === values.planItemIds}
        />
      </CustomModal>
    </>
  );
};

export default CreatePlanForm;
