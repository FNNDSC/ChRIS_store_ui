import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { validate } from 'email-validator';
import { Form, Spinner } from '@patternfly/react-core';

import './DeveloperSignup.css';
import StoreClient from '@fnndsc/chrisstoreapi';
import Button from '../../../Button';
import ChrisStore from '../../../../store/ChrisStore';
import FormInput from '../../../FormInput';
import isTouchDevice from './isTouchDevice';

const DeveloperSignup = (props) => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailVal = queryParams.get('email');

    const [state, setState] = useState({
      loading: false,
      error: {
        message: String(),
        controls: [],
      },
      username: String(),
      email: emailVal,
      password: String(),
      passwordConfirm: String(),
    });
  
    const { username, email, password, passwordConfirm, error, loading, toDashboard,  } = state;
    const { store } = props;

const handleChange = (value, name) => {
   setState({ [name]: value });
  }

  const handleStoreLogin = async () => {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const usersURL = `${storeURL}users/`;
    const authURL = `${storeURL}auth-token/`;
    let authToken;

    try {
      await StoreClient.createUser(usersURL, username, password, email);
    } catch (e) {
      if (_.has(e, 'response')) {
        if (_.has(e, 'response.data.username')) {
            setState({
            loading: false,
            error: {
              message: 'This username is already registered.',
              controls: ['username'],
            },
          });
        } else {
          setState({
            loading: false,
            error: {
              message: 'This email is already registered.',
              controls: ['email'],
            },
          });
        }
      } else {
        setState({
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

    return setState(
      {
        toDashboard: true,
      },
      () => {
        store.set('authToken')(authToken);
        return authToken;
      }
    );
  }

const handleSubmit = (event) => {
    event.persist();

    if (!username) {
      return setState({
        error: {
          message: 'Username is required',
          controls: ['username'],
        },
      });
    }

    if (!email || !validate(email)) {
      return setState({
        error: {
          message: 'A valid Email is required',
          controls: ['email'],
        },
      });
    }

    if (!password) {
      return setState({
        error: {
          message: 'Password is required',
          controls: ['password'],
        },
      });
    }

    if (!passwordConfirm) {
      return setState({
        error: {
          message: 'Confirmation is required',
          controls: ['confirmation'],
        },
      });
    }

    if (password !== passwordConfirm) {
      return setState({
        error: {
          message: 'Password and confirmation do not match',
          controls: ['password', 'confirmation'],
        },
      });
    }

     setState(
      {
        loading: true,
        error: {
          message: '',
          controls: '',
        },
      },
      () => store.set('userName')(username)
    );

    return handleStoreLogin();
  }

    if (toDashboard) return <Redirect to="/dashboard" />;

    const disableControls = loading;
    return (
      <Form noValidate id="developer-signup-form" onSubmit={handleSubmit}>
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
          onChange={(val) => handleChange(val, 'username')}
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
          onChange={(val) => handleChange(val, 'email')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Password"
          fieldId="password"
          validationState={error.controls.includes('password') ? 'error' : 'default'}
          placeholder="Enter a password"
          inputType="password"
          id="password"
          fieldName="password"
          value={password}
          onChange={(val) => handleChange(val, 'password')}
          disableControls={disableControls}
          error={error}
        />
        <FormInput
          formLabel="Password Confirmation"
          fieldId="password-confirm"
          validationState={error.controls.includes('confirmation') ? 'error' : 'default'}
          placeholder="Re-type your password"
          inputType="password"
          id="password-confirm"
          fieldName="passwordConfirm"
          value={passwordConfirm}
          onChange={(val) => handleChange(val, 'passwordConfirm')}
          disableControls={disableControls}
          error={error}
        />
        <div style={{ padding: '1em 0' }}>
          {loading ? (
            <Spinner size="md" />
          ) : (
            <Button variant="primary" type="submit" loading={disableControls}>
              Create Account
            </Button>
          )}
          {loading && <span id="developer-signup-creating">Creating Account</span>}
        </div>
      </Form>
    );
  }


export default ChrisStore.withStore(DeveloperSignup);

DeveloperSignup.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
