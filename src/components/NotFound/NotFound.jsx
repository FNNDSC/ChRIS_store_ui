import React from 'react';
import broken from '../../assets/img/not-found.svg';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found">
    <img alt="404 - Page not found" src={broken} />
  </div>
);

export default NotFound;
