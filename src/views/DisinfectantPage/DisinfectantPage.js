import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
//import AddIcon from "@material-ui/icons/Add";

const DisinfectantPage = () => {
  const [disinfectants, setDisinfectants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity_in_stock: 0,
    min_stock_level: "",
  });
  /*const [productionData, setProductionData] = useState({
    disinfectant_id: "",
    quantity_to_produce: "",
  }); */
  const [editingId, setEditingId] = useState(null);
  //const [producedList, setProducedList] = useState([]);
  const [producedList] = useState([]);
  const token = localStorage.getItem("access_token");
  const authHeaders = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  useEffect(() => {
    fetchDisinfectants();
  }, []);

  const fetchDisinfectants = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stocks/api/disinfectants/",
        authHeaders
      );
      setDisinfectants(res.data);
    } catch (err) {
      console.error("Veri alınamadı:", err);
    }
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
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/stocks/api/disinfectants/${editingId}/`,
          formData,
          authHeaders
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/stocks/api/disinfectants/",
          formData,
          authHeaders
        );
      }
      setFormData({ name: "", quantity_in_stock: 0, min_stock_level: "" });
      fetchDisinfectants();
    } catch (err) {
      console.error("Kayıt hatası:", err);
    }
  };

  const handleEdit = (disinfectant) => {
    setEditingId(disinfectant.id);
    setFormData({
      name: disinfectant.name,
      quantity_in_stock: disinfectant.quantity_in_stock,
      min_stock_level: disinfectant.min_stock_level,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/stocks/api/disinfectants/${id}/`,
        authHeaders
      );
      fetchDisinfectants();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  /*const handleProductionChange = (e) => {
    const { name, value } = e.target;
    setProductionData((prev) => ({
      ...prev,
      [name]: value,
    })); 
  }; */
  const [selectedDisinfectantId, setSelectedDisinfectantId] = useState("");
  const [productionAmount, setProductionAmount] = useState(0);
  const handleProduce = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/stocks/api/produce/",
        {
          disinfectant_id: selectedDisinfectantId,
          quantity_to_produce: productionAmount,
        },
        authHeaders
      );
      alert("Üretim başarılı!");
      fetchDisinfectants(); // stokları güncelle
    } catch (err) {
      console.error("Üretim hatası:", err.response?.data || err);
      alert("Üretim başarısız!");
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Dezenfektan Yönetimi</Typography>

        {/* EKLEME / GÜNCELLEME FORMU */}
        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="name"
              label="Ad"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="quantity_in_stock"
              label="Stok Miktarı"
              type="number"
              value={formData.quantity_in_stock}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              name="min_stock_level"
              label="Minimum Stok Seviyesi"
              type="number"
              value={formData.min_stock_level}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "1rem" }}
        >
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        {/* LİSTE */}
        <Typography variant="h6" style={{ marginTop: "2rem" }}>
          Kayıtlı Dezenfektanlar
        </Typography>
        {disinfectants.map((d) => (
          <Card key={d.id} style={{ marginTop: "1rem", padding: "1rem" }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={8}>
                <Typography>{d.name}</Typography>
                <Typography variant="body2">
                  Stok: {d.quantity_in_stock} L
                </Typography>
                <Typography variant="body2">
                  Minimum Stok Seviyesi: {d.min_stock_level} L
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleEdit(d)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(d.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Card>
        ))}

        {/* ÜRETİM FORMU */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Dezenfektan Üretimi
        </Typography>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dezenfektan Seç</InputLabel>
              <Select
                value={selectedDisinfectantId}
                onChange={(e) => setSelectedDisinfectantId(e.target.value)}
              >
                {disinfectants.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Üretim Miktarı (Litre)"
              type="number"
              value={productionAmount}
              onChange={(e) => setProductionAmount(parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleProduce}
          disabled={!selectedDisinfectantId || !productionAmount}
        >
          Üret
        </Button>

        {/* ÜRETİLENLER LİSTESİ */}
        {producedList.length > 0 && (
          <>
            <Typography variant="h6" style={{ marginTop: "2rem" }}>
              Üretilen Dezenfektanlar
            </Typography>
            {producedList.map((p, index) => (
              <Typography key={index}>
                ID {p.id} → {p.quantity} L üretildi
              </Typography>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisinfectantPage;
