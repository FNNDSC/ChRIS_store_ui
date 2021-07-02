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
import Notification from '../Notification';
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
      star: isFavorite ? isFavorite : undefined,
      errors: [],
    };

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);

    this.fetchPluginData = this.fetchPluginData.bind(this);
  }

  async componentDidMount() {
    let pluginData;

    if (!this.state.pluginData) {
      pluginData = await this.fetchPluginData();
    } else {
      ({ pluginData } = this.state);
    }

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

  isFavorite = () => this.state.star !== undefined;

  isLoggedIn = () => this.props.store ? this.props.store.get('isLoggedIn') : false;

  async fetchPluginData() {
    const { pluginId } = this.props.match.params;

    try {
      const plugin = await this.client.getPlugin(parseInt(pluginId, 10));
      return { ...plugin.data, url: plugin.url };
    } catch (e) {
      this.showNotifications(new HttpApiCallError(e));
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

  onStarClicked = () => {
    if (this.isLoggedIn()) {
      return this.isFavorite() ? this.unfavPlugin() : this.favPlugin();
    }
    return Promise.resolve();
  }

  favPlugin = async () => {
    const { pluginData } = this.state;

    // Early state change for instant visual feedback
    pluginData.stars++;
    this.setState({ star: {}, pluginData });

    try {
      const star = await this.client.createPluginStar({ plugin_name: pluginData.name });
      this.setState({ star: star.data });
    } catch (error) {
      this.showNotifications(new HttpApiCallError(error));
      pluginData.stars--;
      this.setState({ star: undefined, pluginData });
    }
  }

  unfavPlugin = async () => {
    const previousStarState = { ...this.state.star };
    const { pluginData } = this.state;

    // Early state change for instant visual feedback
    pluginData.stars--;
    this.setState({ star: undefined, pluginData });

    try {
      const star = await this.client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (error) {
      pluginData.stars++;
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

  render() {
    if (!this.state.loading && !this.state.pluginData)
      return <NotFound/>

    const plugin = this.state.pluginData;

    // conditional rendering
    let container;
    if (plugin) {
      const modificationDate = new RelativeDate(plugin.modification_date);

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
                        modificationDate.isValid() ?
                          `Last modified ${modificationDate.format()}`
                        : 
                          `Added ${(new RelativeDate(plugin.creation_date)).format()}`
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
      <React.Fragment>
        {
          this.state.errors.map((message, index) => (
            <Notification
              key={`notif-${message}`}
              title={message}
              position='top-right'
              variant='danger'
              closeable
              onClose={() => {
                let { errors } = this.state;
                errors.splice(index)
                this.setState({ errors })
              }}
            />
          ))
        }
        <div className={`plugin ${this.props.className}`}>
          {container}
        </div>
      </React.Fragment>

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
    authors: PropTypes.string,
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
