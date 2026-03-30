const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  complaint: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);