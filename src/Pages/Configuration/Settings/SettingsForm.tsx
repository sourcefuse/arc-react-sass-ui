import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormInput from "Components/Forms/FormInput";
import InfoTooltip from "Components/InfoTooltip/InfoTooltip";
import InputLabel from "Components/InputLabel";
import { FormikValues, useFormikContext } from "formik";
import { settingsFormStyles } from "./settings.style";
import Button from "Components/Button";
import { FORM_CONTROL_CONFIG, IFormAdminSettings } from "./settings.utils";
import { AdminSettingValueEnum } from "Constants/enums/settings.enum";
import FormAutoCompleteInput from "Components/Forms/FormAutoCompleteInput";
import { useGetAdminSettingsQuery } from "redux/app/adminSettingsApiSlice";
import { TextField } from "@mui/material";
import { IAutoCompleteOptions } from "Components/AutoCompleteInput/AutoCompleteInput";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import { SelectNode } from "Components/Input/Input";
import FeatureCsvUpload from "./FeatureCsvUpload";

interface ISettingsForm {
  isSubmitting?: boolean;
}

const SettingsForm: React.FC<ISettingsForm> = ({ isSubmitting }) => {
  const { data } = useGetAdminSettingsQuery();
  const { handleBlur, isValid, dirty, handleSubmit } =
    useFormikContext<FormikValues>();

  const renderMultiSelectOptions = (
    id: string,
    apiData?: IFormAdminSettings
  ) => {
    const multiSelectMap: Record<string, IAutoCompleteOptions[]> = {
      tiers: apiData?.tiers ?? [],
      tags: apiData?.tags ?? [],
    };
    return multiSelectMap[id] ?? [];
  };

  const renderInput = (
    id: string,
    type: AdminSettingValueEnum,
    options?: SelectNode[]
  ) => {
    if (type === AdminSettingValueEnum.MULTISELECT)
      return (
        <FormAutoCompleteInput
          id={id}
          options={renderMultiSelectOptions(id, data)}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                {typeof option === "string" ? option : option.label}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.code === "Backspace" || event.code === "ArrowLeft") {
                  event.stopPropagation();
                }
              }}
              {...params}
            />
          )}
          fullWidth
          sx={settingsFormStyles.formMultiSelectInput}
          selectedOptions={renderMultiSelectOptions(id, data)}
        />
      );

    if (type === AdminSettingValueEnum.FEATURE_UPLOAD)
      return <FeatureCsvUpload />;

    return (
      <FormInput
        id={id}
        name={id}
        onBlur={handleBlur}
        sx={settingsFormStyles.formInput}
        renderSelect={type === AdminSettingValueEnum.DROPDOWN}
        multiple={false}
        selectOptions={options as unknown as SelectNode[]}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          if (type === AdminSettingValueEnum.INTEGER) {
            target.value = target.value.replace(/\D/g, "");
          }
        }}
      />
    );
  };

  return (
    <Box sx={settingsFormStyles.mainContainer}>
      {FORM_CONTROL_CONFIG.map(
        ({ id, label, tooltip, type, options, permissions }) => (
          <Stack key={id} sx={settingsFormStyles.formControl}>
            <PermissionWrapper requiredPermissions={permissions || []}>
              <Box sx={settingsFormStyles.formLabel}>
                <InputLabel htmlFor={id} sx={settingsFormStyles.formLabelText}>
                  {label}
                  <InfoTooltip
                    title={tooltip}
                    placement="right"
                    sx={settingsFormStyles.formTooltip}
                  />
                </InputLabel>
              </Box>
              <Box sx={settingsFormStyles.formInputContainer}>
                {renderInput(id, type, options)}
              </Box>
            </PermissionWrapper>
          </Stack>
        )
      )}
      <Box sx={settingsFormStyles.buttonContainer}>
        <PermissionWrapper
          requiredPermissions={[PermissionsEnum.UpdateAdminSettings]}
        >
          <Button
            variant="contained"
            disabled={!dirty || !isValid}
            onClick={() => handleSubmit()}
            isLoading={isSubmitting}
            sx={{ px: 4, py: 1.5 }}
          >
            Save Settings
          </Button>
        </PermissionWrapper>
      </Box>
    </Box>
  );
};

export default SettingsForm;
