import React from 'react';
import ReactDOM from 'react-dom';

/* polyfills */
import 'core-js/fn/array/includes';

import './index.css';

 /* REQUIRED Patternfly stylesheet */
import '@patternfly/patternfly/patternfly.css';

import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
