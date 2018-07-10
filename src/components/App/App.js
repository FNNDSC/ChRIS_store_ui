import React from 'react';
import Router from '../Router/Router';
import './App.css';
// import the patternfly CSS globally
import '../../../node_modules/patternfly/dist/css/patternfly.min.css';
import '../../../node_modules/patternfly/dist/css/patternfly-additions.min.css';

const App = () => (
  <div className="App">
    <Router />
  </div>
);

export default App;
