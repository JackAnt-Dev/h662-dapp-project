import { Flex, Grid } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IMyAnimalCard } from "../components/MyAnimalCard";
import SaleAnimalCard from "../components/SaleAnimalCard";
import { saleAnimalTokenContract } from "../web3Config";

interface SaleAnimalProps {
  account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [onSaleAnimalCardArray, setOnSaleAnimalCardArray] =
    useState<IMyAnimalCard[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getOnSaleAnimalTokens = async () => {
    try {
      const tempOnSaleArray: IMyAnimalCard[] = [];

      const response = await saleAnimalTokenContract.methods
        .getOnSaleAnimalTokens()
        .call();

      response.map((v: IMyAnimalCard) => {
        tempOnSaleArray.push({
          animalTokenId: v.animalTokenId,
          animalType: v.animalType,
          animalPrice: v.animalPrice,
        });
      });

      setOnSaleAnimalCardArray(tempOnSaleArray);
    } catch (error) {
      console.error(error);
    }
  };

  const buyAnimalToken = async (
    account: string,
    animalTokenId: string,
    animalPrice: string
  ) => {
    try {
      if (!account) return;

      const response = await saleAnimalTokenContract.methods
        .purchaseAnimalToken(animalTokenId)
        .send({ from: account, value: animalPrice });

      if (response.status) {
        refreshAll();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshAll = () => {
    (async () => {
      setIsLoading(true);
      await getOnSaleAnimalTokens();
      // more state-changing functions can be added
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return isLoading ? (
    <Flex justifyContent="center">Loading</Flex>
  ) : (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {onSaleAnimalCardArray &&
        onSaleAnimalCardArray.map((v, i) => {
          return (
            <SaleAnimalCard
              key={i}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              account={account}
              buyAnimalToken={buyAnimalToken}
            />
          );
        })}
    </Grid>
  );
};

export default SaleAnimal;
