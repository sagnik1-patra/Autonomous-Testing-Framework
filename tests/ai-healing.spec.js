const { test, expect } = require('@playwright/test');
const { runWithSelfHealing } = require('../utils/selfHealing');
const config = require('../utils/config');
const reportGenerator = require('../utils/reportGenerator');
const { captureFailureScreenshot } = require('../utils/screenshotManager');

test.describe('Self-Healing AI Tests', () => {
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

  test('Self-healing test handles dynamic UI changes', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(config.baseUrl);

    await runWithSelfHealing({
      page,
      test,
      expect,
      flowName: 'Dynamic Checkout',
      steps: [
        { description: 'Search for any available product' },
        { description: 'Open the product details' },
        { description: 'Add to cart and view cart summary' }
      ],
      assertions: [
        { assertion: 'Product is visible in the cart' }
      ]
    });
  });
});
