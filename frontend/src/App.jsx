import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateComplaint from "./pages/CreateComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import "./index.css";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  const toggleDark = () => setDark(!dark);

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: dark ? "#1a1a2e" : "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Login dark={dark} />} />
          <Route path="/register" element={<Register dark={dark} />} />
          <Route path="/dashboard" element={<Dashboard dark={dark} toggleDark={toggleDark} />} />
          <Route path="/create" element={<CreateComplaint dark={dark} />} />
          <Route path="/admin-login" element={<AdminLogin dark={dark} />} />
          <Route path="/admin" element={<AdminPanel dark={dark} toggleDark={toggleDark} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;