import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
  });

  const API_URL = "http://127.0.0.1:8000/cash/expenses/";

  // Get token from localStorage
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setExpenses(response.data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", amount: "", date: "" });
  };

  const handleEdit = (expense) => {
    setFormData({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.id) {
      // Güncelleme (PUT)
      await axios.put(`${API_URL}${formData.id}/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } else {
      // Yeni ekleme (POST)
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    }
    fetchExpenses();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    fetchExpenses();
  };

  return (
    <div>
      <Typography variant="h4">Expenses</Typography>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ marginTop: 10 }}
      >
        Add Expense
      </Button>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {expenses.map((exp) => (
          <Grid item xs={12} md={6} key={exp.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{exp.name}</Typography>
                <Typography>Amount: {exp.amount} TL</Typography>
                <Typography>Date: {exp.date}</Typography>
                <IconButton onClick={() => handleEdit(exp)}>✏️</IconButton>
                <IconButton onClick={() => handleDelete(exp.id)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Expense Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            margin="dense"
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            margin="dense"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
        <DialogTitle>
          {formData.id ? "Update Expense" : "Add Expense"}
        </DialogTitle>
        ...
        <Button onClick={handleSubmit}>{formData.id ? "Update" : "Add"}</Button>
      </Dialog>
    </div>
  );
};

export default ExpensePage;
