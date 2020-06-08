import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';
import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
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
      const creationDate = new RelativeDate(data.creation_date);

      const author = removeEmail(data.authors);
      if (!authorURL) authorURL = `/author/${author}`;

      container = (
        <div className="plugin-container">
          <div className="plugin-header">
            <div className="row no-flex">
              <div className="plugin-category">Visualization</div>
              <Link
                href={pluginURL || '/'}
                to={pluginURL || '/'}
                className="plugin-name"
              >
                {data.name}
              </Link>
              {modificationDate.isValid() &&
                <div className="plugin-modified">
                  {`Last modified ${modificationDate.format()}`}
                </div>
              }
              <div className="plugin-stats">
                <div className="plugin-version plugin-tag">
                  {data &&
                    `v${data.version}`
                  }
                </div>
                <div className="plugin-created plugin-tag">
                  <Link
                    href={authorURL}
                    to={authorURL}
                    className="plugin-author"
                  >
                    {author}
                  </Link>
                  {creationDate.isValid() &&
                    ` created ${creationDate.format()}`
                  }
                </div>
                <div className="plugin-license plugin-tag">
                  {`${data.license} license`}
                </div>
              </div>
            </div>
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
    creation_date: PropTypes.string,
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
