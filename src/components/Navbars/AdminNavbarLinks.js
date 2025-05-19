import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import DashboardIcon from "@material-ui/icons/Dashboard";
/*import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js"; */
import Button from "components/CustomButtons/Button.js";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [openProfileAnchor, setOpenProfileAnchor] = React.useState(null);
  const isMdUp = useMediaQuery("(min-width:960px)");

  const handleToggleProfileMenu = (event) => {
    if (openProfileAnchor && openProfileAnchor.contains(event.target)) {
      setOpenProfileAnchor(null);
    } else {
      setOpenProfileAnchor(event.currentTarget);
    }
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileAnchor(null);
  };

  const goToProfilePage = () => {
    handleCloseProfileMenu();
    navigate("/admin/profile");
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    //localStorage.removeItem("access_token");
    //localStorage.removeItem("userInfo");
    localStorage.clear();
    window.location.href = "/auth/login";
    //window.location.reload();
    //navigate("/auth/login");
  };
  const handleDashboardClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div
      className={classes.manager}
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      {/* Dashboard Button */}
      <Button
        color={isMdUp ? "transparent" : "white"}
        justIcon={isMdUp}
        simple={!isMdUp}
        onClick={handleDashboardClick}
        className={classes.buttonLink}
      >
        <DashboardIcon className={classes.icons} />
        {!isMdUp && <p className={classes.linkText}>Dashboard</p>}
      </Button>
      <Button
        color={isMdUp ? "transparent" : "white"}
        justIcon={isMdUp}
        simple={!isMdUp}
        aria-owns={openProfileAnchor ? "profile-menu-list-grow" : null}
        aria-haspopup="true"
        onClick={handleToggleProfileMenu}
        className={classes.buttonLink}
      >
        <Person className={classes.icons} />
        {!isMdUp && <p className={classes.linkText}>Profile</p>}
      </Button>

      <Poppers
        open={Boolean(openProfileAnchor)}
        anchorEl={openProfileAnchor}
        transition
        disablePortal
        className={
          classNames({ [classes.popperClose]: !openProfileAnchor }) +
          " " +
          classes.popperNav
        }
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="profile-menu-list-grow"
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseProfileMenu}>
                <MenuList role="menu">
                  <MenuItem
                    onClick={goToProfilePage}
                    className={classes.dropdownItem}
                  >
                    Profile
                  </MenuItem>
                  <Divider light />
                  <MenuItem
                    onClick={handleLogout}
                    className={classes.dropdownItem}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Poppers>
    </div>
  );
}
/*const navigate = useNavigate();
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);

  // Using useMediaQuery to handle visibility for small screens
  const isMdUp = useMediaQuery("(min-width:960px)");

  const handleProfileClick = () => {
    //handleCloseProfile();
    setOpenProfile(null);
    navigate("/admin/profile"); // Profil sayfanın route'u buysa
  };

  const handleLogoutClick = () => {
    setOpenProfile(null); // Profil menüsünü kapat
    localStorage.removeItem("token"); // Token'ı kaldır
    navigate("/login"); // Giriş sayfasına yönlendir
  };

  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };

  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search,
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search",
            },
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>

      <Button
        color={isMdUp ? "transparent" : "white"}
        justIcon={isMdUp}
        simple={!isMdUp}
        aria-label="Dashboard"
        className={classes.buttonLink}
      >
        <Dashboard className={classes.icons} />
        {!isMdUp && <p className={classes.linkText}>Dashboard</p>}
      </Button>

      <div className={classes.manager}>
        <Button
          color={isMdUp ? "transparent" : "white"}
          justIcon={isMdUp}
          simple={!isMdUp}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          <span className={classes.notifications}>5</span>
          {!isMdUp && (
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Notification
            </p>
          )}
        </Button>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Mike John responded to your email
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You have 5 new tasks
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You{"'"}re now friend with Andrew
                    </MenuItem>
                    <MenuItem
                      onClick={handleProfileClick}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>

                    <Divider light />

                    <MenuItem
                      onClick={handleLogoutClick}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another Notification
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another One
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>

      <div className={classes.manager}>
        <Button
          color={isMdUp ? "transparent" : "white"}
          justIcon={isMdUp}
          simple={!isMdUp}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          {!isMdUp && <p className={classes.linkText}>Profile</p>}
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Settings
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}  */
