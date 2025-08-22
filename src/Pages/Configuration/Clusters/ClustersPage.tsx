import { Box, Paper } from "@mui/material";
import { clustersStyle } from "./clusters.styles";
import PageHeader from "Components/PageHeader";
import Form from "Components/Forms/Form";
import ClustersForm from "./ClustersForm";
import RenderButton from "./ClustersRenderButton";
import {
  useCreateClustersMutation,
  useGetClusterWithTypeQuery,
  useUpdateClustersMutation,
} from "redux/app/tenantManagementApiSlice";
import {
  ClusterFormData,
  clusterFormValidationSchema,
  initialValues,
} from "./clusters.utils";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

const ClustersPage = () => {
  const {
    data: clusterData,
    isLoading: isClusterLoading,
    refetch,
  } = useGetClusterWithTypeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  const [createCluster] = useCreateClustersMutation();
  const [updateCluster] = useUpdateClustersMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const handleCancel = () => {
    navigate("/dashboard");
  };
  const handleSubmit = async (
    values: ClusterFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (values.clusterTypeId) {
        await updateCluster(values).unwrap();
        enqueueSnackbar("Cluster Updated Successfully", { variant: "success" });
      } else {
        const { id, clusterTypeId, ...createPayload } = values;
        await createCluster(createPayload).unwrap();
        enqueueSnackbar("Cluster Created Successfully", { variant: "success" });
      }
      await refetch();
      resetForm();
    } catch {}
  };

  return (
    <Box sx={clustersStyle.mainContainer} data-testid="clusters-page">
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={clusterFormValidationSchema}
      >
        <PageHeader pageName="Clusters" />
        <Paper sx={clustersStyle.backgroundContainer}>
          <ClustersForm
            clusterData={clusterData}
            isClusterLoading={isClusterLoading}
          />
          <RenderButton handleCancel={handleCancel} refetch={refetch} />
        </Paper>
      </Form>
    </Box>
  );
};

export default ClustersPage;
