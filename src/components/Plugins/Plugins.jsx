import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
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

import ConnectedPlugin from '../Plugin/Plugin';
import PluginItem from './components/PluginItem/PluginItem';
import LoadingPluginItem from './components/LoadingPluginItem/LoadingPluginItem';
import PluginsCategories from './components/PluginsCategories/PluginsCategories';
import LoadingContainer from '../LoadingContainer/LoadingContainer';
import LoadingContent from '../LoadingContainer/components/LoadingContent/LoadingContent';
import NotFound from '../NotFound/NotFound';

import ChrisStore from '../../store/ChrisStore';
import HttpApiCallError from '../../errors/HttpApiCallError';
import ErrorNotification from '../Notification';
import { removeEmail } from '../../utils/common';

import './Plugins.css';

const CATEGORIES = ['FreeSurfer', 'MRI', 'Segmentation'];

/**
 * A page showing a list of ChRIS plugins, according to the search
 * specified in the URI's query string.
 * 
 * When the user opens /plugins, all plugin metas are fetched, with pagination.
 * so that we already have the data to immediately populate each plugin body.
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
      loading: true,
      isSortOpen: false,
      error: null,
      plugins: new PluginMetaList(),
      paginationLimit: 0,
      paginationOffset: 0,
      categories,
      selectedCategory: null,
      starsByPlugin: {},
    };
  }

  /**
   * Search for plugin data from the backend.
   */
  async componentDidMount() {
    await this.refreshPluginList();
    await this.fetchAllCategories();
  }

  /**
   * Re-fetch the list of plugins if the input was changed 
   * in the NarBar's search bar.
   * @param {*} pluginId 
   * @param {*} star 
   */
  async componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
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
    this.setState((prevState) => ({
      starsByPlugin: {
        ...prevState.starsByPlugin,
        [pluginId]: star,
      },
    }));
  }

  // eslint-disable-next-line react/destructuring-assignment
  isLoggedIn = () => this.props.store ? this.props.store.get("isLoggedIn") : false;

  // eslint-disable-next-line react/destructuring-assignment
  isFavorite = ({ id }) => this.state.starsByPlugin[id] !== undefined;

  /**
   * Show only plugins which are part of this category.
   *
   * @param name name of category
   */
  handleCategorySelect = (category) => {
    this.setState({ loading: true, selectedCategory: category });
    this.refreshPluginList({ category })
  }
  
  handleToggleSort = () => {
    this.setState((prevState) => ({
      isSortOpen: !prevState.isSortOpen 
    }))
  }

  // eslint-disable-next-line no-unused-vars
  handleSortingSelect = (sort) => {
    /**
     * @todo sort plugins
     */
    this.handleToggleSort()
  }

  /**
   * 1. Fetch the list of plugins based on the search query.
   * 2. Call setState
   * 3. If user is logged in, get information about their favorite plugins.
   */
  async refreshPluginList(search = {}) {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('q');
    const { match } = this.props;

    const searchParams = {
      limit: 20,
      offset: 0,
      ...search
    };

    if (name)
      searchParams.name_title_category = name;
    if (match.params.name)
      searchParams.name_exact = match.params.name;

    let plugins;
    try {
      plugins = await this.client.getPluginMetas(searchParams);
    } catch(error) {
      this.showNotifications(new HttpApiCallError(error));
      return;
    }

    // plugin list and category list are available always, even if not logged in
    const nextState = {
      loading: false,
      paginationOffset: searchParams.offset,
      paginationLimit: searchParams.limit,
      plugins
    };

    if (this.isLoggedIn()) {
      try{
        const stars = await this.client.getPluginStars();
        const starsByPlugin = {};
        stars.data.forEach((star) => {
          const pluginId = star.meta_id;
          starsByPlugin[pluginId] = star;
        });
        nextState.starsByPlugin = starsByPlugin;
      } catch(error) {
        this.showNotifications(new HttpApiCallError(error));
      }
    }

    // finally update the state once with pluginList, categories, and maybe starsByPlugin
    this.setState(nextState);
  }

  /**
   * Fetch and accumulate all existing categories from the backend.
   * Temporary, until there is a backend function for this.
   * @returns void
   */
  async fetchAllCategories() {
    let catplugins;
    try {
      catplugins = await this.client.getPlugins({
        limit: 1e6,
        offset: 0,
        name_title_category: null,
      });
    } catch(error) {
      this.showNotifications(new HttpApiCallError(error));
      return;
    }

    const { categories } = this.state;
    // count the frequency of catplugins which belong to categories
    // eslint-disable-next-line no-restricted-syntax
    for (const { category } of catplugins.data)
      if (category)
        categories.set(
          category, 
          categories.has(category) ?
            categories.get(category) + 1 : 1);

    this.setState({ categories });
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
  showNotifications(error) {
    this.setState({
      error: error.message,
    })
  }

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
    // eslint-disable-next-line react/destructuring-assignment
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
   * Favorite the plugin if it is not a favorite, or remove from favorites if already a favorite.
   *
   * @param plugin
   * @return {Promise<void>}
   */
  togglePluginFavorited(plugin) {
    if (this.isLoggedIn()) {
      if (this.isFavorite(plugin)) {
        this.unfavPlugin(plugin);
      }
      else {
        this.favPlugin(plugin);
      }
    }
    else {
      this.showNotifications(new Error('You need to be logged in!'));
    }
  }

  render() {
    // convert map into the data structure expected by <PluginsCategories />
    const { categories, plugins, loading, error } = this.state;
    const { paginationOffset, paginationLimit, isSortOpen, selectedCategory } = this.state;

    const categoryEntries = Array.from(categories.entries(), ([name, count]) => ({
      name, length: count
    }));
    
    const pluginList = new Map()
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins.data) {
      plugin.authors = removeEmail(plugin.authors.split(','))
      pluginList.set(plugin.name, plugin)
    }

    // Render the pluginList if the plugins have been fetched
    const PluginListBody = () => {
      if (!loading)
        return [...pluginList.values()]
        .map((plugin) => (
          <GridItem lg={6} xs={12} key={plugin.name}>
            <PluginItem
              { ...plugin }
              isLoggedIn={this.isLoggedIn()}
              isFavorite={this.isFavorite(plugin)}
              onStarClicked={() => this.togglePluginFavorited(plugin)}
            />
          </GridItem>
        ));
      return new Array(6).fill().map((e, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <LoadingPluginItem key={i} />
        ));
    }

    const PaginationControls = () => (
      <div style={{ marginLeft: '1em' }}>
        <Button style={{ marginLeft: '1em' }} 
          variant="secondary" 
          isDisabled={!plugins.hasPreviousPage}
          onClick={() => {
            this.setState({ loading: true });
            this.refreshPluginList({
              offset: paginationOffset - paginationLimit
            })
          }}>
            Previous
        </Button>

        <Button style={{ marginLeft: '1em' }} 
          isDisabled={!plugins.hasNextPage}
          onClick={() => {
            this.setState({ loading: true });
            this.refreshPluginList({
              offset: paginationOffset + paginationLimit
            })
          }}>
            Next
        </Button>
      </div>
    )

    return (
      <Switch>
        <Route path="/plugin/:name" render={(routeProps) => {
          window.scrollTo(0,0);
          const { name } = routeProps.match.params

          if (loading) return <LoadingPluginItem />

          /**
           * When the user opens this route from `/plugins`, the pluginList Map
           * has the item and we return the ConnectedPlugin.
           * 
           * When the user opens this route directly, the pluginList Map 
           * does not have the item and we we fetch by `name_exact=name`.
           */

          if (pluginList.has(name)) {
            const plugin = pluginList.get(name);
            return <ConnectedPlugin pluginData={plugin} isFavorite={this.isFavorite(plugin)} />
          }
          return <NotFound/>
        }} />

        <Route exact path="/plugins">
          { error && (
            <ErrorNotification
              title={error}
              position='top-right'
              variant='danger'
              closeable
              onClose={()=>this.setState({ error: null })}
            />
          )}

          <div className="plugins-container">
            <article>
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
                              <span style={{ color: 'gray', fontSize: '1.5em', margin: '1em 0'}}>
                                <p style={{ fontSize: '1.25em', margin: '0', color: 'black', fontWeight: '600' }}>
                                  {plugins.totalCount} plugins found
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
                        <SplitItem isFilled/>
                        <SplitItem>
                          <Dropdown
                            onSelect={this.handleSortingSelect}
                            isOpen={isSortOpen}
                            toggle={
                              <DropdownToggle id="toggle-id" 
                                onToggle={this.handleToggleSort} 
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
                      <SplitItem isFilled/>
                      <SplitItem>
                        <PaginationControls />
                      </SplitItem>
                    </Split>
                  </Grid>
                </GridItem>

                <GridItem lg={3} xs={12}>
                  <PluginsCategories 
                    categories={categoryEntries}
                    onSelect={this.handleCategorySelect}
                    selected={selectedCategory}
                  />
                </GridItem>
              </Grid>
            </article>
          </div>
        </Route>
      </Switch>
    );
  }
}

Plugins.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ChrisStore.withStore(Plugins);
