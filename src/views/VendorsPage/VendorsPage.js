// src/views/VendorsPage/VendorsPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Button,
  Box,
  IconButton,
  CardHeader,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVendor, setNewVendor] = useState({
    name: "",
    address: "",
    phone_number: "",
  });
  const [editingVendorId, setEditingVendorId] = useState(null);

  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/api/vendors/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Vendor verileri alınamadı:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateVendor = async (e) => {
    e.preventDefault();
    try {
      if (editingVendorId) {
        await axios.put(
          `http://127.0.0.1:8000/accounts/vendors/${editingVendorId}/update/`,
          newVendor,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/accounts/vendors/new/",
          newVendor,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
      setNewVendor({ name: "", address: "", phone_number: "" });
      setEditingVendorId(null);
      fetchVendors();
    } catch (error) {
      console.error("Vendor ekleme/güncelleme hatası:", error);
    }
  };

  const handleEditVendor = (vendor) => {
    setNewVendor({
      name: vendor.name,
      address: vendor.address,
      phone_number: vendor.phone_number,
    });
    setEditingVendorId(vendor.id);
  };

  const handleDeleteVendor = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/accounts/vendors/${id}/delete/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      fetchVendors();
    } catch (error) {
      console.error("Vendor silinemedi:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Box p={4}>
      <Card>
        <CardHeader
          title={<Typography variant="h5">Vendor Yönetimi</Typography>}
          action={
            <Button
              type="submit"
              variant="contained"
              color={editingVendorId ? "warning" : "primary"}
              onClick={handleAddOrUpdateVendor}
            >
              {editingVendorId ? "Vendor Güncelle" : "Yeni Vendor"}
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ad"
                name="name"
                value={newVendor.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Adres"
                name="address"
                value={newVendor.address}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Telefon"
                name="phone_number"
                value={newVendor.phone_number}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} mt={3}>
        {vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{vendor.name}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEditVendor(vendor)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteVendor(vendor.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Adres: {vendor.address || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Telefon: {vendor.phone_number || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VendorsPage;
