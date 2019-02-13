import isEmpty from 'lodash/isEmpty';

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
      store.set('isLoggedIn')(!isEmpty(authToken));
      if (isEmpty(authToken)) {
        store.set('userName')('');
      }
    });
  return store;
};

export default effects;
