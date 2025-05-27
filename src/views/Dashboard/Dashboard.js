import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TaskPage from "../TaskPage/TaskPage.js";

import { Typography, FormControlLabel } from "@material-ui/core";

import { Checkbox } from "@material-ui/core";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";
//import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Badge, Menu, MenuItem } from "@material-ui/core";

function Dashboard() {
  const [materialData, setMaterialData] = useState([]);
  const [disinfectantData, setDisinfectantData] = useState([]);
  //const [username, setUsername] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  //const [alerts, setAlerts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/cash/transactions/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Transaction verisi alınamadı", error);
    }
    console.log("Transactions:", transactions);
  };

  // Cash in ve cash out toplamlarını hesapla
  const totalCashIn = transactions
    .filter((tx) => tx.transaction_type === "IN")
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const totalCashOut = transactions
    .filter((tx) => tx.transaction_type === "OUT")
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const data = [
    { name: "Cash In", value: parseFloat(totalCashIn) },
    { name: "Cash Out", value: parseFloat(totalCashOut) },
  ];
  console.log("Cash In:", totalCashIn, "Cash Out:", totalCashOut);

  const COLORS = ["#0088FE", "#FF8042"];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/stocks/api/stock-alerts/",
          authHeaders
        );
        if (Array.isArray(res.data.alerts)) {
          setNotifications(res.data.alerts); // alerts dizisini doğrudan state'e koy
        } else {
          console.error("Beklenmeyen bildirim formatı:", res.data);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Bildirimler alınamadı:", err);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const token = localStorage.getItem("access_token");
  const authHeaders = {
    headers: { Authorization: `Token ${token}` },
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/stocks/api/materials/",
          authHeaders
        );
        setMaterialData(res.data);
      } catch (err) {
        console.error("Material verileri alınamadı", err);
      }
    };

    const fetchDisinfectants = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/stocks/api/disinfectants/",
          authHeaders
        );
        setDisinfectantData(res.data);
      } catch (err) {
        console.error("Disinfectant verileri alınamadı", err);
      }
    };

    /*const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/accounts/api/user/",
          authHeaders
        );
        setUsername(res.data.username);
      } catch (err) {
        console.error("Kullanıcı alınamadı", err);
      }
    }; */

    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/store/api/deliveries/",
          authHeaders
        );
        const pending = res.data.filter((d) => !d.is_delivered);
        setDeliveries(pending);
      } catch (err) {
        console.error("Teslimat verisi alınamadı:", err);
      }
    };

    if (token) {
      fetchMaterials();
      fetchDisinfectants();
      //fetchUser();
      fetchDeliveries();
    }
  }, [token]);

  const handleMarkDelivered = async (id) => {
    try {
      await axios.get(
        `http://127.0.0.1:8000/store/api/deliveries/${id}/mark_as_delivered/`,
        authHeaders
      );
      setDeliveries((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Teslim etme hatası:", err);
    }
  };

  return (
    <Grid container spacing={2} padding={2}>
      <Grid container spacing={2} padding={2}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 20,
          }}
        >
          <IconButton color="inherit" onClick={handleBellClick}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {notifications.length === 0 ? (
              <MenuItem disabled>Hiç uyarı yok</MenuItem>
            ) : (
              notifications.map((alert, index) => (
                <MenuItem key={index}>{alert}</MenuItem> // 👈 Sadece alert
              ))
            )}
          </Menu>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card style={{ height: 300 }}>
          <CardContent>
            <h3>Cash In vs Cash Out</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  fill="#8884d8"
                  label
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      {/* Material Stocks */}
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ height: 300 }}>
          <CardContent>
            <h4 style={{ marginBottom: 10 }}>Material Stocks</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={materialData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity_in_stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Disinfectant Stocks */}
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ height: 300 }}>
          <CardContent>
            <h4 style={{ marginBottom: 10 }}>Disinfectant Stocks</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={disinfectantData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity_in_stock" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Deliveries */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Bekleyen Siparişler
            </Typography>
            {deliveries.length === 0 ? (
              <Typography variant="body2">
                Tüm teslimatlar tamamlandı.
              </Typography>
            ) : (
              deliveries.map((delivery) => (
                <FormControlLabel
                  key={delivery.id}
                  control={
                    <Checkbox
                      onChange={() => handleMarkDelivered(delivery.id)}
                    />
                  }
                  label={`${delivery.customer_name} - Ürün ID: ${delivery.item}`}
                />
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
      <div className="mt-8">
        <TaskPage />
      </div>
    </Grid>
  );
}

export default Dashboard;
