// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../interfaces/ISentimentOracle.sol";

/**
 * @title MockSentimentOracle
 * @notice Mock implementation of sentiment oracle (simulates FDC)
 * @dev In production, this would query Flare Data Connector with JsonApi attestations
 *      for real-world sentiment data (social media, news, on-chain metrics, etc.)
 */
contract MockSentimentOracle is ISentimentOracle {
    address public owner;
    
    // Asset => Sentiment data
    mapping(string => SentimentData) private sentiments;

    struct SentimentData {
        int8 value; // -1 = NEGATIVE, 0 = NEUTRAL, 1 = POSITIVE
        uint64 timestamp;
        bool exists;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        
        // Initialize with some default sentiments
        _setSentiment("BTC", 0); // Neutral
        _setSentiment("FLR", 1); // Positive
        _setSentiment("ETH", 0); // Neutral
    }

    /**
     * @notice Gets the current sentiment for a given asset
     * @param asset The asset identifier (e.g., "BTC", "FLR")
     * @return sentiment The current sentiment value (-1, 0, or 1)
     * @return timestamp When the sentiment was last updated
     */
    function getSentiment(string memory asset)
        external
        view
        override
        returns (int8 sentiment, uint64 timestamp)
    {
        SentimentData memory data = sentiments[asset];
        require(data.exists, "Sentiment not found for asset");
        return (data.value, data.timestamp);
    }

    /**
     * @notice Updates sentiment for an asset
     * @param asset The asset identifier
     * @param sentiment The new sentiment value (-1, 0, or 1)
     */
    function updateSentiment(string memory asset, int8 sentiment) external override onlyOwner {
        require(sentiment >= -1 && sentiment <= 1, "Invalid sentiment value");
        _setSentiment(asset, sentiment);
    }

    /**
     * @notice Internal function to set sentiment
     */
    function _setSentiment(string memory asset, int8 sentiment) internal {
        sentiments[asset] = SentimentData({
            value: sentiment,
            timestamp: uint64(block.timestamp),
            exists: true
        });
        emit SentimentUpdated(asset, sentiment, uint64(block.timestamp));
    }

    /**
     * @notice Batch update multiple asset sentiments
     * @param assets Array of asset identifiers
     * @param sentimentValues Array of sentiment values
     */
    function batchUpdateSentiment(string[] memory assets, int8[] memory sentimentValues)
        external
        onlyOwner
    {
        require(assets.length == sentimentValues.length, "Array length mismatch");
        for (uint256 i = 0; i < assets.length; i++) {
            require(sentimentValues[i] >= -1 && sentimentValues[i] <= 1, "Invalid sentiment");
            _setSentiment(assets[i], sentimentValues[i]);
        }
    }

    /**
     * @notice Check if sentiment exists for an asset
     */
    function hasSentiment(string memory asset) external view returns (bool) {
        return sentiments[asset].exists;
    }
}
