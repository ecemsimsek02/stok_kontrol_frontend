import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const ExpensePage = () => {
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
  });

  const API_URL = "http://127.0.0.1:8000/cash/expenses/";

  // Get token from localStorage
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setExpenses(response.data);
      const names = [...new Set(response.data.map((e) => e.name))];
      setExpenseOptions(names);
    } catch (error) {
      console.error("Gider verileri çekilemedi:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", amount: "", date: "" });
  };

  const handleEdit = (expense) => {
    setFormData({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
    });
    setOpen(true);
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
      if (formData.id) {
        // Güncelleme (kullanıcı editledi)
        await axios.put(`${API_URL}${formData.id}/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } else {
        // Yeni girişte aynı isimli bir gider varsa onun üstüne ekle
        const existing = expenses.find((e) => e.name === formData.name);

        if (existing) {
          const updatedData = {
            ...existing,
            amount: parseFloat(existing.amount) + parseFloat(formData.amount),
          };

          await axios.put(`${API_URL}${existing.id}/`, updatedData, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
        } else {
          // Hiç yoksa yeni kayıt oluştur
          await axios.post(API_URL, formData, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          // Yeni bir isim eklenirse, seçeneğe de ekle
          if (!expenseOptions.includes(formData.name)) {
            setExpenseOptions((prev) => [...prev, formData.name]);
          }
        }
      }

      fetchExpenses(); // Yeniden yükle
      handleClose(); // Dialogu kapat
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    fetchExpenses();
  };

  return (
    <div>
      <Typography variant="h4">{t("Expenses")}</Typography>
      <button onClick={() => i18n.changeLanguage("tr")}>Türkçe</button>
      <button onClick={() => i18n.changeLanguage("en")}>English</button>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ marginTop: 10 }}
      >
        {t("Add Expense")}
      </Button>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {expenses.map((exp) => (
          <Grid item xs={12} md={6} key={exp.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{exp.name}</Typography>
                <Typography>
                  {t("Amount")}: {exp.amount} TL
                </Typography>
                <Typography>
                  {t("Date")}: {exp.date}
                </Typography>
                <IconButton onClick={() => handleEdit(exp)}>✏️</IconButton>
                <IconButton onClick={() => handleDelete(exp.id)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Add Expense")}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>{t("Expense Name")}</InputLabel>
            <Select
              name="name"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "other") {
                  setShowOtherInput(true);
                  setFormData((prev) => ({ ...prev, name: "" }));
                } else {
                  setShowOtherInput(false);
                  setFormData((prev) => ({ ...prev, name: value }));
                }
              }}
            >
              {expenseOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
              <MenuItem value="other">{t("Other")}</MenuItem>
            </Select>
          </FormControl>

          {showOtherInput && (
            <TextField
              name="name"
              label={t("Enter Expense Name")}
              fullWidth
              margin="dense"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <TextField
            name="amount"
            label={t("Amount")}
            type="number"
            fullWidth
            margin="dense"
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            name="date"
            label={t("Date")}
            type="date"
            fullWidth
            margin="dense"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("Cancel")}</Button>
          <Button onClick={handleSubmit}>{t("Add")}</Button>
        </DialogActions>
        <DialogTitle>
          {formData.id ? "Update Expense" : "Add Expense"}
        </DialogTitle>
        ...
        <Button onClick={handleSubmit}>{formData.id ? "Update" : "Add"}</Button>
      </Dialog>
    </div>
  );
};

export default ExpensePage;
