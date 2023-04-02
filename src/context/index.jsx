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
import createEventListeners from "./createEventListeners";

const GlobalContext = createContext();

const AVAX_MAINNET_CHAIN_ID = 43114;
const AVAX_FUJI_TESTNET_CHAIN_ID = 43113;

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [battleName, setBattleName] = useState("");
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [updateGameData, setUpdateGameData] = useState(0);
  const [battleGround, setBattleGround] = useState(
    localStorage.getItem("battleground") || "bg-astral"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const battlegroundFromLocalStorage = localStorage.getItem("battleground");

    if (battlegroundFromLocalStorage) {
      setBattleGround(battlegroundFromLocalStorage);
    } else {
      localStorage.setItem("battleground", battleGround);
    }
  }, []);

  // * Set the wallet address to state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    if (accounts) setWalletAddress(accounts[0]);
  };

  const switchToFuji = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${AVAX_FUJI_TESTNET_CHAIN_ID.toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${AVAX_FUJI_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: "Fuji Testnet",
                nativeCurrency: {
                  name: "Avalanche Token",
                  symbol: "AVAX",
                  decimals: 18,
                },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://testnet.snowtrace.io/"],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  useEffect(() => {
    updateCurrentWalletAddress();
    window.ethereum.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  useEffect(() => {
    const run = async () => {
      await switchToFuji();
    };
    run();
  }, []);

  // * Set the smart contract and provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        battleName,
        setBattleName,
        setUpdateGameData,
      });
    }
  }, [contract]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Set game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      console.log(fetchedBattles);
      const pendingBattles = fetchedBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      let activeBattle = null;

      fetchedBattles.forEach((battle) => {
        if (
          battle.players.find(
            (player) => player.toLowerCase() === walletAddress.toLowerCase()
          )
        ) {
          if (battle.winner === "0x0000000000000000000000000000000000000000") {
            activeBattle = battle;
          }
        }
      });
      setGameData({
        pendingBattles: pendingBattles.slice(1),
        activeBattle,
      });
    };
    if (contract) fetchGameData();
  }, [contract, updateGameData]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        updateGameData,
        setUpdateGameData,
        battleGround,
        setBattleGround,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
