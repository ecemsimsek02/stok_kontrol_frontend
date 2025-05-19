import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";

const getUserRole = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return parsed.role || null; // "AD", "OP", "EX"
    } catch (e) {
      console.error("userInfo çözümlenemedi:", e);
      return null;
    }
  }
  return null;
};

const CashboxPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [cashRegisters, setCashRegisters] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRegister, setEditingRegister] = useState(null);
  const [editRegisterDialogOpen, setEditRegisterDialogOpen] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [newRegisterData, setNewRegisterData] = useState({
    date: "", // veya bugünün tarihi
  });
  const [formData, setFormData] = useState({
    id: null,
    cash_register: "",
    amount: "",
    transaction_type: "IN",
    description: "",
  });

  const API_URL = "http://127.0.0.1:8000/cash/transactions/";
  const REGISTER_API = "http://127.0.0.1:8000/cash/cash_registers/";
  const token = localStorage.getItem("access_token");
  const role = getUserRole();
  console.log("Token:", token);
  console.log("Rol:", role);
  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchCashRegisters();
    } else {
      console.error("Token bulunamadı!");
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setTransactions(response.data);
    } catch (error) {
      console.error("Transaction verisi alınamadı", error);
    }
  };

  const fetchCashRegisters = async () => {
    try {
      const response = await axios.get(REGISTER_API, {
        headers: {
          Authorization: `Token ${localStorage.getItem("access_token")}`,
        },
      });

      setCashRegisters(response.data);
      if (response.data.length > 0 && !formData.cash_register) {
        setFormData((prev) => ({
          ...prev,
          cash_register: response.data[0].id,
        }));
      }
    } catch (error) {
      console.error("Cash register verisi alınamadı", error);
    }
  };

  const handleDeleteRegister = async (id) => {
    try {
      await axios.delete(`${REGISTER_API}${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchCashRegisters();
      fetchTransactions();
    } catch (error) {
      console.error("Kayıt silinemedi:", error);
    }
  };

  const handleEditRegister = (reg) => {
    setEditingRegister(reg);
    setEditRegisterDialogOpen(true);
  };

  const handleOpen = () => {
    setFormData({
      id: null,
      cash_register: cashRegisters[0]?.id || "",
      amount: "",
      transaction_type: "IN",
      description: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      cash_register: cashRegisters[0]?.id || "",
      amount: "",
      transaction_type: "IN",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const data = {
      cash_register: formData.cash_register,
      amount: parseFloat(formData.amount),
      transaction_type: formData.transaction_type,
      description: formData.description,
    };

    try {
      if (formData.id) {
        await axios.put(`${API_URL}${formData.id}/`, data, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }
      fetchTransactions();
      fetchCashRegisters(); // Balance güncellendiği için tekrar getir
      handleClose();
    } catch (error) {
      console.error("Kayıt işlemi başarısız", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      fetchTransactions();
      fetchCashRegisters(); // Balance güncellendiği için tekrar getir
    } catch (error) {
      console.error("Silme işlemi başarısız", error);
    }
  };

  const handleEdit = (tx) => {
    setFormData({
      id: tx.id,
      cash_register: tx.cash_register,
      amount: tx.amount,
      transaction_type: tx.transaction_type,
      description: tx.description,
    });
    setOpen(true);
  };
  if (role !== "AD") {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h5" color="error">
          Bu sayfaya yalnızca admin kullanıcıları erişebilir.
        </Typography>
      </div>
    );
  }
  return (
    <div>
      <Typography variant="h4">Cash Transactions</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginTop: 10 }}
      >
        Add Transaction
      </Button>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {transactions.map((tx) => (
          <Grid item xs={12} md={6} key={tx.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {tx.transaction_type === "IN" ? "Cash In" : "Cash Out"} -{" "}
                  {tx.amount} TL
                </Typography>
                <Typography>{tx.description}</Typography>
                <Typography>
                  Date: {new Date(tx.created_at).toLocaleString()}
                </Typography>
                <div style={{ marginTop: 8 }}>
                  <IconButton onClick={() => handleEdit(tx)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tx.id)}>
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" style={{ marginTop: 32 }}>
        Cash Registers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenRegisterDialog(true)}
        style={{ marginTop: 10 }}
      >
        Yeni Cash Register
      </Button>
      <Grid container spacing={2} style={{ marginTop: 8 }}>
        {cashRegisters.map((reg) => (
          <Grid item xs={12} md={4} key={reg.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Date: {new Date(reg.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  Balance: {reg.balance} TL
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Date: {new Date(reg.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  Balance: {reg.balance} TL
                </Typography>
                <div style={{ marginTop: 8 }}>
                  <IconButton onClick={() => handleEditRegister(reg)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteRegister(reg.id)}>
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData.id ? "Update Transaction" : "Add Transaction"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            name="cash_register"
            label="Cash Register"
            fullWidth
            margin="dense"
            value={formData.cash_register}
            onChange={handleChange}
          >
            {cashRegisters.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.date} - {reg.balance} TL
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            select
            name="transaction_type"
            label="Transaction Type"
            fullWidth
            margin="dense"
            value={formData.transaction_type}
            onChange={handleChange}
          >
            <MenuItem value="IN">Cash In</MenuItem>
            <MenuItem value="OUT">Cash Out</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
      >
        <DialogTitle>Yeni Cash Register</DialogTitle>
        <DialogContent>
          <TextField
            label="Tarih"
            type="date"
            name="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={newRegisterData.date}
            onChange={(e) =>
              setNewRegisterData({ ...newRegisterData, date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegisterDialog(false)}>Vazgeç</Button>
          <Button
            onClick={async () => {
              try {
                await axios.post(
                  REGISTER_API,
                  { date: newRegisterData.date },
                  {
                    headers: {
                      Authorization: `Token ${token}`,
                    },
                  }
                );
                setOpenRegisterDialog(false);
                fetchCashRegisters(); // Listeyi güncelle
              } catch (error) {
                console.error(
                  "Cash register eklenemedi:",
                  error.response?.data || error
                );
              }
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editRegisterDialogOpen}
        onClose={() => setEditRegisterDialogOpen(false)}
      >
        <DialogTitle>Update Cash Register</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Balance"
            type="number"
            fullWidth
            value={editingRegister?.balance || ""}
            onChange={(e) =>
              setEditingRegister((prev) => ({
                ...prev,
                balance: parseFloat(e.target.value),
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRegisterDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await axios.put(
                  `${REGISTER_API}${editingRegister.id}/`,
                  editingRegister,
                  {
                    headers: {
                      Authorization: `Token ${token}`,
                    },
                  }
                );
                setEditRegisterDialogOpen(false);
                fetchCashRegisters();
              } catch (error) {
                console.error("Cash register güncellenemedi", error);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CashboxPage;
