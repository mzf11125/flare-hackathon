// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title IERC20
 * @notice Interface for ERC20 token standard
 */
interface IERC20 {
    /**
     * @notice Returns the total token supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @notice Returns the account balance of another account.
     * @param account The address to query the balance of.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @notice Transfers tokens to a specified address.
     * @param to The address to transfer to.
     * @param amount The amount to be transferred.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @notice Returns the amount which spender is still allowed to withdraw from owner.
     * @param owner The address which owns the funds.
     * @param spender The address which will spend the funds.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @notice Approves the passed address to spend the specified amount of tokens.
     * @param spender The address which will spend the funds.
     * @param amount The amount of tokens to be spent.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @notice Transfers tokens from one address to another.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param amount The amount to be transferred.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
