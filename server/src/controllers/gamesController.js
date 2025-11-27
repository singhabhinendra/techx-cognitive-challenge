const GameSession = require("../models/GameSession");
const Score = require("../models/Score");

exports.startSession = async (req, res) => {
  const { game, metadata } = req.body;
  if (!game) return res.status(400).json({ message: "Missing game" });
  try {
    const session = await GameSession.create({
      user: req.user._id,
      game,
      metadata
    });
    res.json({ sessionId: session._id, startedAt: session.startedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.recordScore = async (req, res) => {
  const { game, score, metadata, sessionId } = req.body;
  if (!game || typeof score !== "number")
    return res.status(400).json({ message: "Missing or invalid fields" });
  try {
    const s = await Score.create({ user: req.user._id, game, score, metadata });
    // update user's personal best
    const user = req.user;
    const currentBest = user.bestScores?.get(game) || 0;
    if (score > currentBest) {
      user.bestScores = user.bestScores || {};
      user.bestScores.set
        ? user.bestScores.set(game, score)
        : (user.bestScores[game] = score);
      await user.save();
    }
    // end session if provided
    if (sessionId) {
      const session = await GameSession.findById(sessionId);
      if (session) {
        session.endedAt = new Date();
        await session.save();
      }
    }
    res.status(201).json({ id: s._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.leaderboard = async (req, res) => {
  const { game } = req.params;
  if (!game) return res.status(400).json({ message: "Missing game" });
  try {
    const top = await Score.find({ game })
      .sort({ score: -1, createdAt: 1 })
      .limit(50)
      .populate("user", "name");
    const out = top.map((t) => ({
      user: t.user ? t.user.name : "Anonymous",
      score: t.score,
      date: t.createdAt
    }));
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
