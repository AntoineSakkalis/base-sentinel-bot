const config = require('../config');

class DiscordFormatter {
  /**
   * Format contract audit into a Discord Rich Embed
   */
  formatAuditEmbed(audit) {
    const isCritical = audit.trustLevel === 'CRITICAL_RISK' || audit.riskScore > config.HIGH_RISK_THRESHOLD;
    const isModerate = audit.trustLevel === 'MODERATE_RISK' || audit.riskScore > config.MAX_SAFE_RISK_SCORE;

    // Discord Colors: Green = 0x22C55E, Yellow/Amber = 0xF59E0B, Red = 0xEF4444
    const embedColor = isCritical ? 0xEF4444 : (isModerate ? 0xF59E0B : 0x22C55E);
    const statusEmoji = isCritical ? '🛑 [CRITICAL RISK]' : (isModerate ? '⚠️ [MODERATE RISK]' : '✅ [VERIFIED SAFE]');

    const fields = [
      {
        name: '🛡️ Trust Assessment',
        value: `**Rating:** \`${statusEmoji}\`\n**Risk Score:** \`${audit.riskScore}/100\`\n**Verdict:** \`${audit.recommendation}\``,
        inline: false
      },
      {
        name: '🏗️ Proxy & Architecture',
        value: audit.isProxy 
          ? `**Type:** \`${audit.proxyType}\`\n**Implementation:** [\`${audit.implementationAddress.slice(0, 10)}...${audit.implementationAddress.slice(-6)}\`](https://basescan.org/address/${audit.implementationAddress})`
          : '`Direct Immutable Deployment (No Proxy)`',
        inline: true
      },
      {
        name: '⚡ Performance & SLA',
        value: `**Disassembly Latency:** \`${audit.latencyMs} ms\`\n**Bytecode Size:** \`${audit.bytecodeSize} Bytes\``,
        inline: true
      }
    ];

    // Capabilities field
    const capabilitiesStr = audit.observedCapabilities.length > 0 
      ? audit.observedCapabilities.map(c => `\`${c}\``).join(' ')
      : '`Standard Execution`';

    fields.push({
      name: '🔍 Detected Bytecode Capabilities',
      value: capabilitiesStr,
      inline: false
    });

    // Dangerous opcodes if any
    if (audit.dangerousOpcodes && audit.dangerousOpcodes.length > 0) {
      fields.push({
        name: '⚠️ Flagged Hazardous Opcodes',
        value: audit.dangerousOpcodes.map(o => `🚨 \`${o}\``).join('\n'),
        inline: false
      });
    }

    return {
      embeds: [
        {
          title: `EVM Bytecode Audit: ${audit.address.slice(0, 8)}...${audit.address.slice(-6)}`,
          url: `https://basescan.org/address/${audit.address}`,
          description: `Deterministic capability inspection on **Base (Chain ID 8453)** powered by [M2M Sentinel](https://m2msentinel.com).`,
          color: embedColor,
          fields,
          footer: {
            text: 'Base Sentinel Bot • Deterministic EVM Security',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  /**
   * Format Gas telemetry embed
   */
  formatGasEmbed(gas) {
    return {
      embeds: [
        {
          title: '⛽ Base Network Gas Telemetry',
          description: 'Real-time L2 execution telemetry for autonomous agents and community members.',
          color: 0x0052FF, // Base Blue
          fields: [
            { name: 'Base Fee', value: `\`${gas.baseFeeGwei} Gwei\``, inline: true },
            { name: 'Priority Fee', value: `\`${gas.priorityFeeGwei} Gwei\``, inline: true },
            { name: 'Suggested Max Fee', value: `\`${gas.suggestedMaxFeeGwei} Gwei\``, inline: true },
            { name: 'Network Status', value: `🟢 \`${gas.congestion} Congestion\` (Blob active)`, inline: false },
            { name: 'Agent Preflight', value: `✅ \`${gas.agentExecutionStatus}\` for autonomous execution`, inline: false }
          ],
          footer: { text: 'Base Sentinel Bot • Powered by M2M Sentinel' },
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  /**
   * Format Token Price embed
   */
  formatPriceEmbed(priceData) {
    return {
      embeds: [
        {
          title: `📊 Token Price: ${priceData.symbol} / USD`,
          color: 0x6366F1,
          fields: [
            { name: 'Spot Price (USD)', value: `**$${priceData.priceUsd}**`, inline: true },
            { name: 'Chain', value: `\`${priceData.chain}\``, inline: true },
            { name: 'Oracle Confidence', value: `\`${priceData.confidence}\``, inline: true }
          ],
          footer: { text: 'M2M Sentinel Aggregated DEX Oracle' },
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  /**
   * Format Help embed
   */
  formatHelpEmbed() {
    return {
      embeds: [
        {
          title: '🛡️ Base Sentinel Bot — Help & Commands',
          description: 'Protect your community and autonomous agents against malicious smart contracts, drainers, and unverified proxies on Base.',
          color: 0x0052FF,
          fields: [
            { name: '`/audit <address>`', value: 'Disassembles contract bytecode, resolves EIP-1967 proxies, and flags dangerous opcodes.', inline: false },
            { name: '`/gas`', value: 'Real-time Base L2 execution fee telemetry and congestion state.', inline: false },
            { name: '`/price <symbol>`', value: 'Instant Base DEX spot price observations (e.g. ETH, USDC, AERO).', inline: false },
            { name: '`/about`', value: 'Learn about deterministic EVM bytecode intelligence.', inline: false }
          ],
          footer: { text: 'Base Sentinel Bot • Powered by M2M Sentinel' }
        }
      ]
    };
  }
}

module.exports = new DiscordFormatter();
