import React, { Component } from 'react';
import { Badge, Grid, GridItem, Split, SplitItem, Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';

import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import ChrisStore from '../../store/ChrisStore';
import PluginImg from '../../assets/img/brainy-pointer.png';
import NotFound from '../NotFound/NotFound';
import ErrorNotification from '../Notification';
import HttpApiCallError from '../../errors/HttpApiCallError';

import './Plugin.css';

export class Plugin extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    const { pluginData, isFavorite } = props;
    this.state = {
      pluginData,
      loading: true,
      star: isFavorite || undefined,
      errors: [],
    };

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);

    this.fetchPluginData = this.fetchPluginData.bind(this);
  }

  async componentDidMount() {
    let { pluginData } = this.state;

    /**
     * When the user opens this page from `/plugins` or `/plugins/<name>`, 
     * the incoming prop has a value and we use that.
     * 
     * If the incoming prop does not have a value, we assume 
     * we are on `/p/<id>` and we fetch by ID `name_exact=<name>`.
     */
    if (!pluginData)
      pluginData = await this.fetchPluginData();
    /**
     * If pluginData was fetched (by ID), it will have a version, hence continue.
     * If not, we fetch all plugins with `name_exact=<name>` 
     * and select plugin.versions[0] from that to show on the install button.
     */
    else
      this.fetchPluginVersions(pluginData.name)

    this.setState({ pluginData, loading: false });
    if (this.isLoggedIn()) {
      this.fetchIsPluginStarred(pluginData);
    }
  }

  showNotifications = (error) => {
    let { errors } = this.state;
    errors = [ ...errors, error.message ]
    this.setState({
      errors
    })
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

  async fetchPluginData() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginId } = this.props.match.params;

    try {
      const plugin = await this.client.getPlugin(parseInt(pluginId, 10));
      return { ...plugin.data, url: plugin.url };
    } catch (e) {
      this.showNotifications(new HttpApiCallError(e));
      return e
    }
  }

  /**
   * Fetch all versions of a plugin by name.
   * 
   * @param {*} name Plugin name
   * @returns Promise => void
   */
  async fetchPluginVersions(name) {
    try {
      const versions = await this.client.getPlugins({ limit: 10e6, name_exact: name });
      return this.setState((prevState) => ({ 
        pluginData: { 
          ...prevState.pluginData, 
          versions: versions.data, 
          url: versions.url,
        } 
      }));
    } catch (e) {
      this.showNotifications(new HttpApiCallError(e));
      return e
    }
  }

  async fetchIsPluginStarred({ name }) {
    try {
      const response = await this.client.getPluginStars({ plugin_name: name });
      if (response.data.length > 0)
        this.setState({ star: response.data[0] });
    } catch(error) {
      this.showNotifications(new HttpApiCallError(error));
    }
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

    const { className } = this.props;
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
        <div className={`plugin ${className}`}>
          {container}
        </div>
      </>

    );
  }
}

Plugin.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    }),
  }),
  pluginData: PropTypes.shape({
    plugin: PropTypes.string,
    pluginURL: PropTypes.string,
    authorURL: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.number,
    description: PropTypes.string,
    dock_image: PropTypes.string,
    modification_date: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    version: PropTypes.string,
  }),
  className: PropTypes.string,
  store: PropTypes.objectOf(PropTypes.object),
};

Plugin.defaultProps = {
  match: {
    params: {
      plugin: undefined,
    },
  },
  pluginData: null,
  className: '',
  store: new Map(),
};

export default ChrisStore.withStore(Plugin);
