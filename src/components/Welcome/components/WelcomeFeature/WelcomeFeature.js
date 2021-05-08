import React from "react";
import PropTypes from "prop-types";
import styles from "./WelcomeFeature.module.css";

const WelcomeFeature = ({ img, name, url, ...props }) => (
  <div {...props}>
    <div className={styles['welcome-feature']}>
      <a href={url}>
        <img src={img} alt={name} className={styles['welcome-feature-img']} />
      </a>
      <div className={styles['welcome-feature-text']}>{name}</div>
    </div>
  </div>
);

WelcomeFeature.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default WelcomeFeature;
