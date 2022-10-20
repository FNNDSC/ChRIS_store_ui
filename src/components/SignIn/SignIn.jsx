import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import StoreClient from '@fnndsc/chrisstoreapi';
import {
  Form,
  CardTitle,
  Card,
  CardBody,
} from '@patternfly/react-core';

import Button from '../Button';
import './SignIn.css';
import chrisLogo from '../../assets/img/chris_logo-white.png';
import ChrisStore from '../../store/ChrisStore';
import FormInput from '../FormInput';

const SignIn = (props) => {
        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [loading, setLoading] = useState(false)
        const [errorMessage, setErrorMessage] = useState(null)

        useEffect(() => {
          // if the user attempts to see the login page when they are
        // already logged in, we will log them out.
        // TODO SECURITY idk if safe from CSRF
        // TODO SECURITY send goodbye to backend to invalidate authToken
        const { store } = props;
        if (store.get('isLoggedIn')) {
            store.set('authToken')('');
        }
        });

    async function handleSubmit(event) {
      event.preventDefault()
        const authURL = process.env.REACT_APP_STORE_AUTH_URL;
        const { store, location, history } = props;
        setLoading(true);

        try {
        const token = await StoreClient.getAuthToken(authURL, username, password);
        store.set('userName')(username);
        store.set('authToken')(token);
        setLoading(false);
    
        if (location.state && location.state.from) 
            history.replace(location.state.from);
        else
            history.push('/dashboard');
        } catch (error) {
        setErrorMessage('Invalid username or password');
        setLoading(false);
        }
        event.persist();
    }
    
    return (
        <div className="signin login-pf-page">
            <div className="signin-container">
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
                <CardTitle className="login-pf-page-header">
                <h1>Login to your account</h1>
            </CardTitle>
            { errorMessage && <div className='signin-error-message'>
                  <p>{errorMessage}</p>
                  </div>
              }
            <CardBody>
                <Form className="signin-form">
                    <FormInput
                    placeholder="Username"
                    fieldName="username"
                    id="username"
                    inputType="text"
                    value={username}
                    onChange={(val) => setUsername(val)}
                    autoComplete="username"
                    className="signin-username-form-group"
                    />
                <FormInput
                    placeholder="Password"
                    fieldName="password"
                    value={password}
                    inputType="password"
                    id="password"
                    onChange={(val) => setPassword(val)}
                    autoComplete="current-password"
                    className="signin-password-form-group"
                    />
                <Button
                    className="signin-login-btn"
                    variant="primary"
                    loading={loading}
                    onClick={(e) => handleSubmit(e)}
                    >
                    Log In
                    </Button>
                    <p className="login-pf-signup">
                    Need an account? {' '}
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
        
    SignIn.propTypes = {
    store: PropTypes.objectOf(PropTypes.object).isRequired,
    };

export default ChrisStore.withStore(SignIn);
    
