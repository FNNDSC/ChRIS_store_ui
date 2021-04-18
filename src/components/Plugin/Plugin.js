import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';
import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import ChrisStore from '../../store/ChrisStore';
import PluginImg from '../../assets/img/brainy-pointer.png';
import NotFound from '../NotFound/NotFound';

import './Plugin.css';

const removeEmail = (author) => {
  if (author) return author.replace(/( ?\(.*\))/g, '');
  return undefined;
};

export class Plugin extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    const { pluginData } = props;
    this.state = {
      pluginData,
      loading: true,
      star: undefined,
    };

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);

    this.fetchPluginData = this.fetchPluginData.bind(this);
    this.onStarClicked = this.onStarClicked.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  async componentDidMount() {
    let pluginData;
    if (!this.state.pluginData) {
      try {
        pluginData = await this.fetchPluginData();
      } catch (error) {
        console.error(error)
      }
    } else {
      ({ pluginData } = this.state);
    }
    
    this.setState({ loading: false });
    if (this.isLoggedIn()) {
      this.fetchStarDataByPluginName(pluginData.name);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onStarClicked() {
    if (this.isLoggedIn()) {
      return this.isFavorite() ? this.unfavPlugin() : this.favPlugin();
    }
    return Promise.resolve();
  }

  async favPlugin() {
    // Early state change for instant visual feedback
    this.setState({ star: {} });

    const { name } = this.state.pluginData;
    try {
      const star = await this.client.createPluginStar({ plugin_name: name });
      this.setState({ star: star.data });
    } catch (err) {
      this.setState({ star: undefined });
    }
  }

  async unfavPlugin() {
    const previousStarState = { ...this.state.star };

    // Early state change for instant visual feedback
    this.setState({ star: undefined });

    try {
      const star = await this.client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (err) {
      this.setState({ star: previousStarState });
    }
  }

  async fetchPluginData() {
    const { plugin: pluginId } = this.props.match.params;

    let pluginData;
    try {
      const plugin = await this.client.getPlugin(parseInt(pluginId, 10));
      pluginData = plugin.data;
      pluginData.url = plugin.url;
    } catch (e) {
      return Promise.reject(e);
    }

    if (this.mounted) {
      this.setState({ pluginData, loading: false });
    }
    return pluginData;
  }

  async fetchStarDataByPluginName(pluginName) {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: this.props.store.get('authToken') };
    let stars = [];

    if (auth) {
      const client = new Client(storeURL, auth);
      const response = await client.getPluginStars({ plugin_name: pluginName });
      stars = response.data;
    }

    if (stars.length > 0) {
      this.setState({ star: stars[0] });
    }
  }

  isFavorite() {
    return this.state.star !== undefined;
  }

  isLoggedIn() {
    return this.props.store ? this.props.store.get('isLoggedIn') : false;
  }

  renderStar() {
    let name;
    let className;

    if (this.isLoggedIn()) {
      className = this.isFavorite() ? 'plugin-star-favorite' : 'plugin-star';
      name = this.isFavorite() ? 'star' : 'star-o';
    } else {
      className = 'plugin-star-disabled';
      name = 'star-o';
    }
    return <Icon name={name} className={className} onClick={this.onStarClicked} />;
  }

  render() {
    if (!this.state.loading && !this.state.pluginData)
      return <NotFound/>

    let plugin;
    let pluginURL;
    let authorURL;
    let data;

    const pluginDataProp = this.props.pluginData;
    if (pluginDataProp) {
      // define plugin name from props
      ({ plugin, pluginURL, authorURL } = pluginDataProp);

      data = pluginDataProp;
    } else {
      // define plugin name from url
      ({ plugin } = this.props.match.params);
      pluginURL = `/plugin/${plugin}`;

      const { pluginData } = this.state;
      data = pluginData || {};
    }

    // conditional rendering
    let container;
    if (Object.keys(data).length > 0) {
      const modificationDate = new RelativeDate(data.modification_date);

      const author = removeEmail(data.authors);
      if (!authorURL) authorURL = `/author/${author}`;

      container = (
        <div className="plugin-container">
          <div className="plugin-header">
            <Grid>
              <Grid.Row>
                <Grid.Col sm={12}>
                  <Grid.Col sm={2}>
                    <img
                      className="plugin-icon"
                      src={PluginImg}
                      alt="Plugin icon"
                    />
                  </Grid.Col>
                  <Grid.Col sm={10}>
                    <div className="plugin-category">
                      Visualization
                    </div>
                    <div className="plugin-name">
                      <Link
                        href={pluginURL || '/'}
                        to={pluginURL || '/'}
                        className="plugin-name"
                      >
                        {data.name}
                      </Link>
                      {this.renderStar()}
                    </div>
                    <div className="plugin-description">
                      {data.description}
                    </div>
                    <div className="plugin-stats">
                      <Icon name="star" size="lg" />
                      {' '}
                      10k+
                      {modificationDate.isValid()
                        && (
                        <span className="plugin-modified">
                          <Icon name="clock-o" size="lg" />
                          {`Last modified ${modificationDate.format()}`}
                        </span>
                        )}
                      {/* temp text */}
                      <span className="plugin-modified">
                        <Icon name="clock-o" size="lg" />
                        {' '}
                        Last modified 1 hour ago
                      </span>
                    </div>
                  </Grid.Col>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </div>
          <PluginBody pluginData={data} />
        </div>
      );
    } else {
      container = (
        <LoadingPlugin />
      );
    }

    return (
      <div className={`plugin ${this.props.className}`}>
        {container}
      </div>
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
