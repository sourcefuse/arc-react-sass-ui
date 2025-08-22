import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { useFilteredPermissions } from "Hooks/useFilterByPermission";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import sideNavConfig from "./sideNavConfig";
import SideNavLink from "./SideNavLink";
import useConfig from "Hooks/useConfig";
import { useGetAdminSettingsQuery } from "redux/app/configurationApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";

interface Props {
  isPermanent: boolean;
  open: boolean;
  drawerWidth: number;
  toggleDrawer: React.ReactEventHandler<{}>;
  isAppBarFullWidth: boolean;
}

const SideNav: React.FC<Props> = ({
  isPermanent,
  drawerWidth,
  toggleDrawer,
  open,
  isAppBarFullWidth,
}) => {
  const location = useLocation();

  const [sideNavList] = useState(sideNavConfig);
  const { hashSecret } = useSelector((state: RootState) => state.auth);
  const { data: adminSettings } = useGetAdminSettingsQuery(undefined, {
    skip: !hashSecret,
  });
  const { grafanaUrl } = useConfig().config;

  const getGrafanaUrl = () => {
    if (adminSettings?.observabilityUrl) {
      return adminSettings.observabilityUrl;
    }
    return grafanaUrl;
  };

  const filteredNavList = useFilteredPermissions(sideNavList);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          display: "flex",
          flexDirection: "column",
          top: "unset !important",
        },
      }}
      variant="permanent"
      data-testid="sidenav"
    >
      <List
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          paddingLeft: 2,
          paddingTop: 3,
        }}
      >
        {filteredNavList.map((sideNavConfigItem) => (
          <SideNavLink
            key={`${sideNavConfigItem.link}`}
            location={location}
            {...sideNavConfigItem}
            link={
              sideNavConfigItem.isExternal
                ? getGrafanaUrl()
                : sideNavConfigItem.link
            }
          />
        ))}
      </List>
    </Drawer>
  );
};
export default SideNav;
