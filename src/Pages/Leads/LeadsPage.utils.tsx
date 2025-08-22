import { FilterConfig } from "Components/FilterPopup/Filter.utils";
import { colors } from "Providers/theme/colors";
import { LeadStatus, LeadType } from "redux/app/types";
import { LeadDataType } from "type";
import { LeadStatus as UiLeadStatus } from "../../Constants/enums/lead";
import { LeadActionButtons } from "./LeadsPage";
import { convertToDate } from "Helpers/utils";
import StatusChip from "Components/StatusChip/StatusChip";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import { PermissionsEnum } from "Constants/enums";
import { ExtendedColumnDef } from "types/table.types";

export const getLeadStatusColor = (status: UiLeadStatus): string => {
  const statusColorMap: Record<UiLeadStatus, string> = {
    [UiLeadStatus.OPEN]: `${colors.pendingProvision}`,
    [UiLeadStatus.AUTO_CLOSED]: `${colors.autoClosed}`,
    [UiLeadStatus.INVALID]: `${colors.provisioningFailed}`,
    [UiLeadStatus.CLOSED]: `${colors.active}`,
    [UiLeadStatus.CONFIRMED]: `${colors.deProvisioning}`,
  };
  return statusColorMap[status] || "black";
};
export const getLeadStatusDisplayName = (status: UiLeadStatus): string => {
  const displayNameMap: Record<UiLeadStatus, string> = {
    [UiLeadStatus.OPEN]: "Open",
    [UiLeadStatus.AUTO_CLOSED]: "Auto Closed",
    [UiLeadStatus.INVALID]: "Invalid",
    [UiLeadStatus.CLOSED]: "Closed",
    [UiLeadStatus.CONFIRMED]: "Confirmed",
  };
  return displayNameMap[status] || status;
};

export const dummyLeads: LeadType[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    companyName: "Acme Corp",
    email: "john.doe@example.com",
    status: LeadStatus.OPEN,
    employeeCount: 50,
    phoneNumber: "1234567890",
    countryCode: "+1",
    isValidated: true,
    addressId: "addr1",
    deleted: true,
    deletedOn: "2024-02-01T12:00:00Z",
    deletedBy: "admin",
    createdOn: "2023-12-01T09:00:00Z",
    modifiedOn: "2024-01-15T10:30:00Z",
    createdBy: "system",
    modifiedBy: "admin",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    companyName: "Tech Solutions",
    email: "jane.smith@example.com",
    status: LeadStatus.OPEN,
    employeeCount: 120,
    phoneNumber: "6396786017",
    countryCode: "+1",
    isValidated: false,
    addressId: "addr2",
    deleted: true,
    deletedOn: "2024-01-20T14:45:00Z",
    deletedBy: "user123",
    createdOn: "2023-11-15T11:20:00Z",
    modifiedOn: "2024-01-10T08:15:00Z",
    createdBy: "user456",
    modifiedBy: "user789",
  },
];

export const leadTableColumns = (
  refreshLeads: () => void
): ExtendedColumnDef<LeadDataType>[] => [
  {
    header: "Lead Name",
    accessorKey: "leadName",
    id: "leadName",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    id: "status",
    cell: (row) => {
      const status = row.getValue<UiLeadStatus>();
      const color = getLeadStatusColor(status);
      const label = getLeadStatusDisplayName(status);
      return <StatusChip color={color} label={label} />;
    },
  },
  {
    header: "Created Date",
    accessorKey: "createdAt",
    id: "createdAt",
    cell: (row) => {
      return convertToDate(row.getValue() as string);
    },
  },
  {
    header: "Email Address",
    accessorKey: "email",
    id: "email",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },
  {
    header: "Phone Number",
    accessorKey: "phone",
    id: "phone",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },
  {
    header: "Employer",
    accessorKey: "employer",
    id: "employer",
    cell: (row) => (
      <TruncatedTooltipText text={row.getValue() as string} maxWidth={8} />
    ),
  },
  {
    header: "No. of Employees",
    accessorKey: "numberOfEmployee",
    id: "numberOfEmployee",
    cell: (row) => (
      <div style={{ textAlign: "center" }}>{row.getValue() as string}</div>
    ),
  },
  {
    header: () => (
      <div style={{ textAlign: "center", width: "100%" }}>Actions</div>
    ),
    id: "actions",
    permissions: [PermissionsEnum.UpdateLead],
    cell: (row) => <LeadActionButtons row={row} refreshLeads={refreshLeads} />,
    enableSorting: false,
  },
];

export const disableLeadAction: UiLeadStatus[] = [
  UiLeadStatus.CLOSED,
  UiLeadStatus.INVALID,
  UiLeadStatus.AUTO_CLOSED,
];

export const filterConfig: FilterConfig = {
  status: {
    label: "Status",
    options: [
      { label: "Open", value: String(LeadStatus.OPEN) },
      { label: "Confirmed", value: String(LeadStatus.CONFIRMED) },
      { label: "Closed", value: String(LeadStatus.CLOSED) },
      { label: "Auto Closed", value: String(LeadStatus.AUTO_CLOSED) },
      { label: "Invalid", value: String(LeadStatus.INVALID) },
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

export const searchConfig = [
  "id",
  "email",
  "phoneNumber",
  "firstName",
  "lastName",
  "companyName",
  "numberOfEmployees",
];
