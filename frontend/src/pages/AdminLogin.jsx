import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import vcetLogo from "../assets/Vcet_logo.jpg";

function AdminLogin({ dark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const s = styles(dark);

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      const { role, email: userEmail, name } = res.data;
      if (role !== "admin") {
        alert("Access denied! Admins only ❌");
        return;
      }
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("name", name);
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoBar}>
          <img src={vcetLogo} alt="VCET Logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
          <h2 style={s.collegeName}>Velammal College of Engineering and Technology</h2>
          <p style={s.subtitle}>Admin Portal</p>
          <span style={s.adminTag}>🔐 Admin Access Only</span>
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Admin Email</label>
          <input style={s.input} type="email" placeholder="admin@vcet.ac.in" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button style={s.btnPrimary} onClick={handleLogin}>Sign in as Admin</button>
        <p style={s.link} onClick={() => navigate("/")}>
          Not an admin? <span style={{ color: "#7F77DD" }}>Student Login</span>
        </p>
      </div>
    </div>
  );
}

const styles = (dark) => ({
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#1a1a2e" : "#f5f5f5" },
  card: { background: dark ? "#16213e" : "#ffffff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, border: `1px solid ${dark ? "#2a2a5e" : "#3C3489"}` },
  logoBar: { textAlign: "center", marginBottom: "1.5rem" },
  collegeName: { fontSize: 14, fontWeight: 600, color: dark ? "#ffffff" : "#1a1a1a", marginTop: 8 },
  subtitle: { fontSize: 12, color: dark ? "#a0a0c0" : "#666", marginTop: 4 },
  adminTag: { display: "inline-block", marginTop: 8, background: dark ? "#2a2a5e" : "#EEEDFE", color: dark ? "#AFA9EC" : "#534AB7", fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 500 },
  formGroup: { marginBottom: "1rem" },
  label: { fontSize: 12, color: dark ? "#a0a0c0" : "#555", display: "block", marginBottom: 4 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#0f3460" : "#f9f9f9", color: dark ? "#fff" : "#1a1a1a", fontSize: 14 },
  btnPrimary: { width: "100%", padding: "11px", background: "linear-gradient(135deg, #3C3489, #26215C)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 },
  link: { textAlign: "center", marginTop: "1rem", fontSize: 13, color: dark ? "#a0a0c0" : "#666", cursor: "pointer" }
});

export default AdminLogin;