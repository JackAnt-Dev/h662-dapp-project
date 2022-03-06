import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./routes/main";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

// import { Button } from "@chakra-ui/react";
// <Button colorScheme="blue">web3-boilerplate</Button>;
export default App;
