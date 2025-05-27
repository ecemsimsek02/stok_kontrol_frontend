import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.contact_number.includes(searchTerm)
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t("Invoices")}
      </Typography>
      <button onClick={() => i18n.changeLanguage("tr")}>Türkçe</button>
      <button onClick={() => i18n.changeLanguage("en")}>English</button>
      <TextField
        label={t("Search")}
        variant="outlined"
        fullWidth
        style={{ marginBottom: "16px" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        {t("Add Invoice")}
      </Button>
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {filteredInvoices.map((invoice) => (
          <Grid item xs={12} md={6} lg={4} key={invoice.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{invoice.customer_name}</Typography>
                <Typography>
                  {t("Contact")}: {invoice.contact_number}
                </Typography>
                <Typography>
                  {t("Item")}: {invoice.item}
                </Typography>
                <Typography>
                  {t("Quantity")}: {invoice.quantity}
                </Typography>
                <Typography>
                  {t("Price")}: {invoice.price_per_item}
                </Typography>
                <Typography>
                  {t("Shipping")}: {invoice.shipping}
                </Typography>
                <Typography>
                  {t("Total")}: {invoice.total}
                </Typography>
                <Typography>
                  {t("Grand Total")}: {invoice.grand_total}
                </Typography>

                {/* 🆕 Download PDF Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginTop: "8px", marginRight: "8px" }}
                  onClick={() =>
                    window.open(
                      `http://127.0.0.1:8000/invoice/pdf/${invoice.id}/`,
                      "_blank"
                    )
                  }
                >
                  {t("Download Pdf")}
                </Button>

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
