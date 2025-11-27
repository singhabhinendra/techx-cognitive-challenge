const mongoose = require("mongoose");

const GameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  game: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model("GameSession", GameSessionSchema);
