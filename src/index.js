/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./i18n";
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Auth from "layouts/Auth.js"; // Login sayfası için layout ekliyoruz

import "assets/css/material-dashboard-react.css?v=1.10.0";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* Giriş yapılmamışsa login sayfasına, yapılmışsa dashboard'a yönlendirme */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/rtl/*" element={<RTL />} />
      <Route path="/auth/*" element={<Auth />} /> {/* login layout */}
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
