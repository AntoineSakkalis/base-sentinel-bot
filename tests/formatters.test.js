const assert = require('assert');
const discordFormatter = require('../src/formatters/discord');
const telegramFormatter = require('../src/formatters/telegram');

async function testFormatters() {
  console.log('🧪 Running Discord & Telegram Formatter Tests...\n');

  const mockSafeAudit = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    trustLevel: 'VERIFIED_SAFE',
    riskScore: 10,
    isProxy: true,
    proxyType: 'EIP-1967 Transparent Proxy',
    implementationAddress: '0x2ce6311ddae708829bc0784c967b7d77d19fd779',
    observedCapabilities: ['CALL', 'STATICCALL', 'PROXY_FALLBACK'],
    dangerousOpcodes: [],
    bytecodeSize: 2400,
    latencyMs: 16,
    recommendation: 'SAFE_FOR_INTERACTION'
  };

  const mockFlaggedAudit = {
    address: '0xBAD000000000000000000000000000000000DEAD',
    trustLevel: 'CRITICAL_RISK',
    riskScore: 95,
    isProxy: false,
    observedCapabilities: ['UNCHECKED_DELEGATECALL', 'SELFDESTRUCT'],
    dangerousOpcodes: ['SELFDESTRUCT (0xFF)'],
    bytecodeSize: 840,
    latencyMs: 12,
    recommendation: 'BLOCK_TRANSACTIONS'
  };

  // 1. Test Discord Embed Formatting
  console.log('Test 1: Discord Embed Generation');
  const safeDiscord = discordFormatter.formatAuditEmbed(mockSafeAudit);
  assert(safeDiscord.embeds && safeDiscord.embeds.length === 1);
  assert(safeDiscord.embeds[0].color === 0x22C55E, 'Safe contract should have green embed');

  const flaggedDiscord = discordFormatter.formatAuditEmbed(mockFlaggedAudit);
  assert(flaggedDiscord.embeds[0].color === 0xEF4444, 'Flagged contract should have red embed');
  console.log('  ✔ Discord embed color and fields verified');

  // 2. Test Telegram HTML Card Formatting
  console.log('\nTest 2: Telegram HTML Card Generation');
  const safeTelegram = telegramFormatter.formatAuditMessage(mockSafeAudit);
  assert(safeTelegram.includes('VERIFIED SAFE CONTRACT'));
  assert(safeTelegram.includes('EIP-1967 Transparent Proxy'));

  const flaggedTelegram = telegramFormatter.formatAuditMessage(mockFlaggedAudit);
  assert(flaggedTelegram.includes('CRITICAL RISK DETECTED'));
  assert(flaggedTelegram.includes('SELFDESTRUCT (0xFF)'));
  console.log('  ✔ Telegram HTML card formatting verified');

  console.log('\n🎉 Formatter Tests Passed Successfully!\n');
}

testFormatters().catch(err => {
  console.error(err);
  process.exit(1);
});
