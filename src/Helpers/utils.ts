import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AUTH_LOGIN_URL } from "Constants/apiConfig";
import { format } from "date-fns";
import CryptoJS from "crypto-js"; // use `crypto-js` for browser-safe hashing

export interface AnyObject {
  [key: string]: any; // NOSONAR
}

export const convertToTitleCase = (text: string) => {
  if (!text) return text;
  const result = text.replace(/([a-z])([A-Z])/g, "$1 $2");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const convertToDate = (
  input: string | number | Date,
  inputFormat = "dd/MM/yyyy"
) => {
  if (!input) return input;
  return format(new Date(input), inputFormat);
};

export const getValue = (obj: AnyObject, key: string) => {
  /*
   * \[([^\]]{1,5})] ==> This regex is capturing the text inbetween [] in a capturing group
   * .$1 ==> This regex is putting .<capturedGroup>
   * Eg. client[12].user[0].name[9].data =====>  client.12.user.0.name.9.data
   */
  const keyAfterReplaceRegex = key.replace(/\[([^\]]{1,5})]/g, ".$1");
  const subKeys = keyAfterReplaceRegex.split(".");
  return subKeys.reduce(function (acc: AnyObject, curr: string | number) {
    return acc?.[curr] || "";
  }, obj);
};

export const redirectToAuthLoginPage = (authApiBaseUrl: string) => {
  const form = document.createElement("form");
  form.action = `${authApiBaseUrl}${AUTH_LOGIN_URL}`;
  form.style.display = "none";

  document.body.appendChild(form);
  form.submit();
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 10;

export const fileExtensionsToUpload = {
  "application/pdf": [".pdf"],
};

export type SelectOption = { label: string; value: string }[];

export const CurrencyCode = {
  USD: "USD",
} as const;

export const createRelationFilter = (
  relation: string,
  additionalIncludes: object[] = []
) => ({
  relation,
  ...(additionalIncludes.length > 0 && {
    scope: { include: additionalIncludes },
  }),
});
export const getCurrencySymbol = (currency: string): string => {
  const currencySymbolMap: Record<string, string> = {
    USD: "$",
    INR: "₹",
  };
  return currencySymbolMap[currency] || "";
};

export const handleDownload = (url: string, name: string, target?: string) => {
  if (url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    if (target) {
      link.target = target;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getHashHeader = (
  hashSecretKey: string | undefined,
  body: string
): Record<string, string> => {
  const timestamp = Date.now().toString();
  const message = `${timestamp}.${body}`;
  const hash = hashSecretKey
    ? CryptoJS.HmacSHA256(message, hashSecretKey).toString()
    : "";

  return {
    "X-Timestamp": timestamp,
    "X-Body-Hash": hash,
  };
};

export function getErrorMessage(
  error: FetchBaseQueryError | undefined
): string {
  const rawErrorMessage =
    (error?.data as { error?: { message?: string } })?.error?.message ??
    "An unexpected error occurred. Please try again.";

  if (rawErrorMessage.startsWith("Unique constraint violation error")) {
    // Handle composite constraint: (name, billing_cycle_id)
    const compositeMatch = rawErrorMessage.match(
      /Key \(name, billing_cycle_id\)=\((.*?), (.*?)\)/
    );
    if (compositeMatch) {
      const planName = compositeMatch[1];
      return `The plan name "${planName}" already exists for the selected subscription type. Please choose a different name or subscription type.`;
    }

    // Handle lower(name::text) format
    const lowerMatch = rawErrorMessage.match(
      /Key \(lower\((\w+)::text\)\)=\((.*?)\)/i
    );
    if (lowerMatch) {
      const field = lowerMatch[1];
      const value = lowerMatch[2];
      const keyMap: Record<string, string> = { key: "Subdomain", name: "Name" };
      const readableField = keyMap[field] || field;
      return `The ${readableField} "${value}" is already in use. Please choose a different ${readableField}.`;
    }

    // Handle plain unique constraint: Key (name)=(...)
    const match = rawErrorMessage.match(/Key \((\w+)\)=\((.*?)\)/i);
    if (match) {
      const field = match[1];
      const value = match[2];
      const keyMap: Record<string, string> = { key: "Subdomain", name: "Name" };
      const readableField = keyMap[field] || field;
      return `The ${readableField} "${value}" is already in use. Please choose a different ${readableField}.`;
    }

    return "Unique constraint violation error";
  }

  if (rawErrorMessage.includes("The request body is invalid")) {
    return "Invalid input. Please check the entered details.";
  }

  if (rawErrorMessage.includes("Internal Server Error")) {
    return "An unexpected error occurred. Please try again.";
  }

  return rawErrorMessage;
}
