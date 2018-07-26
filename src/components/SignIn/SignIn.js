import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
  Card, CardTitle, CardBody, Button, Icon,
  Form, FormGroup, FormControl, ControlLabel,
} from 'patternfly-react';
import { StoreClient } from '@fnndsc/chrisstoreapi';
import './SignIn.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';

class SignIn extends Component {
  constructor() {
    super();

    this.mounted = false;
    this.state = {
      username: '',
      password: '',
      loading: false,
      toDashboard: false,
      error: null,
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.hideError = this.hideError.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleUsername(event) {
    this.setState({ username: event.target.value });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    const authURL = process.env.REACT_APP_STORE_AUTH_URL;
    const { username, password } = this.state;

    this.setState({ loading: true });
    const promise = StoreClient.getAuthToken(authURL, username, password)
      .then((token) => {
        window.localStorage.setItem('AUTH_TOKEN', token);
        if (this.mounted) {
          this.setState({ toDashboard: true });
        }
      })
      .catch(() => {
        this.showError('Invalid username or password');
      })
      .then(() => {
        if (this.mounted) {
          this.setState({ loading: false });
        }
      });

    event.preventDefault();
    return promise; // for tests
  }

  showError(message) {
    this.setState({ error: message });
  }

  hideError(e) {
    if (!e.key || e.key === 'Enter') {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to="/developers" />;
    }

    return (
      <div className="signin">
        <div className="signin-container">
          {
            this.state.error && (
              <div className="signin-error-container">
                <div
                  className="signin-error"
                  role="button"
                  tabIndex={0}
                  onClick={this.hideError}
                  onKeyUp={this.hideError}
                >
                  <Icon name="times-circle-o" />
                  {` ${this.state.error}`}
                </div>
              </div>
            )
          }
          <div className="signin-logo-container">
            <Link
              className="signin-logo-link"
              href="/"
              to="/"
            >
              <img
                className="signin-logo"
                src={chrisLogo}
                alt=""
              />
            </Link>
          </div>
          <Card className="signin-card">
            <CardTitle className="signin-card-title">Sign In</CardTitle>
            <CardBody>
              <Form className="signin-form" onSubmit={this.handleSubmit}>
                <FormGroup className="signin-username-form-group">
                  <ControlLabel>
                    Username
                  </ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.username}
                    onChange={this.handleUsername}
                    autoComplete="username"
                  />
                </FormGroup>
                <FormGroup className="signin-password-form-group">
                  <ControlLabel>
                    Password
                  </ControlLabel>
                  <FormControl
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePassword}
                    autoComplete="current-password"
                  />
                </FormGroup>
                <Button
                  className="signin-login-btn"
                  bsStyle="primary"
                  bsSize="large"
                  type="submit"
                  disabled={this.state.loading}
                >
                  Login
                </Button>
                <Button className="signin-signup-btn" bsStyle="link" bsSize="large">
                  Create account
                </Button>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default SignIn;
