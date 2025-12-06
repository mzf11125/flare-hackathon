// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../src/InfoPilotFactory.sol";
import "../src/InfoPilotSmartAccount.sol";
import "../src/mocks/MockSentimentOracle.sol";
import "../src/mocks/MockDEX.sol";
import "../src/mocks/MockERC20.sol";

/**
 * @title DeployInfoPilot
 * @notice Deployment script for InfoPilot system on Coston2 testnet
 * @dev Run with: forge script script/DeployInfoPilot.s.sol:DeployInfoPilot --rpc-url coston2 --broadcast
 */
contract DeployInfoPilot is Script {
    
    // Coston2 testnet addresses
    address constant FTSO_V2 = 0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20;
    address constant FEED_CONVERTER = 0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66;

    function run() external {
        // Load private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== InfoPilot Deployment ===");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("Balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock Sentiment Oracle
        console.log("\n1. Deploying MockSentimentOracle...");
        MockSentimentOracle sentimentOracle = new MockSentimentOracle();
        console.log("MockSentimentOracle deployed at:", address(sentimentOracle));

        // 2. Deploy Mock DEX
        console.log("\n2. Deploying MockDEX...");
        MockDEX dex = new MockDEX();
        console.log("MockDEX deployed at:", address(dex));

        // 3. Deploy Mock Tokens for testing
        console.log("\n3. Deploying Mock Tokens...");
        
        MockERC20 wflr = new MockERC20("Wrapped Flare", "WFLR", 18);
        console.log("WFLR deployed at:", address(wflr));
        
        MockERC20 usdc = new MockERC20("USD Coin", "USDC", 6);
        console.log("USDC deployed at:", address(usdc));
        
        MockERC20 usdt = new MockERC20("Tether USD", "USDT", 6);
        console.log("USDT deployed at:", address(usdt));

        // 4. Setup DEX exchange rates (10000 = 1:1 ratio)
        console.log("\n4. Setting up DEX exchange rates...");
        dex.setExchangeRate(address(wflr), address(usdc), 10000); // 1:1 for demo
        dex.setExchangeRate(address(usdc), address(wflr), 10000);
        dex.setExchangeRate(address(wflr), address(usdt), 10000);
        dex.setExchangeRate(address(usdt), address(wflr), 10000);
        dex.setExchangeRate(address(usdc), address(usdt), 10000);
        dex.setExchangeRate(address(usdt), address(usdc), 10000);
        console.log("Exchange rates configured");

        // 5. Add liquidity to DEX
        console.log("\n5. Adding liquidity to DEX...");
        uint256 liquidityAmount = 1000000 * 10**18; // 1M tokens
        
        wflr.mint(deployer, liquidityAmount);
        usdc.mint(deployer, liquidityAmount / 10**12); // Adjust for 6 decimals
        usdt.mint(deployer, liquidityAmount / 10**12);
        
        wflr.approve(address(dex), liquidityAmount);
        usdc.approve(address(dex), liquidityAmount / 10**12);
        usdt.approve(address(dex), liquidityAmount / 10**12);
        
        dex.addLiquidity(address(wflr), liquidityAmount / 2);
        dex.addLiquidity(address(usdc), liquidityAmount / 2 / 10**12);
        dex.addLiquidity(address(usdt), liquidityAmount / 2 / 10**12);
        console.log("Liquidity added to DEX");

        // 6. Deploy InfoPilot Factory
        console.log("\n6. Deploying InfoPilotFactory...");
        InfoPilotFactory factory = new InfoPilotFactory(
            FTSO_V2,
            FEED_CONVERTER,
            address(sentimentOracle),
            address(dex)
        );
        console.log("InfoPilotFactory deployed at:", address(factory));

        // 7. Create a demo account
        console.log("\n7. Creating demo InfoPilot account...");
        address demoAccount = factory.createAccount();
        console.log("Demo account created at:", demoAccount);

        // 8. Fund demo account with tokens
        console.log("\n8. Funding demo account...");
        uint256 fundAmount = 10000 * 10**18; // 10K WFLR
        wflr.mint(demoAccount, fundAmount);
        console.log("Demo account funded with", fundAmount / 10**18, "WFLR");

        vm.stopBroadcast();

        // Print deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Coston2");
        console.log("Deployer:", deployer);
        console.log("");
        console.log("Core Contracts:");
        console.log("- InfoPilotFactory:", address(factory));
        console.log("- Demo Account:", demoAccount);
        console.log("");
        console.log("Infrastructure:");
        console.log("- FTSO V2:", FTSO_V2);
        console.log("- Feed Converter:", FEED_CONVERTER);
        console.log("- Sentiment Oracle:", address(sentimentOracle));
        console.log("- DEX Router:", address(dex));
        console.log("");
        console.log("Test Tokens:");
        console.log("- WFLR:", address(wflr));
        console.log("- USDC:", address(usdc));
        console.log("- USDT:", address(usdt));
        console.log("");
        console.log("=== Deployment Complete ===");

        // Save addresses to file
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "factory": "', vm.toString(address(factory)), '",\n',
            '  "demoAccount": "', vm.toString(demoAccount), '",\n',
            '  "sentimentOracle": "', vm.toString(address(sentimentOracle)), '",\n',
            '  "dex": "', vm.toString(address(dex)), '",\n',
            '  "wflr": "', vm.toString(address(wflr)), '",\n',
            '  "usdc": "', vm.toString(address(usdc)), '",\n',
            '  "usdt": "', vm.toString(address(usdt)), '",\n',
            '  "ftsoV2": "', vm.toString(FTSO_V2), '",\n',
            '  "feedConverter": "', vm.toString(FEED_CONVERTER), '"\n',
            "}\n"
        ));
        
        vm.writeFile("deployments/coston2-latest.json", deploymentInfo);
        console.log("\nDeployment info saved to: deployments/coston2-latest.json");
    }
}
