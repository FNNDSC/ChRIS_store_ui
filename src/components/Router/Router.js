import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// pages
import Welcome from '../Welcome/Welcome';
import Plugins from '../Plugins/Plugins';
import Plugin from '../Plugin/Plugin';
import Developers from '../Developers/Developers';
import CreatePlugin from '../CreatePlugin/CreatePlugin';

const Router = () => (
  <div>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/plugins" component={Plugins} />
      <Route path="/plugin/:plugin" component={Plugin} />
      <Route path="/developers" component={Developers} />
      <Route path="/create" component={CreatePlugin} />
    </Switch>
    <Footer />
  </div>
);

export default Router;
