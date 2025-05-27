import React, { useEffect, useState } from "react";
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

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  //const [alerts, setAlerts] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity_in_stock: "",
    unit: "",
    min_stock_level: "",
  });

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

  const fetchMaterials = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/stocks/api/materials/",
      authHeaders
    );
    console.log("Materials:", res.data);
    setMaterials(res.data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);
  /*const fetchStockAlerts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stocks/api/stock-alerts/",
        authHeaders
      );
      console.log("Stock Alerts:", res.data.alerts);
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error("Uyarıları çekerken hata:", err);
    }
  }; */

  useEffect(() => {
    fetchMaterials();
    //fetchStockAlerts();
  }, []);

  const handleOpen = (material = null) => {
    setEditingMaterial(material);
    setFormData(
      material || {
        name: "",
        quantity_in_stock: "",
        unit: "",
        min_stock_level: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMaterial(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        quantity_in_stock: parseFloat(formData.quantity_in_stock),
        min_stock_level:
          formData.min_stock_level !== ""
            ? parseFloat(formData.min_stock_level)
            : null,
      };
      if (editingMaterial) {
        // Güncelleme sadece quantity_in_stock üzerinden yapılırsa backend'de hata olabilir.
        await axios.put(
          `http://127.0.0.1:8000/stocks/api/materials/${editingMaterial.id}/`,
          payload,
          authHeaders
        );
      } else {
        // Yeni materyal ekleme veya stok artırma
        await axios.post(
          "http://127.0.0.1:8000/stocks/api/materials/",
          payload,
          authHeaders
        );
      }
      fetchMaterials();
      //fetchStockAlerts();
      handleClose();
    } catch (err) {
      console.error("İşlem hatası:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/stocks/api/materials/${id}/`,
        authHeaders
      );
      fetchMaterials();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Materials
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>
        Add Material
      </Button>

      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        {materials.map((mat) => (
          <Grid item xs={12} md={6} lg={4} key={mat.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{mat.name}</Typography>
                <Typography>Quantity: {mat.quantity_in_stock}</Typography>
                <Typography>Unit: {mat.unit}</Typography>
                <Typography>
                  Min Stock Level:{" "}
                  {mat.min_stock_level !== null &&
                  mat.min_stock_level !== undefined
                    ? mat.min_stock_level
                    : "N/A"}
                </Typography>
                <IconButton onClick={() => handleOpen(mat)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(mat.id)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingMaterial ? "Edit" : "Add"} Material</DialogTitle>
        <DialogContent>
          {["name", "quantity_in_stock", "unit", "min_stock_level"].map(
            (field) => (
              <TextField
                key={field}
                margin="dense"
                name={field}
                label={field.replace("_", " ").toUpperCase()}
                fullWidth
                value={formData[field]}
                onChange={handleChange}
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {editingMaterial ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MaterialPage;
