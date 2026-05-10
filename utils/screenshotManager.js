const path = require('path');
const fs = require('fs');

/**
 * Captures a screenshot of the current page and saves it with a timestamp.
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} testName - Name of the test
 * @returns {Promise<string>} The path to the saved screenshot
 */
async function captureFailureScreenshot(page, testName) {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeTestName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `failure_${safeTestName}_${timestamp}.png`;
  const filepath = path.join(screenshotsDir, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

module.exports = { captureFailureScreenshot };
