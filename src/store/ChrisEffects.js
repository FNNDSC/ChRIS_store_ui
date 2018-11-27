import * as _ from 'lodash-es';

const effects = (store) => {
  store
    .on('userName')
    .subscribe((userName) => {
      window.sessionStorage.setItem('USERNAME', userName);
    });
  store
    .on('authToken')
    .subscribe((authToken) => {
      window.sessionStorage.setItem('AUTH_TOKEN', authToken);
      store.set('isLoggedIn')(!_.isEmpty(authToken));
    });
  return store;
};

export default effects;
