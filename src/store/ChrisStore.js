import { createConnectedStore } from 'undux';
import isEmpty from 'lodash/isEmpty';
import effects from './ChrisEffects';

// Declare your store's initial state.
const initialState = {
  userName: window.sessionStorage.getItem('USERNAME'),
  authToken: window.sessionStorage.getItem('AUTH_TOKEN'),
  isLoggedIn: !isEmpty(window.sessionStorage.getItem('AUTH_TOKEN')),
};

// Create & export a store with an initial value.
export default createConnectedStore(initialState, effects);
