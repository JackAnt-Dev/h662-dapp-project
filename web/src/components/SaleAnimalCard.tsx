import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { web3 } from "../web3Config";
import AnimalCard from "./AnimalCard";

interface SaleAnimalCardProps {
  animalType: string;
  animalPrice: string;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalType,
  animalPrice,
}) => {
  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalType={animalType} />
      <Box>
        <Text d="inline-block">{web3.utils.fromWei(animalPrice)} Ethers</Text>
        <Button size="sm" colorScheme="green">
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
