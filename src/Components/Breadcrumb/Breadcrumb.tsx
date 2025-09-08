import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import useBreadcrumbs, { BreadcrumbsRoute } from "use-react-router-breadcrumbs";

const styles = {
  breadcrumb: {
    textTransform: "capitalize",
    fontSize: 22,
    fontWeight: 700,
    color: "secondary.main",
  },
  linkBreadcrumb: {
    textDecoration: "none",
    color: "secondary.linkBreadcrumb",
    fontWeight: "bold",
    fontSize: 15,
  },
};

interface IProps {
  routes: BreadcrumbsRoute[];
}

export default function Breadcrumb(props: IProps) {
  const { routes } = props;
  const breadcrumbs = useBreadcrumbs(routes, { disableDefaults: true });

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      data-testid="breadcrumb"
    >
      {breadcrumbs.map(({ match, key, breadcrumb }, index) => (
        <Grid key={key}>
          {breadcrumbs.length - 1 === index ? (
            <Grid
              sx={{
                ...styles.breadcrumb,
              }}
            >
              {breadcrumb}
            </Grid>
          ) : (
            <Grid
              component={Link}
              sx={{
                ...styles.breadcrumb,
                ...styles.linkBreadcrumb,
              }}
              to={match?.pathname}
            >
              {breadcrumb}
            </Grid>
          )}
        </Grid>
      ))}
    </MuiBreadcrumbs>
  );
}
