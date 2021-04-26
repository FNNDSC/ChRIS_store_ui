import React, { useState, useEffect, useCallback } from "react";
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

const Plugins = ({ store, ...props }) => {
  const [pluginList, setPluginList] = useState(null);
  const [starsByPlugin, setStarsByPlugin] = useState({});
  const [categories, setCategories] = useState([
    {
      name: "Visualization",
      length: 3,
    },
    {
      name: "Modeling",
      length: 11,
    },
    {
      name: "Statistical Operation",
      length: 7,
    },
  ]);
  const storeURL = process.env.REACT_APP_STORE_URL;
  const auth = { token: store.get("authToken") };
  const client = new Client(storeURL, auth);

  useEffect(() => {
    fetchPlugins().catch((err) => {
      console.error(err);
    });

    if (isLoggedIn()) {
      fetchPluginStars();
    }
  }, []);

  const setPluginStar = (pluginId, star) => {
    setStarsByPlugin({
      starsByPlugin: {
        ...starsByPlugin,
        [pluginId]: star,
      },
    });
  };

  const removePluginStar = (pluginId) => {
    setPluginStar(pluginId, undefined);
  };

  const favPlugin = async (plugin) => {
    // Early state change for instant visual feedback
    setPluginStar(plugin.id, {});

    try {
      const star = await client.createPluginStar({ plugin_name: plugin.name });
      setPluginStar(plugin.id, star.data);
    } catch (err) {
      removePluginStar(plugin.id);
      console.error(err);
    }
  };

  const unfavPlugin = async (plugin) => {
    const previousStarState = { ...starsByPlugin[plugin.id] };

    // Early state change for instant visual feedback
    removePluginStar(plugin.id);

    try {
      const star = await client.getPluginStar(previousStarState.id);
      await star.delete();
    } catch (err) {
      setPluginStar(plugin.id, previousStarState);
      console.error(err);
    }
  };

  const fetchPlugins = () => {
    const searchParams = {
      limit: 20,
      offset: 0,
    };

    return new Promise(async (resolve, reject) => {
      let plugins;
      try {
        // add plugins to pluginList as they are received
        plugins = await client.getPlugins(searchParams);
        setPluginList(()=>plugins.data)
        
      } catch (e) {
        return reject(e);
      }

      return resolve(plugins.data);
    });
  };

  const fetchPluginStars = async () => {
    const stars = await client.getPluginStars();

    const starsByPlugin = {};
    stars.data.forEach((star) => {
      const pluginId = star.meta_id;
      starsByPlugin[pluginId] = star;
    });

    setStarsByPlugin({ starsByPlugin });
  };

  const handlePluginFavorited = (plugin) => {
    if (isLoggedIn()) {
      return isFavorite(plugin) ? unfavPlugin(plugin) : favPlugin(plugin);
    }

    return Promise.resolve();
  };

  const isFavorite = (plugin) => {
    return starsByPlugin[plugin.id] !== undefined;
  };

  const isLoggedIn = useCallback(() => {
    return store ? store.get("isLoggedIn") : false;
  });

  // Remove email from author
  const removeEmail = (author) => author.replace(/( ?\(.*\))/g, "");
  
  return (
    <div {...props} className="plugins-container">
      <div className="plugins-stats">
        <div className="row plugins-stats-row">
          {/* Plugins Found */}
          {pluginList ? (
            <span className="plugins-found">
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
          <DropdownButton id="sort-by-dropdown" title="Sort By" pullRight>
            <MenuItem eventKey="1">Name</MenuItem>
          </DropdownButton>
        </div>
      </div>
      <div className="row plugins-row">
        {/* Plugin List */}
        <PluginsCategories categories={categories} />
        <div className="plugins-list">
          {pluginList
            ? pluginList.map((plugin) => (
                <PluginItem
                  title={plugin.title}
                  id={plugin.id}
                  name={plugin.name}
                  author={removeEmail(plugin.authors)}
                  creationDate={plugin.creation_date}
                  key={`${plugin.name}-${plugin.id}`}
                  isLoggedIn={isLoggedIn()}
                  isFavorite={isFavorite(plugin)}
                  onStarClicked={async () => handlePluginFavorited(plugin)}
                />
              ))
            : new Array(6).fill().map((e, i) => (
                <LoadingPluginItem key={i} />
              ))}
        </div>
      </div>
    </div>
  );
};

Plugins.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(Plugins);
