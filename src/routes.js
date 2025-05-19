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
// @material-ui/icons
//import React from "react";
//import { Routes, Route } from "react-router-dom";
//import PrivateRoute from "components/PrivateRoute.js";
import Dashboard from "@material-ui/icons/Dashboard";
//import DashboardIcon from "@material-ui/icons/Dashboard";
/*import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language"; */
//import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
//import UserProfile from "views/UserProfile/UserProfile.js";
import CustomersPage from "views/CustomersPage/CustomersPage.js";
//import LoginPage from "views/LoginPage/LoginPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import VendorsPage from "views/VendorsPage/VendorsPage.js";
import BillsPage from "views/BillsPage/BillsPage.js";
import InvoicesPage from "views/InvoicesPage/InvoicesPage.js";
import MaterialPage from "views/MaterialPage/MaterialPage.js";
import DisinfectantPage from "views/DisinfectantPage/DisinfectantPage.js";
import RecipePage from "views/RecipePage/RecipePage.js";
import CashBoxPage from "views/CashBoxPage/CashBoxPage";
import ExpensePage from "views/ExpensePage/ExpensePage";
import ItemsPage from "views/ItemsPage/ItemsPage.js";
import TransactionPage from "views/TransactionPage/TransactionPage";
import DeliveriesPage from "views/DeliveriesPage/DeliveriesPage.js";
//import RegisterPage from "views/RegisterPage/RegisterPage.js";

/*import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js"; */

// core components/views for RTL layout
//import RTLPage from "views/RTLPage/RTLPage.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    private: true,
  },
  /*{
    path: "/login",
    name: "Login",
    component: LoginPage,
    icon: "account_circle",
    layout: "/auth",
  }, */
  /*
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    icon: "account_circle",
    layout: "/auth",
  }, */
  {
    collapse: true,
    name: "Accounts",
    icon: "account_circle",
    state: "accountsCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        mini: "P",
        component: ProfilePage,
        //icon: "account_circle",
        layout: "/admin",
        private: true,
      },
      {
        path: "/customers",
        name: "Customers",
        mini: "C",
        //icon: "account_circle",
        component: CustomersPage,
        layout: "/admin",
      },
      {
        path: "/vendors",
        name: "Vendors",
        mini: "V",
        component: VendorsPage,
        //icon: "account_circle",
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Cash",
    icon: "account_balance_wallet", // İkonu değiştirebilirsin, uygun bir ikon seçtim.
    state: "cashCollapse",
    views: [
      {
        path: "/cashbox",
        name: "Cashbox",
        mini: "C",
        component: CashBoxPage, // Sayfanın bileşeni
        layout: "/admin",
        private: true, // Gerekirse private erişim ekleyebilirsin.
      },
      {
        path: "/expense",
        name: "Expense",
        mini: "E",
        component: ExpensePage, // Sayfanın bileşeni
        layout: "/admin",
      },
    ],
  },

  {
    collapse: true,
    name: "Store",
    icon: "store",
    state: "storeCollapse",
    views: [
      {
        path: "/items",
        name: "Item",
        mini: "I",
        component: ItemsPage,
        //icon: "store",
        layout: "/admin",
      },
      {
        path: "/deliveries",
        name: "Delivery",
        mini: "D",
        //icon: "store",
        component: DeliveriesPage,
        layout: "/admin",
      },
    ],
  },

  {
    collapse: true,
    name: "Stocks",
    icon: "inventory", // Material Icons'tan bir stok simgesi
    state: "stocksCollapse",
    views: [
      {
        path: "/material",
        name: "Material",
        mini: "M",
        component: MaterialPage,
        layout: "/admin",
      },
      {
        path: "/disinfectant",
        name: "Disinfectant",
        mini: "D",
        component: DisinfectantPage,
        layout: "/admin",
      },
      {
        path: "/recipe",
        name: "Recipe",
        mini: "R",
        component: RecipePage,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/bills",
    name: "Bills",
    icon: "receipt", // veya başka bir Material icon
    component: BillsPage, // bu sayfan varsa
    layout: "/admin",
  },
  {
    path: "/transactions",
    name: "Transactions", // Başlık
    icon: "shopping_cart", // Önerilen bir Material icon
    component: TransactionPage, // Yeni sayfa
    layout: "/admin", // Admin paneli içinde olacak
  },
  {
    path: "/invoices",
    name: "Invoices",
    icon: "receipt", // veya başka bir Material icon
    component: InvoicesPage, // bu sayfan varsa
    layout: "/admin",
  },
  /*{
    path: "/user",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Table List",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    rtlName: "خرائط",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },
  {
    path: "/rtl-page",
    name: "RTL Support",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Language,
    component: RTLPage,
    layout: "/rtl",
  },
  {
    path: "/upgrade-to-pro",
    name: "Upgrade To PRO",
    rtlName: "التطور للاحترافية",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin",
  }, */
];

export default dashboardRoutes;
