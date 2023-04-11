import React from "react";

import styles from "../styles";

const ActionButton = ({ imgUrl, handleClick, restStyles, isDisabled }) => {
  return (
    <button
      className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles}`}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <img src={imgUrl} alt="action" className={styles.gameMoveIcon} />
    </button>
  );
};

export default ActionButton;
