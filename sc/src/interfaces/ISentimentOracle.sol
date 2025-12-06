// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title ISentimentOracle
 * @notice Interface for sentiment oracle (simulates FDC sentiment data)
 * @dev In production, this would use Flare Data Connector with JsonApi attestations
 */
interface ISentimentOracle {
    /**
     * @notice Sentiment types
     * @dev NEGATIVE = -1, NEUTRAL = 0, POSITIVE = 1
     */
    enum Sentiment {
        NEGATIVE, // -1
        NEUTRAL, // 0
        POSITIVE // 1
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
        returns (int8 sentiment, uint64 timestamp);

    /**
     * @notice Updates sentiment for an asset (admin only in mock)
     * @param asset The asset identifier
     * @param sentiment The new sentiment value
     */
    function updateSentiment(string memory asset, int8 sentiment) external;

    event SentimentUpdated(string indexed asset, int8 sentiment, uint64 timestamp);
}
