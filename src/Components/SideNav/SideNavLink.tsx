import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, Location } from "react-router-dom";
import { SideNavConfig } from "./sideNavConfig";
import styles from "./styles";
import { Box } from "@mui/material";

const isChildOf = (child: string, parent: string) => child.startsWith(parent);

const isLinkActiveRecursive = (
  children: SideNavConfig[],
  pathname: string
): boolean => {
  return children.some((child) => {
    if (!child.visible) return false;
    if (child.link && isChildOf(pathname, child.link)) return true;
    if (child.children) return isLinkActiveRecursive(child.children, pathname);
    return false;
  });
};

const NestedNavLink = ({
  link,
  children,
  // isLinkActive,
  icon,
  label,
  location,
}: SideNavConfig & { location: Location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCollapse = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (
      children?.length &&
      isLinkActiveRecursive(children, location.pathname)
    ) {
      setIsOpen(true);
    }
  }, [children, location.pathname]);

  return (
    <>
      <ListItem
        component={link ? Link : "li"}
        to={link}
        onClick={toggleCollapse}
        sx={{
          ...styles.link,
        }}
      >
        {icon && (
          <ListItemIcon
            sx={{
              ...styles.listItemIcon,
              ...(isOpen && styles.linkItemIconActive),
            }}
          >
            {icon}
          </ListItemIcon>
        )}
        <ListItemText primary={label} disableTypography />
        {isOpen ? (
          <ExpandLessIcon
            sx={{
              ...(isOpen && styles.linkItemIconActive),
              marginLeft: "6rem",
            }}
          />
        ) : (
          <ExpandMoreIcon sx={{ marginLeft: "6rem" }} />
        )}
      </ListItem>

      {children && (
        <Collapse
          component="li"
          in={isOpen}
          timeout="auto"
          unmountOnExit
          sx={{ paddingLeft: 3 }}
        >
          <List component="ul" disablePadding>
            {children.map((childrenLink) =>
              !childrenLink.visible ? null : (
                <SideNavLink
                  key={`${childrenLink.label}-${childrenLink.type}-${childrenLink.visible}`}
                  location={location}
                  {...childrenLink}
                />
              )
            )}
          </List>
        </Collapse>
      )}
    </>
  );
};

const SideNavLink = (props: SideNavConfig & { location: Location }) => {
  if (!props?.visible) return null;
  if (props.type === "title")
    return (
      <Typography component="li" sx={styles.title}>
        {props.label}
      </Typography>
    );

  if ("type" in props && props.type === "divider")
    return <Divider component="li" sx={styles.divider} />;
  if (props.children) return <NestedNavLink {...props} />;

  const isLinkActive =
    props.link &&
    (props.location.pathname === props.link ||
      isChildOf(props.location.pathname, props.link));

  const linkComp = props.isExternal ? "a" : Link;

  return (
    <Grid component="li" sx={{ marginBlock: 0.5 }}>
      <ListItemButton
        component={props.link ? linkComp : "li"}
        to={props.link}
        target={props.isExternal ? "_blank" : undefined}
        sx={{ ...styles.link, ...(isLinkActive && styles.linkListActive) }}
        disableRipple
      >
        {props.icon ? (
          <ListItemIcon
            sx={{
              ...styles.listItemIcon,
              ...(isLinkActive && styles.linkItemIconActive),
            }}
          >
            {props.icon}
          </ListItemIcon>
        ) : (
          <Box sx={{ pl: "1rem" }}></Box>
        )}
        <ListItemText
          sx={isLinkActive ? styles.linkTextActive : {}}
          disableTypography
          primary={props.label}
        />
      </ListItemButton>
    </Grid>
  );
};

export default SideNavLink;
