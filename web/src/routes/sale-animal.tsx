import { Grid } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IMyAnimalCard } from "../components/MyAnimalCard";
import SaleAnimalCard from "../components/SaleAnimalCard";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
} from "../web3Config";

interface SaleAnimalProps {
  account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [onSaleAnimalCardArray, setOnSaleAnimalCardArray] =
    useState<IMyAnimalCard[]>();

  const getOnSaleAnimalTokens = async () => {
    try {
      const onSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
        .getOnSaleAnimalTokenArrayLength()
        .call();

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

  useEffect(() => {
    getOnSaleAnimalTokens();
  }, []);

  useEffect(() => {
    console.log(onSaleAnimalCardArray);
  }, [onSaleAnimalCardArray]);

  return (
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
              getOnSaleAnimalTokens={getOnSaleAnimalTokens}
            />
          );
        })}
    </Grid>
  );
};

export default SaleAnimal;
