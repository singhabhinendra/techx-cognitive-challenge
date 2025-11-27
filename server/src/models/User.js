const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bestScores: { type: Map, of: Number, default: {} }
});

module.exports = mongoose.model("User", UserSchema);
