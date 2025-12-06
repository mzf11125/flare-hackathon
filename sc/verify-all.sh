#!/bin/bash

set -e

EXPLORER_URL="https://coston2-explorer.flare.network/api"
CHAIN_ID=114

echo "=== 🔍 Verifying All InfoPilot Contracts on Coston2 ==="

verify() {
  ADDRESS=$1
  CONTRACT_PATH=$2
  CONTRACT_NAME=$3
  EXTRA_ARGS=$4

  echo ""
  echo "➡ Verifying $CONTRACT_NAME at $ADDRESS"
  
  forge verify-contract \
    --chain-id $CHAIN_ID \
    --verifier blockscout \
    --verifier-url $EXPLORER_URL \
    $EXTRA_ARGS \
    $ADDRESS \
    $CONTRACT_PATH:$CONTRACT_NAME \
    --watch
}

# 1. InfoPilotFactory
verify \
  "0x72c57B68c5fd7325D0264F9689F4bbF8D4469385" \
  "src/InfoPilotFactory.sol" \
  "InfoPilotFactory"

# 2. MockSentimentOracle
verify \
  "0xe5F14d35aDA94b11E56E588de76E6704c5D13178" \
  "src/mocks/MockSentimentOracle.sol" \
  "MockSentimentOracle"

# 3. MockDEX
verify \
  "0x03b5560f67Ce8b698C3CDbC043C8e1f89197731b" \
  "src/mocks/MockDEX.sol" \
  "MockDEX"

# 4. MockERC20 - WFLR
verify \
  "0x35984E84E8cd592F9e162e58E559A46cecBE13DA" \
  "src/mocks/MockERC20.sol" \
  "MockERC20" \
  "--constructor-args $(cast abi-encode 'constructor(string,string,uint8)' 'Wrapped Flare' 'WFLR' 18)"

# 5. MockERC20 - USDC
verify \
  "0x64E2Bce63A968Bfdc52372B869831212B5505bb5" \
  "src/mocks/MockERC20.sol" \
  "MockERC20" \
  "--constructor-args $(cast abi-encode 'constructor(string,string,uint8)' 'USD Coin' 'USDC' 6)"

# 6. MockERC20 - USDT
verify \
  "0x18Dc78cFbBEbBE911dB1e22Cb12291Ae7Ace92Ba" \
  "src/mocks/MockERC20.sol" \
  "MockERC20" \
  "--constructor-args $(cast abi-encode 'constructor(string,string,uint8)' 'Tether USD' 'USDT' 6)"

echo ""
echo "🎉 All verifications submitted! Check Blockscout for results."
