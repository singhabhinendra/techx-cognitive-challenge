const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game: { type: String, required: true, index: true },
  score: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

ScoreSchema.index({ game: 1, score: -1 });

module.exports = mongoose.model("Score", ScoreSchema);
