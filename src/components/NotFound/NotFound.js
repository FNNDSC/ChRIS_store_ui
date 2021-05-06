import React from 'react';
import broken from '../../assets/img/not-found.svg';
import styles from './NotFound.module.css';


const NotFound = () => (
  <div className={styles['not-found']}>
    <img alt="404 - Page not found" src={broken} />
  </div>
);

export default NotFound;
