import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import {
  Card, CardBody, Button, Alert,
  Form, FormGroup, FormControl,
} from 'patternfly-react';
import StoreClient from '@fnndsc/chrisstoreapi';
import './SignIn.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';

export class SignIn extends Component {
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

    this.handleChange = this.handleChange.bind(this);
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    const authURL = process.env.REACT_APP_STORE_AUTH_URL;
    const { username, password } = this.state;
    const { store } = this.props;

    this.setState({ loading: true });
    const promise = StoreClient.getAuthToken(authURL, username, password)
      .then((token) => {
        store.set('userName')(username);
        store.set('authToken')(token);
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

  hideError() {
    this.setState({ error: null });
  }

  render() {
    const {
      toDashboard, error, username, password, loading,
    } = this.state;

    if (toDashboard) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="signin login-pf-page">
        <div className="signin-container">
          {
            error && (
              <div className="signin-error-container">
                <Alert
                  className="signin-error"
                  type="error"
                  onDismiss={this.hideError}
                >
                  {error}
                </Alert>
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
            <header className="login-pf-page-header">
              <h1>Login to your account</h1>
            </header>
            <CardBody>
              <Form className="signin-form" onSubmit={this.handleSubmit}>
                <FormGroup className="signin-username-form-group" bsSize="large">
                  <FormControl
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={this.handleChange}
                    autoComplete="username"
                  />
                </FormGroup>
                <FormGroup className="signin-password-form-group" bsSize="large">
                  <FormControl
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleChange}
                    autoComplete="current-password"
                  />
                </FormGroup>
                <Button
                  className="signin-login-btn"
                  bsStyle="primary"
                  bsSize="large"
                  type="submit"
                  disabled={loading}
                >
                  Log In
                </Button>
                <p className="login-pf-signup">
                  Need an account?
                  <Link to="/quickstart" href="/quickstart">
                    Signup
                  </Link>
                </p>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default ChrisStore.withStore(SignIn);

SignIn.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
