import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PluginItem from './components/PluginItem/PluginItem';
import PluginsCategories from './components/PluginsCategories/PluginsCategories';
import formatPluginList from './formatPluginList';
import sampleData from './samplePluginsData';
import './Plugins.css';

// ==============================
// ------ PLUGINS COMPONENT -----
// ==============================

class Plugins extends Component {
  constructor(props) {
    super(props);
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
    this.fetchPlugins().then((plugins) => {
      console.log(plugins);
    });
  }

  fetchPlugins() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pluginList = sampleData.collection.items;
        const formattedPluginList = formatPluginList(pluginList);
        resolve(formattedPluginList);
        this.setState({
          pluginList: formattedPluginList,
        });
      }, 81); // 81 is the "average" request duration
    });
  }

  render() {
    const pluginListExists = this.state.pluginList;
    const pluginListLength = pluginListExists ? this.state.pluginList.length : 0;
    let pluginListBody;

    // Remove email from author
    const removeEmail = author => author.replace(/( ?\(.*\))/g, '');

    // Render the pluginList if the plugins have been fetched
    if (pluginListExists) {
      pluginListBody = this.state.pluginList.map(plugin => (
        <PluginItem
          title={plugin.data.title}
          name={plugin.data.name}
          author={removeEmail(plugin.data.authors)}
          creationDate={plugin.data.creation_date}
          key={plugin.data.dock_image}
        />
      ));
    // Or else show the loading text
    } else {
      pluginListBody = (
        <div className="drawer-pf-loading text-center">
          <span className="spinner spinner-xs spinner-inline" /> Loading Plugins
        </div>
      );
    }

    return (
      <div className="plugins-container">
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            <span className="plugins-found">{pluginListLength} plugins found</span>
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
          <PluginsCategories categories={this.state.categories} />
          <div className="plugins-list">
            {pluginListBody}
          </div>
        </div>
      </div>
    );
  }
}

export default Plugins;
