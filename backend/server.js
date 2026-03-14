const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const logRoutes = require("./routes/log.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/logs", logRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Honeypot Enabled Authentication System API Running");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const decoyRoutes = require("./routes/decoy.routes");
app.use("/api/decoy", decoyRoutes);
