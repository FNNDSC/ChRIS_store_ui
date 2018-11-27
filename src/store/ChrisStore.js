import { createConnectedStore } from 'undux';
import * as _ from 'lodash-es';
import effects from './ChrisEffects';

// Declare your store's initial state.
const initialState = {
  userName: window.sessionStorage.getItem('USERNAME'),
  authToken: window.sessionStorage.getItem('AUTH_TOKEN'),
  isLoggedIn: !_.isEmpty(window.sessionStorage.getItem('AUTH_TOKEN')),
};

// Create & export a store with an initial value.
export default createConnectedStore(initialState, effects);
