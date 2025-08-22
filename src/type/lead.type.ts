import { LeadStatus } from "Constants/enums/lead";

export type LeadDataType = {
  leadId: string;
  leadName: string;
  status: LeadStatus;
  createdAt: string;
  email: string;
  phone: string;
  employer: string;
  numberOfEmployee: string;
};
