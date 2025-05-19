import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [disinfectants, setDisinfectants] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    disinfectant: "",
    material: "",
    quantity: "",
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
    fetchRecipes();
    fetchDisinfectants();
    fetchMaterials();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stocks/api/recipes/",
        authHeaders
      );
      setRecipes(res.data);
    } catch (err) {
      console.error("Tarifler alınamadı:", err);
    }
  };

  const fetchDisinfectants = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stocks/api/disinfectants/",
        authHeaders
      );
      setDisinfectants(res.data);
    } catch (err) {
      console.error("Dezenfektanlar alınamadı:", err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stocks/api/materials/",
        authHeaders
      );
      setMaterials(res.data);
    } catch (err) {
      console.error("Malzemeler alınamadı:", err);
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
          `http://127.0.0.1:8000/stocks/api/recipes/${editingId}/update/`,
          formData,
          authHeaders
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://127.0.0.1:8000/stocks/api/recipes/",
          formData,
          authHeaders
        );
      }
      setFormData({ disinfectant: "", material: "", quantity: "" });
      fetchRecipes();
    } catch (err) {
      console.error("Kaydetme hatası:", err);
    }
  };

  const handleEdit = (recipe) => {
    setEditingId(recipe.id);
    setFormData({
      disinfectant: recipe.disinfectant,
      material: recipe.material,
      quantity: recipe.quantity,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/stocks/api/recipes/${id}/delete/`,
        authHeaders
      );
      fetchRecipes();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Tarif Yönetimi</Typography>

        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Dezenfektan</InputLabel>
              <Select
                name="disinfectant"
                value={formData.disinfectant}
                onChange={handleChange}
              >
                {disinfectants.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Malzeme</InputLabel>
              <Select
                name="material"
                value={formData.material}
                onChange={handleChange}
              >
                {materials.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.unit})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Miktar"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingId ? "Güncelle" : "Ekle"}
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Tarif Listesi
        </Typography>
        {recipes.map((recipe) => {
          const disinfectant = disinfectants.find(
            (d) => d.id === recipe.disinfectant
          );
          const material = materials.find((m) => m.id === recipe.material);

          return (
            <Card key={recipe.id} sx={{ my: 1, p: 2 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={9}>
                  <Typography>
                    <strong>Dezenfektan:</strong>{" "}
                    {disinfectant?.name || recipe.disinfectant} |
                    <strong> Malzeme:</strong>{" "}
                    {material?.name || recipe.material} |
                    <strong> Miktar:</strong> {recipe.quantity}{" "}
                    {material?.unit || ""}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => handleEdit(recipe)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(recipe.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecipePage;
