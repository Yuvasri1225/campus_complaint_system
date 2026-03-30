require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoute");

// ✅ USE ROUTES (IMPORTANT)
app.use("/", authRoutes);              // /register, /login
app.use("/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});