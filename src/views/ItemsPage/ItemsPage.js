// src/views/ItemsPage/ItemsPage.js

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
  MenuItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    quantity: 0,
  });
  const [editingItemId, setEditingItemId] = useState(null);

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

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/store/api/items/",
        authHeaders
      );
      setItems(response.data);
    } catch (error) {
      console.error("Item verileri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/store/api/categories/",
        authHeaders
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategori verileri alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await axios.put(
          `http://127.0.0.1:8000/store/api/items/${editingItemId}/`,
          newItem,
          authHeaders
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/store/api/items/",
          newItem,
          authHeaders
        );
      }
      setNewItem({
        name: "",
        description: "",
        category: "",
        quantity: 0,
        price: 0,
        expiring_date: "",
      });
      setEditingItemId(null);
      fetchItems();
    } catch (error) {
      console.error("Item ekleme/güncelleme hatası:", error);
    }
  };

  const handleEditItem = (item) => {
    setNewItem({
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
    });
    setEditingItemId(item.id);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/store/api/items/${id}/`,
        authHeaders
      );
      fetchItems();
    } catch (error) {
      console.error("Item silinemedi:", error);
    }
  };

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
          title={<Typography variant="h5">Item Yönetimi</Typography>}
          action={
            <Button
              type="submit"
              variant="contained"
              color={editingItemId ? "warning" : "primary"}
              onClick={handleAddOrUpdateItem}
            >
              {editingItemId ? "Item Güncelle" : "Yeni Item"}
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="İsim"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Açıklama"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Kategori"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                fullWidth
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Adet"
                name="quantity"
                type="number"
                value={newItem.quantity}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} mt={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{item.name}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEditItem(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteItem(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Açıklama: {item.description || "Yok"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Kategori ID: {item.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Adet: {item.quantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ItemsPage;
