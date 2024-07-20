// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface FxPortal {
    function approve(address to, uint256 tokenId) external;
    function deposit(uint256 tokenId, address depositor, uint256 amount) external;
}

contract NFTCollection is ERC721URIStorage, Ownable(msg.sender) {
    uint256 public nextTokenId = 0;
    mapping(uint256 => string) private _prompts;

    FxPortal public fxPortal;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI,string prompt);
    event NFTDeposited(uint256 indexed tokenId, address indexed depositor);

    constructor(address _fxPortal) ERC721("NFTCollection", "NFTC") {
        fxPortal = FxPortal(_fxPortal);
    }

    function mint(
        address to,
        string memory tokenURI,
        string memory prompt
    ) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _prompts[tokenId] = prompt;

        emit NFTMinted(tokenId, to, tokenURI, prompt);
    }

    function getTokenPrompt(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _prompts[tokenId];
    }
    
    function fetchAllNFTs() external view returns (string[] memory prompts, string[] memory uris) {
        uint256 total = nextTokenId;
        prompts = new string[](total);
        uris = new string[](total);
        for (uint256 i = 0; i < total; i++) {
            prompts[i] = _prompts[i];
            uris[i] = tokenURI(i);
        }
        return (prompts, uris);
    }
}
