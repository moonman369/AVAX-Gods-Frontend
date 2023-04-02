import React from "react";

import styles from "../styles";

const ActionButton = ({ imgUrl, handleClick, restStyles }) => {
  return (
    <div
      className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles}`}
    >
      <img
        src={imgUrl}
        alt="action"
        className={styles.gameMoveIcon}
        onClick={handleClick}
      />
    </div>
  );
};

export default ActionButton;
