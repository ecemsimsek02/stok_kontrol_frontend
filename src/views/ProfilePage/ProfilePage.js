import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@material-ui/core";
//import DeleteIcon from "@mui/icons-material/Delete";
//import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import "./ProfilePage.css";

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    profile_picture: null,
  });
  const [editingProfileId, setEditingProfileId] = useState(null);

  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Token bulunamadı!");
    return;
  }

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/api/profiles/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setProfiles(response.data);
    } catch (error) {
      console.error("Profil verileri alınamadı", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSelectProfile = (profileId) => {
    setEditingProfileId(profileId); // Profil seçildiğinde ID'yi kaydet
  };

  const handleDelete = async () => {
    if (!editingProfileId) {
      console.error("Profil ID'si geçerli değil");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/accounts/profiles/${editingProfileId}/delete/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      fetchProfiles();
    } catch (error) {
      console.error("Silme işlemi başarısız", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingProfileId) return;

    const formData = new FormData();
    formData.append("first_name", newProfile.first_name);
    formData.append("last_name", newProfile.last_name);
    formData.append("email", newProfile.email);
    formData.append("telephone", newProfile.phone);
    formData.append("role", newProfile.role);
    formData.append("status", newProfile.status);
    if (newProfile.profile_picture) {
      formData.append("profile_picture", newProfile.profile_picture);
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/accounts/profile/${editingProfileId}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      alert("Profil güncellendi");
      resetForm();
      fetchProfiles();
    } catch (error) {
      console.error("Güncelleme başarısız", error);
    }
  };

  const handleEditClick = (profile) => {
    setNewProfile({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone: profile.telephone || "",
      role: profile.role || "",
      status: profile.status || "",
      profile_picture: null,
    });
    setEditingProfileId(profile.id);
  };

  const resetForm = () => {
    setNewProfile({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      status: "",
      profile_picture: null,
    });
    setEditingProfileId(null);
  };
  return (
    <Card>
      <button onClick={() => i18n.changeLanguage("tr")}>Türkçe</button>
      <button onClick={() => i18n.changeLanguage("en")}>English</button>
      <CardHeader
        title={<Typography variant="h4">{t("Profiller")}</Typography>}
        action={
          editingProfileId && (
            <Button
              variant="contained"
              color="warning"
              onClick={handleUpdate}
              startIcon={<EditIcon />}
            >
              {t("Profili Güncelle")}
            </Button>
          )
        }
      />
      <CardContent>
        {/* PROFIL FORM */}
        <div className="profile-form-container">
          <TextField
            label={t("Ad")}
            value={newProfile.first_name}
            onChange={(e) =>
              setNewProfile({ ...newProfile, first_name: e.target.value })
            }
          />
          <TextField
            label={t("Soyad")}
            value={newProfile.last_name}
            onChange={(e) =>
              setNewProfile({ ...newProfile, last_name: e.target.value })
            }
          />
          <TextField
            label="Email"
            value={newProfile.email}
            onChange={(e) =>
              setNewProfile({ ...newProfile, email: e.target.value })
            }
          />
          <TextField
            label={t("Telefon")}
            value={newProfile.phone}
            onChange={(e) =>
              setNewProfile({ ...newProfile, phone: e.target.value })
            }
          />
          <TextField
            label={t("Rol")}
            value={newProfile.role}
            onChange={(e) =>
              setNewProfile({ ...newProfile, role: e.target.value })
            }
          />
          <TextField
            label={t("Durum")}
            value={newProfile.status}
            onChange={(e) =>
              setNewProfile({ ...newProfile, status: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProfile({
                ...newProfile,
                profile_picture: e.target.files[0],
              })
            }
          />
        </div>

        {/* PROFIL LISTESI */}
        <div className="profile-list">
          {profiles.map((profile) => (
            <Card key={profile.id} className="profile-card">
              <div className="profile-card-header">
                {profile.image_url && (
                  <img
                    src={profile.image_url}
                    alt="Profil Fotoğrafı"
                    className="profile-image"
                  />
                )}
                <div className="profile-info">
                  <Typography variant="h6" color="primary">
                    {profile.first_name} {profile.last_name}
                  </Typography>
                  <Typography>Email: {profile.email || "N/A"}</Typography>
                  <Typography>
                    {t("Telefon")}: {profile.telephone || "N/A"}
                  </Typography>
                  <Typography>
                    {t("Rol")}: {profile.role || "N/A"}
                  </Typography>
                  <Typography>
                    {t("Durum")}: {profile.status || "N/A"}
                  </Typography>
                </div>
                <div className="profile-actions">
                  <IconButton
                    onClick={() => handleEditClick(profile)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      handleSelectProfile(profile.id);
                      handleDelete();
                    }}
                  >
                    {t("Sil")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
