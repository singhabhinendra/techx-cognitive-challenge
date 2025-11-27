const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

module.exports = {
  start: async () => {
    // If a MONGO_URI is provided (e.g. in CI services), use it and
    // avoid starting mongodb-memory-server which can fail on some
    // runner images due to missing native libs (libcrypto.so.1.1).
    const provided = process.env.MONGO_URI || process.env.MONGO_URL;
    if (provided) {
      await mongoose.connect(provided, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      return provided;
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return uri;
  },
  stop: async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    if (mongoServer) await mongoServer.stop();
  }
};
