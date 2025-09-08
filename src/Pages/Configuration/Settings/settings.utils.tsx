import { IAutoCompleteOptions } from "Components/AutoCompleteInput/AutoCompleteInput";
import { defaultRowsPerPageOptions } from "Components/Table";
import { PermissionsEnum } from "Constants/enums";
import { AdminSettingValueEnum } from "Constants/enums/settings.enum";
import { AdminSettings } from "redux/app/types/adminSettings.type";
import * as yup from "yup";
import { selectConfigData } from "redux/config/configSlice";
import { useSelector } from "react-redux";
interface IFormControlConfig {
  id: string;
  label: string;
  tooltip: string;
  type: AdminSettingValueEnum;
  options?: any;
  permissions?: PermissionsEnum[];
}
export const FORM_CONTROL_CONFIG: IFormControlConfig[] = [
  {
    id: "observabilityUrl",
    label: "Observability URL *",
    tooltip: "URL of the Observability Dashboard",
    type: AdminSettingValueEnum.TEXTFIELD,
  },
  {
    id: "rowsPerListing",
    label: "Rows per listing *",
    tooltip:
      "No of items to be shown in a page. No of items/rows to be shown per page by default app wide.",
    type: AdminSettingValueEnum.DROPDOWN,
    options: defaultRowsPerPageOptions,
  },
  {
    id: "tiers",
    label: "Tiers *",
    tooltip:
      "Tier is used while creating a Tenant. Based on this, Tenants are created.",
    type: AdminSettingValueEnum.MULTISELECT,
  },
  {
    id: "tags",
    label: "Product Tags *",
    tooltip:
      "Product(s) name used to tag Plans. Based on these tags, Plans are shown while Adding/Editing Tenants.",
    type: AdminSettingValueEnum.MULTISELECT,
  },

  {
    id: "leadAutoClose",
    label: "No. of days Leads auto-closed after inactivity *",
    tooltip:
      "If no activity happens for a lead for x no of days, it should be marked as auto-closed.",
    type: AdminSettingValueEnum.INTEGER,
  },
  {
    id: "featureUploadCsv",
    label: "Upload Feature Csv",
    tooltip:
      "Existing features will be replaced with the features in the csv file.",
    type: AdminSettingValueEnum.FEATURE_UPLOAD,
    permissions: [PermissionsEnum.UpdateFeature, PermissionsEnum.CreateFeature],
  },
];
// Custom hook to get config and domain
export const useConfigAndDomain = () => {
  const config = useSelector(selectConfigData);
  const domain = config?.observabilityDomain?.replace(".", "\\.");
  return { config, domain };
};

// Function to get validation schema using config and domain
export const settingsValidationSchema = (config?: any, domain?: string) =>
  yup.object({
    tiers: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string(),
          label: yup.string(),
        })
      )
      .required("Cluster is required"),
    observabilityUrl: yup
      .string()
      .matches(
        new RegExp(
          `^(https?:\\/\\/)?([a-zA-Z0-9-]+\\.)+${domain}(\\/[^\\s]*)?$`
        ),
        `Enter a valid URL, it should be a subdomain of ${config?.observabilityDomain}`
      )
      .required("URL is required"),
    tags: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string(),
          label: yup.string(),
        })
      )
      .required("Product is required"),

    rowsPerListing: yup
      .number()
      .min(5, "Min value is required")
      .required("Number of rows per listing is required"),

    leadAutoClose: yup
      .number()
      .min(1, "The days should be at least 1.")
      .max(31, "The days cannot exceed 1 month.")
      .required("The days for auto close is required"),
  });

export interface IFormAdminSettings extends AdminSettings {
  tags: IAutoCompleteOptions[];
  tiers: IAutoCompleteOptions[];
}
export const initialSettingValues: IFormAdminSettings = {
  id: "",
  observabilityUrl: "",
  rowsPerListing: 5,
  leadAutoClose: 1,
  tags: [],
  tiers: [],
};
