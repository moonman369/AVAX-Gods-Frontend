import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { useLocation, useParams } from "react-router-dom";
import { SummaryCard } from "../components";

const BattleSummary = () => {
  const [player, setPlayer] = useState("");
  const [battle, setBattle] = useState(null);

  const { battleGround, contract, walletAddress } = useGlobalContext();

  const { battleName } = useParams();

  useEffect(() => {
    const fetchInfo = async () => {
      const battleFromContract = await contract.getBattle(battleName);
      setBattle(battleFromContract);
    };
    if (walletAddress && contract) {
      fetchInfo();
      setPlayer(walletAddress.toLowerCase());
    }
  }, [walletAddress, contract]);

  return (
    <div
      className={`${styles.flexCenter} ${styles.gameContainer} ${battleGround}`}
    >
      <SummaryCard battleName={battleName} battle={battle} />
    </div>
  );
};

export default BattleSummary;
