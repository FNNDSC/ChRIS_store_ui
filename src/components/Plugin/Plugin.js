import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';
import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import PluginImg from '../../assets/img/brainy-pointer.png';
import './Plugin.css';

const removeEmail = (author) => {
  if (author) return author.replace(/( ?\(.*\))/g, '');
  return undefined;
};

class Plugin extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    const { pluginData } = props;
    this.state = { pluginData };

    this.fetchPluginData = this.fetchPluginData.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    if (!this.state.pluginData) {
      this.fetchPluginData()
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchPluginData() {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const { plugin: pluginId } = this.props.match.params;
    const client = new Client(storeURL);

    let pluginData;
    return new Promise(async (resolve, reject) => {
      try {
        const plugin = await client.getPlugin(parseInt(pluginId, 10));
        pluginData = plugin.data;
      } catch (e) {
        return reject(e);
      }

      if (this.mounted) {
        this.setState({ pluginData });
      }
      return resolve(pluginData);
    });
  }

  render() {
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
                  <Grid.Col sm={1}>
                    <img
                      className="plugin-icon"
                      src={PluginImg}
                      alt="Plugin icon"
                    />
                  </Grid.Col>
                  <Grid.Col sm={6}>
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
                      <Icon name="star-o" size="lg" className="plugin-star" />
                    </div>
                    <div className="plugin-description">
                      {data.description}
                    </div>
                  </Grid.Col>
                  <Grid.Col sm={4} className="plugin-stats">
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
};

Plugin.defaultProps = {
  match: {
    params: {
      plugin: undefined,
    },
  },
  pluginData: null,
  className: '',
};

export default Plugin;
