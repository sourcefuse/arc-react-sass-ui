import { ColumnDef } from "@tanstack/react-table";
import { FilterConfig } from "Components/FilterPopup/Filter.utils";
import { convertToDate } from "Helpers/utils";
import { FeatureNode } from "redux/app/types";

export const dummyFeatures: FeatureNode[] = [
  {
    deleted: false,
    deletedOn: null,
    deletedBy: null,
    createdOn: "2024-03-20T10:00:00Z",
    modifiedOn: new Date(),
    id: "f1",
    name: "Feature A",
    key: "feature_a",
    description: "First feature",
    defaultValue: "true",
    type: "boolean",
    createdBy: "",
    modifiedBy: "",
    metadata: {
      data: [
        {
          version: "1.0",
          featureVersion: "15.0.x",
        } as any,
      ],
    },
  },
];

export const featureTableColumns: ColumnDef<FeatureNode>[] = [
  {
    header: "Name",
    accessorKey: "name",
    id: "name",
  },
  {
    header: () => (
      <div style={{ width: "100%", textAlign: "center" }}> Service Count</div>
    ),
    enableSorting: false,
    id: "metadataCount",
    accessorFn: (row) => row.metadata?.data?.length, // Calculates metadata length dynamically
    cell: ({ getValue }) => (
      <div style={{ width: "100%", textAlign: "center" }}>
        {getValue() as string}
      </div>
    ), // Ensures the value is displayed properly
  },
  {
    header: "Feature Version",
    id: "key",
    accessorKey: "key",
  },
  {
    header: "Created Date",
    accessorKey: "createdOn",
    id: "createdOn",
    cell: (row) => {
      return convertToDate(row.getValue() as string);
    },
  },
];

export const featureExpandedTableColumns: ColumnDef<any>[] = [
  {
    header: "Chart Name",
    accessorKey: "name",
    id: "name",
  },
  {
    header: "Paths",
    accessorKey: "paths",
    id: "paths",
  },
  {
    header: "Chart Version",
    accessorKey: "chart_version",
    id: "chart_version",
  },
];

export const featureFilterConfig: FilterConfig = {
  date: {
    label: "Date",
    options: [
      { label: "Last month", value: "LastMonth" },
      { label: "Last week", value: "LastWeek" },
      { label: "Custom", value: "Custom" },
    ],
  },
};

export const searchConfig = ["name"];
