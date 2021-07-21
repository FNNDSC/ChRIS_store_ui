import React from 'react';
import PropTypes from 'prop-types';
import './LoadingContainer.css';

const LoadingContainer = ({ className, children }) => (
  <div className={`loading-container ${className}`}>
    {children}
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
