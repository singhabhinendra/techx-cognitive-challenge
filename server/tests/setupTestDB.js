const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

module.exports = {
  start: async () => {
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
