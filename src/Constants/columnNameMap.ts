const columnNameMap: Record<string, string> = {
  tenantName: "name",
  createdDate: "createdOn",
  updatedAt: "modifiedOn",
  leadName: "firstName",
  phone: "phoneNumber",
  employer: "companyName",
  numberOfEmployee: "employeeCount",
  createdAt: "createdOn",
  planName: "name",
  price: "amount",
};

export const getBackendColumnName = (columnName: string): string =>
  columnNameMap[columnName] || columnName;
