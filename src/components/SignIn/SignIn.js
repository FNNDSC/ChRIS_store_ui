import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Alert,
} from 'patternfly-react';
import StoreClient from '@fnndsc/chrisstoreapi';
import './SignIn.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';
import FormInput from '../FormInput';
import { Form } from '@patternfly/react-core';

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
      hidden: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.hideError = this.hideError.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
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

  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
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
              <Form className="signin-form" >
                <FormInput
                  placeholder="Username"
                  fieldName="username"
                  id="username"
                  inputType="text"
                  value={username}
                  onChange={(val) => this.handleChange(val, 'username')}
                  autoComplete="username"
                  className="signin-username-form-group"
                />
                <FormInput
                  placeholder="Password"
                  fieldName="password"
                  value={password}
                  inputType="password"
                  id="password"
                  onChange={(val) => this.handleChange(val, 'password')}
                  autoComplete="current-password"
                  className="signin-password-form-group"
                />
                <Button
                  className="signin-login-btn"
                  variant="primary"
                  loading={loading}
                  onClick={this.handleSubmit}>
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

SignIn.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(SignIn);
