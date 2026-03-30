const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// ✅ Create Complaint
router.post("/", async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.status(201).json({ message: "Complaint Saved ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete
router.delete("/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully 🗑️" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;