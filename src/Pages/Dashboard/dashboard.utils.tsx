import { ColumnDef } from "@tanstack/react-table";
import StatusChip from "Components/StatusChip/StatusChip";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import { convertToDate } from "Helpers/utils";
import { getStatusColor, getStatusLabel } from "Pages/Tenants/tenants.utils";
import { TenantStatus } from "redux/app/types";
import { TenantDataType } from "type/tenant.type";

export const dashboardTableColumns: ColumnDef<TenantDataType>[] = [
  {
    header: "Tenant Name",
    accessorKey: "tenantName",
    id: "tenantName",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },

  {
    header: "Status",
    accessorKey: "status",
    id: "status",
    cell: (row) => {
      const status = row.getValue() as TenantStatus;
      const color = getStatusColor(status);
      const label = getStatusLabel(status);
      return <StatusChip label={label} color={color} />;
    },
  },

  {
    header: "Created Date",
    accessorKey: "createdDate",
    id: "createdDate",
    cell: (row) => {
      return convertToDate(`${row.getValue()}`);
    },
  },
  {
    header: "Plan Name",
    accessorKey: "planName",
    id: "planeName",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },
];

// sample data for charts
export const supportData = [
  { name: "Open", value: 8, color: "#E9E9F0" },
  { name: "Closed", value: 20, color: "#FFD538" },
];

export const plansData = [
  { name: "Value", value: 20, color: "#AC93F3" },
  { name: "Premium", value: 15, color: "#84C1FF" },
  { name: "Starter", value: 4, color: "#E9E9F0" },
  { name: "Ultimate", value: 9, color: "#80DFC2" },
];
