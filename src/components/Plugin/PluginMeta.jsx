import React, { Component } from 'react';
import { Badge, Grid, GridItem, Split, SplitItem, Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import Client, { PluginMeta } from '@fnndsc/chrisstoreapi';

import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import ChrisStore from '../../store/ChrisStore';
import PluginImg from '../../assets/img/brainy-pointer.png';
import NotFound from '../NotFound/NotFound';
import ErrorNotification from '../Notification';
import HttpApiCallError from '../../errors/HttpApiCallError';

import './Plugin.css';

/**
 * View a plugin meta by plugin name.
 * 
 * @todo 
 * Make this view visually different
 * from the plugin view by ID.
 */
export class PluginMetaView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pluginData: undefined,
      star: undefined,
      loading: true,
      errors: [],
    };

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);
  }

  /**
   * Fetch a plugin meta by name, from URL params.
   * Then fetch all versions of that plugin.
   * Set stars if user is logged in.
   */
  async componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginName } = this.props.match.params;
    try {
      const pluginMeta = await this.fetchPluginMeta(pluginName);
      const versions = await this.fetchPluginVersions(pluginMeta);
      const collaborators = await this.fetchPluginCollaborators(pluginMeta);

      let star;
      if (this.isLoggedIn())
        star = await this.fetchIsPluginStarred(pluginMeta.data);

      this.setState({
        loading: false,
        star,
        pluginData: {
          ...pluginMeta.data,
          versions,
          collaborators,
        }
      });
    } catch (error) {
      this.setState((prev) => ({
        loading: false,
        errors: [...prev.errors, error]
      }));
    }
  }

  showNotifications = (error) => {
    this.setState((prev) => ({
      errors: [...prev.errors, error]
    }));
  }

  // eslint-disable-next-line react/destructuring-assignment
  isFavorite = () => this.state.star !== undefined;

  // eslint-disable-next-line react/destructuring-assignment
  isLoggedIn = () => this.props.store ? this.props.store.get('isLoggedIn') : false;

  onStarClicked = () => {
    if (this.isLoggedIn()) {
      if (this.isFavorite())
        this.unfavPlugin();
      else
        this.favPlugin();
    }
    else
      this.showNotifications(new Error('Login required to favorite this plugin.'))
  }

  favPlugin = async () => {
    const { pluginData } = this.state;

    // Early state change for instant visual feedback
    pluginData.stars += 1;
    this.setState({ star: {}, pluginData });

    try {
      const star = await this.client.createPluginStar({ plugin_name: pluginData.name });
      this.setState({ star: star.data });
    } catch (error) {
      this.showNotifications(new HttpApiCallError(error));
      pluginData.stars -= 1;
      this.setState({ star: undefined, pluginData });
    }
  }

  unfavPlugin = async () => {
    const { pluginData, star: previousStarState } = this.state;

    // Early state change for instant visual feedback
    pluginData.stars -= 1;
    this.setState({ star: undefined, pluginData });

    try {
      await (
        await this.client.getPluginStar(previousStarState.id)
      ).delete();
    } catch (error) {
      pluginData.stars += 1;
      this.setState({ star: previousStarState, pluginData });
      this.showNotifications(new HttpApiCallError(error));
    }
  }

  /**
   * Fetch a plugin meta by plugin name.
   * @param {string} pluginName 
   * @returns {Promise<PluginMeta>} PluginMeta
   */
  async fetchPluginMeta(pluginName) {
    const metas = await this.client.getPluginMetas({ name_exact: pluginName, limit: 1 });
    return metas.getItems().shift();
  }

  /**
   * Fetch all versions of a plugin.
   * @param {PluginMeta} pluginMeta 
   * @returns {Promise<any[]>} Versions of the plugin
   */
  // eslint-disable-next-line class-methods-use-this
  async fetchPluginVersions(pluginMeta) {
    const versions = (await pluginMeta.getPlugins()).getItems();
    return versions.map(({ data, url }) => ({ ...data, url }));
  }

  /**
  * Fetch all versions of a plugin.
  * @param {PluginMeta} pluginMeta
  * @returns {Promise<any[]>} Collaborators of the plugin
  */
  // eslint-disable-next-line class-methods-use-this
  async fetchPluginCollaborators(pluginMeta) {
    const collaborators = (await pluginMeta.getCollaborators()).getItems();
    return collaborators.map((collaborator, index) => collaborators[index].data.username);
  }


  async fetchIsPluginStarred({ name }) {
    const response = await this.client.getPluginStars({ plugin_name: name });
    if (response.data.length > 0)
      return response.data[0];
    return undefined;
  }

  render() {
    const { loading, pluginData: plugin, errors } = this.state;

    if (!loading && !plugin)
      return <NotFound />

    let container;
    if (plugin) {
      container = (
        <article>
          <section>
            <Grid hasGutter>
              <GridItem style={{ marginRight: '2em' }} lg={2} xs={12}>
                <img
                  className="plugin-icon"
                  src={PluginImg}
                  alt="Plugin icon"
                />
              </GridItem>

              <GridItem lg={10} xs={12}>
                <Grid>
                  <GridItem lg={10} xs={12}>
                    <h3 className="plugin-name">{plugin.name} <Badge>{plugin.category}</Badge></h3>
                    <h2 className="plugin-title">{plugin.title}</h2>
                  </GridItem>

                  <GridItem lg={2} xs={12} className="plugin-stats">
                    <Split>
                      <SplitItem isFilled />
                      <SplitItem>
                        {
                          !this.isFavorite() ?
                            <Button onClick={this.onStarClicked}>
                              Favorite <Badge isRead><StarIcon /> {plugin.stars}</Badge>
                            </Button>
                            :
                            <Button variant="secondary" onClick={this.onStarClicked}>
                              Unfavorite <Badge><StarIcon /> {plugin.stars}</Badge>
                            </Button>
                        }
                      </SplitItem>
                    </Split>
                  </GridItem>

                  <GridItem>
                    <p>{plugin.description}</p>
                    <p style={{ color: "gray" }}>
                      {
                        RelativeDate.isValid(plugin.modification_date) ?
                          `Updated ${new RelativeDate(plugin.modification_date).format()}`
                          :
                          `Created ${new RelativeDate(plugin.creation_date).format()}`
                      }
                    </p>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </section>

          <section>
            <PluginBody pluginData={plugin} />
          </section>
        </article>
      );
    } else {
      container = (
        <article>
          <LoadingPlugin />
        </article>
      );
    }

    return (
      <>
        {
          errors.map((error, index) => (
            <ErrorNotification
              key={`notif-${error.message}`}
              title="Error"
              message={error.message}
              position='top-right'
              variant='danger'
              closeable
              onClose={() => {
                errors.splice(index)
                this.setState({ errors })
              }}
            />
          ))
        }
        <div className="plugin">
          {container}
        </div>
      </>

    );
  }
}

PluginMeta.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

PluginMeta.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(PluginMetaView);
