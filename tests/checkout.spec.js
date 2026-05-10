const { test, expect } = require('@playwright/test');
const { executeFlow } = require('../utils/aiFlows');
const assertions = require('../utils/aiAssertions');
const config = require('../utils/config');
const reportGenerator = require('../utils/reportGenerator');
const { captureFailureScreenshot } = require('../utils/screenshotManager');

test.describe('E-commerce Checkout Flow', () => {
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

  test.afterAll(async () => {
    reportGenerator.generate();
  });

  test('User purchases a product on Vercel Store', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(config.baseUrl);

    await executeFlow({
      page,
      test,
      expect,
      flowName: 'Purchase Product',
      steps: [
        { description: 'Search for "ACME Cup"' },
        { description: 'Click on the "ACME Cup" product from the search results' },
        { description: 'Select a size if applicable and click "Add to Cart"' },
        { description: 'Click on the cart icon to view the cart' },
        { description: 'Click on "Proceed to Checkout"' }
      ],
      assertions: [
        { assertion: assertions.cartContainsProduct },
        { assertion: 'User is redirected to the checkout page' }
      ]
    });
  });
});
