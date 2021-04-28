import React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './Notifications.css';

export const Notification = ({ position, variant, message, onClose, closeable, title, ...rest }) => {
  const deleteTime = 4000;

  return (
    <div className={`notification ${position}`}>
      <Alert 
        variant={variant}
        title={title ? title : null}
        actionClose={closeable && <AlertActionCloseButton onClose={onClose}/>}
        timeout={deleteTime}
        onTimeout={onClose}
        { ...rest }
      >
        {message}
      </Alert>
    </div>
  )
}

Notification.propTypes = {
  position: PropTypes.string.isRequired,
  variant: PropTypes.string,
  message: PropTypes.string,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  timeout: PropTypes.bool,
}

export default Notification;
