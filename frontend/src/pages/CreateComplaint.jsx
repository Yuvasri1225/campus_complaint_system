import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../services/api";

function CreateComplaint({ dark }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const s = styles(dark);

  const handleSubmit = async () => {
    if (!title || !description) return alert("Please fill all fields!");
    try {
      await createComplaint({ title, description, category, email, status: "Pending" });
      alert("Complaint submitted successfully! ✅");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to submit ❌");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Back</button>
        <span style={{ color: "white", fontSize: 15, fontWeight: 600 }}>Submit Complaint</span>
        <div style={{ width: 70 }} />
      </div>
      <div style={s.body}>
        <div style={s.card}>
          <div style={s.formGroup}>
            <label style={s.label}>Title</label>
            <input style={s.input} type="text" placeholder="Brief title of your complaint" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Category</label>
            <select style={s.input} value={category} onChange={e => setCategory(e.target.value)}>
              <option>Infrastructure</option>
              <option>Facilities</option>
              <option>Academic</option>
              <option>Canteen</option>
              <option>Hostel</option>
              <option>Transportation</option>
              <option>Other</option>
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.input, height: 100, resize: "none" }}
              placeholder="Describe your complaint in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div style={s.infoBox}>
            <p style={{ fontSize: 12, color: dark ? "#c0b8ff" : "#534AB7" }}>
              Your complaint will show as <strong>Pending</strong> until the admin acknowledges it.
            </p>
          </div>
          <button style={s.btnPrimary} onClick={handleSubmit}>Submit complaint</button>
        </div>
      </div>
    </div>
  );
}

const styles = (dark) => ({
  page: { minHeight: "100vh", background: dark ? "#1a1a2e" : "#f5f5f5" },
  navbar: { background: "linear-gradient(135deg, #534AB7, #7F77DD)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  backBtn: { background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" },
  body: { padding: "1.5rem" },
  card: { background: dark ? "#16213e" : "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` },
  formGroup: { marginBottom: "1rem" },
  label: { fontSize: 12, color: dark ? "#a0a0c0" : "#555", display: "block", marginBottom: 4 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#0f3460" : "#f9f9f9", color: dark ? "#fff" : "#1a1a1a", fontSize: 14 },
  infoBox: { background: dark ? "#0f3460" : "#EEEDFE", borderRadius: 8, padding: "10px 12px", marginBottom: "1rem" },
  btnPrimary: { width: "100%", padding: "11px", background: "linear-gradient(135deg, #7F77DD, #534AB7)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }
});

export default CreateComplaint;