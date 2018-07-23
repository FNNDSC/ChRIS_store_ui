import React, { Component } from 'react';
import { StoreClient } from '@fnndsc/chrisstoreapi';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PluginItem from './components/PluginItem/PluginItem';
import LoadingPluginItem from './components/LoadingPluginItem/LoadingPluginItem';
import PluginsCategories from './components/PluginsCategories/PluginsCategories';
import './Plugins.css';
import LoadingContainer from '../LoadingContainer/LoadingContainer';
import LoadingContent from '../LoadingContainer/components/LoadingContent/LoadingContent';

// ==============================
// ------ PLUGINS COMPONENT -----
// ==============================

class Plugins extends Component {
  constructor() {
    super();
    this.state = {
      pluginList: null,
      categories: [
        {
          name: 'Visualization',
          length: 3,
        },
        {
          name: 'Modeling',
          length: 11,
        },
        {
          name: 'Statistical Operation',
          length: 7,
        },
      ],
    };

    this.fetchPlugins = this.fetchPlugins.bind(this);
  }

  componentDidMount() {
    this.fetchPlugins().catch((err) => {
      console.error(err);
    });
  }

  fetchPlugins() {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const client = new StoreClient(storeURL);
    const searchParams = {
      limit: 20,
      offset: 0,
    };

    return new Promise(async (resolve, reject) => {
      let plugins;
      try {
        // add plugins to pluginList as they are received
        plugins = await client.getPlugins(searchParams, (onePageResponse) => {
          const onePagePlugins = onePageResponse.plugins;

          this.setState((prevState) => {
            const prevPluginList = prevState.pluginList ? prevState.pluginList : [];
            const nextPluginList = prevPluginList.concat(onePagePlugins);
            return { pluginList: nextPluginList };
          });
        });
      } catch (e) {
        return reject(e);
      }

      return resolve(plugins);
    });
  }

  render() {
    const { pluginList, categories } = this.state;

    // Remove email from author
    const removeEmail = author => author.replace(/( ?\(.*\))/g, '');

    let pluginsFound;
    let pluginListBody;

    // Render the pluginList if the plugins have been fetched
    if (pluginList) {
      pluginListBody = pluginList.map(plugin => (
        <PluginItem
          title={plugin.title}
          name={plugin.name}
          author={removeEmail(plugin.authors)}
          creationDate={plugin.creation_date}
          key={plugin.dock_image}
        />
      ));

      pluginsFound = (
        <span className="plugins-found">{pluginList.length} plugins found</span>
      );
    } else {
      // Or else show the loading placeholders
      pluginsFound = (
        <LoadingContainer>
          <LoadingContent
            width="135px"
            height="30px"
            left="1em"
            top="1.5em"
            bottom="1.5em"
          />
        </LoadingContainer>
      );

      pluginListBody = new Array(6).fill().map((e, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <LoadingPluginItem key={i} />
      ));
    }

    return (
      <div className="plugins-container">
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            { pluginsFound }
            <DropdownButton
              id="sort-by-dropdown"
              title="Sort By"
              pullRight
            >
              <MenuItem eventKey="1">Name</MenuItem>
            </DropdownButton>
          </div>
        </div>
        <div className="row plugins-row">
          <PluginsCategories categories={categories} />
          <div className="plugins-list">
            {pluginListBody}
          </div>
        </div>
      </div>
    );
  }
}

export default Plugins;
