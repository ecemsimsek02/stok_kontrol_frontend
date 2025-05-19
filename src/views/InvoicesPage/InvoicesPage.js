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
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    contact_number: "",
    item: "",
    price_per_item: "",
    quantity: "",
    shipping: "",
  });

  const API_URL = "http://127.0.0.1:8000/invoice/api/invoices/";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }
    return {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      setInvoices(response.data);
    } catch (error) {
      console.error("Invoice fetch error:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpen = (invoice = null) => {
    setEditingInvoice(invoice);
    if (invoice) {
      setFormData({
        customer_name: invoice.customer_name,
        contact_number: invoice.contact_number,
        item: invoice.item,
        price_per_item: invoice.price_per_item,
        quantity: invoice.quantity,
        shipping: invoice.shipping,
      });
    } else {
      setFormData({
        customer_name: "",
        contact_number: "",
        item: "",
        price_per_item: "",
        quantity: "",
        shipping: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingInvoice(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingInvoice) {
        await axios.put(
          `${API_URL}${editingInvoice.id}/`,
          formData,
          getAuthHeaders()
        );
      } else {
        await axios.post(API_URL, formData, getAuthHeaders());
      }
      fetchInvoices();
      handleClose();
    } catch (error) {
      console.error("Invoice submit error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, getAuthHeaders());
      fetchInvoices();
    } catch (error) {
      console.error("Invoice delete error:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Invoices
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Invoice
      </Button>
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {invoices.map((invoice) => (
          <Grid item xs={12} md={6} lg={4} key={invoice.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{invoice.customer_name}</Typography>
                <Typography>Contact: {invoice.contact_number}</Typography>
                <Typography>Item: {invoice.item}</Typography>
                <Typography>Quantity: {invoice.quantity}</Typography>
                <Typography>Price: {invoice.price_per_item}</Typography>
                <Typography>Shipping: {invoice.shipping}</Typography>
                <Typography>Total: {invoice.total}</Typography>
                <Typography>Grand Total: {invoice.grand_total}</Typography>
                <IconButton onClick={() => handleOpen(invoice)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(invoice.id)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingInvoice ? "Edit Invoice" : "Add Invoice"}
        </DialogTitle>
        <DialogContent>
          {[
            "customer_name",
            "contact_number",
            "item",
            "price_per_item",
            "quantity",
            "shipping",
          ].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.replace(/_/g, " ").toUpperCase()}
              fullWidth
              value={formData[field]}
              onChange={handleChange}
              type={
                ["price_per_item", "quantity", "shipping"].includes(field)
                  ? "number"
                  : "text"
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingInvoice ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoicesPage;
