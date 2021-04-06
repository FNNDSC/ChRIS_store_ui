import React from 'react';
import ReactDOM from 'react-dom';

/* polyfills */
import 'core-js/fn/array/includes';

import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
registerServiceWorker();
