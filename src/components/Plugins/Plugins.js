import React, { Component } from "react";
import PropTypes from "prop-types";
import Client from "@fnndsc/chrisstoreapi";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownPosition,
} from "@patternfly/react-core";
import { CaretDownIcon } from "@patternfly/react-icons";
import PluginItem from "./components/PluginItem/PluginItem";
import LoadingPluginItem from "./components/LoadingPluginItem/LoadingPluginItem";
import PluginsCategories from "./components/PluginsCategories/PluginsCategories";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import LoadingContent from "../LoadingContainer/components/LoadingContent/LoadingContent";
import ChrisStore from "../../store/ChrisStore";
import HttpApiCallError from "../../errors/HttpApiCallError";
import Notification from "../Notification";
import "./Plugins.css";

const CATEGORIES = ["FreeSurfer", "MRI", "Segmentation", "copy"];

/**
 * A page showing a list of ChRIS plugins, according to the search
 * specified in the URI's query string.
 */
export class Plugins extends Component {
  constructor(props) {
    super(props);

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get("authToken") };
    this.client = new Client(storeURL, auth);

    const categories = new Map();
    CATEGORIES.forEach((name) => categories.set(name, 0));

    this.state = {
      isOpen: false,
      errorMsg: null,
      starsByPlugin: {},
      selectedCategory: null,
      categories: categories,
    };

    this.onToggle = (isOpen) => {
      this.setState({
        isOpen,
      });
    };
    this.onSelect = (event) => {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    };
  }

  /**
   * Search for plugin data from the backend.
   */
  async componentDidMount() {
    await this.refreshPluginList();
  }

  /**
   * Re-fetch the list of plugins if the input was changed
   * in the NarBar's search bar.
   */
  async componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      await this.refreshPluginList();
    }
  }

  /**
   * Add a star next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin is a favorite).
   *
   * @param pluginId
   * @param star
   */
  setPluginStar(pluginId, star) {
    this.setState({
      starsByPlugin: {
        ...this.state.starsByPlugin,
        [pluginId]: star,
      },
    });
  }

  /**
   * Remove a star from next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin was unfavorited.)
   * @param pluginId
   */
  removePluginStar(pluginId) {
    this.setPluginStar(pluginId, undefined);
  }

  /**
   * Show a notification for some network error.
   * @param error error message
   */
  showNotifications = (error) => {
    console.error(error);
    this.setState({
      errorMsg: error.message,
    });
  };

  /**
   * Mark a plugin as a favorite by showing a star next to it and
   * notifying the backend of this change.
   *
   * @param plugin
   * @return {Promise<void>}
   */
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
      this.showNotifications(new HttpApiCallError(err));
    }
  }

  /**
   * Unfavorite a plugin by removing its star and notifying the backend.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  async unfavPlugin(plugin) {
    const previousStarState = { ...this.state.starsByPlugin[plugin.id] };

    // Early state change for instant visual feedback
    this.removePluginStar(plugin.id);

    try {
      const star = await this.client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (err) {
      this.setPluginStar(plugin.id, previousStarState);
      this.showNotifications(new HttpApiCallError(err));
    }
  }

  /**
   * 1. Fetch the list of plugins based on the search query.
   * 2. Accumulate information about categories.
   * 3. Call setState
   * 4. If user is logged in, get information about their favorite plugins.
   */
  refreshPluginList = async () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("q");
    const searchParams = {
      limit: 20,
      offset: 0,
      name_title_category: name,
    };

    let plugins;

    try {
      plugins = await this.client.getPlugins(searchParams);
    } catch(error) {
      this.showNotifications(new HttpApiCallError(error));
      return;
    }

    // reset category counts
    const categories = this.state.categories;
    for (const name of categories.keys()) {
      categories.set(name, 0);
    }

    // count the frequency of plugins which belong to categories
    for (const { category } of plugins.data) {
      // TODO make category counting case insensitive
      const currentCount = categories.get(category);
      if (currentCount !== undefined) {
        categories.set(category, currentCount + 1);
      }
    }

    // plugin list and category list are available always, even if not logged in
    const nextState = {
      pluginList: plugins.data,
      categories: categories,
    };

    if (this.isLoggedIn()) {
      try {
        const stars = await this.client.getPluginStars();
        const starsByPlugin = {};
        stars.data.forEach((star) => {
          const pluginId = star.meta_id;
          starsByPlugin[pluginId] = star;
        });
        nextState.starsByPlugin = starsByPlugin;
      } catch (error) {
        this.showNotifications(new HttpApiCallError(error));
      }
    }

    // finally update the state once with pluginList, categories, and maybe starsByPlugin
    this.setState(nextState);
  };

  /**
   * Favorite the plugin if it is not a favorite, or remove from favorites if already a favorite.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  togglePluginFavorited(plugin) {
    if (this.isLoggedIn()) {
      if (this.isFavorite(plugin)) {
        this.unfavPlugin(plugin);
      } else {
        this.favPlugin(plugin);
      }
    }
  }

  isFavorite(plugin) {
    return this.state.starsByPlugin[plugin.id] !== undefined;
  }

  isLoggedIn() {
    return this.props.store ? this.props.store.get("isLoggedIn") : false;
  }

  /**
   * Show only plugins which are part of this category.
   *
   * @param name name of category
   */
  handleCategorySelect = (name) => {
    this.setState({ selectedCategory: name });
  };

  render() {
    const { pluginList, categories, selectedCategory, isOpen } = this.state;

    // convert map into the data structure expected by <PluginsCategories />
    const categoryEntries = Array.from(
      categories.entries(),
      ([name, count]) => ({
        name: name,
        length: count,
      })
    );

    // Remove email from author
    const removeEmail = (author) => author.replace(/( ?\(.*\))/g, "");

    let pluginsFound;
    let pluginListBody;

    // Render the pluginList if the plugins have been fetched
    if (pluginList) {
      pluginListBody = pluginList
        .filter((plugin) => {
          if (selectedCategory) {
            return plugin.category === selectedCategory;
          }
          return true;
        })
        .map((plugin) => (
          <PluginItem
            title={plugin.title}
            id={plugin.id}
            name={plugin.name}
            author={removeEmail(plugin.authors)}
            creationDate={plugin.creation_date}
            key={`${plugin.name}-${plugin.id}`}
            isLoggedIn={this.isLoggedIn()}
            isFavorite={this.isFavorite(plugin)}
            onStarClicked={() => this.togglePluginFavorited(plugin)}
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

    const dropdownItems = [
      <DropdownItem key="name" component="button" id="sort-by-dropdown-item">
        Name
      </DropdownItem>,
    ];

    return (
      <div className="plugins-container">
        {this.state.errorMsg && (
          <Notification
            title={this.state.errorMsg}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => this.setState({ errorMsg: null })}
          />
        )}
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            {pluginsFound}
            <Dropdown
              id="sort-by-dropdown"
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={
                <DropdownToggle
                  onToggle={this.onToggle}
                  toggleIndicator={CaretDownIcon}
                  isPrimary
                  id="toggle-id-4"
                >
                  Sort By
                </DropdownToggle>
              }
              isOpen={isOpen}
              dropdownItems={dropdownItems}
            />
          </div>
        </div>
        <div className="row plugins-row">
          <PluginsCategories
            categories={categoryEntries}
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
