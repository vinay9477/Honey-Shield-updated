const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// ADD LOG
router.post("/", async (req, res) => {
  const { ip, type, message } = req.body;
  const log = new Log({ ip, type, message });
  await log.save();
  res.json({ message: "Log stored" });
});

// VIEW LOGS
router.get("/", async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 });
  res.json(logs);
});

module.exports = router;
router.post("/", async (req, res) => {
  const { userId, ip, type, message } = req.body;

  await Log.create({
    userId,
    ip,
    type,
    message
  });

  res.json({ message: "Log stored" });
});
router.get("/:userId", async (req, res) => {
  const logs = await Log.find({ userId: req.params.userId })
    .sort({ createdAt: -1 });
  res.json(logs);
});
