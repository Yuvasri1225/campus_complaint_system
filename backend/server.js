require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://campus-complaint-system-khaki.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoute");

// Use routes
app.use("/", authRoutes);
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