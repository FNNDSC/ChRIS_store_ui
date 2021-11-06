import React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import styles from './Notifications.module.css';

export const Notification = ({ position, variant, message, onClose, closeable, title, timeout }) => (
  <div className={`${styles.notification} ${styles}.${position}`}>
    <Alert
      variant={variant}
      title={title || null}
      actionClose={closeable && <AlertActionCloseButton onClose={onClose} />}
      timeout
      ={timeout || 4000}
      onTimeout={onClose}
    >
      {message}
    </Alert>
  </div>
);

Notification.propTypes = {
  position: PropTypes.string.isRequired,
  message: PropTypes.string,
  variant: PropTypes.string,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  timeout: PropTypes.bool,
};

export default Notification;
