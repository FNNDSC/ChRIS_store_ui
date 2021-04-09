import React from 'react';
import ReactDOM from 'react-dom';

/* polyfills */
import 'core-js/fn/array/includes';

import './index.css';
import App from './components/App/App';
import { hydrate, render } from "react-dom";
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
registerServiceWorker();
