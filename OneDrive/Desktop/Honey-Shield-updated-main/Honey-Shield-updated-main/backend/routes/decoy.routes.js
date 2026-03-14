const express = require("express");
const fs = require("fs");
const router = express.Router();

router.post("/capture", (req, res) => {
  const { username, password, userAgent } = req.body;

  const log = `
[${new Date().toISOString()}]
Username: ${username}
Password: ${password}
User-Agent: ${userAgent}
-----------------------
`;

  fs.appendFileSync("decoy_logs.txt", log);

  res.json({ message: "Captured" });
});

module.exports = router;
