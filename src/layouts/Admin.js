import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import Sidebar from "components/Sidebar/Sidebar.js";
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

const useStyles = makeStyles(styles);

export default function Admin() {
  const classes = useStyles();
  const location = useLocation();
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleImageClick = (image) => setImage(image);
  const handleColorClick = (color) => setColor(color);
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const getRoute = () => {
    return location.pathname !== "/admin/maps";
  };

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      if (prop.collapse && prop.views) {
        return prop.views
          .filter((view) => view.layout === "/admin")
          .map((view, idx) => (
            <Route
              path={view.path}
              element={<view.component />}
              key={`${key}-${idx}`}
            />
          ));
      } else if (prop.layout === "/admin") {
        return [
          <Route path={prop.path} element={<prop.component />} key={key} />,
        ];
      } else {
        return [];
      }
    });
  };

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Creative Tim"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
      />
      <div className={classes.mainPanel}>
        <Navbar routes={routes} handleDrawerToggle={handleDrawerToggle} />
        <div
          className={clsx({
            [classes.content]: getRoute(),
            [classes.map]: !getRoute(),
          })}
        >
          <div className={getRoute() ? classes.container : null}>
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </div>
        </div>
        {getRoute() ? <Footer /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        />
      </div>
    </div>
  );
}
