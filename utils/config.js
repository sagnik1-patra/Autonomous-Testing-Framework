require('dotenv').config();

module.exports = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  aiModel: process.env.AI_MODEL || 'anthropic/claude-3-5-sonnet',
  baseUrl: 'https://demo.vercel.store',
};
