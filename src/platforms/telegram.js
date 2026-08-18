const config = require('../config');
const sentinel = require('../sentinel');
const telegramFormatter = require('../formatters/telegram');

class TelegramPlatformBot {
  constructor() {
    this.token = config.TELEGRAM_BOT_TOKEN;
  }

  /**
   * Execute command logic for Telegram
   */
  async handleCommand(commandText) {
    const parts = (commandText || '').trim().split(/\s+/);
    const command = parts[0].toLowerCase().replace('/', '').split('@')[0]; // strip bot username if in group
    const arg = parts[1];

    console.log(`[Telegram Bot] Processing command: /${command} (arg: ${arg || 'none'})`);

    switch (command) {
      case 'audit':
      case 'check':
      case 'scan': {
        if (!arg) {
          return `❌ <b>Usage:</b> <code>/audit &lt;0x_contract_address&gt;</code>\nExample: <code>/audit 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code>`;
        }
        try {
          const audit = await sentinel.auditContract(arg);
          return telegramFormatter.formatAuditMessage(audit);
        } catch (err) {
          return `❌ <b>Audit error:</b> ${err.message}`;
        }
      }

      case 'gas': {
        const gas = await sentinel.getGasMetrics();
        return telegramFormatter.formatGasMessage(gas);
      }

      case 'price': {
        const symbol = arg || 'ETH';
        const price = await sentinel.getTokenPrice(symbol);
        return telegramFormatter.formatPriceMessage(price);
      }

      case 'start':
      case 'help':
      case 'about':
      default: {
        return telegramFormatter.formatHelpMessage();
      }
    }
  }

  /**
   * Start Telegram Long Polling if token is provided
   */
  async start() {
    if (!this.token) {
      console.log('ℹ️  [Telegram Bot] No TELEGRAM_BOT_TOKEN provided. Set token in .env to connect to live Telegram chats.');
      return false;
    }

    console.log('⚡ [Telegram Bot] Connecting to Telegram Bot API...');
    let offset = 0;

    const poll = async () => {
      try {
        const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}&timeout=25`;
        const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.result) {
            for (const update of data.result) {
              offset = update.update_id + 1;
              if (update.message && update.message.text) {
                const chatId = update.message.chat.id;
                const reply = await this.handleCommand(update.message.text);
                await this.sendMessage(chatId, reply);
              }
            }
          }
        }
      } catch (err) {
        // Continue polling loop
      }
      setTimeout(poll, 1000);
    };

    poll();
    return true;
  }

  async sendMessage(chatId, htmlText) {
    try {
      const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlText,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });
    } catch (err) {
      console.error('[Telegram Bot] Failed to send message:', err.message);
    }
  }
}

module.exports = new TelegramPlatformBot();

if (require.main === module) {
  const bot = new TelegramPlatformBot();
  bot.start().catch(console.error);
}
