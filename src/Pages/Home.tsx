import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { selectConfigData } from "redux/config/configSlice";
import { useSelector } from "react-redux";
const border = "1px solid  #D9D9D9;";

const Home = () => {
  const configData = useSelector(selectConfigData);
  return (
    <Grid container spacing={2} sx={{ px: 4 }} data-testid="HomePage">
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          height: "425px",
          display: "flex",
          alignItems: "center",
          borderBottom: border,
        }}
      >
        <Box>
          <Typography variant="h4">
            <b> {configData?.appName} </b>
          </Typography>
          <Typography variant="subtitle2" component="div" sx={{ mt: 2 }}>
            Welcome to Super Admin Control Plane
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
