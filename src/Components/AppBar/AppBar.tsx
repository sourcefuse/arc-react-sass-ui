import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Menu, MenuItem } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import headerLogo from "Assets/logo-header.png";
import CustomModal from "../CustomModal";
import ProfileCard from "../ProfileCard";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import BackdropLoader from "../BackdropLoader/BackdropLoader";
import Button from "../Button";
import { appBarStyles } from "./AppBarStyles";
import useAuth from "Hooks/useAuth";
import { useGetUserQuery } from "redux/auth/authApiSlice";

const MyAppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

interface IAppBarProps {
  open: boolean;
  isPermanent: boolean;
  toggleDrawer: () => void;
}

const AppBar = ({
  userName,
}: Partial<IAppBarProps> & { userName?: string }) => {
  const { logout, logoutLoading } = useAuth();
  const loading = false;

  const { data: userData } = useGetUserQuery();

  const handleLogout = async () => {
    if (!logoutLoading) {
      await logout();
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const handleProfileModalClose = (): void => {
    setProfileOpen(false);
  };
  const handleProfileModalOpen = (): void => {
    setProfileOpen(true);
  };

  const ariaControls = menuOpen ? "menu" : undefined;
  const ariaExpanded = menuOpen ? "true" : undefined;

  return (
    <>
      {loading ? (
        <BackdropLoader />
      ) : (
        <MyAppBar
          elevation={2}
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
          })}
        >
          <Toolbar>
            <Grid container>
              <Grid item xs={12}>
                <Box>
                  <Link to="/dashboard">
                    <img src={headerLogo} alt="logo" />
                  </Link>
                </Box>
              </Grid>
            </Grid>

            <Button
              startIcon={
                <AccountCircleIcon sx={{ fontSize: "2rem !important" }} />
              }
              endIcon={<KeyboardArrowDownIcon />}
              id="menu-button"
              aria-controls={ariaControls}
              aria-haspopup="true"
              aria-expanded={ariaExpanded}
              onClick={handleClick}
              size="large"
              sx={{ ...appBarStyles.menuButton }}
            >
              <Box sx={{ ...appBarStyles.menuButtonBox }}>{userName}</Box>
            </Button>
            <Menu
              id="menu"
              MenuListProps={{
                "aria-labelledby": "menu-button",
              }}
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              sx={{ ...appBarStyles.menu }}
            >
              <MenuItem
                onClick={handleProfileModalOpen}
                data-testid="profile-menu-btn"
              >
                My profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </Toolbar>
          <CustomModal open={profileOpen} modalWidth={500}>
            <ProfileCard
              cardTitle="My Profile"
              userName={userName}
              handleClose={handleProfileModalClose}
              userDetails={userData}
            />
          </CustomModal>
        </MyAppBar>
      )}
    </>
  );
};

export default memo(AppBar);
