const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  // M2M Sentinel API Configuration
  M2M_BASE_URL: process.env.M2M_BASE_URL || 'https://m2msentinel.vercel.app',
  M2M_API_KEY: process.env.M2M_API_KEY || '',

  // Bot Tokens
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID || '', // Optional: for instant guild command sync

  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',

  // Network Defaults
  CHAIN_ID: 8453,
  NETWORK_NAME: 'Base Mainnet',
  EXPLORER_URL: 'https://basescan.org',

  // Policy Thresholds
  MAX_SAFE_RISK_SCORE: parseInt(process.env.MAX_SAFE_RISK_SCORE || '40', 10),
  HIGH_RISK_THRESHOLD: parseInt(process.env.HIGH_RISK_THRESHOLD || '70', 10)
};
