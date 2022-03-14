// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;  // token address for sale

    constructor (address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    }

    mapping(uint256 => uint256) public animalTokenPrices;   // tokenId => price

    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }

    uint256[] public onSaleAnimalTokenArray;

    /**
     * give permission to sale token by token owner with given price
     */
    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price) public {
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(animalTokenOwner == msg.sender, "Caller is not animal token owner.");
        require(_price > 0, "Price is zero or lower.");
        require(animalTokenPrices[_animalTokenId] == 0, "This animal token is already on sale.");
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token sale."); // this contract need approve for sale by token owner.

        animalTokenPrices[_animalTokenId] = _price;
        onSaleAnimalTokenArray.push(_animalTokenId);
    }

    function getAnimalTokens(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {    // string or array need storage type (memory / storage)
        uint256 balanceLength = mintAnimalTokenAddress.balanceOf(_animalTokenOwner);

        require(balanceLength != 0, "Owner did not have token.");

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength);    // array length initialize

        for (uint256 i=0; i < balanceLength; i++) {
            uint256 animalTokenId = mintAnimalTokenAddress.tokenOfOwnerByIndex(_animalTokenOwner, i);
            uint256 animalType = mintAnimalTokenAddress.animalTypes(animalTokenId);
            uint256 animalPrice = animalTokenPrices[animalTokenId];

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
        }

        return animalTokenData;
    }

    function purchaseAnimalToken(uint256 _animalTokenId) public payable {
        uint256 price = animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);
        
        require(price > 0, "Animal token not sale.");
        require(price <= msg.value, "Caller sent lower than price.");
        require(animalTokenOwner != msg.sender, "Caller is animal token owner.");

        // check-effects-interaction
        animalTokenPrices[_animalTokenId] = 0;
        for (uint256 i = 0; i < onSaleAnimalTokenArray.length; i++) {
            if (animalTokenPrices[onSaleAnimalTokenArray[i]] == 0) {
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[onSaleAnimalTokenArray.length-1];
                onSaleAnimalTokenArray.pop();
                break;  // early stop
            }
        }
        payable(animalTokenOwner).transfer(msg.value);  // allow more money?? no remainder??
        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner, msg.sender, _animalTokenId);  // internally check isApprovalForAll
    }

    function getOnSaleAnimalTokenArrayLength() public view returns (uint256) {
        return onSaleAnimalTokenArray.length;
    }

    function getAnimalTokenPrice(uint256 _animalTokenId) public view returns (uint256) {
        return animalTokenPrices[_animalTokenId];
    }
}