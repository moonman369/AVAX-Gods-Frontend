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
import { Alert } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { playAudio } from "../utils/animation.js";

const Battle = () => {
  const {
    contract,
    gameData,
    walletAddress,
    showAlert,
    setShowAlert,
    battleGround,
  } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let [player01Address, player02Address] = [null, null];

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

        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        p1H = player01.playerHealth.toNumber();
        p1M = player01.playerMana.toNumber();
        p2H = player02.playerHealth.toNumber();
        p2M = player02.playerMana.toNumber();

        setPlayer1({
          ...player01,
          att: p1Att,
          def: p1Def,
          health: p1H,
          mana: p1M,
        });
        setPlayer2({ ...player02, att: "X", def: "X", health: p2H, mana: p2M });
      } catch (error) {
        console.error(error);
      }
    };

    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName]);

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <PlayerInfo player={player2} playerIcon={player02Icon} mt />
    </div>
  );
};

export default Battle;
