import { LeadStatus, leadStatusMap } from "Constants/enums/lead";
import { FormAddTenant } from "Pages/Tenants/AddTenant/addTenantsUtils";
import { LeadType } from "redux/app/types";
import { LeadDataType } from "type";

/**
 *
 * @param leads : LeadType[] is the type of leads we get from the API
 * @returns LeadDataType[] is the type of leads we want to display in the table
 */
export function adaptToLead(leads: LeadType[]): LeadDataType[] {
  return (
    leads?.map((lead: LeadType) => {
      return {
        leadId: lead.id,
        leadName: `${lead.firstName} ${lead.lastName}`,
        status: leadStatusMap[lead.status] ?? LeadStatus.UNKNOWN,
        createdAt: lead.createdOn,
        email: lead.email,
        phone: lead.countryCode + " " + lead.phoneNumber,
        employer: lead.companyName,
        numberOfEmployee: lead.employeeCount.toString(),
      };
    }) ?? []
  );
}

function getStatusValue(status: string): number {
  return Object.keys(LeadStatus).indexOf(status);
}

function extractPhoneDetails(phone: string): {
  countryCode: string;
  phoneNumber: string;
} {
  const [countryCode = "", ...phoneParts] = phone.split(" ");
  return { countryCode, phoneNumber: phoneParts.join("") };
}

export function adaptToLeadType(
  data: LeadDataType | FormAddTenant,
  status: string
) {
  const commonFields = {
    status: getStatusValue(status),
    email: data.email || "",
  };

  if ("leadName" in data) {
    // Handling LeadDataType
    const { countryCode, phoneNumber } = extractPhoneDetails(data.phone);
    const [firstName = "", ...lastNameParts] = data.leadName.split(" ");

    return {
      ...commonFields,
      firstName,
      lastName: lastNameParts.join(" ") || "",
      companyName: data.employer || "",
      phoneNumber,
      countryCode,
      employeeCount: Number(data?.numberOfEmployee) || 0,
    };
  }
  return {
    ...commonFields,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    companyName: data.company || "",
    phoneNumber: data.mobileNumber || "",
    countryCode: data.countryCode.code || "",
    employeeCount: Number(data?.numberOfEmployee) || 0,
  };
}
