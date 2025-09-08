import { ColumnDef } from "@tanstack/react-table";
import { PermissionsEnum } from "Constants/enums";

export type ExtendedColumnDef<TData extends object> = ColumnDef<TData> & {
  permissions?: PermissionsEnum[];
};
