/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  CardBody,
  Card,
  Grid,
  GridItem,
  CardFooter,
  Button,
} from '@patternfly/react-core';
import Client from '@fnndsc/chrisstoreapi';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ChrisStore from '../../../../store/ChrisStore';
import './DashCollaboratorView.css';
import UserTable from './DashTeamView';

class DashCollaboratorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      errors: [],

    };
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);

  }

  async componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginName } = this.props.match.params;
    try {
      const pluginMeta = await this.fetchPluginMeta(pluginName);
      const collaboratorList = await this.fetchPluginCollaborators(pluginMeta);


      this.setState({
        collaborators: [...collaboratorList]

      });
    } catch (error) {
      this.setState((prev) => ({
        loading: false,
        errors: [...prev.errors, error]
      }));
    }
  }

  showNotifications = (error) => {
    this.setState((prev) => ({
      errors: [...prev.errors, error]
    }));
  }
  // eslint-disable-next-line react/destructuring-assignment

  /**
    * Fetch all versions of a plugin.
    * @param {PluginMeta} pluginMeta
    * @returns {Promise<any[]>} Collaborators of the plugin
    */
  // eslint-disable-next-line class-methods-use-this
  async fetchPluginMeta(pluginName) {

    const metas = await this.client.getPluginMetas({ name_exact: pluginName, limit: 1 });
    return metas.getItems().shift();

  }

  // eslint-disable-next-line class-methods-use-this
  async fetchPluginCollaborators(pluginMeta) {
    const collabitems = (await pluginMeta.getCollaborators()).getItems();
    const collablist = await collabitems.map((collaborator, index) => collabitems[index].data)
    const collaboratorlist = await collablist.map((collaborator, index) => collabitems[index])
    return Array.from(collaboratorlist.values())

      ;
  }

  render() {

    const { collaborators, errors } = this.state;


    return (
      <>
        {
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
                this.setState({ errors })
              }}
            />
          ))
        }
        <Grid>
          <GridItem sm={12}>

            <Card>
              <CardBody>
                <h3>Collaborators</h3>
                <div>
                  <Button variant="primary" className="card-view-add-collaborator">
                    <PlusCircleIcon type="pf" style={{ margin: '0 1em 0 0' }} />
                    <span>Add Collaborator</span>
                  </Button>
                  <h4> Use this area, to add and manage collaborators to help you
                    with this plugin.</h4>

                </div>



                <UserTable collaborators={collaborators} />
              </CardBody>
              <CardFooter className="card-footer">

              </CardFooter>


            </Card>


          </GridItem>

        </Grid>
      </>

    );
  }
}
DashCollaboratorView.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  collaborators: PropTypes.arrayOf(PropTypes.object),

};

DashCollaboratorView.defaultProps = {
  collaborators: []
};



export default ChrisStore.withStore(DashCollaboratorView);
