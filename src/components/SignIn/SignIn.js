import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../Button';
import StoreClient from '@fnndsc/chrisstoreapi';
import styles from './SignIn.module.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';
import FormInput from '../FormInput';
import { Form, Alert, AlertActionCloseButton, CardTitle, Card, CardBody } from '@patternfly/react-core';

export class SignIn extends Component {
  constructor(props) {
    super(props);

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

  componentDidMount() {
    // if the user attempts to see the login page when they are
    // already logged in, we will log them out.
    // TODO SECURITY idk if safe from CSRF
    // TODO SECURITY send goodbye to backend to invalidate authToken
    const { store } = this.props;
    if (store.get('isLoggedIn')) {
      store.set('authToken')('');
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange(value, name) {
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    const authURL = process.env.REACT_APP_STORE_AUTH_URL;
    const { username, password } = this.state;
    const { store, location, history } = this.props;
    this.setState({ loading: true });
    try{
      const token = await StoreClient.getAuthToken(authURL, username, password);
      store.set('userName')(username);
        store.set('authToken')(token);
        if (this.mounted) {
          this.setState({ loading: false });
          if (location.state && location.state.from) {
            history.replace(location.state.from);
          }
          else {
            history.push('/dashboard');
          }
        }
    } catch(error){
      this.showError('Invalid username or password');
        if (this.mounted) {
          this.setState({ loading: false });
        }
    }
    event.preventDefault();
  }

  showError(message) {
    this.setState({ error: message });
  }

  hideError() {
    this.setState({ error: null });
  }

  render() {
    const {
      error, username, password, loading,
    } = this.state;

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
                  variant="primary"
                  loading={loading}
                  onClick={this.handleSubmit}
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

SignIn.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(SignIn);
