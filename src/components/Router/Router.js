import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// pages
import Welcome from '../Welcome/Welcome';
import Plugins from '../Plugins/Plugins';
import Plugin from '../Plugin/Plugin';
import Developers from '../Developers/Developers';

const Router = () => (
  <BrowserRouter>
    <div>
      <Route path="/" component={Navbar} />
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/plugins" component={Plugins} />
        <Route path="/developers" component={Developers} />
        <Route path="/plugin/:plugin" component={Plugin} />
      </Switch>
      <Footer />
    </div>
  </BrowserRouter>
);

export default Router;
