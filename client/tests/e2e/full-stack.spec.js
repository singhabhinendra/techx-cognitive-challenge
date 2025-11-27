const { test, expect } = require("@playwright/test");

test("signup -> record score -> leaderboard shows entry", async ({
  page,
  request
}) => {
  // Create account via backend API
  const email = `e2e_${Date.now()}@example.com`;
  const signup = await request.post("http://localhost:4000/api/auth/signup", {
    data: { name: "E2E User", email, password: "password123" }
  });
  expect(signup.ok()).toBeTruthy();
  const body = await signup.json();
  expect(body).toHaveProperty("token");
  const token = body.token;

  // Post a score using the backend API
  const scoreResp = await request.post(
    "http://localhost:4000/api/games/record-score",
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { game: "memory-match", score: 77, meta: {} }
    }
  );
  expect([200, 201]).toContain(scoreResp.status());

  // Open frontend leaderboard and verify the user+score appears
  await page.goto("/");
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");

  // The leaderboard renders an ordered list with items where the user and score appear
  await page.waitForSelector("ol.list-decimal");
  const list = page.locator("ol.list-decimal li");
  const cnt = await list.count();
  let matched = false;
  for (let i = 0; i < cnt; i++) {
    const li = list.nth(i);
    const userSpan = li.locator("span").first();
    const scoreSpan = li.locator("span.font-mono");
    const userText = (await userSpan.innerText()).trim();
    const scoreText = (await scoreSpan.innerText()).trim();
    if (userText.includes("E2E User") && scoreText.includes("77")) {
      matched = true;
      break;
    }
  }
  expect(matched).toBe(true);
});
