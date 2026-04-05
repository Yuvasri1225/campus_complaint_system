import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import vcetLogo from "../assets/Vcet_logo.jpg";

function Login({ dark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const s = styles(dark);

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      const { role, email: userEmail, name } = res.data;
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("name", name);
      if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
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
          <p style={s.subtitle}>Campus Complaint System</p>
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Email address</label>
          <input style={s.input} type="email" placeholder="you@vcet.ac.in" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button style={s.btnPrimary} onClick={handleLogin}>Sign in</button>
        <p style={s.link} onClick={() => navigate("/register")}>
          Don't have an account? <span style={{ color: "#7F77DD" }}>Register</span>
        </p>
        <p style={s.link} onClick={() => navigate("/admin-login")}>
          Are you an admin? <span style={{ color: "#7F77DD" }}>Admin Login</span>
        </p>
      </div>
    </div>
  );
}

const styles = (dark) => ({
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#1a1a2e" : "#f5f5f5" },
  card: { background: dark ? "#16213e" : "#ffffff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` },
  logoBar: { textAlign: "center", marginBottom: "1.5rem" },
  collegeName: { fontSize: 14, fontWeight: 600, color: dark ? "#ffffff" : "#1a1a1a", marginTop: 8 },
  subtitle: { fontSize: 12, color: dark ? "#a0a0c0" : "#666", marginTop: 4 },
  formGroup: { marginBottom: "1rem" },
  label: { fontSize: 12, color: dark ? "#a0a0c0" : "#555", display: "block", marginBottom: 4 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#0f3460" : "#f9f9f9", color: dark ? "#fff" : "#1a1a1a", fontSize: 14 },
  btnPrimary: { width: "100%", padding: "11px", background: "linear-gradient(135deg, #7F77DD, #534AB7)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 },
  link: { textAlign: "center", marginTop: "1rem", fontSize: 13, color: dark ? "#a0a0c0" : "#666", cursor: "pointer" }
});

export default Login;