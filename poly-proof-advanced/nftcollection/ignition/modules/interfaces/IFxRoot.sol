pragma solidity ^0.8.0;

interface IFxRoot {
    function deposit(
        address rootToken,
        address user,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function rootToChildToken(address rootToken) external view returns (address);
}
