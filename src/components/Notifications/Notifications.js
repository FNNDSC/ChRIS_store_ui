import { Alert } from "patternfly-react";
import React, { Component } from "react";
import "./Notifications.css";
class Notifications extends Component {
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
    const { position, variant, message } = this.props;
    return (
      <div className={`notification ${position}`}>
        <Alert variant={variant}>{message}</Alert>
      </div>
    );
  }
}
export default Notifications;
