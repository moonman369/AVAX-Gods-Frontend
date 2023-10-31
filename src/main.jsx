import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import { GlobalContextProvider } from "./context";
import "./index.css";
import {
  Home,
  CreateBattle,
  JoinBattle,
  Battle,
  BattleGround,
  BattleSummary,
  Profile,
} from "./page";
import { OnboardModal } from "./components";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <ThirdwebProvider desiredChain={ChainId.AvalancheFujiTestnet}>
        <OnboardModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-battle" element={<CreateBattle />} />
          <Route path="/join-battle" element={<JoinBattle />} />
          <Route path="/battleground" element={<BattleGround />} />
          <Route path="/battle/:battleName" element={<Battle />} />
          <Route
            path="/battle-summary/:battleName"
            element={<BattleSummary />}
          />
          <Route path="/profile/:walletAddress" element={<Profile />} />
        </Routes>
      </ThirdwebProvider>
    </GlobalContextProvider>
  </BrowserRouter>
);

// This is a dummy comment
// This is a dummy comment2
// This is a dummy comment3
