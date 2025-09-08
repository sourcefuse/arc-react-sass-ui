import { Button, Grid } from "@mui/material";
import { PermissionWrapper } from "Components/PermissionWrapper";
import { PermissionsEnum } from "Constants/enums";
import React from "react";

interface IProps {
  handleCancel: () => void;
  handleSubmit: () => void;
  disableSubmitBtn?: boolean;
  hideCancelButton?: boolean;
}
const btnSize = { width: "8.125rem", height: "3.125rem" };

function RenderButton(props: IProps) {
  const { handleCancel, handleSubmit, disableSubmitBtn, hideCancelButton } =
    props;

  return (
    <Grid container spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
      {hideCancelButton && (
        <Grid item>
          <Button
            variant="outlined"
            name="cancel"
            onClick={handleCancel}
            sx={btnSize}
          >
            Cancel
          </Button>
        </Grid>
      )}
      <Grid item sx={{ flexGrow: 1, textAlign: "right" }}>
        <PermissionWrapper
          requiredPermissions={[
            PermissionsEnum.CreateTnCDocuments,
            PermissionsEnum.UpdateTnCDocuments,
          ]}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleSubmit}
            sx={btnSize}
            disabled={disableSubmitBtn}
          >
            Submit
          </Button>
        </PermissionWrapper>
      </Grid>
    </Grid>
  );
}

export default RenderButton;
