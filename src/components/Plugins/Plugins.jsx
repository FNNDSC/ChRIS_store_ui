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
import Notification from '../Notification';

import './Plugins.css';

const CATEGORIES = ['FreeSurfer', 'MRI', 'Segmentation'];

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
      loading: true,
      isSortOpen: false,
      errorMsg: null,
      plugins: new PluginMetaList(),
      paginationLimit: 0,
      paginationOffset: 0,
      categories: categories,
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
   */
  async componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      await this.refreshPluginList();
    }
  }

  /**
   * 1. Fetch the list of plugins based on the search query.
   * 2. Call setState
   * 3. If user is logged in, get information about their favorite plugins.
   */
  async refreshPluginList(search = {}) {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('q');
    const searchParams = {
      limit: 20,
      offset: 0,
      name_title_category: name,
      ...search
    };

    try {
      var plugins = await this.client.getPluginMetas(searchParams);
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
    try {
      var catplugins = await this.client.getPlugins({
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
    for (const { category } of catplugins.data)
      if (category)
        categories.set(
          category, 
          categories.has(category) ?
            categories.get(category) + 1 : 1);

    this.setState({ categories });
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
  showNotifications(error) {
    console.error(error);
    this.setState({
      errorMsg: error.message,
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

  isLoggedIn = () => this.props.store ? this.props.store.get("isLoggedIn") : false;

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
    this.setState({
      isSortOpen: !this.state.isSortOpen
    })
  }

  handleSortingSelect = (sort) => {
    /**
     * @todo sort plugins
     */
    this.handleToggleSort()
  }

  render() {
    const pluginList = new Map()
    for (let plugin of this.state.plugins.data)
      pluginList.set(plugin.name, plugin)

    // convert map into the data structure expected by <PluginsCategories />
    const { categories } = this.state;
    const categoryEntries = Array.from(categories.entries(), ([name, count]) => ({
      name: name, length: count
    }));

    // Remove email from author
    const removeEmail = (authors) => Array.isArray(authors) ? 
      authors.map((author) => author.replace(/( ?\(.*\))/g, "")) 
      : 
      authors.replace(/( ?<.*>)/g, '');

    // Render the pluginList if the plugins have been fetched
    const PluginListBody = () => {
      if (!this.state.loading)
        return [...pluginList.values()]
        .map((plugin, index) => (
          <GridItem lg={6} xs={12} key={`${plugin.name}-${index}`}>
            <PluginItem
              { ...plugin }
              author={removeEmail(plugin.authors)}
              isLoggedIn={this.isLoggedIn()}
              isFavorite={this.isFavorite(plugin)}
              onStarClicked={() => this.togglePluginFavorited(plugin)}
            />
          </GridItem>
        ));
      else
        return new Array(6).fill().map((e, i) => (
          <LoadingPluginItem key={i} />
        ));
    }

    const PaginationControls = () => (
      <div style={{ marginLeft: '1em' }}>
        <Button style={{ marginLeft: '1em' }} 
          variant="secondary" 
          isDisabled={!this.state.plugins.hasPreviousPage}
          onClick={() => {
            this.setState({ loading: true });
            this.refreshPluginList({
              offset: this.state.paginationOffset - this.state.paginationLimit
            })
          }}>
            Previous
        </Button>

        <Button style={{ marginLeft: '1em' }} 
          isDisabled={!this.state.plugins.hasNextPage}
          onClick={() => {
            this.setState({ loading: true });
            this.refreshPluginList({
              offset: this.state.paginationOffset + this.state.paginationLimit
            })
          }}>
            Next
        </Button>
      </div>
    )

    return (
      <Switch>
        <Route path="/plugin/:name" render={(routeProps)=>{
          if (this.state.loading)
            return <LoadingPluginItem />

          window.scrollTo(0,0);
          const { name: query } = routeProps.match.params
          if (pluginList.has(query)) {
            const plugin = pluginList.get(query);
            return <ConnectedPlugin pluginData={plugin} isFavorite={this.isFavorite(plugin)} />
          }
          else
            return <NotFound/>
        }} />

        <Route exact path="/plugins">
          {this.state.errorMsg && (
            <Notification
              title={this.state.errorMsg}
              position='top-right'
              variant='danger'
              closeable
              onClose={()=>this.setState({ errorMsg: null })}
            />
          )}

          <div className="plugins-container">
            <article>
              <Grid className="plugins-row">
                <GridItem xs={12}>
                  <div style={{ padding: '2em' }}>
                    <h1>ChRIS Plugins</h1>
                    <h3>
                      Plugins available on your ChRIS Store are listed here. 
                      Install these to your ChRIS instance to use them. 
                    </h3>
                  </div>
                </GridItem>
                
                <GridItem lg={9} xs={12}>
                  <Grid hasGutter className="plugins-list">
                    <GridItem xs={12}>
                      <Split>
                        <SplitItem>
                          {
                            this.state.loading ? (
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
                                  {this.state.plugins.totalCount} plugins found
                                </p>
                                Showing {this.state.paginationOffset + 1} to {' '}
                                  { 
                                    (this.state.paginationOffset + this.state.paginationLimit > this.state.plugins.totalCount) ? 
                                      this.state.plugins.totalCount
                                      :
                                      (this.state.paginationOffset > 0) ?
                                        this.state.paginationOffset
                                        :
                                        this.state.paginationLimit
                                  }
                              </span>
                            )
                          }
                        </SplitItem>
                        <SplitItem isFilled/>
                        <SplitItem>
                          <Dropdown
                            onSelect={this.handleSortingSelect}
                            isOpen={this.state.isSortOpen}
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
                    selected={this.state.selectedCategory}
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
