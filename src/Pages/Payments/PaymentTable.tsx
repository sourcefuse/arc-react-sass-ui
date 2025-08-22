import { FC } from "react";
import {
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
import { getPaymentTableColumns } from "./payments.utils";
import { IBillingInvoice } from "redux/app/types/invoice.type";

type Props = {
  invoice: IBillingInvoice;
};
export const PaymentTable: FC<Props> = ({ invoice }) => {
  const data = invoice?.payment ? [invoice?.payment] : [];
  const table = useReactTable({
    data,
    columns: getPaymentTableColumns(invoice),
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
