const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = context.pages().find((p) => p.url().includes("/dashboard")) || context.pages()[0];
  await page.bringToFront();

  await page.getByRole("button", { name: /Generate 1 Image/i }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "test-screenshots/08-generating.png" });
  console.log("Screenshot: 08-generating.png");

  // Wait up to 60s for result
  await page.waitForTimeout(20000);
  await page.screenshot({ path: "test-screenshots/09-generate-result.png" });
  console.log("Screenshot: 09-generate-result.png");

  await browser.close();
})().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
