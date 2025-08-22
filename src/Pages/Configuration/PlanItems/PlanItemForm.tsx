import { Grid } from "@mui/material";
import FormInput from "Components/Forms/FormInput";
import { useFormikContext } from "formik";
import { StyleUtils } from "Helpers/styleUtils";
import { useGetFeaturesQuery } from "redux/app/configurationApiSlice";
import { useMemo } from "react";
import { PlanItemFormValues } from "./types";
import EditPlanItemLoader from "./EditPlanItemLoader";

const PlanItemForm = () => {
  const { handleBlur } = useFormikContext<PlanItemFormValues>();
  const {
    data: featureList,
    isLoading,
    isFetching,
  } = useGetFeaturesQuery({ limit: undefined, offset: undefined });

  const updatedFeatureList = useMemo(
    () =>
      featureList?.map(({ name, key }) => ({
        label: `${name} (${key})`,
        value: name,
      })) ?? [],
    [featureList]
  );

  if (isLoading || isFetching) {
    return <EditPlanItemLoader />;
  }

  return (
    <Grid container spacing={4} rowSpacing={4}>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="planName"
          name="planName"
          label="Plan Item Name"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ display: "flex", gap: 1 }}>
        <FormInput
          fullWidth
          id="features"
          name="features"
          label="Feature(s)"
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          MenuProps={{ sx: { height: "21.875rem" } }}
          required={true}
          onBlur={handleBlur}
          selectOptions={updatedFeatureList}
          renderSelect
          multiple
          isLoading={isLoading}
          inputProps={{ "aria-label": "Feature" }}
        />
      </Grid>

      <Grid item xs={12} sm={12}>
        <FormInput
          fullWidth
          id="description"
          name="description"
          label="Description"
          onBlur={handleBlur}
          required={true}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
    </Grid>
  );
};

export default PlanItemForm;
