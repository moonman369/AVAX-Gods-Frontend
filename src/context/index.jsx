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

import { ABI, ADDRESS } from "../contract";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // * Set the wallet address to state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // console.log(accounts);
    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();
    window.ethereum.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  // * Set the smart contract and provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.signer();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
      console.log(newContract);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
