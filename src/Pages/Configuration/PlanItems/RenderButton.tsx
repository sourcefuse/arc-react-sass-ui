import { Grid } from "@mui/material";
import Button from "Components/Button";
import { FormikValues, useFormikContext } from "formik";

interface IProps {
  handleCancel: () => void;
  showButtonLoader?: boolean;
}
const btnSize = { width: "8.125rem", height: "3.125rem", fontSize: "1rem" };

function RenderButton(props: IProps) {
  const { isValid, dirty, handleSubmit, isSubmitting } =
    useFormikContext<FormikValues>();

  const { handleCancel, showButtonLoader = false } = props;

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
        <Button
          data-testid="submit-button"
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
          isLoading={showButtonLoader}
          sx={btnSize}
          disabled={!dirty || !isValid || isSubmitting}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default RenderButton;
