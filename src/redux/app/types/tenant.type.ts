import { IFile } from "type/tenant.type";
import { ContactType } from "./contact.type";
import { ResourceType } from "./resource.type";
import { Subscription } from "./subscription";
import { BaseEntity } from "./utils.type";

// Enum representing different statuses of a tenant coming from the API
export enum TenantStatus {
  ACTIVE, // Tenant is active and fully functional
  PENDINGPROVISION, // Tenant is awaiting provisioning
  PROVISIONING, // Tenant is currently being provisioned
  PROVISIONFAILED, // Provisioning process failed
  DEPROVISIONING, // Tenant is being deprovisioned
  INACTIVE, // Tenant is inactive
}
export type TenantType = {
  id: string;
  name: string;
  status: TenantStatus;
  key: string;
  spocUserId?: string;
  domains: string[];
  leadId?: string;
  addressId: string;
  contacts?: ContactType[];
  resources?: ResourceType[];
  deleted: true;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  lang: string;
  subscriptions: Subscription[];
  files: IFile[];
};

export interface TnCDocuments extends BaseEntity {
  id: string;
  originalName: string;
  key: string;
  source: number;
}

export interface TnCDocumentsItem extends TnCDocuments {
  contentType: string;
  size: number;
  downloadUrl: string;
  metadata: {
    fieldname: string;
  };
}
export type TenantLogsType = {
  id: string;
  type: number;
  message: {
    stageName: string;
    stageStatus: string;
  };
  tenantId: string;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
};
