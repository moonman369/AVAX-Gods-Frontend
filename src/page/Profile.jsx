import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { PageHOC } from "../components";
import styles from "../styles";
import { logo, player01 } from "../assets";

const Profile = () => {
  const navigate = useNavigate();
  const { showAlert, walletAddress, playerBattles, contract } =
    useGlobalContext();
  const [address, setAddress] = useState("");

  const [participatedBattles, setParticipatedBattles] = useState();
  const [playerName, setPlayerName] = useState("Player");
  const [inBattle, setInBattle] = useState("Fetching...");

  useEffect(() => {
    if (walletAddress) setAddress(walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    if (playerBattles) setParticipatedBattles(playerBattles);
  }, [playerBattles]);

  useEffect(() => {
    const setPlayerDetails = async () => {
      const fetchedPlayer = await contract.getPlayer(walletAddress);
      console.log(fetchedPlayer);
      setPlayerName(fetchedPlayer?.playerName);
      setInBattle(
        fetchedPlayer?.inBattle ? "Currently in battle" : "Not in any battle"
      );
    };
    if (walletAddress && contract) setPlayerDetails();
  }, [walletAddress, contract]);

  return (
    <div className={styles.hocContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <div className={styles.hocContentBox}>
        <div className={styles.flexBetween}>
          <img
            src={logo}
            alt="logo"
            className={styles.hocLogo}
            onClick={() => {
              navigate("/");
            }}
          />
          {address && (
            <img
              src={player01}
              alt="profile"
              className={`w-[58px] h-[58px] object-contain rounded-full cursor-pointer border-[2.5px]`}
              onClick={() => {
                navigate(`/profile/${address}`);
              }}
            />
          )}
          {!window.ethereum && (
            <nav>
              <ConnectWallet
                theme="dark"
                btnTitle="Connect"
                className="font-epilogue font-semibold test-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]"
              />
            </nav>
          )}
        </div>

        <div className={styles.hocBodyWrapper}>
          <div className="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text`}>
              {playerName}
            </h1>
          </div>
          <p className={`${styles.normalText} my-10`}>
            Player Address: {address}
          </p>
          <p className={`${styles.normalText} my-10`}>
            Player Battle Status: {inBattle}
          </p>
        </div>

        <div>
          {participatedBattles?.length > 0 ? (
            participatedBattles.map((battle) => (
              <div className="text-white">{battle.name}</div>
            ))
          ) : (
            <div className="text-white">No battles found</div>
          )}
        </div>

        <p className={styles.footerText}>Made with 💜 by moonman369</p>
      </div>
    </div>
  );
};

export default Profile;
