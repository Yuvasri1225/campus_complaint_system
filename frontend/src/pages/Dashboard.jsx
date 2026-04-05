import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComplaints, deleteComplaint, updateComplaint } from "../services/api";

function Dashboard({ dark, toggleDark }) {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "", category: "" });
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const s = styles(dark);

  useEffect(() => {
    if (!email) { navigate("/"); return; }
    fetchData();
  }, [navigate, email]);

  const fetchData = async () => {
    try {
      const res = await getComplaints();
      const mine = res.data.filter(c => c.email === email);
      setComplaints(mine);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this complaint?")) {
      await deleteComplaint(id);
      setComplaints(complaints.filter(c => c._id !== id));
    }
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setEditData({ title: c.title, description: c.description, category: c.category });
  };

  const handleUpdate = async () => {
    await updateComplaint(editId, editData);
    setEditId(null);
    fetchData();
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.avatar}>{name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <p style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{name}</p>
            <p style={{ color: "#c0b8ff", fontSize: 11 }}>Student</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={s.navBtn} onClick={() => navigate("/create")}>+ New</button>
          <button style={s.navBtn} onClick={toggleDark}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button style={s.navBtn} onClick={() => { localStorage.clear(); navigate("/"); }}>
            Logout
          </button>
        </div>
      </div>

      <div style={s.body}>
        <h2 style={s.pageTitle}>My Complaints</h2>

        <div style={s.statsGrid}>
          <div style={s.statCard}><p style={s.statNum}>{complaints.length}</p><p style={s.statLabel}>Total</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#854F0B" }}>{pending}</p><p style={s.statLabel}>Pending</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#534AB7" }}>{inProgress}</p><p style={s.statLabel}>In Progress</p></div>
          <div style={s.statCard}><p style={{ ...s.statNum, color: "#3B6D11" }}>{resolved}</p><p style={s.statLabel}>Resolved</p></div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={s.sectionTitle}>My complaints</p>
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
            <button style={{ ...s.navBtn, background: "#534AB7", marginTop: 10 }} onClick={() => navigate("/create")}>+ Submit Complaint</button>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c._id} style={s.complaintCard}>
              {editId === c._id ? (
                <div style={{ flex: 1 }}>
                  <input
                    style={s.input}
                    value={editData.title}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title" />
                  <select
                    style={{ ...s.input, marginTop: 6 }}
                    value={editData.category}
                    onChange={e => setEditData({ ...editData, category: e.target.value })}>
                    <option>Infrastructure</option>
                    <option>Facilities</option>
                    <option>Academic</option>
                    <option>Canteen</option>
                    <option>Hostel</option>
                    <option>Transportation</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    style={{ ...s.input, marginTop: 6, height: 70, resize: "none" }}
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description" />
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={handleUpdate} style={{ padding: "5px 12px", background: "#534AB7", color: "white", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ padding: "5px 12px", background: "#888", color: "white", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <p style={s.complaintTitle}>{c.title}</p>
                    <p style={s.complaintSub}>{c.category} • {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Just now"}</p>
                    <p style={{ ...s.complaintSub, marginTop: 4 }}>{c.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ ...s.badge, ...badgeStyle(c.status || "Pending") }}>{c.status || "Pending"}</span>
                    {(c.status || "Pending") === "Pending" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleEdit(c)} style={{ padding: "4px 10px", background: "#534AB7", color: "white", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(c._id)} style={{ padding: "4px 10px", background: "#E24B4A", color: "white", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Delete</button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "#AFA9EC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#26215C" },
  navBtn: { padding: "6px 14px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, fontSize: 12, cursor: "pointer" },
  body: { padding: "1.5rem" },
  pageTitle: { fontSize: 20, fontWeight: 600, color: dark ? "#fff" : "#1a1a1a", marginBottom: "1rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: "1.5rem" },
  statCard: { background: dark ? "#16213e" : "#fff", borderRadius: 12, padding: "14px", textAlign: "center", border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` },
  statNum: { fontSize: 24, fontWeight: 700, color: "#534AB7" },
  statLabel: { fontSize: 11, color: dark ? "#a0a0c0" : "#888", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#1a1a1a" },
  select: { fontSize: 12, padding: "4px 8px", borderRadius: 6, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#16213e" : "#fff", color: dark ? "#fff" : "#1a1a1a" },
  complaintCard: { background: dark ? "#16213e" : "#fff", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  complaintTitle: { fontSize: 14, fontWeight: 500, color: dark ? "#fff" : "#1a1a1a" },
  complaintSub: { fontSize: 11, color: dark ? "#a0a0c0" : "#888", marginTop: 2 },
  badge: { fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 500, whiteSpace: "nowrap" },
  input: { width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${dark ? "#2a2a5e" : "#ddd"}`, background: dark ? "#0f3460" : "#f9f9f9", color: dark ? "#fff" : "#1a1a1a", fontSize: 13 },
  emptyBox: { textAlign: "center", padding: "2rem", background: dark ? "#16213e" : "#fff", borderRadius: 10, border: `1px solid ${dark ? "#2a2a5e" : "#e0e0e0"}` }
});

export default Dashboard;