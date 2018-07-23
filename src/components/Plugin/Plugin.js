import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StoreClient } from '@fnndsc/chrisstoreapi';
import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import './Plugin.css';

class Plugin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pluginData: null,
    };

    this.fetchPluginData = this.fetchPluginData.bind(this);
  }

  componentDidMount() {
    this.fetchPluginData()
      .catch((err) => {
        console.error(err);
      });
  }

  fetchPluginData() {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const { plugin: pluginName } = this.props.match.params;
    const client = new StoreClient(storeURL);

    return new Promise(async (resolve, reject) => {
      let pluginData;

      try {
        pluginData = await client.getPlugin(pluginName);
      } catch (e) {
        return reject(e);
      }

      this.setState({ pluginData });
      return resolve(pluginData);
    });
  }

  render() {
    // define plugin name from url
    const { plugin } = this.props.match.params;
    const pluginURL = `/plugin/${plugin}`;

    // define plugin data
    const { pluginData } = this.state;
    const data = pluginData || {};

    // conditional rendering
    let container;
    if (Object.keys(data).length > 0) {
      const modificationDate = new RelativeDate(data.modification_date);
      const creationDate = new RelativeDate(data.creation_date);
      const author = data.authors.replace(/( ?\(.*\))/g, '');

      container = (
        <div className="plugin-container">
          <div className="plugin-header">
            <div className="row no-flex">
              <div className="plugin-category">Visualization</div>
              <Link
                href={pluginURL}
                to={pluginURL}
                className="plugin-name"
              >
                {plugin}
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
                    href={`/author/${author}`}
                    to={`/author/${author}`}
                    className="plugin-author"
                  >
                    {author}
                  </Link>
                  {creationDate.isValid() &&
                    ` created ${creationDate.format()}`
                  }
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
      <div className="plugin">
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
};

Plugin.defaultProps = {
  match: {
    params: {
      plugin: undefined,
    },
  },
};

export default Plugin;
