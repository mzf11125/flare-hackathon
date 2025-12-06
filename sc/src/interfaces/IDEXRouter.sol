// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IDEXRouter
 * @notice Interface for DEX router (simplified Uniswap V2 style)
 */
interface IDEXRouter {
    /**
     * @notice Swaps an exact amount of input tokens for as many output tokens as possible
     * @param amountIn The amount of input tokens to send.
     * @param amountOutMin The minimum amount of output tokens that must be received.
     * @param path An array of token addresses. path.length must be >= 2.
     * @param to Recipient of the output tokens.
     * @param deadline Unix timestamp after which the transaction will revert.
     * @return amounts The input token amount and all subsequent output token amounts.
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    /**
     * @notice Given an input amount of an asset and pair reserves, returns the maximum output amount
     * @param amountIn Amount of input tokens
     * @param path Array of token addresses
     * @return amounts Expected output amounts for each swap in the path
     */
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}
