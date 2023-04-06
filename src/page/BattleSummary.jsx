import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SummaryCard } from "../components";
import { nullAddress } from "../context/createEventListeners";

const BattleSummary = () => {
  const [player, setPlayer] = useState("");
  const [battle, setBattle] = useState(null);

  const { battleGround, contract, walletAddress } = useGlobalContext();

  const { battleName } = useParams();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (battle?.winner === nullAddress) {
      navigate(`/battle/${battleName}`);
    }
  }, [battle]);

  return (
    <div
      className={`${styles.flexCenter} ${styles.gameContainer} ${battleGround}`}
    >
      <SummaryCard battleName={battleName} battle={battle} />
    </div>
  );
};

export default BattleSummary;
