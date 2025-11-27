// Global setup for Jest tests
// Set common environment variables used by tests
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

// Optionally increase logging or other global hooks here
module.exports = async () => {
  // nothing async for now
};
