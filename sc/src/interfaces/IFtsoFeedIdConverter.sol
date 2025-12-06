// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IFtsoFeedIdConverter
 * @notice Interface for converting feed names to feed IDs
 * @dev Coston2 Address: 0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66
 */
interface IFtsoFeedIdConverter {
    /**
     * @notice Returns the feed id for given category and name.
     * @param _category Feed category (1 = crypto, 2 = FX, 3 = commodity, 4 = stock).
     * @param _name Feed name (e.g., "BTC/USD", "FLR/USD").
     * @return Feed id (bytes21).
     */
    function getFeedId(uint8 _category, string memory _name) external view returns (bytes21);

    /**
     * @notice Returns the feed category and name for given feed id.
     * @param _feedId Feed id.
     * @return _category Feed category.
     * @return _name Feed name.
     */
    function getFeedCategoryAndName(bytes21 _feedId)
        external
        pure
        returns (uint8 _category, string memory _name);
}
