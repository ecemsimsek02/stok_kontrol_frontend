import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Collapse from "@material-ui/core/Collapse";

import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const location = useLocation();
  const [collapseStates, setCollapseStates] = useState({});

  function activeRoute(routeName) {
    return location.pathname === routeName;
  }

  const handleCollapseToggle = (key) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const { color, logo, image, logoText, routes } = props;

  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        const activePro =
          prop.path === "/upgrade-to-pro" ? classes.activePro + " " : "";
        const listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.layout + prop.path),
        });
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });

        if (prop.collapse) {
          const collapseKey = `collapse_${key}`;
          return (
            <div key={key}>
              <ListItem
                button
                onClick={() => handleCollapseToggle(collapseKey)}
                className={classes.itemLink + listItemClasses}
              >
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                >
                  {prop.icon}
                </Icon>
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive,
                  })}
                  disableTypography={true}
                />
              </ListItem>
              <Collapse
                in={collapseStates[collapseKey] || false}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {prop.views.map((view, index) => (
                    <NavLink
                      to={view.layout + view.path}
                      key={index}
                      className={({ isActive }) =>
                        classNames(classes.nested, { active: isActive })
                      }
                    >
                      <ListItem button className={classes.itemLink}>
                        {view.icon &&
                          (typeof view.icon === "string" ? (
                            <Icon
                              className={classNames(
                                classes.itemIcon,
                                whiteFontClasses,
                                {
                                  [classes.itemIconRTL]: props.rtlActive,
                                }
                              )}
                            >
                              {view.icon}
                            </Icon>
                          ) : (
                            <view.icon
                              className={classNames(
                                classes.itemIcon,
                                whiteFontClasses,
                                {
                                  [classes.itemIconRTL]: props.rtlActive,
                                }
                              )}
                            />
                          ))}

                        <ListItemText
                          primary={view.name}
                          className={classes.itemText}
                        />
                      </ListItem>
                    </NavLink>
                  ))}
                </List>
              </Collapse>
            </div>
          );
        }

        return (
          <NavLink
            to={prop.layout + prop.path}
            key={key}
            className={({ isActive }) =>
              classNames(activePro, classes.item, { active: isActive })
            }
          >
            <ListItem button className={classes.itemLink + listItemClasses}>
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive,
                  })}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses, {
                    [classes.itemIconRTL]: props.rtlActive,
                  })}
                />
              )}

              <ListItemText
                primary={props.rtlActive ? prop.rtlName : prop.name}
                className={classNames(classes.itemText, whiteFontClasses, {
                  [classes.itemTextRTL]: props.rtlActive,
                })}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  const brand = (
    <div className={classes.logo}>
      <a
        href="https://www.creative-tim.com?ref=mdr-sidebar"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
        target="_blank"
        rel="noreferrer"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}
Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  color: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
