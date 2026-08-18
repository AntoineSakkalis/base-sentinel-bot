# Base Sentinel Bot 🛡️🤖

[![Base Network](https://img.shields.io/badge/Network-Base%20(8453)-0052FF.svg)](https://base.org)
[![M2M Sentinel SDK](https://img.shields.io/badge/Engine-M2M%20Sentinel%20SDK-6366F1.svg)](https://m2msentinel.com)
[![Discord & Telegram](https://img.shields.io/badge/Platforms-Discord%20%7C%20Telegram-5865F2.svg)](https://github.com/AntoineSakkalis/base-sentinel-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-ready Web3 security bot for Discord servers, DAOs, and Telegram groups on **Base (Chain ID 8453)**. Powered by the **M2M Sentinel SDK**, it provides sub-35ms deterministic EVM bytecode analysis, EIP-1967/UUPS proxy resolution, honeypot/drainer interception, and real-time gas telemetry.

---

## ⚡ Why Base Sentinel Bot?

Communities and autonomous agents on Base are frequently exposed to unverified contract addresses, obfuscated bytecode, and malicious drainers:

* 🚨 **Hidden Selfdestructs**: Attackers deploying contracts with hidden `SELFDESTRUCT` (0xFF).
* 🚨 **Unsafe Upgrades**: Unverified proxies redirecting execution to malicious logic contracts.
* 🚨 **Dynamic Delegatecalls**: Contracts dispatching unconstrained `DELEGATECALL` (0xF4) to hijack wallet authorizations.

**Base Sentinel Bot** disassembles bytecode on the fly and posts clear, color-coded safety reports directly in your channel before users sign transactions.

---

## 📸 Features & Commands

| Command | Platform | Description |
| :--- | :--- | :--- |
| `/audit <0x...>` | Discord & Telegram | Instant bytecode disassembly, proxy resolution (EIP-1967), and risk score (0-100). |
| `/gas` | Discord & Telegram | Real-time Base L2 base fee, priority fee, and execution recommendations. |
| `/price <symbol>` | Discord & Telegram | Base DEX spot prices (ETH, USDC, AERO, CBETH) with oracle confidence ratings. |
| `/help` | Discord & Telegram | Comprehensive command guide and bytecode safety checklist. |

---

## 🛠️ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/AntoineSakkalis/base-sentinel-bot.git
cd base-sentinel-bot
npm install
```

### 2. Test Without API Keys (Interactive CLI Demo)

You can test the entire bot engine locally right now:

```bash
# Run full simulation demo
npm run demo

# Audit any Base contract directly in terminal
node src/cli.js --audit 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

### 3. Run Automated Test Suite

```bash
npm test
```

---

## 🤖 Bot Setup & Deployment

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```ini
# M2M Sentinel API Configuration (Works out-of-the-box in demo mode)
M2M_BASE_URL=https://m2msentinel.vercel.app
M2M_API_KEY=

# Discord Bot Setup
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here

# Telegram Bot Setup
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### Starting the Bot

```bash
# Start both Discord and Telegram bots
npm start

# Or start individually
npm run bot:discord
npm run bot:telegram
```

---

## 🐳 Docker Deployment

```bash
docker build -t base-sentinel-bot .
docker run -d --env-file .env base-sentinel-bot
```

---

## 📁 Architecture Overview

```
base-sentinel-bot/
├── src/
│   ├── config.js               # Environment & risk thresholds
│   ├── sentinel.js             # M2M Sentinel SDK client & bytecode engine
│   ├── formatters/
│   │   ├── discord.js          # Discord Rich Embed formatters
│   │   └── telegram.js         # Telegram HTML Card formatters
│   ├── platforms/
│   │   ├── discord.js          # Discord REST/Gateway bot handler
│   │   └── telegram.js         # Telegram long-polling & webhook handler
│   ├── cli.js                  # Standalone CLI runner & demo mode
│   └── index.js                # Multi-platform entry point
├── tests/                      # Automated unit & integration tests
├── Dockerfile                  # Production container
├── README.md                   # Documentation
└── package.json
```

---

## 📄 License

MIT License &copy; 2026 Antoine Sakkalis. Powered by M2M Sentinel Ecosystem.
