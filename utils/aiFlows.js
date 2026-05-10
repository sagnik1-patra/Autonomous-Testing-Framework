const { runSteps } = require('passmark');
const config = require('./config');

/**
 * Wrapper for passmark runSteps to easily execute AI flows.
 */
async function executeFlow({ page, test, expect, flowName, steps, assertions = [] }) {
  if (!config.openRouterApiKey) {
    console.warn('WARNING: OPENROUTER_API_KEY is not set. Passmark will fail if it relies on it.');
  }

  // Passmark requires setting the OPENAI_API_KEY and OPENAI_BASE_URL to work with OpenRouter
  process.env.OPENAI_API_KEY = config.openRouterApiKey;
  process.env.OPENAI_BASE_URL = 'https://openrouter.ai/api/v1';

  return await runSteps({
    page,
    userFlow: flowName,
    model: config.aiModel,
    steps,
    assertions,
    test,
    expect,
  });
}

const loginFlow = async ({ page, test, expect, email, password }) => {
  return await executeFlow({
    page,
    test,
    expect,
    flowName: 'Login Flow',
    steps: [
      { description: 'Navigate to login page' },
      { description: `Enter email: ${email}` },
      { description: `Enter password: ${password}` },
      { description: 'Click login button' }
    ],
    assertions: [
      { assertion: 'User is logged in successfully' }
    ]
  });
};

const searchFlow = async ({ page, test, expect, query }) => {
  return await executeFlow({
    page,
    test,
    expect,
    flowName: `Search for ${query}`,
    steps: [
      { description: 'Click the search icon or input field' },
      { description: `Type "${query}" in the search box` },
      { description: 'Submit the search' }
    ]
  });
};

module.exports = { executeFlow, loginFlow, searchFlow };
