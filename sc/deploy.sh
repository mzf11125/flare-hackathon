#!/bin/bash

# InfoPilot Deployment Helper Script
# This script helps deploy and interact with InfoPilot contracts on Coston2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║   InfoPilot Deployment Helper         ║"
echo "║   Flare Coston2 Testnet               ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file with PRIVATE_KEY and FLARESCAN_API_KEY"
    exit 1
fi

# Source environment variables
source .env

# Validate environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

echo -e "${YELLOW}Checking Foundry installation...${NC}"
if ! command -v forge &> /dev/null; then
    echo -e "${RED}Error: Foundry not installed!${NC}"
    echo "Install from: https://book.getfoundry.sh/getting-started/installation"
    exit 1
fi
echo -e "${GREEN}✓ Foundry found${NC}"

# Menu
echo ""
echo "What would you like to do?"
echo "1) Build contracts"
echo "2) Run tests"
echo "3) Deploy to Coston2"
echo "4) Deploy and verify on Coston2"
echo "5) View deployment info"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Building contracts...${NC}"
        forge build
        echo -e "${GREEN}✓ Build complete${NC}"
        ;;
    2)
        echo -e "${YELLOW}Running tests...${NC}"
        forge test -vv
        ;;
    3)
        echo -e "${YELLOW}Deploying to Coston2...${NC}"
        forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
            --rpc-url https://coston2.enosys.global/ext/C/rpc \
            --broadcast \
            --legacy
        echo -e "${GREEN}✓ Deployment complete${NC}"
        echo -e "${YELLOW}Check deployments/coston2-latest.json for addresses${NC}"
        ;;
    4)
        echo -e "${YELLOW}Deploying and verifying on Coston2...${NC}"
        if [ -z "$FLARESCAN_API_KEY" ]; then
            echo -e "${RED}Warning: FLARESCAN_API_KEY not set. Skipping verification.${NC}"
            forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
                --rpc-url https://coston2.enosys.global/ext/C/rpc \
                --broadcast \
                --legacy
        else
            forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
                --rpc-url https://coston2.enosys.global/ext/C/rpc \
                --broadcast \
                --verify \
                --legacy
        fi
        echo -e "${GREEN}✓ Deployment complete${NC}"
        ;;
    5)
        if [ -f deployments/coston2-latest.json ]; then
            echo -e "${GREEN}Latest deployment:${NC}"
            cat deployments/coston2-latest.json | jq .
        else
            echo -e "${RED}No deployment found. Deploy first!${NC}"
        fi
        ;;
    6)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
