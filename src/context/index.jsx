import { ethers } from "ethers";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  return (
    <GlobalContext.Provider
      value={{
        demo: "test",
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
