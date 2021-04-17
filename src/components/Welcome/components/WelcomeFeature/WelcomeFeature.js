import React from 'react';
import PropTypes from 'prop-types';
import './WelcomeFeature.css';

const WelcomeFeature = ({img, name}) => (
  <div className="welcome-feature">
    <img src={img} alt={name} className="welcome-feature-img" />
    <div className="welcome-feature-text">
      {name}
    </div>
  </div>
);

WelcomeFeature.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default WelcomeFeature;
