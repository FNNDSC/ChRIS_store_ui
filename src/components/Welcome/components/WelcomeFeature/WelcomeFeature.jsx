import React from 'react';
import PropTypes from 'prop-types';
import './WelcomeFeature.css';

const WelcomeFeature = ({
  img, name, url,
}) => (
  <div>
    <div className="welcome-feature">
      <a href={url}>
        <img src={img} alt={name} className="welcome-feature-img" />
      </a>
      <div className="welcome-feature-text">{name}</div>
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
