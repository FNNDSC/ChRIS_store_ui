import React, { Component } from 'react';
import { Button, CardGrid, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';
import './Dashboard.css';
import DashPluginCardView from './components/DashPluginCardView/DashPluginCardView';
import DashTeamView from './components/DashTeamView/DashTeamView';
import DashGitHubView from './components/DashGitHubView/DashGitHubView';
import ChrisStore from '../../store/ChrisStore';
import Notifications from '../Notifications/Notifications';
import HttpApiCallError from '../../errors/HttpApiCallError';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginList: null,
      loading: true,
      error: null,
    };
    this.initialize = this.initialize.bind(this);
    this.deletePlugin = this.deletePlugin.bind(this);
    this.editPlugin = this.editPlugin.bind(this);
  }

  componentDidMount() {
    this.fetchPlugins().catch((err) => {
      this.showNotifications(new HttpApiCallError('Unable to fetch plugin'));
      console.error(err);
    });
  }
  showNotifications = (error) => {
    this.setState({
      error: error.message,
    })
  }
  fetchPlugins() {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const client = new Client(storeURL);
    const searchParams = {
      owner_username: store.get('userName'),
      limit: 20,
      offset: 0,
    };
    this.setState({ loading: true, pluginList: null });

    return client.getPlugins(searchParams)
      .then((plugins) => {
        this.setState((prevState) => {
          const prevPluginList = prevState.pluginList ? prevState.pluginList : [];
          const nextPluginList = prevPluginList.concat(plugins.data);
          return { pluginList: nextPluginList, loading: false };
        });
        return plugins.data;
      });
  }

  deletePlugin(pluginId) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get('authToken') };
    const client = new Client(storeURL, auth);

    let response;
    try {
      response = client.getPlugin(pluginId).then(plugin => plugin.delete());
      response.then(() => {
        this.fetchPlugins();
      });
    } catch (e) {
      this.showNotifications(new HttpApiCallError('Unable to delete plugin'));
      return e;
    }
    return response;
  }

  editPlugin(pluginId, publicRepo) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get('authToken') };
    const client = new Client(storeURL, auth);

    let response;
    try {
      response = client.getPlugin(pluginId)
        .then(plugin => plugin.getPluginMeta())
        .then(plgMeta => plgMeta.put({ public_repo: publicRepo }));
      response.then(() => {
        this.fetchPlugins();
      });
    } catch (e) {
      this.showNotifications(new HttpApiCallError('Unable to edit plugin'));
      return e;
    }
    return response;
  }

  initialize() {
    const { arePluginsAvailable } = this.state;

    this.setState({
      arePluginsAvailable: !arePluginsAvailable,
    });
  }

  render() {
    const { pluginList, loading, error } = this.state;
    const { store } = this.props;
    const userName = store.get('userName') || '';
    return (
      <React.Fragment>
        {error && (
          <Notifications 
            message={error} 
            position='top-right' 
            variant='danger' 
            closeNotification={()=>this.setState({error:null})} 
          />
        )}
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            <div className="title-bar">{`Dashboard for ${userName}`}</div>
            <div className="dropdown btn-group">
              <Button bsStyle="primary" bsSize="large" href="/create">
                Add Plugin
              </Button>
            </div>
          </div>
        </div>
        <div className="cards-pf dashboard-body">
          <CardGrid>
            <div className="dashboard-row">
              <Spinner size="lg" loading={loading}>
                <div className="dashboard-left-column">
                  <DashPluginCardView
                    plugins={pluginList}
                    onDelete={this.deletePlugin}
                    onEdit={this.editPlugin}
                  />
                  <DashTeamView plugins={pluginList} />
                </div>
                <div className="dashboard-right-column">
                  <DashGitHubView plugins={pluginList} />
                </div>
              </Spinner>
            </div>
          </CardGrid>
        </div>
      </React.Fragment>
    );
  }
}
Dashboard.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
};
Dashboard.defaultProps = {
  store: {},
};

export default ChrisStore.withStore(Dashboard);
