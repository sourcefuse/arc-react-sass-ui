import { LeadType } from "redux/app/types";
import * as yup from "yup";

export const countryCodes = [{ code: "+91", label: "India" }];

export const steps = ["Tenant Details", "Plan Details", "Documents"];

export interface CountryCode {
  code: string;
  label: string;
}

export type PlanSelectedType = {
  tagId: string | undefined;
  planId: string | undefined;
  name: string | undefined;
  duration: string | undefined;
  amount: string | number | undefined;
  billingCycleId: string | undefined;
};

export type TierType = {
  label: string;
  value: string;
};

export interface FormAddTenant {
  firstName: string;
  lastName: string;
  company: string;
  designation: string;
  email: string;
  countryCode: CountryCode;
  mobileNumber: string;
  language: string;
  billingCycle: string;
  clusterId: string;
  selectedPlans: PlanSelectedType[];
  tier: TierType;
  files: File[];
  key: string;
  numberOfEmployee?: number;
}

export enum PlanTypeNames {
  Standard = "Standard",
  Custom = "Custom",
}

export enum BillingTypes {
  Monthly = "monthly",
  Yearly = "yearly",
}

export const billingDefaultData = {
  Monthly: "monthly",
  Yearly: "yearly",
} as const;

export type BillingCycleType = {
  id: string;
  cycleName: string;
  duration: number;
  durationUnit: string;
  description: string;
  deleted: boolean;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
};

export const planTypes = [
  {
    id: PlanTypeNames.Standard,
    name: "Standard",
  },
  {
    id: PlanTypeNames.Custom,
    name: "Custom",
  },
];

export type TenantOnBoardContactType = {
  firstName: string;
  lastName: string;
  email: string;
  isPrimary: boolean;
  phoneNumber: string;
  countryCode: string;
  designation: string;
};

export type TenantOnBoardType = {
  contact: TenantOnBoardContactType;
  name: string;
  lang: string;
};

export const initialAddTenantValues: FormAddTenant = {
  firstName: "",
  lastName: "",
  company: "",
  designation: "",
  email: "",
  key: "",
  countryCode: { code: "+91", label: "India" },
  mobileNumber: "",
  language: "English",
  billingCycle: "Monthly",
  tier: { label: "", value: "" },
  clusterId: "",
  selectedPlans: [],
  files: [],
};

export const addTenantValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name should have at least 3 characters")
    .max(50, "First Name should have at most 50 characters")
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "First Name should only contain letters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(3, "Last Name should have at least 3 characters")
    .max(50, "Last Name should have at most 50 characters")
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "Last Name should only contain letters"),
  company: yup
    .string()
    .required("Company is required")
    .min(3, "Company should have at least 3 characters")
    .max(50, "Company should have at most 50 characters")
    .matches(
      /^(?![-\s])[a-zA-Z0-9\s&.,'’-]+(?<![-\s])$/,
      "Company name should only contain letters, numbers, spaces, and valid punctuation in between."
    ),
  designation: yup
    .string()
    .required("Designation is required")
    .min(3, "Designation should have at least 3 characters")
    .max(50, "Designation should have at most 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Designation should only contain letters"),
  email: yup
    .string()
    .email("Invalid email address")
    .max(50, "Email should have at most 50 characters")
    .matches(
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.){1,3}[a-zA-Z]{2,7}$/,
      "Invalid email address"
    )
    .required("Email is required"),
  countryCode: yup
    .object()
    .shape({
      value: yup.string(),
      label: yup.string(),
    })
    .required("Country Code is required"),
  mobileNumber: yup
    .string()
    .required("Mobile Number is required")
    .min(10, "Mobile Number should have at least 10 numbers")
    .max(10, "Mobile Number should have at most 10 numbers"),
  language: yup.string().required("Language is required"),
  key: yup
    .string()
    .min(3, "Minimum 3 characters required")
    .max(63, "Maximum 63 characters allowed.")
    .matches(
      /^(?!-)[a-zA-Z0-9-]{3,63}(?<!-)$/,
      "Subdomain should only contain letters, numbers and hyphen in between."
    )
    .required("Subdomain is required"),
  tier: yup
    .object()
    .shape({
      value: yup.string(),
      label: yup.string(),
    })
    .required("Tier is required"),
});

export function transformLeadData(
  leadData: LeadType
): FormAddTenant & { numberOfEmployee: number } {
  const countryCodeMap: Record<string, CountryCode> = {
    "+91": { code: "+91", label: "India" },
  };

  return {
    firstName: leadData.firstName || "",
    lastName: leadData.lastName || "",
    company: leadData.companyName || "",
    designation: "",
    email: leadData.email || "",
    countryCode: countryCodeMap[leadData.countryCode] || {
      code: leadData.countryCode,
      label: "",
    },
    mobileNumber: leadData.phoneNumber || "",
    language: "English",
    billingCycle: "",
    clusterId: "",
    selectedPlans: [],
    tier: { label: "", value: "" },
    files: [],
    key: "",
    numberOfEmployee: leadData.employeeCount,
  };
}

export type TenantCreationStepType = 0 | 1 | 2;
