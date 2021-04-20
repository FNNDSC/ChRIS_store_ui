import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Alert,
  Form, FormGroup, FormControl,
} from 'patternfly-react';
import Button from '../Button';
import StoreClient from '@fnndsc/chrisstoreapi';
import './SignIn.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';

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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
