import React from "react";
import { useNavigate } from "react-router-dom";

import { logo, heroImg } from "../assets";
import styles from "../styles";

// Implementing code reusability using Higher Order Component (HOC). It is essentially a wrapper component that takes another child component as an argument. It is a function that returns another function

const PageHOC = (Component, title, description) => () => {
  const navigate = useNavigate();
  return (
    <div className={styles.hocContainer}>
      <div className={styles.hocContentBox}>
        <img
          src={logo}
          alt="logo"
          className={styles.hocLogo}
          onClick={() => {
            navigate("/");
          }}
        />

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
