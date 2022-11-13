import React, {useState} from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import './Notifications.css';

export const Notification = ({ position, variant, message, onClose, closeable, title, timeout }) => {
  const [alertVisible, setAlertVisible] = useState(true)

  const toggleAlert = () => setAlertVisible(false)

  return (
  <div className={`notification ${position}`}>
    {alertVisible && (
    <Alert
      variant={variant}
      title={title || null}
      actionClose={closeable && <AlertActionCloseButton onClose={() => toggleAlert()} />}
      timeout={timeout}
      onTimeout={onClose}
    >
      {message}
    </Alert>
    )}
  </div>
)};

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
