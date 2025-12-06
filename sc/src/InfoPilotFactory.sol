// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./InfoPilotSmartAccount.sol";

/**
 * @title InfoPilotFactory
 * @notice Factory contract for deploying individual InfoPilot Smart Accounts
 * @dev Allows each user to deploy their own autonomous trading agent
 */
contract InfoPilotFactory {
    
    // ============ State Variables ============
    
    // Flare contract addresses (Coston2 testnet)
    address public immutable ftsoV2;
    address public immutable feedConverter;
    address public sentimentOracle;
    address public dexRouter;
    
    // Track all deployed accounts
    mapping(address => address[]) public userAccounts;
    address[] public allAccounts;
    
    // ============ Events ============
    
    event AccountCreated(
        address indexed user,
        address indexed account,
        uint256 accountIndex,
        uint256 timestamp
    );
    
    event ConfigurationUpdated(
        address indexed sentimentOracle,
        address indexed dexRouter,
        uint256 timestamp
    );

    // ============ Constructor ============
    
    /**
     * @notice Initialize factory with Flare contract addresses
     * @param _ftsoV2 FTSO V2 contract address (Coston2: 0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20)
     * @param _feedConverter Feed ID Converter (Coston2: 0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66)
     * @param _sentimentOracle Sentiment oracle address (mock for testnet)
     * @param _dexRouter DEX router address (mock for testnet)
     */
    constructor(
        address _ftsoV2,
        address _feedConverter,
        address _sentimentOracle,
        address _dexRouter
    ) {
        require(_ftsoV2 != address(0), "Invalid FTSO address");
        require(_feedConverter != address(0), "Invalid converter address");
        require(_sentimentOracle != address(0), "Invalid oracle address");
        require(_dexRouter != address(0), "Invalid DEX address");

        ftsoV2 = _ftsoV2;
        feedConverter = _feedConverter;
        sentimentOracle = _sentimentOracle;
        dexRouter = _dexRouter;
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new InfoPilot Smart Account for the caller
     * @return account Address of the newly created account
     */
    function createAccount() external returns (address account) {
        // Deploy new InfoPilotSmartAccount
        InfoPilotSmartAccount newAccount = new InfoPilotSmartAccount(
            ftsoV2,
            feedConverter,
            sentimentOracle,
            dexRouter
        );

        account = address(newAccount);

        // Transfer ownership to caller
        newAccount.transferOwnership(msg.sender);

        // Track the account
        userAccounts[msg.sender].push(account);
        allAccounts.push(account);

        emit AccountCreated(
            msg.sender,
            account,
            userAccounts[msg.sender].length - 1,
            block.timestamp
        );

        return account;
    }

    /**
     * @notice Create multiple accounts at once
     * @param count Number of accounts to create
     * @return accounts Array of created account addresses
     */
    function createMultipleAccounts(uint256 count) external returns (address[] memory accounts) {
        require(count > 0 && count <= 10, "Invalid count (max 10)");
        
        accounts = new address[](count);
        
        for (uint256 i = 0; i < count; i++) {
            InfoPilotSmartAccount newAccount = new InfoPilotSmartAccount(
                ftsoV2,
                feedConverter,
                sentimentOracle,
                dexRouter
            );

            address account = address(newAccount);
            newAccount.transferOwnership(msg.sender);

            userAccounts[msg.sender].push(account);
            allAccounts.push(account);
            accounts[i] = account;

            emit AccountCreated(
                msg.sender,
                account,
                userAccounts[msg.sender].length - 1,
                block.timestamp
            );
        }

        return accounts;
    }

    // ============ View Functions ============

    /**
     * @notice Get all accounts created by a user
     * @param user User address
     * @return Array of account addresses
     */
    function getUserAccounts(address user) external view returns (address[] memory) {
        return userAccounts[user];
    }

    /**
     * @notice Get the number of accounts created by a user
     * @param user User address
     * @return Number of accounts
     */
    function getUserAccountCount(address user) external view returns (uint256) {
        return userAccounts[user].length;
    }

    /**
     * @notice Get total number of accounts created
     * @return Total account count
     */
    function getTotalAccountCount() external view returns (uint256) {
        return allAccounts.length;
    }

    /**
     * @notice Get all created accounts
     * @return Array of all account addresses
     */
    function getAllAccounts() external view returns (address[] memory) {
        return allAccounts;
    }

    /**
     * @notice Get a specific account by user and index
     * @param user User address
     * @param index Account index for that user
     * @return Account address
     */
    function getAccountByIndex(address user, uint256 index) external view returns (address) {
        require(index < userAccounts[user].length, "Invalid index");
        return userAccounts[user][index];
    }

    /**
     * @notice Check if an address is an account created by this factory
     * @param account Address to check
     * @return True if account was created by this factory
     */
    function isFactoryAccount(address account) external view returns (bool) {
        for (uint256 i = 0; i < allAccounts.length; i++) {
            if (allAccounts[i] == account) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Get factory configuration
     * @return _ftsoV2 FTSO V2 address
     * @return _feedConverter Feed converter address
     * @return _sentimentOracle Sentiment oracle address
     * @return _dexRouter DEX router address
     */
    function getConfiguration()
        external
        view
        returns (
            address _ftsoV2,
            address _feedConverter,
            address _sentimentOracle,
            address _dexRouter
        )
    {
        return (ftsoV2, feedConverter, sentimentOracle, dexRouter);
    }

    // ============ Admin Functions (for upgradeable mocks) ============

    /**
     * @notice Update sentiment oracle address (for mock contract upgrades)
     * @dev Only affects newly created accounts
     */
    function updateSentimentOracle(address _newOracle) external {
        require(_newOracle != address(0), "Invalid address");
        sentimentOracle = _newOracle;
        emit ConfigurationUpdated(sentimentOracle, dexRouter, block.timestamp);
    }

    /**
     * @notice Update DEX router address (for mock contract upgrades)
     * @dev Only affects newly created accounts
     */
    function updateDexRouter(address _newRouter) external {
        require(_newRouter != address(0), "Invalid address");
        dexRouter = _newRouter;
        emit ConfigurationUpdated(sentimentOracle, dexRouter, block.timestamp);
    }
}
