const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true   // 🔥 PREVENTS DUPLICATES
  },
  organization: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);
