// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFxPortal {
    function deposit(address user, address rootToken, bytes calldata depositData) external;
}

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public nextTokenId = 0;
    mapping(uint256 => string) private _prompts;

    IFxPortal public fxPortal;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI, string prompt);

    constructor(address _fxPortal) ERC721("NFTCollection", "NFTC") Ownable(msg.sender) {
        fxPortal = IFxPortal(_fxPortal);
    }

    function mint(address to, string memory tokenURI, string memory prompt) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _prompts[tokenId] = prompt;

        emit NFTMinted(tokenId, to, tokenURI, prompt);
    }

    function getTokenPrompt(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _prompts[tokenId];
    }
}
