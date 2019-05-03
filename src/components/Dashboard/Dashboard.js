import React, { Component } from 'react';
import { Button, CardGrid, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import StoreClient from '@fnndsc/chrisstoreapi';
import './Dashboard.css';
import DashPluginCardView from './components/DashPluginCardView/DashPluginCardView';
import DashTeamView from './components/DashTeamView/DashTeamView';
import DashGitHubView from './components/DashGitHubView/DashGitHubView';
import ChrisStore from '../../store/ChrisStore';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginList: null,
      loading: true,
    };
    this.initialize = this.initialize.bind(this);
    this.deletePlugin = this.deletePlugin.bind(this);
    this.editPlugin = this.editPlugin.bind(this);
  }

  componentDidMount() {
    this.fetchPlugins().catch((err) => {
      console.error(err);
    });
  }

  fetchPlugins() {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const client = new StoreClient(storeURL);
    const searchParams = {
      owner_username: store.get('userName'),
      limit: 20,
      offset: 0,
    };
    this.setState({ loading: true, pluginList: null });

    return new Promise(async (resolve, reject) => {
      let plugins;
      try {
        // add plugins to pluginList as they are received
        plugins = await client.getPlugins(searchParams);
        this.setState((prevState) => {
          const prevPluginList = prevState.pluginList ? prevState.pluginList : [];
          const nextPluginList = prevPluginList.concat(plugins.data);
          return { pluginList: nextPluginList, loading: false };
        });
      } catch (e) {
        return reject(e);
      }

      return resolve(plugins.data);
    });
  }

  deletePlugin(pluginId) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get('authToken') };
    const client = new StoreClient(storeURL, auth);

    let response;
    try {
      response = client.removePlugin(pluginId);
      response.then(() => {
        this.fetchPlugins();
      });
    } catch (e) {
      return e;
    }
    return response;
  }

  editPlugin(pluginId, dockerImage, publicRepo, newOwner) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get('authToken') };
    const client = new StoreClient(storeURL, auth);

    let response;
    try {
      response = client.modifyPlugin(pluginId, dockerImage, publicRepo);
      response.then(() => {
        this.fetchPlugins();
      });
    } catch (e) {
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
    const { pluginList, loading } = this.state;
    const { store } = this.props;
    const userName = store.get('userName') || '';
    return (
      <React.Fragment>
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
                  <DashPluginCardView plugins={pluginList} onDelete={this.deletePlugin} onEdit={this.editPlugin}/>
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
