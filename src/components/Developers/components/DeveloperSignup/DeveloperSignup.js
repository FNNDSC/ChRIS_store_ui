import React from 'react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
} from 'patternfly-react';

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

const DeveloperSignup = () => (
  <Form>
    <p>Create a ChRIS Developer account:</p>
    <FormGroup controlId="username">
      <ControlLabel>
        Username
      </ControlLabel>
      <FormControl
        type="text"
        autoComplete="off"
        autoFocus={!isTouchDevice()}
      />
      <HelpBlock>
        Enter your username
      </HelpBlock>
    </FormGroup>
    <FormGroup controlId="password">
      <ControlLabel>
        Password
      </ControlLabel>
      <FormControl type="password" autoComplete="new-password" />
      <HelpBlock>
        Enter your password
      </HelpBlock>
    </FormGroup>
    <Button bsStyle="primary" bsSize="large">
      Create Account
    </Button>
  </Form>
);

export default DeveloperSignup;
