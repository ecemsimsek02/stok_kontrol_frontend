// src/RoutesConfig.js

import { Routes, Route } from "react-router-dom";
import routes from "./routesoutes";
import LoginPage from "views/Login/LoginPage";
import PrivateRoute from "components/PrivateRoute";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* Başlangıçta / adresine istek geldiğinde login'e yönlendir */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {routes.map((route, index) => {
        const Component = route.component;
        const fullPath = route.layout + route.path;

        if (route.path === "/login") {
          return (
            <Route key={index} path={fullPath} element={<LoginPage />} />
          );
        }

        return (
          <Route
            key={index}
            path={fullPath}
            element={
              route.private ? (
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              ) : (
                <Component />
              )
            }
          />
        );
      })}
    </Routes>
  );
};

export default RoutesConfig;
<Route path="*" element={<Navigate to="/auth/login" />} />
