import React, { Component } from "react";
import PropTypes from "prop-types";
import Client from "@fnndsc/chrisstoreapi";
import { Spinner, Grid, GridItem, Split, SplitItem } from "@patternfly/react-core";

import "./Dashboard.css";

import Button from "../Button";
import DashPluginCardView from "./components/DashPluginCardView/DashPluginCardView";
import DashTeamView from "./components/DashTeamView/DashTeamView";
import DashGitHubView from "./components/DashGitHubView/DashGitHubView";
import ChrisStore from "../../store/ChrisStore";
import ErrorNotification from "../Notification";
import HttpApiCallError from "../../errors/HttpApiCallError";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginList: [],
      loading: true,
      error: null,
    };
    this.deletePlugin = this.deletePlugin.bind(this);
    this.editPlugin = this.editPlugin.bind(this);
  }

  componentDidMount() {
    this.fetchPlugins().catch((err) => {
      this.showNotifications(new HttpApiCallError(err));
    });
  }
  
  fetchPlugins() {
    const { store } = this.props;
    const storeURL = process.env.REACT_APP_STORE_URL;
    const client = new Client(storeURL);
    const searchParams = {
      owner_username: store.get("userName"),
      limit: 20,
      offset: 0,
    };

    return client.getPluginMetas(searchParams).then((plugins) => {
      this.setState(({ pluginList }) => ({ 
          pluginList: pluginList.concat(plugins.data), 
          loading: false 
        }));

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
  
  showNotifications(error) {
    this.setState({
      error: error.message,
    });
  };

  render() {
    const { pluginList, loading, error } = this.state;
    
    return (
      <>
        {error && (
          <ErrorNotification
            title={error}
            position="topRight"
            variant="danger"
            closeable
            onClose={() => this.setState({ error: null })}
          />
        )}

        <article id="dashboard-container">
          <Split id="title-bar">
            <SplitItem id="title-name">
              <h2>Dashboard</h2>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem id="title-actions-container">
              <Button variant="primary" toRoute="/create">
                Add Plugin
              </Button>
              {/* <Button variant="secondary" toRoute="/">
                Another
              </Button> */}
            </SplitItem>
          </Split>

          {
            loading ? (
              <div id="dashboard-spinner">
                <Spinner size="xl" />
              </div>
            ) : (
              <Grid hasGutter className="cards-pf" id="dashboard-body">
                <GridItem lg={8} xs={12}>
                  <Grid hasGutter>
                    <GridItem xs={12}>
                      <DashPluginCardView
                        plugins={pluginList}
                        onDelete={this.deletePlugin}
                        onEdit={this.editPlugin}
                      />
                    </GridItem>

                    <GridItem xs={12}>
                      <DashTeamView plugins={pluginList} />
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem lg={4} xs={12} id="dashboard-right-column">
                  <DashGitHubView plugins={pluginList} />
                </GridItem>
              </Grid>
            )
          }
        </article>
      </>
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
