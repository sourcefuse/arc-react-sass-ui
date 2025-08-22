import { IFormAdminSettings } from "Pages/Configuration/Settings/settings.utils";
import { CombinedAdminSettings } from "redux/app/types/adminSettings.type";
import { adaptToTierSelect } from "./tier.adapter";
import { adaptToTagSelect } from "./tags.adapter";

/**
 *
 * @param CombinedAdminSettings : TenantType[] is the type of tenants we get from the API
 * @returns IFormAdminSettings[] is the type of tenant we want to display in the table
 */

export function adaptToAdminSettings(
  combinedAdminSettings: CombinedAdminSettings
): IFormAdminSettings {
  return {
    ...combinedAdminSettings.adminSettings[0],
    tags: adaptToTagSelect(combinedAdminSettings.tags),
    tiers: adaptToTierSelect(combinedAdminSettings.tiers),
  };
}
