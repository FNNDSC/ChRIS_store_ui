import React, { Component } from "react";
import { CardGrid, Spinner } from "patternfly-react";
import PropTypes from "prop-types";
import Button from "../Button";
import Client from "@fnndsc/chrisstoreapi";
import styles from "./Dashboard.module.css";
import DashPluginCardView from "./components/DashPluginCardView/DashPluginCardView";
import DashTeamView from "./components/DashTeamView/DashTeamView";
import DashGitHubView from "./components/DashGitHubView/DashGitHubView";
import ChrisStore from "../../store/ChrisStore";
import Notification from "../Notification";
import HttpApiCallError from "../../errors/HttpApiCallError";

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
      this.showNotifications(new HttpApiCallError(err));
      console.error(err);
    });
  }
  showNotifications = (error) => {
    this.setState({
      error: error.message,
    });
  };
  fetchPlugins() {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const client = new Client(storeURL);
    const searchParams = {
      owner_username: store.get("userName"),
      limit: 20,
      offset: 0,
    };
    this.setState({ loading: true, pluginList: null });
    return client.getPlugins(searchParams).then((plugins) => {
      this.setState((prevState) => {
        const prevPluginList = prevState.pluginList ? prevState.pluginList : [];
        const nextPluginList = prevPluginList.concat(plugins.data);
        return { pluginList: nextPluginList, loading: false };
      });
      return plugins.data;
    });
  }
  async deletePlugin(pluginId) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get("authToken") };
    const client = new Client(storeURL, auth);
    let response;
    try {
      response = await client.getPlugin(pluginId);
      await response.delete();
      if (response.data) {
        this.fetchPlugins();
      } else {
        throw new Error("Delete unsuccessful");
      }
    } catch (e) {
      this.showNotifications(new HttpApiCallError(e));
    }
    return response;
  }
  editPlugin(pluginId, publicRepo) {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get("authToken") };
    const client = new Client(storeURL, auth);
    let response;
    try {
      response = client
        .getPlugin(pluginId)
        .then((plugin) => plugin.getPluginMeta())
        .then((plgMeta) => plgMeta.put({ public_repo: publicRepo }));
      response.then(() => {
        this.fetchPlugins();
      });
    } catch (e) {
      this.showNotifications(new HttpApiCallError(e));
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
    const userName = store.get("userName") || "";
    return (
      <React.Fragment>
        {error && (
          <Notification
            title={error}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => this.setState({ error: null })}
          />
        )}
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            <div className="title-bar">{`Dashboard for ${userName}`}</div>
            <div className="dropdown btn-group">
              <Button variant="primary" toRoute="/create">
                Add Plugin
              </Button>
            </div>
          </div>
        </div>
        <div className={`cards-pf ${styles['dashboard-body']}`}>
          <CardGrid>
            <div className={styles['dashboard-row']}>
              <Spinner size="lg" loading={loading}>
                <div className={styles['dashboard-left-column']}>
                      <DashPluginCardView
                        plugins={pluginList}
                        onDelete={this.deletePlugin}
                        onEdit={this.editPlugin}
                      />
                      <DashTeamView plugins={pluginList} />
                </div>
                <div className={styles['dashboard-right-column']}>
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