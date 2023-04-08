import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { alertIcon, gameRules } from "../assets";
import { useGlobalContext } from "../context";
import styles from "../styles";
import CustomButton from "./CustomButton";

const GameInfo = () => {
  const { contract, gameData, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();

  const handleExitBattle = async () => {
    const battleName = gameData.activeBattle.name;

    try {
      await contract.quitBattle(battleName, {
        gasLimit: 200000,
      });

      setShowAlert({
        status: true,
        type: "info",
        message: `You're quitting ${battleName}.`,
      });
    } catch (error) {
      console.log(error.reason);
      setErrorMessage(error);
    }
  };
  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>
          <div className="mt-3">
            {gameRules.map((rule, idx) => (
              <p key={`game-rule-${idx}`} className={styles.gameInfoText}>
                <span className="font-bold">{idx + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change Battleground"
            handleClick={() => navigate("/battleground")}
          />

          <CustomButton title="Exit Battle" handleClick={handleExitBattle} />
        </div>
      </div>
    </>
  );
};

export default GameInfo;
