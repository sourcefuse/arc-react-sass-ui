import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import tableHeader from "../../Assets/sass-table-header.png";

const styles = {
  paperContainer: {
    backgroundImage: `url(${tableHeader})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

interface IPageHeaderProps {
  pageName: string;
  children?: React.ReactNode;
  showBackground?: boolean;
}

const PageHeader: React.FC<IPageHeaderProps> = ({
  pageName = "",
  children,
  showBackground = true,
}) => {
  return (
    <Paper
      sx={{ p: 2, borderRadius: 2, mb: 2, height: "100%", boxShadow: 0 }}
      style={showBackground ? styles.paperContainer : {}}
    >
      <Grid container spacing={2}>
        <Grid item xs={6} lg={7}>
          <Typography
            variant="h5"
            sx={{
              color: `${
                showBackground ? "background.paper" : "secondary.main"
              }`,
              mt: "0.25rem",
            }}
          >
            <b> {pageName} </b>
          </Typography>
        </Grid>
        <Grid item xs={6} lg={5}>
          {children}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PageHeader;
