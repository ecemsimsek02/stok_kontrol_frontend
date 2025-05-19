import React from "react";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/auth/login" replace />;};
PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // element prop'unun bir React bileşeni olması gerektiğini belirtiyoruz
};

export default PrivateRoute;
