import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import Router from '../Router/Router';
import './App.css';

// import the patternfly CSS globally
import '../../../node_modules/patternfly/dist/css/patternfly.min.css';
import '../../../node_modules/patternfly/dist/css/patternfly-additions.min.css';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/" component={Router} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
