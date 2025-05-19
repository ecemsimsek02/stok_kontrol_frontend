import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    institution_name: "",
    phone_number: "",
    email: "",
    address: "",
    description: "",
    payment_details: "",
    amount: "",
    status: false,
  });

  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }
  const axiosConfig = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/bills/api/bills/",
        axiosConfig
      );
      setBills(response.data);
    } catch (error) {
      console.error("Fatura verileri alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleOpen = (bill = null) => {
    setEditingBill(bill);
    if (bill) {
      setFormData({
        ...bill,
      });
    } else {
      setFormData({
        institution_name: "",
        phone_number: "",
        email: "",
        address: "",
        description: "",
        payment_details: "",
        amount: "",
        status: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBill(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingBill) {
        await axios.put(
          `http://127.0.0.1:8000/bills/api/bills/${editingBill.id}/`,
          formData,
          axiosConfig
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/bills/api/bills/",
          formData,
          axiosConfig
        );
      }
      fetchBills();
      handleClose();
    } catch (error) {
      console.error("Fatura kaydetme hatası:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/bills/api/bills/${id}/`,
        axiosConfig
      );
      fetchBills();
    } catch (error) {
      console.error("Fatura silme hatası:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bills
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Bill
      </Button>
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {bills.map((bill) => (
          <Grid item xs={12} md={6} lg={4} key={bill.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{bill.institution_name}</Typography>
                <Typography>{bill.description}</Typography>
                <Typography>Amount: {bill.amount}</Typography>
                <Typography>
                  Status: {bill.status ? "Paid" : "Unpaid"}
                </Typography>
                <IconButton onClick={() => handleOpen(bill)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(bill.id)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editingBill ? "Edit Bill" : "Add Bill"}</DialogTitle>
        <DialogContent>
          {[
            "institution_name",
            "phone_number",
            "email",
            "address",
            "description",
            "payment_details",
            "amount",
          ].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.replace(/_/g, " ").toUpperCase()}
              fullWidth
              value={formData[field] || ""}
              onChange={handleChange}
            />
          ))}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.status}
                onChange={handleChange}
                name="status"
              />
            }
            label="Paid"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingBill ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillsPage;
