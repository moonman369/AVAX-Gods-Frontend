import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CustomButton, PageHOC } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const JoinBattle = () => {
  const {
    contract,
    gameData,
    setShowAlert,
    setBattleName,
    walletAddress,
    setErrorMessage,
  } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  useEffect(() => {
    const checkIsPlayer = async () => {
      const isPlayer = await contract.isPlayer(walletAddress);
      !isPlayer && navigate("/");
    };

    if (walletAddress) checkIsPlayer();
  }, [walletAddress]);

  const handleClick = async (battleName) => {
    setBattleName(battleName);

    try {
      const tx = await contract.joinBattle(battleName, {
        gasLimit: 200000,
      });
      await tx.wait();
      navigate(`/battle/${battleName}`);
      setShowAlert({
        staus: true,
        type: "success",
        message: `Joining ${battleName}`,
      });
    } catch (error) {
      setErrorMessage(error);
      // console.error(error);
    }
  };

  return (
    <div>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="Join"
                  handleClick={() => handleClick(battle.name)}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>
            No ongoing battles. Reload the page to see new battles
          </p>
        )}
      </div>

      <p
        className={styles.infoText}
        onClick={() => {
          navigate("/create-battle");
        }}
      >
        Or create a new battle
      </p>
    </div>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join an already existing battle.</>
);
