import { Alert } from '@patternfly/react-core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Notification extends Component {
  constructor(props) {
    super(props);
    this.deleteTime = 4000;
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.closeNotification();
    }, this.deleteTime);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { position, variant, message, onClose, closeable, title } = this.props;
    return (
      <div className={`notification ${position}`}>
        <Alert 
          variant={variant}
          title={title ? title : null}
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
  message: PropTypes.string.isRequired,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
}
export default Notification;
