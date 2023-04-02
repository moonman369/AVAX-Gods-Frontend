import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles";
import { Alert } from "../components";
import { battlegrounds } from "../assets";
import { useGlobalContext } from "../context";

const BattleGround = () => {
  const navigate = useNavigate();
  const { showAlert, setShowAlert, setBattleGround } = useGlobalContext();

  const handleBattlegroundChoice = (ground) => {
    setBattleGround(ground.id);

    localStorage.setItem("battleground", ground.id);

    setShowAlert({
      status: true,
      type: "info",
      message: `${ground.name} is ready for the battle to commence!`,
    });

    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      {showAlert.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <h1 className={`${styles.headText} text-center`}>
        Choose your
        <span className="text-siteViolet"> Battle </span>
        Ground
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {battlegrounds.map((ground) => (
          <div
            key={ground.id}
            className={`${styles.flexCenter} ${styles.battleGroundCard}`}
            onClick={() => handleBattlegroundChoice(ground)}
          >
            <img
              src={ground.image}
              alt="saiman"
              className={styles.battleGroundCardImg}
            />

            <div className="info absolute">
              <p className={styles.battleGroundCardText}>{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleGround;
