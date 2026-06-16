const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--remote-debugging-port=9222"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/sign-in");
  console.log("Browser opened at sign-in page. Please sign in manually...");
  // Keep process alive so the browser stays open
  await new Promise(() => {});
})();
