import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
  Spinner,
} from 'patternfly-react';
import _ from 'lodash';
import StoreClient from '@fnndsc/chrisstoreapi';
import { validate } from 'email-validator';
import './DeveloperSignup.css';
import './DeveloperSignup';
import ChrisStore from '../../../../store/ChrisStore';


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

export default isTouchDevice;