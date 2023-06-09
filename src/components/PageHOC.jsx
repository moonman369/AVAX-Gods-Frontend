import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectWallet } from "@thirdweb-dev/react";

import { logo, heroImg } from "../assets";
import { useGlobalContext } from "../context";
import styles from "../styles";
import Alert from "./Alert";

// Implementing code reusability using Higher Order Component (HOC). It is essentially a wrapper component that takes another child component as an argument. It is a function that returns another function

const PageHOC = (Component, title, description, walletAddress) => () => {
  const { showAlert, walletAddress, contract, playerAvatarUri } =
    useGlobalContext();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsPlayer = async () => {
      const isPlayer = await contract.isPlayer(walletAddress);
      isPlayer && setAddress(walletAddress);
    };
    if (walletAddress && contract) checkIsPlayer();
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
              src={playerAvatarUri}
              alt="profile"
              title="Profile"
              className={`w-[58px] h-[58px] object-contain rounded-full cursor-pointer border-[2px] border-siteViolet`}
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
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          </div>
          <p className={`${styles.normalText} my-10`}>{description}</p>

          <Component />
        </div>

        <p className={styles.footerText}>Made with 💜 by moonman369</p>
      </div>

      <div className="flex flex-1">
        <img
          src={heroImg}
          alt="hero-img"
          className="w-full xl:h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PageHOC;
