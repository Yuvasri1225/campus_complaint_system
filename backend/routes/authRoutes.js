const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User registered ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    res.json({ message: "Login success ✅", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;