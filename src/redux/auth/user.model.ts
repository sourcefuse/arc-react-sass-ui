import { PermissionsEnum } from "Constants/enums";

export type User = {
  id: string;
  given_name: string;
  family_name: string;
  firstName: string;
  sub?: string;
  middleName?: string;
  lastName?: string;
  username: string;
  email?: string;
  phone?: string;
  lastLogin: Date;
  dob: Date;
  gender?: string;
  defaultTenantId: string;
  permissions: PermissionsEnum[];
  role: string;
  userPreferences: string[];
  tenantId: string;
  userTenantId?: string;
  status: number;
  hashSecret: string;
};
