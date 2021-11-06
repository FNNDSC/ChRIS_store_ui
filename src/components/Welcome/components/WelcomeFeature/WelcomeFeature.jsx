import React from 'react';
import PropTypes from 'prop-types';
import styles from './WelcomeFeature.module.css';

const WelcomeFeature = ({
  img, name, url,
}) => (
  <div>
    <div className={styles.welcomeFeature}>
      <a href={url}>
        <img src={img} alt={name} className={styles.welcomeFeatureImg} />
      </a>
      <div className={styles.welcomeFeatureText}>{name}</div>
    </div>
  </div>
);

WelcomeFeature.defaultProps = {
  url: PropTypes.string,
};

WelcomeFeature.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
};

export default WelcomeFeature;
