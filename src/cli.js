#!/usr/bin/env node

const sentinel = require('./sentinel');
const discordFormatter = require('./formatters/discord');
const telegramFormatter = require('./formatters/telegram');

async function runCli() {
  const args = process.argv.slice(2);
  const command = args[0] || '--demo';

  console.log('\n============================================================');
  console.log('  🛡️  Base Sentinel Bot — Web3 Bytecode Security CLI');
  console.log('  Deterministic EVM Intelligence & Community Protection');
  console.log('============================================================\n');

  if (command === '--demo' || command === '-d') {
    console.log('🚀 Running Live Demonstration of Base Sentinel Bot Commands...\n');

    // 1. Audit Preset: Base USDC Proxy
    console.log('------------------------------------------------------------');
    console.log('1. DISCORD EMBED OUTPUT: /audit 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 (USDC)');
    console.log('------------------------------------------------------------');
    const usdcAudit = await sentinel.auditContract('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
    const discordEmbed = discordFormatter.formatAuditEmbed(usdcAudit);
    console.log(JSON.stringify(discordEmbed, null, 2));

    // 2. Telegram Output: /audit 0xBAD000...DEAD (Drainer simulation)
    console.log('\n------------------------------------------------------------');
    console.log('2. TELEGRAM HTML CARD: /audit 0xBAD000000000000000000000000000000000DEAD (Flagged)');
    console.log('------------------------------------------------------------');
    const badAudit = await sentinel.auditContract('0xBAD000000000000000000000000000000000DEAD');
    const telegramCard = telegramFormatter.formatAuditMessage(badAudit);
    console.log(telegramCard);

    // 3. Gas Metrics
    console.log('\n------------------------------------------------------------');
    console.log('3. GAS TELEMETRY OUTPUT: /gas');
    console.log('------------------------------------------------------------');
    const gas = await sentinel.getGasMetrics();
    console.log(telegramFormatter.formatGasMessage(gas));

    console.log('\n✅ Demo completed successfully!\n');
    return;
  }

  if (command === '--audit' || command === '-a') {
    const address = args[1];
    if (!address) {
      console.error('❌ Error: Missing contract address. Usage: node src/cli.js --audit 0x...');
      process.exit(1);
    }
    const audit = await sentinel.auditContract(address);
    console.log(telegramFormatter.formatAuditMessage(audit));
    return;
  }

  if (command === '--gas' || command === '-g') {
    const gas = await sentinel.getGasMetrics();
    console.log(telegramFormatter.formatGasMessage(gas));
    return;
  }

  if (command === '--price' || command === '-p') {
    const symbol = args[1] || 'ETH';
    const price = await sentinel.getTokenPrice(symbol);
    console.log(telegramFormatter.formatPriceMessage(price));
    return;
  }

  console.log('Usage:');
  console.log('  node src/cli.js --demo             Run complete bot simulation');
  console.log('  node src/cli.js --audit <address>  Audit contract bytecode on Base');
  console.log('  node src/cli.js --gas              Get Base network gas metrics');
  console.log('  node src/cli.js --price <symbol>   Get Base DEX token price\n');
}

runCli().catch(err => {
  console.error('❌ CLI Execution Error:', err);
  process.exit(1);
});
