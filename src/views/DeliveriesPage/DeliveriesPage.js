import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  //MenuItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";

const DeliveriesPage = () => {
  const { t, i18n } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  //const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    item: "",
    customer_name: "",
    phone_number: "",
    location: "",
    date: "",
    is_delivered: false,
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }
  const authHeaders = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  useEffect(() => {
    if (token) {
      fetchDeliveries();
      //fetchItems();
    }
  }, [token]);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/store/api/deliveries/",
        authHeaders
      );
      setDeliveries(res.data);
    } catch (err) {
      console.error("Teslimat verisi alınamadı:", err);
    }
  };

  /*const fetchItems = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/store/api/items/", {
        authHeaders,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Ürün verisi alınamadı:", err);
    }
  }; */

  useEffect(() => {
    fetchDeliveries();
    //fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/store/api/deliveries/${editingId}/`,
          formData,
          authHeaders
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/store/api/deliveries/",
          formData,
          authHeaders
        );
      }

      setFormData({
        item: "",
        customer_name: "",
        phone_number: "",
        location: "",
        date: "",
        is_delivered: false,
      });
      fetchDeliveries();
    } catch (err) {
      console.error("Kayıt hatası:", err);
    }
  };

  const handleEdit = (delivery) => {
    setEditingId(delivery.id);
    setFormData({
      item: delivery.item,
      customer_name: delivery.customer_name,
      phone_number: delivery.phone_number,
      location: delivery.location,
      date: delivery.date?.split("T")[0] || "",
      is_delivered: delivery.is_delivered,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/store/api/deliveries/${id}/`,
        authHeaders
      );
      fetchDeliveries();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const handleMarkDelivered = async (id) => {
    try {
      await axios.get(
        `http://127.0.0.1:8000/store/api/deliveries/${id}/mark_as_delivered/`,
        authHeaders
      );
      fetchDeliveries();
    } catch (err) {
      console.error("Teslim etme hatası:", err);
    }
  };

  return (
    <Card>
      <button onClick={() => i18n.changeLanguage("tr")}>Türkçe</button>
      <button onClick={() => i18n.changeLanguage("en")}>English</button>
      <CardContent>
        <Typography variant="h5">{t("Teslimat Yönetimi")}</Typography>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label={t("Ürün")}
              name="item"
              value={formData.item}
              onChange={handleChange}
            />
          </Grid>
          {["customer_name", "phone_number", "location", "date"].map(
            (field) => (
              <Grid item xs={12} sm={6} md={4} key={field}>
                <TextField
                  fullWidth
                  label={field.replace("_", " ").toUpperCase()}
                  name={field}
                  type={field === "date" ? "date" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  InputLabelProps={field === "date" ? { shrink: true } : {}}
                />
              </Grid>
            )
          )}
        </Grid>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          {t("Teslimatlar")}
        </Typography>
        {deliveries.map((delivery) => (
          <Card key={delivery.id} sx={{ my: 1, p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={9}>
                <Typography>
                  {delivery.customer_name} - {delivery.phone_number} (
                  {delivery.location})
                </Typography>
                <Typography variant="body2">
                  {t("Ürün")} ID: {delivery.item} | {t("Tarih")}:{" "}
                  {delivery.date?.split("T")[0]} | {t("Durum")}:{" "}
                  {delivery.is_delivered ? "Teslim edildi" : "Bekliyor"}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleEdit(delivery)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(delivery.id)}>
                  <DeleteIcon />
                </IconButton>
                {!delivery.is_delivered && (
                  <IconButton
                    onClick={() => handleMarkDelivered(delivery.id)}
                    color="success"
                  >
                    <CheckIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default DeliveriesPage;
