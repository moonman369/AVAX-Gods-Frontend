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
      </div>
    </div>
  );
};

export default PageHOC;
