import React, { useState, useEffect } from "react";
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
import styles from './Plugins.module.css';

const CATEGORIES = ["FreeSurfer", "MRI", "Segmentation", "copy"];
const storeURL = process.env.REACT_APP_STORE_URL;

const Plugins = ({ location, store, ...props }) => {
  const auth = { token: store.get("authToken") };
  const Categories = new Map();
  CATEGORIES.forEach((name) => Categories.set(name, 0));

  const client = new Client(storeURL, auth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [starsByPlugin, setStarsByPlugin] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState(Categories);
  const [pluginList, setPluginList] = useState([]);
  const [isOpen, setIsOpen] = useState(false)

  const onToggle = (isOpen) => {
    setIsOpen(isOpen)
  }

  const onSelect = (event) => {
    setIsOpen(!isOpen)
  }

  const isLoggedIn = () => {
    return store ? store.get("isLoggedIn") : false;
  };

  /**
   * 1. Fetch the list of plugins based on the search query.
   * 2. Accumulate information about categories.
   * 3. Call setState
   * 4. If user is logged in, get information about their favorite plugins.
   */
  const refreshPluginList = async () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("q");
    const searchParams = {
      limit: 20,
      offset: 0,
      name_title_category: name,
    };

    let plugins;
    try {
      plugins = await client.getPlugins(searchParams);
    } catch (error) {
      showNotifications(new HttpApiCallError(error));
      return;
    }

    // reset category counts
    for (const name of categories.keys()) {
      categories.set(name, 0);
    }

    // count the frequency of plugins which belongs to categories
    for (const { category } of plugins.data) {
      // TODO make category counting case insensitive
      const currentCount = categories.get(category);
      if (currentCount !== undefined) {
        categories.set(category, currentCount + 1);
      }
    }

    setCategories(categories);
    setPluginList(plugins.data);


    if (isLoggedIn()) {
      try {
        const stars = await client.getPluginStars();
        const starsByPlugin = {};
        stars.data.forEach((star) => {
          const pluginId = star.meta_id;
          starsByPlugin[pluginId] = star;
        });
        setStarsByPlugin(starsByPlugin);
      } catch (error) {
        showNotifications(new HttpApiCallError(error));
      }
    }
  };

  useEffect(() => {
    refreshPluginList();
  }, [location]);

  /**
   * Add a star next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin is a favorite).
   *
   * @param pluginId
   * @param star
   */
  const setPluginStar = (pluginId, star) => {
    setStarsByPlugin({ ...starsByPlugin, [pluginId]: star });
  };

  /**
   * Remove a star from next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin was unfavorited.)
   * @param pluginId
   */
  const removePluginStar = (pluginId) => {
    setPluginStar(pluginId, undefined);
  };

  /**
   * Mark a plugin as a favorite by showing a star next to it and
   * notifying the backend of this change.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  const favPlugin = async (plugin) => {
    // Early state change for instant visual feedback
    setPluginStar(plugin.id, {});

    try {
      const star = await client.createPluginStar({
        plugin_name: plugin.name,
      });
      setPluginStar(plugin.id, star.data);
    } catch (err) {
      removePluginStar(plugin.id);
      showNotifications(new HttpApiCallError(err));
    }
  };

  /**
   * Unfavorite a plugin by removing its star and notifying the backend.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  const unfavPlugin = async (plugin) => {
    const previousStarState = { ...starsByPlugin[plugin.id] };

    // Early state change for instant visual feedback
    removePluginStar(plugin.id);

    try {
      const star = await client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (err) {
      setPluginStar(plugin.id, previousStarState);
      showNotifications(new HttpApiCallError(err));
    }
  };

  /**
   * Favorite the plugin if it is not a favorite, or remove from favorites if already a favorite.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  const togglePluginFavorited = (plugin) => {
    if (isLoggedIn()) {
      if (isFavorite()) {
        unfavPlugin(plugin);
      } else {
        favPlugin(plugin);
      }
    }
  };

  const isFavorite = (plugin) => {
    return starsByPlugin[plugin.id] !== undefined;
  };

  /**
   * Show only plugins which are part of this category.
   *
   * @param name name of category
   */
  const handleCategorySelect = (name) => {
    setSelectedCategory(name);
  };

  // convert map into the data structure expected by <PluginsCategories />
  const categoryEntries = Array.from(categories.entries(), ([name, count]) => ({
    name,
    length: count,
  }));

  /**
   * Show a notification for some network error.
   * @param error error message
   */
  const showNotifications = (error) => {
    console.error(error);
    setErrorMsg(error.message);
  };

  const removeEmail = (author) => author.replace(/( ?\(.*\))/g, "");

    const dropdownItems = [
      <DropdownItem key="name" component="button">
        Name
      </DropdownItem>,
    ];

    return (
      <div {...props}>
      <div className={styles['plugins-container']}>
        {errorMsg && (
          <Notification
            title={errorMsg}
            position="top-right"
            variant="danger"
            closeable
            onClose={() => setErrorMsg({ errorMsg: null })}
          />
        )}
        <div className={styles['plugins-stats']}>
        <div className={`row ${styles['plugins-stats-row']}`}>
            {/* Plugins Found */}
            {pluginList ? (
              <span className={styles['plugins-found']}>
                {pluginList.length} plugins found
              </span>
            ) : (
              <LoadingContainer>
                <LoadingContent
                  width="135px"
                  height="30px"
                  left="1em"
                  top="1.5em"
                  bottom="1.5em"
                />
              </LoadingContainer>
            )}
            <Dropdown
            className={`${styles['sort-by-dropdown']} btn-group`}
              onSelect={onSelect}
              position={DropdownPosition.right}
              toggle={
                <DropdownToggle
                  onToggle={onToggle}
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
        <div className={`row ${styles['plugins-row']}`}>
          <PluginsCategories
            categories={categoryEntries}
            onSelect={handleCategorySelect}
          />
          <div className={styles['plugins-list']}>
            {/* Plugin List Body*/}
            {pluginList
              ? pluginList
                  .filter((plugin) => {
                    if (selectedCategory) {
                      return plugin.category === selectedCategory;
                    }
                    return true;
                  })
                  .map((plugin) => (
                    <PluginItem
                      pluginTitle={plugin.title}
                      pluginId={plugin.id}
                      name={plugin.name}
                      author={removeEmail(plugin.authors)}
                      creationDate={plugin.creation_date}
                      key={`${plugin.name}-${plugin.id}`}
                      isLoggedIn={isLoggedIn()}
                      isFavorite={isFavorite(plugin)}
                      onStarClicked={() => togglePluginFavorited(plugin)}
                    />
                  ))
              : new Array(6)
                  .fill()
                  .map((e, i) => <LoadingPluginItem key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

Plugins.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(Plugins);
