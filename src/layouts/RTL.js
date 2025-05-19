import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Switch yerine Routes ve Redirect yerine Navigate kullanıldı
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/rtlStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

let ps;

const useStyles = makeStyles(styles);

export default function RTL({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    setFixedClasses(fixedClasses === "dropdown" ? "dropdown show" : "dropdown");
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"الإبداعية تيم"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        rtlActive
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          rtlActive
          {...rest}
        />
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              {/* React Router v6 ile switchRoutes kısmını güncelledik */}
              <Routes>
                {routes.map((prop, key) => {
                  if (prop.layout === "/rtl") {
                    return (
                      <Route
                        path={prop.layout + prop.path}
                        element={<prop.component />}
                        key={key}
                      />
                    );
                  }
                  return null;
                })}
                {/* React Router v6'da Redirect yerine Navigate kullanılır */}
                <Route path="/rtl" element={<Navigate to="/rtl/rtl-page" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Routes>
              {routes.map((prop, key) => {
                if (prop.layout === "/rtl") {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      element={<prop.component />}
                      key={key}
                    />
                  );
                }
                return null;
              })}
              <Route path="/rtl" element={<Navigate to="/rtl/rtl-page" />} />
            </Routes>
          </div>
        )}
        {getRoute() ? <Footer /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          rtlActive
        />
      </div>
    </div>
  );
}
