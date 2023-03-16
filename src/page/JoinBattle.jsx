import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CustomButton, PageHOC } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const JoinBattle = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>
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
