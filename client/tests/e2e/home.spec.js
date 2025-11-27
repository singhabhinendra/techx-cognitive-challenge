const { test, expect } = require("@playwright/test");

test("landing page loads and audio toggle works", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=TechX Cognitive")).toBeVisible();

  const audioBtn = page.locator('button[title^="Audio"]');
  await expect(audioBtn).toBeVisible();
  await audioBtn.click();
  // after enabling, the button should still exist and not crash
  await expect(audioBtn).toBeVisible();
});
