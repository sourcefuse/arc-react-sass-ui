import { colors } from "Providers/theme/colors";
import { TenantStatus } from "redux/app/types";
import { TenantAndLogsDataType, TenantDataType } from "type/tenant.type";
import { FilterConfig } from "../../Components/FilterPopup";
import { PlanName } from "../../Constants/enums/tenants";
import { ActionButtons } from "./TenantsPage";
import { convertToDate } from "Helpers/utils";
import { PermissionsEnum } from "Constants/enums";
import { ExtendedColumnDef } from "types/table.types";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import StatusChip from "Components/StatusChip/StatusChip";
import { SubscriptionStatus } from "redux/app/types/subscription";
import { Box } from "@mui/material";

export const getStatusColor = (status: TenantStatus): string => {
  const statusColorMap: Record<TenantStatus, string> = {
    [TenantStatus.ACTIVE]: `${colors.active}`,
    [TenantStatus.DEPROVISIONING]: `${colors.deProvisioning}`,
    [TenantStatus.PENDINGPROVISION]: `${colors.pendingProvision}`,
    [TenantStatus.INACTIVE]: `${colors.inactive}`,
    [TenantStatus.PROVISIONFAILED]: `${colors.provisioningFailed}`,
    [TenantStatus.PROVISIONING]: `${colors.provisioning}`,
  };
  return statusColorMap[status] || colors.defaultPayments;
};
export const getLogStatusColor = (status?: string): string => {
  const statusColorMap: Record<string, string> = {
    Completed: `${colors.success}`,
    Started: `${colors.warning}`,
    Failed: `${colors.destructive}`,
    None: `${colors.inactiveGray}`,
  };
  return statusColorMap[status ?? "None"] || colors.secondary;
};
export const tenantStatusesAllowedForDirectProvisioning: TenantStatus[] = [
  TenantStatus.PENDINGPROVISION,
];

export const getStatusLabel = (status: TenantStatus | number): string => {
  const statusLabelMap: Record<TenantStatus | number, string> = {
    [TenantStatus.ACTIVE]: "Active",
    [TenantStatus.DEPROVISIONING]: "De-Provisioning",
    [TenantStatus.PENDINGPROVISION]: "Pending Provision",
    [TenantStatus.INACTIVE]: "Inactive",
    [TenantStatus.PROVISIONFAILED]: "Provision Failed",
    [TenantStatus.PROVISIONING]: "Provisioning",
  };
  return statusLabelMap[status] || "";
};

export const getSubscriptionStatusColor = (
  status: SubscriptionStatus
): string => {
  const statusColorMap: Record<SubscriptionStatus, string> = {
    [SubscriptionStatus.ACTIVE]: `${colors.active}`,
    [SubscriptionStatus.INACTIVE]: `${colors.inactive}`,
    [SubscriptionStatus.CANCELLED]: `${colors.inactive}`,
    [SubscriptionStatus.PENDING]: `${colors.deProvisioning}`,
    [SubscriptionStatus.PENDING_CANCELLATION]: `${colors.provisioningFailed}`,
    [SubscriptionStatus.EXPIRED]: `${colors.deProvisioning}`,
  };
  return statusColorMap[status] || colors.defaultPayments;
};

export const getSUbscriptionStatusLabel = (
  status: SubscriptionStatus | number
): string => {
  const statusLabelMap: Record<SubscriptionStatus | number, string> = {
    [SubscriptionStatus.ACTIVE]: "Active",
    [SubscriptionStatus.CANCELLED]: "Cancelled",
    [SubscriptionStatus.PENDING]: "Pending",
    [SubscriptionStatus.INACTIVE]: "Inactive",
    [SubscriptionStatus.PENDING_CANCELLATION]: "Pending Cancellation",
    [SubscriptionStatus.EXPIRED]: "Expired",
  };
  return statusLabelMap[status] || "";
};

export const tenantTableColumns = (
  refreshTenants: () => void
): ExtendedColumnDef<TenantAndLogsDataType>[] => [
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
    enableSorting: false,
  },
  {
    header: "Billing Date",
    accessorKey: "billingDate",
    id: "billingDate",
    cell: (row) => convertToDate(`${row.getValue()}`),
    enableSorting: false,
  },
  {
    header: "Plan Modified",
    accessorKey: "updatedAt",
    id: "updatedAt",
    cell: (row) => {
      return convertToDate(`${row.getValue()}`);
    },
  },
  {
    header: () => (
      <div style={{ textAlign: "center", width: "100%" }}>Actions</div>
    ),
    id: "actions",
    permissions: [PermissionsEnum.UpdateTenant],
    cell: (row) => (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ActionButtons row={row.row.original} refreshTenants={refreshTenants} />
      </Box>
    ),
    enableSorting: false,
  },
];

export const dummyTenant: TenantDataType[] = [
  {
    tenantId: "1",
    tenantName: "TechCorp HQ",
    status: 0,
    createdDate: "2023-01-15",
    planName: PlanName.Premium,
    billingDate: "2023-02-01",
    updatedAt: "2023-06-20",
    lang: "English",
    key: "tech-corp-hq",
  },
  {
    tenantId: "2",
    tenantName: "Innovatech Main",
    status: 2,
    createdDate: "2023-03-10",
    planName: PlanName.Starter,
    billingDate: "2023-04-01",
    updatedAt: "2023-07-18",
    lang: "English",
    key: "innovatech-main",
  },
  {
    tenantId: "3",
    tenantName: "GreenEarth Subsidiary",
    status: 5,
    createdDate: "2022-12-01",
    planName: PlanName.Value,
    billingDate: "2023-01-01",
    updatedAt: "2023-05-15",
    lang: "English",
    key: "greenearth-subsidiary",
  },
];

export const tenantFilterConfig: FilterConfig = {
  status: {
    label: "Status",
    options: [
      { label: "Active", value: String(TenantStatus.ACTIVE) },
      {
        label: "Pending Provision",
        value: String(TenantStatus.PENDINGPROVISION),
      },
      {
        label: "Provision Failed",
        value: String(TenantStatus.PROVISIONFAILED),
      },
      { label: "Provisioning", value: String(TenantStatus.PROVISIONING) },
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
export const tenantsSearchConfig = ["name"];

export const formatAmount = (amount: string | number) =>
  new Intl.NumberFormat("en-US").format(parseInt(amount as string));
