import React from 'react';
import PropTypes from 'prop-types';
import './LoadingContainer.css';

const LoadingContainer = props => (
  <div className={`loading-container ${props.className}`}>
    {props.children}
  </div>
);

LoadingContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

LoadingContainer.defaultProps = {
  className: '',
  children: null,
};

export default LoadingContainer;
