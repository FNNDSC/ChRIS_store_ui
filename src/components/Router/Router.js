import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConnectedNavbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

// pages
import Welcome from '../Welcome/Welcome';
import Plugins from '../Plugins/Plugins';
import Plugin from '../Plugin/Plugin';
import Developers from '../Developers/Developers';
import CreatePlugin from '../CreatePlugin/CreatePlugin';
import NotFound from '../NotFound/NotFound';
import Dashboard from '../Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <div>
    <ConnectedNavbar />
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/plugins" component={Plugins} />
      <Route path="/plugin/:plugin" component={Plugin} />
      <Route path="/quickstart" component={Developers} />
      <ProtectedRoute path="/create" component={CreatePlugin} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
    <Footer />
  </div>
);

export default Router;
