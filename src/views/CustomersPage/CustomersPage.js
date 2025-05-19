import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    loyalty_points: 0,
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Müşterileri çek
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/accounts/api/customers/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Müşteri bilgileri alınamadı:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Ekle veya güncelle
  const handleCreateOrUpdate = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    try {
      if (editingCustomerId) {
        await axios.put(
          `http://127.0.0.1:8000/accounts/customers/${editingCustomerId}/update/`,
          newCustomer,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/accounts/customers/create/",
          newCustomer,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }

      // Formu temizle
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        loyalty_points: 0,
      });
      setEditingCustomerId(null);

      // Listeyi güncelle
      const updated = await axios.get(
        "http://127.0.0.1:8000/accounts/api/customers/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCustomers(updated.data);
    } catch (error) {
      console.error("Müşteri kaydedilemedi:", error);
    }
  };

  // Sil
  const handleDelete = async (id) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/accounts/customers/${id}/delete/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Listeyi güncelle
      const updated = await axios.get(
        "http://127.0.0.1:8000/accounts/api/customers/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCustomers(updated.data);
    } catch (error) {
      console.error("Müşteri silinemedi:", error);
    }
  };

  // Güncelleme moduna geç
  const handleEdit = (customer) => {
    setNewCustomer({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      loyalty_points: customer.loyalty_points || 0,
    });
    setEditingCustomerId(customer.id);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Müşteri Listesi
      </Typography>
      <Grid container spacing={2}>
        {customers.map((customer) => (
          <Grid item xs={12} md={4} key={customer.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {customer.full_name || "Ad Soyad Yok"}
                </Typography>
                <Typography>Email: {customer.email || "Yok"}</Typography>
                <Typography>Telefon: {customer.phone || "Yok"}</Typography>
                <Typography>Adres: {customer.address || "Yok"}</Typography>
                <Typography>Puan: {customer.loyalty_points}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(customer.id)}
                  style={{ marginRight: "8px", marginTop: "10px" }}
                >
                  Sil
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(customer)}
                  style={{ marginTop: "10px" }}
                >
                  Güncelle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" mt={4} gutterBottom>
        {editingCustomerId ? "Müşteri Güncelle" : "Yeni Müşteri Ekle"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Ad"
            name="first_name"
            value={newCustomer.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Soyad"
            name="last_name"
            value={newCustomer.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={newCustomer.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Telefon"
            name="phone"
            value={newCustomer.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Adres"
            name="address"
            value={newCustomer.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Sadakat Puanı"
            name="loyalty_points"
            type="number"
            value={newCustomer.loyalty_points}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editingCustomerId ? "Güncelle" : "Ekle"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
