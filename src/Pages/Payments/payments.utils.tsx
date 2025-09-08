import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { FilterConfig } from "Components/FilterPopup";
import { InvoiceStatus } from "Constants/enums/invoice-status.enum";
import { convertToDate, getCurrencySymbol } from "Helpers/utils";
import { colors } from "Providers/theme/colors";
import { IBillingInvoice, IPayment } from "redux/app/types/invoice.type";
import { ActionButtonsContainer } from "./PaymentAction";
import StatusChip from "Components/StatusChip/StatusChip";
import { ExtendedColumnDef } from "types/table.types";
import { PermissionsEnum } from "Constants/enums";

export const getStatusColor = (status: InvoiceStatus): string => {
  const statusColorMap: Record<InvoiceStatus, string> = {
    [InvoiceStatus.PAID]: `${colors.paid}`,
    [InvoiceStatus.PENDING]: `${colors.pending}`,
    [InvoiceStatus.OPEN]: `${colors.pending}`,
    [InvoiceStatus.PAYMENT_DUE]: `${colors.due}`,
    [InvoiceStatus.DRAFT]: `${colors.pending}`,
    [InvoiceStatus.POSTED]: `${colors.default}`,
    [InvoiceStatus.NOT_PAID]: `${colors.default}`,
    [InvoiceStatus.VOID]: `${colors.overdue}`,
    [InvoiceStatus.OVERDUE]: `${colors.overdue}`,
  };
  return statusColorMap[status] || "black";
};
export const getStatusDisplayName = (status: InvoiceStatus): string => {
  const displayNameMap: Record<InvoiceStatus, string> = {
    [InvoiceStatus.PAID]: "Paid",
    [InvoiceStatus.PENDING]: "Pending",
    [InvoiceStatus.DRAFT]: "Pending",
    [InvoiceStatus.PAYMENT_DUE]: "Payment Due",
    [InvoiceStatus.OPEN]: "Pending",
    [InvoiceStatus.POSTED]: "Posted",
    [InvoiceStatus.NOT_PAID]: "Not Paid",
    [InvoiceStatus.VOID]: "Cancelled",
    [InvoiceStatus.OVERDUE]: "Overdue",
  };
  return displayNameMap[status];
};

const style = { textAlign: "center", whiteSpace: "nowrap" };

export const getInvoiceTableColumns = (
  downloadFn: (invoice: IBillingInvoice) => void
): ExtendedColumnDef<IBillingInvoice>[] => {
  const invoiceTableColumns: ExtendedColumnDef<IBillingInvoice>[] = [
    {
      id: "tenantName",
      header: "Tenant Name",
      accessorKey: "billingCustomer.tenant.name",
      enableSorting: false,
    },
    {
      id: "invoiceNo",
      header: "Invoice No.",
      accessorKey: "invoiceNo",
    },
    {
      id: "invoiceStatus",
      header: "Payment Status",
      accessorKey: "invoiceStatus",
      cell: (row) => {
        const status = row.getValue<InvoiceStatus>();
        const color = getStatusColor(status);
        const label = getStatusDisplayName(status);
        return <StatusChip label={label} color={color} />;
      },
    },
    {
      id: "createdOn",
      header: "Invoice Date",
      accessorKey: "createdOn",
      cell: ({ row: { original } }) => (
        <Box>{String(convertToDate(original.createdOn))}</Box>
      ),
    },
    {
      id: "amount",
      header: "Invoice Amount ( $ )",
      accessorKey: "amount",
      cell: ({ row: { original } }) => <Box sx={style}>{original.amount}</Box>,
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ row: { original } }) => (
        <Box>{String(convertToDate(original.dueDate))}</Box>
      ),
    },
    {
      id: "action",
      header: () => (
        <div style={{ textAlign: "center", width: "100%" }}>Actions</div>
      ),
      accessorKey: "action",
      cell: (row) => (
        <ActionButtonsContainer handleDownload={downloadFn} row={row} />
      ),
      enableSorting: false,
      permissions: [PermissionsEnum.DownloadInvoice],
    },
  ];
  return invoiceTableColumns;
};

export const getPaymentTableColumns = (
  invoice: IBillingInvoice
): ColumnDef<IPayment>[] => {
  return [
    {
      id: "paymentDate",
      header: "Payment Date",
      accessorKey: "paymentDate",
      cell: ({ row: { original } }) => (
        <Typography>{`${new Date(
          original?.paymentDate
        )?.toLocaleDateString()}`}</Typography>
      ),
    },
    {
      id: "paymentAmount",
      header: "Amount",
      accessorKey: "paymentAmount",
      cell: ({ row: { original } }) => (
        <Typography>{`${getCurrencySymbol(invoice?.currencyCode?.trim())}${
          original?.amount
        }`}</Typography>
      ),
    },
    {
      id: "tax",
      header: "Tax",
      cell: ({ row: { original } }) => (
        <Typography>{`${getCurrencySymbol(invoice?.currencyCode.trim())}${
          original?.taxRate
        }`}</Typography>
      ),
    },
    {
      id: "totalAmount",
      header: "Total Amount",
      cell: ({ row: { original } }) => (
        <Typography
          color={"primary.stepperCompletedIcon"}
        >{`${getCurrencySymbol(invoice?.currencyCode.trim())}${
          original?.totalAmount
        }`}</Typography>
      ),
    },
  ];
};
export const searchConfig = ["dueDate", "amount", "invoiceNo"];

export const paymentPageFilterConfig: FilterConfig = {
  status: {
    label: "Status",
    options: [
      {
        label: "Pending",
        value: [InvoiceStatus.OPEN, InvoiceStatus.DRAFT],
      },
      { label: "Paid", value: InvoiceStatus.PAID },
      { label: "Overdue", value: InvoiceStatus.OVERDUE },
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
