const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username, password });
  if (!admin) {
    return res.status(401).json({ message: "Admin login failed" });
  }

  res.json({ message: "Admin login successful" });
});

// VIEW ALL USERS
router.get("/users", async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

module.exports = router;
