/*import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@material-ui/core';

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Used Space</p>
              <h3 className={classes.cardTitle}>
                49/50 <small>GB</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Revenue</p>
              <h3 className={classes.cardTitle}>$34,245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Fixed Issues</p>
              <h3 className={classes.cardTitle}>75</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Followers</p>
              <h3 className={classes.cardTitle}>+245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
} */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { Typography, FormControlLabel } from "@material-ui/core";

import { Checkbox } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

function Dashboard() {
  const [materialData, setMaterialData] = useState([]);
  const [disinfectantData, setDisinfectantData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [username, setUsername] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("dashboardTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardTasks", JSON.stringify(tasks));
  }, [tasks]);

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

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/accounts/api/user/",
          authHeaders
        );
        setUsername(res.data.username);
      } catch (err) {
        console.error("Kullanıcı alınamadı", err);
      }
    };

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
      fetchUser();
      fetchDeliveries();
    }
  }, [token]);

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = newTaskText;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([
        ...tasks,
        { text: newTaskText, completed: false, addedBy: username },
      ]);
    }
    setNewTaskText("");
  };

  const handleDeleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleEditTask = (index) => {
    setNewTaskText(tasks[index].text);
    setEditingIndex(index);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

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
              Beklenen Teslimatlar
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

      {/* Görevler */}
      <Grid item xs={12} sm={6} md={3}>
        <Card style={{ height: 300, overflowY: "auto" }}>
          <CardContent>
            <h4>Görevler</h4>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Yeni görev"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <Button
                onClick={handleAddTask}
                variant="contained"
                color="primary"
              >
                {editingIndex !== null ? "Güncelle" : "Ekle"}
              </Button>
            </div>
            {tasks.map((task, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  padding: "4px 8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleComplete(index)}
                    color="primary"
                  />
                  <div
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.text}{" "}
                    <span style={{ fontSize: 12, color: "#777" }}>
                      – {task.addedBy} tarafından eklendi
                    </span>
                  </div>
                </div>
                <div>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTask(index)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTask(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
