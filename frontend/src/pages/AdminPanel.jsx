import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComplaints, updateComplaint, deleteComplaint } from "../services/api";

function AdminPanel({ dark, toggleDark }) {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const s = styles(dark);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") { alert("Access denied! ❌"); navigate("/"); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateComplaint(id, { status });
      fetchAll();
    } catch (err) {
      alert("Failed to update status ❌");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this complaint?")) {
      await deleteComplaint(id);
      fetchAll();
    }
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => (c.status || "Pending") === filter);
  const pending = complaints.filter(c => (c.status || "Pending") === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const badgeStyle = (status) => {
    if (status === "Resolved") return { background: "#EAF3DE", color: "#3B6D11" };
    if (status === "In Progress") return { background: "#EEEDFE", color: "#534AB7" };
    return { background: "#FAEEDA", color: "#854F0B" };
  };

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <div>
          <p style={{ color: "white", fontSize: 15, fontWeight: 600 }}>Admin Panel</p>
          <p style={{ color: "#c0b8ff", fontSize: 11 }}>VCET Complaint System</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={s.adminBadge}>Admin</span>
          <button style={s.navBtn} onClick={toggleDark}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button style={s.navBtn} onClick={() => { localStorage.clear(); navigate("/"); }}>
            Logout
          </button>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.statsGrid}>
          <div style={s.statCard}><p style={s.statNum}>{complaints.length}</p><p style={s.statLabel}>Total</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#854F0B" }}>{pending}</p><p style={s.statLabel}>Pending</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#534AB7" }}>{inProgress}</p><p style={s.statLabel}>In Progress</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#3B6D11" }}>{resolved}</p><p style={s.statLabel}>Resolved</p></div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={s.sectionTitle}>All complaints</p>
          <select style={s.select} value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 14, color: dark ? "#a0a0c0" : "#999" }}>No complaints found!</p>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c._id} style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <p style={s.complaintTitle}>{c.title}</p>
                <span style={{ ...s.badge, ...badgeStyle(c.status || "Pending") }}>{c.status || "Pending"}</span>
              </div>
              <p style={s.complaintDesc}>{c.description}</p>
              <p style={s.complaintMeta}>Category: {c.category} • {c.email}</p>
              <p style={s.complaintMeta}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <button style={s.actionBtn("#534AB7")} onClick={() => handleStatus(c._id, "In Progress")}>Acknowledge</button>
                <button style={s.actionBtn("#3B6D11")} onClick={() => handleStatus(c._id, "Resolved")}>Resolve</button>
                <button style={s.actionBtn("#854F0B")} onClick={() => handleStatus(c._id, "Pending")}>Set Pending</button>
                <button style={s.actionBtn("#E24B4A")} onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = (dark) => ({
  page: { minHeight: "100vh", background: dark ? "#1a1a2e" : "#f5f5f5" },
  navbar: { background: "linear-gradient(135deg, #534AB7, #7F77DD)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  adminBadge: { background: "rgba(255,255,255,0.2)", color: "white", fontSize: 11, padding: "3px 10px", borderRadius: 20 },
  navBtn: { padding: "6px 14px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, fontSize: 12, cursor: "pointer" },
  body: { padding: "1.5rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: "1.5rem" },
  statCard: { background: dark ? "#16213e" : "#fff", borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` },
  statNum: { fontSize: 22, fontWeight: 700, color: "#534AB7" },
  statLabel: { fontSize: 11, color: dark ? "#a0a0c0" : "#888", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#1a1a1a" },
  select: { fontSize: 12, padding: "4px 8px", borderRadius: 6, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#16213e" : "#fff", color: dark ? "#fff" : "#1a1a1a" },
  card: { background: dark ? "#16213e" : "#fff", borderRadius: 10, padding: "14px", marginBottom: 10, border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` },
  complaintTitle: { fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#1a1a1a" },
  complaintDesc: { fontSize: 13, color: dark ? "#a0a0c0" : "#555", margin: "4px 0" },
  complaintMeta: { fontSize: 11, color: dark ? "#7070a0" : "#888" },
  badge: { fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 500, whiteSpace: "nowrap" },
  actionBtn: (color) => ({ padding: "5px 12px", background: color, color: "white", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }),
  emptyBox: { textAlign: "center", padding: "2rem", background: dark ? "#16213e" : "#fff", borderRadius: 10, border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` }
});

export default AdminPanel;