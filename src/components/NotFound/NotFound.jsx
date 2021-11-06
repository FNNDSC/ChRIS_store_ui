import React from 'react';
import broken from '../../assets/img/not-found.svg';
import { notFound } from './NotFound.module.css';

const NotFound = () => (
  <div className={notFound}>
    <img alt="404 - Page not found" src={broken} />
  </div>
);

export default NotFound;
