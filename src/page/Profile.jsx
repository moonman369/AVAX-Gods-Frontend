import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { PageHOC } from "../components";
import styles from "../styles";
import { logo, player01 } from "../assets";
import { nullAddress } from "../context/createEventListeners";

const Profile = () => {
  const navigate = useNavigate();
  const { showAlert, walletAddress, playerBattles, contract } =
    useGlobalContext();
  const [address, setAddress] = useState("");

  const [participatedBattles, setParticipatedBattles] = useState();
  const [playerName, setPlayerName] = useState("Player");
  const [inBattle, setInBattle] = useState("Fetching...");

  useEffect(() => {
    const checkIsPlayer = async () => {
      const isPlayer = await contract.isPlayer(walletAddress);
      isPlayer ? setAddress(walletAddress) : navigate("/");
    };
    if (walletAddress) checkIsPlayer();
  }, [walletAddress]);

  useEffect(() => {
    if (playerBattles) setParticipatedBattles(playerBattles);
    console.log(playerBattles);
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
            title="Home"
            className={styles.hocLogo}
            onClick={() => {
              navigate("/");
            }}
          />
          {address && (
            <img
              src={player01}
              alt="profile"
              title="Profile"
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
            <h1 className={`flex ${styles.headText} head-text mb-8`}>
              {playerName}
            </h1>
          </div>
          <pre className="flex flex-row">
            <p className={`${styles.normalText}`}>Player Address:&nbsp;</p>
            <a
              className={`${styles.normalTextViolet} font-extrabold`}
              href={`https://testnet.snowtrace.io/address/${address}`}
              target="_blank"
            >
              {`${address.substring(0, 15)}....`}
            </a>
          </pre>
          <span className="flex flex-row">
            <p className={`${styles.normalText}`}>Player Address:&nbsp;</p>
            <p className={styles.normalTextViolet}>{inBattle}</p>
          </span>

          <div>
            <p className={`${styles.normalText} mt-10`}>
              Participated battles:
            </p>
            {participatedBattles?.length > 0 ? (
              participatedBattles.map((battle) => (
                <li className={`${styles.normalTextViolet} text-[18px]`}>
                  {battle.winner === nullAddress ? (
                    <a href={`/battle/${battle.name}`}>{battle.name}</a>
                  ) : (
                    <a href={`/battle-summary/${battle.name}`}>{battle.name}</a>
                  )}
                </li>
              ))
            ) : (
              <div className="text-white">No battles found</div>
            )}
          </div>
        </div>

        <p className={styles.footerText}>Made with 💜 by moonman369</p>
      </div>
    </div>
  );
};

export default Profile;
