import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
  web3,
} from "../web3Config";
import AnimalCard from "./AnimalCard";

interface SaleAnimalCardProps {
  animalType: string;
  animalPrice: string;
  animalTokenId: string;
  account: string;
  buyAnimalToken: (
    account: string,
    animalTokenId: string,
    animalPrice: string
  ) => Promise<void>; // void: have no return
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalType,
  animalPrice,
  animalTokenId,
  account,
  buyAnimalToken,
}) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false);

  const getAnimalTokenOwner = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .ownerOf(animalTokenId)
        .call();

      setIsBuyable(response.toLocaleLowerCase() != account.toLocaleLowerCase());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    buyAnimalToken(account, animalTokenId, animalPrice);
  };

  useEffect(() => {
    getAnimalTokenOwner();
  }, []);

  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalType={animalType} />
      <Box>
        <Text d="inline-block">{web3.utils.fromWei(animalPrice)} Ethers</Text>
        <Button
          size="sm"
          colorScheme="green"
          m={2}
          disabled={!isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
