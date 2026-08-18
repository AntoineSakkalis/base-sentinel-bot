const config = require('../config');

class TelegramFormatter {
  /**
   * Format contract audit into a rich Telegram HTML card
   */
  formatAuditMessage(audit) {
    const isCritical = audit.trustLevel === 'CRITICAL_RISK' || audit.riskScore > config.HIGH_RISK_THRESHOLD;
    const isModerate = audit.trustLevel === 'MODERATE_RISK' || audit.riskScore > config.MAX_SAFE_RISK_SCORE;

    const banner = isCritical 
      ? '🛑 <b>CRITICAL RISK DETECTED</b>' 
      : (isModerate ? '⚠️ <b>MODERATE RISK / PROXY</b>' : '✅ <b>VERIFIED SAFE CONTRACT</b>');

    let lines = [
      `🛡️ <b>M2M Sentinel EVM Audit (Base L2)</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🎯 <b>Target:</b> <code>${audit.address}</code>`,
      `📊 <b>Verdict:</b> ${banner}`,
      `📈 <b>Risk Score:</b> <code>${audit.riskScore}/100</code>`,
      `⚡ <b>Inspection SLA:</b> <code>${audit.latencyMs} ms</code> | <b>Size:</b> <code>${audit.bytecodeSize} B</code>`,
      ``,
      `🏗️ <b>Architecture:</b> ${audit.isProxy ? `<code>${audit.proxyType}</code>` : '<code>Direct Immutable</code>'}`
    ];

    if (audit.isProxy && audit.implementationAddress) {
      lines.push(`↳ <b>Impl:</b> <code>${audit.implementationAddress}</code>`);
    }

    const caps = audit.observedCapabilities.length > 0 
      ? audit.observedCapabilities.map(c => `<code>${c}</code>`).join(' ')
      : '<code>Standard</code>';

    lines.push(``);
    lines.push(`🔍 <b>Capabilities:</b> ${caps}`);

    if (audit.dangerousOpcodes && audit.dangerousOpcodes.length > 0) {
      lines.push(``);
      lines.push(`🚨 <b>Hazardous Opcodes Flagged:</b>`);
      audit.dangerousOpcodes.forEach(op => lines.push(` • <code>${op}</code>`));
    }

    lines.push(``);
    lines.push(`🔗 <a href="https://basescan.org/address/${audit.address}">View on BaseScan</a> • <a href="https://m2msentinel.com">Powered by M2M Sentinel</a>`);

    return lines.join('\n');
  }

  /**
   * Format Gas telemetry for Telegram
   */
  formatGasMessage(gas) {
    return [
      `⛽ <b>Base Network Gas Telemetry</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `• <b>Base Fee:</b> <code>${gas.baseFeeGwei} Gwei</code>`,
      `• <b>Priority Fee:</b> <code>${gas.priorityFeeGwei} Gwei</code>`,
      `• <b>Suggested Max:</b> <code>${gas.suggestedMaxFeeGwei} Gwei</code>`,
      `• <b>Congestion:</b> 🟢 <code>${gas.congestion}</code>`,
      `• <b>Agent Preflight:</b> <code>${gas.agentExecutionStatus}</code>`,
      ``,
      `<i>Powered by M2M Sentinel SDK on Base</i>`
    ].join('\n');
  }

  /**
   * Format Token Price for Telegram
   */
  formatPriceMessage(priceData) {
    return [
      `📊 <b>Base DEX Price Observation</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `💎 <b>Asset:</b> <code>${priceData.symbol}</code>`,
      `💵 <b>Price (USD):</b> <b>$${priceData.priceUsd}</b>`,
      `🎯 <b>Oracle Confidence:</b> <code>${priceData.confidence}</code>`,
      `🌐 <b>Network:</b> <code>${priceData.chain} (8453)</code>`
    ].join('\n');
  }

  /**
   * Format Help message for Telegram
   */
  formatHelpMessage() {
    return [
      `🛡️ <b>Base Sentinel Bot — Command Guide</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `• <code>/audit &lt;0x...&gt;</code> - Fast EVM bytecode audit & proxy resolution`,
      `• <code>/gas</code> - Real-time Base L2 gas metrics`,
      `• <code>/price &lt;symbol&gt;</code> - Base DEX spot price observations`,
      `• <code>/about</code> - How deterministic preflight security works`,
      ``,
      `<i>Add Base Sentinel Bot to your group or DAO to protect against honeypots and drainers.</i>`
    ].join('\n');
  }
}

module.exports = new TelegramFormatter();
