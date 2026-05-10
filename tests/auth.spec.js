const { test, expect } = require('@playwright/test');
const { loginFlow } = require('../utils/aiFlows');
const config = require('../utils/config');
const reportGenerator = require('../utils/reportGenerator');
const { captureFailureScreenshot } = require('../utils/screenshotManager');

test.describe('Authentication Flow', () => {
  test.afterEach(async ({ page }, testInfo) => {
    let screenshot = null;
    if (testInfo.status !== 'passed') {
        screenshot = await captureFailureScreenshot(page, testInfo.title);
    }
    reportGenerator.addResult({
      testName: testInfo.title,
      status: testInfo.status,
      duration: testInfo.duration,
      error: testInfo.error?.message || '',
      screenshot: screenshot
    });
  });

  test('User logs in with valid credentials', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto(config.baseUrl); 

    await loginFlow({
      page,
      test,
      expect,
      email: 'test@example.com',
      password: 'Password123!'
    });
  });
});
