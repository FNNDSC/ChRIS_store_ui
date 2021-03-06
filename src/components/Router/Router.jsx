import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppLayout from '../AppLayout/AppLayout';

// pages
import Welcome from '../Welcome/Welcome';
import PluginDetail from '../Plugin/Plugin';
import PluginsList from '../Plugins/Plugins';
import Developers from '../Developers/Developers';
import CreatePlugin from '../CreatePlugin/CreatePlugin';
import NotFound from '../NotFound/NotFound';
import Dashboard from '../Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <AppLayout>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/p/:pluginId" component={PluginDetail} />
      <Route path="/plugins" component={PluginsList} />
      <Route path="/plugin" component={PluginsList} />
      <Route path="/quickstart" component={Developers} />
      <ProtectedRoute path="/create" component={CreatePlugin} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  </AppLayout>
);

export default Router;
