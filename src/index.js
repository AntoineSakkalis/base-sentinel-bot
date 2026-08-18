const config = require('./config');
const discordBot = require('./platforms/discord');
const telegramBot = require('./platforms/telegram');

async function main() {
  console.log('============================================================');
  console.log('  🛡️  Starting Base Sentinel Multi-Platform Bot');
  console.log('  Base Chain ID: 8453 | Engine: M2M Sentinel SDK');
  console.log('============================================================\n');

  let activeServices = 0;

  if (config.DISCORD_BOT_TOKEN) {
    const started = await discordBot.start();
    if (started) activeServices++;
  } else {
    console.log('ℹ️  [Discord] DISCORD_BOT_TOKEN not configured.');
  }

  if (config.TELEGRAM_BOT_TOKEN) {
    const started = await telegramBot.start();
    if (started) activeServices++;
  } else {
    console.log('ℹ️  [Telegram] TELEGRAM_BOT_TOKEN not configured.');
  }

  if (activeServices === 0) {
    console.log('\n💡 No live bot tokens provided in .env.');
    console.log('   You can run the interactive demo or CLI locally with:');
    console.log('   👉 npm run demo\n');
    console.log('   To connect live bots, add your tokens to .env:');
    console.log('   - DISCORD_BOT_TOKEN=...');
    console.log('   - TELEGRAM_BOT_TOKEN=...\n');
  } else {
    console.log(`\n🚀 Base Sentinel Bot is actively running on ${activeServices} platform(s)!`);
  }
}

main().catch(err => {
  console.error('Fatal Bot Error:', err);
  process.exit(1);
});
