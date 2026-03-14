const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const Log = require("../models/Log");

// ── ADMIN LOGIN ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (!admin) return res.status(401).json({ message: "Admin login failed" });
  res.json({ message: "Admin login successful" });
});

// ── ALL USERS (with log counts) ──────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });

    // Attach log count per user
    const logCounts = await Log.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } }
    ]);
    const logMap = {};
    logCounts.forEach(l => { if (l._id) logMap[l._id.toString()] = l.count; });

    const enriched = users.map(u => ({
      ...u.toObject(),
      logCount: logMap[u._id.toString()] || 0
    }));

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── SINGLE USER DETAIL ───────────────────────────────────────
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const logs = await Log.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, logs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE USER ──────────────────────────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Log.deleteMany({ userId: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── UPDATE USER SERVICE ───────────────────────────────────────
router.patch("/users/:id/service", async (req, res) => {
  try {
    const { service } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { service }, { new: true, select: "-password" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Service updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── ALL LOGS ──────────────────────────────────────────────────
router.get("/logs", async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 }).limit(500);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── STATS ─────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLogs  = await Log.countDocuments();

    const ATTACK_TYPES = ["BRUTE_FORCE","SQL_INJECTION","XSS_ATTACK","DDOS_ATTACK",
      "CSRF_TEST","KEYLOGGER","FILE_UPLOAD","INVALID_FILE_TYPE","PATH_TRAVERSAL",
      "RATE_LIMIT","HONEYPOT","BOT_DETECTED"];
    const totalThreats = await Log.countDocuments({
      type: { $in: ATTACK_TYPES }
    });

    const activeServices = await User.countDocuments({
      service: { $exists: true, $ne: "none", $ne: "" }
    });

    res.json({ totalUsers, totalLogs, totalThreats, activeServices });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;