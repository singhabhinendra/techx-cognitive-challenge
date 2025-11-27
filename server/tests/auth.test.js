process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../src/index");
const db = require("./setupTestDB");

beforeAll(async () => {
  await db.start();
});

afterAll(async () => {
  await db.stop();
});

describe("Auth routes", () => {
  test("signup and login flow", async () => {
    const user = {
      name: "Test User",
      email: "test@example.com",
      password: "pass1234"
    };

    const signupRes = await request(app).post("/api/auth/signup").send(user);
    expect(signupRes.statusCode).toBe(201);
    expect(signupRes.body).toHaveProperty("token");

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });
});
