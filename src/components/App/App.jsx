import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ConnectedSignIn from '../SignIn/SignIn';
import Router from '../Router/Router';
import ChrisStore from '../../store/ChrisStore';
import './App.css';

// import the patternfly CSS globally
import '../../../node_modules/@patternfly/patternfly/patternfly.min.css';
import '../../../node_modules/@patternfly/patternfly/patternfly-base.css';
import '../../../node_modules/@patternfly/patternfly/patternfly-addons.css';
import '../../../node_modules/@patternfly/patternfly/patternfly-no-reset.css';

/*
 * The router here serves pages which replace the entire document,
 * whereas '../Router/Router' has a navbar and footer.
 */

const App = () => (
  <ChrisStore.Container>
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/signin" component={ConnectedSignIn} />
          <Route path="/" component={Router} />
        </Switch>
      </BrowserRouter>
    </div>
  </ChrisStore.Container>
);

export default App;
