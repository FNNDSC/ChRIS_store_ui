import React, { Component } from 'react';
import { Badge, Grid, GridItem, Split, SplitItem, Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import Client, { Plugin } from '@fnndsc/chrisstoreapi';

import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import ChrisStore from '../../store/ChrisStore';
import PluginImg from '../../assets/img/brainy-pointer.png';
import NotFound from '../NotFound/NotFound';
import ErrorNotification from '../Notification';
import HttpApiCallError from '../../errors/HttpApiCallError';

import './Plugin.css';

export class PluginView extends Component {
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

  async componentDidMount() {
    try {
      const plugin = await this.fetchPlugin();
      const versions = await this.fetchPluginVersions(plugin.data.name);

      let star;
      if (this.isLoggedIn())
        star = await this.fetchIsPluginStarred(plugin.data);

      this.setState({ 
        loading: false,
        pluginData: {
          ...plugin.data,
          url: plugin.url,
          versions
        },
        star,
      });
    } catch (error) {
      this.setState((prev) => ({ 
        loading: false, 
        errors: [ ...prev.errors, error ] 
      }));
    }
  }

  showNotifications = (error) => {
    this.setState((prev) => ({
      errors: [ ...prev.errors, error ] 
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
      this.showNotifications(new Error('You need to be logged in!'))
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

  renderStar = () => {
    let name;
    let className;

    if (this.isLoggedIn()) {
      className = this.isFavorite() ? 'plugin-star-favorite' : 'plugin-star';
      name = this.isFavorite() ? 'star' : 'star-o';
    } else {
      className = 'plugin-star-disabled';
      name = 'star-o';
    }
    return <StarIcon name={name} className={className} onClick={this.onStarClicked} />;
  }

  async fetchPlugin() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginId } = this.props.match.params;
    return this.client.getPlugin(parseInt(pluginId, 10));
  }

  /**
   * Fetch all versions of a plugin by name.
   * 
   * @param {string} name Plugin name
   * @returns Promise => void
   */
  async fetchPluginVersions(name) {
    const versions = await this.client.getPlugins({ limit: 10e6, name_exact: name });
    const firstplg = await this.client.getPlugin(parseInt(versions.data[0].id, 10));
    return [
      { ...versions.data[0], url: firstplg.url },
      ...versions.data.slice(1)
    ]
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
      return <NotFound/>

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
          errors.map((message, index) => (
            <ErrorNotification
              key={`notif-${message}`}
              title={message}
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

Plugin.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

Plugin.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(PluginView);
