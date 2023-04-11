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
import { GetParams } from "../utils/onboard";
import { parse } from "postcss";

const GlobalContext = createContext();

const AVAX_MAINNET_CHAIN_ID = 43114;
const AVAX_FUJI_TESTNET_CHAIN_ID = 43113;

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [chain, setChain] = useState("");
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
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [playerBattles, setPlayerBattles] = useState([]);

  const player1Ref = useRef();
  const player2Ref = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const battlegroundFromLocalStorage = localStorage.getItem("battleground");

    if (battlegroundFromLocalStorage) {
      setBattleGround(battlegroundFromLocalStorage);
    } else {
      localStorage.setItem("battleground", battleGround);
    }
  }, []);

  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();
      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on("chainChanged", () => {
      resetParams();
      setChain(window?.ethereum?.chainId);
    });
    window?.ethereum?.on("accountsChanged", () => {
      resetParams();
    });
  }, []);

  // * Set the wallet address to state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    if (accounts) setWalletAddress(accounts[0]);
  };

  const switchToFuji = async () => {
    try {
      await window?.ethereum?.request({
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
          await window?.ethereum?.request({
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
    window?.ethereum?.on("accountsChanged", updateCurrentWalletAddress);
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

    if (window?.ethereum) setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (contract && step !== -1) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        battleName,
        setBattleName,
        setUpdateGameData,
        player1Ref,
        player2Ref,
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

  // Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason
        ?.slice("execution reverted: ".length)
        .slice(0, -1);
      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

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

  useEffect(() => {
    const fetchBattles = async () => {
      const allBattles = await contract.getAllBattles();
      const fetchedPlayerBattles = allBattles.filter((battle) =>
        battle.players
          .map((player) => player.toLowerCase())
          .includes(walletAddress.toLowerCase())
      );
      console.log(fetchedPlayerBattles);
      setPlayerBattles(fetchedPlayerBattles);
    };

    if (contract && walletAddress) {
      fetchBattles();
      // console.log(playerBattles);
    }
  }, [contract, walletAddress]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        updateCurrentWalletAddress,
        chain,
        setChain,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        setGameData,
        playerBattles,
        setPlayerBattles,
        updateGameData,
        setUpdateGameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
