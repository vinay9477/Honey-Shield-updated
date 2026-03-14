const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false   // 🔥 CHANGE THIS
    },
    ip: String,
    type: String,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
