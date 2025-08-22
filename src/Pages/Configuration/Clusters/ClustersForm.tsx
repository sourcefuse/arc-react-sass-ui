import { FormControl, Grid, Typography } from "@mui/material";
import { FormikValues, useFormikContext } from "formik";
import FormInput from "Components/Forms/FormInput";
import { StyleUtils } from "Helpers/styleUtils";
import { ClusterFormData, initialValues } from "./clusters.utils";
import ClustersPageLoader from "./ClustersPageLoader";
import AutoCompleteSelect from "Components/AutoCompleteInput/AutoCompleteSelect";

type ClustersFormProps = {
  clusterData: ClusterFormData[] | undefined;
  isClusterLoading: boolean;
};

function ClustersForm({ clusterData, isClusterLoading }: ClustersFormProps) {
  const {
    handleBlur,
    setFieldValue,
    resetForm,
    setTouched,
    validateForm,
    values,
  } = useFormikContext<FormikValues>();

  const handleClusterChange = async (
    event: any,
    newValue: any,
    reason: string
  ) => {
    if (reason === "clear") {
      resetForm({ values: initialValues });
      return;
    }

    let selectedClusterId = "";

    if (typeof newValue === "string") {
      await setFieldValue("label", newValue, false);
    } else if (newValue?.inputValue) {
      await setFieldValue("label", newValue.inputValue, false);
    } else {
      await setFieldValue("label", newValue?.label || "", false);
      selectedClusterId = newValue?.value;
    }
    if (selectedClusterId && clusterData) {
      const selectedCluster = clusterData.find(
        (cluster) => cluster.clusterTypeId === selectedClusterId
      );
      if (selectedCluster) {
        await setFieldValue("id", selectedCluster.id, false);
        await setFieldValue("region", selectedCluster.region, false);
        await setFieldValue("zone", selectedCluster.zone, false);
        await setFieldValue("description", selectedCluster.description, false);
        await setFieldValue(
          "clusterTypeDescription",
          selectedCluster.clusterTypeDescription,
          false
        );
        await setFieldValue(
          "clusterTypeId",
          selectedCluster.clusterTypeId,
          false
        );

        await validateForm();
        setTouched(
          {
            label: true,
            region: true,
            zone: true,
            description: true,
            clusterTypeId: true,
            clusterTypeDescription: true,
          },
          true
        );
      }
    }
  };
  if (isClusterLoading) return <ClustersPageLoader />;
  return (
    <Grid container spacing={4} rowSpacing={4}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <AutoCompleteSelect
            data={
              clusterData?.map((d) => ({
                label: d.label,
                value: d.clusterTypeId,
              })) || []
            }
            value={values.label}
            onChange={handleClusterChange}
            label="Cluster Type"
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
          id="clusterTypeDescription"
          name="clusterTypeDescription"
          label="Cluster Type Description"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="region"
          name="region"
          label="Region"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="zone"
          name="zone"
          label="Cluster Zone"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormInput
          fullWidth
          id="description"
          name="description"
          label="Description"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
    </Grid>
  );
}

export default ClustersForm;
