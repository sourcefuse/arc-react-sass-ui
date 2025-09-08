import { ActionButtonsContainer } from "./PlansPage";
import { ManagePlanDataType } from "type";
import { FilterConfig } from "Components/FilterPopup";
import { convertToDate } from "Helpers/utils";
import { Box } from "@mui/material";
import { ExtendedColumnDef } from "types/table.types";
import { PermissionsEnum } from "Constants/enums";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import { PlanStatus } from "redux/app/types";
import { colors } from "Providers/theme/colors";
import StatusChip from "Components/StatusChip/StatusChip";
import { ColumnDef } from "@tanstack/react-table";

export const getStatusColor = (status: PlanStatus): string => {
  const statusColorMap: Record<PlanStatus, string> = {
    [PlanStatus.ACTIVE]: `${colors.paid}`,
    [PlanStatus.SUSPENDED]: `${colors.overdue}`,
  };
  return statusColorMap[status] ?? "black";
};

export const getStatusLabel = (status: PlanStatus): string => {
  const statusMap: Record<PlanStatus, string> = {
    [PlanStatus.ACTIVE]: "Active",
    [PlanStatus.SUSPENDED]: "Suspended",
  };
  return statusMap[status] || "NA";
};

export const managePlanData: ManagePlanDataType[] = [
  {
    id: "1",
    planName: "Basic Plan",
    createdDate: "2024-02-25",
    price: 10.0,
    status: PlanStatus.ACTIVE,
    isCustomPlan: false,
  },
  {
    id: "2",
    planName: "Standard Plan",
    createdDate: "2024-01-25",
    price: 100.0,
    status: PlanStatus.ACTIVE,
    isCustomPlan: false,
  },
  {
    id: "3",
    planName: "Premium Plan",
    createdDate: "2024-09-25",
    price: 45.0,
    status: PlanStatus.ACTIVE,
    isCustomPlan: false,
  },
];

export const dummyPlans = [
  {
    deleted: false,
    deletedOn: null,
    deletedBy: null,
    createdOn: "2025-01-25T10:59:31.566Z",
    modifiedOn: "2025-01-25T10:59:31.566Z",
    createdBy: "00000000-0000-0000-0000-000000000001",
    modifiedBy: null,
    id: "2c280d53-d643-638b-84a3-0f878cb05d7c",
    name: "Monthly Plan",
    description: "Standard features with monthly billing",
    amount: "19.99",
    metadata: {
      features: ["standard_support", "50GB_storage", "20_users"],
    },
    isCustomPlan: false,
    billingCycleId: "481b86b4-1372-86f6-8828-702aa70aa423",
    currencyId: "c0e2178a-18ab-976d-468d-79aa1b7c6bbb",
    clusterId: "61666fba-46cc-fea8-94d3-0dfcdde96755",
  },
  {
    deleted: false,
    deletedOn: null,
    deletedBy: null,
    createdOn: "2025-02-25T10:59:31.566Z",
    modifiedOn: "2025-02-25T10:59:31.566Z",
    createdBy: "00000000-0000-0000-0000-000000000001",
    modifiedBy: null,
    id: "7efd5f3b-ed02-6fe6-1ea5-6d1dcd08f76f",
    name: "Yearly Plan",
    description: "Standard features with yearly billing (save 15%)",
    amount: "199.99",
    metadata: {
      features: ["standard_support", "50GB_storage", "20_users"],
    },
    isCustomPlan: false,
    billingCycleId: "1e28c1e6-2d40-206e-4e20-dd50407462c9",
    currencyId: "c0e2178a-18ab-976d-468d-79aa1b7c6bbb",
    clusterId: "61666fba-46cc-fea8-94d3-0dfcdde96755",
  },
];

export const getManagePlanTableColumns = (
  handleSuspension: (plan: ManagePlanDataType) => void
): ExtendedColumnDef<ManagePlanDataType>[] => {
  return [
    {
      header: "Plan Name",
      accessorKey: "planName",
      id: "planName",
      cell: (row) => (
        <TruncatedTooltipText text={row.getValue() as string} maxWidth={22} />
      ),
    },

    {
      header: "Created Date",
      accessorKey: "createdDate",
      id: "createdDate",
      cell: ({ row: { original } }) => (
        <Box>{String(convertToDate(original.createdDate))}</Box>
      ),
    },
    {
      header: "Price ( $ )",
      accessorKey: "price",
      id: "price",
      cell: (row) => `${row.getValue()}`, // Format price as currency
    },
    {
      header: "Status",
      accessorKey: "status",
      id: "status",
      cell: (row) => {
        const status = row.getValue<PlanStatus>();
        const color = getStatusColor(status);
        const label = getStatusLabel(status);
        return <StatusChip color={color} label={label} />;
      },
    },
    {
      header: "Plan Type",
      accessorKey: "isCustomPlan",
      id: "isCustomPlan",
      cell: (row) => {
        const isCustomPlan = row.getValue<boolean>();

        return <span>{isCustomPlan ? "Custom" : "Standard"}</span>;
      },
    },

    {
      header: () => (
        <div style={{ textAlign: "center", width: "100%" }}>Actions</div>
      ),
      id: "actions",
      cell: (row) => (
        <ActionButtonsContainer handleSuspension={handleSuspension} row={row} />
      ),
      permissions: [PermissionsEnum.UpdatePlan],
      enableSorting: false,
    },
  ];
};
export const managePlanTableColumns: ColumnDef<ManagePlanDataType>[] = [];

export const planFilterConfig: FilterConfig = {
  status: {
    label: "Status",
    options: [
      { label: "Active", value: String(PlanStatus.ACTIVE) },
      { label: "Suspended", value: String(PlanStatus.SUSPENDED) },
    ],
  },
  date: {
    label: "Date",
    options: [
      { label: "Last month", value: "LastMonth" },
      { label: "Last week", value: "LastWeek" },
      { label: "Custom", value: "Custom" },
    ],
  },
};

export const planSearchConfig = ["id", "name", "amount"];
