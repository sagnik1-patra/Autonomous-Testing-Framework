const { test, expect } = require('@playwright/test');
const { executeFlow } = require('../utils/aiFlows');
const assertions = require('../utils/aiAssertions');
const reportGenerator = require('../utils/reportGenerator');
const { captureFailureScreenshot } = require('../utils/screenshotManager');

test.describe('Blog/Content Management Flow', () => {
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

  test('User creates and publishes a blog post on Hashnode', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('https://hashnode.com');

    await executeFlow({
      page,
      test,
      expect,
      flowName: 'Publish Blog Post',
      steps: [
        { description: 'Click on "Write" or "Create Post" button' },
        { description: 'Enter "AI Autonomous Testing" as the title' },
        { description: 'Write some content about AI testing in the editor' },
        { description: 'Click on "Publish" button' }
      ],
      assertions: [
        { assertion: assertions.articlePublished }
      ]
    });
  });
});
