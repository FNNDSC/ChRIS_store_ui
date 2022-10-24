import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Client, { PluginMetaList } from '@fnndsc/chrisstoreapi';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Button,
  Grid,
  GridItem,
  Split,
  SplitItem
} from "@patternfly/react-core";
import { CaretDownIcon } from '@patternfly/react-icons';

import PluginItem from './components/PluginItem/PluginItem';
import LoadingPluginItem from './components/LoadingPluginItem/LoadingPluginItem';
import PluginsCategories from './components/PluginsCategories/PluginsCategories';
import LoadingContainer from '../LoadingContainer/LoadingContainer';
import LoadingContent from '../LoadingContainer/components/LoadingContent/LoadingContent';

import ChrisStore from '../../store/ChrisStore';
import HttpApiCallError from '../../errors/HttpApiCallError';
import ErrorNotification from '../Notification';
import { removeEmail } from '../../utils/common';

import './Plugins.css';

/**
 * A page showing a list of ChRIS plugins.
 * If search is specified in the URI's query string, plugins which
 * match the query in the name, title or category are fetched.
 */
const Plugins = (props) => {

    const { store, match} = props

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get("authToken") };
    const client = new Client(storeURL, auth);

    const [plugins, setPlugins] = useState(new PluginMetaList())
    const [categories, setCategories] = useState(new Map())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [paginationLimit, setPaginationLimit] = useState(0)
    const [paginationOffset, setPaginationOffset] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [starsByPlugin, setStarsByPlugin] = useState({})

    const isLoggedIn = () => store ? store.get("isLoggedIn") : false;

    const isFavorite = ({ id }) => starsByPlugin[id] !== undefined;
  
    /**
   * Show a notification for some network error.
   * @param error error message
   */
  const showNotifications = (err) => {
    setError(err.message)
  }

  /**
   * 1. Fetch the list of plugins based on the url path OR search query.
   * 2. If user is logged in, get information about their favorite plugins.
   * 3. Call setState
   */
const refreshPluginList = async (search = {}) => {
  const params = new URLSearchParams(window.location.search)
  const query = params.get('q');

  const searchParams = {
    limit: 20,
    offset: 0,
    ...search
  };

  /**
   * When the user opens this route from `/plugins`, the pluginList Map
   * has the item and we return the ConnectedPlugin in `render()` below.
   * 
   * When the user opens this route directly, the pluginList Map 
   * does not have the item and we we fetch by `name_exact=name`.
   */
  if (match.params.name)
    searchParams.name_exact = match.params.name;
  /**
   * When URL contains query-param "q=<something>", `query` is not undefined
   * and we search by `query`.
   */
  else if (query)
    searchParams.name_title_category = query;

  let pluginsMeta;
  try {
    pluginsMeta = await client.getPluginMetas(searchParams);
  } catch (err) {
    showNotifications(new HttpApiCallError(err));
    return;
  }

// plugin list and category list are available always, even if not logged in
const nextState = {
  loading: false,
  paginationOffset: searchParams.offset,
  paginationLimit: searchParams.limit,
  // plugins: pluginsMeta
};

  if (isLoggedIn()) {
    try {
      const stars = await client.getPluginStars();
      stars.data.forEach((star) => {
        const pluginId = star.meta_id;
        starsByPlugin[pluginId] = star;
      });
      nextState.starsByPlugin = starsByPlugin;
    } catch (err) {
      showNotifications(new HttpApiCallError(err));
    }
  }

  // finally update the state once with pluginList, categories, and maybe starsByPlugin
  setLoading(false)
  setPaginationOffset(searchParams.offset)
  setPaginationLimit(searchParams.limit)
  setPlugins(pluginsMeta)
}

  /**
   * Fetch and accumulate all existing categories from the backend.
   * Temporary, until there is a backend function for this.
   * @returns void
   */
   const fetchAllCategories = async () => {
    const CATEGORIES = ['FreeSurfer', 'MRI', 'Segmentation'];

    const categoriesMap = new Map()
    CATEGORIES.forEach((name) => categoriesMap.set(name, 0));
    let pluginCategories;
    try {
      pluginCategories = await client.getPlugins({
        limit: 1e6,
        offset: 0,
        name_title_category: null,
      });
    } catch (err) {
      showNotifications(new HttpApiCallError(err));
      return;
    }
    // count the frequency of pluginCategories which belong to categories
    // eslint-disable-next-line no-restricted-syntax
    for (const { category } of pluginCategories.data)
      if (category)
        categoriesMap.set(
          category,
          categoriesMap.has(category) ?
            categoriesMap.get(category) + 1 : 1);
    setCategories(categoriesMap)
  }

  /**
   * Fetch list of plugin metas, if search is specified then
   * use query to filter results.
   * Fetch all plugins to build a list of categories. This can be
   * disabled to just have a list of pre-set hardcoded categories.
   */
useEffect(() => {
  const fetchData = async() => {
    await refreshPluginList()
    await fetchAllCategories();
  }
  return fetchData()
  })

  /**
   * Add a star next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin is a favorite).
   *
   * @param {number} pluginId
   * @param star
   */
const setPluginStar = (pluginId, star) => {
    setStarsByPlugin((prevState) => ({
      starsByPlugin: {
        ...prevState.starsByPlugin,
        [pluginId]: star,
      },
    }));
  }

  /**
   * Show only plugins which are part of this category.
   *
   * @param name name of category
   */
const handleCategorySelect = (category) => {
  setLoading(true)
  setSelectedCategory(category)
  refreshPluginList({ category })
  }

const handleToggleSort = () => {
  setIsSortOpen((prevState) => ({
      isSortOpen: !prevState.isSortOpen
    }))
  }


  const handleSortingSelect = () => {
    /**
     * @todo sort plugins
     */
    handleToggleSort()
  }

  /**
   * Remove a star from next to the plugin visually.
   * (Does not necessarily send to the backend that the plugin was unfavorited.)
   * @param pluginId
   */
const removePluginStar = (pluginId) => {
    setPluginStar(pluginId, undefined);
  }

  /**
   * Mark a plugin as a favorite by showing a star next to it and
   * notifying the backend of this change.
   *
   * @param plugin
   * @return {Promise<void>}
   */
const favPlugin= async (plugin) => {
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
  }

  /**
   * Unfavorite a plugin by removing its star and notifying the backend.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  const unfavPlugin = async (plugin) =>{
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
  }

  /**
   * Favorite the plugin if it is not a favorite, or remove from favorites if already a favorite.
   *
   * @param plugin
   * @return {Promise<void>}
   */
const togglePluginFavorited = (plugin) => {
    if (isLoggedIn()) {
      if (isFavorite(plugin)) {
        unfavPlugin(plugin);
      }
      else {
        favPlugin(plugin);
      }
    }
    else {
      showNotifications(new Error('Login required to favorite this plugin.'));
    }
  }


    // convert map into the data structure expected by <PluginsCategories />
    const categoryEntries = categories ? Array.from(categories.entries(), ([name, count]) => ({
      name, length: count
    })) : [];

    const pluginList = new Map()
    if (plugins) {
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins.data) {
      plugin.authors = removeEmail(plugin.authors.split(','))
      pluginList.set(plugin.name, plugin)
    }
  }

    // Render the pluginList if the plugins have been fetched
    const PluginListBody = () => {
      if (!loading)
        return [...pluginList.values()]
          .map((plugin) => (
            <GridItem lg={6} xs={12} key={plugin.name}>
              <PluginItem
                {...plugin}
                isLoggedIn={isLoggedIn()}
                isFavorite={isFavorite(plugin)}
                onStarClicked={() => togglePluginFavorited(plugin)}
              />
            </GridItem>
          ));
      if (loading)
            return <p>loading</p>
      return new Array(6).fill().map((e, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <LoadingPluginItem key={i} />
      ));
    }
  

    const PaginationControls = () => (
      <div style={{ marginLeft: '1em' }}>
        <Button style={{ marginLeft: '1em' }}
          variant="secondary"
          isDisabled={!plugins || !plugins.hasPreviousPage}
          onClick={() => {
            setLoading(true);
            refreshPluginList({
              offset: paginationOffset - paginationLimit
            })
          }}>
          Previous
        </Button>

        <Button style={{ marginLeft: '1em' }}
          isDisabled={!plugins || !plugins.hasNextPage}
          onClick={() => {
            setLoading(true);
            refreshPluginList({
              offset: paginationOffset + paginationLimit
            })
          }}>
          Next
        </Button>
      </div>
    )
  
   
    const pluginsCount= plugins.totalCount <= 0 ? 0 : plugins.totalCount

    return (
      <article>
        {error && (
          <ErrorNotification
            title={error}
            position='top-right'
            variant='danger'
            closeable
            onClose={() => setError(null)}
          />
        )}

        <div className="plugins-container">
          <Grid className="plugins-row">
            <GridItem xs={12} id="plugins-header">
              <div style={{ padding: '2em' }}>
                <h1>ChRIS Plugins</h1>
                <h3 style={{ color: "darkgray" }}>
                  Plugins available on this ChRIS Store are listed here. <br />
                  <b>Install these to your ChRIS instance to use them. </b>
                </h3>
              </div>
            </GridItem>

            <GridItem lg={9} xs={12}>
              <Grid hasGutter className="plugins-list">
                <GridItem xs={12}>
                  <Split>
                    <SplitItem>
                      {
                        loading ? (
                          <LoadingContainer>
                            <LoadingContent
                              width="135px"
                              height="30px"
                              left="1em"
                              top="1.5em"
                              bottom="1.5em"
                            />
                          </LoadingContainer>
                        ) : (
                          <span style={{ color: 'gray', fontSize: '1.5em', margin: '1em 0' }}>
                            <p style={{ fontSize: '1.25em', margin: '0', color: 'black', fontWeight: '600' }}>
                                {pluginsCount} 
                                plugins found
                            </p>
                            Showing {paginationOffset + 1} to {' '}
                            {
                              // eslint-disable-next-line no-nested-ternary
                              (paginationOffset + paginationLimit > plugins.totalCount) ?
                                plugins.totalCount
                                :
                                (paginationOffset > 0) ?
                                  paginationOffset
                                  :
                                  paginationLimit
                            }
                          </span>
                        )
                      }
                    </SplitItem>
                    <SplitItem isFilled />
                    <SplitItem>
                      <Dropdown
                        onSelect={() => handleSortingSelect()}
                        isOpen={isSortOpen}
                        toggle={
                          <DropdownToggle id="toggle-id"
                            onToggle={() => handleToggleSort()}
                            toggleIndicator={CaretDownIcon}>
                            Sort by
                          </DropdownToggle>
                        }
                        dropdownItems={[
                          <DropdownItem key="name">Name</DropdownItem>
                        ]}
                      />
                    </SplitItem>
                    <SplitItem>
                      <PaginationControls />
                    </SplitItem>
                  </Split>
                </GridItem>

                <PluginListBody />

                <Split>
                  <SplitItem isFilled />
                  <SplitItem>
                    <PaginationControls />
                  </SplitItem>
                </Split>
              </Grid>
            </GridItem>

            <GridItem lg={3} xs={12}>
              <PluginsCategories
                categories={categoryEntries}
                onSelect={() => handleCategorySelect()}
                selected={selectedCategory}
              />
            </GridItem>
          </Grid>
        </div>
      </article>
    );
  }


Plugins.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(Plugins);


