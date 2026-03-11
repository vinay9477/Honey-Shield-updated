const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// ADD LOG
router.post("/", async (req, res) => {
  const { userId, ip, type, message } = req.body;
  const log = new Log({ userId, ip, type, message });
  await log.save();
  res.json({ message: "Log stored" });
});

// VIEW LOGS - Filter by userId from query parameter
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};

    // If userId is provided, filter by that user
    if (userId) {
      query = { userId: userId };
    }

    const logs = await Log.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// VIEW LOGS BY USERID (Route parameter) - For specific user
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
