import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const CreateBattle = () => {
  const navigate = useNavigate();
  const {
    contract,
    battleName,
    setBattleName,
    gameData,
    setErrorMessage,
    walletAddress,
  } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }

    if (gameData.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  useEffect(() => {
    const checkIsPlayer = async () => {
      const isPlayer = await contract.isPlayer(walletAddress);
      !isPlayer && navigate("/");
    };

    if (walletAddress) checkIsPlayer();
  }, [walletAddress]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;
    try {
      await contract.createBattle(battleName, {
        gasLimit: 200000,
      });
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
      // console.error(error);
    }
  };

  return (
    <div>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p
        className={styles.infoText}
        onClick={() => {
          navigate("/join-battle");
        }}
      >
        Or join an already existing battle!
      </p>
    </div>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join.</>
);
