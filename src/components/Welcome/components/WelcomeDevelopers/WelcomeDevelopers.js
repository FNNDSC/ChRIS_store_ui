import React from "react";
import styles from "./WelcomeDevelopers.module.css";
import { Link } from "react-router-dom";

const WelcomeDevelopers = () => (
  <React.Fragment>
    <div className={`${styles['welcome-developers']} row`}>
      <div className={styles['welcome-developers-header']}>
        Expand the reach of your image processing software
      </div>
      <div className={`text-light`}>
        <p>
          <i>ChRIS</i> is an <strong>open source platform</strong> for medical
          analytics in the cloud, democratizing the development and usage of
          image processing software within an ecosystem following
          <strong> common standards.</strong>.
        </p>
        <p>
          A <i>ChRIS</i> developer account enables you to share your analysis
          workflows as containerized software with the <i>ChRIS</i> community of
          researchers and clinicians. <strong>Join us!</strong>
        </p>
      </div>
      <Link to="/quickstart" className={`btn ${styles['callToAction-btn']} btn-primary`}>
        Sign Up
      </Link>
    </div>
  </React.Fragment>
);

export default WelcomeDevelopers;





