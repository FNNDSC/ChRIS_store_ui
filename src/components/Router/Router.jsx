import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppLayout from '../AppLayout/AppLayout';

// pages
import Welcome from '../Welcome/Welcome';
import PluginDetail from '../Plugin/Plugin';
import PluginMetaDetail from '../Plugin/PluginMeta';
import PluginsList from '../Plugins/Plugins';
import Developers from '../Developers/Developers';
import CreatePlugin from '../CreatePlugin/CreatePlugin';
import NotFound from '../NotFound/NotFound';
import Dashboard from '../Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <AppLayout>
    <Switch>
      <Route path="/plugin/:pluginName" component={PluginMetaDetail} />
      <Route path="/p/:pluginId" component={PluginDetail} />
      <Route path="/plugins" component={PluginsList} />
      
      <ProtectedRoute path="/create" component={CreatePlugin} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />

      <Route path="/quickstart" component={Developers} />
      <Route exact path="/" component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  </AppLayout>
);

export default Router;
