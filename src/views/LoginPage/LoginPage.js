import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"; // CSS'i ayrı dosyaya aldık

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //const navigate = useNavigate();

  /* const handleLogin = async () => {
    localStorage.clear();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api-token-auth/",
        {
          username,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("access_token", token);

      //localStorage.setItem("userInfo", JSON.stringify(userInfo));
      const profileCheck = await axios.get(
        "http://127.0.0.1:8000/accounts/api/profiles/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (profileCheck.data.length > 0) {
        console.log("Profil verisi:", profileCheck.data);
        const currentUser = profileCheck.data[0];
        localStorage.setItem("userInfo", JSON.stringify(currentUser));
        console.log("Kayıt edilen userInfo:", currentUser);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (profileCheck.data.length === 0) {
        navigate("/admin/profile");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError("Giriş hatası! Lütfen bilgilerinizi kontrol edin.");
    }
  }; */
  const handleLogin = async () => {
    localStorage.clear(); // önceki datayı sil
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api-token-auth/",
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("access_token", token);

      // Önce giriş yapan user'ı al
      const userResponse = await axios.get(
        "http://127.0.0.1:8000/accounts/api/user/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const currentUserId = userResponse.data.id;
      console.log("Giriş yapan kullanıcı ID:", currentUserId);

      // Profil listesini al
      const profileResponse = await axios.get(
        "http://127.0.0.1:8000/accounts/api/profiles/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log("Profil datası:", profileResponse.data);

      // Giriş yapan kullanıcıya ait profili bul
      const userProfile = profileResponse.data.find(
        (profile) => profile.user.id === currentUserId
      );
      console.log("Eşleşen profil:", userProfile);

      if (userProfile) {
        localStorage.setItem("userInfo", JSON.stringify(userProfile));
        console.log("Kayıt edilen userInfo:", userProfile);
      } else {
        console.log("Kullanıcıya ait profil bulunamadı.");
      }

      // Sayfa yönlendirme
      window.location.href = userProfile
        ? "/admin/dashboard"
        : "/admin/profile";
    } catch (error) {
      setError("Giriş hatası! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Hoş geldiniz!</h2>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Giriş Yap</button>
          {error && <p className="error">{error}</p>}
          <div className="bottom-links">
            <Link to="/auth/register">Kayıt Ol</Link> |{" "}
            <Link to="/">Giriş Yap</Link>
          </div>
        </div>
        <div className="login-image">
          <img src="/images/disinfectant-login.png" alt="Disinfectant" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
