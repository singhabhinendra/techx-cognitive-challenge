require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/techx_cognitive");

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

app.get("/", (req, res) => res.json({ ok: true, name: "TechX Cognitive API" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
