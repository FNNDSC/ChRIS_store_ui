import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Client from '@fnndsc/chrisstoreapi';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Grid, GridItem } from '@patternfly/react-core'
import { Split, SplitItem } from '@patternfly/react-core';

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

const CATEGORIES = ['FreeSurfer', 'MRI', 'Segmentation', 'copy'];

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
      pluginList: [],
      errorMsg: null,
      starsByPlugin: {},
      selectedCategory: null,
      categories: categories
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
   * 1. Fetch the list of plugins based on the search query.
   * 2. Accumulate information about categories.
   * 3. Call setState
   * 4. If user is logged in, get information about their favorite plugins.
   */
  refreshPluginList = async () => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('q');
    const searchParams = {
      limit: 10e3,
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
      loading: false,
      pluginList: plugins.data,
      categories: categories
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
    this.setState({selectedCategory: name});
  }

  render() {
    // pluginList accumulate versions
    const pluginVersions = new Map();
    for (let plugin of this.state.pluginList) {
      if (pluginVersions.has(plugin.name)) {
        let existing = pluginVersions.get(plugin.name);
        existing.versions[plugin.version] = plugin;
        pluginVersions.set(plugin.name, existing);
      } else {
        pluginVersions.set(plugin.name, {
          ...plugin,
          versions: {
            [plugin.version]: plugin
          }
        });
      }
    }
    /**
     * @todo accumulation
     */

    // convert map into the data structure expected by <PluginsCategories />
    const { categories, selectedCategory } = this.state;
    const categoryEntries = Array.from(categories.entries(), ([name, count]) => ({
      name: name, length: count
    }));

    // Remove email from author
    const removeEmail = (authors) => Array.isArray(authors) ? 
      authors.map((author) => author.replace(/( ?\(.*\))/g, "")) 
      : 
      authors.replace(/( ?<.*>)/g, '');

    let pluginsFound;
    let pluginListBody;

    function filterMap(map, condition) {
      let result = new Map();
      for (let [k, v] of map)
        if (condition(k,v))
          result.set(k, v);
          
      return result;
    }

    // Render the pluginList if the plugins have been fetched
    if (!this.state.loading) {
      pluginListBody = [...filterMap(pluginVersions, (_, { category }) => {
          if (selectedCategory)
            return category === selectedCategory;
          return true;
        })
        .values()]
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

      pluginsFound = (
        <span style={{
          fontSize: '1.5em',
          fontWeight: '600',
        }}>
          {pluginListBody.length} plugins found
        </span>
      );
    }
    else {
      // Or else show the loading placeholders
      pluginListBody = new Array(6).fill().map((e, i) => (
        <LoadingPluginItem key={i} />
      ));
      
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
    }

    return (
      <Switch>
        <Route path="/plugin/:name" render={(routeProps)=>{
          if (this.state.loading)
            return <LoadingPluginItem />

          const { name: query } = routeProps.match.params
          if (pluginVersions.has(query))
            return <ConnectedPlugin pluginData={pluginVersions.get(query)} />
          else
            return <NotFound/>
        }} />

        <Route path="/plugin/:name/:version" render={(routeProps)=>{
          if (this.state.loading)
            return <LoadingPluginItem />

          const { name: query, version } = routeProps.match.params
          if (pluginVersions.has(query)) {
            let versionList = pluginVersions.get(query).versions
            if (versionList.hasOwnProperty(version))
              return <ConnectedPlugin pluginData={versionList[version]} />
            else
              return <NotFound/>
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
            <article style={{ maxWidth: '1200px', margin: 'auto' }}>
              <Grid className="plugins-row">
                <GridItem xs={12}>
                  <div style={{ padding: '2em' }}>
                    <h1>ChRIS Plugins List</h1>
                  </div>
                </GridItem>

                <GridItem lg={3} xs={12}>
                  <PluginsCategories categories={categoryEntries}
                    onSelect={this.handleCategorySelect}
                  />
                </GridItem>
                
                <GridItem lg={9} xs={12}>
                  <Grid hasGutter className="plugins-list">
                    <GridItem xs={12}>
                      <Split>
                        <SplitItem>{pluginsFound}</SplitItem>
                        <SplitItem isFilled/>
                        <SplitItem>
                          <DropdownButton id="sort-by-dropdown" title="Sort By" pullRight>
                            <MenuItem eventKey="1">Name</MenuItem>
                          </DropdownButton>
                        </SplitItem>
                      </Split>
                    </GridItem>

                    {pluginListBody}
                  </Grid>
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
