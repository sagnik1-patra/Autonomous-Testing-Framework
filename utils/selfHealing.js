const { executeFlow } = require('./aiFlows');
const { captureFailureScreenshot } = require('./screenshotManager');

/**
 * Self-healing wrapper for AI flows.
 * If a flow fails, it captures a screenshot, analyzes the failure, and attempts a retry with re-interpreted steps.
 */
async function runWithSelfHealing(params) {
  const { page, test, expect, flowName, steps, assertions } = params;

  try {
    return await executeFlow(params);
  } catch (error) {
    console.error(`[Self-Healing] Initial flow "${flowName}" failed. Attempting self-healing...`);
    
    // Capture failure state
    const screenshotPath = await captureFailureScreenshot(page, `${flowName}_healing`);
    console.log(`[Self-Healing] Failure screenshot captured: ${screenshotPath}`);

    // Wait a bit for the UI to stabilize
    await page.waitForTimeout(2000);

    // Attempt retry with a "healing" description added to the prompt indirectly
    const healingSteps = steps.map(step => ({
      ...step,
      description: `${step.description} (Note: Previous interaction might have failed, please ensure element is visible and interactive)`
    }));

    try {
      return await executeFlow({
        ...params,
        flowName: `${flowName} (Self-Healed)`,
        steps: healingSteps
      });
    } catch (retryError) {
      console.error(`[Self-Healing] Self-healing attempt failed for "${flowName}".`);
      throw retryError;
    }
  }
}

module.exports = { runWithSelfHealing };
