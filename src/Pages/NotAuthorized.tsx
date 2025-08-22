import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const NotAuthorized = () => (
  <Grid
    sx={{ height: 400 }}
    container
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Grid item>
      <Typography variant="h3">403 Access Denied</Typography>
      <Typography>
        We are sorry but the you are not authorized to view this page.
      </Typography>
    </Grid>
  </Grid>
);
export default NotAuthorized;
