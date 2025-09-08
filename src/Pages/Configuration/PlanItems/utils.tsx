import { PlanItemNode } from "redux/app/types/plan.type";
import ActionButton from "./ActionButton";
import { FilterConfig } from "Components/FilterPopup";
import * as yup from "yup";
import { PlanItemFormValues } from "./types";
import { PermissionsEnum } from "Constants/enums";
import { ExtendedColumnDef } from "types/table.types";

export const initialCreatePlanItemValues: PlanItemFormValues = {
  planName: "",
  description: "",
  features: null,
};

const featureErrMsg = "Feature is required";

export const createPlanItemValidationSchema = yup.object({
  planName: yup
    .string()
    .required("Plan name is required")
    .min(3, "Plan name should have at least 3 characters")
    .max(50, "Plan name should have at most 50 characters"),
  description: yup
    .string()
    .nullable()
    .required("Description is required")
    .max(255, "Description should have at most 255 characters"),
  features: yup
    .array()
    .of(yup.string().required(featureErrMsg))
    .min(1, featureErrMsg)
    .required(featureErrMsg)
    .nullable(),
});
export const planItemsTableColumns: ExtendedColumnDef<PlanItemNode>[] = [
  {
    header: "Plan Item Name",
    accessorKey: "name",
    id: "name",
  },
  {
    header: "Created Date",
    accessorKey: "createdOn",
    id: "createdOn",
    cell: (row) => new Date(`${row.getValue()}`).toLocaleDateString(), // Format the date
  },
  {
    header: "Plan Modified Date",
    accessorKey: "modifiedOn",
    id: "modifiedOn",
    cell: (row) => new Date(`${row.getValue()}`).toLocaleDateString(), // Format the date
  },
  {
    header: () => (
      <div style={{ textAlign: "center", width: "100%" }}>Actions</div>
    ),
    accessorKey: "action",
    id: "action",
    cell: (cellProps) => <ActionButton cellProps={cellProps} />,
    permissions: [PermissionsEnum.UpdatePlanItems],
    enableSorting: false,
  },
];

export const filterConfig: FilterConfig = {
  date: {
    label: "Date",
    options: [
      { label: "Last month", value: "LastMonth" },
      { label: "Last week", value: "LastWeek" },
      { label: "Custom", value: "Custom" },
    ],
  },
};

export const searchConfig = ["id", "name", "description"];
