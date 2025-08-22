import { TenantType } from "./tenant.type";

export enum LeadStatus {
  OPEN,
  CONFIRMED,
  CLOSED,
  AUTO_CLOSED,
  INVALID,
}

export type LeadType = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  status: LeadStatus;
  employeeCount: number;
  phoneNumber: string;
  countryCode: string;
  isValidated: boolean;
  tenant?: TenantType;
  addressId: string;
  deleted: true;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
};
