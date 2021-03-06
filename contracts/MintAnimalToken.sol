// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./SaleAnimalToken.sol";

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("animalparty", "APY") {}

    mapping(uint256 => uint256) public animalTypes;

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        uint256 animalType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId))) % 5 + 1;   // great random generation for solidity

        animalTypes[animalTokenId] = animalType;
        _mint(msg.sender, animalTokenId);
    }

    function getAnimalType(uint256 _animalTokenId) view public returns (uint256) {
        return animalTypes[_animalTokenId];
    }
}
