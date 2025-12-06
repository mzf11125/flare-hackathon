// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IFtsoV2
 * @notice Interface for Flare's FTSO V2 price feeds
 * @dev Coston2 Address: 0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20
 */
interface IFtsoV2 {
    /**
     * @notice Feed data structure
     */
    struct FeedData {
        uint32 votingRoundId;
        bytes21 id;
        int32 value;
        uint16 turnoutBIPS;
        int8 decimals;
    }

    /**
     * @notice Feed data with proof structure
     */
    struct FeedDataWithProof {
        bytes32[] proof;
        FeedData body;
    }

    /**
     * @notice Returns stored data of a feed. A fee may need to be paid.
     * @param _feedId The id of the feed.
     * @return _value The value for the requested feed.
     * @return _decimals The decimal places for the requested feed.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedById(bytes21 _feedId)
        external
        payable
        returns (uint256 _value, int8 _decimals, uint64 _timestamp);

    /**
     * @notice Returns value in wei and timestamp of a feed.
     * @param _feedId The id of the feed.
     * @return _value The value for the requested feed in wei (18 decimal places).
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedByIdInWei(bytes21 _feedId)
        external
        payable
        returns (uint256 _value, uint64 _timestamp);

    /**
     * @notice Returns stored data of each feed.
     * @param _feedIds The list of feed ids.
     * @return _values The list of values for the requested feeds.
     * @return _decimals The list of decimal places for the requested feeds.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedsById(bytes21[] memory _feedIds)
        external
        payable
        returns (uint256[] memory _values, int8[] memory _decimals, uint64 _timestamp);

    /**
     * @notice Returns value of each feed and a timestamp.
     * @param _feedIds Ids of the feeds.
     * @return _values The list of values for the requested feeds in wei.
     * @return _timestamp The timestamp of the last update.
     */
    function getFeedsByIdInWei(bytes21[] memory _feedIds)
        external
        payable
        returns (uint256[] memory _values, uint64 _timestamp);

    /**
     * @notice Returns the list of supported feed ids.
     */
    function getSupportedFeedIds() external view returns (bytes21[] memory _feedIds);
}
