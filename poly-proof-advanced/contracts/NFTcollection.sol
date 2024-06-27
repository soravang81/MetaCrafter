// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTCollection is ERC721, Ownable {
    string[] private prompts;
    string private baseTokenURI;
    uint256 public constant MAX_SUPPLY = 5;

    constructor(string memory _name, string memory _symbol, string memory _baseTokenURI) ERC721(_name, _symbol) Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
    }

    function addPrompt(string memory _prompt) public onlyOwner {
        require(prompts.length < MAX_SUPPLY, "All prompts have been added");
        prompts.push(_prompt);
    }

    function promptDescription(uint256 tokenId) public view returns (string memory) {
        require(tokenId < prompts.length, "Prompt not set for this token");
        return prompts[tokenId];
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        require(tokenId < MAX_SUPPLY, "Token ID out of range");
        require(tokenId < prompts.length, "Prompt not set for this token");
        _safeMint(to, tokenId);
    }

    function getPromptsCount() public view returns (uint256) {
        return prompts.length;
    }
}