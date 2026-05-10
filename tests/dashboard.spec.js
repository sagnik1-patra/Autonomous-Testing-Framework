const { test, expect } = require('@playwright/test');
const { executeFlow } = require('../utils/aiFlows');
const assertions = require('../utils/aiAssertions');
const config = require('../utils/config');
const reportGenerator = require('../utils/reportGenerator');
const { captureFailureScreenshot } = require('../utils/screenshotManager');

test.describe('Dashboard Analytics', () => {
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

  test('User views the dashboard and analytics', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('https://demo.vercel.store/search'); 

    await executeFlow({
      page,
      test,
      expect,
      flowName: 'Dashboard View',
      steps: [
        { description: 'Wait for the search results page to load' },
        { description: 'Check if product categories are visible' }
      ],
      assertions: [
        { assertion: 'The search page loaded correctly with product filters' }
      ]
    });
  });
});
