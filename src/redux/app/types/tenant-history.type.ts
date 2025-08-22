export interface TenantHistory {
  id: string;
  provisionEndOn: string | null;
  provisionStartOn: string;
  buildNumber: string | null;
  tenantId: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string | null;
  modifiedBy: string | null;
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  status: string | null;
  presignedUrl: string | null;
}

export type TransformedTenantHistory = {
  buildNumber: string | null;
  provisionStartOn: string;
  provisionEndOn: string | null;
  tenantId: string;
  status: string | null;
  presignedUrl: string | null;
};

export const adaptTenantHistory = (
  response: TenantHistory[]
): TransformedTenantHistory[] => {
  return response.map((item) => ({
    buildNumber: item.buildNumber,
    provisionStartOn: item.provisionStartOn,
    provisionEndOn: item.provisionEndOn ?? null,
    tenantId: item.tenantId,
    status: item.status,
    presignedUrl: item.presignedUrl,
  }));
};
