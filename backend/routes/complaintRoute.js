const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Create complaint
router.post("/", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.json({ message: "Complaint submitted ✅", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status
router.put("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" } // ✅ fixed
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete complaint
router.delete("/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;