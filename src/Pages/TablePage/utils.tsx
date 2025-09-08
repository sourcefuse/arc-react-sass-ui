import { ColumnDef } from "@tanstack/react-table";
import { BillingDataType } from "./data";

export const billingTableColumns: ColumnDef<BillingDataType>[] = [
  {
    header: "Id",
    accessorKey: "_id",
    id: "_id",
    enableSorting: false,
  },
  {
    header: "Company Name",
    accessorKey: "companyName",
    id: "companyName",
  },
  {
    header: "User Name",
    accessorKey: "userName",
    id: "userName",
  },
  {
    header: "Plan Name",
    accessorKey: "planName",
    id: "planName",
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    id: "startDate",
    cell: (row) => new Date(`${row.getValue()}`).toLocaleDateString(), // Format the date
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    id: "endDate",
    cell: (row) => new Date(`${row.getValue()}`).toLocaleDateString(), // Format the date
  },
  {
    header: "Subscription",
    accessorKey: "subscription",
    id: "subscription",
  },
];
