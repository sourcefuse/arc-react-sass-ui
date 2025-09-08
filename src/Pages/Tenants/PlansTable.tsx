import { FC } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";
import { SubscriptionStatus } from "redux/app/types/subscription";
import {
  getSubscriptionStatusColor,
  getSUbscriptionStatusLabel,
} from "./tenants.utils";
import StatusChip from "Components/StatusChip/StatusChip";

export type PlanDetails = {
  planName: string;
  customPlan: string;
  subscription: string;
  monthlyPricing: string;
  status: SubscriptionStatus;
};

type Props = {
  plans: PlanDetails[];
};

export const PlansTable: FC<Props> = ({ plans }) => {
  const data = plans ?? [];
  const table = useReactTable({
    data,
    columns: PlanColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", backgroundColor: "transparent" }}
    >
      <Table sx={{ borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow sx={{ boxShadow: "inherit" }}>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{ fontWeight: "bold", borderBottom: "none" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} sx={{ borderBottom: "none" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const PlanColumns: ColumnDef<PlanDetails>[] = [
  {
    header: "Plan Name",
    accessorKey: "planName",
    id: "planName",
    cell: (row) => <TruncatedTooltipText text={row.getValue() as string} />,
  },
  {
    header: "Custom Plan",
    accessorKey: "customPlan",
    id: "customPlan",
  },
  {
    header: "Subscription",
    accessorKey: "subscription",
    id: "Subscription",
  },
  {
    header: "Pricing ( $ ) ",
    accessorKey: "monthlyPricing",
    id: "monthlyPricing",
    cell: (row) => `${row.getValue()}`,
  },
  {
    header: "Status",
    accessorKey: "status",
    id: "status",
    cell: (row) => {
      const status = row.getValue() as SubscriptionStatus;
      const color = getSubscriptionStatusColor(status);
      const label = getSUbscriptionStatusLabel(status);
      return <StatusChip label={label} color={color} />;
    },
  },
];

export const PlanData: PlanDetails[] = [
  {
    planName: "Basic Plan",
    customPlan: "No",
    subscription: "Monthly",
    monthlyPricing: "10",
    status: SubscriptionStatus.ACTIVE,
  },
  {
    planName: "Premium Plan",
    customPlan: "Yes",
    subscription: "Yearly",
    monthlyPricing: "99",
    status: SubscriptionStatus.PENDING_CANCELLATION,
  },
];
