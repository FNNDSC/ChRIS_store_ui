import React, { useEffect, useState } from 'react';
import { Badge, Grid, GridItem, Split, SplitItem, Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import Client, { Plugin } from '@fnndsc/chrisstoreapi';

import LoadingPlugin from './components/LoadingPlugin/LoadingPlugin';
import PluginBody from './components/PluginBody/PluginBody';
import RelativeDate from '../RelativeDate/RelativeDate';
import ChrisStore from '../../store/ChrisStore';
import PluginImg from '../../assets/img/brainy-pointer.png';
import NotFound from '../NotFound/NotFound';
import ErrorNotification from '../Notification';
import HttpApiCallError from '../../errors/HttpApiCallError';

import './Plugin.css';

/**
 * View a plugin by plugin ID.
 */
const PluginView = (props) => {
const [state, setState] = useState({
  pluginData: undefined,
  star: undefined,
  loading: true,
  errors: [],
})

    const { match, store } = props
    const { loading, pluginData: plugin, errors, star } = state;

    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: store.get('authToken') };
    const client = new Client(storeURL, auth);

const showNotifications = (error) => {
    setState((prev) => ({
      errors: [...prev.errors, error]
    }));
  }

const isFavorite = () => star !== undefined;

const isLoggedIn = () => store ? store.get('isLoggedIn') : false;

const favPlugin = async () => {
    const { pluginData } = state;
    // Early state change for instant visual feedback
    pluginData.stars += 1;
    setState({ star: {}, pluginData });

    try {
      const createdStar = await client.createPluginStar({ plugin_name: pluginData.name });
      setState({ star: createdStar.data });
    } catch (error) {
      showNotifications(new HttpApiCallError(error));
      pluginData.stars -= 1;
      setState({ star: undefined, pluginData });
    }
  }

const unfavPlugin = async () => {
    const { pluginData, star: previousStarState } = state;

    // Early state change for instant visual feedback
    pluginData.stars -= 1;
    setState({ star: undefined, pluginData });

    try {
      await (
        await client.getPluginStar(previousStarState.id)
      ).delete();
    } catch (error) {
      pluginData.stars += 1;
      setState({ star: previousStarState, pluginData });
      showNotifications(new HttpApiCallError(error));
    }
  }

  const onStarClicked = () => {
    if (isLoggedIn()) {
      if (isFavorite())
        unfavPlugin();
      else
        favPlugin();
    }
    else
      showNotifications(new Error('Login required to favorite this plugin.'))
  }

// const renderStar = () => {
//     let name;
//     let className;

//     if (isLoggedIn()) {
//       className = isFavorite() ? 'plugin-star-favorite' : 'plugin-star';
//       name = isFavorite() ? 'star' : 'star-o';
//     } else {
//       className = 'plugin-star-disabled';
//       name = 'star-o';
//     }
//     return <StarIcon name={name} className={className} onClick={() => onStarClicked()} />;
//   }

  /**
   * Fetch a plugin by ID
   * @param {string} pluginId 
   * @returns {Promise} Plugin
   */
const fetchPlugin = async (pluginId) => client.getPlugin(parseInt(pluginId, 10));

  /**
   * Fetch all versions of a plugin by name.
   * @param {string} name Plugin name
   * @returns Promise => void
   */
const fetchPluginVersions = async (name) => {
    const versions = await client.getPlugins({ limit: 10e6, name_exact: name });
    const firstplg = await client.getPlugin(parseInt(versions.data[0].id, 10));
    return [
      { ...versions.data[0], url: firstplg.url },
      ...versions.data.slice(1)
    ]
  }

const fetchIsPluginStarred = async ({ name }) => {
    const response = await client.getPluginStars({ plugin_name: name });
    if (response.data.length > 0)
      return response.data[0];
    return undefined;
  }

      /**
   * Fetch a plugin by ID, from URL params.
   * Then fetch other plugins which have the same name as versions.
   * Set stars if user is logged in.
   */
useEffect(() => {
  const { pluginId } = match.params;
  const fetchData = async() => {
  try {
    const fetchedPlugin = await fetchPlugin(pluginId);
    const versions = await fetchPluginVersions(fetchedPlugin.data.name);

    // eslint-disable-next-line no-shadow
    let star;
    if (isLoggedIn())
      star = await fetchIsPluginStarred(plugin.data);

    setState({
      loading: false,
      pluginData: {
        ...plugin.data,
        url: plugin.url,
        versions
      },
      star,
    });
  } catch (error) {
    setState((prev) => ({
      loading: false,
      errors: [...prev.errors, error]
    }));
  }
}
fetchData()
})
    if (!loading && !plugin)
      return <NotFound />

    let container;
    if (plugin) {
      container = (
        <article>
          <section>
            <Grid hasGutter>
              <GridItem style={{ marginRight: '2em' }} lg={2} xs={12}>
                <img
                  className="plugin-icon"
                  src={PluginImg}
                  alt="Plugin icon"
                />
              </GridItem>

              <GridItem lg={10} xs={12}>
                <Grid>
                  <GridItem lg={10} xs={12}>
                    <h3 className="plugin-name">{plugin.name} <Badge>{plugin.category}</Badge></h3>
                    <h2 className="plugin-title">{plugin.title}</h2>
                  </GridItem>

                  <GridItem lg={2} xs={12} className="plugin-stats">
                    <Split>
                      <SplitItem isFilled />
                      <SplitItem>
                        {
                          !isFavorite() ?
                            <Button onClick={() => onStarClicked()}>
                              Favorite <Badge isRead><StarIcon /> {plugin.stars}</Badge>
                            </Button>
                            :
                            <Button variant="secondary" onClick={() => onStarClicked()}>
                              Unfavorite <Badge><StarIcon /> {plugin.stars}</Badge>
                            </Button>
                        }
                      </SplitItem>
                    </Split>
                  </GridItem>

                  <GridItem>
                    <p>{plugin.description}</p>
                    <p style={{ color: "gray" }}>
                      {
                        RelativeDate.isValid(plugin.modification_date) ?
                          `Updated ${new RelativeDate(plugin.modification_date).format()}`
                          :
                          `Created ${new RelativeDate(plugin.creation_date).format()}`
                      }
                    </p>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
          </section>

          <section>
            <PluginBody pluginData={plugin} />
          </section>
        </article>
      );
    } else {
      container = (
        <article>
          <LoadingPlugin />
        </article>
      );
    }

    return (
      <>
        {
          errors.map((message, index) => (
            <ErrorNotification
              key={`notif-${message}`}
              title={message}
              position='top-right'
              variant='danger'
              closeable
              onClose={() => {
                errors.splice(index)
                setState({ errors })
              }}
            />
          ))
        }
        <div className="plugin">
          {container}
        </div>
      </>

    );
  }


Plugin.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

Plugin.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(PluginView);
