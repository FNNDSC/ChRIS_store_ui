import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import sampleData from '../Plugins/samplePluginsData';
import formatPluginList from '../Plugins/formatPluginList';
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
    this.fetchPluginData();
  }

  fetchPluginData() {
    const { plugin: pluginName } = this.props.match.params;
    return new Promise((resolve) => {
      setTimeout(() => {
        const pluginList = sampleData.collection.items;
        const formattedPluginList = formatPluginList(pluginList);

        const pluginData = formattedPluginList.find(plugin => plugin.data.name === pluginName);

        resolve(pluginData);

        this.setState({ pluginData });
      }, 81); // 81 is the "average" request duration
    });
  }

  render() {
    // define plugin name from url
    const { plugin } = this.props.match.params;
    const pluginURL = `/plugin/${plugin}`;

    // define plugin data
    const { pluginData } = this.state;
    const { data } = pluginData || {};

    // conditional rendering
    let container;
    if (data) {
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
        <div className="drawer-pf-loading text-center">
          <span className="spinner spinner-xs spinner-inline" /> Loading Plugin
        </div>
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
