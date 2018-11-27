import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
  Alert,
  Spinner,
} from 'patternfly-react';
import StoreClient from '@fnndsc/chrisstoreapi';
import { validate } from 'email-validator';
import './DeveloperSignup.css';

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

class DeveloperSignup extends Component {
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
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    const {
      username, email, password, passwordConfirm,
    } = this.state;
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
    });

    return this.handleStoreLogin().then(() => this.setState({ loading: false }));
  }

  handleStoreLogin() {
    const { username, email, password } = this.state;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const usersURL = `${storeURL}users/`;
    const authURL = `${storeURL}auth-token/`;
    let authToken;
    let userData;

    return new Promise(async (resolve, reject) => {
      try {
        userData = await StoreClient.createUser(usersURL, username, password, email);
      } catch (e) {
        /* TODO: JCC Enhance error handling */
        this.setState({
          error: {
            message: 'This field must be unique',
            controls: ['username'],
          },
        });
        return resolve(e);
      }
      try {
        authToken = await StoreClient.getAuthToken(authURL, username, password);
      } catch (e) {
        return reject(e);
      }
      this.setState({
        userData,
        authToken,
      });
      return resolve(authToken);
    });
  }

  render() {
    const {
      error, loading, userData, authToken,
    } = this.state;
    const disableControls = loading || userData;
    return (
      <Form onSubmit={this.handleSubmit} noValidate>
        <p>{loading ? 'Creating' : 'Create'} a ChRIS Developer account:</p>
        <FormGroup
          controlId="username"
          validationState={error.controls.includes('username') ? 'error' : null}
        >
          <ControlLabel>
            Username
          </ControlLabel>
          <FormControl
            type="text"
            autoComplete="off"
            autoFocus={!isTouchDevice()}
            onChange={this.handleChange}
            name="username"
            disabled={disableControls}
          />
          <HelpBlock>
            { error.controls.includes('username') ? error.message : 'Enter your username' }
          </HelpBlock>
        </FormGroup>
        <FormGroup
          controlId="email"
          validationState={error.controls.includes('email') ? 'error' : null}
        >
          <ControlLabel>
            Email
          </ControlLabel>
          <FormControl
            type="email"
            autoComplete="off"
            onChange={this.handleChange}
            name="email"
            disabled={disableControls}
          />
          <HelpBlock>
            { error.controls.includes('email') ? error.message : 'Enter your email' }
          </HelpBlock>
        </FormGroup>
        <FormGroup
          controlId="password"
          validationState={error.controls.includes('password') ? 'error' : null}
        >
          <ControlLabel>
            Password
          </ControlLabel>
          <FormControl
            type="password"
            autoComplete="new-password"
            onChange={this.handleChange}
            name="password"
            disabled={disableControls}
          />
          <HelpBlock>
            { error.controls.includes('password') ? error.message : 'Enter your password' }
          </HelpBlock>
        </FormGroup>
        <FormGroup
          controlId="password-confirm"
          validationState={error.controls.includes('confirmation') ? 'error' : null}
        >
          <ControlLabel>
            Password Confirmation
          </ControlLabel>
          <FormControl
            type="password"
            autoComplete="new-password"
            onChange={this.handleChange}
            name="passwordConfirm"
            disabled={disableControls}
          />
          <HelpBlock>
            { error.controls.includes('confirmation') ? error.message : 'Confirm your password' }
          </HelpBlock>
        </FormGroup>
        <Spinner loading={loading} size="md" inline>
          { userData && authToken ? <Alert type="success"><span>Account created successfully. <a href="/signin">Sign in here</a></span></Alert> :
          <Button bsStyle="primary" bsSize="large" type="submit" disabled={disableControls}>
            Create Account
          </Button> }
        </Spinner>{loading && <span className="developer-signup-creating">  Creating Account</span>}
      </Form>);
  }
}

export default DeveloperSignup;
