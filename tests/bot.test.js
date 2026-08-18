const assert = require('assert');
const discordBot = require('../src/platforms/discord');
const telegramBot = require('../src/platforms/telegram');

async function testBotPlatforms() {
  console.log('🧪 Running Multi-Platform Bot Execution Tests...\n');

  // 1. Test Discord Command Handler
  console.log('Test 1: Discord Command Dispatcher');
  const discordAuditRes = await discordBot.handleCommand('audit', { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' });
  assert(discordAuditRes.embeds && discordAuditRes.embeds.length > 0);
  console.log('  ✔ Discord /audit handled successfully');

  const discordGasRes = await discordBot.handleCommand('gas');
  assert(discordGasRes.embeds && discordGasRes.embeds.length > 0);
  console.log('  ✔ Discord /gas handled successfully');

  // 2. Test Telegram Command Handler
  console.log('\nTest 2: Telegram Command Dispatcher');
  const telegramAuditRes = await telegramBot.handleCommand('/audit 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
  assert(typeof telegramAuditRes === 'string');
  assert(telegramAuditRes.includes('M2M Sentinel EVM Audit'));
  console.log('  ✔ Telegram /audit handled successfully');

  const telegramGasRes = await telegramBot.handleCommand('/gas');
  assert(typeof telegramGasRes === 'string');
  assert(telegramGasRes.includes('Base Network Gas Telemetry'));
  console.log('  ✔ Telegram /gas handled successfully');

  console.log('\n🎉 Multi-Platform Bot Tests Passed Successfully!\n');
}

testBotPlatforms().catch(err => {
  console.error(err);
  process.exit(1);
});
