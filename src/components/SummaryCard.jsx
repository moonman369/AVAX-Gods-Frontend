import React, { useEffect, useState } from "react";
import styles from "../styles";
import { useGlobalContext } from "../context";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";

const SummaryCard = ({ battleName, battle }) => {
  const { contract, walletAddress } = useGlobalContext();

  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [playerMana, setPlayerMana] = useState("");
  const [winnerAddress, setWinnerAddress] = useState("");

  useEffect(() => {
    if (battle) {
      setWinnerAddress(battle?.winner?.toLowerCase());
    }
    const fetchPlayerDetails = async () => {
      const playerObject = await contract.getPlayer(walletAddress);
      setPlayerName(playerObject.playerName);
      setPlayerMana(playerObject.playerMana.toNumber());
    };
    if (contract && walletAddress) {
      fetchPlayerDetails();
    }
  }, [contract, walletAddress, battle]);

  if (
    !battle?.players
      ?.map((player) => player.toLowerCase())
      ?.includes(walletAddress.toLowerCase())
  ) {
    return (
      <div className={`${styles.flexCenter} flex-col gap-6`}>
        <div className={`bg-[#1414149a] rounded-[10px] p-6 `}>
          <h1
            className={`justify-center content-center flex ${styles.summaryHead}`}
          >
            YOU DID NOT PARTICIPATE IN THIS BATTLE.
          </h1>
        </div>
        <CustomButton
          title={"Go Back to Home"}
          handleClick={() => {
            navigate("/");
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.flexCenter} flex-col gap-5`}>
      {walletAddress === winnerAddress ? (
        <div className={`bg-[#2de26a86] rounded-[10px] p-6 `}>
          <h1
            className={`justify-center content-center flex ${styles.summaryHead}`}
          >
            VICTORY
          </h1>
          <br />
          <br />
          <span className="flex  flex-row">
            <p className={styles.summaryKeyText}>Player Name:&nbsp;</p>
            <p className={styles.summaryValueText}>{playerName}</p>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Player Address:&nbsp;</p>
            <a
              className={styles.summaryValueText}
              href={`https://testnet.snowtrace.io/address/${walletAddress}`}
              target="_blank"
            >{`${walletAddress.slice(0, 20)}....`}</a>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Battle Name:&nbsp;</p>
            <p className={styles.summaryValueText}>{battleName}</p>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Player Mana:&nbsp;</p>
            <p className={styles.summaryValueText}>{playerMana}</p>
          </span>
          <br />
        </div>
      ) : (
        <div className={`bg-[#eb585886] rounded-[10px] p-6 `}>
          <h1
            className={`justify-center content-center flex ${styles.summaryHead}`}
          >
            DEFEAT
          </h1>
          <br />
          <br />
          <span className="flex  flex-row">
            <p className={styles.summaryKeyText}>Player Name:&nbsp;</p>
            <p className={styles.summaryValueText}>{playerName}</p>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Player Address:&nbsp;</p>
            <a
              className={styles.summaryValueText}
              href={`https://testnet.snowtrace.io/address/${walletAddress}`}
              target="_blank"
            >{`${walletAddress.slice(0, 20)}....`}</a>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Battle Name:&nbsp;</p>
            <p className={styles.summaryValueText}>{battleName}</p>
          </span>
          <br />

          <span className="flex flex-row">
            <p className={styles.summaryKeyText}>Player Mana:&nbsp;</p>
            <p className={styles.summaryValueText}>{playerMana}</p>
          </span>
          <br />
        </div>
      )}

      <CustomButton
        title={"Go Back to Home"}
        handleClick={() => {
          navigate("/");
        }}
      />
    </div>
  );
};

export default SummaryCard;
