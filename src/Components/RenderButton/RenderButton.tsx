import Button from "Components/Button";
import { FormikValues, useFormikContext } from "formik";
import { Grid } from "@mui/material";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";

interface IProps {
  handleCancel: () => void;
  showButtonLoader?: boolean;
  permissions: PermissionsEnum[];
}

const btnSize = { width: "8.125rem", height: "3.125rem", fontSize: "1rem" };

function RenderButton({
  handleCancel,
  showButtonLoader = false,
  permissions,
}: IProps) {
  const { isValid, dirty, handleSubmit, isSubmitting, values } =
    useFormikContext<FormikValues>();

  return (
    <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
      <Grid item>
        <Button
          variant="outlined"
          name="cancel"
          onClick={handleCancel}
          sx={btnSize}
          disabled={showButtonLoader}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item sx={{ flexGrow: 1, textAlign: "right" }}>
        <PermissionWrapper requiredPermissions={permissions}>
          <Button
            data-testid="submit-button"
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
            isLoading={showButtonLoader}
            sx={btnSize}
            disabled={!dirty || !isValid || isSubmitting}
          >
            {!values.id ? "Submit" : "Update"}
          </Button>
        </PermissionWrapper>
      </Grid>
    </Grid>
  );
}

export default RenderButton;
