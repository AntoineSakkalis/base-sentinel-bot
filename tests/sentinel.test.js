const assert = require('assert');
const sentinel = require('../src/sentinel');

async function testSentinelService() {
  console.log('🧪 Running M2M Sentinel Service Tests...\n');

  // Test 1: Address validation
  try {
    console.log('Test 1: Invalid address rejection');
    await sentinel.auditContract('invalid-address');
    assert.fail('Should reject invalid address');
  } catch (err) {
    assert(err.message.includes('Invalid EVM contract address'));
    console.log('  ✔ Correctly rejected malformed address');
  }

  // Test 2: USDC Audit
  try {
    console.log('\nTest 2: Auditing USDC contract on Base');
    const usdcAddr = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    const audit = await sentinel.auditContract(usdcAddr);
    assert(audit.address === usdcAddr, 'Address should match');
    assert(typeof audit.riskScore === 'number', 'Risk score should be a number');
    assert(audit.isProxy === true, 'USDC should be identified as a proxy');
    console.log(`  ✔ USDC Audit Verified (Risk: ${audit.riskScore}/100, Proxy: ${audit.proxyType})`);
  } catch (err) {
    console.error('  ✖ Test 2 Failed:', err.message);
    throw err;
  }

  // Test 3: Gas Metrics
  try {
    console.log('\nTest 3: Fetching Base L2 Gas telemetry');
    const gas = await sentinel.getGasMetrics();
    assert(gas.network.includes('Base'));
    assert(parseFloat(gas.suggestedMaxFeeGwei) > 0);
    console.log(`  ✔ Gas Telemetry Verified (Base Fee: ${gas.baseFeeGwei} Gwei)`);
  } catch (err) {
    console.error('  ✖ Test 3 Failed:', err.message);
    throw err;
  }

  console.log('\n🎉 M2M Sentinel Service Tests Passed Successfully!\n');
}

testSentinelService().catch(err => {
  console.error(err);
  process.exit(1);
});
