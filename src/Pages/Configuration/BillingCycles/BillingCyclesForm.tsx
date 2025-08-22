import React from "react";
import { FormControl, Grid, Typography } from "@mui/material";
import { useFormikContext, FormikValues } from "formik";
import FormInput from "Components/Forms/FormInput";
import AutoCompleteSelect from "Components/AutoCompleteInput/AutoCompleteSelect";
import { BillingCycle } from "redux/app/types/subscription";
import { StyleUtils } from "Helpers/styleUtils";
import BillingCyclesPageLoader from "./BillingCyclesLoader";
import { useBillingCycleFormHandlers } from "./useBillingCycleFormHandlers";

type BillingCyclesFormProps = {
  billingCycleData: BillingCycle[] | undefined;
  isBillingCycleLoading: boolean;
};

function BillingCyclesForm({
  billingCycleData,
  isBillingCycleLoading,
}: BillingCyclesFormProps) {
  const { handleBlur, values } = useFormikContext<FormikValues>();
  const { handleBillingCycleChange } =
    useBillingCycleFormHandlers(billingCycleData);

  if (isBillingCycleLoading) return <BillingCyclesPageLoader />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <AutoCompleteSelect
            data={
              billingCycleData?.map((d) => ({
                label: d.cycleName,
                value: d.id,
              })) || []
            }
            value={values.cycleName}
            onChange={handleBillingCycleChange}
            label="Cycle Name"
          />
          <Typography
            variant="body2"
            sx={{
              ml: "1rem",
              mt: 0.2,
              fontSize: "12px",
              color: "primary.stepperActiveText",
            }}
          >
            Type to add a new or select to edit
          </Typography>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="duration"
          name="duration"
          label="Duration (in months)"
          required
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
      <Grid item xs={12}>
        <FormInput
          fullWidth
          id="description"
          name="description"
          label="Description"
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
    </Grid>
  );
}

export default BillingCyclesForm;
