import { ColumnDef } from "@tanstack/react-table";
import * as Yup from "yup";
import { AddButton } from "./PlanItemsView";
import { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { RouteConstant } from "Constants/routeConstant";
import { createRelationFilter } from "Helpers/utils";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";

export const initialValues = {
  id: "",
  name: "",
  isCustomPlan: "false",
  billingCycleId: "",
  amount: "",
  clusterId: "",
  planItemIds: [],
  tierId: "",
  planTagIds: [],
};
export interface UpdatePlanFormValues {
  id: string;
  name: string;
  isCustomPlan: string;
  billingCycleId: string;
  amount: string;
  clusterId: string;
  planItemIds: { label: string; value: string }[];
  tierId: string;
  planTagIds: string[];
}
export interface CreatePlanFormValues {
  name: string;
  isCustomPlan: string;
  billingCycleId: string;
  amount: string;
  clusterId: string;
  planItemIds: { label: string; value: string }[];
  tierId: string;
  planTagIds: string[];
}

export const planValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Plan name is required")
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name cannot exceed 50 characters"),

  isCustomPlan: Yup.boolean(),

  billingCycleId: Yup.string().required("Subscription Type is required"),

  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be a positive value")
    .required("Amount is required"),

  clusterId: Yup.string().required("Cluster is required"),

  planItemIds: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Plan item is required"),
        value: Yup.string().required("Plan item is required"),
      })
    )
    .min(1, "At least one plan item is required"),

  tierId: Yup.string(), // add this when multiple are added .required('Tier is required')
  planTagIds: Yup.array()
    .of(Yup.string().required("Tag is required"))
    .min(1, "Tag is required"),
});

export interface Plan {
  id: string;
  name: string;
  description: string;
}

export const PlanItemData: Plan[] = [
  { id: "188028920", name: "Vodafone Max", description: "Vodafone Max" },
  { id: "185812311", name: "VI Min plan", description: "VI Min plan" },
  {
    id: "185812315",
    name: "Vodafone Family M..",
    description: "Vodafone Family Max",
  },
];

export const planItemsColumn: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: "Plan Name",
    cell: (row) => <TruncatedTooltipText text={row.getValue() as string} />,
    size: 200,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row: { original } }) => <AddButton rowData={original} />,
    size: 50,
  },
];

export const transformToUpdatePlanFormValues = (
  data: any
): UpdatePlanFormValues => {
  return {
    id: data.id,
    name: data.name,
    isCustomPlan: String(data.isCustomPlan),
    billingCycleId: data.billingCycleId,
    amount: String(data.amount),
    clusterId: data.clusterId ?? "",
    planItemIds:
      data.planPlanItem?.map((item: any) => ({
        label: item.planItem?.name || "",
        value: item.planItemId,
      })) || [],
    tierId: data.tier?.[0]?.id ?? "",
    planTagIds: data.planTags?.map((item: any) => item.tag.id) || [],
  };
};
export const mapToLabelValue = <T,>(
  data: T[] | undefined,
  labelKey: keyof T,
  valueKey: keyof T
) => {
  return (
    data?.map((item) => ({
      label: String(item[labelKey]),
      value: String(item[valueKey]),
    })) || []
  );
};

export const addPlanRoutes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: null },
  { path: RouteConstant.CONFIGURATION_PLANS, breadcrumb: "Plans" },
  { path: RouteConstant.CONFIGURATION_PLANS_CREATE, breadcrumb: "Add Plan" },
];

export const editPlanRoutes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: null },
  { path: RouteConstant.CONFIGURATION_PLANS, breadcrumb: "Plans" },
  { path: RouteConstant.CONFIGURATION_PLAN_EDIT, breadcrumb: "Edit Plan" },
];
export const getPlansByIdFilter = {
  include: [
    createRelationFilter("planPlanItem", [createRelationFilter("planItem")]),
    createRelationFilter("tier"),
    createRelationFilter("planTags", [createRelationFilter("tag")]),
  ],
};
export type SelectBoxType = {
  label: string;
  value: string;
};

export type ClusterType = {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  label: string;
  description: string;
};

export type Cluster = {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  clusterTypeId: string;
  region: string;
  zone: string;
  description: string;
  clusterType: ClusterType;
};

export function adaptToClusterSelect(clusters: Cluster[]): SelectBoxType[] {
  return (
    clusters.map((cluster: Cluster) => {
      return {
        label: cluster.clusterType.label,
        value: cluster.id,
      };
    }) || []
  );
}
