import React, { Component } from "react";
import PropTypes from "prop-types";
import Client from "@fnndsc/chrisstoreapi";
import { DropdownButton, MenuItem } from "react-bootstrap";
import PluginItem from "./components/PluginItem/PluginItem";
import LoadingPluginItem from "./components/LoadingPluginItem/LoadingPluginItem";
import PluginsCategories from "./components/PluginsCategories/PluginsCategories";
import "./Plugins.css";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import LoadingContent from "../LoadingContainer/components/LoadingContent/LoadingContent";
import ChrisStore from "../../store/ChrisStore";

// ==============================
// ------ PLUGINS COMPONENT -----
// ==============================

export class Plugins extends Component {
  constructor(props) {
    super(props);

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get("authToken") };
    this.client = new Client(storeURL, auth);

    this.mounted = false;
    this.state = {
      pluginList: null,
      starsByPlugin: {},
      categories: [
        { name: "Visualization", length: 3 },
        { name: "Modeling", length: 11 },
        { name: "Statistical Operation", length: 7 },
        { name: "FreeSurfer", length: 0 },
        { name: "MRI Processing", length: 0 },
      ],
    };

    this.fetchPlugins = this.fetchPlugins.bind(this);
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
  }

  componentWillMount() {
    this.mounted = true;
  }

  async componentDidMount() {
    try {
      const plugins = await this.fetchPlugins()
      /**
       * Accumulate counts of categories from fetched plugins
       */
      let { categories } = this.state;
      for (const [index, { name, length }] of categories.entries()) {
        categories[index].length = plugins.reduce(
          (count, current) => (name === current.category) 
            ? ++count
            : count, 
          length
        );
      }
      
      this.setState({ categories });
    } catch (err) {
      console.error(err);
    }

    if (this.isLoggedIn()) {
      this.fetchPluginStars();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setPluginStar(pluginId, star) {
    this.setState({
      starsByPlugin: {
        ...this.state.starsByPlugin,
        [pluginId]: star,
      },
    });
  }

  removePluginStar(pluginId) {
    this.setPluginStar(pluginId, undefined);
  }

  async favPlugin(plugin) {
    // Early state change for instant visual feedback
    this.setPluginStar(plugin.id, {});

    try {
      const star = await this.client.createPluginStar({
        plugin_name: plugin.name,
      });
      this.setPluginStar(plugin.id, star.data);
    } catch (err) {
      this.removePluginStar(plugin.id);
      console.error(err);
    }
  }

  async unfavPlugin(plugin) {
    const previousStarState = { ...this.state.starsByPlugin[plugin.id] };

    // Early state change for instant visual feedback
    this.removePluginStar(plugin.id);

    try {
      const star = await this.client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (err) {
      this.setPluginStar(plugin.id, previousStarState);
      console.error(err);
    }
  }

  fetchPlugins() {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('q') //get value searched from the URL
    const searchParams = {
      limit: 20,
      offset: 0,
      name_title_category:name,
    };

    return new Promise(async (resolve, reject) => {
      let plugins;
      try {
        // add plugins to pluginList as they are received
        plugins = await this.client.getPlugins(searchParams);
        if (this.mounted) {
          this.setState((prevState) => {
            // const prevPluginList = prevState.pluginList
            //   ? prevState.pluginList
            //   : [];
            // const nextPluginList = prevPluginList.concat(plugins.data);
            return { pluginList: plugins.data };
          });
        }
      } catch (e) {
        return reject(e);
      }
      
      return resolve(plugins.data);
    });
  }

  async fetchPluginStars() {
    const stars = await this.client.getPluginStars();

    const starsByPlugin = {};
    stars.data.forEach((star) => {
      const pluginId = star.meta_id;
      starsByPlugin[pluginId] = star;
    });

    this.setState({ starsByPlugin });
  }

  handlePluginFavorited(plugin) {
    if (this.isLoggedIn()) {
      return this.isFavorite(plugin)
        ? this.unfavPlugin(plugin)
        : this.favPlugin(plugin);
    }

    return Promise.resolve();
  }

  async handleCategorySelect(category) {
    this.setState({ pluginList: null })
    if (!category) return await this.fetchPlugins()

    this.setState({ 
      pluginList: (await this.client.getPlugins({
        name_title_category: category
      })).data 
    })
  }

  isFavorite(plugin) {
    return this.state.starsByPlugin[plugin.id] !== undefined;
  }

  isLoggedIn() {
    return this.props.store ? this.props.store.get("isLoggedIn") : false;
  }

  render() {
    const { pluginList, categories } = this.state;

    // Remove email from author
    const removeEmail = (author) => author.replace(/( ?\(.*\))/g, "");

    let pluginsFound;
    let pluginListBody;

    // Render the pluginList if the plugins have been fetched
    if (pluginList) {
      pluginListBody = pluginList.map((plugin) => (
        <PluginItem
          title={plugin.title}
          id={plugin.id}
          name={plugin.name}
          author={removeEmail(plugin.authors)}
          creationDate={plugin.creation_date}
          key={`${plugin.name}-${plugin.id}`}
          isLoggedIn={this.isLoggedIn()}
          isFavorite={this.isFavorite(plugin)}
          onStarClicked={async () => this.handlePluginFavorited(plugin)}
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
            {pluginsFound}
            <DropdownButton id="sort-by-dropdown" title="Sort By" pullRight>
              <MenuItem eventKey="1">Name</MenuItem>
            </DropdownButton>
          </div>
        </div>
        <div className="row plugins-row">
          <PluginsCategories categories={categories} 
            onSelect={this.handleCategorySelect} 
          />
          <div className="plugins-list">{pluginListBody}</div>
        </div>
      </div>
    );
  }
}

Plugins.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(Plugins);
