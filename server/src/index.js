require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Optionally start an in-memory MongoDB for local E2E if requested
async function maybeStartMemoryDB() {
  try {
    if (process.env.USE_MEM_DB === "1") {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      process.env.MONGO_URI = uri;
      // Ensure process exits will stop mongod
      process.on("exit", async () => {
        try {
          await mongod.stop();
        } catch (e) {}
      });
      console.log("Started in-memory MongoDB for E2E");
    }
  } catch (e) {
    console.warn("Failed to start in-memory MongoDB:", e.message);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
  connectDB(
    process.env.MONGO_URI || "mongodb://localhost:27017/techx_cognitive"
  );
}

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

app.get("/", (req, res) => res.json({ ok: true, name: "TechX Cognitive API" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
