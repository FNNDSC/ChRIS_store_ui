import React from 'react';
import PropTypes from 'prop-types';
import './WelcomeFeature.css';

const WelcomeFeature = props => (
  <div className="welcome-feature">
    <img src={props.img} alt="" className="welcome-feature-img" />
    <div className="welcome-feature-text">
      {props.name}
    </div>
  </div>
);

WelcomeFeature.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default WelcomeFeature;
