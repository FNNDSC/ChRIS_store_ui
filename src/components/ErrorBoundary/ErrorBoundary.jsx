import React from 'react';
import ErrorNotification from '../Notification';
import Button from '../Button';
import Illustration from '../../assets/img/error_boundary_ui.svg';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //notifySlack(error, errorInfo)
    this.setState({ error, errorInfo });
  }

  showNotifications = (error) => {
    this.setState((prev) => ({
      errors: [...prev.errors, error],
    }));
  };

  reload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorNotification
            key={`notif-boundary`}
            title="Error"
            message={this.state.error?.message || 'Something happened!'}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => {}}
          />
          <div className="container">
            <div className="error-message-container">
              <h1>400</h1>
              <h2>{this.state.error?.message}</h2>
              <p>We are having an issue, please click on the button bellow to reload the page !</p>

              <Button id="reload-error-btn" variant="primary" onClick={() => this.reload()}>
                <span>Retry</span>
              </Button>
            </div>
            <div className="illustration-container">
              <img src={Illustration} alt="Error illustration" className="illustration" />
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
