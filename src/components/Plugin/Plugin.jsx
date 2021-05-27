import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { StarIcon, ClockIcon } from '@patternfly/react-icons';
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
      errors: [],
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
      pluginData = await this.fetchPluginData();
    } else {
      ({ pluginData } = this.state);
    }

    if (this.isLoggedIn()) {
      this.fetchStarDataByPluginName(pluginData.name);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  showNotifications = (error) => {
    let { errors } = this.state;
    errors = [ ...errors, error.message ]
    this.setState({
      errors
    })
  }

  isFavorite() {
    return this.state.star !== undefined;
  }

  isLoggedIn() {
    return this.props.store ? this.props.store.get('isLoggedIn') : false;
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
    } catch (error) {
      this.showNotifications(new HttpApiCallError(error));
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
    } catch (error) {
      this.setState({ star: previousStarState });
      this.showNotifications(new HttpApiCallError(error));
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
      this.showNotifications(new HttpApiCallError(e));
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
    try {
      if (auth) {
        const client = new Client(storeURL, auth);
        const response = await client.getPluginStars({ plugin_name: pluginName });
        stars = response.data;
      }

      if (stars.length > 0)
        this.setState({ star: stars[0] });
      else
        throw new Error('Unable to fetch Plugin stars');
    } catch(error) {
      this.showNotifications(new HttpApiCallError(error));
    }
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
    return <StarIcon name={name} className={className} onClick={this.onStarClicked} />;
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
            <Grid hasGutter>
              <GridItem md={2} sm={12}>
                <img
                  className="plugin-icon"
                  src={PluginImg}
                  alt="Plugin icon"
                />
              </GridItem>
              <GridItem sm={10}>
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
                  <StarIcon name="star" size="lg" /> {data.stars}
                  { 
                    modificationDate.isValid() ?
                      <span className="plugin-modified">
                        <ClockIcon name="clock-o" size="lg" /> Last modified {modificationDate.format()}
                      </span>
                    : null
                  }
                </div>
              </GridItem>
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
      <React.Fragment>
        {
          this.state.errors.map((message, index) => (
            <Notification
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
        
        {/* <Route path="/plugin/:name/:version" render={(routeProps)=>{
          if (this.state.loading)
            return <LoadingPluginItem />

          const { name: query, version } = routeProps.match.params
          if (pluginList.has(query)) {
            let versionList = pluginList.get(query).versions
            if (versionList.hasOwnProperty(version))
              return <ConnectedPlugin pluginData={versionList[version]} />
            else
              return <NotFound/>
          }
          else
            return <NotFound/>
        }} /> */}


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
