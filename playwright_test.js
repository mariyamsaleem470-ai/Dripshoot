const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

  try {
    // Navigate to sign-in directly (already compiled)
    console.log('Loading sign-in page...');
    await page.goto('http://localhost:3333/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3333%2Fdashboard', {
      timeout: 90000, waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(2000);
    console.log('URL:', page.url());
    await page.screenshot({ path: 'E:\\dripshoots\\test_ss_signin.png' });
    console.log('Sign-in screenshot saved');

    // Fill email
    const emailInput = await page.waitForSelector('input[name="identifier"], input[type="email"]', { timeout: 10000 });
    console.log('Found email input');
    await emailInput.fill('mariyamsaleem470@gmail.com');
    await page.screenshot({ path: 'E:\\dripshoots\\test_ss_email_filled.png' });

    // Submit
    const btn = await page.$('button[type="submit"]');
    if (btn) {
      console.log('Clicking submit...');
      await btn.click();
      await page.waitForTimeout(5000);
      console.log('URL after submit:', page.url());
      await page.screenshot({ path: 'E:\\dripshoots\\test_ss_after_submit.png' });
    }

    if (errors.length) console.log('Page errors:', errors.join('\n'));
    else console.log('No page errors');

  } catch(e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: 'E:\\dripshoots\\test_ss_err.png' }).catch(() => {});
  }
  await browser.close();
  console.log('Done');
})();
