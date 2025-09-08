import { Grid, InputAdornment, MenuItem, Select } from "@mui/material";
import FormInput from "Components/Forms/FormInput";
import { FormikValues, useFormikContext } from "formik";
import { StyleUtils } from "Helpers/styleUtils";
import { countryCodes } from "./addTenantsUtils";
import { FC } from "react";
interface Props {
  isEdit?: boolean;
}
const AddTenantDetail: FC<Props> = ({ isEdit }) => {
  const { values, handleBlur } = useFormikContext<FormikValues>();

  return (
    <Grid container spacing={4} rowSpacing={4}>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="company"
          name="company"
          label="Company"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="designation"
          name="designation"
          label="Designation"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="firstName"
          name="firstName"
          label="First Name"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="lastName"
          name="lastName"
          label="Last Name"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="key"
          name="key"
          label="Subdomain"
          required={true}
          onBlur={handleBlur}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
          readOnly={isEdit}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: "flex", gap: 1 }}>
        <FormInput
          fullWidth
          id="mobileNumber"
          name="mobileNumber"
          label="Mobile Number"
          labelSx={StyleUtils.labelStyleAdornment}
          required={true}
          onBlur={handleBlur}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
          }}
          inputSx={StyleUtils.getBaseInputStyle}
          readOnly={isEdit}
          startAdornment={
            <InputAdornment
              position="start"
              sx={{
                ...StyleUtils.inputAdornment,
              }}
            >
              <Select
                data-testid="country-code-select"
                variant="standard"
                disableUnderline
                disabled={isEdit}
                defaultValue={values?.countryCode?.code}
                sx={{
                  ...StyleUtils.selectBox,
                }}
              >
                {countryCodes.map((option) => (
                  <MenuItem
                    key={option.code}
                    value={option.code}
                    data-testid={`country-code-${option.code}`}
                  >
                    {option.code}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="language"
          name="language"
          label="Language"
          onBlur={handleBlur}
          required={true}
          readOnly
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormInput
          fullWidth
          id="tier"
          name="tier"
          label="Tier"
          onBlur={handleBlur}
          required={true}
          readOnly
          value={values.tier.label}
          labelSx={StyleUtils.labelStyle}
          inputSx={StyleUtils.inputStyles}
        />
      </Grid>
    </Grid>
  );
};

export default AddTenantDetail;
