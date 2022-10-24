import React, { useEffect, useState } from 'react';
import { Badge, Grid, GridItem, Split, SplitItem, Button } from '@patternfly/react-core';
import { StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import Client, { PluginMeta } from '@fnndsc/chrisstoreapi';

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
 * View a plugin meta by plugin name.
 *
 * @todo
 * Make this view visually different
 * from the plugin view by ID.
 */
const PluginMetaView = (props) => {
    const [state, setState] = useState({
      pluginData: undefined,
      star: undefined,
      loading: true,
      errors: [],
    });

    const { match, store } = props
    const { star, pluginData, loading, pluginData: plugin, errors } = state

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
    // Early state change for instant visual feedback
    pluginData.stars += 1;
    setState({ star: {}, pluginData });

    try {
      const createStar = await client.createPluginStar({ plugin_name: pluginData.name });
      setState({ star: createStar.data });
    } catch (error) {
      showNotifications(new HttpApiCallError(error));
      pluginData.stars -= 1;
      setState({ star: undefined, pluginData });
    }
  }

const unfavPlugin = async () => {
    const { star: previousStarState } = state;

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

  /**
   * Fetch a plugin meta by plugin name.
   * @param {string} pluginName
   * @returns {Promise<PluginMeta>} PluginMeta
   */
const fetchPluginMeta = async (pluginName) => {
    const metas = await client.getPluginMetas({ name_exact: pluginName, limit: 1 });
    return metas.getItems().shift();
  }

  /**
   * Fetch all versions of a plugin.
   * @param {PluginMeta} pluginMeta
   * @returns {Promise<any[]>} Versions of the plugin
   */
  const fetchPluginVersions = async (pluginMeta) => {
    const versions = (await pluginMeta.getPlugins()).getItems();
    return versions.map(({ data, url }) => ({ ...data, url }));
  }

  /**
  * Fetch all versions of a plugin.
  * @param {PluginMeta} pluginMeta
  * @returns {Promise<any[]>} Collaborators of the plugin
  */
  const fetchPluginCollaborators = async (pluginMeta) => {
    const collaborators = (await pluginMeta.getCollaborators()).getItems();
    return collaborators.map((collaborator, index) => collaborators[index].data);
  }


const fetchIsPluginStarred = async({ name }) => {
    const response = await client.getPluginStars({ plugin_name: name });
    if (response.data.length > 0)
      return response.data[0];
    return undefined;
  }

    /**
   * Fetch a plugin meta by name, from URL params.
   * Then fetch all versions of that plugin.
   * Set stars if user is logged in.
   */
useEffect(() => {
  const fetchData = async () => {
  const { pluginName } = match.params;
    try {
      const pluginMeta = await fetchPluginMeta(pluginName);
      const versions = await fetchPluginVersions(pluginMeta);
      const collaborators = await fetchPluginCollaborators(pluginMeta);
      let fetchedStar;
      if (isLoggedIn())
      fetchedStar = await fetchIsPluginStarred(pluginMeta.data);

      setState({
        loading: false,
        star: fetchedStar,
        pluginData: {
          ...pluginMeta.data,
          versions,
          collaborators,
        }
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
        { errors &&
          errors.map((error, index) => (
            <ErrorNotification
              key={`notif-${error.message}`}
              title="Error"
              message={error.message}
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

PluginMeta.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

PluginMeta.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(PluginMetaView);
