import { ContactType, TenantType } from "redux/app/types";
import { TenantDataType } from "type/tenant.type";

/**
 * Converts tenant data from API response to the format required for display.
 *
 * @param tenants - A single tenant object or an array of tenants from the API.
 * @returns A formatted tenant object or an array of formatted tenant objects.
 */
export function adaptToTenant(
  tenants: TenantType | TenantType[]
): TenantDataType | TenantDataType[] {
  const transform = (tenant: TenantType): TenantDataType => {
    const subscription = tenant.subscriptions?.[0];
    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      status: tenant.status,
      createdDate: tenant.createdOn,
      planName:
        tenant.subscriptions?.map((sub) => sub.plan?.name).join(", ") || "",
      billingDate: subscription?.createdOn || "",
      updatedAt: tenant.modifiedOn,
      lang: tenant.lang,
      tier: subscription?.tier?.label,
      key: tenant.key,
      contacts: tenant.contacts?.map((contact: ContactType) => ({
        countryCode: contact?.countryCode,
        designation: contact.designation,
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        isPrimary: contact.isPrimary,
        tenantId: contact.tenantId,
      })),
      subscriptions: tenant.subscriptions,
      files: tenant.files,
    };
  };

  return Array.isArray(tenants) ? tenants.map(transform) : transform(tenants);
}
