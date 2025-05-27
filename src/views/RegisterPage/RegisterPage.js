import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({}); // önceki hataları temizle

    try {
      await axios.post("http://127.0.0.1:8000/accounts/register/", {
        username,
        password,
      });

      const tokenResponse = await axios.post(
        "http://127.0.0.1:8000/api-token-auth/",
        { username, password }
      );

      if (tokenResponse.status === 200) {
        const token = tokenResponse.data.token;
        localStorage.setItem("access_token", token);
        navigate("/admin/profile");
      } else {
        alert("Token alırken bir hata oluştu.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // Hataları state'e kaydet
      } else {
        alert("Beklenmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Kayıt Ol</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          {errors.username && (
            <ul style={styles.errorList}>
              {errors.username.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {errors.password && (
            <ul style={styles.errorList}>
              {errors.password.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}

          <button type="submit" style={styles.button}>
            Kayıt Ol ve Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

// Stil objesi
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  errorList: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "-0.5rem",
    marginBottom: "-0.5rem",
    paddingLeft: "1rem",
  },
};

export default RegisterPage;
