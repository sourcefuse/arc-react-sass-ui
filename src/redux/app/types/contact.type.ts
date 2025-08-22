export type ContactType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  isPrimary: boolean;
  type?: string;
  tenantId: string;
  phoneNumber: string;
  countryCode: string;
  designation: string;
};
