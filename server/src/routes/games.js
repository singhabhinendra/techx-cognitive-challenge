const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  startSession,
  recordScore,
  leaderboard
} = require("../controllers/gamesController");

router.post("/start-session", auth, startSession);
router.post("/record-score", auth, recordScore);
router.get("/leaderboard/:game", leaderboard);

module.exports = router;
