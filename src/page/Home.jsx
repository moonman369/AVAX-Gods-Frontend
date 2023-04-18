import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CustomInput, PageHOC, CustomButton } from "../components";
import { useGlobalContext } from "../context";
import { GetParams, SwitchNetwork } from "../utils/onboard";
import styles from "../styles";
import { ConnectWallet } from "@thirdweb-dev/react";

const Home = () => {
  const {
    contract,
    chain,
    walletAddress,
    setShowAlert,
    gameData,
    setErrorMessage,
    provider,
  } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const [step, setStep] = useState(-1);

  const resetParamsHome = async () => {
    const currStep = await GetParams();
    setStep(currStep.step);
  };

  const handleClick = async () => {
    try {
      console.log(contract);
      console.log(walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);

      const players = await contract.getAllPlayers();
      console.log(players);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`,
        });
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    resetParamsHome();
  }, [walletAddress, contract, chain]);

  useEffect(() => {
    const checkForPlayerToken = async () => {
      if (!contract) return;
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);
      // console.log(playerExists, playerTokenExists);
      if (playerExists && playerTokenExists) {
        navigate("/create-battle");
      }
    };
    checkForPlayerToken();
  }, [contract, walletAddress]);

  useEffect(() => {
    if (
      gameData?.activeBattle?.players
        .map((player) => player.toLowerCase())
        .includes(walletAddress)
    ) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [walletAddress]);

  if (step === 0) {
    return (
      <>
        <p className={styles.modalText}>
          You don't have an Ethereum Wallet installed!
        </p>
        <div className={`${styles.flexCenter} gap-3`}>
          <CustomButton
            title="Download Core (Beta)"
            handleClick={() => window.open("https://core.app/", "_blank")}
            restStyles="cursor-pointer"
          />
          <br />
          <CustomButton
            title="Download Metamask"
            handleClick={() =>
              window.open("https://metamask.io/download/", "_blank")
            }
            restStyles="cursor-pointer"
          />
        </div>
      </>
    );
  } else if (step === 1) {
    return (
      <>
        <p className={styles.modalText}>
          You haven't connected your account to your Ethereum Wallet!
        </p>
        <div className={`${styles.flexCenter} gap-3`}>
          <CustomButton
            title="Connect Account"
            handleClick={updateCurrentWalletAddress}
          />
        </div>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        <p className={styles.modalText}>
          You're on a different network. Switch to Fuji C-Chain.
        </p>
        <div className={`${styles.flexCenter} gap-3`}>
          <CustomButton title="Switch" handleClick={SwitchNetwork} />
        </div>
      </>
    );
  } else if (step === 3) {
    return (
      <>
        <p className={styles.modalText}>
          Oops, you don't have AVAX tokens in your account
        </p>
        <div className={`${styles.flexCenter} gap-3`}>
          <CustomButton
            title="Grab some test tokens"
            handleClick={() =>
              window.open("https://faucet.avax.network/", "_blank")
            }
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />

      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);
