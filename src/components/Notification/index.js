import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Notifications.css';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.deleteTime = 4000;
  }

  render() {
    const { position, variant, message, onClose, closeable, title } = this.props;
    return (
      <div className={`notification ${position}`}>
        <Alert 
          variant={variant}
          title={title ? title : null}
          actionClose={closeable && <AlertActionCloseButton onClose={onClose}/>}
          {...this.props}
        >
          {message}
        </Alert>
      </div>
    );
  }
};

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
