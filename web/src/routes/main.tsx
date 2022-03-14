import React, { FC, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../web3Config";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();
  const onClickMint = async () => {
    try {
      if (!account) return;

      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: account });

      if (response.status) {
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(account)
          .call();

        const animalTokenId = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(
            account,
            parseInt(balanceLength.length, 10) - 1 // 10진수 int 형변환
          )
          .call();

        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call();

        setNewAnimalType(animalType);
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex // flexbox 사용
      w="full"
      h="100vh" // 100vh = 화면 전체
      justifyContent="center" // main axis기준으로 중앙
      alignItems="center" // cross axis기준으로 중앙
      direction="column" // main axis를 column방향으로
    >
      <Box>
        {newAnimalType ? (
          <AnimalCard animalType={newAnimalType} />
        ) : (
          <Text>Let's mint Animal Card!!!</Text>
        )}
      </Box>
      <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>
        Mint
      </Button>
    </Flex>
  );
};

export default Main;
