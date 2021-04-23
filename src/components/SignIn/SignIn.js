import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { Redirect, Link } from 'react-router-dom';
import {
  Card, CardBody
} from 'patternfly-react';
import StoreClient from '@fnndsc/chrisstoreapi';
import styles from './SignIn.module.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';
import FormInput from '../FormInput';
import { Form, Alert, AlertActionCloseButton, CardTitle, Card, CardBody } from '@patternfly/react-core';

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

  handleChange(value, name) {
    this.setState({ [name]: value });
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
      <div className={`${styles['signin']} login-pf-page`}>
        <div className={styles['signin-container']}>
          {
            error && (
              <div className={styles['signin-error-container']}>
                <Alert
                  className={styles['signin-error']}
                  variant="danger"
                  title={error}
                  actionClose={<AlertActionCloseButton onClose={this.hideError} />}
                />
              </div>
            )
          }
          <div className={styles['signin-logo-container']}>
            <Link
              className={styles['signin-logo-link']}
              href="/"
              to="/"
            >
              <img
                className={styles['signin-logo']}
                src={chrisLogo}
                alt=""
              />
            </Link>
          </div>
          <Card className={styles['signin-card']}>
            <CardTitle className={styles['login-pf-page-header']}>
              <h1>Login to your account</h1>
            </CardTitle>
            <CardBody>
              <Form className={styles['signin-form']} >
                <FormInput
                  placeholder="Username"
                  fieldName="username"
                  id="username"
                  inputType="text"
                  value={username}
                  onChange={(val) => this.handleChange(val, 'username')}
                  autoComplete="username"
                  className={styles['signin-username-form-group']}
                />
                <FormInput
                  placeholder="Password"
                  fieldName="password"
                  value={password}
                  inputType="password"
                  id="password"
                  onChange={(val) => this.handleChange(val, 'password')}
                  autoComplete="current-password"
                  className={styles['signin-password-form-group']}
                />
                <Button
                  className={styles['signin-login-btn']}
                  bsStyle="primary"
                  bsSize="large"
                  type="submit"
                  disabled={loading}
                >
                  Log In
                </Button>
                <p className={`login-pf-signup`}>
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
