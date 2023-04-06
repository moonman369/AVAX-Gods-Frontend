import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from "../assets";
import { ActionButton, Alert, Card, GameInfo, PlayerInfo } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { playAudio } from "../utils/animation.js";
import { nullAddress } from "../context/createEventListeners";

const Battle = () => {
  const {
    contract,
    gameData,
    walletAddress,
    showAlert,
    setShowAlert,
    battleGround,
    setErrorMessage,
    player1Ref,
    player2Ref,
    setUpdateGameData,
  } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData.activeBattle?.winner !== nullAddress) {
      console.log(gameData);
      navigate(`/battle-summary/${battleName}`);
    }
  }, [gameData]);

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let [player01Address, player02Address] = [null, null];
        console.log("activebattle", gameData.activeBattle);

        if (
          gameData.activeBattle.players[0].toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
        }

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const player01 = await contract.getPlayer(player01Address);
        const player02 = await contract.getPlayer(player02Address);

        console.log(player01);

        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        const p1M = player01.playerMana.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();
        console.log(p1H);

        setPlayer1({
          ...player01,
          att: p1Att,
          def: p1Def,
          health: p1H,
          mana: p1M,
        });
        setPlayer2({ ...player02, att: "X", def: "X", health: p2H, mana: p2M });
      } catch (error) {
        setErrorMessage(error);
        // console.error(error);
      }
    };

    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName, walletAddress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) {
        navigate("/");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      const tx = await contract.attackOrDefendChoice(choice, battleName, {
        gasLimit: 200000,
      });
      await tx.wait();
      setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);

      setShowAlert({
        status: true,
        type: "info",
        message: `Conjuring ${choice === 1 ? "attack" : "defense"} spell`,
      });
    } catch (error) {
      console.log(error.reason);
      setErrorMessage(error);
    }
  };

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <PlayerInfo player={player2} playerIcon={player02Icon} mt />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card
          card={player2}
          title={player2?.playerName}
          cardRef={player2Ref}
          playerTwo
        />

        <div className="flex items-center flex-row">
          <ActionButton
            imgUrl={attack}
            handleClick={() => {
              makeAMove(1);
            }}
            restStyles="mr-2 hover:border-yellow-400"
          />

          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-3"
          />
          <ActionButton
            imgUrl={defense}
            handleClick={() => {
              makeAMove(2);
            }}
            restStyles="ml-6 hover:border-red-600"
          />
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} />

      <GameInfo />
    </div>
  );
};

export default Battle;
