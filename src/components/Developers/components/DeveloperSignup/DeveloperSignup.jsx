import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { validate } from 'email-validator';
import { Form, InputGroup, Spinner, TextInput } from '@patternfly/react-core';
import EyeSlashIcon from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon';
import EyeIcon from '@patternfly/react-icons/dist/esm/icons/eye-icon';

import './DeveloperSignup.css';
import StoreClient from '@fnndsc/chrisstoreapi';
import Button from '../../../Button';
import ChrisStore from '../../../../store/ChrisStore';
import FormInput from '../../../FormInput';
import isTouchDevice from './isTouchDevice';

export class DeveloperSignup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.togglePassword = this.togglePassword.bind(this)

    const queryParams = new URLSearchParams(window.location.search);
    const emailVal = queryParams.get('email');
    this.state = {
      loading: false,
      error: {
        message: String(),
        controls: [],
      },
      username: String(),
      email: emailVal,
      password: String(),
      passwordConfirm: String(),
      hidePassword: true,
      disableSubmit: true
    };
  }

  handleChange(value, name) {
    const {password, passwordConfirm, email, username} = this.state
    this.setState({ [name]: value });

    if (password.length >= 8 && passwordConfirm && email && username) {
      this.setState({disableSubmit: false})
    }

    if ((password.length < 8) || (passwordConfirm.length <= 8) || (email.length <= 1) || (username.length <= 1)) {
      this.setState({disableSubmit: true})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    event.persist();
    const { username, email, password, passwordConfirm } = this.state;
    const { store } = this.props;

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
          controls: ['passwordConfirm'],
        },
      });
    }

    if (password.length < 8) {
      return this.setState({
        error: {
          message: 'Password requires at least 8 characters',
          controls: ['password'],
        },
      });
    }

    if (password !== passwordConfirm) {
      return this.setState({
        error: {
          message: 'Password and confirmation do not match',
          controls: ['passwordConfirm'],
        },
      });
    }

    this.setState(
      {
        loading: true,
        error: {
          message: '',
          controls: '',
        },
      },
      () => store.set('userName')(username)
    );

    return this.handleStoreLogin();
  }

  async handleStoreLogin() {
    const { username, email, password } = this.state;
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const usersURL = `${storeURL}users/`;
    const authURL = `${storeURL}auth-token/`;
    let authToken;

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
        } else if (_.has(e, 'response.data.email')){
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
      return e;
    }

    try {
      authToken = await StoreClient.getAuthToken(authURL, username, password);
    } catch (e) {
      return Promise.reject(e);
    }

    return this.setState(
      {
        toDashboard: true,
      },
      () => {
        store.set('authToken')(authToken);
        return authToken;
      }
    );
  }

  togglePassword() {
    this.setState(prevState => ({ hidePassword: !prevState.hidePassword }))
  }


  render() {
    const {
      error,
      loading,
      toDashboard,

      username,
      email,
      password,
      passwordConfirm,
      hidePassword,
      disableSubmit
    } = this.state;

    if (toDashboard) return <Redirect to="/dashboard" />;

    const disableControls = loading;
    return (
      <Form noValidate id="developer-signup-form" onSubmit={this.handleSubmit}>
        <FormInput
          formLabel="Username"
          fieldId="username"
          validationState={error.controls.includes('username') ? 'error' : 'default'}
          placeholder="Enter your username"
          inputType="text"
          id="username"
          fieldName="username"
          value={username}
          autofocus={!isTouchDevice}
          onChange={(val) => this.handleChange(val, 'username')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Email"
          fieldId="email"
          validationState={error.controls.includes('email') ? 'error' : 'default'}
          placeholder="Enter your email"
          inputType="email"
          id="email"
          fieldName="email"
          value={email}
          onChange={(val) => this.handleChange(val, 'email')}
          disableControls={disableControls}
          error={error}
        />
       <FormInput
            formLabel="Password"
            fieldId="password"
            fieldName="password"
            validationState={error.controls.includes('password') ? 'error' : 'default'}
            disableControls={disableControls}
            error={error}
            >
          <InputGroup>
            <TextInput
              placeholder="Enter an 8 character password"
              type={hidePassword ? "password" : "text"}
              id="password"
              inputType="password"
              value={password}
              onChange={(val) => this.handleChange(val, 'password')}
              validated={error.controls.includes('password') ? 'error' : 'default'}
            />
            <Button 
              variant="control"
              onClick={this.togglePassword}>
              {hidePassword ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroup>
        </FormInput>

        <FormInput
          formLabel="Confirm Password"
          fieldId="passwordConfirm"
          fieldName="passwordConfirm"
          validationState={error.controls.includes('passwordConfirm') ? 'error' : 'default'}
          disableControls={disableControls}
          error={error}
          >
          <InputGroup>
            <TextInput
              placeholder="Re-type your password"
              type={hidePassword ? "password" : "text"}
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(val) => this.handleChange(val, 'passwordConfirm')}
              validated={error.controls.includes('passwordConfirm') ? 'error' : 'default'}
              />
            <Button 
              variant="control"
              onClick={this.togglePassword}>
              {hidePassword ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroup>
        </FormInput>

        <div style={{ padding: '1em 0' }}>
          {loading ? (
            <Spinner size="md" />
          ) : (
            <Button variant="primary" type="submit" loading={disableControls} isDisabled={disableSubmit}
            >
              Create Account
            </Button>
          )}
          {loading && <span id="developer-signup-creating">Creating Account</span>}
        </div>
      </Form>
    );
  }
}

export default ChrisStore.withStore(DeveloperSignup);

DeveloperSignup.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
