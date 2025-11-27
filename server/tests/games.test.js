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

describe("Games routes", () => {
  let token;

  beforeAll(async () => {
    const user = {
      name: "Gamer",
      email: "gamer@example.com",
      password: "secure123"
    };
    await request(app).post("/api/auth/signup").send(user);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    token = res.body.token;
  });

  test("record score and get leaderboard", async () => {
    const scorePayload = { game: "memory-match", score: 42, meta: {} };
    const rec = await request(app)
      .post("/api/games/record-score")
      .set("Authorization", `Bearer ${token}`)
      .send(scorePayload);
    expect([200, 201]).toContain(rec.statusCode);

    const lb = await request(app).get("/api/games/leaderboard/memory-match");
    expect(lb.statusCode).toBe(200);
    expect(Array.isArray(lb.body)).toBe(true);
  });
});
