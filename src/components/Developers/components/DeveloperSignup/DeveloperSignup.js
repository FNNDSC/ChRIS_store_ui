import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Form,
  Spinner,
} from '@patternfly/react-core';
import Button from '../../../Button';
import _ from 'lodash';
import StoreClient from '@fnndsc/chrisstoreapi';
import { validate } from 'email-validator';
import './DeveloperSignup.css';
import ChrisStore from '../../../../store/ChrisStore';
import FormInput from '../../../FormInput';

/* inspired by http://bit.ly/2KycT4G */
const isTouchDevice = () => {
  if (('ontouchstart') in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    return true;
  }

  if (window.matchMedia) {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return window.matchMedia(query).matches;
  }

  return false;
};

export class DeveloperSignup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      loading: false,
      error: {
        message: '',
        controls: '',
      },
      username: '',
      email:'',
      password: '',
      passwordConfirm: '',
    };
  }

  handleChange(value, name) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const {
      username, email, password, passwordConfirm,
    } = this.state;
    const { store } = this.props;
    event.preventDefault();

    if (!username) {
      return this.setState({
        error: {
          message: 'Username is required',
          controls: ['username'],
        },
      });
    }

    if (!email || !validate(email)) {
      return this.setState({
        error: {
          message: 'A valid Email is required',
          controls: ['email'],
        },
      });
    }

    if (!password) {
      return this.setState({
        error: {
          message: 'Password is required',
          controls: ['password'],
        },
      });
    }

    if (!passwordConfirm) {
      return this.setState({
        error: {
          message: 'Confirmation is required',
          controls: ['confirmation'],
        },
      });
    }

    if (password !== passwordConfirm) {
      return this.setState({
        error: {
          message: 'Password and confirmation do not match',
          controls: ['password', 'confirmation'],
        },
      });
    }

    this.setState({
      loading: true,
      error: {
        message: '',
        controls: '',
      },
    }, () => store.set('userName')(username));

    return this.handleStoreLogin();
  }

  handleStoreLogin() {
    const { username, email, password } = this.state;
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const usersURL = `${storeURL}users/`;
    const authURL = `${storeURL}auth-token/`;
    let authToken;

    return new Promise(async (resolve, reject) => {
      try {
        await StoreClient.createUser(usersURL, username, password, email);
      } catch (e) {
        if (_.has(e, 'response')) {
          if (_.has(e, 'response.data.username')) {
            this.setState({
              loading: false,
              error: {
                message: 'This username is already registered.',
                controls: ['username'],
              },
            });
          } else {
            this.setState({
              loading: false,
              error: {
                message: 'This email is already registered.',
                controls: ['email'],
              },
            });
          }
        } else {
          this.setState({
            loading: false,
          });
        }
        return resolve(e);
      }
      try {
        authToken = await StoreClient.getAuthToken(authURL, username, password);
      } catch (e) {
        return reject(e);
      }
      return this.setState({
        toDashboard: true,
      }, () => {
        store.set('authToken')(authToken);
        return resolve(authToken);
      });
    });
  }

  render() {
    const {
      error,
      loading,
      toDashboard,
    } = this.state;

    if (toDashboard) {
      return <Redirect to="/dashboard" />;
    }
    const disableControls = loading;
    return (
      <Form onSubmit={this.handleSubmit} noValidate>
        <p>{loading ? 'Creating' : 'Create'} a ChRIS Developer account:</p>
        <FormInput
          formLabel="Username"
          fieldId="username"
          validationState={error.controls.includes('username') ? 'error' : 'default'}
          helperText="Enter your username"
          inputType="text"
          id="username"
          fieldName="username"
          value={this.state.username}
          autofocus={!isTouchDevice}
          onChange={(val) => this.handleChange(val, 'username')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Email"
          fieldId="email"
          validationState={error.controls.includes('email') ? 'error' : 'default'}
          helperText="Enter you email"
          inputType="email"
          id="email"
          fieldName="email"
          value={this.state.email}
          onChange={(val) => this.handleChange(val, 'email')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Password"
          fieldId="password"
          validationState={error.controls.includes('password') ? 'error' : 'default'}
          helperText="Enter your password"
          inputType="password"
          id="password"
          fieldName="password"
          value={this.state.password}
          onChange={(val) => this.handleChange(val, 'password')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Password Conformation"
          fieldId="password-confirm"
          validationState={error.controls.includes('confirmation') ? 'error' : 'default'}
          helperText="Confirm your password"
          inputType="password"
          id="password"
          fieldName="passwordConfirm"
          value={this.state.passwordConfirm}
          onChange={(val) => this.handleChange(val, 'passwordConfirm')}
          disableControls={disableControls}
          error={error}
        />
        {loading ? <Spinner size="md"/> : (
          <Button 
            variant="primary"
            type="submit" 
            loading={disableControls}
          >
            Create Account
          </Button>
        )}
        {loading && <span className="developer-signup-creating">Creating Account</span>}
      </Form>);
  }
}

export default ChrisStore.withStore(DeveloperSignup);

DeveloperSignup.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
