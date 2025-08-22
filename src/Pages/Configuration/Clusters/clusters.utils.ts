import { Cluster } from "Pages/Plans/utils";
import * as Yup from "yup";

export type ClusterFormData = {
  id: string;
  region: string;
  zone: string;
  description: string;
  clusterTypeId: string;
  label: string;
  clusterTypeDescription: string;
};

export function transformClusters(data: Cluster[]): ClusterFormData[] {
  return data.map((cluster) => ({
    id: cluster.id,
    region: cluster.region,
    zone: cluster.zone,
    description: cluster.description,
    clusterTypeId: cluster.clusterTypeId,
    label: cluster.clusterType.label,
    clusterTypeDescription: cluster.clusterType.description,
  }));
}
export const initialValues = {
  id: "",
  region: "",
  zone: "",
  description: "",
  clusterTypeId: "",
  label: "",
  clusterTypeDescription: "",
};

export const clusterFormValidationSchema = Yup.object().shape({
  label: Yup.string().required("Label is required"),
  region: Yup.string().required("Region is required"),
  zone: Yup.string().required("Cluster Zone is required"),
  description: Yup.string().required("Description is required"),
  clusterTypeDescription: Yup.string().required(
    "Cluster Type Description is required"
  ),
});
